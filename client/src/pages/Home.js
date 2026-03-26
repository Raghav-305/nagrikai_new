import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const roleCta = (() => {
    if (!user) return null;
    if (user.role === 'citizen') {
      return {
        title: 'Create a complaint in seconds',
        description: 'Upload a photo, add details, and let the AI route it to the right department.',
        primary: { to: '/create-complaint', label: 'Create complaint' },
        secondary: { to: '/complaints', label: 'View my complaints' },
      };
    }
    if (user.role === 'officer') {
      return {
        title: 'Manage department tickets',
        description: 'Review, prioritize, and update complaint status with notes for citizens.',
        primary: { to: '/department', label: 'Open dashboard' },
        secondary: { to: '/complaints', label: 'Browse complaints' },
      };
    }
    if (user.role === 'admin') {
      return {
        title: 'Monitor the whole system',
        description: 'Track performance and manage users across departments.',
        primary: { to: '/admin', label: 'Open admin dashboard' },
        secondary: { to: '/complaints', label: 'Browse complaints' },
      };
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container py-10 sm:py-14 animate-fadeIn">
        {/* Hero */}
        <div className="gradient-border relative overflow-hidden rounded-2xl glass shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-pink-600/5 dark:from-blue-400/10 dark:via-indigo-400/10 dark:to-pink-400/5 animate-shimmer" />
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-blue-500/15 blur-2xl animate-floatSoft" />
          <div className="absolute -bottom-14 -left-12 h-56 w-56 rounded-full bg-indigo-500/10 blur-2xl animate-floatSoft" />
          <div className="relative p-8 sm:p-10">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200/60 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 px-3 py-1 text-sm text-blue-700 dark:text-blue-200">
                <span className="font-semibold">Nagrik AI</span>
                <span className="text-blue-600/70 dark:text-blue-300/70">•</span>
                <span>Smart complaint management</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Report issues. Track progress. Get resolutions faster.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  An AI-powered workflow that routes complaints to the right department, prioritizes urgency, and keeps everyone updated.
                </p>
              </div>

              {!user ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/register" className="btn btn-gradient animate-popIn">
                    Create account
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign in
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Signed in as <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>{' '}
                    <span className="text-gray-400 dark:text-gray-500">/</span>{' '}
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                      {String(user.role || '').toUpperCase()}
                    </span>
                  </div>
                  {roleCta && (
                    <div className="mt-2 flex flex-col sm:flex-row gap-3">
                      <Link to={roleCta.primary.to} className="btn btn-gradient animate-popIn">
                        {roleCta.primary.label}
                      </Link>
                      <Link
                        to={roleCta.secondary.to}
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {roleCta.secondary.label}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role cards */}
        {!user && (
          <div className="mt-10">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Pick your role</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Citizens report issues, officers resolve them, admins monitor the system.
                </p>
              </div>
            </div>

            <div className="grid">
              <div className="card card-interactive p-6 sm:p-7 animate-slideInUp">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Citizen</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Submit complaints with photos and track progress.
                    </p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold">
                    C
                  </div>
                </div>
                <div className="mt-5">
                  <Link to="/register?role=citizen" className="btn btn-primary w-full">
                    Register as Citizen
                  </Link>
                </div>
              </div>

              <div className="card card-interactive p-6 sm:p-7 animate-slideInUp">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Officer</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Review assigned complaints and update status with notes.
                    </p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold">
                    O
                  </div>
                </div>
                <div className="mt-5">
                  <Link to="/register?role=officer" className="btn btn-primary w-full">
                    Register as Officer
                  </Link>
                </div>
              </div>

              <div className="card card-interactive p-6 sm:p-7 animate-slideInUp">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Admin</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Manage users and view system-wide statistics.
                    </p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-emerald-600/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-700 dark:text-emerald-200 font-bold">
                    A
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    className="btn w-full"
                    onClick={() => alert('Admin registration by system administrator only')}
                  >
                    Admin Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-12">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">How it works</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              A simple flow designed for speed, clarity, and accountability.
            </p>
          </div>

          <div className="grid">
            {[
              { step: '01', title: 'Submit', desc: 'Add a description and upload a photo (optional but recommended).' },
              { step: '02', title: 'AI routes', desc: 'The system categorizes and assigns it to the right department.' },
              { step: '03', title: 'Team works', desc: 'Officers update status and add notes as they make progress.' },
              { step: '04', title: 'Resolved', desc: 'You get the final update and a complete history of changes.' },
            ].map((item) => (
              <div key={item.step} className="card card-interactive p-6 sm:p-7 animate-slideInUp">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                    Step {item.step}
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-blue-600/10 dark:bg-blue-400/10" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
