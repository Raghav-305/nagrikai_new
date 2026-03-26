export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Nagrik AI';
export const COMPLAINT_STATUS = {
    OPEN: 'open',
    IN_PROGRESS: 'in-progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
};
export const COMPLAINT_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};
export const USER_ROLES = {
    CITIZEN: 'citizen',
    DEPARTMENT: 'department',
    ADMIN: 'admin',
};
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    THEME: 'theme',
    SIDEBAR_COLLAPSED: 'sidebarCollapsed',
};
export const API_ENDPOINTS = {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GET_USER: '/auth/me',
    // Complaints
    CREATE_COMPLAINT: '/complaints',
    GET_COMPLAINTS: '/complaints',
    GET_COMPLAINT: (id) => `/complaints/${id}`,
    UPDATE_COMPLAINT: (id) => `/complaints/${id}`,
    DELETE_COMPLAINT: (id) => `/complaints/${id}`,
    // Departments
    GET_DEPARTMENTS: '/departments',
    GET_DEPARTMENT: (id) => `/departments/${id}`,
    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_STATS: '/admin/stats',
};
export const STATUS_COLORS = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
};
export const PRIORITY_COLORS = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
};
