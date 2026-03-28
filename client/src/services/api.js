import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

// Complaint endpoints
export const complaintAPI = {
  createComplaint: (data) => API.post('/complaints', data),
  getUserComplaints: () => API.get('/complaints'),
  getComplaintById: (id) => API.get(`/complaints/${id}`),
};

// Department endpoints
export const departmentAPI = {
  getDepartmentComplaints: (params) => API.get('/department/complaints', { params }),
  updateComplaintStatus: (id, data) => API.put(`/department/complaint/${id}/status`, data),
  assignComplaint: (id, data) => API.put(`/department/complaint/${id}/assign`, data),
};

export const locationAPI = {
  resolveLocation: (data) => API.post('/location/resolve', data),
};

// Admin endpoints
export const adminAPI = {
  getAllUsers: () => API.get('/admin/users'),
  getDashboardStats: () => API.get('/admin/stats'),
  getAllComplaints: (params) => API.get('/admin/complaints', { params }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  updateUserRole: (id, data) => API.put(`/admin/users/${id}/role`, data),
};

export default API;
