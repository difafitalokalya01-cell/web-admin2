import ModalTaskContent from "./component.js/content";
import { getServerAxios } from "@/app/lib/axios.client";

export const dynamic = 'force-dynamic';

export default async function TaskHistoriPage() {
    const defaultData = [];

    try {
        const axiosWithAuth = await getServerAxios();

        // Ambil semua tasks tanpa filter atau dengan filter COMPLETED
        const tasksRes = await axiosWithAuth.get('/api/admin/tasks', {
            params: {
                limit: 1000, // Ambil banyak data sekaligus
                // status: 'COMPLETED' // Uncomment jika hanya mau COMPLETED
            }
        });

        // Akses tasks dari response
        const tasks = tasksRes.data?.data?.tasks || defaultData;

        console.log('✅ Riwayat Tugas loaded:', {
            total: tasks.length,
            sample: tasks.slice(0, 3)
        });

        return (
            <section className="w-full min-h-screen">
                <ModalTaskContent dataUsers={tasks} />
            </section>
        );

    } catch (error) {
        console.error('❌ Error loading Riwayat Tugas:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data, // Tambahkan ini untuk lihat error detail
            endpoint: error.config?.url
        });
        
        if (error.response?.status === 401) {
            return (
                <section className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                    {/* ... UI unauthorized ... */}
                </section>
            );
        }
        
        return (
            <section className="w-full min-h-screen">
                <ModalTaskContent dataUsers={defaultData} />
            </section>
        );
    }
}