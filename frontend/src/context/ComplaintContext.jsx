import React, { createContext, useContext, useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshComplaints = () => {
    setLoading(true);
    const data = complaintService.getAllComplaints();
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshComplaints();
  }, [currentUser]);

  const addComplaint = (complaintData) => {
    const newRecord = complaintService.createComplaint(complaintData, currentUser);
    setComplaints(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const assignComplaint = (complaintId, officer, department, remarks) => {
    const adminName = currentUser?.fullName || "Administrator";
    const updated = complaintService.assignComplaint(complaintId, officer, department, remarks, adminName);
    if (updated) {
      setComplaints(prev => prev.map(c => String(c.id) === String(complaintId) ? updated : c));
    }
    return updated;
  };

  const startWork = (id, proofImage, remarks) => {
    const officerName = currentUser?.fullName || "Municipal Officer";
    const res = complaintService.startWork(id, proofImage, remarks, officerName);
    if (res.success && res.complaint) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? res.complaint : c));
    }
    return res;
  };

  const resolveComplaint = (id, proofImage, remarks) => {
    const officerName = currentUser?.fullName || "Municipal Officer";
    const res = complaintService.resolveComplaint(id, proofImage, remarks, officerName);
    if (res.success && res.complaint) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? res.complaint : c));
    }
    return res;
  };

  const submitFeedback = (id, rating, comments) => {
    const citizenName = currentUser?.fullName || "Citizen";
    const updated = complaintService.submitFeedback(id, rating, comments, citizenName);
    if (updated) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? updated : c));
    }
    return updated;
  };

  const updateStatus = (id, newStatus, remarks, proofImage = null) => {
    const actorName = `${currentUser?.fullName || 'Municipal Official'} (${currentUser?.role === 'ROLE_ADMIN' ? 'Admin' : 'Officer'})`;
    const updated = complaintService.updateComplaintStatus(id, newStatus, remarks, actorName, proofImage);
    if (updated) {
      setComplaints(prev => prev.map(c => String(c.id) === String(id) ? updated : c));
    }
    return updated;
  };

  const getComplaint = (id) => {
    return complaintService.getComplaintById(id);
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
    getComplaint
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
