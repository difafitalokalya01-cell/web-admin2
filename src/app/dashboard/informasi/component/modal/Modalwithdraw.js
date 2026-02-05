    'use client'

import { useState } from "react";
import Image from "next/image";
import profileIcon from "@/assets/icons/loginIcons/user.png";

export default function ModalWithdraw({ item, onClose, onApprove, onReject }) {
    const [note, setNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    if (!item) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleApprove = async () => {
        if (!confirm('Apakah Anda yakin ingin menyetujui penarikan ini?')) return;
        
        setIsProcessing(true);
        try {
            await onApprove(note);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!note.trim()) {
            alert('Catatan wajib diisi untuk menolak penarikan!');
            return;
        }

        if (!confirm('Apakah Anda yakin ingin menolak penarikan ini?')) {
            setShowRejectConfirm(false);
            return;
        }
        
        setIsProcessing(true);
        try {
            await onReject(note);
        } finally {
            setIsProcessing(false);
            setShowRejectConfirm(false);
        }
    };

    // Check if user has enough balance
    const hasEnoughBalance = (item.user?.balance || 0) >= item.amount;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Verifikasi Penarikan</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        disabled={isProcessing}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* User Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                        <h3 className="text-sm font-semibold text-gray-600 mb-4">Informasi User</h3>
                        
                        <div className="flex items-start gap-4">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0">
                                {item.user?.profilePicture ? (
                                    <Image
                                        src={item.user.profilePicture}
                                        alt={item.user.username}
                                        width={80}
                                        height={80}
                                        className="rounded-full object-cover border-2 border-white shadow"
                                        onError={(e) => {
                                            // Jika image gagal di load, ganti dengan icon default
                                            e.target.onerror = null; // Mencegah infinite loop
                                            e.target.src = profileIcon.src;
                                        }}
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow">
                                        {item.user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>

                            {/* User Details */}
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Username</p>
                                    <p className="font-semibold text-gray-800">{item.user?.username || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium text-gray-800 text-sm">{item.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">No. Telepon</p>
                                    <p className="font-medium text-gray-800">{item.user?.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Saldo Saat Ini</p>
                                    <p className={`font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(item.user?.balance || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Balance Warning */}
                    {!hasEnoughBalance && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-red-800">Saldo Tidak Mencukupi</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        User tidak memiliki cukup saldo untuk melakukan penarikan sebesar {formatCurrency(item.amount)}. 
                                        Kekurangan: {formatCurrency(item.amount - (item.user?.balance || 0))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Withdraw & Bank Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Withdraw Info */}
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-600 mb-4">Detail Penarikan</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">ID Transaksi</p>
                                        <p className="font-mono text-sm text-gray-800">{item.userId}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-gray-500">Jumlah Penarikan</p>
                                        <p className="text-2xl font-bold text-red-600">{formatCurrency(item.amount)}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                            item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-gray-500">Tanggal Request</p>
                                        <p className="font-medium text-gray-800">
                                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    {item.note && (
                                        <div>
                                            <p className="text-xs text-gray-500">Catatan Sebelumnya</p>
                                            <p className="font-medium text-gray-800 text-sm bg-gray-50 p-2 rounded">
                                                {item.note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Saldo After Calculation */}
                            <div className={`rounded-lg p-4 border ${
                                hasEnoughBalance 
                                    ? 'bg-orange-50 border-orange-200' 
                                    : 'bg-red-50 border-red-200'
                            }`}>
                                <h4 className="text-sm font-semibold text-gray-600 mb-3">Simulasi Saldo</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Saldo Saat Ini</span>
                                        <span className="font-semibold text-gray-800">
                                            {formatCurrency(item.user?.balance || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Penarikan</span>
                                        <span className="font-semibold text-red-600">
                                            - {formatCurrency(item.amount)}
                                        </span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-700">Saldo Setelah Penarikan</span>
                                        <span className={`text-lg font-bold ${
                                            hasEnoughBalance ? 'text-orange-600' : 'text-red-600'
                                        }`}>
                                            {formatCurrency(Math.max(0, (item.user?.balance || 0) - item.amount))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Bank Account Info */}
                        <div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-600 mb-4">Informasi Rekening Bank</h3>
                                
                                {item.bankAccount ? (
                                    <div className="space-y-4">
                                        {/* Bank Logo/Icon */}
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {item.bankAccount.bank?.substring(0, 3).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Bank</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {item.bankAccount.bank}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Account Details */}
                                        <div className="space-y-3">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 mb-1">Nama Pemilik Rekening</p>
                                                <p className="font-semibold text-gray-800 text-lg">
                                                    {item.bankAccount.bankName || '-'}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 mb-1">Nomor Rekening</p>
                                                <p className="font-mono font-bold text-gray-800 text-xl tracking-wider">
                                                    {item.bankAccount.accountNumber || '-'}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">Jenis Rekening</p>
                                                    <p className="font-medium text-gray-800 capitalize">
                                                        {item.bankAccount.accountType || 'Tidak disebutkan'}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                                    {item.bankAccount.isDefault ? (
                                                        <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            Default
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-600">Sekunder</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Transfer Instructions */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                            <div className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="text-sm text-blue-800">
                                                    <p className="font-semibold mb-1">Instruksi Transfer</p>
                                                    <p className="text-blue-700">
                                                        Pastikan transfer dilakukan ke rekening <strong>{item.bankAccount.bank}</strong> atas nama <strong>{item.bankAccount.bankName}</strong> dengan nomor rekening <strong>{item.bankAccount.accountNumber}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">Data rekening tidak tersedia</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Note Input */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Catatan Admin {showRejectConfirm && <span className="text-red-500">*Wajib untuk reject</span>}
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Tambahkan catatan (opsional untuk approve, wajib untuk reject)..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium disabled:opacity-50"
                    >
                        Tutup
                    </button>
                    
                    {item.status === 'PENDING' && (
                        <>
                            <button
                                onClick={() => setShowRejectConfirm(true)}
                                disabled={isProcessing}
                                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Memproses...' : 'Tolak'}
                            </button>
                            
                            <button
                                onClick={handleApprove}
                                disabled={isProcessing || !hasEnoughBalance}
                                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                title={!hasEnoughBalance ? 'Saldo user tidak mencukupi' : ''}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Setujui Penarikan
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Reject Confirmation Modal */}
            {showRejectConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Konfirmasi Penolakan</h3>
                        
                        {!note.trim() ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-red-800 text-sm">
                                    ⚠️ Catatan wajib diisi untuk menolak penarikan!
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-600 mb-4">
                                Apakah Anda yakin ingin menolak penarikan sebesar <strong>{formatCurrency(item.amount)}</strong> dari user <strong>{item.user?.username}</strong>?
                            </p>
                        )}
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRejectConfirm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!note.trim() || isProcessing}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Ya, Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}