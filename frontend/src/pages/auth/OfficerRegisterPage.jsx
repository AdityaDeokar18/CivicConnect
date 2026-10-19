import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockDepartments } from '../../data/mockDepartments';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { Wrench, Mail, Lock, Phone, User, Building2, ShieldAlert, CheckCircle2, UserPlus, MapPin } from 'lucide-react';

export const OfficerRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    department: mockDepartments[0]?.name || 'Road Maintenance & Potholes',
    ward: 'Ward 4',
    badgeNumber: '',
    designation: 'Field Engineer',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerOfficer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.badgeNumber.trim() || !formData.password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerOfficer(formData);
      if (res.success) {
        navigate('/officer/login', {
          state: {
            message: 'Officer registration submitted successfully. Your account is now PENDING Admin approval before you can log in.'
          }
        });
      } else {
        setError(res.message || 'Officer registration failed.');
      }
    } catch {
      setError('An error occurred during officer registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-xs">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Municipal Officer Registration</h1>
          <p className="text-xs text-slate-500">
            Register departmental engineers and field officers to receive work assignments.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 border-slate-200">
          {/* Important Approval Notice */}
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Mandatory Administrative Approval Notice</span>
            </div>
            <p className="leading-relaxed">
              In accordance with municipal governance rules, all new Officer registrations require verification and approval by a Central Administrator. Your account will remain in <span className="font-bold">PENDING APPROVAL</span> status and you cannot log in until approved.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Official Full Name *"
              type="text"
              icon={User}
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Vikram Singh"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Official Email Address *"
                type="email"
                icon={Mail}
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="officer@civicconnect.gov.in"
              />

              <Input
                label="Mobile Phone *"
                type="tel"
                icon={Phone}
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+91 98765 00000"
              />
            </div>

            {/* Departmental Data */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Department & Jurisdiction Details
              </div>

              <Select
                label="Responsible Department *"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={mockDepartments.map(d => ({ value: d.name, label: d.name }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Official Badge ID *"
                  type="text"
                  required
                  value={formData.badgeNumber}
                  onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                  placeholder="e.g. PWD-ENG-102"
                />

                <Input
                  label="Designation / Role *"
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Assistant Engineer"
                />

                <Input
                  label="Jurisdiction / Ward *"
                  type="text"
                  required
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  placeholder="e.g. Ward 4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Account Password *"
                type="password"
                icon={Lock}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
              />

              <Input
                label="Confirm Password *"
                type="password"
                icon={Lock}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-blue-700 hover:bg-blue-800"
                disabled={loading}
                icon={UserPlus}
              >
                {loading ? 'Submitting Officer Application...' : 'Submit Officer Registration'}
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-center text-xs">
            <p className="text-slate-600">
              Already have an approved officer account?{' '}
              <Link to="/officer/login" className="font-semibold text-blue-600 hover:underline">
                Officer Sign In
              </Link>
            </p>

            <p className="text-slate-500 pt-1">
              Are you a resident reporting an issue?{' '}
              <Link to="/register" className="font-semibold text-teal-600 hover:underline">
                Citizen Registration
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OfficerRegisterPage;
