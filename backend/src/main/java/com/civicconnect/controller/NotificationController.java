package com.civicconnect.controller;

import com.civicconnect.dto.NotificationDto;
import com.civicconnect.model.User;
import com.civicconnect.service.AuthService;
import com.civicconnect.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        User currentUser = authService.getAuthenticatedUser();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUser));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long id) {
        User currentUser = authService.getAuthenticatedUser();
        return ResponseEntity.ok(notificationService.markAsRead(id, currentUser));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead() {
        User currentUser = authService.getAuthenticatedUser();
        notificationService.markAllAsReadForUser(currentUser);
        return ResponseEntity.ok(Map.of("success", true, "message", "All notifications marked as read"));
    }
}
