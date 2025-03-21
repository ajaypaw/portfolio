import axios from 'axios';

// Determine the base URL from env variable with a fallback
const apiBaseUrl =  'https://ajay-portfolio-017w.onrender.com';

// Initialize API with debugging helpers
const api = axios.create({
  baseURL: apiBaseUrl,  // No /api suffix here, will be included in route paths
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData, remove content-type to let the browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers
    });

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response (${response.status}):`, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 (Unauthorized) errors by redirecting to login
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && 
          window.location.pathname !== '/admin/login') {
        // Only redirect if we're on an admin page and not already on the login page
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Debug helper methods for troubleshooting
api.debug = {
  testConnection: () => api.get('/api/debug'),
  testAuth: () => api.get('/api/auth/user'),
  clearToken: () => localStorage.removeItem('token'),
  getCurrentToken: () => localStorage.getItem('token')
};

export default api; 
