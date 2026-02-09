import TopupHistoryContent from "./component/content";
import { getServerAxios } from "@/app/lib/axios.client";

export const dynamic = 'force-dynamic';

export default async function TopupHistoryPage() {
    const defaultData = [];

    try {
        const axiosWithAuth = await getServerAxios();

        // Ambil riwayat topup (APPROVED & REJECTED)
        const topupsRes = await axiosWithAuth.get('/admin/topups/history', {
            params: {
                limit: 1000,
            }
        });

        // Akses topups dari response
        const topups = topupsRes.data?.data?.topups || defaultData;

        console.log('✅ Riwayat Topup loaded:', {
            total: topups.length,
            sample: topups.slice(0, 3)
        });

        return (
            <section className="w-full min-h-screen">
                <TopupHistoryContent dataUsers={topups} />
            </section>
        );

    } catch (error) {
        console.error('❌ Error loading Riwayat Topup:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            endpoint: error.config?.url
        });
        
        if (error.response?.status === 401) {
            return (
                <section className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                        <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Expired</h2>
                        <p className="text-gray-600 mb-4">Silakan login kembali untuk melanjutkan</p>
                        <a 
                            href="/login" 
                            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            Login
                        </a>
                    </div>
                </section>
            );
        }
        
        return (
            <section className="w-full min-h-screen">
                <TopupHistoryContent dataUsers={defaultData} />
            </section>
        );
    }
}