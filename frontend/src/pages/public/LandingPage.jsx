import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  ArrowRight,
  Search,
  Camera,
  MapPin,
  Building2,
  CheckCircle2,
  FileText,
  Clock,
  Compass,
  Layers,
  UserCheck,
  CheckCheck,
  Star
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';

export const LandingPage = () => {
  const { complaints } = useComplaints();
  const { isAuthenticated, isCitizen } = useAuth();
  const [trackRefNo, setTrackRefNo] = useState('');
  const [trackError, setTrackError] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const cleanRef = trackRefNo.trim();
    if (!cleanRef) {
      setTrackError('Please enter a complaint reference number (e.g. CC-20261014-1234)');
      return;
    }
    const found = complaints.find(
      c => c.complaintRefNo.toLowerCase() === cleanRef.toLowerCase()
    );
    if (found) {
      navigate(`/public-issues/${found.id}`);
    } else {
      setTrackError('No public grievance matches this reference number. Please check the code.');
    }
  };

  const reportButtonDestination = isAuthenticated
    ? (isCitizen ? '/citizen/report' : '/public-issues')
    : '/login';

  const capabilities = [
    { title: 'Easy Issue Reporting', desc: 'Capture geotagged photos, categorize civic hazards, and register complaints in under two minutes.', icon: Camera },
    { title: 'Location-Based Tracking', desc: 'Exact GIS pinpointing ensures municipal field teams locate and verify site coordinates accurately.', icon: MapPin },
    { title: 'Transparent Status Updates', desc: 'Track tickets from initial submission through municipal assignment to field repair in real time.', icon: Clock },
    { title: 'Department-Based Routing', desc: 'Smart routing directs grievances straight to responsible civic departments like Roads, Waste, or Water.', icon: Layers },
    { title: 'Officer Assignment', desc: 'Municipal supervisors allocate verified field engineers with badge-level accountability.', icon: UserCheck },
    { title: 'Proof-Based Resolution', desc: 'Field teams must upload mandatory photo proof of completed repairs before marking work resolved.', icon: CheckCheck },
    { title: 'SLA Monitoring', desc: 'Guaranteed municipal Service Level Agreements ensure time-bound turnaround and citizen satisfaction.', icon: ShieldCheck }
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Report',
      desc: 'Citizen reports a civic issue with details, photo and location.',
      icon: Camera
    },
    {
      num: '02',
      title: 'Assign',
      desc: 'The issue is routed to the relevant department and officer.',
      icon: Layers
    },
    {
      num: '03',
      title: 'Resolve',
      desc: 'The assigned officer works on the issue and uploads proof.',
      icon: CheckCircle2
    },
    {
      num: '04',
      title: 'Verify',
      desc: 'The citizen receives the resolution and can provide feedback.',
      icon: Star
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-teal-400 text-xs font-semibold px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart Public Grievance Redressal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Empowering Citizens, <br />
              <span className="text-teal-400">Transforming Neighborhoods</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Report civic infrastructure defects—from potholes and defective streetlights to garbage piles—with geotagged photos and real-time SLA tracking.
            </p>

            {/* Quick Reference Tracker */}
            <div className="max-w-md mx-auto pt-2">
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={trackRefNo}
                    onChange={(e) => {
                      setTrackRefNo(e.target.value);
                      setTrackError('');
                    }}
                    placeholder="Search complaint ref (e.g. CC-...)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" icon={ArrowRight}>
                  Track
                </Button>
              </form>
              {trackError && <p className="text-xs text-rose-400 mt-2 font-medium text-left">{trackError}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link to={reportButtonDestination}>
                <Button variant="primary" size="md" icon={Camera}>
                  Report an Issue
                </Button>
              </Link>
              <Link to="/public-issues">
                <Button variant="outline" size="md" className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
                  Explore Public Issues
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What CivicConnect Provides Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Transparent Governance Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A digital bridge connecting residents, municipal field crews, and administrative authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="p-5 space-y-3 border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Simple 4-Step Process Section */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Redressal Lifecycle
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Simple 4-Step Resolution Process
            </h2>
            <p className="text-xs text-slate-500">
              End-to-end accountability at every stage from reporting to citizen verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                      {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Public Grievance Feed Preview */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Public Grievances</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live citizen complaints logged across city municipal wards.</p>
          </div>
          <Link to="/public-issues">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              View All Complaints
            </Button>
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No Grievances Logged Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Help keep our city clean, safe, and functioning by reporting infrastructure defects in your neighborhood.
            </p>
            <div className="pt-2">
              <Link to={reportButtonDestination}>
                <Button variant="primary" size="sm" icon={Camera}>
                  File First Grievance
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {complaints.slice(0, 3).map((item) => (
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
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{item.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{item.department}</span>
                  <span className="text-teal-600 font-semibold">View Status →</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
