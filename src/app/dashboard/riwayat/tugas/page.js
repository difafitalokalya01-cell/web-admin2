
'use client' // Tambahkan ini di atas

import ModalTaskContent from "./component.js/content";
import { useEffect, useState } from 'react';

export default function TaskHistoriPage() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Gunakan client axios yang sudah ada interceptor
                const response = await axios.get('/api/admin/tasks', {
                    params: { limit: 1000 }
                });
                setTasks(response.data?.data?.tasks || []);
            } catch (err) {
                setError(err);
                console.error('Error loading tasks:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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

    return (
        <section className="w-full min-h-screen">
            <ModalTaskContent dataUsers={tasks} />
        </section>
    );
}