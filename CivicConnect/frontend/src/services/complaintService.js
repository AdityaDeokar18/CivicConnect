import { mockComplaints } from '../data/mockComplaints';
import { mockDepartments } from '../data/mockDepartments';
import { notificationService } from './notificationService';

const COMPLAINTS_KEY = 'civicconnect_complaints';

const initializeComplaints = () => {
  if (localStorage.getItem(COMPLAINTS_KEY) === null) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(mockComplaints || []));
  }
};

// Helper: Determine department based on category and optional jurisdiction
export const resolveDepartment = (category) => {
  if (!category) return mockDepartments[0]?.name || 'General Municipal Services';
  
  for (const dept of mockDepartments) {
    if (dept.categories && dept.categories.includes(category)) {
      return dept.name;
    }
  }
  return mockDepartments[0]?.name || 'Road Maintenance & Potholes';
};

export const complaintService = {
  getAllComplaints: () => {
    initializeComplaints();
    return JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
  },

  getComplaintById: (id) => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    return complaints.find(c => String(c.id) === String(id) || c.complaintRefNo === id) || null;
  },

  getPublicComplaints: () => {
    initializeComplaints();
    return JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
  },

  getMyComplaints: (currentUser) => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    if (!currentUser) return [];
    return complaints.filter(
      c => c.citizenId === currentUser.id || c.citizenEmail?.toLowerCase() === currentUser.email?.toLowerCase()
    );
  },

  getOfficerComplaints: (officer) => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    if (!officer) return [];

    return complaints.filter(c => {
      if (!c.assignedOfficer) return false;
      if (c.assignedOfficer.id && officer.id && String(c.assignedOfficer.id) === String(officer.id)) {
        return true;
      }
      if (c.assignedOfficer.email && officer.email && c.assignedOfficer.email.toLowerCase() === officer.email.toLowerCase()) {
        return true;
      }
      if (c.assignedOfficer.badgeNumber && officer.badgeNumber && c.assignedOfficer.badgeNumber === officer.badgeNumber) {
        return true;
      }
      return false;
    });
  },

  getOfficerStats: (officer) => {
    const list = complaintService.getOfficerComplaints(officer);
    const total = list.length;
    const pendingAction = list.filter(c => c.status === 'ASSIGNED').length;
    const inProgress = list.filter(c => c.status === 'IN_PROGRESS').length;
    const resolved = list.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

    return {
      total,
      pendingAction,
      inProgress,
      resolved,
      recentComplaints: list.slice(0, 5)
    };
  },

  createComplaint: (complaintData, currentUser) => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRefNo = `CC-${dateStr}-${randomSuffix}`;
    
    // Automatically determine department from category if not explicitly specified
    const determinedDept = complaintData.department || resolveDepartment(complaintData.category);

    const newComplaint = {
      id: Date.now(),
      complaintRefNo: newRefNo,
      citizenId: currentUser?.id || 1,
      citizenName: currentUser?.fullName || "Citizen",
      citizenEmail: currentUser?.email || "citizen@civicconnect.gov.in",
      citizenPhone: currentUser?.phoneNumber || "+91 90000 00000",
      title: complaintData.title.trim(),
      category: complaintData.category,
      department: determinedDept,
      priority: complaintData.priority || "MEDIUM",
      status: "PENDING",
      address: complaintData.address.trim(),
      ward: complaintData.ward || "Ward 4",
      latitude: complaintData.latitude || 18.5204,
      longitude: complaintData.longitude || 73.8567,
      description: complaintData.description.trim(),
      images: complaintData.images && complaintData.images.length > 0 ? complaintData.images : [],
      assignedOfficer: null,
      workProof: null,
      resolutionProof: null,
      feedback: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      historyTimeline: [
        {
          status: "PENDING",
          changedAt: new Date().toISOString(),
          changedBy: `${currentUser?.fullName || 'Citizen'} (Citizen)`,
          remarks: `Grievance registered in ${complaintData.ward || 'Municipal Ward'}. Routed to ${determinedDept}.`
        }
      ]
    };

    complaints.unshift(newComplaint);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));

    // Real Notification Dispatch: Citizen
    notificationService.createNotification({
      recipientId: currentUser?.id,
      recipientEmail: currentUser?.email,
      complaintId: newComplaint.id,
      complaintRefNo: newRefNo,
      type: 'SUBMITTED',
      title: 'Grievance Registered',
      message: `Your grievance ${newRefNo} ("${newComplaint.title}") has been registered and routed to ${determinedDept}.`
    });

    // Real Notification Dispatch: Admin Pool
    notificationService.createNotification({
      recipientRole: 'ROLE_ADMIN',
      complaintId: newComplaint.id,
      complaintRefNo: newRefNo,
      type: 'NEW_TICKET',
      title: 'New Complaint Logged',
      message: `New ticket ${newRefNo} logged for ${determinedDept} in ${newComplaint.address}. Officer allocation needed.`
    });

    return newComplaint;
  },

  assignComplaint: (complaintId, officer, department, remarks, adminName = "Admin") => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const index = complaints.findIndex(c => String(c.id) === String(complaintId));
    
    if (index !== -1) {
      complaints[index].status = 'ASSIGNED';
      complaints[index].department = department || officer?.department || complaints[index].department;
      complaints[index].assignedOfficer = {
        id: officer.id,
        name: officer.fullName,
        email: officer.email,
        phone: officer.phoneNumber || '',
        badgeNumber: officer.badgeNumber || 'OFF-N/A',
        designation: officer.designation || 'Field Engineer',
        department: officer.department || department,
        assignedAt: new Date().toISOString()
      };
      complaints[index].updatedAt = new Date().toISOString();
      complaints[index].historyTimeline.push({
        status: 'ASSIGNED',
        changedAt: new Date().toISOString(),
        changedBy: `${adminName} (Administrator)`,
        remarks: remarks || `Assigned to field engineer ${officer.fullName} (${officer.badgeNumber || 'Officer'}).`
      });

      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));

      // Notify Citizen
      notificationService.createNotification({
        recipientId: complaints[index].citizenId,
        recipientEmail: complaints[index].citizenEmail,
        complaintId: complaints[index].id,
        complaintRefNo: complaints[index].complaintRefNo,
        type: 'ASSIGNED',
        title: 'Officer Assigned to Your Grievance',
        message: `Officer ${officer.fullName} (${officer.badgeNumber || 'Field Engineer'}) from ${complaints[index].department} has been dispatched for ${complaints[index].complaintRefNo}.`
      });

      // Notify Officer
      notificationService.createNotification({
        recipientId: officer.id,
        recipientEmail: officer.email,
        complaintId: complaints[index].id,
        complaintRefNo: complaints[index].complaintRefNo,
        type: 'ASSIGNED_TO_OFFICER',
        title: 'New Task Assignment',
        message: `Work Order ${complaints[index].complaintRefNo} assigned to you: "${complaints[index].title}" at ${complaints[index].address}.`
      });

      return complaints[index];
    }
    return null;
  },

  // Proof-Based Workflow: ASSIGNED -> IN_PROGRESS
  // Requires work/inspection proof photo
  startWork: (complaintId, proofImage, remarks, officerName = "Municipal Officer") => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const index = complaints.findIndex(c => String(c.id) === String(complaintId));

    if (index === -1) return { success: false, message: 'Complaint not found' };
    if (!proofImage) {
      return { success: false, message: 'Work / site inspection proof photo is strictly required to start work.' };
    }

    complaints[index].status = 'IN_PROGRESS';
    complaints[index].workProof = {
      image: proofImage,
      remarks: remarks || 'On-site repair work commenced.',
      uploadedAt: new Date().toISOString(),
      uploadedBy: officerName
    };
    complaints[index].updatedAt = new Date().toISOString();
    complaints[index].historyTimeline.push({
      status: 'IN_PROGRESS',
      changedAt: new Date().toISOString(),
      changedBy: `${officerName} (Field Officer)`,
      remarks: remarks ? `Work started with inspection proof: ${remarks}` : 'Field inspection completed and repair work initiated.'
    });

    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));

    // Notify Citizen
    notificationService.createNotification({
      recipientId: complaints[index].citizenId,
      recipientEmail: complaints[index].citizenEmail,
      complaintId: complaints[index].id,
      complaintRefNo: complaints[index].complaintRefNo,
      type: 'IN_PROGRESS',
      title: 'Field Repair Underway',
      message: `Work has commenced on ${complaints[index].complaintRefNo}. Field officer has logged site inspection proof.`
    });

    return { success: true, complaint: complaints[index] };
  },

  // Proof-Based Workflow: IN_PROGRESS -> RESOLVED
  // Strictly requires final resolution proof photo
  resolveComplaint: (complaintId, proofImage, remarks, officerName = "Municipal Officer") => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const index = complaints.findIndex(c => String(c.id) === String(complaintId));

    if (index === -1) return { success: false, message: 'Complaint not found' };
    if (!proofImage) {
      return { success: false, message: 'Final resolution proof photo is mandatory before marking a grievance as RESOLVED.' };
    }

    complaints[index].status = 'RESOLVED';
    complaints[index].resolvedAt = new Date().toISOString();
    complaints[index].resolutionProof = {
      image: proofImage,
      remarks: remarks || 'Field fix completed and site cleaned.',
      uploadedAt: new Date().toISOString(),
      uploadedBy: officerName
    };
    complaints[index].updatedAt = new Date().toISOString();
    complaints[index].historyTimeline.push({
      status: 'RESOLVED',
      changedAt: new Date().toISOString(),
      changedBy: `${officerName} (Field Officer)`,
      remarks: remarks ? `Field fix verified with resolution proof: ${remarks}` : 'Field fix verified and final resolution photo uploaded.'
    });

    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));

    // Notify Citizen to verify and provide rating
    notificationService.createNotification({
      recipientId: complaints[index].citizenId,
      recipientEmail: complaints[index].citizenEmail,
      complaintId: complaints[index].id,
      complaintRefNo: complaints[index].complaintRefNo,
      type: 'RESOLVED',
      title: 'Grievance Resolved - Feedback Requested',
      message: `Officer ${officerName} has uploaded resolution proof for ${complaints[index].complaintRefNo}. Please inspect the fix and submit your satisfaction rating to close the ticket.`
    });

    return { success: true, complaint: complaints[index] };
  },

  // Citizen Verification & Feedback: RESOLVED -> CLOSED
  submitFeedback: (id, rating, comments, citizenName = "Citizen") => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const index = complaints.findIndex(c => String(c.id) === String(id));
    
    if (index !== -1) {
      complaints[index].feedback = {
        rating: Number(rating) || 5,
        comments: comments ? comments.trim() : 'Satisfied with the municipal repair.',
        createdAt: new Date().toISOString()
      };
      complaints[index].status = 'CLOSED';
      complaints[index].closedAt = new Date().toISOString();
      complaints[index].updatedAt = new Date().toISOString();
      complaints[index].historyTimeline.push({
        status: 'CLOSED',
        changedAt: new Date().toISOString(),
        changedBy: `${citizenName} (Citizen Feedback)`,
        remarks: `Citizen verified repair and rated ${rating}/5 stars: "${comments || 'Resolved'}"`
      });

      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));

      // Notify Assigned Officer
      if (complaints[index].assignedOfficer?.id) {
        notificationService.createNotification({
          recipientId: complaints[index].assignedOfficer.id,
          complaintId: complaints[index].id,
          complaintRefNo: complaints[index].complaintRefNo,
          type: 'CLOSED',
          title: 'Citizen Closed Ticket with Rating',
          message: `Citizen rated your resolution on ${complaints[index].complaintRefNo} with ${rating}/5 stars: "${comments}".`
        });
      }

      return complaints[index];
    }
    return null;
  },

  // Fallback update status for admin or emergency changes
  updateComplaintStatus: (id, newStatus, remarks, actorName = "Municipal Official", proofImage = null) => {
    initializeComplaints();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const index = complaints.findIndex(c => String(c.id) === String(id));
    
    if (index !== -1) {
      complaints[index].status = newStatus;
      complaints[index].updatedAt = new Date().toISOString();

      if (newStatus === 'RESOLVED') {
        complaints[index].resolvedAt = new Date().toISOString();
        if (proofImage) {
          complaints[index].resolutionProof = {
            image: proofImage,
            remarks: remarks || 'Resolution proof submitted',
            uploadedAt: new Date().toISOString(),
            uploadedBy: actorName
          };
        }
      }
      if (newStatus === 'IN_PROGRESS' && proofImage) {
        complaints[index].workProof = {
          image: proofImage,
          remarks: remarks || 'Inspection proof submitted',
          uploadedAt: new Date().toISOString(),
          uploadedBy: actorName
        };
      }

      complaints[index].historyTimeline.push({
        status: newStatus,
        changedAt: new Date().toISOString(),
        changedBy: actorName,
        remarks: remarks || `Status progressed to ${newStatus}`
      });

      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
      return complaints[index];
    }
    return null;
  }
};

export default complaintService;
