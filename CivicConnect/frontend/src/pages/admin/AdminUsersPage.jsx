import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';

export const AdminUsersPage = () => {
  const { approveOfficer, rejectOfficer } = useAuth();
  const [users, setUsers] = useState(adminService.getUsers());
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const refreshUsers = () => {
    setUsers(adminService.getUsers());
  };

  const handleApprove = (officerId, officerName) => {
    approveOfficer(officerId);
    refreshUsers();
    setActionNotice(`Officer ${officerName} has been APPROVED! They can now log in and be assigned grievances.`);
    setTimeout(() => setActionNotice(''), 4500);
  };

  const handleReject = (officerId, officerName) => {
    rejectOfficer(officerId);
    refreshUsers();
    setActionNotice(`Officer ${officerName} application has been REJECTED.`);
    setTimeout(() => setActionNotice(''), 4500);
  };

  const pendingOfficers = users.filter(
    u => u.role === 'ROLE_OFFICER' && u.approvalStatus === 'PENDING'
  );

  const filteredUsers = users.filter(u => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      u.fullName.toLowerCase().includes(cleanSearch) ||
      u.email.toLowerCase().includes(cleanSearch) ||
      (u.badgeNumber && u.badgeNumber.toLowerCase().includes(cleanSearch)) ||
      (u.department && u.department.toLowerCase().includes(cleanSearch));

    if (roleFilter === 'OFFICERS') return matchesSearch && u.role === 'ROLE_OFFICER';
    if (roleFilter === 'CITIZENS') return matchesSearch && u.role === 'ROLE_CITIZEN';
    if (roleFilter === 'PENDING') return matchesSearch && u.role === 'ROLE_OFFICER' && u.approvalStatus === 'PENDING';
    return matchesSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Personnel Directory
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Officers & Users Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review pending officer applications, verify badge credentials, and manage system accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingOfficers.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
              <Clock className="w-4 h-4 text-amber-600" />
              {pendingOfficers.length} Pending Approval
            </span>
          )}
          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
            {users.length} Total Registered
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{actionNotice}</span>
        </div>
      )}

      {/* Section 29: Pending Officer Registrations Review Box */}
      {pendingOfficers.length > 0 && (
        <div className="p-5 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-950">
                  Pending Officer Applications Requiring Approval
                </h2>
                <p className="text-xs text-amber-800">
                  These municipal officers registered publicly and cannot log in or be assigned tasks until approved.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOfficers.map((officer) => (
              <div key={officer.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{officer.fullName}</h3>
                    <p className="text-xs text-slate-500">{officer.email}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                    PENDING APPROVAL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Department:</span>
                    <span className="font-semibold text-slate-800">{officer.department || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Badge ID:</span>
                    <span className="font-mono font-bold text-teal-700">{officer.badgeNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Designation:</span>
                    <span className="text-slate-800">{officer.designation || 'Field Engineer'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ward / Area:</span>
                    <span className="text-slate-800">{officer.ward || 'Ward 4'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-300 text-rose-700 hover:bg-rose-50"
                    icon={UserX}
                    onClick={() => handleReject(officer.id, officer.fullName)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    icon={UserCheck}
                    onClick={() => handleApprove(officer.id, officer.fullName)}
                  >
                    Approve Officer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name, email, department, badge number..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto">
          {['ALL', 'OFFICERS', 'CITIZENS', 'PENDING'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setRoleFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab === 'OFFICERS' ? 'Officers' : tab === 'CITIZENS' ? 'Citizens' : `Pending (${pendingOfficers.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User / Official</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Department / Ward</th>
                <th className="py-3 px-4">Badge / Designation</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{user.fullName}</div>
                      <div className="text-[10px] text-slate-400">UID #{user.id}</div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{user.email}</div>
                    <div className="text-[11px] text-slate-400">{user.phoneNumber || 'N/A'}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      user.role === 'ROLE_ADMIN'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : user.role === 'ROLE_OFFICER'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}>
                      {user.role === 'ROLE_ADMIN' ? 'Admin' : user.role === 'ROLE_OFFICER' ? 'Officer' : 'Citizen'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{user.department || 'Citizen Complainant'}</div>
                    <div className="text-[11px] text-slate-400">{user.ward || user.address || 'Central'}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {user.badgeNumber && (
                      <div className="font-mono font-semibold text-teal-700">{user.badgeNumber}</div>
                    )}
                    <div className="text-[11px]">{user.designation || (user.role === 'ROLE_CITIZEN' ? 'Resident' : 'Official')}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      user.approvalStatus === 'APPROVED' || !user.approvalStatus
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : user.approvalStatus === 'PENDING'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}>
                      {user.approvalStatus || 'APPROVED'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {user.role === 'ROLE_OFFICER' && user.approvalStatus === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-700 hover:bg-emerald-50 font-bold"
                          onClick={() => handleApprove(user.id, user.fullName)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-700 hover:bg-rose-50"
                          onClick={() => handleReject(user.id, user.fullName)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
