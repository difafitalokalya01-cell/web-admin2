'use client'

import TopupHistoryContent from "./component/content";
import { useEffect, useState } from 'react';
import axios from "@/app/lib/axios";

export default function TopupHistoryPage() {
    const [topups, setTopups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await axios.get('/api/admin/topups/history', {
                    params: { limit: 1000 }
                });
                
                setTopups(response.data?.data?.topups || []);
            } catch (err) {
                setError(err);
                console.error('Error loading topups:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <section className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data top up...</p>
                </div>
            </section>
        );
    }

    if (error && error.response?.status === 401) {
        return (
            <section className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
                    <p className="text-gray-600">Silakan login terlebih dahulu</p>
                    <a href="/login" className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Login
                    </a>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 mb-2">{error.response?.data?.message || 'Terjadi kesalahan saat memuat data'}</p>
                    <p className="text-sm text-gray-500 mb-4">Status: {error.response?.status}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Coba Lagi
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full min-h-screen">
            <TopupHistoryContent dataTopups={topups} />
        </section>
    );
}