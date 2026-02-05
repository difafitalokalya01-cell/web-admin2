import ContentTaskPage from "./component/content";
import { getServerAxios } from "@/app/lib/axios.client";

export default async function InformationsPages() {
    const defaultData = {
        tasks: [],
        topups: [],
        withdraws: []
    };

    try {
        const axiosWithAuth = await getServerAxios();

        const [tasksRes, topupsRes, withdrawsRes] = await Promise.all([
            axiosWithAuth.get('/api/admin/request/tasks'),
            axiosWithAuth.get('/api/admin/request/topups'),
            axiosWithAuth.get('/api/admin/request/withdraws')
        ]);

        const combinedData = {
            tasks: tasksRes.data?.data?.requestTasks || [],
            topups: topupsRes.data?.data?.topups || [],
            withdraws: withdrawsRes.data?.data?.withdraws || []
        };

        console.log('✅ Data loaded:', {
            tasks: combinedData.tasks.length,
            topups: combinedData.topups.length,
            withdraws: combinedData.withdraws.length
        });

        return (
            <section className="w-full">
                <ContentTaskPage data={combinedData}/>
            </section>
        );

    } catch (error) {
        console.error('❌ Critical Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            return (
                <section className="w-full p-8">
                    <div className="text-center text-red-500">
                        <h2 className="text-2xl font-bold">Session Expired</h2>
                        <p className="mt-2">Please login again</p>
                    </div>
                </section>
            );
        }
        
        return (
            <section className="w-full">
                <ContentTaskPage data={defaultData}/>
            </section>
        );
    }
}