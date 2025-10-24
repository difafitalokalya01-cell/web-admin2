import ContentUserPage from "./components/content";
import axios from "@/app/lib/axios";
import { cookies } from "next/headers";

export default async function UserPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const res = await axios.get(`/api/admin/user-data`, {
    headers: {
      Cookie: `admin_token=${token}`,
    },
  });

  const data = res.data.usersData;

  return (
    <section className="h-full">
      <ContentUserPage dataUsers={data} />
    </section>
  );
};