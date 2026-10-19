package com.civicconnect.bootstrap;

import com.civicconnect.model.ApprovalStatus;
import com.civicconnect.model.Role;
import com.civicconnect.model.User;
import com.civicconnect.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@Order(1)
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.bootstrap.email:}")
    private String adminEmail;

    @Value("${app.admin.bootstrap.password:}")
    private String adminPassword;

    @Value("${app.admin.bootstrap.name:Municipal Administrator}")
    private String adminName;

    public AdminBootstrapRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Check if an administrator already exists in the system
        long adminCount = userRepository.countByRole(Role.ROLE_ADMIN);
        if (adminCount > 0) {
            logger.info("Administrator account already exists in database (count={}). Skipping bootstrap creation.", adminCount);
            return;
        }

        // If no admin exists, check if bootstrap credentials were provided via environment variables / configuration
        if (!StringUtils.hasText(adminEmail) || !StringUtils.hasText(adminPassword)) {
            logger.warn("No administrator account found and ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD environment variables are not set. "
                    + "Please configure them to bootstrap your initial municipal administrator.");
            return;
        }

        String cleanEmail = adminEmail.trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            logger.warn("A user with email {} already exists with non-admin role. Admin bootstrap aborted.", cleanEmail);
            return;
        }

        User admin = new User();
        admin.setFullName(adminName);
        admin.setEmail(cleanEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ROLE_ADMIN);
        admin.setApprovalStatus(ApprovalStatus.APPROVED);
        admin.setDesignation("Central Administrative Authority");
        admin.setDepartment("Municipal Administration");
        admin.setBadgeNumber("MUNI-ADM-001");
        admin.setPhoneNumber("+91 1800 11 2484");

        userRepository.save(admin);
        logger.info("First municipal administrator successfully bootstrapped for email: {}", cleanEmail);
    }
}
