package com.civicconnect.dto;

import com.civicconnect.model.Complaint;
import com.civicconnect.model.ComplaintStatus;
import com.civicconnect.model.Priority;
import java.time.Instant;

public class PublicComplaintDto {

    private Long id;
    private String complaintRefNo;
    private String title;
    private String description;
    private String category;
    private Priority priority;
    private String location;
    private String department;
    private ComplaintStatus status;
    private String photoUrl;
    private Instant createdAt;
    private Instant resolvedAt;
    private Integer rating;

    public PublicComplaintDto() {}

    public static PublicComplaintDto fromEntity(Complaint c) {
        if (c == null) return null;
        PublicComplaintDto dto = new PublicComplaintDto();
        dto.setId(c.getId());
        dto.setComplaintRefNo(c.getComplaintRefNo());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setPriority(c.getPriority());
        dto.setLocation(c.getLocation());
        dto.setDepartment(c.getDepartment());
        dto.setStatus(c.getStatus());
        dto.setPhotoUrl(c.getPhotoUrl());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setResolvedAt(c.getResolvedAt());
        dto.setRating(c.getRating());
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
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
}
