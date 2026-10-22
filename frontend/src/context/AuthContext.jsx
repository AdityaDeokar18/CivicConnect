import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const cached = authService.getCurrentUser();
      if (cached) {
        setCurrentUser(cached);
        try {
          const fresh = await authService.fetchCurrentUser();
          if (fresh) {
            setCurrentUser(fresh);
          }
        } catch {
          // Token expired or invalid
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password, expectedRole = null) => {
    const res = await authService.login(email, password, expectedRole);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const citizenLogin = async (email, password) => {
    return login(email, password, 'ROLE_CITIZEN');
  };

  const officerLogin = async (email, password) => {
    return login(email, password, 'ROLE_OFFICER');
  };

  const adminLogin = async (email, password) => {
    return login(email, password, 'ROLE_ADMIN');
  };

  const registerCitizen = async (userData) => {
    const res = await authService.registerCitizen(userData);
    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const registerOfficer = async (officerData) => {
    return await authService.registerOfficer(officerData);
  };

  const register = async (userData) => {
    if (userData.role === 'ROLE_OFFICER') {
      return registerOfficer(userData);
    }
    return registerCitizen(userData);
  };

  const approveOfficer = async (officerId) => {
    return await authService.approveOfficer(officerId);
  };

  const rejectOfficer = async (officerId, reason) => {
    return await authService.rejectOfficer(officerId, reason);
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    login,
    citizenLogin,
    officerLogin,
    adminLogin,
    register,
    registerCitizen,
    registerOfficer,
    approveOfficer,
    rejectOfficer,
    logout,
    isAuthenticated: !!currentUser,
    role: currentUser?.role || null,
    isAdmin: currentUser?.role === 'ROLE_ADMIN',
    isOfficer: currentUser?.role === 'ROLE_OFFICER',
    isCitizen: currentUser?.role === 'ROLE_CITIZEN'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
