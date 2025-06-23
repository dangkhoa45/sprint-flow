import axios from 'axios';
import { log } from './logger';

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  config => {
    log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';').reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          if (key && value) {
            acc[key] = decodeURIComponent(value);
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const host = window.location.host;
      const accessToken = cookies[`${host}:at`];

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log('🔑 Added Authorization header to request');
      }
    }

    return config;
  },
  error => {
    log('Request error:', error);
    return Promise.reject(new Error(error.message || 'Request failed'));
  }
);

axiosInstance.interceptors.response.use(
  response => {
    log(`Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    log('Response error:', error);
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - redirecting to login');

      if (typeof window !== 'undefined') {
        const host = window.location.host;
        document.cookie = `${host}:at=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${host}:rt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${host}:ut=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        window.location.href = '/login';
      }
    }
    return Promise.reject(new Error(error.message || 'Response failed'));
  }
);

export default axiosInstance;
