import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse, AuthResponse } from '@types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private clearToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  public setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Auth endpoints
  async register(data: any): Promise<AuthResponse> {
    try {
      const response = await this.client.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(credentials: any): Promise<AuthResponse> {
    try {
      const response = await this.client.post('/auth/login', credentials);
      if (response.data.token) {
        this.setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // Complaint endpoints
  async createComplaint(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/complaints', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getComplaints(params?: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/complaints', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getComplaintById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateComplaint(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.put(`/complaints/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteComplaint(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.delete(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Department endpoints
  async getDepartments(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/departments');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDepartmentById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAdminStats(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
