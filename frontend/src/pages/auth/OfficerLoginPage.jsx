import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Wrench, Mail, Lock, LogIn, AlertCircle, ShieldCheck, CheckCircle2, User } from 'lucide-react';

export const OfficerLoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const { officerLogin } = useAuth();
  const navigate = useNavigate();

  const successMessage = location.state?.message || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsPending(false);

    if (!email.trim() || !password) {
      setError('Please enter your official email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await officerLogin(email, password);
      if (res.success) {
        navigate('/officer/dashboard');
      } else {
        if (res.isPending) {
          setIsPending(true);
        }
        setError(res.message || 'Authentication failed. Please verify your officer credentials.');
      }
    } catch {
      setError('An error occurred during official authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-xs">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Municipal Officer Sign In</h1>
          <p className="text-xs text-slate-500">
            Access your assigned field tasks, work orders, and resolution updates.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 border-slate-200">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {isPending ? (
            <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Account Pending Administrative Approval</span>
              </div>
              <p className="leading-relaxed">
                Your municipal officer registration has been received and is currently under review by the Administrator. Officer login is restricted until approved.
              </p>
            </div>
          ) : error ? (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Official Gov Email Address *"
              type="email"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. officer@civicconnect.gov.in"
            />

            <Input
              label="Password *"
              type="password"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={loading}
              icon={LogIn}
            >
              {loading ? 'Verifying Authorization...' : 'Sign In as Officer'}
            </Button>
          </form>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Approval Policy
            </p>
            <p>
              Newly registered officer accounts require approval by a Central Administrator in the Admin portal before field desk access is granted.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-center text-xs">
            <p className="text-slate-600">
              New field officer?{' '}
              <Link to="/officer/register" className="font-semibold text-blue-600 hover:underline">
                Register as Officer
              </Link>
            </p>

            <div className="pt-1 flex items-center justify-center gap-4 text-slate-500">
              <Link to="/login" className="inline-flex items-center gap-1 text-slate-700 hover:text-teal-600 font-medium">
                <User className="w-3.5 h-3.5 text-teal-600" /> Citizen Login
              </Link>
              <span>•</span>
              <Link to="/admin/login" className="inline-flex items-center gap-1 text-slate-700 hover:text-purple-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Admin Login
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OfficerLoginPage;
