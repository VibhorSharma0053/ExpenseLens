import axios from 'axios';

// Use environment variable if available, otherwise default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper functions for tokens
export const storeTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('access_token', accessToken);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getErrorMessage = (error) => {
  return error.response?.data?.detail || 'An unexpected error occurred';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// --- INTERCEPTORS ---

// 1. Add Token to Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Handle Token Refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only try refresh if error is 401, we haven't retried yet, and it's not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token');
        }

        // Call refresh endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        
        storeTokens(access_token, newRefreshToken);
        
        // Update header and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        clearTokens();
        window.location.href = '/'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// --- API DEFINITIONS ---

export const authAPI = {
  login: async (creds) => {
    const res = await api.post('/auth/login', creds);
    return res.data;
  },
  signup: async (data) => {
    const res = await api.post('/auth/signup', data);
    return res.data;
  },
  logout: async (refreshToken) => {
    return api.post('/auth/logout', { refresh_token: refreshToken });
  },
  logoutAll: async () => {
    return api.post('/auth/logout-all');
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const transactionsAPI = {
  getTransactions: async (params) => {
    const res = await api.get('/transactions', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },
  updateCategory: async (id, category) => {
    const res = await api.put(`/transactions/${id}/category`, { category });
    return res.data;
  },
  deleteTransaction: async (id) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },
  uploadPDF: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await api.post('/transactions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if(onUploadProgress) onUploadProgress(percentCompleted);
      }
    });
    return res.data;
  }
};

export const analyticsAPI = {
  getSummary: async (params) => {
    const res = await api.get('/analytics/summary', { params });
    return res.data;
  },
  getMonthlyTrend: async (months = 6) => {
    const res = await api.get('/analytics/monthly-trend', { params: { months } });
    return res.data;
  },
  getCategoryBreakdown: async (params) => {
    const res = await api.get('/analytics/category-breakdown', { params });
    return res.data;
  },
  // NEW METHOD: Get daily trend for a specific month and year
  getDailyTrend: async (month, year) => {
    const res = await api.get('/analytics/daily-trend', { 
      params: { month, year } 
    });
    return res.data;
  }
};

export default api;