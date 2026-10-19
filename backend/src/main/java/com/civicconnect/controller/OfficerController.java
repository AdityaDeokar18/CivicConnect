package com.civicconnect.controller;

import com.civicconnect.dto.ComplaintDto;
import com.civicconnect.model.ComplaintStatus;
import com.civicconnect.model.User;
import com.civicconnect.service.AuthService;
import com.civicconnect.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasAuthority('ROLE_OFFICER')")
public class OfficerController {

    private final ComplaintService complaintService;
    private final AuthService authService;

    public OfficerController(ComplaintService complaintService, AuthService authService) {
        this.complaintService = complaintService;
        this.authService = authService;
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintDto>> getOfficerComplaints() {
        User officer = authService.getAuthenticatedUser();
        return ResponseEntity.ok(complaintService.getOfficerComplaints(officer));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOfficerStats() {
        User officer = authService.getAuthenticatedUser();
        List<ComplaintDto> complaints = complaintService.getOfficerComplaints(officer);

        long total = complaints.size();
        long pendingAction = complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.ASSIGNED).count();
        long inProgress = complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.IN_PROGRESS).count();
        long resolved = complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("pendingAction", pendingAction);
        stats.put("inProgress", inProgress);
        stats.put("resolved", resolved);
        stats.put("recentComplaints", complaints.stream().limit(5).toList());

        return ResponseEntity.ok(stats);
    }
}
