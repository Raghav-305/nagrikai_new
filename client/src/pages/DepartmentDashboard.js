import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DepartmentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [noteText, setNoteText] = useState('');
  const { user } = useAuth();
  const officerDepartmentHeading = user?.department
    ? `${user.department} Officer Dashboard`
    : 'Officer Dashboard';

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await departmentAPI.getDepartmentComplaints(filter);
      setComplaints(data.complaints || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await departmentAPI.updateComplaintStatus(complaintId, {
        status: newStatus,
        note: noteText,
      });
      setSelectedComplaint(null);
      setNoteText('');
      fetchComplaints();
      alert('Complaint updated successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update complaint');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div>Loading...</div>;
  }

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
    if (!summary) {
      return null;
    }

    if (summary.actionPlanSteps?.length > 0) {
      return (
        <div className="grid gap-3">
          {summary.actionPlanSteps.map((step) => (
            <div key={step.label} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{step.label}</div>
              <div className="mt-1 text-sm text-gray-900 dark:text-white">{step.detail}</div>
            </div>
          ))}
        </div>
      );
    }

    if (summary.actionPlanText) {
      return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-900 dark:text-white">
          {summary.actionPlanText}
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300">
        No action plan available yet.
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container py-10 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200 px-3 py-1 text-sm font-semibold mb-3">
              {user?.department ? `${user.department} Officer` : 'Officer'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{officerDepartmentHeading}</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Review tickets for {user?.department || 'your department'}, update status, and add notes for citizens.
            </p>
          </div>
          <button className="btn btn-gradient" onClick={fetchComplaints}>
            Refresh
          </button>
        </div>

        <div className="card card-interactive p-6 mb-6 animate-popIn">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold">{complaints.length}</span> tickets
            </div>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="form-group mb-0">
              <label>Status</label>
              <select name="status" value={filter.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label>Priority</label>
              <select name="priority" value={filter.priority} onChange={handleFilterChange}>
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {complaints.length === 0 ? (
          <div className="card p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">No tickets found</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Try adjusting filters or refresh again.
            </p>
          </div>
        ) : (
          <div className="card card-interactive overflow-hidden animate-popIn">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/60">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                    <th className="px-5 py-4">Ticket</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Citizen</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition hover:translate-x-[1px]">
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">{complaint.ticket_id}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(complaint.createdAt).toLocaleString?.() || ''}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">
                        <span className="block max-w-xl">
                          {complaint.text?.length > 90 ? `${complaint.text.substring(0, 90)}…` : complaint.text}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${priorityPill(complaint.priority)}`}>
                          {String(complaint.priority || 'unknown').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${statusPill(complaint.status)} ring-4`}>
                          {String(complaint.status || 'unknown').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">
                        {complaint.user?.name || '-'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          className="btn btn-gradient"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          View & update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedComplaint && (
          <div className="modal active" onClick={() => setSelectedComplaint(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Ticket</div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedComplaint.ticket_id}
                  </h2>
                </div>
                <button className="btn btn-danger" onClick={() => setSelectedComplaint(null)}>
                  Close
                </button>
              </div>

              <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Citizen</div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {selectedComplaint.user?.name || '-'}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${statusPill(selectedComplaint.status)} ring-4`}>
                      {String(selectedComplaint.status || 'unknown').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Priority</div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${priorityPill(selectedComplaint.priority)}`}>
                      {String(selectedComplaint.priority || 'unknown').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</div>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {selectedComplaint.text}
                </p>
              </div>

              {selectedComplaint.image && (
                <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <img src={selectedComplaint.image} alt="Complaint" className="w-full h-[260px] object-cover transition-transform duration-300 hover:scale-[1.01]" />
                </div>
              )}

              <div className="mt-5">
                <div className="form-group mb-0">
                  <label>Add note</label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add your update or note…"
                    rows="4"
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">AI analysis</div>
                <div className="grid gap-3">
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Problem definition</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedComplaint.ai_summary?.problemDefinition || '-'}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Severity</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{selectedComplaint.ai_summary?.severity || '-'}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Reason</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedComplaint.ai_summary?.reason || '-'}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Conclusion</div>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedComplaint.ai_summary?.conclusion || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Action plan</div>
                {renderActionPlan(selectedComplaint.ai_summary)}
              </div>

              <div className="mt-5 grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button
                  className="btn btn-gradient"
                  onClick={() => handleStatusUpdate(selectedComplaint._id, 'in-progress')}
                >
                  Mark in progress
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusUpdate(selectedComplaint._id, 'resolved')}
                >
                  Mark resolved
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDashboard;
