import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, Phone, MapPin, Send, Building2, Info } from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Form is structured for backend API connection without showing fake email dispatch
    setTimeout(() => {
      setInquiryStatus({
        type: 'info',
        message: 'Inquiry form structured and validated. Form endpoint is ready for integration with the municipal mail dispatch service.'
      });
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Municipal Headquarters & Civic Helpline
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official contact channels for public infrastructure inquiries, technical support, and civic guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-4">
          <Card className="p-6 space-y-5 border-slate-200 bg-white">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Municipal Contact Details
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Municipal Headquarters</p>
                  <p className="text-slate-600 mt-0.5">City Municipal Headquarters, Civic Center</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Toll Free Helpline</p>
                  <p className="text-slate-600 mt-0.5 font-medium">1800-11-CIVIC (24x7)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Support Email</p>
                  <a
                    href="mailto:support@civicconnect.gov.in"
                    className="text-teal-600 hover:underline mt-0.5 inline-block font-medium"
                  >
                    support@civicconnect.gov.in
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Send an Inquiry Form */}
        <div className="md:col-span-2">
          <Card className="p-6 sm:p-8 border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">Send an Inquiry</h2>

            {inquiryStatus && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{inquiryStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                />
                <Input
                  label="Email *"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              <Input
                label="Subject *"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Topic of inquiry"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter your message details here..."
                  className="block w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                icon={Send}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                {submitting ? 'Processing...' : 'Submit Inquiry'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
