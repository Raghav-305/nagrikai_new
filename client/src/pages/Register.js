import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
    department: '',
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'officer' && !formData.department) {
      setError('Department is required for officers');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role, formData.department);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container py-12">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold animate-floatSoft">
              NA
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Join to report issues, track progress, and get updates.
            </p>
          </div>

          <div className="card card-interactive p-6 sm:p-8 animate-popIn">
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group mb-0">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

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
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                />
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group mb-0">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="citizen">Citizen</option>
                    <option value="officer">Officer</option>
                  </select>
                </div>

                <div className="form-group mb-0">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={formData.role !== 'officer'}
                  >
                    <option value="">
                      {formData.role === 'officer' ? 'Select Department' : 'Not required'}
                    </option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Utility">Utility</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="Environment">Environment</option>
                  </select>
                  {formData.role === 'officer' && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Officers must pick a department.
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-gradient w-full" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-700 dark:text-blue-200 hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            By signing up, you agree to keep your account secure.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
