package com.civicconnect.controller;

import com.civicconnect.dto.AdminAnalyticsDto;
import com.civicconnect.dto.DepartmentDto;
import com.civicconnect.dto.UserDto;
import com.civicconnect.model.User;
import com.civicconnect.service.AdminService;
import com.civicconnect.service.AuthService;
import com.civicconnect.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;
    private final DepartmentService departmentService;

    public AdminController(AdminService adminService, AuthService authService, DepartmentService departmentService) {
        this.adminService = adminService;
        this.authService = authService;
        this.departmentService = departmentService;
    }

    @GetMapping("/officers/pending")
    public ResponseEntity<List<UserDto>> getPendingOfficers() {
        return ResponseEntity.ok(adminService.getPendingOfficers());
    }

    @GetMapping("/officers")
    public ResponseEntity<List<UserDto>> getApprovedOfficers() {
        return ResponseEntity.ok(adminService.getApprovedOfficers());
    }

    @PutMapping("/officers/{id}/approve")
    public ResponseEntity<UserDto> approveOfficer(@PathVariable Long id) {
        User admin = authService.getAuthenticatedUser();
        return ResponseEntity.ok(adminService.approveOfficer(id, admin));
    }

    @PutMapping("/officers/{id}/reject")
    public ResponseEntity<UserDto> rejectOfficer(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        User admin = authService.getAuthenticatedUser();
        String reason = body != null ? body.get("reason") : "Rejected by Municipal Administration";
        return ResponseEntity.ok(adminService.rejectOfficer(id, reason, admin));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDto>> getDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.createDepartment(request));
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
