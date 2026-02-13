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
    additionalBalance: 0,
  });

  const [originalBalance, setOriginalBalance] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        username: user.username || "",
        email: user.email || "",
        balance: user.balance || 0,
        additionalBalance: 0,
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
      const numBalance = parseInt(formData.balance) || 0;
      const numAdditional = parseInt(formData.additionalBalance) || 0;
      const totalBalance = numBalance + numAdditional;

      if (totalBalance < 0) {
        toast.update(toastId, {
          render: "Total balance tidak boleh negatif",
          type: "error",
          isLoading: false,
          autoClose: 2000
        });
        return;
      }

      const payload = {
        id: formData.id,
        username: formData.username,
        email: formData.email,
        balance: totalBalance
      };

      console.log('📤 Sending payload:', payload);

      const response = await axios.put(`/api/admin/user-data/update`, payload);
  
      toast.update(toastId, {
        render: "Data user berhasil diupdate",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

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

  const additionalBalance = parseInt(formData.additionalBalance) || 0;
  const totalBalance = (parseInt(formData.balance) || 0) + additionalBalance;
  const isBalanceChanged = additionalBalance !== 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative overflow-hidden"
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

          {/* Balance Section - Horizontal Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Saldo Pengguna
            </label>
            
            {/* Grid 2 Kolom */}
            <div className="grid grid-cols-2 gap-4">
              {/* Kolom Kiri - Saldo Saat Ini */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Saldo Saat Ini
                </label>
                <div className="border border-gray-300 rounded-lg p-3 bg-blue-50">
                  <p className="text-xs text-gray-500 mb-1">Rp</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formData.balance.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Kolom Kanan - Tambah */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Tambah
                </label>
                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                    <input
                      type="number"
                      name="additionalBalance"
                      value={formData.additionalBalance}
                      onChange={handleChange}
                      className="w-full border-none bg-transparent p-2 pl-8 text-xl font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  (+) Tambah 
                </p>
              </div>
            </div>

            {/* Total Balance Preview */}
            {isBalanceChanged && (
              <div className={`mt-4 p-4 rounded-lg border ${
                additionalBalance > 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Saldo Setelah Perubahan:</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Rp {formData.balance.toLocaleString('id-ID')} 
                      {additionalBalance > 0 ? ' + ' : ' - '}
                      Rp {Math.abs(additionalBalance).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total:</p>
                    <p className={`text-2xl font-bold ${
                      additionalBalance > 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Rp {totalBalance.toLocaleString('id-ID')}
                    </p>
                  </div>
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