import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  User,
  Wrench,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import Button from './Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInDropdownOpen, setSignInDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const { currentUser, isAuthenticated, isAdmin, isOfficer, isCitizen, logout } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  const signInRef = useRef(null);
  const registerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (signInRef.current && !signInRef.current.contains(event.target)) {
        setSignInDropdownOpen(false);
      }
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setRegisterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSignInDropdownOpen(false);
    setRegisterDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOfficer) return '/officer/dashboard';
    return '/citizen/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: CivicConnect Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold shadow-xs border border-slate-800 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-teal-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
                  CivicConnect
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                    City Gov
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                  Public Redressal Platform
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/public-issues"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isActive('/public-issues')
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Public Issues
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isActive('/how-it-works')
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isActive('/about')
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isActive('/contact')
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardPath()}>
                  <Button variant="primary" size="sm" icon={LayoutDashboard}>
                    {isAdmin ? 'Admin Portal' : isOfficer ? 'Officer Desk' : 'Citizen Dashboard'}
                  </Button>
                </Link>
                
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="truncate max-w-[120px] font-semibold">{currentUser?.fullName}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : isOfficer
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-teal-100 text-teal-800 border-teal-200'
                  }`}>
                    {isAdmin ? 'Admin' : isOfficer ? 'Officer' : 'Citizen'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Sign In Dropdown */}
                <div className="relative" ref={signInRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setSignInDropdownOpen(!signInDropdownOpen);
                      setRegisterDropdownOpen(false);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sign In</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {signInDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Select Portal Login
                      </div>
                      <Link
                        to="/login"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800">Citizen Login</div>
                          <div className="text-[10px] text-slate-400">Track and report civic hazards</div>
                        </div>
                      </Link>
                      <Link
                        to="/officer/login"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800">Officer Login</div>
                          <div className="text-[10px] text-slate-400">Field work orders & inspection</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Register Dropdown */}
                <div className="relative" ref={registerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterDropdownOpen(!registerDropdownOpen);
                      setSignInDropdownOpen(false);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                    <ChevronDown className="w-3.5 h-3.5 text-teal-200" />
                  </button>

                  {registerDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Create Account
                      </div>
                      <Link
                        to="/register"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800">Citizen Registration</div>
                          <div className="text-[10px] text-slate-400">Join neighborhood redressal</div>
                        </div>
                      </Link>
                      <Link
                        to="/officer/register"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800">Officer Registration</div>
                          <div className="text-[10px] text-slate-400">Requires Admin approval before login</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Admin Login Button */}
                <Link to="/admin/login">
                  <Button variant="outline" size="sm" icon={ShieldCheck} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                    Admin Login
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in duration-150">
          <div className="space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/') && location.pathname === '/' ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/public-issues"
              className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/public-issues') ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Public Issues
            </Link>
            <Link
              to="/how-it-works"
              className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/how-it-works') ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/about') ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                isActive('/contact') ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link to={getDashboardPath()} className="block w-full">
                  <Button variant="primary" className="w-full">
                    Open {isAdmin ? 'Admin Portal' : isOfficer ? 'Officer Desk' : 'Citizen Dashboard'}
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Sign Out ({currentUser?.fullName})
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Access & Registration
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      Citizen Login
                    </Button>
                  </Link>
                  <Link to="/officer/login" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      Officer Login
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/register" className="w-full">
                    <Button variant="primary" size="sm" className="w-full">
                      Citizen Register
                    </Button>
                  </Link>
                  <Link to="/officer/register" className="w-full">
                    <Button variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Officer Register
                    </Button>
                  </Link>
                </div>
                <Link to="/admin/login" className="block w-full pt-1">
                  <Button variant="secondary" size="sm" icon={ShieldCheck} className="w-full bg-slate-900 text-white">
                    Administrator Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
