import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { mockDepartments } from '../../data/mockDepartments';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import AssignmentModal from '../../components/admin/AssignmentModal';
import { Eye, UserCheck, MapPin, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const AdminComplaintsPage = () => {
  const { complaints, assignComplaint } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const filtered = complaints.filter(c => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      c.title.toLowerCase().includes(cleanSearch) ||
      c.complaintRefNo.toLowerCase().includes(cleanSearch) ||
      c.address.toLowerCase().includes(cleanSearch) ||
      c.citizenName?.toLowerCase().includes(cleanSearch) ||
      c.category.toLowerCase().includes(cleanSearch);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesDept = deptFilter === 'ALL' || c.department === deptFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDept && matchesPriority;
  });

  const handleOpenAssignModal = (complaint, e) => {
    e.stopPropagation();
    setSelectedComplaint(complaint);
    setAssignModalOpen(true);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setDeptFilter('ALL');
    setPriorityFilter('ALL');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Central Grievance Ledger
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            All Complaints & Work Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervise all citizen-reported civic hazards, monitor field engineer assignments, and track resolution proofs.
          </p>
        </div>

        <div className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
          {complaints.length} Total Complaints
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by ref no (CC-...), title, citizen name, address, ward..."
        />

        <FilterPanel
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          departmentFilter={deptFilter}
          onDepartmentChange={setDeptFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          departments={mockDepartments}
          onReset={handleReset}
        />
      </div>

      {/* Complaints Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={complaints.length === 0 ? "No complaints in record" : "No complaints match filters"}
          description={complaints.length === 0 ? "No citizen complaints have been registered in the system yet." : "Try adjusting your search criteria or reset filters."}
          actionLabel={complaints.length > 0 ? "Reset Filters" : undefined}
          onAction={complaints.length > 0 ? handleReset : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref No & Title</th>
                  <th className="py-3 px-4">Complainant</th>
                  <th className="py-3 px-4">Department & Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Officer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/admin/complaints/${item.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        {item.complaintRefNo}
                      </span>
                      <div className="font-semibold text-slate-800 line-clamp-1 mt-1">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">{item.address} {item.ward && `(${item.ward})`}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{item.citizenName || 'Citizen'}</div>
                      <div className="text-[11px] text-slate-400">{item.citizenPhone || item.citizenEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{item.department}</div>
                      <div className="text-[11px] text-slate-500">{item.category}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {item.assignedOfficer ? (
                        <div>
                          <div className="font-semibold text-slate-800">{item.assignedOfficer.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">{item.assignedOfficer.badgeNumber}</div>
                        </div>
                      ) : (
                        <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={UserCheck}
                          onClick={(e) => handleOpenAssignModal(item, e)}
                        >
                          {item.assignedOfficer ? 'Reassign' : 'Assign'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={() => navigate(`/admin/complaints/${item.id}`)}
                        >
                          Dossier
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        complaint={selectedComplaint}
        onAssign={assignComplaint}
      />
    </div>
  );
};

export default AdminComplaintsPage;
