import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ShieldCheck, Mail, Phone, Building2, CheckCircle2 } from 'lucide-react';

export const AdminProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Municipal Administrator');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '+91 98765 00000');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      fullName,
      phoneNumber
    };
    setCurrentUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
            Administrative Authority
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Admin Profile & Security
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Super-admin account details, contact verification, and municipal oversight privileges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
            {fullName.charAt(0) || 'A'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{fullName}</h3>
            <p className="text-xs text-slate-500">{currentUser?.email || 'admin@civicconnect.gov.in'}</p>
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Central Administrator
            </span>
          </div>
          <div className="text-xs text-slate-500 pt-3 border-t border-slate-100 space-y-1.5 text-left">
            <p><b className="text-slate-700">Jurisdiction:</b> City Municipal Headquarters</p>
            <p><b className="text-slate-700">Access Level:</b> Root Governance (Tier 3)</p>
            <p><b className="text-slate-700">Account Status:</b> <span className="text-emerald-600 font-semibold">Active & Verified</span></p>
          </div>
        </Card>

        <Card className="md:col-span-2 p-6 sm:p-8 space-y-5">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Administrative profile details updated successfully!
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-slate-800">Edit Administrative Details</h3>
            <p className="text-xs text-slate-500">Contact information used for emergency escalation broadcasts.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Administrator Full Name"
              icon={ShieldCheck}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Official Email (System Bound)"
              icon={Mail}
              value={currentUser?.email || 'admin@civicconnect.gov.in'}
              disabled
              helperText="Primary address for administrative escalations (cannot be changed)."
            />

            <Input
              label="Official Contact Number"
              icon={Phone}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="primary">
                Save Profile Information
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfilePage;
