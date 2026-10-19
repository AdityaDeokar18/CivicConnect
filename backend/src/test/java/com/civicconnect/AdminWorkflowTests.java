package com.civicconnect;

import com.civicconnect.bootstrap.AdminBootstrapRunner;
import com.civicconnect.dto.AssignComplaintRequest;
import com.civicconnect.model.*;
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

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class AdminWorkflowTests {

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

    @Autowired
    private AdminBootstrapRunner bootstrapRunner;

    private User adminUser;
    private String adminToken;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        complaintRepository.deleteAll();
        notificationRepository.deleteAll();
        userRepository.deleteAll();

        adminUser = new User("Municipal Administrator", "admin@civicconnect.gov.in", passwordEncoder.encode("AdminPass123"), Role.ROLE_ADMIN, ApprovalStatus.APPROVED);
        adminUser = userRepository.save(adminUser);
        adminToken = tokenProvider.generateTokenFromUsername(adminUser.getEmail(), adminUser.getId(), adminUser.getRole().name());
    }

    @Test
    void testAdminBootstrap_CreatesFirstAdmin_Idempotent() {
        // Run bootstrap when admin already exists
        long countBefore = userRepository.countByRole(Role.ROLE_ADMIN);
        bootstrapRunner.run();
        long countAfter = userRepository.countByRole(Role.ROLE_ADMIN);

        assertEquals(countBefore, countAfter, "Bootstrap runner must not duplicate admin account when one already exists");
    }

    @Test
    void testGetPendingOfficers_AsAdmin_Success() throws Exception {
        User pendingOfficer = new User("Officer Suresh", "suresh@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_OFFICER, ApprovalStatus.PENDING);
        userRepository.save(pendingOfficer);

        mockMvc.perform(get("/api/admin/officers/pending")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].email", is("suresh@example.com")))
                .andExpect(jsonPath("$[0].approvalStatus", is("PENDING")));
    }

    @Test
    void testApproveOfficer_AsAdmin_UpdatesStatusAndNotifies() throws Exception {
        User pendingOfficer = new User("Officer Rajesh", "rajesh@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_OFFICER, ApprovalStatus.PENDING);
        pendingOfficer = userRepository.save(pendingOfficer);

        mockMvc.perform(put("/api/admin/officers/" + pendingOfficer.getId() + "/approve")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approvalStatus", is("APPROVED")))
                .andExpect(jsonPath("$.approvedAt", notNullValue()));

        User updated = userRepository.findById(pendingOfficer.getId()).orElseThrow();
        assertEquals(ApprovalStatus.APPROVED, updated.getApprovalStatus());

        // Check notification for officer
        assertFalse(notificationRepository.findAll().isEmpty());
    }

    @Test
    void testRejectOfficer_AsAdmin_UpdatesStatusAndReason() throws Exception {
        User pendingOfficer = new User("Officer Vikas", "vikas@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_OFFICER, ApprovalStatus.PENDING);
        pendingOfficer = userRepository.save(pendingOfficer);

        mockMvc.perform(put("/api/admin/officers/" + pendingOfficer.getId() + "/reject")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("reason", "Incomplete verification credentials"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approvalStatus", is("REJECTED")))
                .andExpect(jsonPath("$.rejectionReason", containsString("Incomplete verification")));

        User updated = userRepository.findById(pendingOfficer.getId()).orElseThrow();
        assertEquals(ApprovalStatus.REJECTED, updated.getApprovalStatus());
    }

    @Test
    void testNonAdminAccessingAdminEndpoints_Forbidden() throws Exception {
        User citizen = new User("Citizen Ramesh", "ramesh@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        citizen = userRepository.save(citizen);
        String citizenToken = tokenProvider.generateTokenFromUsername(citizen.getEmail(), citizen.getId(), citizen.getRole().name());

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAssignComplaint_ToApprovedOfficer_Success() throws Exception {
        User citizen = new User("Citizen Amit", "amit@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        citizen = userRepository.save(citizen);

        User officer = new User("Officer Nilesh", "nilesh@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_OFFICER, ApprovalStatus.APPROVED);
        officer = userRepository.save(officer);

        Complaint complaint = new Complaint();
        complaint.setComplaintRefNo("CC-20261019-0001");
        complaint.setTitle("Broken Water Pipe");
        complaint.setDescription("Water leaking profusely in Kothrud");
        complaint.setCategory("Main Water Pipe Burst");
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setDepartment("Water Supply & Drainage");
        complaint.setCitizen(citizen);
        complaint = complaintRepository.save(complaint);

        AssignComplaintRequest assignReq = new AssignComplaintRequest();
        assignReq.setOfficerId(officer.getId());
        assignReq.setDepartment("Water Supply & Drainage");
        assignReq.setRemarks("Please inspect urgently within 24 hours");

        mockMvc.perform(put("/api/complaints/" + complaint.getId() + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("ASSIGNED")))
                .andExpect(jsonPath("$.assignedOfficer.id", is(officer.getId().intValue())))
                .andExpect(jsonPath("$.assignedByAdmin", is("Municipal Administrator")));

        Complaint updated = complaintRepository.findById(complaint.getId()).orElseThrow();
        assertEquals(ComplaintStatus.ASSIGNED, updated.getStatus());
        assertEquals(officer.getId(), updated.getAssignedOfficer().getId());
    }

    @Test
    void testAssignComplaint_ToPendingOfficer_Fails() throws Exception {
        User citizen = new User("Citizen Anita", "anita@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        citizen = userRepository.save(citizen);

        User pendingOfficer = new User("Pending Officer", "pending@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_OFFICER, ApprovalStatus.PENDING);
        pendingOfficer = userRepository.save(pendingOfficer);

        Complaint complaint = new Complaint();
        complaint.setComplaintRefNo("CC-20261019-0002");
        complaint.setTitle("Overflowing Garbage");
        complaint.setDescription("Bin overflow at Deccan Gymkhana");
        complaint.setCategory("Overflowing Garbage Bin");
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setCitizen(citizen);
        complaint = complaintRepository.save(complaint);

        AssignComplaintRequest assignReq = new AssignComplaintRequest();
        assignReq.setOfficerId(pendingOfficer.getId());

        mockMvc.perform(put("/api/complaints/" + complaint.getId() + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Officer must be APPROVED")));
    }

    @Test
    void testAssignComplaint_ToNonExistentOfficer_Fails() throws Exception {
        User citizen = new User("Citizen Anita", "anita2@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        citizen = userRepository.save(citizen);

        Complaint complaint = new Complaint();
        complaint.setComplaintRefNo("CC-20261019-0003");
        complaint.setTitle("Street Light Damaged");
        complaint.setDescription("Light pole hit by car");
        complaint.setCategory("Defunct Street Light");
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setCitizen(citizen);
        complaint = complaintRepository.save(complaint);

        AssignComplaintRequest assignReq = new AssignComplaintRequest();
        assignReq.setOfficerId(99999L);

        mockMvc.perform(put("/api/complaints/" + complaint.getId() + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAdminAnalytics_CalculatesRealMetrics() throws Exception {
        User citizen = new User("Citizen User", "c@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED);
        citizen = userRepository.save(citizen);

        Complaint c1 = new Complaint();
        c1.setComplaintRefNo("CC-001");
        c1.setTitle("Pothole");
        c1.setDescription("Deep pothole");
        c1.setCategory("Pothole Hazard");
        c1.setStatus(ComplaintStatus.PENDING);
        c1.setCitizen(citizen);
        complaintRepository.save(c1);

        Complaint c2 = new Complaint();
        c2.setComplaintRefNo("CC-002");
        c2.setTitle("Wire");
        c2.setDescription("Hanging wire");
        c2.setCategory("Exposed Wire Hazard");
        c2.setStatus(ComplaintStatus.RESOLVED);
        c2.setCitizen(citizen);
        complaintRepository.save(c2);

        mockMvc.perform(get("/api/admin/analytics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total", is(2)))
                .andExpect(jsonPath("$.pending", is(1)))
                .andExpect(jsonPath("$.resolved", is(1)))
                .andExpect(jsonPath("$.completedTotal", is(1)))
                .andExpect(jsonPath("$.slaComplianceRate", is(50)))
                .andExpect(jsonPath("$.categoryData", hasSize(greaterThanOrEqualTo(2))));
    }
}
