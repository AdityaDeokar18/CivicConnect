import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import ComplaintTimeline from '../../components/citizen/ComplaintTimeline';
import Button from '../../components/common/Button';
import OfficerProofModal from '../../components/officer/OfficerProofModal';
import {
  MapPin,
  Calendar,
  Building2,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Wrench,
  ShieldCheck,
  Star,
  CheckCircle2,
  FileCheck,
  Clock,
  AlertCircle
} from 'lucide-react';

export const OfficerComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getComplaint, startWork, resolveComplaint } = useComplaints();
  const complaint = getComplaint(id);

  const [proofModalOpen, setProofModalOpen] = useState(false);

  if (!complaint) {
    return (
      <div className="p-8 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Task Not Found</h2>
        <p className="text-xs text-slate-500">The requested work order could not be located in records.</p>
        <Button variant="primary" onClick={() => navigate('/officer/complaints')}>
          Back to Assigned Tasks
        </Button>
      </div>
    );
  }

  const isAssigned = complaint.status === 'ASSIGNED';
  const isInProgress = complaint.status === 'IN_PROGRESS';
  const isResolved = complaint.status === 'RESOLVED';
  const isClosed = complaint.status === 'CLOSED';

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/officer/complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assigned Tasks
        </button>
      </div>

      {/* Main Task Card */}
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

          {/* Proof-Based Status Trigger Buttons */}
          <div className="flex items-center gap-2">
            {isAssigned && (
              <Button
                variant="primary"
                size="md"
                className="bg-blue-700 hover:bg-blue-800"
                icon={Wrench}
                onClick={() => setProofModalOpen(true)}
              >
                Start Work (Upload Inspection Proof)
              </Button>
            )}

            {isInProgress && (
              <Button
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700"
                icon={CheckCircle2}
                onClick={() => setProofModalOpen(true)}
              >
                Mark as Resolved (Upload Fix Proof)
              </Button>
            )}

            {isResolved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Fix Uploaded • Awaiting Citizen Feedback
              </span>
            )}

            {isClosed && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                Ticket Verified & Closed
              </span>
            )}
          </div>
        </div>

        {/* Citizen & Location Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-600" /> Complainant Details
            </h2>
            <div className="space-y-1 text-slate-600">
              <p><b className="text-slate-700">Resident Name:</b> {complaint.citizenName || 'Resident'}</p>
              <p><b className="text-slate-700">Phone:</b> {complaint.citizenPhone || '+91 98765 43210'}</p>
              <p><b className="text-slate-700">Email:</b> {complaint.citizenEmail || 'citizen@civicconnect.gov.in'}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600" /> Site Coordinates & Jurisdiction
            </h2>
            <div className="space-y-1 text-slate-600">
              <p><b className="text-slate-700">Address:</b> {complaint.address}</p>
              <p><b className="text-slate-700">Ward:</b> {complaint.ward || 'Ward 4'}</p>
              <p><b className="text-slate-700">GPS:</b> {complaint.latitude}° N, {complaint.longitude}° E</p>
            </div>
          </div>
        </div>

        {/* SLA and Category Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <p className="text-slate-400">Department</p>
              <p className="font-semibold text-slate-800">{complaint.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="text-slate-400">Target SLA Window</p>
              <p className="font-semibold text-slate-800">48 Hours Standard Turnaround</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-slate-400">Assigned Officer</p>
              <p className="font-semibold text-slate-800">
                {complaint.assignedOfficer?.name} ({complaint.assignedOfficer?.badgeNumber || 'Officer'})
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Citizen Grievance Description
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {complaint.description}
          </p>
        </div>

        {/* Citizen Photos */}
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

        {/* Work / Inspection Proof Uploaded */}
        {complaint.workProof && (
          <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-purple-950 font-bold">
              <Wrench className="w-4 h-4 text-purple-600" />
              <span>Inspection / Work-In-Progress Proof</span>
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

        {/* Final Resolution Proof Uploaded */}
        {complaint.resolutionProof && (
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Final Resolution Proof Uploaded</span>
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
                    Resolved At: {new Date(complaint.resolvedAt).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Citizen Feedback if available */}
        {complaint.feedback && (
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Citizen Satisfaction Rating ({complaint.feedback.rating}/5 Stars)</span>
            </div>
            <p className="text-slate-700 italic">"{complaint.feedback.comments}"</p>
          </div>
        )}
      </Card>

      {/* Audit Timeline */}
      <Card className="p-6 sm:p-8 space-y-5 border-slate-200">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800">Action & Dispatch History</h2>
          <p className="text-xs text-slate-500 mt-0.5">Stage updates recorded by central dispatch and field crews.</p>
        </div>

        <ComplaintTimeline timeline={complaint.historyTimeline} currentStatus={complaint.status} />
      </Card>

      {/* Proof-Based Status Modal */}
      <OfficerProofModal
        isOpen={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
        complaint={complaint}
        onStartWork={startWork}
        onResolve={resolveComplaint}
      />
    </div>
  );
};

export default OfficerComplaintDetailsPage;
