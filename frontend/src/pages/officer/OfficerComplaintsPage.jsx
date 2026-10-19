import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import OfficerProofModal from '../../components/officer/OfficerProofModal';
import {
  Wrench,
  Eye,
  MapPin,
  Calendar,
  CheckCircle2,
  Search,
  RotateCcw,
  Building2,
  CheckCheck
} from 'lucide-react';

export const OfficerComplaintsPage = () => {
  const { currentUser } = useAuth();
  const { officerComplaints, startWork, resolveComplaint } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = officerComplaints.filter(c => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      c.title.toLowerCase().includes(cleanSearch) ||
      c.complaintRefNo.toLowerCase().includes(cleanSearch) ||
      c.address.toLowerCase().includes(cleanSearch) ||
      c.citizenName?.toLowerCase().includes(cleanSearch) ||
      c.category.toLowerCase().includes(cleanSearch);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenActionModal = (complaint, e) => {
    e.stopPropagation();
    setSelectedComplaint(complaint);
    setProofModalOpen(true);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Field Redressal Orders
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Assigned Tasks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grievances allocated to Badge: <b>{currentUser?.badgeNumber || 'PWD-ENG'}</b> ({currentUser?.department || 'Municipal Division'})
          </p>
        </div>

        <div className="text-xs font-semibold bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200">
          {officerComplaints.length} Total Assigned
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks by title, ref no, location, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-slate-500 mr-1.5">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs rounded-lg border border-slate-300 py-1 px-2 bg-white text-slate-700"
              >
                <option value="ALL">All Statuses ({officerComplaints.length})</option>
                <option value="ASSIGNED">ASSIGNED (Needs Start Proof)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Needs Resolution Proof)</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div>
              <span className="text-slate-500 mr-1.5">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs rounded-lg border border-slate-300 py-1 px-2 bg-white text-slate-700"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">URGENT</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title={officerComplaints.length === 0 ? "No assigned tasks" : "No matching work orders"}
          description={officerComplaints.length === 0 ? "You do not have any complaints assigned to your officer account currently." : "Try adjusting your search query or reset the filters."}
          actionLabel={officerComplaints.length > 0 ? "Reset Filters" : undefined}
          onAction={officerComplaints.length > 0 ? handleReset : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              hoverable
              onClick={() => navigate(`/officer/complaints/${item.id}`)}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-200"
            >
              <div className="flex items-start gap-4">
                {item.images?.[0] ? (
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-18 h-18 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                    <Wrench className="w-7 h-7" />
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

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.address} {item.ward && `(${item.ward})`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />{' '}
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                    <span className="text-slate-700 font-medium">
                      Citizen: {item.citizenName || 'Resident'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 md:self-center shrink-0" onClick={(e) => e.stopPropagation()}>
                {item.status === 'ASSIGNED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-blue-700 hover:bg-blue-800"
                    icon={Wrench}
                    onClick={(e) => handleOpenActionModal(item, e)}
                  >
                    Start Work
                  </Button>
                )}

                {item.status === 'IN_PROGRESS' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    icon={CheckCircle2}
                    onClick={(e) => handleOpenActionModal(item, e)}
                  >
                    Mark as Resolved
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => navigate(`/officer/complaints/${item.id}`)}
                >
                  Task Dossier
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Proof-Based Status Modal */}
      <OfficerProofModal
        isOpen={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
        complaint={selectedComplaint}
        onStartWork={startWork}
        onResolve={resolveComplaint}
      />
    </div>
  );
};

export default OfficerComplaintsPage;
