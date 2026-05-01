import axios from 'axios';
import toast from 'react-hot-toast';

// Guard: Warn loudly if env var is missing (catches Vercel misconfiguration instantly)
if (!import.meta.env.VITE_API_URL) {
  console.error('[ShuttleElite] VITE_API_URL is not set! Check Vercel environment variables.');
}

const apiClient = axios.create({
  baseURL: `${(import.meta.env.VITE_API_URL || 'https://shuttleelite.onrender.com').replace(/\/$/, '')}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout — prevents hanging requests on slow Render cold starts
});

// Request interceptor: Inject Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Safe global error handling
// Prevents "Cannot read properties of undefined" crashes when response is null
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response at all — Render down, CORS blocked, timeout)
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/';
    } else if (status === 403) {
      toast.error('Access denied.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
