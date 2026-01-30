import ContentUserPage from "./components/content.js";
import axios from "@/app/lib/axios.js";
import { cookies } from "next/headers";

export default async function UserPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const res = await axios.get(`/api/admin/users`, {
    headers: {
      Cookie: `admin_token=${token}`,
    },
  });

  const data = res.data.usersData;

  return (
    <section className="h-full">
      <ContentUserPage initialData={data} />
    </section>
  );
}