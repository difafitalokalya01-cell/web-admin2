import Header from "@/app/components/layouts/header";
import ContentProductPage from "./components/content";
import { getServerAxios } from "@/app/lib/axios.client";

export const dynamic = 'force-dynamic';

export default async function ProductPages() {

  try {

    const axiosWithAuth = await getServerAxios();

    const res = await axiosWithAuth.get("/api/products");

    const dataProduct = res.data?.data;

    return (
      <section className="w-full min-h-screen ">
        <Header />
        <div className="w-full py-2">
          <ContentProductPage products={dataProduct} />
        </div>
      </section>
    );
  } catch(error) {

      console.error('❌ Error fetching ', {
        message: error.message,
        status: error.response?.status,
      });

      return (
        <section className="w-full min-h-screen ">
          <Header />
          <div className="w-full py-2">
            <p>Data tidak tersedia</p>
          </div>
        </section>
      ) 
  }
}