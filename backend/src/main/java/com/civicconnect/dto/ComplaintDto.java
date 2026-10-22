package com.civicconnect.dto;

import com.civicconnect.model.Complaint;
import com.civicconnect.model.ComplaintStatus;
import com.civicconnect.model.Priority;
import java.time.Instant;

public class ComplaintDto {

    private Long id;
    private String complaintRefNo;
    private String title;
    private String description;
    private String category;
    private Priority priority;
    private String location;
    private String address;
    private Double latitude;
    private Double longitude;
    private String photoUrl;
    private ComplaintStatus status;
    private String department;
    private Long citizenId;
    private String citizenName;
    private String citizenEmail;
    private String citizenPhone;
    private UserDto assignedOfficer;
    private Instant assignedAt;
    private String assignedByAdmin;
    private String assignmentRemarks;
    private String inspectionProofUrl;
    private String inspectionNotes;
    private Instant inspectedAt;
    private String resolutionProofUrl;
    private String resolutionNotes;
    private Instant resolvedAt;
    private Integer rating;
    private String feedbackComments;
    private Instant ratedAt;
    private Instant closedAt;
    private String rejectionReason;
    private Instant rejectedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public ComplaintDto() {}

    public static ComplaintDto fromEntity(Complaint c) {
        if (c == null) return null;
        ComplaintDto dto = new ComplaintDto();
        dto.setId(c.getId());
        dto.setComplaintRefNo(c.getComplaintRefNo());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setPriority(c.getPriority());
        dto.setLocation(c.getLocation());
        dto.setAddress(c.getAddress());
        dto.setLatitude(c.getLatitude());
        dto.setLongitude(c.getLongitude());
        dto.setPhotoUrl(c.getPhotoUrl());
        dto.setStatus(c.getStatus());
        dto.setDepartment(c.getDepartment());

        if (c.getCitizen() != null) {
            dto.setCitizenId(c.getCitizen().getId());
            dto.setCitizenName(c.getCitizen().getFullName());
            dto.setCitizenEmail(c.getCitizen().getEmail());
            dto.setCitizenPhone(c.getCitizen().getPhoneNumber());
        }

        if (c.getAssignedOfficer() != null) {
            dto.setAssignedOfficer(UserDto.fromEntity(c.getAssignedOfficer()));
        }

        dto.setAssignedAt(c.getAssignedAt());
        dto.setAssignedByAdmin(c.getAssignedByAdmin());
        dto.setAssignmentRemarks(c.getAssignmentRemarks());
        dto.setInspectionProofUrl(c.getInspectionProofUrl());
        dto.setInspectionNotes(c.getInspectionNotes());
        dto.setInspectedAt(c.getInspectedAt());
        dto.setResolutionProofUrl(c.getResolutionProofUrl());
        dto.setResolutionNotes(c.getResolutionNotes());
        dto.setResolvedAt(c.getResolvedAt());
        dto.setRating(c.getRating());
        dto.setFeedbackComments(c.getFeedbackComments());
        dto.setRatedAt(c.getRatedAt());
        dto.setClosedAt(c.getClosedAt());
        dto.setRejectionReason(c.getRejectionReason());
        dto.setRejectedAt(c.getRejectedAt());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComplaintRefNo() {
        return complaintRefNo;
    }

    public void setComplaintRefNo(String complaintRefNo) {
        this.complaintRefNo = complaintRefNo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Long getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(Long citizenId) {
        this.citizenId = citizenId;
    }

    public String getCitizenName() {
        return citizenName;
    }

    public void setCitizenName(String citizenName) {
        this.citizenName = citizenName;
    }

    public String getCitizenEmail() {
        return citizenEmail;
    }

    public void setCitizenEmail(String citizenEmail) {
        this.citizenEmail = citizenEmail;
    }

    public String getCitizenPhone() {
        return citizenPhone;
    }

    public void setCitizenPhone(String citizenPhone) {
        this.citizenPhone = citizenPhone;
    }

    public UserDto getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(UserDto assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
    }

    public Instant getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(Instant assignedAt) {
        this.assignedAt = assignedAt;
    }

    public String getAssignedByAdmin() {
        return assignedByAdmin;
    }

    public void setAssignedByAdmin(String assignedByAdmin) {
        this.assignedByAdmin = assignedByAdmin;
    }

    public String getAssignmentRemarks() {
        return assignmentRemarks;
    }

    public void setAssignmentRemarks(String assignmentRemarks) {
        this.assignmentRemarks = assignmentRemarks;
    }

    public String getInspectionProofUrl() {
        return inspectionProofUrl;
    }

    public void setInspectionProofUrl(String inspectionProofUrl) {
        this.inspectionProofUrl = inspectionProofUrl;
    }

    public String getInspectionNotes() {
        return inspectionNotes;
    }

    public void setInspectionNotes(String inspectionNotes) {
        this.inspectionNotes = inspectionNotes;
    }

    public Instant getInspectedAt() {
        return inspectedAt;
    }

    public void setInspectedAt(Instant inspectedAt) {
        this.inspectedAt = inspectedAt;
    }

    public String getResolutionProofUrl() {
        return resolutionProofUrl;
    }

    public void setResolutionProofUrl(String resolutionProofUrl) {
        this.resolutionProofUrl = resolutionProofUrl;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getFeedbackComments() {
        return feedbackComments;
    }

    public void setFeedbackComments(String feedbackComments) {
        this.feedbackComments = feedbackComments;
    }

    public Instant getRatedAt() {
        return ratedAt;
    }

    public void setRatedAt(Instant ratedAt) {
        this.ratedAt = ratedAt;
    }

    public Instant getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Instant closedAt) {
        this.closedAt = closedAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Instant getRejectedAt() {
        return rejectedAt;
    }

    public void setRejectedAt(Instant rejectedAt) {
        this.rejectedAt = rejectedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getWard() {
        return location != null ? location : "Central Ward";
    }

    public java.util.List<String> getImages() {
        if (photoUrl != null && !photoUrl.isBlank()) {
            return java.util.List.of(photoUrl);
        }
        return java.util.List.of();
    }

    public java.util.Map<String, Object> getWorkProof() {
        if (inspectionProofUrl != null && !inspectionProofUrl.isBlank()) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("image", inspectionProofUrl);
            map.put("remarks", inspectionNotes != null ? inspectionNotes : "Inspection completed");
            map.put("uploadedAt", inspectedAt != null ? inspectedAt.toString() : null);
            map.put("uploadedBy", assignedOfficer != null ? assignedOfficer.getFullName() : "Field Officer");
            return map;
        }
        return null;
    }

    public java.util.Map<String, Object> getResolutionProof() {
        if (resolutionProofUrl != null && !resolutionProofUrl.isBlank()) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("image", resolutionProofUrl);
            map.put("remarks", resolutionNotes != null ? resolutionNotes : "Resolution completed");
            map.put("uploadedAt", resolvedAt != null ? resolvedAt.toString() : null);
            map.put("uploadedBy", assignedOfficer != null ? assignedOfficer.getFullName() : "Field Officer");
            return map;
        }
        return null;
    }

    public java.util.Map<String, Object> getFeedback() {
        if (rating != null) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("rating", rating);
            map.put("comments", feedbackComments != null ? feedbackComments : "");
            map.put("createdAt", ratedAt != null ? ratedAt.toString() : null);
            return map;
        }
        return null;
    }
}
