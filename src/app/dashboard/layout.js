'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import TaskIcon from "@/assets/icons/navbarIcons/to-do-list.png";
import TopupIcon from "@/assets/icons/navbarIcons/top-up.png";
import Withdraw from "@/assets/icons/navbarIcons/withdrawal.png";
import Users from "@/assets/icons/navbarIcons/user-settings.png";
import Products from "@/assets/icons/navbarIcons/loading.png";
import Setting from "@/assets/icons/navbarIcons/setting-admin.png";
import Home from "@/assets/icons/navbarIcons/home.png";
import ArrowRight from "@/assets/icons/navbarIcons/right-arrow.png";
import Histori from "@/assets/icons/navbarIcons/restore.png";
import Display from "@/assets/icons/navbarIcons/monitor.png";

export default function RootDashboard({ children }) {
  const pathName = usePathname();
  const [openHistory, setOpenHistory] = useState(false);
  const [activePath, setActivePath] = useState(null); // untuk efek klik instan
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Sinkronkan activePath dengan pathName saat halaman termount / berubah
  useEffect(() => {
    setActivePath(pathName);
  }, [pathName]);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    
    try {
      await axios.post(`${API_URL}/api/admin/logout`, {}, {
        withCredentials: true,
      });

      toast.update(toastId, {
        render: "Logout berhasil",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      console.error("Logout API error:", err);

      toast.update(toastId, {
        render: "Logout gagal, coba lagi",
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  // Fungsi untuk handle klik pada link (non-submenu)
  const handleNavClick = (path) => {
    setActivePath(path);
    // Opsional: reset setelah delay (jika navigasi gagal, tetap tunjukkan aktif sesaat)
    // Tapi biasanya navigasi sukses, jadi `useEffect` di atas akan override dengan pathName
  };

  // Fungsi untuk handle klik submenu
  const handleSubNavClick = (path) => {
    setActivePath(path);
  };

  const navListItems = [
    { title: "Home", path: "/dashboard", icondefault: Home },
    { title: "Users", path: "/dashboard/users", icondefault: Users },
    { title: "Info Terbaru", path: "/dashboard/informasi", icondefault: TaskIcon },
    {
      title: "Riwayat",
      icondefault: Histori,
      subMenu: [
        { title: "Riwayat Tugas", path: "/dashboard/riwayat/tugas", icondefault: TaskIcon },
        { title: "Riwayat Deposit", path: "/dashboard/riwayat/deposit", icondefault: TopupIcon },
        { title: "Riwayat Withdraw", path: "/dashboard/riwayat/withdraw", icondefault: Withdraw },
      ],
    },
    { title: "Display", path: "/dashboard/display", icondefault: Display },
    { title: "Products", path: "/dashboard/products", icondefault: Products },
    { title: "Setting", path: "/dashboard/setting", icondefault: Setting },
  ];

  // Helper: cek apakah aktif
  const isActive = (path) => {
    return activePath === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="lg:hidden fixed top-4 left-4 z-10">
        <button className="bg-white rounded-md shadow p-2 text-sm font-medium text-gray-700">
          ☰ Menu
        </button>
      </div>

      <aside className="w-64 bg-white hidden lg:flex flex-col flex-shrink-0 border-r border-gray-200">
        <Link href="/dashboard" className="block py-5 px-6">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight text-center">Admin</h1>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navListItems.map((item) => {
              if (item.subMenu) {
                const isParentActive = item.subMenu.some((sub) => isActive(sub.path));
                return (
                  <li key={item.title}>
                    <button
                      onClick={() => setOpenHistory(!openHistory)}
                      className={`group flex items-center space-x-3 w-full rounded-lg transition-colors py-2.5 px-3
                        ${openHistory || isParentActive ? "bg-gradient-to-l from-blue-400 to-blue-200 text-white" : "text-gray-700 hover:bg-gray-100"}`}
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
                          src={ArrowRight}
                          width={16}
                          height={16}
                          alt=""
                          className={`transition-transform duration-200 ${
                            openHistory || isParentActive
                              ? "rotate-90 brightness-0 invert"
                              : "group-hover:translate-x-0.5"
                          }`}
                        />
                      </span>
                    </button>

                    {openHistory && (
                      <ul className="mt-1 ml-10 space-y-1 border-l border-gray-200 pl-3">
                        {item.subMenu.map((sub) => {
                          const active = isActive(sub.path);
                          return (
                            <li key={sub.path}>
                              <Link
                                href={sub.path}
                                onClick={() => handleSubNavClick(sub.path)}
                                className={`flex items-center space-x-3 rounded-md py-2 px-2 text-sm transition-colors
                                  ${active ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"}`}
                              >
                                <Image
                                  src={sub.icondefault}
                                  alt={`${sub.title} icon`}
                                  width={18}
                                  height={18}
                                  className="object-contain"
                                />
                                <span>{sub.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`group flex items-center space-x-3 w-full rounded-lg transition-colors
                      ${active ? "bg-gradient-to-l from-blue-400 to-blue-200 text-white" : "text-gray-700 hover:bg-gray-100"} py-2.5 px-3`}
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
                        src={ArrowRight}
                        width={16}
                        height={16}
                        alt="arrow"
                        className={`transition-transform duration-200 ${
                          active
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
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="group flex items-center space-x-3 w-full rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors py-2.5 px-3"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>  
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-2 bg-gradient-to-b from-blue-50 to-white">
          {children}
        </div>
      </main>
    </div>
  );
}