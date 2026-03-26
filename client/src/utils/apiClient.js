import axios from 'axios';
class ApiClient {
    constructor(baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "baseURL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                this.clearToken();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    getToken() {
        return localStorage.getItem('authToken');
    }
    clearToken() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
    setToken(token) {
        localStorage.setItem('authToken', token);
    }
    isAuthenticated() {
        return !!this.getToken();
    }
    // Auth endpoints
    async register(data) {
        try {
            const response = await this.client.post('/auth/register', data);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async login(credentials) {
        try {
            const response = await this.client.post('/auth/login', credentials);
            if (response.data.token) {
                this.setToken(response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getCurrentUser() {
        try {
            const response = await this.client.get('/auth/me');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async logout() {
        this.clearToken();
    }
    // Complaint endpoints
    async createComplaint(data) {
        try {
            const response = await this.client.post('/complaints', data);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getComplaints(params) {
        try {
            const response = await this.client.get('/complaints', { params });
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getComplaintById(id) {
        try {
            const response = await this.client.get(`/complaints/${id}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async updateComplaint(id, data) {
        try {
            const response = await this.client.put(`/complaints/${id}`, data);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async deleteComplaint(id) {
        try {
            const response = await this.client.delete(`/complaints/${id}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    // Department endpoints
    async getDepartments() {
        try {
            const response = await this.client.get('/departments');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getDepartmentById(id) {
        try {
            const response = await this.client.get(`/departments/${id}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    // Admin endpoints
    async getAdminDashboard() {
        try {
            const response = await this.client.get('/admin/dashboard');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getAdminStats() {
        try {
            const response = await this.client.get('/admin/stats');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    handleError(error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || 'An error occurred';
            return new Error(message);
        }
        return error instanceof Error ? error : new Error('Unknown error occurred');
    }
}
export const apiClient = new ApiClient();
export default apiClient;
