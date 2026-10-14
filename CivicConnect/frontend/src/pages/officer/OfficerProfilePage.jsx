import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { UserCheck, Mail, Phone, Building2, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export const OfficerProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
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
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Official Credential Dossier
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
          Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Municipal engineer badge details, division assignment, and dispatch contact numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Officer Card */}
        <Card className="p-6 text-center space-y-4 border-slate-200">
          <div className="w-20 h-20 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-xs">
            {fullName.charAt(0) || 'O'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{fullName || 'Municipal Officer'}</h3>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5" /> {currentUser?.badgeNumber || 'OFF-FIELD'}
            </span>
          </div>
          <div className="text-xs text-slate-500 pt-3 border-t border-slate-100 space-y-1 text-left">
            <p><b>Department:</b> {currentUser?.department || 'Field Services'}</p>
            <p><b>Designation:</b> {currentUser?.designation || 'Field Engineer'}</p>
            <p><b>Ward:</b> {currentUser?.ward || 'Ward 4'}</p>
            <p><b>Account Status:</b> <span className="text-emerald-700 font-bold uppercase">{currentUser?.approvalStatus || 'APPROVED'}</span></p>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2 p-6 sm:p-8 space-y-5 border-slate-200">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Officer profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Official Full Name *"
              icon={UserCheck}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Official Gov Email (Bound to Municipal Records)"
              icon={Mail}
              value={currentUser?.email || ''}
              disabled
              helperText="Official identifier cannot be edited."
            />

            <Input
              label="Direct Mobile Phone *"
              icon={Phone}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Municipal Department"
                icon={Building2}
                value={currentUser?.department || 'Road Maintenance'}
                disabled
              />
              <Input
                label="Official Badge Number"
                icon={ShieldCheck}
                value={currentUser?.badgeNumber || 'OFF-FIELD'}
                disabled
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" className="bg-blue-700 hover:bg-blue-800">
                Save Official Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OfficerProfilePage;
