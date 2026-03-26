// User and Authentication Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'department' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'department' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Complaint Types
export interface Complaint {
  _id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  assignedTo?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  aiDetectionResult?: {
    category: string;
    confidence: number;
    isFake: boolean;
  };
  slaDeadline?: string;
}

export interface ComplaintFilters {
  status?: string;
  priority?: string;
  category?: string;
  department?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
}

// Documentation Types
export interface DocumentData {
  filename: string;
  path: string;
  title: string;
  content: string;
  headings: Heading[];
  lastModified: string;
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface DocSidebarItem {
  title: string;
  path: string;
  filename: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Department Types
export interface Department {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
