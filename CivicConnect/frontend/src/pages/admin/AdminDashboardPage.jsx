import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

export const AdminDashboardPage = () => {
  const { complaints } = useComplaints();
  const navigate = useNavigate();
  const analytics = adminService.getAnalyticsSummary(complaints);

  const pieColors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#059669'];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Municipal Dispatch Command
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central monitoring of citizen-reported infrastructure grievances, SLA performance, and officer assignments.
          </p>
        </div>

        <div>
          <Link to="/admin/complaints">
            <Button variant="primary" icon={FileText} size="md" className="bg-slate-900 hover:bg-slate-800">
              Manage All Complaints ({complaints.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Actual Statistics Grid per Section 27 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total"
          value={analytics.total}
          subtitle="All grievances"
          icon={FileText}
          color="teal"
        />
        <StatCard
          title="Pending"
          value={analytics.pending}
          subtitle="Awaiting assignment"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Assigned"
          value={analytics.assigned}
          subtitle="Dispatched to officer"
          icon={UserCheck}
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={analytics.inProgress}
          subtitle="Field crew active"
          icon={AlertTriangle}
          color="purple"
        />
        <StatCard
          title="Resolved"
          value={analytics.resolved}
          subtitle="Awaiting citizen rating"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Closed"
          value={analytics.closed}
          subtitle="Verified & rated"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Analytics Charts (Rendered from real application data) */}
      {complaints.length === 0 ? (
        <EmptyState
          title="No grievances recorded yet"
          description="Live charts and status distributions will populate automatically as citizens file complaints."
          actionLabel="View Public Portal"
          onAction={() => navigate('/public-issues')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Resolution Bar Chart */}
          <Card className="lg:col-span-2 p-6 space-y-4 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Department Workload Distribution</h2>
                <p className="text-xs text-slate-500">Total assigned complaints vs resolved per division</p>
              </div>
              <Link to="/admin/analytics">
                <Button variant="ghost" size="sm" className="text-xs text-teal-700 font-semibold">
                  Full Analytics <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.deptPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="code" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Total Assigned" />
                  <Bar dataKey="resolved" fill="#0d9488" radius={[4, 4, 0, 0]} name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Status Split Pie */}
          <Card className="p-6 space-y-4 border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Operational Status Split</h2>
              <p className="text-xs text-slate-500">Live complaint lifecycle distribution</p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusData.filter(s => s.count > 0)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {analytics.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              {analytics.statusData.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                  <span className="text-slate-600 truncate">{s.name}: <b>{s.count}</b></span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recent Complaints Table */}
      {complaints.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent Complaints Action Queue</h2>
              <p className="text-xs text-slate-500">Latest tickets requiring administrative monitoring or officer assignment</p>
            </div>
            <Link to="/admin/complaints">
              <Button variant="outline" size="sm">
                View All ({complaints.length})
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Ref No & Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Officer Assigned</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          {item.complaintRefNo}
                        </span>
                        <div className="font-medium text-slate-800 line-clamp-1 mt-1">{item.title}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={item.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{item.department}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.assignedOfficer ? (
                          <span className="font-semibold text-slate-800">{item.assignedOfficer.name}</span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/complaints/${item.id}`)}
                          className="text-teal-700 hover:text-teal-800 font-bold"
                        >
                          Manage →
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
