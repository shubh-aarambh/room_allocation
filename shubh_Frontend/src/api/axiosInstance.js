import axios from 'axios';
import { toast } from 'react-toastify';

// Use VITE_API_BASE_URL in production; during dev use relative '/api' so Vite proxy forwards requests and avoids CORS.
const baseURL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : '/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('token');
    } else {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
