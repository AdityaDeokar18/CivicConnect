package com.civicconnect.dto;

import com.civicconnect.model.Department;
import java.util.ArrayList;
import java.util.List;

public class DepartmentDto {

    private Long id;
    private String name;
    private String code;
    private String description;
    private String headOfficer;
    private String contactEmail;
    private Integer slaHours;
    private Integer activeOfficers;
    private List<String> categories = new ArrayList<>();

    public DepartmentDto() {}

    public static DepartmentDto fromEntity(Department d) {
        if (d == null) return null;
        DepartmentDto dto = new DepartmentDto();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setCode(d.getCode());
        dto.setDescription(d.getDescription());
        dto.setHeadOfficer(d.getHeadOfficer());
        dto.setContactEmail(d.getContactEmail());
        dto.setSlaHours(d.getSlaHours());
        dto.setActiveOfficers(d.getActiveOfficers());
        dto.setCategories(d.getCategories() != null ? new ArrayList<>(d.getCategories()) : new ArrayList<>());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHeadOfficer() {
        return headOfficer;
    }

    public void setHeadOfficer(String headOfficer) {
        this.headOfficer = headOfficer;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public Integer getSlaHours() {
        return slaHours;
    }

    public void setSlaHours(Integer slaHours) {
        this.slaHours = slaHours;
    }

    public Integer getActiveOfficers() {
        return activeOfficers;
    }

    public void setActiveOfficers(Integer activeOfficers) {
        this.activeOfficers = activeOfficers;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }
}
