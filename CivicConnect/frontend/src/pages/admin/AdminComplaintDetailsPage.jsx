import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import ComplaintTimeline from '../../components/citizen/ComplaintTimeline';
import Button from '../../components/common/Button';
import AssignmentModal from '../../components/admin/AssignmentModal';
import {
  MapPin,
  Calendar,
  Building2,
  User,
  Phone,
  Mail,
  UserCheck,
  ArrowLeft,
  ShieldCheck,
  Star,
  FileCheck,
  Wrench,
  Clock
} from 'lucide-react';

export const AdminComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComplaint, assignComplaint } = useComplaints();
  const complaint = getComplaint(id);

  const [assignModalOpen, setAssignModalOpen] = useState(false);

  if (!complaint) {
    return (
      <div className="p-8 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Grievance Not Found</h2>
        <p className="text-xs text-slate-500">The requested complaint record does not exist.</p>
        <Button variant="primary" onClick={() => navigate('/admin/complaints')}>
          Back to Complaints
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Master Complaints
        </button>
      </div>

      {/* Main Dossier Card */}
      <Card className="p-6 sm:p-8 space-y-6 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                {complaint.complaintRefNo}
              </span>
              <PriorityBadge priority={complaint.priority} size="sm" />
              <StatusBadge status={complaint.status} size="sm" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">{complaint.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={UserCheck}
              className="bg-slate-900 hover:bg-slate-800"
              onClick={() => setAssignModalOpen(true)}
            >
              {complaint.assignedOfficer ? 'Reassign Officer' : 'Assign Approved Officer'}
            </Button>
          </div>
        </div>

        {/* Complainant & Department Assignment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-600" /> Complainant Information
            </h2>
            <div className="space-y-1 text-slate-600">
              <p><b className="text-slate-700">Name:</b> {complaint.citizenName || 'Citizen'}</p>
              <p><b className="text-slate-700">Email:</b> {complaint.citizenEmail || 'citizen@civicconnect.gov.in'}</p>
              <p><b className="text-slate-700">Phone:</b> {complaint.citizenPhone || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" /> Department & Officer Allocation
            </h2>
            <div className="space-y-1 text-slate-600">
              <p><b className="text-slate-700">Department:</b> {complaint.department}</p>
              <p><b className="text-slate-700">Category:</b> {complaint.category}</p>
              <p>
                <b className="text-slate-700">Assigned Officer:</b>{' '}
                {complaint.assignedOfficer ? (
                  <span className="font-semibold text-slate-900">
                    {complaint.assignedOfficer.name} ({complaint.assignedOfficer.badgeNumber || 'Officer'})
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Unassigned (Allocation Required)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Problem Description & Location */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Problem Description & Site Details
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {complaint.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <b>Address:</b> {complaint.address} {complaint.ward && `(${complaint.ward})`} • GPS: {complaint.latitude}° N, {complaint.longitude}° E
            </span>
          </div>
        </div>

        {/* Citizen Submitted Proof */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Citizen Photo Evidence
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {complaint.images.map((img, idx) => (
                <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work / Inspection Proof if available */}
        {complaint.workProof && (
          <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-purple-950">
              <Wrench className="w-4 h-4 text-purple-600" />
              <span>Officer Site Inspection Proof (IN_PROGRESS)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {complaint.workProof.image && (
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-purple-300">
                  <img src={complaint.workProof.image} alt="Work Proof" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-1.5 text-slate-700">
                <p><b>Officer Remarks:</b> {complaint.workProof.remarks}</p>
                <p className="text-[11px] text-slate-500">
                  Uploaded: {new Date(complaint.workProof.uploadedAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Proof if available */}
        {complaint.resolutionProof && (
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Officer Final Resolution Proof (RESOLVED)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {complaint.resolutionProof.image && (
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-emerald-300">
                  <img src={complaint.resolutionProof.image} alt="Resolution Proof" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-1.5 text-slate-700">
                <p><b>Resolution Remarks:</b> {complaint.resolutionProof.remarks}</p>
                {complaint.resolvedAt && (
                  <p className="text-[11px] text-slate-500">
                    Resolved Date: {new Date(complaint.resolvedAt).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Citizen Rating and Feedback if closed */}
        {complaint.feedback && (
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Citizen Satisfaction Rating ({complaint.feedback.rating}/5 Stars) — Ticket Closed</span>
            </div>
            <p className="text-slate-700 italic">"{complaint.feedback.comments}"</p>
          </div>
        )}
      </Card>

      {/* Audit Timeline */}
      <Card className="p-6 sm:p-8 space-y-5 border-slate-200">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800">Official Redressal History & Audit Log</h2>
          <p className="text-xs text-slate-500 mt-0.5">Immutable record of state transitions, remarks, and field officer timestamps.</p>
        </div>

        <ComplaintTimeline timeline={complaint.historyTimeline} currentStatus={complaint.status} />
      </Card>

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        complaint={complaint}
        onAssign={assignComplaint}
      />
    </div>
  );
};

export default AdminComplaintDetailsPage;
