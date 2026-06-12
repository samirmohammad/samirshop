import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const adminApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token and secret to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  const secret = localStorage.getItem('adminSecret');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (secret) {
    config.headers['x-admin-secret'] = secret;
  }
  
  return config;
});

// Error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminSecret');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;