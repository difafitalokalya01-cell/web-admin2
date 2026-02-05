'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from "@/app/lib/image.helper";

export default function ModalTopup({ item, onClose, onApprove, onReject }) {
    const [note, setNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    
    const [proofImageLoading, setProofImageLoading] = useState(true);
    const [proofImageError, setProofImageError] = useState(false);
    const [profileImageLoading, setProfileImageLoading] = useState(true);
    const [profileImageError, setProfileImageError] = useState(false);

    useEffect(() => {
        setNote(item?.note || '');
        
        setProofImageError(false);
        setProofImageLoading(true);
        setProfileImageError(false);
        setProfileImageLoading(true);
        
        if (item) {
            console.log('[ModalTopup] Item data:', item);
            console.log('[ModalTopup] Proof image path:', item.proofImage);
            console.log('[ModalTopup] User profile:', item.user?.profilePicture);
        }
    }, [item]);

    if (!item) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleApprove = async () => {
        setShowApproveConfirm(false);
        
        setIsProcessing(true);
        try {
            await onApprove(note);
            onClose();
        } catch (error) {
            console.error('Failed to approve topup:', error);
            alert('Gagal menyetujui top-up. Silakan coba lagi.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!note.trim()) {
            alert('Catatan wajib diisi untuk menolak top-up!');
            return;
        }

        setShowRejectConfirm(false);
        setIsProcessing(true);
        
        try {
            await onReject(note);
            onClose();
        } catch (error) {
            console.error('Failed to reject topup:', error);
            alert('Gagal menolak top-up. Silakan coba lagi.');
        } finally {
            setIsProcessing(false);
        }
    };

    const proofImageUrl = getImageUrl(item.proofImage, 'transferproof');
    const profilePictureUrl = getImageUrl(item.user?.profilePicture, 'users');

    const handleProofImageLoad = () => {
        console.log('[ModalTopup] Proof image loaded successfully');
        setProofImageLoading(false);
        setProofImageError(false);
    };

    const handleProofImageError = (e) => {
        console.error('[ModalTopup] Proof image failed to load:', e);
        console.error('[ModalTopup] Failed URL:', proofImageUrl);
        setProofImageLoading(false);
        setProofImageError(true);
    };

    const handleProfileImageLoad = () => {
        console.log('[ModalTopup] Profile image loaded successfully');
        setProfileImageLoading(false);
        setProfileImageError(false);
    };

    const handleProfileImageError = (e) => {
        console.error('[ModalTopup] Profile image failed to load:', e);
        console.error('[ModalTopup] Failed URL:', profilePictureUrl);
        setProfileImageLoading(false);
        setProfileImageError(true);
    };

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
                role="dialog"
                aria-modal="true"
                aria-labelledby="topup-modal-title"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className="bg-white animate-scaleIn rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
                    <div className="bg-blue-500 rounded-t-lg border-b border-blue-600 px-6 py-4 flex justify-between items-center shrink-0">
                        <h2 id="topup-modal-title" className="text-xl font-bold text-white">Verifikasi Top-Up</h2>
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="text-white hover:text-gray-200 transition p-1.5 hover:bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Tutup modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* User Info */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700">Informasi User</h3>
                            </div>
                            <div className="p-5">
                                <div className="flex flex-col md:flex-row gap-5">
                                    {/* Profile Picture */}
                                    <div className="flex-shrink-0 mx-auto md:mx-0">
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                                            {profileImageLoading && (
                                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                                </div>
                                            )}
                                            
                                            {profilePictureUrl && !profileImageError ? (
                                                <Image
                                                    src={profilePictureUrl}
                                                    alt={`${item.user?.username || 'User'} profile`}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover"
                                                    onLoad={handleProfileImageLoad}
                                                    onError={handleProfileImageError}
                                                    unoptimized
                                                    priority
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                                                    {item.user?.username?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Details */}
                                    <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3">
                                        <DetailItem label="Username" value={item.user?.username || '-'} />
                                        <DetailItem label="Email" value={item.user?.email || '-'} />
                                        <DetailItem label="No. Telepon" value={item.user?.phone || '-'} />
                                        <DetailItem 
                                            label="Saldo Saat Ini" 
                                            value={formatCurrency(item.user?.balance || 0)}
                                            valueClass="font-bold text-emerald-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Topup Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Topup Info */}
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-700">Detail Top-Up</h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">ID Transaksi</p>
                                            <p className="font-mono text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">
                                                {item.userId}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Jumlah Top-Up</p>
                                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(item.amount)}</p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <StatusBadge status={item.status} />
                                        </div>
                                        
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Tanggal Request</p>
                                            <p className="font-medium text-gray-800">
                                                {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        {item.note && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Catatan Sebelumnya</p>
                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <p className="text-sm text-gray-800">{item.note}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Saldo Simulation */}
                                <div className="border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50">
                                    <div className="bg-emerald-100 px-5 py-3 border-b border-emerald-200">
                                        <h4 className="text-sm font-medium text-emerald-800">Simulasi Saldo</h4>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Saldo Saat Ini</span>
                                            <span className="font-semibold text-gray-800">
                                                {formatCurrency(item.user?.balance || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Top-Up</span>
                                            <span className="font-semibold text-emerald-600">
                                                + {formatCurrency(item.amount)}
                                            </span>
                                        </div>
                                        <div className="border-t border-emerald-200 pt-3 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-700">Saldo Setelah Top-Up</span>
                                            <span className="text-lg font-bold text-emerald-600">
                                                {formatCurrency((item.user?.balance || 0) + item.amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Proof Image - ✅ PERBAIKAN 8: Improved image handling */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700">Bukti Transfer</h3>
                                </div>
                                <div className="p-5">
                                    {proofImageUrl ? (
                                        <div className="relative group">
                                            {/* Loading State */}
                                            {proofImageLoading && (
                                                <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
                                                    <div className="text-center">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                                                        <p className="text-sm text-gray-600">Memuat gambar...</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error State */}
                                            {proofImageError ? (
                                                <div className="bg-gray-100 rounded-lg h-96 flex flex-col items-center justify-center p-6">
                                                    <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <p className="text-gray-700 font-medium text-sm text-center mb-2">
                                                        Gagal memuat bukti transfer
                                                    </p>
                                                    <p className="text-gray-500 text-xs text-center mb-4">
                                                        URL: {proofImageUrl}
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setProofImageError(false);
                                                            setProofImageLoading(true);
                                                        }}
                                                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                                                    >
                                                        Coba Lagi
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="relative">
                                                        <Image
                                                            src={proofImageUrl}
                                                            alt="Bukti transfer untuk top-up"
                                                            width={400}
                                                            height={600}
                                                            className="w-full h-auto rounded-lg border border-gray-300 object-contain max-h-[600px]"
                                                            onLoad={handleProofImageLoad}
                                                            onError={handleProofImageError}
                                                            unoptimized
                                                            priority
                                                        />
                                                    </div>
                                                    
                                                    <a
                                                        href={proofImageUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        Download / Lihat Full Size
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg h-96 flex flex-col items-center justify-center p-6">
                                            <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-500 text-sm text-center">
                                                Tidak ada bukti transfer yang diunggah
                                            </p>
                                            <p className="text-gray-400 text-xs text-center mt-2">
                                                Path: {item.proofImage || 'null'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Note Input */}
                        {item.status === 'PENDING' && (
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                    <label htmlFor="admin-note" className="block text-sm font-medium text-gray-700">
                                        Catatan Admin
                                        <span className="text-gray-500 ml-2 text-xs">
                                            (Opsional untuk approve, wajib untuk reject)
                                        </span>
                                    </label>
                                </div>
                                <div className="p-4">
                                    <textarea
                                        id="admin-note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Tambahkan catatan untuk user..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all hover:border-gray-400"
                                        disabled={isProcessing}
                                    />
                                    {note.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1 text-right">
                                            {note.length} karakter
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer - Tetap di bawah tanpa sticky */}
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 shrink-0">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="px-4 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            Tutup
                        </button>
                        
                        {item.status === 'PENDING' && (
                            <>
                                <button
                                    onClick={() => setShowRejectConfirm(true)}
                                    disabled={isProcessing}
                                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                                >
                                    Tolak Top-Up
                                </button>
                                
                                <button
                                    onClick={() => setShowApproveConfirm(true)}
                                    disabled={isProcessing}
                                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Setujui Top-Up
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Approve Confirmation Modal */}
            {showApproveConfirm && (
                <ConfirmationModal
                    title="Konfirmasi Persetujuan"
                    message={`Apakah Anda yakin ingin menyetujui top-up sebesar ${formatCurrency(item.amount)} dari user ${item.user?.username}?`}
                    confirmText="Ya, Setujui"
                    cancelText="Batal"
                    onConfirm={handleApprove}
                    onCancel={() => setShowApproveConfirm(false)}
                    confirmButtonClass="bg-emerald-600 hover:bg-emerald-700"
                    icon={
                        <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    }
                />
            )}

            {/* Reject Confirmation Modal */}
            {showRejectConfirm && (
                <ConfirmationModal
                    title="Konfirmasi Penolakan"
                    message={
                        !note.trim() ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                <p className="text-red-800 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Catatan wajib diisi untuk menolak top-up!
                                </p>
                            </div>
                        ) : (
                            `Apakah Anda yakin ingin menolak top-up sebesar ${formatCurrency(item.amount)} dari user ${item.user?.username}?`
                        )
                    }
                    confirmText="Ya, Tolak"
                    cancelText="Batal"
                    onConfirm={handleReject}
                    onCancel={() => setShowRejectConfirm(false)}
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                    disabled={!note.trim()}
                    icon={
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            )}
        </>

    );
}

const DetailItem = ({ label, value, valueClass = "font-medium text-gray-900" }) => (
    <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-sm ${valueClass}`}>{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        'PENDING': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
        'APPROVED': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
        'REJECTED': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    };
    
    const config = statusConfig[status] || statusConfig['PENDING'];
    
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
            {status}
        </span>
    );
};

const ConfirmationModal = ({ 
    title, 
    message, 
    confirmText, 
    cancelText, 
    onConfirm, 
    onCancel, 
    confirmButtonClass,
    disabled = false,
    icon 
    }) => (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 m-4 animate-scale-in">
                {icon}
                <h3 id="confirm-modal-title" className="text-lg font-bold text-gray-800 mb-3 text-center">
                    {title}
                </h3>
                
                <div className="text-gray-600 mb-6 text-center">
                    {typeof message === 'string' ? <p>{message}</p> : message}
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={disabled}
                        className={`px-4 py-2.5 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all w-full sm:w-auto ${
                            disabled 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : `${confirmButtonClass} hover:shadow-md`
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>

);