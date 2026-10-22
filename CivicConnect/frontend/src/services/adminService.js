import api from './api';
import { authService } from './authService';

export const adminService = {
  getDepartments: async () => {
    try {
      const data = await api.get('/departments');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error fetching departments:', err);
      return [];
    }
  },

  createDepartment: async (deptData) => {
    return api.post('/admin/departments', {
      name: deptData.name.trim(),
      code: deptData.code ? deptData.code.trim().toUpperCase() : deptData.name.substring(0, 4).toUpperCase(),
      description: deptData.description ? deptData.description.trim() : '',
      headOfficer: deptData.headOfficer ? deptData.headOfficer.trim() : 'Unassigned',
      contactEmail: deptData.contactEmail ? deptData.contactEmail.trim() : 'dept@civicconnect.gov.in',
      slaHours: Number(deptData.slaHours) || 48,
      categories: deptData.categories || []
    });
  },

  getUsers: async () => {
    return authService.getAllUsers();
  },

  getAnalytics: async () => {
    try {
      return await api.get('/admin/analytics');
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
      return null;
    }
  },

  getAnalyticsSummary: (complaints = []) => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'PENDING').length;
    const assigned = complaints.filter(c => c.status === 'ASSIGNED').length;
    const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
    const closed = complaints.filter(c => c.status === 'CLOSED').length;
    const completedTotal = resolved + closed;

    const categoryCounts = {};
    complaints.forEach(c => {
      const cat = c.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));

    const statusData = [
      { name: 'Pending Review', count: pending, color: '#f59e0b' },
      { name: 'Assigned', count: assigned, color: '#3b82f6' },
      { name: 'In Progress', count: inProgress, color: '#8b5cf6' },
      { name: 'Resolved', count: resolved, color: '#10b981' },
      { name: 'Closed', count: closed, color: '#059669' }
    ];

    const slaComplianceRate = total > 0 ? Math.round((completedTotal / total) * 100) : 0;

    return {
      total,
      pending,
      assigned,
      inProgress,
      resolved,
      closed,
      completedTotal,
      slaComplianceRate,
      categoryData,
      statusData,
      deptPerformance: []
    };
  }
};

export default adminService;
