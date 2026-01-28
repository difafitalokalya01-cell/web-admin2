"use client";

import { useState, useRef, useEffect } from "react";


export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // klik di luar popup → tutup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <div className="w-full h-[50px] lg:hidden"></div>

      <header className="hidden lg:flex w-full bg-white rounded-lg px-4 py-3 items-center justify-between shadow">
        <form className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-sm shadow-sm">
          <input
            type="search"
            placeholder="Cari sesuatu..."
            className="ml-3 w-full outline-none text-sm text-gray-700"
          />
        </form>

        {/* AVATAR */}
        <div className="relative ml-4" ref={menuRef}>
          <img
            src="/profile.jpg"
            alt="User profile"
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-white"
          />

          {/* slider */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
