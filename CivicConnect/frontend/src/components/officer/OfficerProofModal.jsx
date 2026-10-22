import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ImageUploader from '../citizen/ImageUploader';
import { Camera, CheckCircle2, AlertTriangle, FileCheck, Wrench, AlertCircle } from 'lucide-react';

export const OfficerProofModal = ({
  isOpen,
  onClose,
  complaint,
  onStartWork,
  onResolve
}) => {
  const [proofImages, setProofImages] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProofImages([]);
      setRemarks('');
      setError('');
      setSubmitting(false);
    }
  }, [isOpen, complaint]);

  if (!complaint) return null;

  const isAssigned = complaint.status === 'ASSIGNED';
  const isInProgress = complaint.status === 'IN_PROGRESS';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Rule 24: Proof is strictly required!
    if (!proofImages || proofImages.length === 0) {
      setError('Photo proof upload is mandatory before advancing this work order.');
      return;
    }

    if (isInProgress && !remarks.trim()) {
      setError('Resolution remarks are required to explain the fix for citizen verification.');
      return;
    }

    setSubmitting(true);

    try {
      if (isAssigned) {
        const res = await onStartWork(complaint.id, proofImages[0], remarks);
        if (res.success) {
          onClose();
        } else {
          setError(res.message || 'Failed to start work.');
          setSubmitting(false);
        }
      } else if (isInProgress) {
        const res = await onResolve(complaint.id, proofImages[0], remarks);
        if (res.success) {
          onClose();
        } else {
          setError(res.message || 'Failed to mark as resolved.');
          setSubmitting(false);
        }
      }
    } catch {
      setError('An unexpected error occurred while updating status.');
      setSubmitting(false);
    }
  };

  const modalTitle = isAssigned
    ? 'Start Work: Upload Site Inspection Proof'
    : isInProgress
    ? 'Mark as Resolved: Upload Final Resolution Proof'
    : 'Work Order Status';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ticket Header Pill */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">
            {complaint.complaintRefNo} – {complaint.title}
          </p>
          <p className="text-slate-500">
            Current Status: <span className="font-bold text-slate-700">{complaint.status}</span> • Location: <span className="text-slate-700 font-medium">{complaint.address}</span>
          </p>
        </div>

        {/* Rule explanation alert */}
        {isAssigned && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl flex items-start gap-2">
            <Wrench className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              To move status to <b className="text-blue-950 font-bold">IN_PROGRESS</b>, upload a photo verifying that your field inspection crew has deployed to the site.
            </p>
          </div>
        )}

        {isInProgress && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              To move status to <b className="text-emerald-950 font-bold">RESOLVED</b>, upload final photographic proof of the completed fix. This proof will be shown to the citizen for satisfaction rating.
            </p>
          </div>
        )}

        {/* Mandatory Photo Proof Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            {isAssigned ? 'Site Inspection / Work Proof Photo *' : 'Final Resolution Photo Proof *'}
          </label>
          <ImageUploader
            onImagesChange={setProofImages}
            maxImages={1}
          />
          {proofImages.length === 0 && (
            <p className="text-[11px] text-amber-700 font-medium mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Photo proof upload is required
            </p>
          )}
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            {isInProgress ? 'Resolution Remarks *' : 'Inspection / Field Remarks'}
          </label>
          <textarea
            rows={3}
            required={isInProgress}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={
              isAssigned
                ? 'e.g. Inspected site at 10:30 AM. Excavation and resurfacing team active on site.'
                : 'e.g. Pothole filled with dense bituminous macadam and roller compacted. Road cleared for traffic.'
            }
            className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={submitting || proofImages.length === 0}
            icon={CheckCircle2}
            className={isInProgress ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-700 hover:bg-blue-800'}
          >
            {submitting
              ? 'Uploading Proof...'
              : isAssigned
              ? 'Upload Proof & Start Work'
              : 'Upload Proof & Mark Resolved'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OfficerProofModal;
