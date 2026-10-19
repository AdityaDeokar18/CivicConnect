package com.civicconnect.controller;

import com.civicconnect.dto.*;
import com.civicconnect.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody Map<String, Object> payload) {
        String role = (String) payload.get("role");
        if ("ROLE_OFFICER".equalsIgnoreCase(role)) {
            RegisterOfficerRequest request = new RegisterOfficerRequest();
            request.setFullName((String) payload.get("fullName"));
            request.setEmail((String) payload.get("email"));
            request.setPassword((String) payload.get("password"));
            request.setPhoneNumber((String) payload.get("phoneNumber"));
            request.setDepartment((String) payload.get("department"));
            request.setWard((String) payload.get("ward"));
            request.setBadgeNumber((String) payload.get("badgeNumber"));
            request.setDesignation((String) payload.get("designation"));
            return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerOfficer(request));
        } else {
            RegisterCitizenRequest request = new RegisterCitizenRequest();
            request.setFullName((String) payload.get("fullName"));
            request.setEmail((String) payload.get("email"));
            request.setPassword((String) payload.get("password"));
            request.setPhoneNumber((String) payload.get("phoneNumber"));
            request.setAddress((String) payload.get("address"));
            return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerCitizen(request));
        }
    }

    @PostMapping("/register/citizen")
    public ResponseEntity<AuthResponse> registerCitizen(@Valid @RequestBody RegisterCitizenRequest request) {
        AuthResponse response = authService.registerCitizen(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/officer")
    public ResponseEntity<AuthResponse> registerOfficer(@Valid @RequestBody RegisterOfficerRequest request) {
        AuthResponse response = authService.registerOfficer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUserProfile());
    }
}
