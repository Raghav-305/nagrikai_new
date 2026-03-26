import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container py-12">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold animate-floatSoft">
              NA
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Sign in to track and manage complaints.
            </p>
          </div>

          <div className="card card-interactive p-6 sm:p-8 animate-popIn">
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group mb-0">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group mb-0">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn btn-gradient w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
              Don’t have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-700 dark:text-blue-200 hover:underline">
                Create one
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Tip: Use a strong password and don’t share your login.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
