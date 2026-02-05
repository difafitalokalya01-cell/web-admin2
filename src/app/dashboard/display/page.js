import Header from "@/app/components/layouts/header";
import ContentDisplayPage from "./component/content";
import { cookies } from "next/headers";

export default async function ContactPages() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  return (
    <section className="w-full min-h-screen">
      <Header />
      <div className="w-full py-2">
        <ContentDisplayPage token={token} />
      </div>
    </section>
  );
}
