// app/admin/dashboard/page.js
import Header from "@/app/components/layouts/header";
import Beranda from "./components/content";

export default function BerandaPage() {
  return (
    <section className="w-full min-h-screen bg-gray-50">
      <Header />
      <Beranda/>
    </section>
  );
}