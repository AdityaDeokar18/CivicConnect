import React, { createContext, useContext, useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintService.getAllComplaints(currentUser);
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshComplaints();
  }, [currentUser]);

  const addComplaint = async (complaintData) => {
    const newRecord = await complaintService.createComplaint(complaintData, currentUser);
    if (newRecord) {
      setComplaints(prev => [newRecord, ...prev.filter(c => c.id !== newRecord.id)]);
    }
    return newRecord;
  };

  const assignComplaint = async (complaintId, officer, department, remarks) => {
    const adminName = currentUser?.fullName || "Administrator";
    const updated = await complaintService.assignComplaint(complaintId, officer, department, remarks, adminName);
    if (updated) {
      setComplaints(prev => prev.map(c => String(c.id) === String(complaintId) ? updated : c));
    }
    return updated;
  };

  const startWork = async (id, proofImage, remarks) => {
    const officerName = currentUser?.fullName || "Municipal Officer";
    const res = await complaintService.startWork(id, proofImage, remarks, officerName);
    if (res.success && res.complaint) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? res.complaint : c));
    }
    return res;
  };

  const resolveComplaint = async (id, proofImage, remarks) => {
    const officerName = currentUser?.fullName || "Municipal Officer";
    const res = await complaintService.resolveComplaint(id, proofImage, remarks, officerName);
    if (res.success && res.complaint) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? res.complaint : c));
    }
    return res;
  };

  const submitFeedback = async (id, rating, comments) => {
    const citizenName = currentUser?.fullName || "Citizen";
    const updated = await complaintService.submitFeedback(id, rating, comments, citizenName);
    if (updated) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? updated : c));
    }
    return updated;
  };

  const updateStatus = async (id, newStatus, remarks, proofImage = null) => {
    const actorName = `${currentUser?.fullName || 'Municipal Official'} (${currentUser?.role === 'ROLE_ADMIN' ? 'Admin' : 'Officer'})`;
    const updated = await complaintService.updateComplaintStatus(id, newStatus, remarks, actorName, proofImage);
    if (updated) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? updated : c));
    }
    return updated;
  };

  const getComplaint = (id) => {
    return complaints.find(c => String(c.id) === String(id) || c.complaintRefNo === id) || null;
  };

  const fetchComplaint = async (id) => {
    const found = await complaintService.getComplaintById(id);
    if (found) {
      setComplaints(prev => {
        const idx = prev.findIndex(c => String(c.id) === String(found.id));
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = found;
          return next;
        }
        return [found, ...prev];
      });
    }
    return found;
  };

  const myComplaints = complaints.filter(
    c => c.citizenId === currentUser?.id || c.citizenEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const officerComplaints = complaints.filter(c => {
    if (!currentUser || currentUser.role !== 'ROLE_OFFICER') return false;
    if (!c.assignedOfficer) return false;
    if (c.assignedOfficer.id && currentUser.id && String(c.assignedOfficer.id) === String(currentUser.id)) {
      return true;
    }
    if (c.assignedOfficer.email && currentUser.email && c.assignedOfficer.email.toLowerCase() === currentUser.email.toLowerCase()) {
      return true;
    }
    if (c.assignedOfficer.badgeNumber && currentUser.badgeNumber && c.assignedOfficer.badgeNumber === currentUser.badgeNumber) {
      return true;
    }
    return false;
  });

  const value = {
    complaints,
    myComplaints,
    officerComplaints,
    loading,
    refreshComplaints,
    addComplaint,
    assignComplaint,
    startWork,
    resolveComplaint,
    submitFeedback,
    updateStatus,
    getComplaint,
    fetchComplaint
  };

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

export default ComplaintContext;
