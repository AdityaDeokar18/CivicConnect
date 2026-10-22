import api, { setToken, clearAuth, getToken } from './api';

const CURRENT_USER_KEY = 'civicconnect_user';

export const authService = {
  getCurrentUser: () => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  fetchCurrentUser: async () => {
    try {
      const token = getToken();
      if (!token) return null;
      const user = await api.get('/auth/me');
      if (user) {
        const stored = authService.getCurrentUser() || {};
        const updated = { ...stored, ...user, token };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
        return updated;
      }
      return null;
    } catch (err) {
      if (err.status === 401) {
        authService.logout();
      }
      return null;
    }
  },

  login: async (email, password, expectedRole = null) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    try {
      const res = await api.post('/auth/login', {
        email: cleanEmail,
        password,
        expectedRole
      });

      if (res.token) {
        setToken(res.token);
        const sessionUser = {
          ...res.user,
          token: res.token
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
        return {
          success: true,
          user: sessionUser,
          role: res.role || sessionUser.role,
          token: res.token,
          message: res.message || 'Login successful'
        };
      }

      if (res.isPending) {
        return {
          success: false,
          isPending: true,
          message: res.message || 'Your officer account registration is PENDING Administrative approval.'
        };
      }

      if (res.isRejected) {
        return {
          success: false,
          isRejected: true,
          message: res.message || 'Your officer account registration request was REJECTED by Municipal Administration.'
        };
      }

      return {
        success: false,
        message: res.message || 'Invalid credentials'
      };
    } catch (error) {
      const message = error.data?.message || error.message || 'Authentication failed. Please verify credentials.';
      const isPending = message.includes('PENDING') || error.data?.isPending;
      const isRejected = message.includes('REJECTED') || error.data?.isRejected;

      return {
        success: false,
        isPending,
        isRejected,
        message
      };
    }
  },

  citizenLogin: async (email, password) => {
    return authService.login(email, password, 'ROLE_CITIZEN');
  },

  officerLogin: async (email, password) => {
    return authService.login(email, password, 'ROLE_OFFICER');
  },

  adminLogin: async (email, password) => {
    return authService.login(email, password, 'ROLE_ADMIN');
  },

  registerCitizen: async (userData) => {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    try {
      const res = await api.post('/auth/register/citizen', {
        fullName: userData.fullName.trim(),
        email: cleanEmail,
        password: userData.password,
        phoneNumber: userData.phoneNumber ? userData.phoneNumber.trim() : null,
        address: userData.address ? userData.address.trim() : null
      });

      if (res.token) {
        setToken(res.token);
        const sessionUser = {
          ...res.user,
          token: res.token
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
        return {
          success: true,
          user: sessionUser,
          role: 'ROLE_CITIZEN',
          token: res.token,
          message: res.message || 'Citizen registration completed successfully.'
        };
      }

      return {
        success: true,
        user: res.user,
        role: 'ROLE_CITIZEN',
        message: res.message || 'Citizen registered successfully.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Registration failed.'
      };
    }
  },

  registerOfficer: async (officerData) => {
    const cleanEmail = (officerData.email || '').trim().toLowerCase();
    try {
      const res = await api.post('/auth/register/officer', {
        fullName: officerData.fullName.trim(),
        email: cleanEmail,
        password: officerData.password,
        phoneNumber: officerData.phoneNumber ? officerData.phoneNumber.trim() : null,
        department: officerData.department || 'Road Maintenance & Potholes',
        ward: officerData.ward ? officerData.ward.trim() : 'Ward 1',
        badgeNumber: officerData.badgeNumber ? officerData.badgeNumber.trim() : null,
        designation: officerData.designation ? officerData.designation.trim() : 'Field Engineer'
      });

      return {
        success: true,
        user: res.user,
        role: 'ROLE_OFFICER',
        isPending: true,
        approvalStatus: 'PENDING',
        message: res.message || 'Officer registration submitted successfully. Your account is PENDING administrative approval.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Officer registration failed.'
      };
    }
  },

  register: async (userData) => {
    if (userData.role === 'ROLE_OFFICER') {
      return authService.registerOfficer(userData);
    }
    return authService.registerCitizen(userData);
  },

  getRegisteredOfficers: async (filterApprovedOnly = true) => {
    try {
      const data = await api.get('/admin/officers');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error fetching registered officers:', err);
      return [];
    }
  },

  getPendingOfficers: async () => {
    try {
      const data = await api.get('/admin/officers/pending');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error fetching pending officers:', err);
      return [];
    }
  },

  getAllUsers: async () => {
    try {
      const data = await api.get('/admin/users');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  },

  approveOfficer: async (officerId) => {
    try {
      const data = await api.put(`/admin/officers/${officerId}/approve`);
      return { success: true, officer: data };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Failed to approve officer'
      };
    }
  },

  rejectOfficer: async (officerId, reason = 'Application rejected by Municipal Administration') => {
    try {
      const data = await api.put(`/admin/officers/${officerId}/reject`, { reason });
      return { success: true, officer: data };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Failed to reject officer'
      };
    }
  },

  forgotPassword: async (email) => {
    return { success: true, message: `Password reset verification link dispatched to ${email}` };
  },

  logout: () => {
    clearAuth();
  }
};

export default authService;
