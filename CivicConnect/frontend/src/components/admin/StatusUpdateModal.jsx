import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const StatusUpdateModal = ({
  isOpen,
  onClose,
  complaint,
  onUpdateStatus,
  isOfficer = false
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const officerOptions = [
    { value: 'IN_PROGRESS', label: 'In Progress - Team On-Site' },
    { value: 'RESOLVED', label: 'Resolved - Fix Completed & Verified' },
  ];

  const adminOptions = [
    { value: 'PENDING', label: 'Pending - Awaiting Review' },
    { value: 'ASSIGNED', label: 'Assigned - Dispatched to Department' },
    { value: 'IN_PROGRESS', label: 'In Progress - Field Team Active' },
    { value: 'RESOLVED', label: 'Resolved - Issue Fixed' },
    { value: 'CLOSED', label: 'Closed - Verified & Archived' },
    { value: 'REJECTED', label: 'Rejected - Invalid / Duplicate' },
  ];

  const options = isOfficer ? officerOptions : adminOptions;

  useEffect(() => {
    if (complaint) {
      if (isOfficer) {
        setNewStatus(complaint.status === 'ASSIGNED' ? 'IN_PROGRESS' : 'RESOLVED');
      } else {
        setNewStatus(complaint.status);
      }
      setRemarks('');
      setError('');
    }
  }, [complaint, isOpen, isOfficer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStatus) {
      setError('Please select a target status');
      return;
    }
    if (!remarks.trim()) {
      setError('Action remarks are required for official audit history.');
      return;
    }

    onUpdateStatus(complaint.id, newStatus, remarks);
    onClose();
  };

  if (!complaint) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isOfficer ? 'Update Field Action Status' : 'Official Grievance Status Action'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
          <p className="font-semibold text-slate-800">
            {complaint.complaintRefNo} – {complaint.title}
          </p>
          <p className="text-slate-500 mt-1">
            Current Status: <span className="font-bold text-teal-700">{complaint.status}</span>
          </p>
        </div>

        <Select
          label="Target Status *"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          options={options}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {isOfficer ? 'Field Action & Progress Remarks *' : 'Administrative Audit Remarks *'}
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={
              isOfficer
                ? 'e.g. Field repair crew deployed with hot asphalt mix. Patching underway.'
                : 'e.g. Verified resolution with ward supervisor.'
            }
            className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={CheckCircle2}>
            Confirm Status Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StatusUpdateModal;
