import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Calendar,
  Eye,
  Building2,
  FileCheck
} from 'lucide-react';

export const OfficerDashboardPage = () => {
  const { currentUser } = useAuth();
  const { officerComplaints } = useComplaints();
  const navigate = useNavigate();

  // Section 22: Show only assigned complaints to logged in officer
  const totalAssigned = officerComplaints.length;
  const pendingAction = officerComplaints.filter(c => c.status === 'ASSIGNED').length;
  const inProgress = officerComplaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = officerComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
              Officer Workstation
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono font-semibold text-slate-600">
              Badge: {currentUser?.badgeNumber || 'OFF-FIELD'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-600">
              {currentUser?.department || 'Municipal Division'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Welcome, {currentUser?.fullName || 'Municipal Officer'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your allocated work orders, record on-site inspection proof, and verify infrastructure repairs.
          </p>
        </div>

        <div>
          <Link to="/officer/complaints">
            <Button variant="primary" icon={Wrench} size="md" className="bg-blue-700 hover:bg-blue-800">
              View Assigned Tasks ({totalAssigned})
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Tasks"
          value={totalAssigned}
          subtitle="Total assigned work orders"
          icon={Wrench}
          color="blue"
        />
        <StatCard
          title="Pending Deployment"
          value={pendingAction}
          subtitle="Awaiting inspection start"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          subtitle="Active on-site repair"
          icon={AlertTriangle}
          color="purple"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          subtitle="Fix verified with proof"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Priority Work Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Assigned Tasks Roster</h2>
            <p className="text-xs text-slate-500">Grievances assigned to your jurisdiction and badge ID</p>
          </div>
          {officerComplaints.length > 0 && (
            <Link to="/officer/complaints" className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
              All Tasks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {officerComplaints.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No active tasks assigned"
            description="You currently have zero pending work orders. Tasks dispatched by Central Administration will appear here."
          />
        ) : (
          <div className="space-y-3">
            {officerComplaints.slice(0, 5).map((item) => (
              <Card
                key={item.id}
                hoverable
                onClick={() => navigate(`/officer/complaints/${item.id}`)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-200"
              >
                <div className="flex items-start gap-4">
                  {item.images?.[0] ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                      <Wrench className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.complaintRefNo}
                      </span>
                      <PriorityBadge priority={item.priority} size="sm" />
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
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
                        Complainant: {item.citizenName || 'Resident'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:self-center shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-blue-700 hover:bg-blue-800"
                    icon={Eye}
                    onClick={() => navigate(`/officer/complaints/${item.id}`)}
                  >
                    Open Task Dossier
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboardPage;
