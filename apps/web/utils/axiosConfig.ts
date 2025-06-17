import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  withCredentials: true,
});

// Request interceptor to add Authorization header from cookies
axiosInstance.interceptors.request.use(
  (config) => {
    // Only add Authorization header if we're in browser environment
    if (typeof window !== 'undefined') {
      // Get all cookies
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {} as Record<string, string>);

      // Get host from current location
      const host = window.location.host;
      const accessToken = cookies[`${host}:at`];

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log('🔑 Added Authorization header to request');
      } else {
        console.log('❌ No access token found in cookies for host:', host);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - redirecting to login');
      // Clear cookies on 401
      if (typeof window !== 'undefined') {
        const host = window.location.host;
        document.cookie = `${host}:at=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${host}:rt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${host}:ut=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
