import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [filtersMeta, setFiltersMeta] = useState({ departments: [], severities: [] });
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, complaintsData] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllComplaints(filters),
      ]);

      setStats(statsData.data.stats);
      setUsers(usersData.data.users || []);
      setComplaints(complaintsData.data.complaints || []);
      setFiltersMeta(complaintsData.data.filtersMeta || { departments: [], severities: [] });
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const complaintsData = await adminAPI.getAllComplaints(filters);
      setComplaints(complaintsData.data.complaints || []);
      setFiltersMeta(complaintsData.data.filtersMeta || { departments: [], severities: [] });
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to fetch complaints');
      setComplaints([]);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      fetchData();
      alert('User deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const statusPill = (status) => {
    const map = {
      pending: 'bg-amber-500 ring-amber-200 dark:ring-amber-900/40',
      'in-progress': 'bg-blue-500 ring-blue-200 dark:ring-blue-900/40',
      resolved: 'bg-emerald-500 ring-emerald-200 dark:ring-emerald-900/40',
    };
    return map[status] || 'bg-gray-500 ring-gray-200 dark:ring-gray-800';
  };

  const priorityPill = (priority) => {
    const map = {
      low: 'bg-emerald-500',
      medium: 'bg-amber-500',
      high: 'bg-red-500',
      critical: 'bg-purple-600',
    };
    return map[priority] || 'bg-gray-500';
  };

  const renderActionPlan = (summary) => {
    if (!summary?.actionPlanSteps?.length && !summary?.actionPlanText) {
      return (
        <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300">
          No action plan available yet.
        </div>
      );
    }

    if (summary.actionPlanSteps?.length) {
      return (
        <div className="grid gap-3">
          {summary.actionPlanSteps.map((step) => (
            <div key={step.label} className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{step.label}</div>
              <div className="text-sm text-gray-900 dark:text-white">{step.detail}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-900 dark:text-white">
        {summary.actionPlanText}
      </div>
    );
  };

  const departmentGraphData = Object.values(
    complaints.reduce((acc, complaint) => {
      const department = complaint.department || 'Unassigned';
      if (!acc[department]) {
        acc[department] = { department, open: 0, closed: 0 };
      }

      if (complaint.status === 'resolved') {
        acc[department].closed += 1;
      } else {
        acc[department].open += 1;
      }

      return acc;
    }, {})
  );

  const priorityDeadlineData = Object.values(
    complaints.reduce((acc, complaint) => {
      const priority = complaint.ai_summary?.severity || complaint.priority || 'Unknown';
      if (!acc[priority]) {
        acc[priority] = {
          label: priority,
          value: 0,
          deadlines: {},
        };
      }

      acc[priority].value += 1;
      const deadline = complaint.deadline || 'No deadline';
      acc[priority].deadlines[deadline] = (acc[priority].deadlines[deadline] || 0) + 1;
      return acc;
    }, {})
  ).map((item, index) => {
    const topDeadline = Object.entries(item.deadlines).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No deadline';
    return {
      ...item,
      color: chartPalette[index % chartPalette.length],
      topDeadline,
    };
  });

  if (loading) {
    return <div className="loading"><div className="spinner"></div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950/40 dark:to-cyan-950/40 border border-blue-200 dark:border-blue-900/60 mb-3">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 animate-pulse"></span>
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Live Dashboard</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">Admin Control Center</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Monitor complaints, manage users, and analyze system performance</p>
          </div>
          <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300" onClick={fetchData}>
            Refresh
          </button>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-800 dark:text-red-200">{error}</div>}

        {/* Stats Grid */}
        {stats && (
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <StatCard
              label="Total Complaints"
              value={stats.totalComplaints}
              icon={AlertCircle}
              accent={{ border: 'border-indigo-200 dark:border-indigo-900/60', bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20', color: '#6366f1' }}
              trend={12}
            />
            <StatCard
              label="Pending"
              value={stats.pendingComplaints}
              icon={Clock}
              accent={{ border: 'border-amber-200 dark:border-amber-900/60', bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20', color: '#f59e0b' }}
            />
            <StatCard
              label="In Progress"
              value={stats.inProgressComplaints}
              icon={TrendingUp}
              accent={{ border: 'border-blue-200 dark:border-blue-900/60', bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20', color: '#3b82f6' }}
            />
            <StatCard
              label="Resolved"
              value={stats.resolvedComplaints}
              icon={CheckCircle}
              accent={{ border: 'border-emerald-200 dark:border-emerald-900/60', bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20', color: '#10b981' }}
            />
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              icon={Users}
              accent={{ border: 'border-purple-200 dark:border-purple-900/60', bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20', color: '#a855f7' }}
            />
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
            <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/60 border-b-2 border-gray-200 dark:border-gray-800">
                  <tr className="text-left text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Action</th>
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
                      <tr key={user._id} className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition">
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold text-white ${roleColor} shadow-sm`}>
                            {String(user.role || '').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{user.department || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 text-sm" onClick={() => handleDeleteUser(user._id)}>
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

        {/* Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Ticket</div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{selectedComplaint.ticket_id}</h2>
                </div>
                <button className="px-4 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition" onClick={() => setSelectedComplaint(null)}>
                  Close
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950/50 dark:to-gray-900/50">
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">Department</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedComplaint.department || '-'}</div>
                </div>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950/50 dark:to-gray-900/50">
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">Severity</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedComplaint.ai_summary?.severity || '-'}</div>
                </div>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950/50 dark:to-gray-900/50">
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">Status</div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white ${statusPill(selectedComplaint.status)} ring-2`}>
                      {String(selectedComplaint.status || 'unknown').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950/50 dark:to-gray-900/50">
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">Location</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedComplaint.location?.label || '-'}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedComplaint.text}</p>
              </div>

              {selectedComplaint.image && (
                <div className="mb-6 overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-800">
                  <img src={selectedComplaint.image} alt="Complaint" className="w-full h-[360px] object-cover" />
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">AI Analysis</h3>
                <div className="grid gap-4">
                  <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10">
                    <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-2">Problem Definition</div>
                    <p className="text-gray-900 dark:text-white">{selectedComplaint.ai_summary?.problemDefinition || '-'}</p>
                  </div>
                  <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10">
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">Root Reason</div>
                    <p className="text-gray-900 dark:text-white">{selectedComplaint.ai_summary?.reason || '-'}</p>
                  </div>
                  <div className="rounded-xl border-2 border-gray-200 dark:border-gray-800 p-4 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10">
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2">Conclusion</div>
                    <p className="text-gray-900 dark:text-white">{selectedComplaint.ai_summary?.conclusion || '-'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Action Plan</h3>
                {renderActionPlan(selectedComplaint.ai_summary)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;