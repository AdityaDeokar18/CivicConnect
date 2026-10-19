package com.civicconnect.repository;

import com.civicconnect.model.ApprovalStatus;
import com.civicconnect.model.Role;
import com.civicconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndApprovalStatus(Role role, ApprovalStatus approvalStatus);

    long countByRole(Role role);

    long countByRoleAndApprovalStatus(Role role, ApprovalStatus approvalStatus);
}
