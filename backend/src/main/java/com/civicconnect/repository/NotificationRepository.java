package com.civicconnect.repository;

import com.civicconnect.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :recipientId OR n.recipientRole = :role ORDER BY n.createdAt DESC")
    List<Notification> findForUserOrRole(@Param("recipientId") Long recipientId, @Param("role") String role);

    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
}
