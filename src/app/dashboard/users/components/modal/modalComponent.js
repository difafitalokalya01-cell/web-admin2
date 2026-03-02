'use client'

import React, { useState } from 'react';
import ModalEditUserData from './modal.edit.user';
import { 
  PencilIcon, 
  TrashIcon, 
  LockClosedIcon, 
  BanknotesIcon,
  XMarkIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CreditCardIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  KeyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

import ProfileIcon from "@/assets/icons/loginIcons/user.png";

export default function ModalBoxDataUsers({ user, onClose, onDeleteClick, onMutate, adminRole }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  if (!user) return null;

  // ✅ Cek apakah subadmin
  const isSubAdmin = adminRole === 'subadmin';

  const handleEdit = () => setIsOpenModal(true);

  const handleDelete = () => {
    onDeleteClick(user.id);
    setTimeout(onClose);
  };

  const handleLock = () => {
    if (confirm('Apakah Anda yakin ingin mengunci akun ini? Pengguna tidak akan bisa login.')) {
      console.log('Lock account:', user.id);
      onClose();
    }
  };

  const handleFreezeBank = () => {
    if (confirm('Apakah Anda yakin ingin membekukan rekening bank terkait akun ini?')) {
      console.log('Freeze bank account:', user.id);
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'Rp 0';
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 animate-fadeIn flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative my-8 animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-6 relative overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative flex items-center justify-between">
              <h2 id="modal-title" className="text-2xl font-bold text-white flex items-center gap-2">
                <UserCircleIcon className="w-7 h-7" />
                Detail Pengguna
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white active:scale-95"
                aria-label="Tutup modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={user.profilePicture ? `${process.env.NEXT_PUBLIC_API_URL}${user.profilePicture}` : ProfileIcon.src}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl border-4 border-gray-100 object-cover shadow-lg"
                    onError={(e) => {
                      e.target.src = ProfileIcon.src;
                    }}
                  />
                  <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                    user.isVerified 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {user.isVerified ? '✓ Verified' : '⚠ Unverified'}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-500 font-mono">{user.id}</p>
                </div>
              </div>

              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={EnvelopeIcon} label="Email" value={user.email} />
                <InfoCard icon={PhoneIcon} label="Nomor HP" value={user.phone || 'Belum diisi'} />
                <InfoCard icon={CurrencyDollarIcon} label="Saldo" value={formatCurrency(user.balance)} valueClass="text-green-600 font-bold text-lg" />
                <InfoCard icon={ShieldCheckIcon} label="Provider" value={(user.provider || 'local').toUpperCase()} badge={user.provider === 'google' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'} />
                <InfoCard icon={KeyIcon} label="Provider ID" value={user.providerId || '—'} valueClass="font-mono text-xs" />
                <InfoCard icon={KeyIcon} label="Password" value={user.password ? '••••••••' : 'Login via ' + (user.provider || 'Provider')} valueClass="text-xs" />
              </div>
            </div>

            {/* Level & Stats Section */}
            {user.userLevel && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                  Level & Statistik
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Level Saat Ini" value={user.userLevel.currentLevel} color="blue" />
                  <StatCard label="Total Task" value={user.userLevel.totalTasks} color="green" />
                  <StatCard label="Total Komisi" value={formatCurrency(user.userLevel.totalCommission)} color="purple" />
                  <StatCard label="Level Update" value={formatDate(user.userLevel.levelUpdatedAt)} color="gray" small />
                </div>
              </div>
            )}

            {/* Bank Accounts Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BanknotesIcon className="w-6 h-6 text-green-600" />
                Bank Akun ({user.bankAccounts?.length || 0})
              </h3>
              {user.bankAccounts && user.bankAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.bankAccounts.map((bank, index) => (
                    <div key={bank.id} className="p-4 border-2 border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-full">{bank.bank}</span>
                          {bank.isDefault && <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Default</span>}
                        </div>
                        <span className="text-xs text-gray-500">{bank.accountType}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Nama Pemilik</p>
                          <p className="font-semibold text-gray-900">{bank.bankName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nomor Rekening</p>
                          <p className="font-mono font-semibold text-gray-900">{bank.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ditambahkan</p>
                          <p className="text-xs text-gray-600">{formatDate(bank.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Belum ada bank akun terdaftar</p>
                </div>
              )}
            </div>

            {/* Tasks Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCardIcon className="w-6 h-6 text-purple-600" />
                Task History ({user.tasks?.length || 0})
              </h3>
              {user.tasks && user.tasks.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {user.tasks.map((task, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="font-semibold text-gray-900">{task.title || 'Task ' + (index + 1)}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(task.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Belum ada task yang dikerjakan</p>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tanggal Daftar</p>
                  <p className="text-sm text-gray-800 font-semibold">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Terakhir Update</p>
                  <p className="text-sm text-gray-800 font-semibold">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6">
            <div className="flex flex-wrap justify-center gap-3">
              <ActionButton onClick={handleEdit} Icon={PencilIcon} label="Edit Akun" color="blue" />
              {/* ✅ Tombol Hapus hanya muncul untuk admin biasa, bukan subadmin */}
              {!isSubAdmin && (
                <ActionButton onClick={handleDelete} Icon={TrashIcon} label="Hapus Akun" color="red" />
              )}
              <ActionButton onClick={handleLock} Icon={LockClosedIcon} label="Kunci Akun" color="yellow" />
              <ActionButton onClick={handleFreezeBank} Icon={BanknotesIcon} label="Bekukan Bank" color="purple" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      {isOpenModal && (
        <ModalEditUserData 
          onClose={() => {
            setIsOpenModal(false);
            onClose();
          }} 
          user={user}
          onMutate={onMutate}
        />
      )}
    </>
  );
}

function InfoCard({ icon: Icon, label, value, valueClass = '', badge = '' }) {
  return (
    <div className="p-3 rounded-lg border-2 border-gray-200 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start gap-2">
        <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-grow min-w-0">
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          {badge ? (
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${badge}`}>
              {value}
            </span>
          ) : (
            <p className={`text-sm font-semibold truncate ${valueClass || 'text-gray-900'}`}>
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, small = false }) {
  const colorClasses = {
    blue: 'bg-blue-100 border-blue-300 text-blue-800',
    green: 'bg-green-100 border-green-300 text-green-800',
    purple: 'bg-purple-100 border-purple-300 text-purple-800',
    gray: 'bg-gray-100 border-gray-300 text-gray-800',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <p className="text-xs font-medium mb-1 opacity-80">{label}</p>
      <p className={`font-bold ${small ? 'text-xs' : 'text-lg'}`}>{value}</p>
    </div>
  );
}

function ActionButton({ onClick, Icon, label, color }) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    yellow: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${colorClasses[color]} text-white px-4 py-2.5 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
