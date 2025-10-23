'use client'

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import { toast } from "react-toastify";

export default function ModalEditUserData({ user, onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    categori: "",
    accountBank: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        categori: user.categori || "",
        accountBank: user.accountBank || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {

        const response = await axios.put(`${API_URL}/api/admin/user-data/update`, formData);
    
        toast.update(toastId, {
          render: "Edit data berhasil",
          type: "success",
          isLoading: false,
          autoClose: 2000
        });

    } catch (err) {
      console.error(err);

      let message = "Terjadi kesalahan";

      if(err.response) {

        const {status, data} = err.response;

        if(status === 401 || status === 403){
          message = data?.message || 'Anda tidak memiliki akses, silahkan login';
          toast.error('Anda tidak memiliki akses, silahkan login');
        } else if(status === 403){
          message = data?.message || 'User tidak tersedia';
        }

        toast.update(toastId, {
          render: "Terjadi kesalahan server",
          type: "error",
          isLoading: false,
          autoClose: 2000
        })
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 id="modal-title" className="text-xl font-bold">
            Edit Data Pengguna
          </h2>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center active:scale-95 rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor HP
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categori
            </label>
            <input
              type="text"
              name="phone"
              value={formData.categori}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No Rekening
            </label>
            <input
              type="text"
              name="phone"
              value={formData.accountBank}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
