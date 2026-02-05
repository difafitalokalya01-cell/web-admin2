// app/lib/axios.js
import axios from 'axios';

// Default axios instance untuk Client Component
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    timeout: 10000,
    withCredentials: true
});

// Request interceptor untuk logging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('📤 Client Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor untuk logging
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('📥 Client Response:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('❌ Client Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;