import Header from "@/app/components/layouts/header";
import ContentDisplay from "./component/content"; 
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function ContentDisplayPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  return (
    <section className="w-full min-h-screen">
      <Header />
      <div className="w-full py-2">
        <ContentDisplay token={token} />
      </div>
    </section>
  );
}