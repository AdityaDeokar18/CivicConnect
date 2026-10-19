package com.civicconnect.dto;

import com.civicconnect.model.Notification;
import java.time.Instant;

public class NotificationDto {

    private Long id;
    private Long recipientId;
    private String recipientRole;
    private Long complaintId;
    private String complaintRefNo;
    private String type;
    private String title;
    private String message;
    private boolean isRead;
    private Instant createdAt;

    public NotificationDto() {}

    public static NotificationDto fromEntity(Notification n) {
        if (n == null) return null;
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setRecipientId(n.getRecipient() != null ? n.getRecipient().getId() : null);
        dto.setRecipientRole(n.getRecipientRole());
        dto.setComplaintId(n.getComplaintId());
        dto.setComplaintRefNo(n.getComplaintRefNo());
        dto.setType(n.getType());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientRole() {
        return recipientRole;
    }

    public void setRecipientRole(String recipientRole) {
        this.recipientRole = recipientRole;
    }

    public Long getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }

    public String getComplaintRefNo() {
        return complaintRefNo;
    }

    public void setComplaintRefNo(String complaintRefNo) {
        this.complaintRefNo = complaintRefNo;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
