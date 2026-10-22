import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';
import { UserCheck, Building2, Send, AlertCircle, ShieldCheck } from 'lucide-react';

export const AssignmentModal = ({
  isOpen,
  onClose,
  complaint,
  onAssign
}) => {
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadModalData = async () => {
      if (isOpen && complaint) {
        try {
          const [allDepts, approvedOfficers] = await Promise.all([
            adminService.getDepartments(),
            authService.getRegisteredOfficers(true)
          ]);
          if (!isMounted) return;
          setDepartments(allDepts);
          setOfficers(approvedOfficers);

          const initialDept = complaint.department || (allDepts[0] ? allDepts[0].name : '');
          setSelectedDept(initialDept);

          if (approvedOfficers.length > 0) {
            setSelectedOfficerId(String(approvedOfficers[0].id));
          } else {
            setSelectedOfficerId('');
          }

          setRemarks(`Assigned to field division for site inspection and repair in ${complaint.address || 'ward jurisdiction'}.`);
          setError('');
        } catch (err) {
          console.error('Failed to load assignment data:', err);
        }
      }
    };
    loadModalData();
    return () => { isMounted = false; };
  }, [isOpen, complaint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (officers.length === 0) {
      setError('No approved municipal officers are available in the roster. Please approve pending officer registrations in Officers & Users first.');
      return;
    }

    const officer = officers.find(o => String(o.id) === String(selectedOfficerId));
    if (!officer) {
      setError('Please select an approved officer from the roster.');
      return;
    }

    await onAssign(complaint.id, officer, selectedDept, remarks);
    onClose();
  };

  if (!complaint) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Work Order to Municipal Officer">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ticket Header Pill */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">{complaint.complaintRefNo} – {complaint.title}</p>
          <p className="text-slate-500">
            Category: <span className="font-semibold text-slate-700">{complaint.category}</span> • Location: <span className="font-semibold text-slate-700">{complaint.address} {complaint.ward && `(${complaint.ward})`}</span>
          </p>
        </div>

        {officers.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>No Approved Officers Available</span>
            </div>
            <p className="leading-relaxed">
              To assign complaints, municipal officers must first register and be <b>APPROVED</b> by an Administrator in the <b>Officers & Users</b> tab.
            </p>
          </div>
        ) : (
          <>
            <Select
              label="Assigned Municipal Department *"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              options={departments.map(d => ({ value: d.name, label: d.name }))}
            />

            <Select
              label="Select Approved Field Officer *"
              value={selectedOfficerId}
              onChange={(e) => setSelectedOfficerId(e.target.value)}
              options={officers.map(o => ({
                value: o.id,
                label: `${o.fullName} (${o.badgeNumber || 'Officer'} • ${o.department || 'Dept'}${o.ward ? ` • ${o.ward}` : ''})`
              }))}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Work Order Assignment Remarks *
              </label>
              <textarea
                rows={3}
                required
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Assigned to PWD field engineer for prompt on-site repair within SLA."
                className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </>
        )}

        {error && <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          {officers.length > 0 && (
            <Button type="submit" variant="primary" size="sm" icon={Send}>
              Confirm Officer Assignment
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentModal;
