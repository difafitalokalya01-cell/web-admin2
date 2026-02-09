import axios from 'axios';

// Buat instance axios dengan konfigurasi default
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    console.log('🔑 Token:', token ? 'Ada' : 'Tidak ada');
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {

    console.log('✅ Response:', response.config.url, response.status);
    return response;
  },
  (error) => {

    console.error('❌ Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message
    });
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('🔒 Unauthorized - Clearing tokens');
          
          localStorage.removeItem('admin_token');
          localStorage.removeItem('adminId');
          localStorage.removeItem('adminName');
          
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          console.warn('🚫 Forbidden - Insufficient permissions');
          break;
          
        case 404:
          console.warn('🔍 Not Found:', error.config?.url);
          break;
          
        case 500:
          console.error('💥 Server Error');
          break;
      }
    } else if (error.request) {
      console.error('🌐 Network Error - No response received');
    } else {
      // Error lain
      console.error('⚠️ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;
