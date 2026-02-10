import Header from "@/app/components/layouts/header";
import ContentProductPage from "./components/content";
import { cookies } from "next/headers";
import axios from "@/app/lib/axios";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  // Fetch products dari API
  let products = [];
  try {
    const response = await axios.get("/api/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Sesuaikan dengan struktur API Anda
    products = response.data.data || response.data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    products = []; // Fallback ke array kosong
  }

  return (
    <section className="w-full min-h-screen">
      <Header />
      <div className="w-full py-2">
        <ContentProductPage products={products} />
      </div>
    </section>
  );
}