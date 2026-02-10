import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ✅ Request interceptor untuk auto-handle FormData
instance.interceptors.request.use(
  (config) => {
    // Auto-detect FormData dan set header yang benar
    if (config.data instanceof FormData) {
      console.log('🔧 Auto-detected FormData, setting multipart/form-data header');
      // Hapus Content-Type agar browser set sendiri dengan boundary
      delete config.headers['Content-Type'];
      // Atau set explicit (axios akan tambahkan boundary otomatis)
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

export default instance;