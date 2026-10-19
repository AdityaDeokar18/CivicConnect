package com.civicconnect.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments", indexes = {
    @Index(name = "idx_dept_name", columnList = "name"),
    @Index(name = "idx_dept_code", columnList = "code")
})
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @Column(unique = true)
    private String code;

    @Column(length = 1000)
    private String description;

    private String headOfficer;

    private String contactEmail;

    private Integer slaHours = 48;

    private Integer activeOfficers = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "department_categories", joinColumns = @JoinColumn(name = "department_id"))
    @Column(name = "category_name")
    private List<String> categories = new ArrayList<>();

    public Department() {}

    public Department(String name, String code, String description, String headOfficer, String contactEmail, Integer slaHours) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.headOfficer = headOfficer;
        this.contactEmail = contactEmail;
        this.slaHours = slaHours;
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
