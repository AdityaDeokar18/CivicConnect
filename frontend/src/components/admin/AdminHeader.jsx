import React from 'react';
import { ShieldCheck, Bell, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export const AdminHeader = ({ title, subtitle, onRefresh }) => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} icon={RefreshCw}>
            Sync Data
          </Button>
        )}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-800">{currentUser?.fullName || 'Administrator'}</p>
          <p className="text-[11px] text-slate-500">{currentUser?.department || 'Municipal HQ'}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
          {currentUser?.fullName?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
