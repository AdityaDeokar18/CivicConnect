package com.civicconnect.service;

import com.civicconnect.dto.DepartmentDto;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.model.Department;
import com.civicconnect.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return DepartmentDto.fromEntity(dept);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Department name is required");
        }
        String cleanName = dto.getName().trim();
        if (departmentRepository.existsByName(cleanName)) {
            throw new BadRequestException("Department with name '" + cleanName + "' already exists");
        }

        Department department = new Department();
        department.setName(cleanName);
        department.setCode(dto.getCode() != null ? dto.getCode().trim().toUpperCase() : cleanName.substring(0, Math.min(4, cleanName.length())).toUpperCase());
        department.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        department.setHeadOfficer(dto.getHeadOfficer() != null ? dto.getHeadOfficer().trim() : "Unassigned");
        department.setContactEmail(dto.getContactEmail() != null ? dto.getContactEmail().trim() : "dept@civicconnect.gov.in");
        department.setSlaHours(dto.getSlaHours() != null ? dto.getSlaHours() : 48);
        department.setCategories(dto.getCategories());

        Department saved = departmentRepository.save(department);
        return DepartmentDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public String resolveDepartmentForCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return "General Municipal Services";
        }
        List<Department> departments = departmentRepository.findAll();
        for (Department dept : departments) {
            if (dept.getCategories() != null && dept.getCategories().contains(category.trim())) {
                return dept.getName();
            }
        }
        return departments.isEmpty() ? "General Municipal Services" : departments.get(0).getName();
    }
}
