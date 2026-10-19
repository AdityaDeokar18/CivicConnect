package com.civicconnect.service;

import com.civicconnect.dto.AdminAnalyticsDto;
import com.civicconnect.dto.UserDto;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.model.ApprovalStatus;
import com.civicconnect.model.ComplaintStatus;
import com.civicconnect.model.Role;
import com.civicconnect.model.User;
import com.civicconnect.repository.ComplaintRepository;
import com.civicconnect.repository.DepartmentRepository;
import com.civicconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;

    public AdminService(UserRepository userRepository, ComplaintRepository complaintRepository,
                        DepartmentRepository departmentRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.departmentRepository = departmentRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getPendingOfficers() {
        return userRepository.findByRoleAndApprovalStatus(Role.ROLE_OFFICER, ApprovalStatus.PENDING).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> getApprovedOfficers() {
        return userRepository.findByRoleAndApprovalStatus(Role.ROLE_OFFICER, ApprovalStatus.APPROVED).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto approveOfficer(Long officerId, User admin) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + officerId));

        if (officer.getRole() != Role.ROLE_OFFICER) {
            throw new BadRequestException("User is not an officer");
        }

        officer.setApprovalStatus(ApprovalStatus.APPROVED);
        officer.setApprovedAt(Instant.now());
        officer.setRejectionReason(null);
        User saved = userRepository.save(officer);

        // Notify officer
        notificationService.createNotification(
                saved,
                null,
                null,
                null,
                "OFFICER_APPROVED",
                "Officer Registration Approved",
                "Your municipal officer registration has been approved by administrator " + admin.getFullName() + ". You can now log in and take action on assigned complaints."
        );

        return UserDto.fromEntity(saved);
    }

    @Transactional
    public UserDto rejectOfficer(Long officerId, String reason, User admin) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + officerId));

        if (officer.getRole() != Role.ROLE_OFFICER) {
            throw new BadRequestException("User is not an officer");
        }

        officer.setApprovalStatus(ApprovalStatus.REJECTED);
        officer.setRejectedAt(Instant.now());
        officer.setRejectionReason(reason != null ? reason.trim() : "Application rejected by municipal administration.");
        User saved = userRepository.save(officer);

        // Notify officer
        notificationService.createNotification(
                saved,
                null,
                null,
                null,
                "OFFICER_REJECTED",
                "Officer Registration Rejected",
                "Your officer registration request was rejected by administration. Reason: " + officer.getRejectionReason()
        );

        return UserDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsDto getAnalytics() {
        long total = complaintRepository.count();
        long pending = complaintRepository.countByStatus(ComplaintStatus.PENDING);
        long assigned = complaintRepository.countByStatus(ComplaintStatus.ASSIGNED);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);
        long closed = complaintRepository.countByStatus(ComplaintStatus.CLOSED);
        long completedTotal = resolved + closed;

        int slaComplianceRate = total > 0 ? (int) Math.round(((double) completedTotal / total) * 100) : 0;

        long totalCitizens = userRepository.countByRole(Role.ROLE_CITIZEN);
        long totalOfficers = userRepository.countByRole(Role.ROLE_OFFICER);
        long pendingOfficers = userRepository.countByRoleAndApprovalStatus(Role.ROLE_OFFICER, ApprovalStatus.PENDING);

        // Category breakdown from real DB data
        List<Object[]> categoryCounts = complaintRepository.countComplaintsByCategory();
        List<Map<String, Object>> categoryData = new ArrayList<>();
        for (Object[] row : categoryCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0] != null ? row[0] : "General");
            map.put("value", row[1]);
            categoryData.add(map);
        }

        // Status breakdown for charts
        List<Map<String, Object>> statusData = new ArrayList<>();
        statusData.add(Map.of("name", "Pending Review", "count", pending, "color", "#f59e0b"));
        statusData.add(Map.of("name", "Assigned", "count", assigned, "color", "#3b82f6"));
        statusData.add(Map.of("name", "In Progress", "count", inProgress, "color", "#8b5cf6"));
        statusData.add(Map.of("name", "Resolved", "count", resolved, "color", "#10b981"));
        statusData.add(Map.of("name", "Closed", "count", closed, "color", "#059669"));

        // Department performance from real DB data
        List<Map<String, Object>> deptPerformance = new ArrayList<>();
        departmentRepository.findAll().forEach(d -> {
            long deptTotal = complaintRepository.countByDepartment(d.getName());
            Map<String, Object> map = new HashMap<>();
            map.put("department", d.getName());
            map.put("code", d.getCode());
            map.put("total", deptTotal);
            map.put("slaHours", d.getSlaHours());
            deptPerformance.add(map);
        });

        AdminAnalyticsDto dto = new AdminAnalyticsDto();
        dto.setTotal(total);
        dto.setPending(pending);
        dto.setAssigned(assigned);
        dto.setInProgress(inProgress);
        dto.setResolved(resolved);
        dto.setClosed(closed);
        dto.setCompletedTotal(completedTotal);
        dto.setSlaComplianceRate(slaComplianceRate);
        dto.setTotalCitizens(totalCitizens);
        dto.setTotalOfficers(totalOfficers);
        dto.setPendingOfficers(pendingOfficers);
        dto.setCategoryData(categoryData);
        dto.setStatusData(statusData);
        dto.setDeptPerformance(deptPerformance);

        return dto;
    }
}
