'use client';

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
    { title: "Permintaan Tugas", path: "/dashboard/task", icondefault: TaskIcon, iconRight: ArrowRight },
    { title: "Top-up", path: "/dashboard/top-up", icondefault: TopupIcon, iconRight: ArrowRight },
    { title: "Withdraw", path: "/dashboard/withdraw", icondefault: Withdraw, iconRight: ArrowRight },
    { title: "Contact", path: "/dashboard/contact", icondefault: Contact, iconRight: ArrowRight },
    { title: "Bank Card", path: "/dashboard/bank-card", icondefault: BankCard, iconRight: ArrowRight },
    { title: "Products", path: "/dashboard/products", icondefault: Products, iconRight: ArrowRight },
    { title: "Banner", path: "/dashboard/banner", icondefault: Banner, iconRight: ArrowRight },
    { title: "Setting", path: "/dashboard/setting", icondefault: Setting, iconRight: ArrowRight },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="lg:hidden fixed top-4 left-4 z-10">
        <button className="bg-white rounded-md shadow p-2 text-sm font-medium text-gray-700">
          ☰ Menu
        </button>
      </div>

      <aside className="w-64 bg-white hidden lg:flex flex-col flex-shrink-0 border-r border-gray-200">
        <Link href="/dashboard" className="block py-5 px-6">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight text-center">Hinam</h1>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navListItems.map((item) => {
              const isActive = pathName === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`
                      group flex items-center space-x-3 w-full rounded-lg transition-colors
                      ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"}
                      py-2.5 px-3
                    `}
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-white/10">
                      <Image
                        src={item.icondefault}
                        alt={`${item.title} icon`}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>

                    <span className="text-sm font-medium">{item.title}</span>

                    <span className="ml-auto">
                      <Image
                        src={item.iconRight}
                        width={16}
                        height={16}
                        alt=""
                        className={`transition-transform duration-200 ${
                          isActive
                            ? "rotate-90 brightness-0 invert"
                            : "group-hover:translate-x-0.5"
                        }`}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-2 bg-gradient-to-b from-blue-50 to-white">
          {children}
        </div>
      </main>
    </div>
  );
}