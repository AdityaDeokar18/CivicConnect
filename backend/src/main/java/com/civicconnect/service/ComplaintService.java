package com.civicconnect.service;

import com.civicconnect.dto.*;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.InvalidStatusTransitionException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.exception.UnauthorizedException;
import com.civicconnect.model.*;
import com.civicconnect.repository.ComplaintRepository;
import com.civicconnect.repository.ComplaintStatusHistoryRepository;
import com.civicconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final DepartmentService departmentService;
    private final NotificationService notificationService;
    private final Random random = new Random();

    public ComplaintService(ComplaintRepository complaintRepository,
                            ComplaintStatusHistoryRepository historyRepository,
                            UserRepository userRepository,
                            DepartmentService departmentService,
                            NotificationService notificationService) {
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
        this.departmentService = departmentService;
        this.notificationService = notificationService;
    }

    @Transactional
    public ComplaintDto createComplaint(CreateComplaintRequest request, User citizen) {
        if (citizen == null || citizen.getRole() != Role.ROLE_CITIZEN) {
            throw new UnauthorizedException("Only registered citizens can lodge complaints");
        }

        String dept = StringUtils.hasText(request.getDepartment())
                ? request.getDepartment().trim()
                : departmentService.resolveDepartmentForCategory(request.getCategory());

        String dateStr = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String refNo = String.format("CC-%s-%04d", dateStr, random.nextInt(10000));

        Complaint complaint = new Complaint();
        complaint.setComplaintRefNo(refNo);
        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setCategory(request.getCategory().trim());
        complaint.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        complaint.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        complaint.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setPhotoUrl(request.getPhotoUrl());
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setDepartment(dept);
        complaint.setCitizen(citizen);

        Complaint saved = complaintRepository.save(complaint);

        // Record initial status history
        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                null,
                ComplaintStatus.PENDING,
                citizen.getFullName(),
                citizen.getRole().name(),
                citizen.getEmail(),
                "Complaint lodged by citizen",
                request.getPhotoUrl()
        );
        historyRepository.save(history);

        // Notify Admin of new pending complaint
        notificationService.createNotification(
                null,
                "ROLE_ADMIN",
                saved.getId(),
                saved.getComplaintRefNo(),
                "NEW_COMPLAINT",
                "New Complaint Submitted: " + saved.getComplaintRefNo(),
                "Citizen " + citizen.getFullName() + " reported '" + saved.getTitle() + "' in category " + saved.getCategory()
        );

        return ComplaintDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ComplaintDto getComplaintById(Long id, User currentUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        // Ownership / Authorization check
        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            if (!complaint.getCitizen().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You are not authorized to view another citizen's complaint details");
            }
        } else if (currentUser.getRole() == Role.ROLE_OFFICER) {
            boolean isAssigned = complaint.getAssignedOfficer() != null
                    && complaint.getAssignedOfficer().getId().equals(currentUser.getId());
            boolean isSameDept = complaint.getDepartment() != null
                    && complaint.getDepartment().equalsIgnoreCase(currentUser.getDepartment());
            if (!isAssigned && !isSameDept) {
                throw new UnauthorizedException("You are not authorized to view this complaint (unassigned to your jurisdiction)");
            }
        }

        return ComplaintDto.fromEntity(complaint);
    }

    @Transactional(readOnly = true)
    public List<ComplaintDto> getMyComplaints(User citizen) {
        return complaintRepository.findByCitizenIdOrderByCreatedAtDesc(citizen.getId()).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintDto> getOfficerComplaints(User officer) {
        return complaintRepository.findByAssignedOfficerIdOrderByCreatedAtDesc(officer.getId()).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintDto> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PublicComplaintDto> getPublicComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(PublicComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintDto assignComplaint(Long id, AssignComplaintRequest request, User admin) {
        if (admin.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("Only administrators can assign complaints");
        }

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (complaint.getStatus() == ComplaintStatus.CLOSED || complaint.getStatus() == ComplaintStatus.REJECTED) {
            throw new InvalidStatusTransitionException("Cannot assign a complaint with status " + complaint.getStatus());
        }

        User officer = userRepository.findById(request.getOfficerId())
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + request.getOfficerId()));

        if (officer.getRole() != Role.ROLE_OFFICER) {
            throw new BadRequestException("Selected user is not an officer");
        }

        if (officer.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new BadRequestException("Cannot assign complaint to an officer who is " + officer.getApprovalStatus()
                    + ". Officer must be APPROVED by Municipal Administration first.");
        }

        ComplaintStatus previousStatus = complaint.getStatus();
        complaint.setAssignedOfficer(officer);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        complaint.setAssignedAt(Instant.now());
        complaint.setAssignedByAdmin(admin.getFullName());
        complaint.setAssignmentRemarks(request.getRemarks());

        if (StringUtils.hasText(request.getDepartment())) {
            complaint.setDepartment(request.getDepartment().trim());
        }

        Complaint saved = complaintRepository.save(complaint);

        // Audit History
        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                previousStatus,
                ComplaintStatus.ASSIGNED,
                admin.getFullName(),
                admin.getRole().name(),
                admin.getEmail(),
                "Assigned to Officer " + officer.getFullName() + (StringUtils.hasText(request.getRemarks()) ? ": " + request.getRemarks() : ""),
                null
        );
        historyRepository.save(history);

        // Notify assigned officer
        notificationService.createNotification(
                officer,
                null,
                saved.getId(),
                saved.getComplaintRefNo(),
                "COMPLAINT_ASSIGNED",
                "New Task Assigned: " + saved.getComplaintRefNo(),
                "You have been assigned complaint '" + saved.getTitle() + "' in " + saved.getDepartment() + " by Admin " + admin.getFullName()
        );

        // Notify citizen
        notificationService.createNotification(
                saved.getCitizen(),
                null,
                saved.getId(),
                saved.getComplaintRefNo(),
                "STATUS_UPDATED",
                "Complaint Assigned: " + saved.getComplaintRefNo(),
                "Your complaint has been assigned to Field Officer " + officer.getFullName() + " for inspection."
        );

        return ComplaintDto.fromEntity(saved);
    }

    @Transactional
    public ComplaintDto startWork(Long id, StartWorkRequest request, User officer) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        // Ownership check
        if (complaint.getAssignedOfficer() == null || !complaint.getAssignedOfficer().getId().equals(officer.getId())) {
            throw new UnauthorizedException("You are not the designated officer for this complaint");
        }

        // State machine validation: ASSIGNED -> IN_PROGRESS
        if (complaint.getStatus() != ComplaintStatus.ASSIGNED) {
            throw new InvalidStatusTransitionException("Complaint must be in ASSIGNED status to move to IN_PROGRESS. Current: " + complaint.getStatus());
        }

        // Proof validation
        if (!StringUtils.hasText(request.getProofUrl())) {
            throw new BadRequestException("Inspection or work start proof is mandatory before moving to IN_PROGRESS");
        }

        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        complaint.setInspectionProofUrl(request.getProofUrl().trim());
        complaint.setInspectionNotes(request.getRemarks());
        complaint.setInspectedAt(Instant.now());

        Complaint saved = complaintRepository.save(complaint);

        // Audit History
        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                ComplaintStatus.ASSIGNED,
                ComplaintStatus.IN_PROGRESS,
                officer.getFullName(),
                officer.getRole().name(),
                officer.getEmail(),
                request.getRemarks() != null ? request.getRemarks() : "Officer initiated remediation work with inspection proof",
                request.getProofUrl()
        );
        historyRepository.save(history);

        // Notify Citizen
        notificationService.createNotification(
                saved.getCitizen(),
                null,
                saved.getId(),
                saved.getComplaintRefNo(),
                "IN_PROGRESS",
                "Work In Progress: " + saved.getComplaintRefNo(),
                "Officer " + officer.getFullName() + " has arrived on-site, submitted inspection proof, and started remediation work."
        );

        return ComplaintDto.fromEntity(saved);
    }

    @Transactional
    public ComplaintDto resolveComplaint(Long id, ResolveComplaintRequest request, User officer) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        // Ownership check
        if (complaint.getAssignedOfficer() == null || !complaint.getAssignedOfficer().getId().equals(officer.getId())) {
            throw new UnauthorizedException("You are not the designated officer for this complaint");
        }

        // State machine validation: IN_PROGRESS -> RESOLVED
        if (complaint.getStatus() != ComplaintStatus.IN_PROGRESS) {
            throw new InvalidStatusTransitionException("Complaint must be in IN_PROGRESS status to mark as RESOLVED. Current: " + complaint.getStatus());
        }

        // Proof validation
        if (!StringUtils.hasText(request.getProofUrl())) {
            throw new BadRequestException("Resolution proof photograph or document is mandatory to resolve a complaint");
        }
        if (!StringUtils.hasText(request.getRemarks())) {
            throw new BadRequestException("Resolution notes explaining actions taken are mandatory");
        }

        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolutionProofUrl(request.getProofUrl().trim());
        complaint.setResolutionNotes(request.getRemarks().trim());
        complaint.setResolvedAt(Instant.now());

        Complaint saved = complaintRepository.save(complaint);

        // Audit History
        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                ComplaintStatus.IN_PROGRESS,
                ComplaintStatus.RESOLVED,
                officer.getFullName(),
                officer.getRole().name(),
                officer.getEmail(),
                request.getRemarks().trim(),
                request.getProofUrl()
        );
        historyRepository.save(history);

        // Notify Citizen
        notificationService.createNotification(
                saved.getCitizen(),
                null,
                saved.getId(),
                saved.getComplaintRefNo(),
                "RESOLVED",
                "Complaint Resolved: " + saved.getComplaintRefNo(),
                "Officer " + officer.getFullName() + " has resolved your reported problem! Please review resolution proof and submit your feedback rating."
        );

        return ComplaintDto.fromEntity(saved);
    }

    @Transactional
    public ComplaintDto submitFeedback(Long id, FeedbackRequest request, User citizen) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        // Ownership check: Only citizen owner can rate
        if (!complaint.getCitizen().getId().equals(citizen.getId())) {
            throw new UnauthorizedException("Only the citizen who lodged this complaint can submit feedback");
        }

        // State machine validation: MUST be RESOLVED
        if (complaint.getStatus() != ComplaintStatus.RESOLVED) {
            throw new InvalidStatusTransitionException("Feedback rating can only be submitted for RESOLVED complaints. Current status: " + complaint.getStatus());
        }

        // Prevent duplicate rating
        if (complaint.getRating() != null) {
            throw new BadRequestException("Feedback has already been submitted for this complaint");
        }

        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must be an integer between 1 and 5");
        }

        complaint.setRating(request.getRating());
        complaint.setFeedbackComments(request.getComments() != null ? request.getComments().trim() : null);
        complaint.setRatedAt(Instant.now());
        complaint.setStatus(ComplaintStatus.CLOSED); // Rating officially closes the ticket
        complaint.setClosedAt(Instant.now());

        Complaint saved = complaintRepository.save(complaint);

        // Audit History
        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                ComplaintStatus.RESOLVED,
                ComplaintStatus.CLOSED,
                citizen.getFullName(),
                citizen.getRole().name(),
                citizen.getEmail(),
                "Citizen submitted rating: " + request.getRating() + " stars. Complaint closed."
                        + (StringUtils.hasText(request.getComments()) ? " Feedback: " + request.getComments() : ""),
                null
        );
        historyRepository.save(history);

        // Notify Assigned Officer
        if (saved.getAssignedOfficer() != null) {
            notificationService.createNotification(
                    saved.getAssignedOfficer(),
                    null,
                    saved.getId(),
                    saved.getComplaintRefNo(),
                    "FEEDBACK_RECEIVED",
                    "Citizen Feedback Received: " + saved.getComplaintRefNo(),
                    "Citizen rated your work " + request.getRating() + "/5 stars for complaint " + saved.getComplaintRefNo()
            );
        }

        return ComplaintDto.fromEntity(saved);
    }

    @Transactional
    public ComplaintDto rejectComplaint(Long id, RejectComplaintRequest request, User actor) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        // Can only reject from PENDING or ASSIGNED
        if (complaint.getStatus() == ComplaintStatus.RESOLVED || complaint.getStatus() == ComplaintStatus.CLOSED) {
            throw new InvalidStatusTransitionException("Cannot reject a complaint that is already " + complaint.getStatus());
        }

        if (!StringUtils.hasText(request.getReason())) {
            throw new BadRequestException("Rejection reason is mandatory");
        }

        ComplaintStatus previousStatus = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.REJECTED);
        complaint.setRejectionReason(request.getReason().trim());
        complaint.setRejectedAt(Instant.now());

        Complaint saved = complaintRepository.save(complaint);

        // Audit History
        ComplaintStatusHistory history = new ComplaintStatusHistory(
                saved,
                previousStatus,
                ComplaintStatus.REJECTED,
                actor.getFullName(),
                actor.getRole().name(),
                actor.getEmail(),
                "Complaint rejected: " + request.getReason().trim(),
                null
        );
        historyRepository.save(history);

        // Notify Citizen
        notificationService.createNotification(
                saved.getCitizen(),
                null,
                saved.getId(),
                saved.getComplaintRefNo(),
                "REJECTED",
                "Complaint Rejected: " + saved.getComplaintRefNo(),
                "Your complaint was rejected by municipal authorities. Reason: " + request.getReason().trim()
        );

        return ComplaintDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<StatusHistoryDto> getComplaintHistory(Long id, User currentUser) {
        // Enforce ownership/access check on complaint
        getComplaintById(id, currentUser);

        return historyRepository.findByComplaintIdOrderByTimestampAsc(id).stream()
                .map(StatusHistoryDto::fromEntity)
                .collect(Collectors.toList());
    }
}
