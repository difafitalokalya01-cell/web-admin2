import ContentUserPage from "./components/content";
import axios from "@/app/lib/axios";
import { cookies } from "next/headers";

export default async function UserPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log(API_URL);
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  console.log(token);

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