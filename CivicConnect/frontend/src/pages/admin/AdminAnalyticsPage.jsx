import React from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { adminService } from '../../services/adminService';
import { mockDepartments } from '../../data/mockDepartments';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import EmptyState from '../../components/common/EmptyState';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  PieChart as PieIcon,
  Building2,
  ShieldCheck
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
  CartesianGrid,
  Legend
} from 'recharts';

export const AdminAnalyticsPage = () => {
  const { complaints } = useComplaints();
  const analytics = adminService.getAnalyticsSummary(complaints);

  const statusColors = {
    PENDING: '#f59e0b',
    ASSIGNED: '#3b82f6',
    IN_PROGRESS: '#8b5cf6',
    RESOLVED: '#10b981',
    CLOSED: '#059669'
  };

  const statusData = [
    { name: 'Pending', value: complaints.filter(c => c.status === 'PENDING').length, color: statusColors.PENDING },
    { name: 'Assigned', value: complaints.filter(c => c.status === 'ASSIGNED').length, color: statusColors.ASSIGNED },
    { name: 'In Progress', value: complaints.filter(c => c.status === 'IN_PROGRESS').length, color: statusColors.IN_PROGRESS },
    { name: 'Resolved', value: complaints.filter(c => c.status === 'RESOLVED').length, color: statusColors.RESOLVED },
    { name: 'Closed', value: complaints.filter(c => c.status === 'CLOSED').length, color: statusColors.CLOSED },
  ].filter(item => item.value > 0);

  // Department counts
  const deptData = mockDepartments.map(dept => {
    const deptComplaints = complaints.filter(c => c.department === dept.name || c.department === dept.code);
    const resolved = deptComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
    const inProgress = deptComplaints.filter(c => c.status === 'IN_PROGRESS').length;
    const pending = deptComplaints.filter(c => c.status === 'PENDING' || c.status === 'ASSIGNED').length;
    const slaRate = deptComplaints.length > 0 ? Math.round((resolved / deptComplaints.length) * 100) : 100;

    return {
      name: dept.name,
      code: dept.code,
      total: deptComplaints.length,
      resolved,
      inProgress,
      pending,
      slaRate,
      slaHours: dept.slaHours
    };
  });

  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const activeCount = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;

  const overallResolutionRate = totalComplaints > 0 
    ? Math.round((resolvedCount / totalComplaints) * 100) 
    : 0;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
            Performance Metrics
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Civic Analytics & SLAs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time grievance metrics, department resolution rates, and municipal turnaround efficiency.
          </p>
        </div>
      </div>

      {totalComplaints === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={BarChart3}
            title="No Grievance Data Available Yet"
            description="Municipal analytics and SLA compliance statistics will be computed dynamically as citizens file grievances and field officers resolve them."
          />
        </Card>
      ) : (
        <>
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Logged"
              value={totalComplaints}
              subtitle="All citizen submissions"
              icon={FileText}
              color="teal"
            />
            <StatCard
              title="Active In-Field"
              value={activeCount}
              subtitle="Assigned or in progress"
              icon={Clock}
              color="blue"
            />
            <StatCard
              title="Resolved & Closed"
              value={resolvedCount}
              subtitle={`${overallResolutionRate}% resolution rate`}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Unassigned / Pending"
              value={pendingCount}
              subtitle="Awaiting officer allocation"
              icon={AlertTriangle}
              color="amber"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Grievance Status Breakdown</h3>
                <p className="text-xs text-slate-500">Distribution of complaints across the resolution lifecycle</p>
              </div>

              {statusData.length > 0 ? (
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={45}
                        paddingAngle={4}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                        formatter={(val, name) => [`${val} complaints`, name]}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                  No status data available
                </div>
              )}
            </Card>

            {/* Department Volume */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Complaints by Department</h3>
                <p className="text-xs text-slate-500">Workload distribution across municipal departments</p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="code" 
                      tick={{ fontSize: 10 }} 
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val, name) => [`${val} complaints`, name === 'total' ? 'Total Logged' : 'Resolved']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="total" fill="#0d9488" radius={[4, 4, 0, 0]} name="Total Filed" />
                    <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Department Breakdown Table */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Department Performance & SLA Adherence Summary</h3>
                <p className="text-xs text-slate-500">Real-time status based on live complaints recorded in the system</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Municipal Department</th>
                    <th className="py-3 px-4">Target SLA</th>
                    <th className="py-3 px-4">Total Filed</th>
                    <th className="py-3 px-4">In Progress</th>
                    <th className="py-3 px-4">Resolved</th>
                    <th className="py-3 px-4 text-right">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deptData.map((dept, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {dept.code}
                          </span>
                          <span>{dept.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {dept.slaHours} Hours
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">
                        {dept.total}
                      </td>
                      <td className="py-3.5 px-4 text-blue-600 font-semibold">
                        {dept.inProgress}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-700 font-semibold">
                        {dept.resolved}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {dept.total > 0 ? (
                          <span className="inline-block bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded border border-teal-200">
                            {dept.slaRate}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
