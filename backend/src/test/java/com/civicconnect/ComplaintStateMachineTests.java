package com.civicconnect;

import com.civicconnect.dto.*;
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

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class ComplaintStateMachineTests {

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

    private User citizen1;
    private String citizen1Token;

    private User citizen2;
    private String citizen2Token;

    private User officer1;
    private String officer1Token;

    private User officer2;
    private String officer2Token;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        complaintRepository.deleteAll();
        notificationRepository.deleteAll();
        userRepository.deleteAll();

        citizen1 = userRepository.save(new User("Citizen One", "citizen1@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED));
        citizen1Token = tokenProvider.generateTokenFromUsername(citizen1.getEmail(), citizen1.getId(), citizen1.getRole().name());

        citizen2 = userRepository.save(new User("Citizen Two", "citizen2@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED));
        citizen2Token = tokenProvider.generateTokenFromUsername(citizen2.getEmail(), citizen2.getId(), citizen2.getRole().name());

        officer1 = userRepository.save(new User("Officer One", "officer1@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_OFFICER, ApprovalStatus.APPROVED));
        officer1.setDepartment("Road Maintenance & Potholes");
        officer1 = userRepository.save(officer1);
        officer1Token = tokenProvider.generateTokenFromUsername(officer1.getEmail(), officer1.getId(), officer1.getRole().name());

        officer2 = userRepository.save(new User("Officer Two", "officer2@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_OFFICER, ApprovalStatus.APPROVED));
        officer2.setDepartment("Solid Waste Management");
        officer2 = userRepository.save(officer2);
        officer2Token = tokenProvider.generateTokenFromUsername(officer2.getEmail(), officer2.getId(), officer2.getRole().name());
    }

    @Test
    void testCreateComplaint_AsCitizen_SavedWithPendingStatusAndHistory() throws Exception {
        CreateComplaintRequest req = new CreateComplaintRequest();
        req.setTitle("Dangerous Open Pothole");
        req.setDescription("Large pothole near main chowk, risking biker accidents");
        req.setCategory("Pothole Hazard");
        req.setLocation("Baner Road, Ward 2");
        req.setPriority(Priority.HIGH);
        req.setPhotoUrl("/api/files/sample_pothole.jpg");

        mockMvc.perform(post("/api/complaints")
                        .header("Authorization", "Bearer " + citizen1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.complaintRefNo", startsWith("CC-")))
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.citizenId", is(citizen1.getId().intValue())))
                .andExpect(jsonPath("$.priority", is("HIGH")));

        assertEquals(1, complaintRepository.count());
        Complaint saved = complaintRepository.findAll().get(0);
        assertEquals(ComplaintStatus.PENDING, saved.getStatus());

        // Check history audit record
        assertEquals(1, historyRepository.findByComplaintIdOrderByTimestampAsc(saved.getId()).size());
    }

    @Test
    void testCreateComplaint_WithInvalidData_Fails() throws Exception {
        CreateComplaintRequest req = new CreateComplaintRequest();
        req.setTitle(""); // blank title

        mockMvc.perform(post("/api/complaints")
                        .header("Authorization", "Bearer " + citizen1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.title", notNullValue()));
    }

    @Test
    void testGetComplaintById_OwnerCitizen_Success() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.PENDING, null);

        mockMvc.perform(get("/api/complaints/" + c.getId())
                        .header("Authorization", "Bearer " + citizen1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(c.getId().intValue())))
                .andExpect(jsonPath("$.citizenEmail", is("citizen1@example.com")));
    }

    @Test
    void testGetComplaintById_OtherCitizen_Forbidden() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.PENDING, null);

        mockMvc.perform(get("/api/complaints/" + c.getId())
                        .header("Authorization", "Bearer " + citizen2Token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", containsString("not authorized to view another citizen's complaint")));
    }

    @Test
    void testGetComplaintById_AssignedOfficer_Success() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.ASSIGNED, officer1);

        mockMvc.perform(get("/api/complaints/" + c.getId())
                        .header("Authorization", "Bearer " + officer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(c.getId().intValue())));
    }

    @Test
    void testGetComplaintById_UnassignedOfficer_Forbidden() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.ASSIGNED, officer1);

        mockMvc.perform(get("/api/complaints/" + c.getId())
                        .header("Authorization", "Bearer " + officer2Token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testTransition_AssignedToInProgress_WithProof_Success() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.ASSIGNED, officer1);

        StartWorkRequest req = new StartWorkRequest("/api/files/inspection_proof_123.jpg", "On-site assessment complete. Road crew mobilized.");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/start-work")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("IN_PROGRESS")))
                .andExpect(jsonPath("$.inspectionProofUrl", is("/api/files/inspection_proof_123.jpg")))
                .andExpect(jsonPath("$.inspectedAt", notNullValue()));

        Complaint updated = complaintRepository.findById(c.getId()).orElseThrow();
        assertEquals(ComplaintStatus.IN_PROGRESS, updated.getStatus());
    }

    @Test
    void testTransition_AssignedToInProgress_WithoutProof_Fails() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.ASSIGNED, officer1);

        StartWorkRequest req = new StartWorkRequest("", "No proof attached");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/start-work")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testTransition_PendingDirectToInProgress_Fails() throws Exception {
        // Cannot jump directly from PENDING to IN_PROGRESS
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.PENDING, officer1);

        StartWorkRequest req = new StartWorkRequest("/api/files/proof.jpg", "Trying to jump status");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/start-work")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("must be in ASSIGNED status")));
    }

    @Test
    void testTransition_PendingDirectToResolved_Fails() throws Exception {
        // Cannot jump directly from PENDING to RESOLVED
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.PENDING, officer1);

        ResolveComplaintRequest req = new ResolveComplaintRequest("/api/files/proof.jpg", "Premature resolution");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/resolve")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("must be in IN_PROGRESS status")));
    }

    @Test
    void testTransition_InProgressToResolved_WithProofAndNotes_Success() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.IN_PROGRESS, officer1);
        c.setInspectionProofUrl("/api/files/insp.jpg");
        c = complaintRepository.save(c);

        ResolveComplaintRequest req = new ResolveComplaintRequest(
                "/api/files/resolved_asphalt_photo.jpg",
                "Asphalt patched, rolled, and sealed. Road reopened to traffic."
        );

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/resolve")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("RESOLVED")))
                .andExpect(jsonPath("$.resolutionProofUrl", is("/api/files/resolved_asphalt_photo.jpg")))
                .andExpect(jsonPath("$.resolvedAt", notNullValue()));

        Complaint updated = complaintRepository.findById(c.getId()).orElseThrow();
        assertEquals(ComplaintStatus.RESOLVED, updated.getStatus());
    }

    @Test
    void testTransition_InProgressToResolved_WithoutProof_Fails() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.IN_PROGRESS, officer1);

        ResolveComplaintRequest req = new ResolveComplaintRequest("", "Missing resolution photo proof");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/resolve")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testTransition_InProgressToResolved_WithoutNotes_Fails() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.IN_PROGRESS, officer1);

        ResolveComplaintRequest req = new ResolveComplaintRequest("/api/files/proof.jpg", "");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/resolve")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testTransition_ResolvedToClosed_CitizenFeedback_Success() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.RESOLVED, officer1);
        c.setResolutionProofUrl("/api/files/resolved.jpg");
        c = complaintRepository.save(c);

        FeedbackRequest req = new FeedbackRequest(5, "Excellent and swift repair! Thank you PMC.");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/feedback")
                        .header("Authorization", "Bearer " + citizen1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CLOSED")))
                .andExpect(jsonPath("$.rating", is(5)))
                .andExpect(jsonPath("$.feedbackComments", containsString("Excellent")))
                .andExpect(jsonPath("$.closedAt", notNullValue()));

        Complaint updated = complaintRepository.findById(c.getId()).orElseThrow();
        assertEquals(ComplaintStatus.CLOSED, updated.getStatus());
        assertEquals(5, updated.getRating());
    }

    @Test
    void testTransition_ResolvedToClosed_NonOwnerFeedback_Forbidden() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.RESOLVED, officer1);

        FeedbackRequest req = new FeedbackRequest(4, "Impersonating citizen");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/feedback")
                        .header("Authorization", "Bearer " + citizen2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", containsString("Only the citizen who lodged this complaint can submit feedback")));
    }

    @Test
    void testTransition_NonResolvedFeedback_Fails() throws Exception {
        // Cannot rate pending or in_progress complaint
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.IN_PROGRESS, officer1);

        FeedbackRequest req = new FeedbackRequest(5, "Premature feedback");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/feedback")
                        .header("Authorization", "Bearer " + citizen1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("can only be submitted for RESOLVED complaints")));
    }

    @Test
    void testTransition_DuplicateFeedback_Fails() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.RESOLVED, officer1);
        c.setRating(4); // already rated
        c = complaintRepository.save(c);

        FeedbackRequest req = new FeedbackRequest(5, "Second attempt to rate");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/feedback")
                        .header("Authorization", "Bearer " + citizen1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("already been submitted")));
    }

    @Test
    void testRejectComplaint_FromPending_Success() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.PENDING, null);

        RejectComplaintRequest req = new RejectComplaintRequest("Duplicate report of already registered incident #1234");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/reject")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("REJECTED")))
                .andExpect(jsonPath("$.rejectionReason", containsString("Duplicate report")));

        Complaint updated = complaintRepository.findById(c.getId()).orElseThrow();
        assertEquals(ComplaintStatus.REJECTED, updated.getStatus());
    }

    @Test
    void testRejectComplaint_FromClosed_Fails() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.CLOSED, officer1);

        RejectComplaintRequest req = new RejectComplaintRequest("Cannot reject after closed");

        mockMvc.perform(post("/api/complaints/" + c.getId() + "/reject")
                        .header("Authorization", "Bearer " + officer1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetComplaintHistory_ContainsFullAuditTrail() throws Exception {
        Complaint c = createTestComplaint(citizen1, ComplaintStatus.PENDING, null);

        // Add history entry
        ComplaintStatusHistory h1 = new ComplaintStatusHistory(c, null, ComplaintStatus.PENDING, citizen1.getFullName(), "ROLE_CITIZEN", citizen1.getEmail(), "Lodged", null);
        ComplaintStatusHistory h2 = new ComplaintStatusHistory(c, ComplaintStatus.PENDING, ComplaintStatus.ASSIGNED, "Admin", "ROLE_ADMIN", "admin@civic.gov", "Assigned", null);
        historyRepository.save(h1);
        historyRepository.save(h2);

        mockMvc.perform(get("/api/complaints/" + c.getId() + "/history")
                        .header("Authorization", "Bearer " + citizen1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].newStatus", is("PENDING")))
                .andExpect(jsonPath("$[1].newStatus", is("ASSIGNED")));
    }

    private Complaint createTestComplaint(User citizen, ComplaintStatus status, User assignedOfficer) {
        Complaint c = new Complaint();
        c.setComplaintRefNo("CC-" + System.currentTimeMillis() % 100000);
        c.setTitle("Test Complaint " + status);
        c.setDescription("Description for testing complaint transitions");
        c.setCategory("Pothole Hazard");
        c.setStatus(status);
        c.setDepartment("Road Maintenance & Potholes");
        c.setCitizen(citizen);
        c.setAssignedOfficer(assignedOfficer);
        return complaintRepository.save(c);
    }
}
