import React from 'react';
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
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Building2
} from 'lucide-react';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { myComplaints } = useComplaints();
  const navigate = useNavigate();

  // Section 16: Show actual application data only
  const totalFiled = myComplaints.length;
  const pendingCount = myComplaints.filter(c => c.status === 'PENDING').length;
  const inProgressCount = myComplaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolvedCount = myComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Citizen Dashboard
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Welcome, {currentUser?.fullName || 'Citizen'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your citizen-reported grievances, view field resolution proofs, and verify repairs.
          </p>
        </div>
        <div>
          <Link to="/citizen/report">
            <Button variant="primary" icon={PlusCircle} size="md">
              Report an Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Actual Data Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={totalFiled}
          subtitle="Your logged grievances"
          icon={FileText}
          color="teal"
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          subtitle="Awaiting municipal action"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Assigned or field repair active"
          icon={AlertCircle}
          color="blue"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Field fix verified & closed"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Recent Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Complaints</h2>
            <p className="text-xs text-slate-500">Only complaints actually created by your account</p>
          </div>
          {myComplaints.length > 0 && (
            <Link to="/citizen/complaints" className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {myComplaints.length === 0 ? (
          <EmptyState
            title="No complaints yet"
            description="You have not reported any civic infrastructure issues in your neighborhood."
            actionLabel="Report Your First Issue"
            onAction={() => navigate('/citizen/report')}
          />
        ) : (
          <div className="space-y-3">
            {myComplaints.slice(0, 5).map((item) => (
              <Card
                key={item.id}
                hoverable
                onClick={() => navigate(`/citizen/complaints/${item.id}`)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-200"
              >
                <div className="flex items-start gap-3.5">
                  {item.images?.[0] ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.complaintRefNo}
                      </span>
                      <PriorityBadge priority={item.priority} size="sm" />
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" /> {item.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {item.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />{' '}
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end sm:self-center shrink-0">
                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 font-semibold">
                    View Details →
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

export default DashboardPage;
