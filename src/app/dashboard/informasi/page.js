'use client';

import ContentTaskPage from "./component/content";
import { useEffect, useState } from "react";
import axios from "@/app/lib/axios";

export default function InformationsPages() {
    const [data, setData] = useState({
        tasks: [],
        topups: [],
        withdraws: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                const [tasksRes, topupsRes, withdrawsRes] = await Promise.all([
                    axios.get('/api/admin/request/tasks'),
                    axios.get('/api/admin/request/topups'),
                    axios.get('/api/admin/request/withdraws')
                ]);

                const combinedData = {
                    tasks: tasksRes.data?.data?.requestTasks || [],
                    topups: topupsRes.data?.data?.topups || [],
                    withdraws: withdrawsRes.data?.data?.withdraws || []
                };

                setData(combinedData);
                setError(null);
            } catch (error) {
                console.error('❌ Error fetching data:', error);
                setError(error.response?.data?.message || 'Gagal memuat data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <section className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-2">⚠️</div>
                    <p className="text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full">
            <ContentTaskPage data={data} />
        </section>
    );
}