import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Building2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-teal-500 text-slate-900 flex items-center justify-center font-black text-sm">
                C
              </div>
              <span>CivicConnect</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              A Smart Public Issue Reporting and Tracking System for transparent, accountable, and responsive civic governance.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Aligned with UN SDG 11 & UN SDG 16</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Portals & Access */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Portals & Access</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" className="hover:text-teal-400 transition-colors">Register Account</Link>
              </li>
              <li>
                <Link to="/citizen/report" className="hover:text-teal-400 transition-colors">Report an Issue</Link>
              </li>
              <li>
                <Link to="/officer/login" className="hover:text-teal-400 transition-colors">Officer Portal</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-teal-400 transition-colors">Administrator Hub</Link>
              </li>
            </ul>
          </div>

          {/* Municipal Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Municipal Contact</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>City Municipal Headquarters, Civic Center</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Toll Free Helpline:</p>
                  <p>1800-11-CIVIC (24x7)</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:support@civicconnect.gov.in" className="hover:text-teal-400 transition-colors">
                  support@civicconnect.gov.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 CivicConnect Project. Smart Civic Governance Platform.</p>
          <div className="flex gap-5">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">SLA Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
