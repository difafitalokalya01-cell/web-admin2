'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import TaskIcon from "@/assets/icons/navbarIcons/to-do-list.png";
import TopupIcon from "@/assets/icons/navbarIcons/top-up.png";
import Withdraw from "@/assets/icons/navbarIcons/withdrawal.png";
import Contact from "@/assets/icons/navbarIcons/settings.png";
import BankCard from "@/assets/icons/navbarIcons/credit-card.png";
import Users from "@/assets/icons/navbarIcons/user-settings.png";
import Products from "@/assets/icons/navbarIcons/loading.png";
import Banner from "@/assets/icons/navbarIcons/advertisement.png";
import Setting from "@/assets/icons/navbarIcons/setting-admin.png";
import Home from "@/assets/icons/navbarIcons/home.png";
import ArrowRight from "@/assets/icons/navbarIcons/right-arrow.png";

export default function RootDashboard({ children }) {
  const pathName = usePathname();

  const navListItems = [
    { title: "Home", path: "/dashboard", icondefault: Home, iconRight: ArrowRight },
    { title: "Users", path: "/dashboard/users", icondefault: Users, iconRight: ArrowRight },
    { title: "Tugas", path: "/dashboard/task", icondefault: TaskIcon, iconRight: ArrowRight },
    { title: "Top-up", path: "/dashboard/top-up", icondefault: TopupIcon, iconRight: ArrowRight },
    { title: "Withdraw", path: "/dashboard/withdraw", icondefault: Withdraw, iconRight: ArrowRight },
    { title: "Contact", path: "/dashboard/contact", icondefault: Contact, iconRight: ArrowRight },
    { title: "Bank card", path: "/dashboard/bank-card", icondefault: BankCard, iconRight: ArrowRight },
    { title: "Products", path: "/dashboard/products", icondefault: Products, iconRight: ArrowRight },
    { title: "Banner", path: "/dashboard/banner", icondefault: Banner, iconRight: ArrowRight },
    { title: "Setting", path: "/dashboard/setting", icondefault: Setting, iconRight: ArrowRight },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <button className="lg:hidden fixed top-4 left-4 z-10 p-2 rounded-md bg-white shadow">
        ☰ Menu
      </button>

      <aside className="w-64 bg-white hidden lg:flex flex-col">
        <Link href="/dashboard" className="pl-2">
          <h2 className="font-bold text-center py-8 px-6 text-2xl bg-blue-400 text-white rounded-l-lg">
            Hinam
          </h2>
        </Link>

        <nav className="flex-1 bg-blue-400">
          <div className="rounded-tr-lg bg-white h-full">
            <ul className="space-y-1">
              {navListItems.map((item) => {
                const isActive = pathName === item.path;
                return (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      className={`
                        group flex items-center space-x-3 py-2 px-2 w-full rounded-md transition-all
                        ${isActive
                          ? "bg-gradient-to-l from-blue-500 to-blue-300 text-white shadow-md"
                          : "hover:bg-gradient-to-l hover:from-blue-100 hover:to-blue-50 text-gray-700"}
                      `}
                    >
                      <div
                        className={`rounded-md w-10 h-10 flex items-center justify-center
                          ${isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-blue-100"}
                        `}
                      >
                        <Image
                          src={item.icondefault}
                          alt={`${item.title} icon`}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>

                      <span className={`flex-1 font-medium ${isActive ? "text-white" : ""}`}>
                        {item.title}
                      </span>

                      <span>
                        <Image
                          src={item.iconRight}
                          width={12}
                          height={12}
                          alt="arrow"
                          className={`transition-transform duration-200 ${
                            isActive ? "rotate-90 brightness-0 invert" : "group-hover:translate-x-1"
                          }`}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>

      <main className="flex-1 md:p-6 bg-gradient-to-b from-blue-400 to-blue-200 w-full overflow-hidden shadow-inner">
        {children}
      </main>
    </div>
  );
}
