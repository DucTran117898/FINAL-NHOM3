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
            if (data instanceof FormData) {
                options.body = data;
                delete options.headers['Content-Type'];
            } else {
                options.body = JSON.stringify(data);
            }
        }

        try {
            const response = await fetch(url, options);

            if (response.status === 401) {
                this.setToken(null);
                const isNested = window.location.pathname.includes('/subjects/');
                window.location.href = isNested ? '../login.html' : 'login.html';
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
    // GIỮ NGUYÊN CÁC DÒNG CŨ ĐANG CHẠY ĐƯỢC
    login: (loginId, password) => apiClient.post('/api/auth/login', { login_id: loginId, password: password }),
    logout: () => apiClient.post('/api/auth/logout'),
    getCurrentUser: () => apiClient.get('/api/auth/me'),

    // --- THÊM 3 DÒNG NÀY (Dùng đúng chuẩn /api/auth/...) ---
    requestReset: (loginId) => apiClient.post('/api/auth/reset-request', { login_id: loginId }),

    getPendingResets: () => apiClient.get('/api/auth/reset-list'),

    approveReset: (id, newPassword) => apiClient.post('/api/auth/reset-approve', { id: id, new_password: newPassword })
};

// Subject Service
const subjectService = {
    getAll: () => apiClient.get('/api/subjects'),
    getById: (id) => apiClient.get(`/api/subjects/${id}`),
    create: (data) => apiClient.post('/api/subjects', data),
    update: (id, data) => apiClient.put(`/api/subjects/${id}`, data),
    delete: (id) => apiClient.delete(`/api/subjects/${id}`),
    search: (query) => apiClient.get(`/api/subjects?keyword=${encodeURIComponent(query)}`),
};

// Teacher Service
const teacherService = {
    getAll: () => apiClient.get('/api/teachers'),
    getById: (id) => apiClient.get(`/api/teachers/${id}`),
    create: (data) => apiClient.post('/api/teachers', data),
    update: (id, data) => apiClient.put(`/api/teachers/${id}`, data),
    delete: (id) => apiClient.delete(`/api/teachers/${id}`),
    search: (query) => apiClient.get(`/api/teachers?keyword=${encodeURIComponent(query)}`),
};

// Student Service
const studentService = {
    getAll: () => apiClient.get('/api/students'),
    getById: (id) => apiClient.get(`/api/students/${id}`),
    create: (data) => apiClient.post('/api/students', data),
    update: (id, data) => apiClient.put(`/api/students/${id}`, data),
    delete: (id) => apiClient.delete(`/api/students/${id}`),
    search: (query) => apiClient.get(`/api/students?keyword=${encodeURIComponent(query)}`),
};

// Score Service
const scoreService = {
    getAll: () => apiClient.get('/api/scores'),
    getById: (id) => apiClient.get(`/api/scores/${id}`),
    create: (data) => apiClient.post('/api/scores', data),
    update: (id, data) => apiClient.put(`/api/scores/${id}`, data),
    delete: (id) => apiClient.delete(`/api/scores/${id}`),
    search: (studentName = '', subjectName = '', teacherName = '') => {
        const params = new URLSearchParams();
        if (studentName) params.append('student_name', studentName);
        if (subjectName) params.append('subject_name', subjectName);
        if (teacherName) params.append('teacher_name', teacherName);
        return apiClient.get(`/api/scores?${params.toString()}`);
    },
};

// Classroom Service
const classroomService = {
    getAll: () => apiClient.get('/api/classrooms'),
    getById: (id) => apiClient.get(`/api/classrooms/${id}`),
    create: (data) => apiClient.post('/api/classrooms', data),
    update: (id, data) => apiClient.put(`/api/classrooms/${id}`, data),
    delete: (id) => apiClient.delete(`/api/classrooms/${id}`),
    search: (query) => apiClient.get(`/api/classrooms?keyword=${encodeURIComponent(query)}`),
};
