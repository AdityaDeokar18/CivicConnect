package com.civicconnect.dto;

import com.civicconnect.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateComplaintRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private Priority priority = Priority.MEDIUM;

    private String location;

    private String address;

    private Double latitude;

    private Double longitude;

    private String department;

    private String photoUrl;

    public CreateComplaintRequest() {}

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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public void setImages(java.util.List<String> images) {
        if (images != null && !images.isEmpty() && (this.photoUrl == null || this.photoUrl.isBlank())) {
            this.photoUrl = images.get(0);
        }
    }

    public void setImageUrls(java.util.List<String> imageUrls) {
        setImages(imageUrls);
    }

    public void setDepartmentId(Object departmentId) {
        if (departmentId != null && (this.department == null || this.department.isBlank())) {
            this.department = String.valueOf(departmentId);
        }
    }

    public void setWard(String ward) {
        if (this.location == null || this.location.isBlank()) {
            this.location = ward;
        }
    }
}

