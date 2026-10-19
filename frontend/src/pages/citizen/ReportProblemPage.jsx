import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { mockDepartments } from '../../data/mockDepartments';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import ImageUploader from '../../components/citizen/ImageUploader';
import MockMapPicker from '../../components/citizen/MockMapPicker';
import { PlusCircle, Send, MapPin, Building2, Layers, AlertCircle } from 'lucide-react';

export const ReportProblemPage = () => {
  const { addComplaint } = useComplaints();
  const navigate = useNavigate();

  // All categories across all departments
  const defaultDept = mockDepartments[0];
  const [departmentId, setDepartmentId] = useState(defaultDept.id);
  const [category, setCategory] = useState(defaultDept.categories[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [ward, setWard] = useState('Ward 4');
  const [address, setAddress] = useState('Central Market, MG Road, Ward 4');
  const [latitude, setLatitude] = useState(18.5204);
  const [longitude, setLongitude] = useState(73.8567);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentDept = mockDepartments.find(d => d.id === Number(departmentId)) || defaultDept;

  const handleDeptChange = (newDeptId) => {
    setDepartmentId(newDeptId);
    const dept = mockDepartments.find(d => d.id === Number(newDeptId));
    if (dept && dept.categories.length > 0) {
      setCategory(dept.categories[0]);
    }
  };

  const handleLocationSelect = (loc) => {
    setAddress(loc.address);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !address.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);

    try {
      const newRecord = addComplaint({
        title,
        description,
        department: currentDept.name,
        category,
        priority,
        ward,
        address,
        latitude,
        longitude,
        images
      });

      navigate(`/citizen/complaints/${newRecord.id}`);
    } catch {
      setError('Failed to submit grievance. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
          Citizen Reporting Form
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
          Report an Issue
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit details, geotagged photos, and location coordinates to initiate municipal dispatch and SLA resolution.
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-slate-200">
        {error && (
          <div className="p-3 mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department, Category & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Municipal Department *"
              value={departmentId}
              onChange={(e) => handleDeptChange(e.target.value)}
              options={mockDepartments.map(d => ({ value: d.id, label: d.name }))}
            />

            <Select
              label="Issue Category *"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={currentDept.categories.map(c => ({ value: c, label: c }))}
            />

            <Select
              label="Priority Level *"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: 'LOW', label: 'Low - Routine Maintenance' },
                { value: 'MEDIUM', label: 'Medium - Standard Hazard' },
                { value: 'HIGH', label: 'High - Serious Hazard' },
                { value: 'URGENT', label: 'Urgent - Imminent Risk to Safety' },
              ]}
            />
          </div>

          {/* Title */}
          <Input
            label="Complaint Title *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Deep pothole causing vehicular damage on Main Road"
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Problem Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail: severity, approximate dimensions, nearby landmarks, or impact on traffic and pedestrians..."
              className="block w-full rounded-lg border border-slate-300 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Photographic Evidence */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Photo / Evidence Upload
            </label>
            <ImageUploader onImagesChange={setImages} />
          </div>

          {/* Location & Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Geotag Location & Coordinates *
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
              </span>
            </div>

            <MockMapPicker
              defaultAddress={address}
              onLocationSelect={handleLocationSelect}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Street Address / Landmark *"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Opposite Gate 2, Commercial Complex, MG Road"
                />
              </div>

              <div>
                <Input
                  label="Ward / Area Jurisdiction *"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Ward 4"
                />
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
            <Building2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upon filing, your complaint status will be set to <b className="text-slate-800">PENDING</b> and routed to the <b className="text-slate-800">{currentDept.name}</b>. An approved municipal officer will be dispatched for inspection within the target SLA window of <b className="text-slate-800">{currentDept.slaHours} hours</b>.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              icon={Send}
            >
              {submitting ? 'Submitting Grievance...' : 'Submit Grievance'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportProblemPage;
