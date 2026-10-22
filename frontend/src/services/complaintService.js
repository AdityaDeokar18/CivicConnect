import api, { resolveFileUrl } from './api';
import { authService } from './authService';

export const normalizeComplaint = (c) => {
  if (!c) return null;
  const photo = c.photoUrl ? resolveFileUrl(c.photoUrl) : null;
  const inspProof = c.inspectionProofUrl ? resolveFileUrl(c.inspectionProofUrl) : null;
  const resProof = c.resolutionProofUrl ? resolveFileUrl(c.resolutionProofUrl) : null;

  return {
    ...c,
    photoUrl: photo,
    images: c.images && c.images.length > 0 ? c.images.map(resolveFileUrl) : (photo ? [photo] : []),
    ward: c.ward || c.location || 'Ward Area',
    address: c.address || c.location || 'Municipal Area',
    workProof: c.workProof ? {
      ...c.workProof,
      image: c.workProof.image ? resolveFileUrl(c.workProof.image) : null
    } : (inspProof ? {
      image: inspProof,
      remarks: c.inspectionNotes || 'Inspection proof uploaded',
      uploadedAt: c.inspectedAt,
      uploadedBy: c.assignedOfficer?.fullName || c.assignedOfficer?.name || 'Field Officer'
    } : null),
    resolutionProof: c.resolutionProof ? {
      ...c.resolutionProof,
      image: c.resolutionProof.image ? resolveFileUrl(c.resolutionProof.image) : null
    } : (resProof ? {
      image: resProof,
      remarks: c.resolutionNotes || 'Resolution completed',
      uploadedAt: c.resolvedAt,
      uploadedBy: c.assignedOfficer?.fullName || c.assignedOfficer?.name || 'Field Officer'
    } : null),
    feedback: c.feedback || (c.rating ? {
      rating: c.rating,
      comments: c.feedbackComments || '',
      createdAt: c.ratedAt
    } : null),
    assignedOfficer: c.assignedOfficer ? {
      ...c.assignedOfficer,
      name: c.assignedOfficer.name || c.assignedOfficer.fullName
    } : null,
    historyTimeline: c.historyTimeline || []
  };
};

