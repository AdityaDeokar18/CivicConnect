import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Settings, PlusCircle, Building2, CheckCircle2, Shield, Clock } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    headOfficer: '',
    contactEmail: '',
    slaHours: 48
  });
  const [successMsg, setSuccessMsg] = useState('');

  const [municipalConfig, setMunicipalConfig] = useState({
    municipalityName: 'Pune Municipal Corporation (PMC)',
    defaultSlaHours: 48,
    escalationWindowHours: 72,
    supportEmail: 'support@civicconnect.gov.in'
  });

  const loadDepartments = async () => {
    try {
      const data = await adminService.getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  React.useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      const newDept = await adminService.createDepartment(formData);
      await loadDepartments();
      setModalOpen(false);
      setSuccessMsg(`Department "${newDept.name || formData.name}" created successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      setFormData({
        name: '',
        code: '',
        description: '',
        headOfficer: '',
        contactEmail: '',
        slaHours: 48
      });
    } catch (err) {
      console.error('Failed to create department:', err);
    }
  };




  const handleSaveParameters = (e) => {
    e.preventDefault();
    setSuccessMsg('Municipal parameters and default SLA policies updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
            System Administration
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Municipal Settings & SLA Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure municipal divisions, default SLA thresholds, and administrative parameters.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Department Management Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Municipal Departments</h2>
            <p className="text-xs text-slate-500">Configured operational units and target SLA response times.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setModalOpen(true)}
          >
            Add Department
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> SLA: {dept.slaHours}h
                </span>
              </div>

              <h3 className="font-bold text-slate-800 text-sm">{dept.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{dept.description}</p>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <p><b className="text-slate-700">Department Head:</b> {dept.headOfficer || 'Unassigned'}</p>
                <p><b className="text-slate-700">Official Contact:</b> {dept.contactEmail}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* System Settings Form */}
      <Card className="p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">General Municipal SLA Policies</h3>
          <p className="text-xs text-slate-500">Global response thresholds applied across civic complaints.</p>
        </div>

        <form onSubmit={handleSaveParameters} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City / Municipality Authority Name"
              value={municipalConfig.municipalityName}
              onChange={(e) => setMunicipalConfig({ ...municipalConfig, municipalityName: e.target.value })}
            />
            <Input
              label="Default Grievance SLA Threshold (Hours)"
              type="number"
              value={municipalConfig.defaultSlaHours}
              onChange={(e) => setMunicipalConfig({ ...municipalConfig, defaultSlaHours: Number(e.target.value) })}
            />
            <Input
              label="Public Grievance Escalation Window (Hours)"
              type="number"
              value={municipalConfig.escalationWindowHours}
              onChange={(e) => setMunicipalConfig({ ...municipalConfig, escalationWindowHours: Number(e.target.value) })}
            />
            <Input
              label="System Grievance Support Email"
              type="email"
              value={municipalConfig.supportEmail}
              onChange={(e) => setMunicipalConfig({ ...municipalConfig, supportEmail: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Municipal Parameters
            </Button>
          </div>
        </form>
      </Card>

      {/* Create Department Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Municipal Department"
      >
        <form onSubmit={handleCreateDept} className="space-y-4">
          <Input
            label="Department Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Public Health & Sanitation"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Department Code"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="PH_SAN"
            />
            <Input
              label="Default SLA Target (Hours)"
              type="number"
              required
              value={formData.slaHours}
              onChange={(e) => setFormData({ ...formData, slaHours: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Department Overview"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Responsibilities and jurisdiction scope"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Head Officer Name"
              value={formData.headOfficer}
              onChange={(e) => setFormData({ ...formData, headOfficer: e.target.value })}
              placeholder="Dr. Anand S."
            />
            <Input
              label="Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="health@civicconnect.gov.in"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={PlusCircle}>
              Create Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSettingsPage;
