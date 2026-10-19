import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  Camera,
  Send,
  UserCheck,
  Star,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Clock,
  Layers,
  Wrench,
  ThumbsUp
} from 'lucide-react';

export const HowItWorksPage = () => {
  const { isAuthenticated, isCitizen } = useAuth();

  const reportButtonDestination = isAuthenticated
    ? (isCitizen ? '/citizen/report' : '/public-issues')
    : '/login';

  const steps = [
    {
      num: '01',
      title: 'Citizen Submits Grievance',
      desc: 'Citizen captures a photo of the defect, such as a pothole or broken streetlight, and selects the category. Geolocation is attached automatically.',
      icon: Camera
    },
    {
      num: '02',
      title: 'Automated Routing & Assignment',
      desc: 'The system generates a unique tracking reference, for example: CC-20260818-0101. The issue is routed to the relevant municipal department based on category and jurisdiction.',
      icon: Send
    },
    {
      num: '03',
      title: 'Field Team Deployment',
      desc: 'Assigned municipal engineers inspect the location, change the state to IN_PROGRESS, and carry out the required repair within the SLA window.',
      icon: UserCheck
    },
    {
      num: '04',
      title: 'Resolution Verification & Rating',
      desc: 'After resolution proof is uploaded, the citizen is notified and can provide a 1–5 star rating and feedback before closing the ticket.',
      icon: Star
    }
  ];

  const lifecycleStages = [
    {
      status: 'PENDING',
      sub: 'Logged by Citizen',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock
    },
    {
      status: 'ASSIGNED',
      sub: 'Assigned to Officer',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: UserCheck
    },
    {
      status: 'IN_PROGRESS',
      sub: 'Repair in Progress',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: Wrench
    },
    {
      status: 'RESOLVED',
      sub: 'Field Fix Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2
    },
    {
      status: 'CLOSED',
      sub: 'Citizen Feedback',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: ThumbsUp
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How CivicConnect Operates
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From issue discovery to field repair and citizen satisfaction rating, our transparent lifecycle guarantees accountability at every stage.
        </p>
      </div>

      {/* Four Clean Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.num} className="p-6 relative flex flex-col justify-between border-slate-200 hover:border-slate-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-200">{step.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-base">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Complaint Lifecycle Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            State Machine
          </span>
          <h2 className="text-xl font-bold text-slate-900">Complaint Lifecycle Progression</h2>
          <p className="text-xs text-slate-500">Every grievance transitions through auditable verification checkpoints.</p>
        </div>

        {/* Desktop Horizontal / Mobile Vertical Lifecycle */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          {lifecycleStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  <Icon className="w-4 h-4 text-slate-700" />
                </div>
                <div className={`px-2.5 py-0.5 rounded text-xs font-bold border ${stage.badgeClass}`}>
                  {stage.status}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {stage.sub}
                </p>
                {idx < lifecycleStages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-2">
        <Link to={reportButtonDestination}>
          <Button variant="primary" size="lg" icon={Camera}>
            File a Report Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
