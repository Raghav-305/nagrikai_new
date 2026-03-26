import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await complaintAPI.getUserComplaints();
      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-500', ring: 'ring-amber-200 dark:ring-amber-900/40' };
      case 'in-progress':
        return { bg: 'bg-blue-500', ring: 'ring-blue-200 dark:ring-blue-900/40' };
      case 'resolved':
        return { bg: 'bg-emerald-500', ring: 'ring-emerald-200 dark:ring-emerald-900/40' };
      default:
        return { bg: 'bg-gray-500', ring: 'ring-gray-200 dark:ring-gray-800' };
    }
  };

  const getPriorityBadge = (priority) => {
    const map = {
      low: 'bg-emerald-500',
      medium: 'bg-amber-500',
      high: 'bg-red-500',
      critical: 'bg-purple-600',
    };
    return map[priority] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container py-10 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My complaints</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Track status updates, notes, and assignments for your submitted issues.
            </p>
          </div>
          <Link to="/create-complaint" className="btn btn-gradient">
            + New complaint
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {complaints.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold">
              !
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">No complaints yet</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Create your first complaint and we’ll route it automatically.
            </p>
            <div className="mt-6">
              <Link to="/create-complaint" className="btn btn-primary">
                Create complaint
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid">
            {complaints.map((complaint) => {
              const statusStyle = getStatusColor(complaint.status);
              return (
                <div key={complaint._id} className="card card-interactive overflow-hidden animate-slideInUp">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Ticket
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {complaint.ticket_id}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(complaint.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${getPriorityBadge(complaint.priority)}`}>
                          {String(complaint.priority || 'unknown').toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${statusStyle.bg} ring-4 ${statusStyle.ring}`}>
                          {String(complaint.status || 'unknown').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                      {complaint.text}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-gray-700 dark:text-gray-200">
                        <span className="font-semibold mr-1">Department:</span> {complaint.department || '-'}
                      </span>
                      {complaint.assignedTo && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-gray-700 dark:text-gray-200">
                          <span className="font-semibold mr-1">Assigned:</span> {complaint.assignedTo?.name || 'Unknown'}
                        </span>
                      )}
                    </div>
                  </div>

                  {complaint.image && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-black/5 dark:bg-white/5">
                      <img
                        src={complaint.image}
                        alt="Complaint"
                        className="w-full h-[220px] object-cover transition-transform duration-300 hover:scale-[1.01]"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {complaint.department_notes?.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-5 bg-blue-50/60 dark:bg-blue-950/20">
                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-200">
                        Latest update
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                        {complaint.department_notes[complaint.department_notes.length - 1]?.note}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsList;
