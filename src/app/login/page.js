'use client'

import adminIcon from "@/assets/icons/loginIcons/human-white.png";
import Image from "next/image";
import { useState, useEffect } from "react"; // ✅ TAMBAHKAN useEffect
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "../lib/axios";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({email:"", password:""});

  // ✅ Cek token saat page load
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      console.log("✅ Already logged in, redirecting to dashboard");
      router.push('/dashboard');
    }
  }, [router]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
        ...prev, [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let toastId = toast.loading("Loading...");

    try {
        const response = await axios.post('/api/admin/login', formData, {
            withCredentials: true
        });
        
        const { token, data } = response.data;
    
        // Simpan token ke localStorage
        localStorage.setItem('admin_token', token);
        localStorage.setItem('adminId', data.id);
        localStorage.setItem('adminName', data.name);

        setFormData({ email: "", password: "" });

        toast.update(toastId, {
          render: "Login berhasil",
          type: "success",
          isLoading: false,
          autoClose: 1000
        });

        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 1000);

    } catch (err) {
        console.error("❌ Login error:", err);
        toast.update(toastId, {
            render: err.response?.data?.message || "Login gagal",
            type: "error",
            isLoading: false,
            autoClose: 3000
        });
    }
  }

  return (
    <section className="flex justify-center items-center bg-gradient-to-b from-blue-200 to-blue-100 min-h-screen">
      <div className="flex w-[50rem] h-[30rem] bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center text-white p-6">
          <Image
            src={adminIcon}
            alt="Admin Icon"
            className="w-24 h-24 mb-4"
            priority
          />
          <h3 className="text-2xl font-bold mb-2">Admin Panel</h3>
          <p className="text-sm opacity-80 text-center">
            ifdaefheushgfesrghsroghsrhgoirsgjorsg
          </p>
        </div>

        <div className="w-1/2 flex flex-col justify-center p-10">
          <h1 className="text-3xl font-bold text-gray-700 text-center mb-6">
            Login
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md py-2 font-semibold hover:bg-blue-600 transition"
            >
              Masuk
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Lupa password?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Reset di sini
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}