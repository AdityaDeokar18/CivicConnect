import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { User, Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      fullName,
      phoneNumber,
      address
    };
    setCurrentUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
          Account Dossier
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
          Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your resident contact details, mobile alerts, and neighborhood address information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <Card className="p-6 text-center space-y-4 border-slate-200">
          <div className="w-20 h-20 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-2xl mx-auto shadow-xs border border-slate-800">
            {fullName.charAt(0) || 'C'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{fullName || 'Citizen User'}</h3>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Registered Resident
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            Role: ROLE_CITIZEN
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2 p-6 sm:p-8 space-y-5 border-slate-200">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Profile information updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name *"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Address (Bound to Citizen Record)"
              icon={Mail}
              value={currentUser?.email || ''}
              disabled
              helperText="Official identifier cannot be changed."
            />

            <Input
              label="Mobile Phone *"
              icon={Phone}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <Input
              label="Residential Ward / Neighborhood Address *"
              icon={MapPin}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="primary">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
