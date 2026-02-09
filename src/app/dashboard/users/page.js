import ContentUserPage from "./components/content.js";
import { getServerAxios } from "@/app/lib/axios.client.js";

export const dynamic = 'force-dynamic';

export default async function UserPage() {

  try {

    const axiosWithAuth = await getServerAxios();

    const res = await axiosWithAuth.get(`/api/admin/users`);

    const data = res.data?.usersData;

    return (
      <section className="h-full">
        <ContentUserPage initialData={data} />
      </section>
  );

  } catch (error) {
      console.error('❌ Error fetching ', {
        message: error.message,
        status: error.response?.status,
      });

      return (
        <section className="h-full">
          <div className="items-center text-center">
            <p>data tidak tersedia</p>
          </div>
        </section>
      );
  }

}