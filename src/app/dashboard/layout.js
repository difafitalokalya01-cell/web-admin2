import Link from "next/link";
import Image from "next/image";
import TaskIcon from "@/assets/icons/navbarIcons/task.png";
import ArrowRight from "@/assets/icons/navbarIcons/right-arrow.png";

export default function RootDashboard({ children }) {

  const navListItems = [
    {
      title: "Tugas",
      path: "/dashboard/user",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
    {
      title: "Top-up",
      path: "/dashboard/product",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
    {
      title: "Withdraw",
      path: "/dashboard/user",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
    {
      title: "Contact",
      path: "/dashboard/user",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
    {
      title: "Bank card",
      path: "/dashboard/user",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
    {
      title: "Users",
      path: "/dashboard/user",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
    {
      title: "Products",
      path: "/dashboard/user",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
    {
      title: "Banner",
      path: "/dashboard/user",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
    {
      title: "Setting",
      path: "/dashboard/user",
      icondefault: TaskIcon,
      iconRight: ArrowRight
    },
  ];

  return (
    <div className="flex min-h-screen">
      <button className="md:hidden">burger menus nanti ini lek</button>

      <aside className="w-72 hidden md:block">
        <Link href="/dashboard">
          <h2 className="font-bold text-center py-6 px-6 text-2xl cursor-pointer text-gray-500">
            Hinam
          </h2>
        </Link>

        <div className="py-4 px-5">
          <ul className="space-y-2">
            {navListItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  className="flex items-center space-x-3"
                >
                    <div className="bg-white shadow rounded-xs p-2">
                        <Image
                            src={item.icondefault}
                            alt={`${item.title} icon`}
                            width={15}
                            height={15}
                        />
                    </div>
                    <span className="w-[65%]">{item.title}</span>
                    <span className="flex-1">
                        <Image src={item.iconRight} width={10} height={10}/>
                    </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
