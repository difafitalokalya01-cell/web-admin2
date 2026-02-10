'use client'

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import { toast } from "react-toastify";

export default function ModalEditUserData({ user, onClose, onMutate }) {
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    balance: 0,
  });

  const [originalBalance, setOriginalBalance] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        username: user.username || "",
        email: user.email || "",
        balance: user.balance || 0,
      });
      setOriginalBalance(user.balance || 0);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Menyimpan perubahan...");
    
    try {
      // ✅ Validasi balance
      const numBalance = parseInt(formData.balance);
      if (isNaN(numBalance) || numBalance < 0) {
        toast.update(toastId, {
          render: "Balance harus berupa angka valid (minimal 0)",
          type: "error",
          isLoading: false,
          autoClose: 2000
        });
        return;
      }

      // ✅ Kirim hanya field yang diperlukan
      const payload = {
        id: formData.id,
        username: formData.username,
        email: formData.email,
        balance: numBalance
      };

      console.log('📤 Sending payload:', payload);

      const response = await axios.put(`/api/admin/user-data/update`, payload);
  
      toast.update(toastId, {
        render: "Data user berhasil diupdate",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      // ✅ Refresh data
      if (onMutate) {
        await onMutate();
      }

      onClose();

    } catch (err) {
      console.error('❌ Update error:', err);
      console.error('❌ Error response:', err.response?.data);

      let message = "Terjadi kesalahan";

      if (err.response) {
        const { status, data } = err.response;

        if (status === 401) {
          message = 'Anda tidak memiliki akses, silahkan login';
        } else if (status === 404) {
          message = 'User tidak ditemukan';
        } else if (status === 400) {
          message = data?.message || 'Data tidak valid';
        } else if (status === 500) {
          message = data?.message || 'Terjadi kesalahan server';
          // Show detail error in dev mode
          if (data?.error) {
            console.error('Server error detail:', data.error);
          }
        }
      }

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const balanceChange = parseInt(formData.balance || 0) - originalBalance;
  const isBalanceChanged = balanceChange !== 0;

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
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 className="text-xl font-bold">Edit Data Pengguna</h2>
          <p className="text-sm text-blue-100 mt-1">
            {user.username} - {user.email}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/30 text-white hover:bg-white/50 transition"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo (Rp)
            </label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            
            {/* Balance Change Indicator */}
            {isBalanceChanged && (
              <div className={`mt-2 p-2 rounded-md text-sm font-medium ${
                balanceChange > 0 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                <span className="text-lg">
                  {balanceChange > 0 ? '↗' : '↘'}
                </span>
                {' '}
                {balanceChange > 0 ? '+' : ''}
                Rp {Math.abs(balanceChange).toLocaleString('id-ID')}
                <div className="text-xs mt-1 opacity-75">
                  Dari Rp {originalBalance.toLocaleString('id-ID')} → Rp {parseInt(formData.balance).toLocaleString('id-ID')}
                </div>
              </div>
            )}
          </div>

          {/* User Level (Read-only info) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level User
            </label>
            <input
              type="text"
              value={user.userLevel?.currentLevel || 'CLASSIC'}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Level tidak dapat diubah dari sini
            </p>
          </div>

          {/* Bank Accounts (Read-only info) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rekening Bank Terdaftar
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`${user.bankAccounts?.length || 0} rekening`}
                disabled
                className="flex-1 border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <button
                type="button"
                className="px-3 py-2.5 bg-gray-200 text-gray-600 rounded-lg text-sm cursor-not-allowed"
                disabled
              >
                Detail
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
            >
              💾 Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}