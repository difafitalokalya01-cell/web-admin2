import Header from "@/app/components/layouts/header";
import ContentProductPage from "./components/content";

export default function ProductPages() {
  return (
    <section className="w-full min-h-screen">
      <Header />
      <div className="w-full py-2">
        <ContentProductPage />
      </div>
    </section>
  );
}