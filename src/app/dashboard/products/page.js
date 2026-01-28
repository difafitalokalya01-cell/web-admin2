import Header from "@/app/components/layouts/header";
import ContentProductPage from "./components/content";
import axios from "@/app/lib/axios";
import { cookies } from "next/headers";

export default async function ProductPages() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("admin_token")?.value;

  const res = await axios.get("/api/getProducts", {
    headers: {
      Cookie: `admin_token=${token}`,
    },
  });

  const dataProduct = res.data.data;

  console.log(dataProduct);

  return (
    <section className="w-full min-h-screen ">
      <Header />
      <div className="w-full py-2">
        <ContentProductPage products={dataProduct} />
      </div>
    </section>
  );
}