import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import ComplaintTimeline from '../../components/citizen/ComplaintTimeline';
import Button from '../../components/common/Button';
import { MapPin, Calendar, Building2, User, ArrowLeft, ShieldCheck, Star } from 'lucide-react';

export const PublicIssueDetailsPage = () => {
  const { id } = useParams();
  const { getComplaint } = useComplaints();
  const complaint = getComplaint(id);

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Grievance Not Found</h2>
        <p className="text-sm text-slate-500">No complaint matching ID "{id}" was located in the records.</p>
        <Link to="/public-issues">
          <Button variant="primary">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link to="/public-issues" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Public Feed
      </Link>

      {/* Main Details Header Card */}
      <Card className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                {complaint.complaintRefNo}
              </span>
              <PriorityBadge priority={complaint.priority} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">{complaint.title}</h1>
          </div>
          <div>
            <StatusBadge status={complaint.status} size="md" />
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-slate-400 font-medium">Department</p>
              <p className="font-semibold text-slate-800">{complaint.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <p className="text-slate-400 font-medium">Ward Location</p>
              <p className="font-semibold text-slate-800 truncate">{complaint.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <p className="text-slate-400 font-medium">Filed Date</p>
              <p className="font-semibold text-slate-800">
                {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Description & Proof Image */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Grievance Description</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-100">
            {complaint.description}
          </p>
        </div>

        {complaint.images?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Photographic Evidence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {complaint.images.map((img, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={img} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Display if Closed */}
        {complaint.feedback && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span>Citizen Feedback (Rating: {complaint.feedback.rating}/5)</span>
            </div>
            <p className="text-xs text-emerald-900 italic">"{complaint.feedback.comments}"</p>
          </div>
        )}
      </Card>

      {/* Progress Audit Timeline */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h2>Official Redressal History & Audit Log</h2>
        </div>

        <ComplaintTimeline timeline={complaint.historyTimeline} currentStatus={complaint.status} />
      </Card>
    </div>
  );
};

export default PublicIssueDetailsPage;
