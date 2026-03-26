import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsData = await adminAPI.getDashboardStats();
      const usersData = await adminAPI.getAllUsers();
      setStats(statsData.data.stats);
      setUsers(usersData.data.users);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        fetchData();
        alert('User deleted successfully!');
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container py-10 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin dashboard</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Monitor usage and manage users across the platform.
            </p>
          </div>
          <button className="btn btn-gradient" onClick={fetchData}>
            Refresh
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {stats && (
          <div className="grid">
            {[
              {
                label: 'Total users',
                value: stats.totalUsers,
                accent: 'border-blue-500 text-blue-700 dark:text-blue-200 bg-blue-50/60 dark:bg-blue-950/20',
              },
              {
                label: 'Total complaints',
                value: stats.totalComplaints,
                accent: 'border-indigo-500 text-indigo-700 dark:text-indigo-200 bg-indigo-50/60 dark:bg-indigo-950/20',
              },
              {
                label: 'Pending',
                value: stats.pendingComplaints,
                accent: 'border-amber-500 text-amber-800 dark:text-amber-200 bg-amber-50/70 dark:bg-amber-950/20',
              },
              {
                label: 'Resolved',
                value: stats.resolvedComplaints,
                accent: 'border-emerald-500 text-emerald-800 dark:text-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/20',
              },
            ].map((item) => (
              <div key={item.label} className={`card card-interactive p-6 border-l-4 ${item.accent} animate-slideInUp`}>
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{item.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="card card-interactive p-6 mt-8 animate-popIn">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">All users</h2>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {users.length} users
            </div>
          </div>

          {users.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/60">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {users.map((user) => {
                    const roleColor =
                      user.role === 'admin'
                        ? 'bg-purple-600'
                        : user.role === 'officer'
                          ? 'bg-blue-600'
                          : 'bg-emerald-600';
                    return (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition hover:translate-x-[1px]">
                        <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{user.name}</td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">{user.email}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${roleColor}`}>
                            {String(user.role || '').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">{user.department || '-'}</td>
                        <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="btn btn-danger" onClick={() => handleDeleteUser(user._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
