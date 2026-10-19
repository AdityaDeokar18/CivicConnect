import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { mockDepartments } from '../../data/mockDepartments';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { MapPin, Calendar, Clock, Eye, Search, Filter, RotateCcw, Building2 } from 'lucide-react';

export const PublicIssuesPage = () => {
  const { complaints } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [wardFilter, setWardFilter] = useState('ALL');
  const navigate = useNavigate();

  // Distinct wards and categories from departments
  const allCategories = Array.from(new Set(mockDepartments.flatMap(d => d.categories || [])));
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 12'];

  const filtered = complaints.filter(c => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      c.complaintRefNo.toLowerCase().includes(cleanSearch) ||
      c.title.toLowerCase().includes(cleanSearch) ||
      c.address.toLowerCase().includes(cleanSearch);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesDept = deptFilter === 'ALL' || c.department === deptFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesWard = wardFilter === 'ALL' || (c.ward && c.ward === wardFilter) || c.address.includes(wardFilter);

    return matchesSearch && matchesStatus && matchesDept && matchesCategory && matchesWard;
  });

  const handleReset = () => {
    setSearchTerm('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setDeptFilter('ALL');
    setWardFilter('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Public Grievances Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore citizen-reported issues across municipal wards with transparent live tracking.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search complaint reference number..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2 bg-white text-slate-700 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {allCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2 bg-white text-slate-700 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2 bg-white text-slate-700 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {mockDepartments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Location / Ward */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Location / Ward
            </label>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2 bg-white text-slate-700 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Wards</option>
              {wards.map((w, idx) => (
                <option key={idx} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear filters action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Showing <b>{filtered.length}</b> grievances
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Complaints List or Clean Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No grievances match your criteria"
          description={complaints.length === 0 ? "No citizen complaints have been logged in the platform yet." : "Try adjusting your search query or reset the filters to see reported complaints."}
          actionLabel={complaints.length > 0 ? "Reset Filters" : undefined}
          onAction={complaints.length > 0 ? handleReset : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <Card
              key={item.id}
              hoverable
              onClick={() => navigate(`/public-issues/${item.id}`)}
              className="flex flex-col justify-between p-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {item.complaintRefNo}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                {item.images?.[0] && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <h3 className="font-bold text-sm text-slate-800 line-clamp-2">{item.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium text-slate-700">{item.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.address} {item.ward && `(${item.ward})`}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-teal-600">
                <span className="text-slate-500">{item.category}</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Details
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicIssuesPage;
