package com.civicconnect;

import com.civicconnect.dto.AuthResponse;
import com.civicconnect.dto.LoginRequest;
import com.civicconnect.dto.RegisterCitizenRequest;
import com.civicconnect.dto.RegisterOfficerRequest;
import com.civicconnect.model.ApprovalStatus;
import com.civicconnect.model.Role;
import com.civicconnect.model.User;
import com.civicconnect.repository.*;
import com.civicconnect.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class AuthWorkflowTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintStatusHistoryRepository historyRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        complaintRepository.deleteAll();
        notificationRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testRegisterCitizen_Success() throws Exception {
        RegisterCitizenRequest req = new RegisterCitizenRequest();
        req.setFullName("Rahul Sharma");
        req.setEmail("rahul.sharma@example.com");
        req.setPassword("SecurePass@123");
        req.setPhoneNumber("9876543210");
        req.setAddress("Shivajinagar, Pune");

        mockMvc.perform(post("/api/auth/register/citizen")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email", is("rahul.sharma@example.com")))
                .andExpect(jsonPath("$.user.role", is("ROLE_CITIZEN")))
                .andExpect(jsonPath("$.user.approvalStatus", is("APPROVED")));

        assertTrue(userRepository.existsByEmail("rahul.sharma@example.com"));
    }

    @Test
    void testRegisterCitizen_DuplicateEmail_Fails() throws Exception {
        User citizen = new User("Existing User", "existing@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        userRepository.save(citizen);

        RegisterCitizenRequest req = new RegisterCitizenRequest();
        req.setFullName("Another Person");
        req.setEmail("existing@example.com");
        req.setPassword("Password123");

        mockMvc.perform(post("/api/auth/register/citizen")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    void testRegisterOfficer_StatusIsPending() throws Exception {
        RegisterOfficerRequest req = new RegisterOfficerRequest();
        req.setFullName("Inspector Jadhav");
        req.setEmail("jadhav@civicconnect.gov.in");
        req.setPassword("OfficerPass@123");
        req.setDepartment("Road Maintenance & Potholes");
        req.setWard("Ward 4");
        req.setBadgeNumber("OFF-789");
        req.setDesignation("Executive Road Engineer");

        mockMvc.perform(post("/api/auth/register/officer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.pending", is(true)))
                .andExpect(jsonPath("$.user.approvalStatus", is("PENDING")))
                .andExpect(jsonPath("$.user.role", is("ROLE_OFFICER")));

        User saved = userRepository.findByEmail("jadhav@civicconnect.gov.in").orElseThrow();
        assertEquals(ApprovalStatus.PENDING, saved.getApprovalStatus());
    }

    @Test
    void testRegisterOfficer_DuplicateEmail_Fails() throws Exception {
        User officer = new User("Officer 1", "officer1@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_OFFICER, ApprovalStatus.PENDING);
        userRepository.save(officer);

        RegisterOfficerRequest req = new RegisterOfficerRequest();
        req.setFullName("Officer 2");
        req.setEmail("officer1@example.com");
        req.setPassword("Pass12345");

        mockMvc.perform(post("/api/auth/register/officer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginCitizen_Success() throws Exception {
        User citizen = new User("Pooja Patil", "pooja@example.com", passwordEncoder.encode("Password@123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        userRepository.save(citizen);

        LoginRequest loginReq = new LoginRequest("pooja@example.com", "Password@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email", is("pooja@example.com")));
    }

    @Test
    void testLoginCitizen_WrongPassword_Fails() throws Exception {
        User citizen = new User("Pooja Patil", "pooja@example.com", passwordEncoder.encode("Password@123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        userRepository.save(citizen);

        LoginRequest loginReq = new LoginRequest("pooja@example.com", "WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", containsString("Invalid password")));
    }

    @Test
    void testLoginCitizen_NonexistentUser_Fails() throws Exception {
        LoginRequest loginReq = new LoginRequest("nonexistent@example.com", "Password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", containsString("No account found")));
    }

    @Test
    void testLoginOfficer_WhenPending_ReturnsPendingResponse() throws Exception {
        User pendingOfficer = new User("Pending Officer", "pending.officer@example.com", passwordEncoder.encode("SecretPass123"), Role.ROLE_OFFICER, ApprovalStatus.PENDING);
        userRepository.save(pendingOfficer);

        LoginRequest loginReq = new LoginRequest("pending.officer@example.com", "SecretPass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.pending", is(true)))
                .andExpect(jsonPath("$.message", containsString("PENDING Administrative approval")));
    }

    @Test
    void testLoginOfficer_WhenRejected_ReturnsRejectedResponse() throws Exception {
        User rejectedOfficer = new User("Rejected Officer", "rejected.officer@example.com", passwordEncoder.encode("SecretPass123"), Role.ROLE_OFFICER, ApprovalStatus.REJECTED);
        userRepository.save(rejectedOfficer);

        LoginRequest loginReq = new LoginRequest("rejected.officer@example.com", "SecretPass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.rejected", is(true)))
                .andExpect(jsonPath("$.message", containsString("REJECTED by Municipal Administration")));
    }

    @Test
    void testLoginOfficer_WhenApproved_Success() throws Exception {
        User approvedOfficer = new User("Approved Officer", "approved.officer@example.com", passwordEncoder.encode("SecretPass123"), Role.ROLE_OFFICER, ApprovalStatus.APPROVED);
        userRepository.save(approvedOfficer);

        LoginRequest loginReq = new LoginRequest("approved.officer@example.com", "SecretPass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.role", is("ROLE_OFFICER")));
    }

    @Test
    void testRoleRestriction_CitizenLoggingIntoOfficerPortal() throws Exception {
        User citizen = new User("Citizen User", "citizen@example.com", passwordEncoder.encode("Password123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        userRepository.save(citizen);

        LoginRequest loginReq = new LoginRequest("citizen@example.com", "Password123");
        loginReq.setExpectedRole("ROLE_OFFICER");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("This is a Citizen account. Please use Citizen Login.")));
    }

    @Test
    void testRoleRestriction_OfficerLoggingIntoCitizenPortal() throws Exception {
        User officer = new User("Officer User", "officer@example.com", passwordEncoder.encode("Password123"), Role.ROLE_OFFICER, ApprovalStatus.APPROVED);
        userRepository.save(officer);

        LoginRequest loginReq = new LoginRequest("officer@example.com", "Password123");
        loginReq.setExpectedRole("ROLE_CITIZEN");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("This is an Officer account. Please use the Officer Login portal.")));
    }

    @Test
    void testGetCurrentUserProfile_Authenticated() throws Exception {
        User citizen = new User("Neha Deshmukh", "neha@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        User saved = userRepository.save(citizen);

        String token = tokenProvider.generateTokenFromUsername(saved.getEmail(), saved.getId(), saved.getRole().name());

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("neha@example.com")))
                .andExpect(jsonPath("$.fullName", is("Neha Deshmukh")))
                .andExpect(jsonPath("$.role", is("ROLE_CITIZEN")));
    }

    @Test
    void testGetCurrentUserProfile_Unauthenticated_Fails() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