export const complaintService = {
  getAllComplaints: async (user = null) => {
    const currentUser = user || authService.getCurrentUser();
    try {
      let endpoint = '/complaints/public';
      if (currentUser?.role === 'ROLE_ADMIN') {
        endpoint = '/complaints';
      } else if (currentUser?.role === 'ROLE_OFFICER') {
        endpoint = '/officer/complaints';
      } else if (currentUser?.role === 'ROLE_CITIZEN') {
        endpoint = '/complaints/my';
      }

      const data = await api.get(endpoint);
      return Array.isArray(data) ? data.map(normalizeComplaint) : [];
    } catch (err) {
      console.error('Error fetching complaints:', err);
      // Fallback to public if authenticated endpoint failed with 401/403
      try {
        const publicData = await api.get('/complaints/public');
        return Array.isArray(publicData) ? publicData.map(normalizeComplaint) : [];
      } catch {
        return [];
      }
    }
  },

  getComplaintById: async (id) => {
    try {
      const data = await api.get(`/complaints/${id}`);
      const normalized = normalizeComplaint(data);
      // Fetch history timeline
      try {
        const history = await api.get(`/complaints/${id}/history`);
        if (Array.isArray(history)) {
          normalized.historyTimeline = history.map(h => ({
            status: h.newStatus,
            changedAt: h.timestamp,
            changedBy: `${h.actorName} (${h.actorRole})`,
            remarks: h.remarks || `Status progressed to ${h.newStatus}`,
            proofUrl: h.proofUrl ? resolveFileUrl(h.proofUrl) : null
          }));
        }
      } catch {
        // history fetch is optional
      }
      return normalized;
    } catch (err) {
      // If error (e.g. unauthenticated public access), search in public complaints
      try {
        const publicList = await api.get('/complaints/public');
        const found = publicList.find(c => String(c.id) === String(id) || c.complaintRefNo === id);
        return found ? normalizeComplaint(found) : null;
      } catch {
        return null;
      }
    }
  },

  getPublicComplaints: async () => {
    try {
      const data = await api.get('/complaints/public');
      return Array.isArray(data) ? data.map(normalizeComplaint) : [];
    } catch (err) {
      console.error('Error fetching public complaints:', err);
      return [];
    }
  },

  getMyComplaints: async (currentUser) => {
    try {
      const data = await api.get('/complaints/my');
      return Array.isArray(data) ? data.map(normalizeComplaint) : [];
    } catch (err) {
      console.error('Error fetching citizen complaints:', err);
      return [];
    }
  },

  getOfficerComplaints: async (officer) => {
    try {
      const data = await api.get('/officer/complaints');
      return Array.isArray(data) ? data.map(normalizeComplaint) : [];
    } catch (err) {
      console.error('Error fetching officer complaints:', err);
      return [];
    }
  },

  getOfficerStats: async (officer) => {
    try {
      return await api.get('/officer/stats');
    } catch (err) {
      console.error('Error fetching officer stats:', err);
      return {
        total: 0,
        pendingAction: 0,
        inProgress: 0,
        resolved: 0,
        recentComplaints: []
      };
    }
  },

  createComplaint: async (complaintData, currentUser) => {
    const photoUrl = (complaintData.images && complaintData.images.length > 0)
      ? complaintData.images[0]
      : (complaintData.photoUrl || null);

    const payload = {
      title: complaintData.title.trim(),
      description: complaintData.description.trim(),
      category: complaintData.category,
      priority: complaintData.priority || 'MEDIUM',
      department: complaintData.department || null,
      location: complaintData.ward || complaintData.location || null,
      address: complaintData.address.trim(),
      latitude: complaintData.latitude || null,
      longitude: complaintData.longitude || null,
      photoUrl: photoUrl
    };

    const data = await api.post('/complaints', payload);
    return normalizeComplaint(data);
  },

  assignComplaint: async (complaintId, officer, department, remarks, adminName = "Admin") => {
    const payload = {
      officerId: officer.id,
      department: department || officer.department,
      remarks: remarks || ''
    };
    const data = await api.put(`/complaints/${complaintId}/assign`, payload);
    return normalizeComplaint(data);
  },

  startWork: async (complaintId, proofImage, remarks, officerName = "Municipal Officer") => {
    try {
      const payload = {
        proofUrl: proofImage,
        remarks: remarks || 'Site inspection completed and work initiated.'
      };
      const data = await api.post(`/complaints/${complaintId}/start-work`, payload);
      return { success: true, complaint: normalizeComplaint(data) };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Failed to start work'
      };
    }
  },

  resolveComplaint: async (complaintId, proofImage, remarks, officerName = "Municipal Officer") => {
    try {
      const payload = {
        proofUrl: proofImage,
        remarks: remarks || 'Grievance resolved and site verified.'
      };
      const data = await api.post(`/complaints/${complaintId}/resolve`, payload);
      return { success: true, complaint: normalizeComplaint(data) };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Failed to resolve complaint'
      };
    }
  },

  submitFeedback: async (id, rating, comments, citizenName = "Citizen") => {
    const payload = {
      rating: Number(rating),
      comments: comments ? comments.trim() : ''
    };
    const data = await api.post(`/complaints/${id}/feedback`, payload);
    return normalizeComplaint(data);
  },

  rejectComplaint: async (id, reason) => {
    const data = await api.post(`/complaints/${id}/reject`, { reason });
    return normalizeComplaint(data);
  },

  updateComplaintStatus: async (id, newStatus, remarks, actorName = "Municipal Official", proofImage = null) => {
    if (newStatus === 'IN_PROGRESS') {
      const res = await complaintService.startWork(id, proofImage, remarks, actorName);
      return res.complaint;
    }
    if (newStatus === 'RESOLVED') {
      const res = await complaintService.resolveComplaint(id, proofImage, remarks, actorName);
      return res.complaint;
    }
    if (newStatus === 'REJECTED') {
      return await complaintService.rejectComplaint(id, remarks);
    }
    return null;
  }
};

export default complaintService;
