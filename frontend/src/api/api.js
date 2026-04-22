/**
 * API (Axios Instance)
 * --------------------
 * High-performance axios instance configured for AWS Lightsail / Nginx.
 * Handles dynamic Base URL resolution and automatic JWT authentication.
 */

import axios from 'axios';

// Resolve Base URL:
// 1. If VITE_API_BASE_URL is defined in .env, use it.
// 2. Otherwise use '/api' (Nginx proxy path).
const baseURL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach security tokens
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth failures globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default API;
