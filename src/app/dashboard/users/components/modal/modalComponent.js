'use client'

import React, { useState } from 'react';
import ModalEditUserData from './modal.edit.user';

export default function ModalBoxDataUsers({ user, onClose, onDeleteClick }) {
  if (!user) return null;
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleEdit = () => {
    setIsOpenModal(true);
  };

  const handleLock = () => {
    if (confirm('Apakah Anda yakin ingin mengunci akun ini? Pengguna tidak akan bisa login.')) {
      // TODO: panggil API kunci akun
      onClose();
    }
  };

  const handleFreezeBank = () => {
    if (confirm('Apakah Anda yakin ingin membekukan rekening bank terkait akun ini?')) {
      // TODO: panggil API bekukan bank
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 id="modal-title" className="text-xl font-bold">Detail Pengguna</h2>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center active:scale-95 rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Tutup modal"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        <div className="p-5">
          <div className="flex flex-col items-center md:flex-row gap-5">
            <div className="flex-grow space-y-3 text-sm">
              <InfoRow label="ID" value={user.id} />
              <InfoRow label="Username" value={user.username} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Nomor HP" value={user.phone || '—'} />
              <InfoRow label="Terakhir Login" value={user.terakhirLogin || '—'} />
              <InfoRow label="Tanggal Daftar" value={user.createdAt || '—'} />
              <InfoRow label="Bank Akun" value={user.bankAccount || '—'} />
              <InfoRow label="Bank Akun" value={user.password || '—'} />
              <InfoRow label="Kategori" value={user.categori || '—'} />
            </div>

            <div className="flex-shrink-0 flex justify-center">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${user.profilePicture}`}
                alt={`${user.username} avatar`}
                className="h-20 w-20 rounded-full border-2 border-gray-200 object-cover shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-2">
          <ActionButton
            onClick={onDeleteClick}
            label="Hapus Akun"
            color="bg-red-600 hover:bg-red-700"
          />
          <ActionButton
            onClick={handleEdit}
            label="Edit Akun"
            color="bg-blue-600 hover:bg-blue-700"
          />
          <ActionButton
            onClick={handleLock}
            label="Kunci Akun"
            color="bg-yellow-600 hover:bg-yellow-700"
          />
          <ActionButton
            onClick={handleFreezeBank}
            label="Bekukan Bank Akun"
            color="bg-purple-600 hover:bg-purple-700"
          />
        </div>
      </div>
      {isOpenModal && (
        <ModalEditUserData onClose={onClose} user={user}/>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <p className="text-gray-700">
      <span className="font-medium text-gray-900">{label}:</span>{' '}
      <span className="text-gray-600">{value}</span>
    </p>
  );
}

function ActionButton({ onClick, label, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${color} w-full py-2.5 px-4 text-white active:scale-95 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-colors`}
    >
      {label}
    </button>
  );
}