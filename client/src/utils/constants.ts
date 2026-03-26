export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Nagrik AI';

export const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const USER_ROLES = {
  CITIZEN: 'citizen',
  DEPARTMENT: 'department',
  ADMIN: 'admin',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const;

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GET_USER: '/auth/me',
  
  // Complaints
  CREATE_COMPLAINT: '/complaints',
  GET_COMPLAINTS: '/complaints',
  GET_COMPLAINT: (id: string) => `/complaints/${id}`,
  UPDATE_COMPLAINT: (id: string) => `/complaints/${id}`,
  DELETE_COMPLAINT: (id: string) => `/complaints/${id}`,
  
  // Departments
  GET_DEPARTMENTS: '/departments',
  GET_DEPARTMENT: (id: string) => `/departments/${id}`,
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STATS: '/admin/stats',
} as const;

export const STATUS_COLORS = {
  open: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
} as const;

export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
} as const;
