'use client'

import { useState } from "react";
import Image from "next/image";

export default function ModalWithdraw({ item, onClose, onApprove, onReject }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [note, setNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleOpenConfirm = (action) => {
        setConfirmAction(action);
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        setIsProcessing(true);
        try {
            if (confirmAction === 'approve') {
                await onApprove(note);
            } else {
                await onReject(note);
            }
            setShowConfirmModal(false);
            onClose();
        } catch (error) {
            console.error('Error processing action:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseConfirm = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
    };

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-blue-500 text-white p-6 rounded-t-2xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Detail Penarikan</h2>
                                <p className="text-orange-100 text-sm">Review dan proses permintaan penarikan</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* User Info */}
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Username</p>
                                    <p className="text-xl font-bold text-gray-800">{item?.user?.username || '-'}</p>
                                    <p className="text-xs text-gray-500 mt-1">ID: {item?.userId?.substring(0, 12)}...</p>
                                </div>
                            </div>
                        </div>

                        {/* Amount & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border-2 border-red-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-gray-600 font-medium">Jumlah Penarikan</span>
                                </div>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(item?.amount || 0)}</p>
                            </div>

                            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-gray-600 font-medium">Status</span>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    item?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    item?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {item?.status || 'PENDING'}
                                </span>
                            </div>
                        </div>

                        {/* Bank Account Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <h3 className="font-semibold text-gray-800">Rekening Tujuan</h3>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded">
                                        {item?.bankAccount?.bank || '-'}
                                    </span>
                                    {item?.bankAccount?.accountType === 'EWALLET' && <span className="text-xl">📱</span>}
                                    {item?.bankAccount?.accountType === 'BANK' && <span className="text-xl">🏦</span>}
                                </div>
                                
                                <div>
                                    <p className="text-xs text-gray-600">Nomor Rekening</p>
                                    <p className="text-lg font-bold text-gray-900">{item?.bankAccount?.accountNumber || '-'}</p>
                                </div>
                                
                                <div>
                                    <p className="text-xs text-gray-600">Nama Pemilik</p>
                                    <p className="font-semibold text-gray-800">{item?.bankAccount?.bankName || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-600 mb-1">Saldo User Saat Ini</p>
                                <p className="text-lg font-bold text-gray-800">{formatCurrency(item?.user?.balance || 0)}</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-600 mb-1">Tanggal Permintaan</p>
                                <p className="text-sm font-semibold text-gray-800">{formatDate(item?.createdAt)}</p>
                            </div>
                        </div>

                        {/* Note Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Catatan Admin (Opsional)
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Tambahkan catatan untuk user..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                                rows="3"
                            />
                        </div>

                        {/* Warning if status not pending */}
                        {item?.status !== 'PENDING' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-yellow-800">Penarikan sudah diproses</p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Status saat ini: <span className="font-semibold">{item?.status}</span>
                                        </p>
                                        {item?.adminNote && (
                                            <p className="text-sm text-yellow-700 mt-2">
                                                Catatan: {item.adminNote}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {item?.status === 'PENDING' && (
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => handleOpenConfirm('reject')}
                                    className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Tolak
                                </button>
                                <button
                                    onClick={() => handleOpenConfirm('approve')}
                                    className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Setujui
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scaleIn">
                        {/* Header */}
                        <div className={`p-6 rounded-t-2xl ${
                            confirmAction === 'approve' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                : 'bg-gradient-to-r from-red-500 to-rose-500'
                        }`}>
                            <div className="text-center">
                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                                    confirmAction === 'approve' ? 'bg-white/20' : 'bg-white/20'
                                }`}>
                                    {confirmAction === 'approve' ? (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {confirmAction === 'approve' ? 'Setujui Penarikan?' : 'Tolak Penarikan?'}
                                </h3>
                                <p className="text-white/90 text-sm">
                                    {confirmAction === 'approve' 
                                        ? 'Konfirmasi untuk menyetujui permintaan penarikan' 
                                        : 'Saldo akan dikembalikan ke user'}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Detail Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Jumlah</span>
                                    <span className="font-bold text-lg text-gray-900">{formatCurrency(item?.amount || 0)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-gray-600">Tujuan</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                                {item?.bankAccount?.bank}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{item?.bankAccount?.accountNumber}</p>
                                        <p className="text-sm text-gray-600">{item?.bankAccount?.bankName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className={`rounded-xl p-4 ${
                                confirmAction === 'approve' 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-red-50 border border-red-200'
                            }`}>
                                <p className={`text-sm ${
                                    confirmAction === 'approve' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {confirmAction === 'approve' ? (
                                        <>
                                            ✓ <strong>Pastikan transfer sudah dilakukan</strong> ke rekening tujuan sebelum menyetujui
                                        </>
                                    ) : (
                                        <>
                                            ⚠️ <strong>Saldo akan dikembalikan</strong> sebesar {formatCurrency(item?.amount || 0)} ke user
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleCloseConfirm}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition active:scale-95 disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleConfirmAction}
                                    disabled={isProcessing}
                                    className={`flex-1 py-3 px-4 text-white font-semibold rounded-xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
                                        confirmAction === 'approve'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            {confirmAction === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}