import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import {
  Menu,
  Bell,
  User,
  LogOut,
  PlusCircle,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import Button from '../common/Button';

export const PortalLayout = ({ roleType }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, isCitizen, isOfficer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNotificationsPath = () => {
    if (isAdmin) return '/admin/notifications';
    if (isOfficer) return '/officer/notifications';
    return '/citizen/notifications';
  };

  const getProfilePath = () => {
    if (isAdmin) return '/admin/profile';
    if (isOfficer) return '/officer/profile';
    return '/citizen/profile';
  };

  const getPortalLabel = () => {
    if (isAdmin) return 'Municipal Central Administration';
    if (isOfficer) return 'Field Officer Redressal Desk';
    return 'Citizen Grievance Portal';
  };

  return (
    <div className="flex h-screen bg-slate-100/70 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        type={roleType}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {isAdmin ? 'Admin Authority' : isOfficer ? 'Municipal Officer' : 'Citizen'}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                  {getPortalLabel()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Citizen Quick Action */}
            {isCitizen && (
              <Link to="/citizen/report" className="hidden sm:inline-block">
                <Button variant="primary" size="sm" icon={PlusCircle}>
                  Report Issue
                </Button>
              </Link>
            )}

            {/* Public Grievance Feed quick access */}
            <Link
              to="/public-issues"
              className="hidden lg:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors"
              title="View Public Issues"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Feed</span>
            </Link>

            {/* Notifications */}
            <Link
              to={getNotificationsPath()}
              className={`p-2 rounded-lg transition-colors relative ${
                location.pathname === getNotificationsPath()
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </Link>

            {/* User Profile Pill */}
            <Link
              to={getProfilePath()}
              className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                location.pathname === getProfilePath()
                  ? 'border-teal-500 bg-teal-50/50 text-teal-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="truncate max-w-[120px] font-semibold">{currentUser?.fullName}</span>
            </Link>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Portal View */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
