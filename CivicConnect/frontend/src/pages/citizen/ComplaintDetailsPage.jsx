import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import ComplaintTimeline from '../../components/citizen/ComplaintTimeline';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  MapPin,
  Calendar,
  Building2,
  UserCheck,
  ArrowLeft,
  Star,
  CheckCircle2,
  FileCheck,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComplaint, submitFeedback } = useComplaints();
  const complaint = getComplaint(id);

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  if (!complaint) {
    return (
      <div className="p-8 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Grievance Not Found</h2>
        <p className="text-xs text-slate-500">The requested complaint reference does not exist.</p>
        <Button variant="primary" onClick={() => navigate('/citizen/complaints')}>
          Back to My Complaints
        </Button>
      </div>
    );
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    submitFeedback(complaint.id, rating, comments);
    setRatingModalOpen(false);
    setFeedbackSuccess(true);
  };

  const isResolved = complaint.status === 'RESOLVED';
  const isClosed = complaint.status === 'CLOSED';

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/citizen/complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </button>
      </div>

      {/* Verification Callout if RESOLVED */}
      {isResolved && (
        <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-950">
                Resolution Proof Uploaded — Citizen Verification Requested
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                The municipal field officer has completed on-site repairs and uploaded verification proof. Please review the fix below and submit your rating to officially close this ticket.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={Star}
              className="bg-emerald-700 hover:bg-emerald-800"
              onClick={() => setRatingModalOpen(true)}
            >
              Verify Fix & Rate
            </Button>
          </div>
        </div>
      )}

      {/* Main Details Card */}
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

          {isResolved && (
            <Button
              variant="outline"
              size="sm"
              icon={Star}
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              onClick={() => setRatingModalOpen(true)}
            >
              Rate Resolution
            </Button>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-slate-400 font-medium">Department</p>
              <p className="font-semibold text-slate-800">{complaint.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <p className="text-slate-400 font-medium">Location</p>
              <p className="font-semibold text-slate-800 truncate">{complaint.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <p className="text-slate-400 font-medium">Assigned Officer</p>
              <p className="font-semibold text-slate-800">
                {complaint.assignedOfficer
                  ? `${complaint.assignedOfficer.name} (${complaint.assignedOfficer.badgeNumber || 'Officer'})`
                  : 'Awaiting Officer Assignment'}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Grievance Description
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

        {/* Section 24 & 25: Proof-Based Resolution View */}
        {complaint.resolutionProof && (
          <div className="p-5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Field Resolution Proof</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {complaint.resolutionProof.image && (
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-emerald-300">
                  <img
                    src={complaint.resolutionProof.image}
                    alt="Resolution Proof"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Officer Remarks:</span>
                  <p className="font-medium text-slate-800 mt-0.5 bg-white p-3 rounded-lg border border-emerald-200">
                    "{complaint.resolutionProof.remarks || 'Field repair completed.'}"
                  </p>
                </div>
                {complaint.resolvedAt && (
                  <p className="text-slate-500">
                    Resolution Date: <b className="text-slate-700">{new Date(complaint.resolvedAt).toLocaleString('en-IN')}</b>
                  </p>
                )}
                {complaint.resolutionProof.uploadedBy && (
                  <p className="text-slate-500">
                    Uploaded By: <b className="text-slate-700">{complaint.resolutionProof.uploadedBy}</b>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Work / Inspection Proof if available */}
        {complaint.workProof && !complaint.resolutionProof && (
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-purple-900">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Site Inspection & Work-in-Progress Proof</span>
            </div>
            {complaint.workProof.image && (
              <div className="max-w-xs aspect-video rounded-lg overflow-hidden bg-slate-100 border border-purple-200">
                <img src={complaint.workProof.image} alt="Work Proof" className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-slate-700">{complaint.workProof.remarks}</p>
          </div>
        )}

        {/* Existing Citizen Feedback if Closed */}
        {complaint.feedback && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Citizen Satisfaction Rating ({complaint.feedback.rating}/5 Stars) — Ticket Closed</span>
            </div>
            <p className="text-xs text-slate-600 italic">"{complaint.feedback.comments}"</p>
          </div>
        )}
      </Card>

      {/* Stage-by-Stage Timeline */}
      <Card className="p-6 sm:p-8 space-y-5 border-slate-200">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800">Stage-by-Stage Resolution Timeline</h2>
          <p className="text-xs text-slate-500 mt-0.5">Immutable record of state transitions, timestamps, and municipal actor remarks.</p>
        </div>

        <ComplaintTimeline timeline={complaint.historyTimeline} currentStatus={complaint.status} />
      </Card>

      {/* Rating & Feedback Modal */}
      <Modal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        title="Citizen Verification & Rating"
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Your verification confirms that municipal field teams have adequately resolved the defect at <b className="text-slate-800">{complaint.address}</b>. Submitting your rating will advance the status to <b className="text-teal-700">CLOSED</b>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
              Overall Satisfaction Rating:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-colors"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Citizen Comments & Feedback *
            </label>
            <textarea
              rows={3}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="e.g. Patchwork completed smoothly, road divider re-installed cleanly. Satisfied with response."
              className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setRatingModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={CheckCircle2}>
              Submit Verification & Close Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintDetailsPage;
