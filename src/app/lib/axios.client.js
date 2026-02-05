// app/lib/server-axios.js
import axios from 'axios';
import { cookies } from 'next/headers';

export const getServerAxios = async () => {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    
    if (!adminToken) {
        console.warn('⚠️ Warning: No admin_token found in cookies!');
    }

    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            ...(adminToken && { 
                Authorization: `Bearer ${adminToken}`
            })
        }
    });

    // Request interceptor untuk debug
    instance.interceptors.request.use(
        (config) => {
            console.log('📤 Request to backend:', {
                url: config.url,
                method: config.method.toUpperCase(),
                hasAuth: !!config.headers.Authorization,
                authHeader: config.headers.Authorization ? 'Bearer [TOKEN]' : 'NONE'
            });
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                console.error('❌ Backend Error:', {
                    url: error.config?.url,
                    status: error.response.status,
                    data: error.response.data
                });
            }
            return Promise.reject(error);
        }
    );

    return instance;
};