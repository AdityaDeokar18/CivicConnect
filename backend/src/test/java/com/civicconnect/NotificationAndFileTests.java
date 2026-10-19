package com.civicconnect;

import com.civicconnect.model.ApprovalStatus;
import com.civicconnect.model.Notification;
import com.civicconnect.model.Role;
import com.civicconnect.model.User;
import com.civicconnect.repository.*;
import com.civicconnect.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
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
public class NotificationAndFileTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintStatusHistoryRepository historyRepository;

    private User user1;
    private String user1Token;

    private User user2;
    private String user2Token;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        complaintRepository.deleteAll();
        notificationRepository.deleteAll();
        userRepository.deleteAll();

        user1 = userRepository.save(new User("User One", "user1@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED));
        user1Token = tokenProvider.generateTokenFromUsername(user1.getEmail(), user1.getId(), user1.getRole().name());

        user2 = userRepository.save(new User("User Two", "user2@example.com", passwordEncoder.encode("Pass123"), Role.ROLE_CITIZEN, ApprovalStatus.APPROVED));
        user2Token = tokenProvider.generateTokenFromUsername(user2.getEmail(), user2.getId(), user2.getRole().name());
    }

    @Test
    void testNotificationCreation_AndRetrievalForIntendedUser() throws Exception {
        Notification n = new Notification(user1, null, 100L, "CC-100", "STATUS_UPDATED", "Status Update", "Your issue is in progress");
        notificationRepository.save(n);

        mockMvc.perform(get("/api/notifications")
                        .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Status Update")))
                .andExpect(jsonPath("$[0].read", is(false)));
    }

    @Test
    void testNotificationRecipientIsolation() throws Exception {
        // Notification for user1 should NOT be visible to user2
        Notification n = new Notification(user1, null, 100L, "CC-100", "STATUS_UPDATED", "Private Notice", "Only for User 1");
        notificationRepository.save(n);

        mockMvc.perform(get("/api/notifications")
                        .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void testMarkNotificationRead_OwnerSuccess() throws Exception {
        Notification n = new Notification(user1, null, 100L, "CC-100", "STATUS_UPDATED", "Notice", "Content");
        n = notificationRepository.save(n);

        mockMvc.perform(put("/api/notifications/" + n.getId() + "/read")
                        .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read", is(true)));

        Notification updated = notificationRepository.findById(n.getId()).orElseThrow();
        assertTrue(updated.isRead());
    }

    @Test
    void testMarkNotificationRead_NonOwnerFails() throws Exception {
        Notification n = new Notification(user1, null, 100L, "CC-100", "STATUS_UPDATED", "Notice", "Content");
        n = notificationRepository.save(n);

        mockMvc.perform(put("/api/notifications/" + n.getId() + "/read")
                        .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testFileUpload_ValidImage_ReturnsUrl() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test_pothole.jpg",
                "image/jpeg",
                "fake image content binary".getBytes()
        );

        mockMvc.perform(multipart("/api/files/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.url", startsWith("/api/files/")))
                .andExpect(jsonPath("$.url", endsWith(".jpg")));
    }

    @Test
    void testFileUpload_InvalidExtension_Fails() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "malicious_script.exe",
                "application/octet-stream",
                "binary".getBytes()
        );

        mockMvc.perform(multipart("/api/files/upload").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("not supported")));
    }

    @Test
    void testFileUpload_PathTraversal_Rejected() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "../../etc/passwd.jpg",
                "image/jpeg",
                "fake".getBytes()
        );

        mockMvc.perform(multipart("/api/files/upload").file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testFileDownload_ExistingResource_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "sample.png",
                "image/png",
                "dummy png bytes".getBytes()
        );

        String responseStr = mockMvc.perform(multipart("/api/files/upload").file(file))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Extract filename from URL
        String url = responseStr.split("\"url\":\"")[1].split("\"")[0];
        String filename = url.replace("/api/files/", "");

        mockMvc.perform(get("/api/files/" + filename))
                .andExpect(status().isOk())
                .andExpect(content().bytes("dummy png bytes".getBytes()));
    }
}
