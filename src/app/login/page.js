'use client'

import adminIcon from "@/assets/icons/loginIcons/human-white.png";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "../lib/axios";

export default function Home() {
  const router = useRouter()
  const [ formData, setFormData ] = useState({email:"", password:""});

  const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData((prev) => ({
          ...prev, [name]: value,
      }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault()
      let toastId = toast.loading("Loading...");

      try{
          console.log('🚀 [FE] Starting login request...');
          console.log('📧 [FE] Email:', formData.email);
          
          const response = await axios.post('/api/admin/login', formData, {
              withCredentials: true 
          });
          
          console.log('✅ [FE] Login Response Status:', response.status);
          console.log('📊 [FE] Response Data:', response.data);
          console.log('🍪 [FE] Response Headers:', Object.keys(response.headers));
          console.log('🍪 [FE] Set-Cookie Header:', response.headers['set-cookie']);
          console.log('🍪 [FE] Document Cookie:', document.cookie);
          
          const adminData = response.data.admin || response.data.data;
      
          console.log('💾 [FE] Saving to localStorage:', {
            adminId: adminData.id,
            adminName: adminData.name
          });
          
          localStorage.setItem('adminId', adminData.id);
          localStorage.setItem('adminName', adminData.name);

          setFormData((prev) => ({
              ...prev,
              email: "",
              password: "",
          }));

          toast.update(toastId, {
            render: "Login berhasil",
            type: "success",
            isLoading: false,
            autoClose: "2000"
          });

          console.log('🔄 [FE] Waiting 2.5s before redirect...');
          
          setTimeout(() => {
            console.log('📍 [FE] Current Pathname:', window.location.pathname);
            console.log('📍 [FE] Router Refresh called');
            
            router.refresh();
            
            console.log('➡️ [FE] Redirecting to /dashboard');
            router.push("/dashboard");
            
            console.log('✅ [FE] Redirect initiated');
          }, 2500);

      } catch (err) {
        console.error('❌ [FE] Login Error:', err);
        console.error('❌ [FE] Error Details:', {
          message: err.message,
          config: err.config,
          response: err.response?.data,
          status: err.response?.status
        });

        let message = "Terjadi kesalahan";

        if (err.response) {
          const { status, data } = err.response;

          if (status === 400 || status === 401) {
            message = data?.message || "Email atau password salah!";
          } else if (status >= 500) {
            message = data?.message || "Terjadi kesalahan server!";
          }

          toast.update(toastId, {
            render: message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        } else if (err.request) {
          console.error('❌ [FE] No response received - Network error?');
          toast.update(toastId, {
            render: "Tidak dapat terhubung ke server",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      }
  }

  // Debug: Cek cookie setiap 2 detik
  useState(() => {
    const interval = setInterval(() => {
      console.log('👀 [FE] Current Cookies:', document.cookie);
    }, 2000);
    return () => clearInterval(interval);
  });

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