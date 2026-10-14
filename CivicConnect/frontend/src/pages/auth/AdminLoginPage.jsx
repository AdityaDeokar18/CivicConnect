import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ShieldCheck, Mail, Lock, LogIn, ArrowLeft, Building2 } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter authorized municipal administrative credentials.');
      return;
    }

    setLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Unauthorized administrative access. Please verify official credentials.');
      }
    } catch {
      setError('An error occurred during administrative authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-teal-400 flex items-center justify-center mx-auto shadow-xs border border-slate-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administrative Authority Portal</h1>
          <p className="text-xs text-slate-500">
            Restricted official access for Municipal Commissioners and Central Dispatch Supervisors.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 border-slate-200">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Official Administrator Email *"
              type="email"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@civicconnect.gov.in"
            />

            <Input
              label="Administrative Password *"
              type="password"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="secondary"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              disabled={loading}
              icon={LogIn}
            >
              {loading ? 'Verifying Authorization...' : 'Sign In as Administrator'}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            <p className="text-[11px] text-slate-400">
              Notice: Public registration for Administrator accounts is disabled. Administrative access is granted by Municipal Authority decree only.
            </p>
          </div>
        </Card>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-600 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Citizen Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
