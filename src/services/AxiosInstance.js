import axios from 'axios';
import { store } from '../store/store';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 10000, // 10 second timeout
});

axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('userDetails');
            window.location.href = '/login';
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            // Backend not available - this will be handled by the mock services
            console.warn('Backend not available, using mock services');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
