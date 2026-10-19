package com.civicconnect.service;

import com.civicconnect.dto.NotificationDto;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.model.Notification;
import com.civicconnect.model.User;
import com.civicconnect.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(User recipient, String recipientRole, Long complaintId,
                                           String complaintRefNo, String type, String title, String message) {
        Notification notification = new Notification(
                recipient,
                recipientRole,
                complaintId,
                complaintRefNo,
                type,
                title,
                message
        );
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsForUser(User user) {
        if (user == null) {
            throw new BadRequestException("User context is required");
        }
        List<Notification> list = notificationRepository.findForUserOrRole(user.getId(), user.getRole().name());
        return list.stream().map(NotificationDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto markAsRead(Long id, User currentUser) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        // Enforce ownership: can only read if targeted to this user or this user's role
        boolean authorized = (notif.getRecipient() != null && notif.getRecipient().getId().equals(currentUser.getId()))
                || (notif.getRecipientRole() != null && notif.getRecipientRole().equals(currentUser.getRole().name()));

        if (!authorized) {
            throw new BadRequestException("Unauthorized access to notification " + id);
        }

        notif.setRead(true);
        Notification saved = notificationRepository.save(notif);
        return NotificationDto.fromEntity(saved);
    }

    @Transactional
    public void markAllAsReadForUser(User user) {
        List<Notification> list = notificationRepository.findForUserOrRole(user.getId(), user.getRole().name());
        for (Notification n : list) {
            n.setRead(true);
        }
        notificationRepository.saveAll(list);
    }
}
