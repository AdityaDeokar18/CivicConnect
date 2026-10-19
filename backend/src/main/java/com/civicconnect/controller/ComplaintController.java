package com.civicconnect.controller;

import com.civicconnect.dto.*;
import com.civicconnect.model.User;
import com.civicconnect.service.AuthService;
import com.civicconnect.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final AuthService authService;

    public ComplaintController(ComplaintService complaintService, AuthService authService) {
        this.complaintService = complaintService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ComplaintDto> createComplaint(@Valid @RequestBody CreateComplaintRequest request) {
        User citizen = authService.getAuthenticatedUser();
        ComplaintDto created = complaintService.createComplaint(request, citizen);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintDto>> getMyComplaints() {
        User citizen = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.getMyComplaints(citizen));
    }

    @GetMapping("/public")
    public ResponseEntity<List<PublicComplaintDto>> getPublicComplaints() {
        return ResponseEntity.ok(complaintService.getPublicComplaints());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ComplaintDto>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDto> getComplaintById(@PathVariable Long id) {
        User currentUser = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.getComplaintById(id, currentUser));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ComplaintDto> assignComplaint(
            @PathVariable Long id,
            @Valid @RequestBody AssignComplaintRequest request) {
        User admin = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.assignComplaint(id, request, admin));
    }

    @PostMapping("/{id}/start-work")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ComplaintDto> startWork(
            @PathVariable Long id,
            @Valid @RequestBody StartWorkRequest request) {
        User officer = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.startWork(id, request, officer));
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ComplaintDto> resolveComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ResolveComplaintRequest request) {
        User officer = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.resolveComplaint(id, request, officer));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<ComplaintDto> submitFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackRequest request) {
        User citizen = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.submitFeedback(id, request, citizen));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_OFFICER')")
    public ResponseEntity<ComplaintDto> rejectComplaint(
            @PathVariable Long id,
            @Valid @RequestBody RejectComplaintRequest request) {
        User actor = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.rejectComplaint(id, request, actor));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<StatusHistoryDto>> getComplaintHistory(@PathVariable Long id) {
        User currentUser = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.getComplaintHistory(id, currentUser));
    }
}
