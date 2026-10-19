package com.civicconnect.dto;

import com.civicconnect.model.ComplaintStatus;
import com.civicconnect.model.ComplaintStatusHistory;
import java.time.Instant;

public class StatusHistoryDto {

    private Long id;
    private Long complaintId;
    private ComplaintStatus previousStatus;
    private ComplaintStatus newStatus;
    private String actorName;
    private String actorRole;
    private String remarks;
    private String proofUrl;
    private Instant timestamp;

    public StatusHistoryDto() {}

    public static StatusHistoryDto fromEntity(ComplaintStatusHistory history) {
        if (history == null) return null;
        StatusHistoryDto dto = new StatusHistoryDto();
        dto.setId(history.getId());
        dto.setComplaintId(history.getComplaint() != null ? history.getComplaint().getId() : null);
        dto.setPreviousStatus(history.getPreviousStatus());
        dto.setNewStatus(history.getNewStatus());
        dto.setActorName(history.getActorName());
        dto.setActorRole(history.getActorRole());
        dto.setRemarks(history.getRemarks());
        dto.setProofUrl(history.getProofUrl());
        dto.setTimestamp(history.getTimestamp());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }

    public ComplaintStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(ComplaintStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public ComplaintStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(ComplaintStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getProofUrl() {
        return proofUrl;
    }

    public void setProofUrl(String proofUrl) {
        this.proofUrl = proofUrl;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
