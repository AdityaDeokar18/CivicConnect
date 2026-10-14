import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await authService.forgotPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-xs text-slate-500">
            Enter your registered email and we'll send recovery instructions.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Reset Link Sent</h3>
              <p className="text-xs text-slate-500">
                A password reset token has been dispatched to <span className="font-semibold text-slate-700">{email}</span>.
              </p>
              <Link to="/login" className="inline-block pt-2">
                <Button variant="primary" size="sm">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                icon={Mail}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@civicconnect.org"
              />

              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Sending Instructions...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </Card>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-600 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Citizen Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
