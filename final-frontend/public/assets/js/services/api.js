/**
 * API Service - Vanilla JavaScript HTTP Client
 * Handles all API communication with the backend
 */

const API_BASE_URL = 'http://localhost:8000';

class APIClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken') || null;
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    getToken() {
        return this.token;
    }

    async request(method, endpoint, data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            if (response.status === 401) {
                this.setToken(null);
                window.location.href = 'login.html';
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    message: response.statusText,
                }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            const responseData = await response.json().catch(() => null);
            return responseData;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    get(endpoint) {
        return this.request('GET', endpoint);
    }

    post(endpoint, data) {
        return this.request('POST', endpoint, data);
    }

    put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    }

    patch(endpoint, data) {
        return this.request('PATCH', endpoint, data);
    }

    delete(endpoint) {
        return this.request('DELETE', endpoint);
    }
}

const apiClient = new APIClient();

// Auth Service
const authService = {
    login: (loginId, password) => apiClient.post('/api/auth/login', { login_id: loginId, password: password }),
    logout: () => apiClient.post('/api/auth/logout'),
    getCurrentUser: () => apiClient.get('/api/auth/me'),
    resetPassword: (loginId) => apiClient.post('/api/auth/reset-password', { login_id: loginId }),
    updatePassword: (token, password) => apiClient.post('/api/auth/update-password', { token, password }),
};

// Subject Service
const subjectService = {
    getAll: (page = 1, limit = 10) => apiClient.get(`/api/subjects?page=${page}&limit=${limit}`),
    getById: (id) => apiClient.get(`/api/subjects/${id}`),
    create: (data) => apiClient.post('/api/subjects', data),
    update: (id, data) => apiClient.put(`/api/subjects/${id}`, data),
    delete: (id) => apiClient.delete(`/api/subjects/${id}`),
    search: (query) => apiClient.get(`/api/subjects/search?q=${encodeURIComponent(query)}`),
};

// Teacher Service
const teacherService = {
    getAll: (page = 1, limit = 10) => apiClient.get(`/api/teachers?page=${page}&limit=${limit}`),
    getById: (id) => apiClient.get(`/api/teachers/${id}`),
    create: (data) => apiClient.post('/api/teachers', data),
    update: (id, data) => apiClient.put(`/api/teachers/${id}`, data),
    delete: (id) => apiClient.delete(`/api/teachers/${id}`),
    search: (query) => apiClient.get(`/api/teachers/search?q=${encodeURIComponent(query)}`),
};

// Student Service
const studentService = {
    getAll: (page = 1, limit = 10) => apiClient.get(`/api/students?page=${page}&limit=${limit}`),
    getById: (id) => apiClient.get(`/api/students/${id}`),
    create: (data) => apiClient.post('/api/students', data),
    update: (id, data) => apiClient.put(`/api/students/${id}`, data),
    delete: (id) => apiClient.delete(`/api/students/${id}`),
    search: (query) => apiClient.get(`/api/students/search?q=${encodeURIComponent(query)}`),
};

// Score Service
const scoreService = {
    getAll: (page = 1, limit = 10) => apiClient.get(`/api/scores?page=${page}&limit=${limit}`),
    getById: (id) => apiClient.get(`/api/scores/${id}`),
    create: (data) => apiClient.post('/api/scores', data),
    update: (id, data) => apiClient.put(`/api/scores/${id}`, data),
    delete: (id) => apiClient.delete(`/api/scores/${id}`),
    search: (query) => apiClient.get(`/api/scores/search?q=${encodeURIComponent(query)}`),
};

// Classroom Service
const classroomService = {
    getAll: (page = 1, limit = 10) => apiClient.get(`/api/classrooms?page=${page}&limit=${limit}`),
    getById: (id) => apiClient.get(`/api/classrooms/${id}`),
    create: (data) => apiClient.post('/api/classrooms', data),
    update: (id, data) => apiClient.put(`/api/classrooms/${id}`, data),
    delete: (id) => apiClient.delete(`/api/classrooms/${id}`),
    search: (query) => apiClient.get(`/api/classrooms/search?q=${encodeURIComponent(query)}`),
};
