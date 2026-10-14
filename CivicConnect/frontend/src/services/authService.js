import { mockUsers } from '../data/mockUsers';

const CURRENT_USER_KEY = 'civicconnect_user';
const USERS_KEY = 'civicconnect_users';

const initializeUsers = () => {
  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  } else {
    try {
      const parsed = JSON.parse(existing);
      // Ensure default admin exists
      const hasAdmin = parsed.some(u => u.role === 'ROLE_ADMIN');
      if (!hasAdmin) {
        parsed.unshift(mockUsers[0]);
        localStorage.setItem(USERS_KEY, JSON.stringify(parsed));
      }
    } catch {
      localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    }
  }
};

export const authService = {
  getCurrentUser: () => {
    initializeUsers();
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  getAllUsers: () => {
    initializeUsers();
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  login: async (email, password, expectedRole = null) => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const cleanEmail = (email || '').trim().toLowerCase();

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address. Please register first.'
      };
    }

    if (user.password && password && user.password !== password) {
      return {
        success: false,
        message: 'Invalid password. Please check your credentials.'
      };
    }

    // Role check if logging in through specific portal
    if (expectedRole && user.role !== expectedRole) {
      if (expectedRole === 'ROLE_CITIZEN' && user.role === 'ROLE_OFFICER') {
        return {
          success: false,
          message: 'This is an Officer account. Please use the Officer Login portal.'
        };
      }
      if (expectedRole === 'ROLE_OFFICER' && user.role === 'ROLE_CITIZEN') {
        return {
          success: false,
          message: 'This is a Citizen account. Please use Citizen Login.'
        };
      }
      if (expectedRole === 'ROLE_ADMIN' && user.role !== 'ROLE_ADMIN') {
        return {
          success: false,
          message: 'Access denied. Account does not have administrative privileges.'
        };
      }
    }

    // Officer Approval Check
    if (user.role === 'ROLE_OFFICER') {
      if (user.approvalStatus === 'PENDING') {
        return {
          success: false,
          isPending: true,
          message: 'Your officer account registration is PENDING Administrative approval. You will be able to log in once an Administrator verifies and approves your account.'
        };
      }
      if (user.approvalStatus === 'REJECTED') {
        return {
          success: false,
          isRejected: true,
          message: 'Your officer account registration request was REJECTED by Municipal Administration. Contact support@civicconnect.gov.in for clarification.'
        };
      }
    }

    const sessionUser = {
      ...user,
      token: `Bearer civic_jwt_${user.role}_${user.id}_${Date.now()}`
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return {
      success: true,
      user: sessionUser,
      role: sessionUser.role,
      token: sessionUser.token
    };
  },

  adminLogin: async (email, password) => {
    return authService.login(email, password, 'ROLE_ADMIN');
  },

  officerLogin: async (email, password) => {
    return authService.login(email, password, 'ROLE_OFFICER');
  },

  citizenLogin: async (email, password) => {
    return authService.login(email, password, 'ROLE_CITIZEN');
  },

  registerCitizen: async (userData) => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      };
    }

    const newCitizen = {
      id: Date.now(),
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      password: userData.password,
      role: 'ROLE_CITIZEN',
      approvalStatus: 'APPROVED',
      phoneNumber: userData.phoneNumber ? userData.phoneNumber.trim() : '',
      address: userData.address ? userData.address.trim() : '',
      registeredAt: new Date().toISOString()
    };

    users.push(newCitizen);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return {
      success: true,
      user: newCitizen,
      role: 'ROLE_CITIZEN',
      message: 'Citizen registration completed successfully.'
    };
  },

  registerOfficer: async (officerData) => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const cleanEmail = (officerData.email || '').trim().toLowerCase();

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      };
    }

    const newOfficer = {
      id: Date.now(),
      fullName: officerData.fullName.trim(),
      email: cleanEmail,
      password: officerData.password,
      role: 'ROLE_OFFICER',
      approvalStatus: 'PENDING', // Officer accounts require Admin approval before login
      phoneNumber: officerData.phoneNumber ? officerData.phoneNumber.trim() : '',
      department: officerData.department || 'Road Maintenance & Potholes',
      ward: officerData.ward ? officerData.ward.trim() : 'Ward 1',
      badgeNumber: officerData.badgeNumber ? officerData.badgeNumber.trim() : `OFF-${Math.floor(100 + Math.random() * 900)}`,
      designation: officerData.designation ? officerData.designation.trim() : 'Field Engineer',
      registeredAt: new Date().toISOString()
    };

    users.push(newOfficer);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return {
      success: true,
      user: newOfficer,
      role: 'ROLE_OFFICER',
      approvalStatus: 'PENDING',
      message: 'Officer registration submitted successfully. Your account is now pending Admin approval.'
    };
  },

  register: async (userData) => {
    if (userData.role === 'ROLE_OFFICER') {
      return authService.registerOfficer(userData);
    }
    return authService.registerCitizen(userData);
  },

  // Returns ONLY approved officers (available for complaint assignment)
  getRegisteredOfficers: (filterApprovedOnly = true) => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.filter(u => {
      if (u.role !== 'ROLE_OFFICER') return false;
      if (filterApprovedOnly) {
        return u.approvalStatus === 'APPROVED';
      }
      return true;
    });
  },

  getPendingOfficers: () => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.filter(u => u.role === 'ROLE_OFFICER' && u.approvalStatus === 'PENDING');
  },

  approveOfficer: (officerId) => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex(u => String(u.id) === String(officerId));
    if (index !== -1) {
      users[index].approvalStatus = 'APPROVED';
      users[index].approvedAt = new Date().toISOString();
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return { success: true, officer: users[index] };
    }
    return { success: false, message: 'Officer not found' };
  },

  rejectOfficer: (officerId) => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex(u => String(u.id) === String(officerId));
    if (index !== -1) {
      users[index].approvalStatus = 'REJECTED';
      users[index].rejectedAt = new Date().toISOString();
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return { success: true, officer: users[index] };
    }
    return { success: false, message: 'Officer not found' };
  },

  forgotPassword: async (email) => {
    return { success: true, message: `Password reset verification link dispatched to ${email}` };
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export default authService;
