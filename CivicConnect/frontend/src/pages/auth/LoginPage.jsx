import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Building2, Mail, Lock, LogIn, User, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { citizenLogin } = useAuth();
  const navigate = useNavigate();

  const successMessage = location.state?.message || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await citizenLogin(email, password);
      if (res.success) {
        navigate('/citizen/dashboard');
      } else {
        setError(res.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Citizen Sign In</h1>
          <p className="text-xs text-slate-500">
            Log in to report infrastructure defects and track resolution progress.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 border-slate-200">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Citizen Email Address *"
              type="email"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. resident@example.com"
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
              <Link to="/forgot-password" className="text-teal-600 hover:text-teal-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading} icon={LogIn}>
              {loading ? 'Authenticating...' : 'Sign In as Citizen'}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-center">
            <p className="text-slate-600">
              Don't have a citizen account?{' '}
              <Link to="/register" className="font-semibold text-teal-600 hover:underline">
                Register as Citizen
              </Link>
            </p>

            <div className="pt-2 flex items-center justify-center gap-4 text-slate-500">
              <Link to="/officer/login" className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-600 font-medium">
                <Wrench className="w-3.5 h-3.5 text-blue-600" /> Officer Portal
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

export default LoginPage;
