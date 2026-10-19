import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import {
  FileText,
  MapPin,
  Calendar,
  Building2,
  UserCheck,
  Search,
  Eye,
  PlusCircle,
  Clock
} from 'lucide-react';

export const MyComplaintsPage = () => {
  const { myComplaints } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  const filtered = myComplaints.filter(c => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      c.complaintRefNo.toLowerCase().includes(cleanSearch) ||
      c.title.toLowerCase().includes(cleanSearch) ||
      c.category.toLowerCase().includes(cleanSearch) ||
      c.address.toLowerCase().includes(cleanSearch);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Citizen Grievances Roster
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            My Complaints
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View all grievances filed by your account, inspect assigned officers, and review resolution progress.
          </p>
        </div>
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate('/citizen/report')}
        >
          Report an Issue
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ref no, title, category, address..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2 bg-white text-slate-700 focus:ring-teal-500 focus:outline-none w-full sm:w-auto"
          >
            <option value="ALL">All Statuses ({myComplaints.length})</option>
            <option value="PENDING">PENDING</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <EmptyState
          title={myComplaints.length === 0 ? "No complaints filed yet" : "No complaints match filter"}
          description={myComplaints.length === 0 ? "You have not filed any grievances yet. If you notice defective infrastructure, file an issue to notify municipal teams." : "Try resetting your search query or status filter."}
          actionLabel={myComplaints.length === 0 ? "Report an Issue" : "Reset Filter"}
          onAction={myComplaints.length === 0 ? () => navigate('/citizen/report') : () => { setSearchTerm(''); setStatusFilter('ALL'); }}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              hoverable
              onClick={() => navigate(`/citizen/complaints/${item.id}`)}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-200"
            >
              <div className="flex items-start gap-4">
                {item.images?.[0] ? (
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-18 h-18 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                    <FileText className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {item.complaintRefNo}
                    </span>
                    <PriorityBadge priority={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="font-bold text-sm text-slate-800">{item.title}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-500 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.department}</span>
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

                  <div className="text-xs pt-1">
                    <span className="text-slate-500 font-medium">Assigned Officer: </span>
                    {item.assignedOfficer ? (
                      <span className="font-semibold text-slate-800">
                        {item.assignedOfficer.name} ({item.assignedOfficer.badgeNumber || 'Officer'})
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Pending Assignment
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end md:self-center shrink-0">
                <Button variant="outline" size="sm" icon={Eye}>
                  View Details & Timeline
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaintsPage;
