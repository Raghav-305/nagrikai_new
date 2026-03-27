import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  FileText, 
  Users, 
  Zap, 
  Shield,
  Upload,
  BarChart3,
  Settings,
  Lock,
  Eye,
  X
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const roleCta = (() => {
    if (!user) return null;
    if (user.role === 'citizen') {
      return {
        title: 'File Your Complaint',
        description: 'Quick, secure, and transparent.',
        primary: { to: '/create-complaint', label: 'Create complaint' },
        secondary: { to: '/complaints', label: 'View my complaints' },
      };
    }
    if (user.role === 'officer') {
      return {
        title: 'Manage Your Department',
        description: 'Review, prioritize, and resolve.',
        primary: { to: '/department', label: 'Open dashboard' },
        secondary: { to: '/complaints', label: 'Browse complaints' },
      };
    }
    if (user.role === 'admin') {
      return {
        title: 'System Overview',
        description: 'Monitor, track, and optimize.',
        primary: { to: '/admin', label: 'Open admin dashboard' },
        secondary: { to: '/complaints', label: 'Browse complaints' },
      };
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 to-blue-800 dark:from-blue-900 dark:to-blue-950 border-b border-blue-900/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Nagrik AI</h1>
            </div>
            <p className="text-sm text-blue-100">Civic Complaint Management System</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="py-12 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  Report Issues.<br />
                  <span className="text-blue-700 dark:text-blue-400">Track Progress.</span><br />
                  Get Resolutions.
                </h2>
                <p className="mt-4 text-gray-700 dark:text-gray-300 text-base max-w-lg">
                  An AI-powered civic platform that routes complaints to the right department, prioritizes urgency, and keeps everyone updated in real-time.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-8 py-4 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">100%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Transparent</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">24/7</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">AI</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Powered</p>
                </div>
              </div>

              {/* Buttons */}
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors duration-200"
                  >
                    File a Complaint
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 border-blue-700 text-blue-700 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">{user.role?.toUpperCase()}</p>
                    </div>
                  </div>
                  {roleCta && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to={roleCta.primary.to} className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors duration-200 flex-1 text-sm">
                        {roleCta.primary.label}
                      </Link>
                      <Link
                        to={roleCta.secondary.to}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 border-blue-700 text-blue-700 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors duration-200 flex-1 text-sm"
                      >
                        {roleCta.secondary.label}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Features */}
            <div className="space-y-3 hidden lg:block">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                <div className="flex gap-3 items-start">
                  <Upload className="w-5 h-5 text-blue-700 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Filing</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Upload photos and details instantly</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/20 dark:to-teal-900/20 hover:border-teal-400 dark:hover:border-teal-600 transition-colors">
                <div className="flex gap-3 items-start">
                  <Zap className="w-5 h-5 text-teal-700 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Smart Routing</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">AI assigns to the right department</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/20 hover:border-amber-400 dark:hover:border-amber-600 transition-colors">
                <div className="flex gap-3 items-start">
                  <Eye className="w-5 h-5 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Live Updates</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Track progress every step of the way</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        {!user && (
          <section className="py-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Choose Your Role</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Citizen */}
              <div className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors bg-white dark:bg-gray-900/50">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Citizen</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">File complaints, attach evidence, and monitor resolution progress.</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Photo uploads
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Real-time tracking
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Notifications
                  </li>
                </ul>
                <Link to="/register?role=citizen" className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors duration-200 text-sm">
                  Register as Citizen
                </Link>
              </div>

              {/* Officer */}
              <div className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-teal-400 dark:hover:border-teal-600 transition-colors bg-white dark:bg-gray-900/50">
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/30 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-teal-700 dark:text-teal-400" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Officer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Review assignments, prioritize tickets, and update citizens.</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Dashboard view
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Priority management
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Status updates
                  </li>
                </ul>
                <Link to="/register?role=officer" className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-colors duration-200 text-sm">
                  Register as Officer
                </Link>
              </div>

              {/* Admin */}
              <div className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-600 transition-colors bg-white dark:bg-gray-900/50">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mb-3">
                  <Settings className="w-6 h-6 text-amber-700 dark:text-amber-400" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Admin</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Manage users, view analytics, and optimize the system.</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    System overview
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    User management
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Metrics & insights
                  </li>
                </ul>
                <button
                  onClick={() => setAdminModalOpen(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold bg-amber-700 hover:bg-amber-800 text-white transition-colors duration-200 text-sm"
                >
                  Admin Access
                </button>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="py-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Submit', desc: 'Describe your issue and upload photos', icon: Upload, color: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' },
              { step: '2', title: 'AI Routes', desc: 'System assigns to right department', icon: Zap, color: 'bg-teal-100 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400' },
              { step: '3', title: 'Team Works', desc: 'Officers prioritize and update status', icon: Users, color: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' },
              { step: '4', title: 'Resolved', desc: 'Final resolution delivered to you', icon: CheckCircle2, color: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.step} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center font-bold text-lg mb-3`}>
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-8 border-t border-gray-200 dark:border-gray-800 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <Lock className="w-6 h-6 text-blue-700 dark:text-blue-400 mb-2" />
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Secure & Encrypted</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Enterprise-grade security protects your data.</p>
            </div>
            <div className="p-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-teal-50/50 dark:bg-teal-950/20 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
              <Eye className="w-6 h-6 text-teal-700 dark:text-teal-400 mb-2" />
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Transparent Tracking</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Real-time updates keep you informed.</p>
            </div>
            <div className="p-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-950/20 hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
              <Users className="w-6 h-6 text-amber-700 dark:text-amber-400 mb-2" />
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Community Driven</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Powered by citizen participation.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Admin Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Admin Registration</h3>
              <button
                onClick={() => setAdminModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Admin accounts are created by system administrators only. Please contact your system administrator to request access.
            </p>
            <button
              onClick={() => setAdminModalOpen(false)}
              className="w-full px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-colors duration-200 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;