// src/lib/api.ts
import axios from 'axios';

// Direct API URL
const API_URL = 'https://backend.cauhec.org/api/v1';

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password });
      
      // Solution 1: Use fetch with appropriate CORS settings
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: 'omit' // Important for CORS
      });
      
      // If we get here, the request succeeded
      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.status === 'success') {
        // Store authentication data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return {
          success: true,
          data: data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error using fetch:', error);
      
      try {
        // Solution 2: Try with axios
        console.log('Trying with axios...');
        
        const axiosResponse = await axios({
          method: 'post',
          url: `${API_URL}/admin/login`,
          data: { email, password },
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: false
        });
        
        console.log('Axios login response:', axiosResponse.data);
        
        if (axiosResponse.data.status === 'success') {
          localStorage.setItem('token', axiosResponse.data.token);
          localStorage.setItem('user', JSON.stringify(axiosResponse.data.user));
          
          return {
            success: true,
            data: axiosResponse.data
          };
        } else {
          return {
            success: false,
            message: axiosResponse.data.message || 'Login failed'
          };
        }
      } catch (axiosError) {
        console.error('Login error using axios:', axiosError);
        
        try {
          // Solution 3: Using a CORS proxy
          console.log('Trying with CORS proxy...');
          const CORS_PROXY = 'https://corsproxy.io/?';
          
          const proxyResponse = await fetch(`${CORS_PROXY}${encodeURIComponent(API_URL + '/admin/login')}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json' 
            },
            body: JSON.stringify({ email, password })
          });
          
          const proxyData = await proxyResponse.json();
          console.log('Proxy login response:', proxyData);
          
          if (proxyData.status === 'success') {
            localStorage.setItem('token', proxyData.token);
            localStorage.setItem('user', JSON.stringify(proxyData.user));
            
            return {
              success: true,
              data: proxyData
            };
          } else {
            return {
              success: false,
              message: proxyData.message || 'Login failed'
            };
          }
        } catch (proxyError) {
          console.error('CORS proxy error:', proxyError);
          
          return {
            success: false,
            message: 'Cannot connect to the server due to CORS restrictions. Please contact the administrator.',
            error: proxyError
          };
        }
      }
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
};

// Create authenticated API instance
const createAuthenticatedApi = () => {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    withCredentials: false
  });
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      // Try with fetch first
      const response = await fetch(`${API_URL}/admin/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats with fetch:', error);
      
      try {
        // Try with axios as fallback
        const api = createAuthenticatedApi();
        const response = await api.get('/admin/stats');
        return response.data;
      } catch (axiosError) {
        console.error('Error fetching dashboard stats with axios:', axiosError);
        
        try {
          // Try with CORS proxy as last resort
          const token = localStorage.getItem('token');
          const CORS_PROXY = 'https://corsproxy.io/?';
          
          const proxyResponse = await fetch(`${CORS_PROXY}${encodeURIComponent(API_URL + '/admin/stats')}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          const proxyData = await proxyResponse.json();
          return proxyData;
        } catch (proxyError) {
          console.error('Error fetching dashboard stats with proxy:', proxyError);
          throw proxyError;
        }
      }
    }
  },
  
  getPreceptorsVsStudents: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      // Try with fetch first
      const response = await fetch(`${API_URL}/admin/charts/preceptors-vs-students`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching preceptors vs students data:', error);
      
      // If this endpoint doesn't exist or fails, return a meaningful error
      throw new Error('Could not fetch preceptors vs students data. The endpoint might not exist yet.');
    }
  }
};

// Add an axios interceptor to handle token expiration
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Redirect to login page
      authAPI.logout();
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default {
  auth: authAPI,
  dashboard: dashboardAPI
};