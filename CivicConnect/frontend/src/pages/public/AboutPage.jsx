import React from 'react';
import Card from '../../components/common/Card';
import {
  ShieldCheck,
  Target,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  User,
  Camera,
  MapPin,
  Hash,
  History,
  FileCheck
} from 'lucide-react';

export const AboutPage = () => {
  const departments = [
    {
      code: 'PWD_ROAD',
      sla: '48 Hours',
      name: 'Road Maintenance & Potholes',
      description: 'Responsible for asphalt repair, potholes, road widening and footpaths.',
      head: 'Vikram Singh',
      email: 'roads@civicconnect.gov.in'
    },
    {
      code: 'SWM_CLEAN',
      sla: '24 Hours',
      name: 'Solid Waste Management',
      description: 'Garbage collection, overflowing dumpsters and public sanitation.',
      head: 'Sunita Deshmukh',
      email: 'waste@civicconnect.gov.in'
    },
    {
      code: 'WSD_WATER',
      sla: '36 Hours',
      name: 'Water Supply & Drainage',
      description: 'Drinking water pipeline leakages, low pressure, open storm drains and sewage overflow.',
      head: 'Ramesh Kulkarni',
      email: 'water@civicconnect.gov.in'
    },
    {
      code: 'ELEC_LIGHT',
      sla: '24 Hours',
      name: 'Electrical & Street Lighting',
      description: 'Defunct street lamps, hanging high-voltage wires and damaged electric meters.',
      head: 'Anil Shinde',
      email: 'electrical@civicconnect.gov.in'
    },
    {
      code: 'PARK_GREEN',
      sla: '72 Hours',
      name: 'Parks & Urban Greenery',
      description: 'Overgrown trees blocking roads and damaged public park equipment.',
      head: 'Kavita Rao',
      email: 'parks@civicconnect.gov.in'
    }
  ];

  const auditElements = [
    { label: 'Photographic proof', icon: Camera },
    { label: 'Geospatial location', icon: MapPin },
    { label: 'Complaint reference number', icon: Hash },
    { label: 'Stage-by-stage status history', icon: History },
    { label: 'Department assignment', icon: Building2 },
    { label: 'Officer assignment', icon: User },
    { label: 'Resolution proof', icon: FileCheck }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
          Civic Infrastructure Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Next-Generation Civic Infrastructure Redressal
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          CivicConnect is built to eliminate bureaucratic bottlenecks in public grievance resolution. It provides a transparent, role-based platform linking citizens, field municipal engineers, and urban administrative authorities.
        </p>
      </div>

      {/* Mission & Transparent Governance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-8 space-y-4 border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To provide every citizen an effortless digital channel to report ground infrastructure hazards, while empowering municipal departments with real-time field tracking, automated SLA escalations, and verifiable accountability.
          </p>
        </Card>

        <Card className="p-6 sm:p-8 space-y-4 border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Transparent Governance</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Eliminating lost paper petitions and informal hotlines. Every complaint creates an auditable trail with:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {auditElements.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <Icon className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Section 10: Municipal Departments */}
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Municipal Departments</h2>
          <p className="text-xs text-slate-500">
            Dedicated divisions coordinating ground operations and Service Level Agreements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <Card key={dept.code} className="p-5 space-y-3 border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {dept.code}
                  </span>
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Target SLA: {dept.sla}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base">{dept.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Head: <b className="text-slate-700">{dept.head}</b></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${dept.email}`} className="text-teal-600 hover:underline">
                    {dept.email}
                  </a>
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
