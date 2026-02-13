import Header from "@/app/components/layouts/header";
import ContentProductPage from "./components/content";

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  // ✅ Tidak perlu fetch di server, biarkan client component yang handle
  return (
    <section className="w-full min-h-screen">
      <Header />
      <div className="w-full py-2">
        <ContentProductPage />
      </div>
    </section>
  );
}