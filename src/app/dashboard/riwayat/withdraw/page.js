'use client';

import WithdrawHistoryContent from "./compnent/content";
import { useEffect, useState } from 'react';
import axios from "@/app/lib/axios";
import { toast } from 'react-toastify';

export default function WithdrawHistoryPage() {
    const [withdraws, setWithdraws] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('📥 Fetching withdraw history...');
            
            const response = await axios.get('/api/admin/withdraws', {
                params: { limit: 1000 }
            });
            
            console.log('✅ Response:', response.data);
            
            // ✅ Sesuaikan dengan struktur response backend
            const data = response.data?.data?.withdraws || [];
            setWithdraws(Array.isArray(data) ? data : []);
            
        } catch (err) {
            setError(err);
            console.error('❌ Error loading withdraws:', err);
            
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error ||
                               'Gagal memuat riwayat penarikan';
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ Handle 401 Unauthorized
    if (error && error.response?.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
            window.location.href = '/login';
        }
        return null;
    }

    return (
        <section className="w-full min-h-screen">
            <WithdrawHistoryContent 
                dataWithdraws={withdraws} 
                isLoading={isLoading}
                onRefresh={fetchData}
            />
        </section>
    );
}