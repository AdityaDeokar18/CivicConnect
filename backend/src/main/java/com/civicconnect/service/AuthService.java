package com.civicconnect.service;

import com.civicconnect.dto.*;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.exception.UnauthorizedException;
import com.civicconnect.model.ApprovalStatus;
import com.civicconnect.model.Role;
import com.civicconnect.model.User;
import com.civicconnect.repository.UserRepository;
import com.civicconnect.security.JwtTokenProvider;
import com.civicconnect.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
    }

    @Transactional
    public AuthResponse registerCitizen(RegisterCitizenRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new BadRequestException("An account with this email address already exists. Please log in.");
        }

        User citizen = new User();
        citizen.setFullName(request.getFullName().trim());
        citizen.setEmail(cleanEmail);
        citizen.setPassword(passwordEncoder.encode(request.getPassword()));
        citizen.setRole(Role.ROLE_CITIZEN);
        citizen.setApprovalStatus(ApprovalStatus.APPROVED);
        citizen.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        citizen.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);

        User saved = userRepository.save(citizen);
        UserDto userDto = UserDto.fromEntity(saved);

        String token = tokenProvider.generateTokenFromUsername(saved.getEmail(), saved.getId(), saved.getRole().name());
        return AuthResponse.success(token, userDto, "Citizen registered successfully");
    }

    @Transactional
    public AuthResponse registerOfficer(RegisterOfficerRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new BadRequestException("An account with this email address already exists. Please log in.");
        }

        User officer = new User();
        officer.setFullName(request.getFullName().trim());
        officer.setEmail(cleanEmail);
        officer.setPassword(passwordEncoder.encode(request.getPassword()));
        officer.setRole(Role.ROLE_OFFICER);
        officer.setApprovalStatus(ApprovalStatus.PENDING); // MUST be PENDING until approved by Admin
        officer.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        officer.setDepartment(request.getDepartment() != null ? request.getDepartment().trim() : "Road Maintenance & Potholes");
        officer.setWard(request.getWard() != null ? request.getWard().trim() : "Ward 1");
        officer.setBadgeNumber(request.getBadgeNumber() != null ? request.getBadgeNumber().trim() : "OFF-" + System.currentTimeMillis() % 10000);
        officer.setDesignation(request.getDesignation() != null ? request.getDesignation().trim() : "Field Engineer");

        User saved = userRepository.save(officer);
        UserDto userDto = UserDto.fromEntity(saved);

        // Notify Administrator of new pending registration
        notificationService.createNotification(
                null,
                "ROLE_ADMIN",
                null,
                null,
                "OFFICER_REGISTRATION",
                "New Officer Registration Pending Approval",
                "Officer " + saved.getFullName() + " (" + saved.getDepartment() + ") has registered and awaits administrative verification."
        );

        AuthResponse response = AuthResponse.pending(
                "Officer registration submitted successfully. Your account is PENDING administrative approval before access is granted."
        );
        response.setUser(userDto);
        return response;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new UnauthorizedException("No account found with this email address. Please register first."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid password. Please check your credentials.");
        }

        // Expected role check
        if (StringUtils.hasText(request.getExpectedRole())) {
            String expected = request.getExpectedRole().trim();
            if (!user.getRole().name().equalsIgnoreCase(expected)) {
                if ("ROLE_CITIZEN".equalsIgnoreCase(expected) && user.getRole() == Role.ROLE_OFFICER) {
                    throw new BadRequestException("This is an Officer account. Please use the Officer Login portal.");
                }
                if ("ROLE_OFFICER".equalsIgnoreCase(expected) && user.getRole() == Role.ROLE_CITIZEN) {
                    throw new BadRequestException("This is a Citizen account. Please use Citizen Login.");
                }
                if ("ROLE_ADMIN".equalsIgnoreCase(expected) && user.getRole() != Role.ROLE_ADMIN) {
                    throw new BadRequestException("Access denied. Account does not have administrative privileges.");
                }
            }
        }

        // Officer approval check
        if (user.getRole() == Role.ROLE_OFFICER) {
            if (user.getApprovalStatus() == ApprovalStatus.PENDING) {
                return AuthResponse.pending("Your officer account registration is PENDING Administrative approval. You will be able to log in once an Administrator verifies and approves your account.");
            }
            if (user.getApprovalStatus() == ApprovalStatus.REJECTED) {
                return AuthResponse.rejected("Your officer account registration request was REJECTED by Municipal Administration. Contact support@civicconnect.gov.in for clarification.");
            }
        }

        String token = tokenProvider.generateTokenFromUsername(user.getEmail(), user.getId(), user.getRole().name());
        UserDto userDto = UserDto.fromEntity(user);
        return AuthResponse.success(token, userDto, "Login successful");
    }

    @Transactional(readOnly = true)
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new UnauthorizedException("User is not authenticated");
        }
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found in database"));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserProfile() {
        return UserDto.fromEntity(getAuthenticatedUser());
    }
}
