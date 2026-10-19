import { mockDepartments } from '../data/mockDepartments';
import { authService } from './authService';

const DEPARTMENTS_KEY = 'civicconnect_departments';

const initializeAdminData = () => {
  if (localStorage.getItem(DEPARTMENTS_KEY) === null) {
    localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(mockDepartments));
  }
};

export const adminService = {
  getDepartments: () => {
    initializeAdminData();
    return JSON.parse(localStorage.getItem(DEPARTMENTS_KEY) || JSON.stringify(mockDepartments));
  },

  createDepartment: (deptData) => {
    initializeAdminData();
    const depts = JSON.parse(localStorage.getItem(DEPARTMENTS_KEY) || JSON.stringify(mockDepartments));
    const newDept = {
      id: Date.now(),
      name: deptData.name.trim(),
      code: deptData.code ? deptData.code.trim().toUpperCase() : deptData.name.substring(0, 4).toUpperCase(),
      description: deptData.description ? deptData.description.trim() : '',
      headOfficer: deptData.headOfficer ? deptData.headOfficer.trim() : 'Unassigned',
      contactEmail: deptData.contactEmail ? deptData.contactEmail.trim() : 'dept@civicconnect.gov.in',
      activeOfficers: 0,
      slaHours: Number(deptData.slaHours) || 48,
      categories: deptData.categories || []
    };
    depts.push(newDept);
    localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(depts));
    return newDept;
  },

  getUsers: () => {
    return authService.getAllUsers();
  },

  getAnalyticsSummary: (complaints = []) => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'PENDING').length;
    const assigned = complaints.filter(c => c.status === 'ASSIGNED').length;
    const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
    const closed = complaints.filter(c => c.status === 'CLOSED').length;
    const completedTotal = resolved + closed;

    // Real category breakdown
    const categoryCounts = {};
    complaints.forEach(c => {
      const cat = c.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));

    // Status breakdown data for charts
    const statusData = [
      { name: 'Pending Review', count: pending, color: '#f59e0b' },
      { name: 'Assigned', count: assigned, color: '#3b82f6' },
      { name: 'In Progress', count: inProgress, color: '#8b5cf6' },
      { name: 'Resolved', count: resolved, color: '#10b981' },
      { name: 'Closed', count: closed, color: '#059669' }
    ];

    // Real department breakdown
    const depts = adminService.getDepartments();
    const deptPerformance = depts.map(d => {
      const deptComplaints = complaints.filter(c => c.department === d.name);
      const totalAssigned = deptComplaints.length;
      const deptResolved = deptComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
      return {
        department: d.name,
        code: d.code,
        total: totalAssigned,
        resolved: deptResolved,
        slaHours: d.slaHours
      };
    });

    // Real SLA calculation
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
      deptPerformance
    };
  }
};

export default adminService;
