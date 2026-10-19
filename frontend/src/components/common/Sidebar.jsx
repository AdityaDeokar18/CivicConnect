import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  User,
  Users,
  BarChart3,
  Settings,
  Wrench,
  LogOut,
  Building2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ type, isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const activeType = type || (
    currentUser?.role === 'ROLE_ADMIN'
      ? 'admin'
      : currentUser?.role === 'ROLE_OFFICER'
      ? 'officer'
      : 'citizen'
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Section 15: Citizen Sidebar
  const citizenNavItems = [
    { to: '/citizen/dashboard', label: 'Citizen Dashboard', icon: LayoutDashboard },
    { to: '/citizen/report', label: 'Report an Issue', icon: PlusCircle },
    { to: '/citizen/complaints', label: 'My Complaints', icon: FileText },
    { to: '/citizen/notifications', label: 'Notifications', icon: Bell },
    { to: '/citizen/profile', label: 'Profile & Settings', icon: User },
  ];

  // Section 21: Officer Sidebar
  const officerNavItems = [
    { to: '/officer/dashboard', label: 'Officer Dashboard', icon: LayoutDashboard },
    { to: '/officer/complaints', label: 'Assigned Tasks', icon: Wrench },
    { to: '/officer/notifications', label: 'Notifications', icon: Bell },
    { to: '/officer/profile', label: 'Profile & Settings', icon: User },
  ];

  // Section 26: Admin Sidebar
  const adminNavItems = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'All Complaints', icon: FileText },
    { to: '/admin/users', label: 'Officers & Users', icon: Users },
    { to: '/admin/analytics', label: 'Analytics & SLAs', icon: BarChart3 },
    { to: '/admin/settings', label: 'Municipal Settings', icon: Settings },
    { to: '/admin/profile', label: 'Admin Profile', icon: User },
  ];

  let navItems = citizenNavItems;
  let portalTitle = 'Citizen Portal';
  let badgeLabel = 'Verified Resident';

  if (activeType === 'admin') {
    navItems = adminNavItems;
    portalTitle = 'Municipal Admin';
    badgeLabel = 'Central Administrator';
  } else if (activeType === 'officer') {
    navItems = officerNavItems;
    portalTitle = 'Officer Workstation';
    badgeLabel = currentUser?.designation || 'Field Engineer';
  }

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      <div className="space-y-6 p-4">
        {/* Brand / Portal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-tight block">CivicConnect</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 block">
                {portalTitle}
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Card */}
        <div className="px-3 py-2.5 bg-slate-800/70 rounded-xl border border-slate-700/60">
          <p className="text-xs font-semibold text-white truncate">
            {currentUser?.fullName || 'Active User'}
          </p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">
            {currentUser?.email}
          </p>
          <span className="inline-block mt-1.5 text-[10px] font-semibold bg-slate-900 text-teal-300 px-2 py-0.5 rounded border border-slate-700">
            {badgeLabel}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
        <div className="text-[10px] text-slate-500 px-1">
          <p className="font-semibold text-slate-400">CivicConnect Gov Platform</p>
          <p className="text-slate-600">Smart Civic Governance</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (persistent) */}
      <aside className="hidden md:block shrink-0 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
