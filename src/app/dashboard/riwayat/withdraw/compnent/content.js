'use client';

import Header from "@/app/components/layouts/header";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "@/app/lib/axios";
import { toast } from "react-toastify";

export default function WithdrawHistoryContent({ 
    dataWithdraws: initialData = [], 
    isLoading: initialLoading = false, // ✅ Default false
    onRefresh 
}) {
    const [dataWithdraws, setDataWithdraws] = useState(initialData);
    const [isLoading, setIsLoading] = useState(initialLoading);
    // ✅ FIX HYDRATION: Initial state null, set di useEffect
    const [lastUpdate, setLastUpdate] = useState(null);
    
    const withdrawsPerPage = 50;
    const [pageNumber, setPageNumber] = useState(0);

    // ✅ Set waktu di client-side only (fix hydration)
    useEffect(() => {
        setDataWithdraws(initialData);
        setLastUpdate(new Date()); // Hanya di client
    }, [initialData]);

    // ✅ Set initial waktu saat mount di client
    useEffect(() => {
        if (!lastUpdate) {
            setLastUpdate(new Date());
        }
    }, []);

    const pageCount = Math.ceil(dataWithdraws.length / withdrawsPerPage);
    const pagesVisited = pageNumber * withdrawsPerPage;
    const displayWithdraws = dataWithdraws.slice(pagesVisited, pagesVisited + withdrawsPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const handleRefresh = async () => {
        if (onRefresh) {
            setIsLoading(true);
            await onRefresh();
            setIsLoading(false);
            setLastUpdate(new Date()); // Update waktu setelah refresh
        }
    };

    // ✅ Handle null date (fix hydration)
    const formatTime = (date) => {
        if (!date) return '00:00:00';
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusUpper = status?.toUpperCase() || '';
        const statusConfig = {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'PROCESSING': 'bg-blue-100 text-blue-800 border-blue-200',
            'APPROVED': 'bg-green-100 text-green-800 border-green-200',
            'REJECTED': 'bg-red-100 text-red-800 border-red-200'
        };
        return statusConfig[statusUpper] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusText = (status) => {
        const statusMap = {
            'PENDING': 'Menunggu',
            'PROCESSING': 'Diproses',
            'APPROVED': 'Disetujui',
            'REJECTED': 'Ditolak'
        };
        return statusMap[status?.toUpperCase()] || status;
    };

    const formatId = (id) => {
        if (!id) return '-';
        const idStr = String(id);
        return idStr.length > 8 ? `${idStr.substring(0, 8)}...` : idStr;
    };

    const formatBankAccount = (bankAccount) => {
        if (!bankAccount) return '-';
        return `${bankAccount.bankName || bankAccount.bank || '-'} - ${bankAccount.accountNumber || '-'}`;
    };

    const handleDelete = async (withdrawId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus riwayat penarikan ini?')) {
            return;
        }

        const toastId = toast.loading('Menghapus riwayat...');
        
        try {
            await axios.delete(`/admin/withdraws/${withdrawId}`);
            
            toast.update(toastId, {
                render: 'Riwayat berhasil dihapus!',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });

            setDataWithdraws(prev => prev.filter(w => w.id !== withdrawId));
            setLastUpdate(new Date());
            
        } catch (error) {
            console.error('❌ Error deleting withdraw:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error ||
                               'Gagal menghapus riwayat';
            
            toast.update(toastId, {
                render: errorMessage,
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="container mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                Riwayat Penarikan
                            </h1>
                            <p className="text-sm text-gray-500">
                                Daftar penarikan dana pengguna
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 md:mt-0">
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition active:scale-95 text-sm"
                            >
                                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {isLoading ? 'Memuat...' : 'Refresh'}
                            </button>
                            
                            {/* ✅ FIX HYDRATION: Tampilkan placeholder saat null */}
                            <div className="text-xs text-gray-500">
                                Update: {lastUpdate ? formatTime(lastUpdate) : '00:00:00'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section - TANPA LOADING SPINNER */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                <tr>
                                    <th className="px-4 py-3 font-semibold w-12">No</th>
                                    <th className="px-4 py-3 font-semibold hidden md:table-cell">ID</th>
                                    <th className="px-4 py-3 font-semibold">Username</th>
                                    <th className="px-4 py-3 font-semibold hidden lg:table-cell">Email</th>
                                    <th className="px-4 py-3 font-semibold hidden lg:table-cell">Phone</th>
                                    <th className="px-4 py-3 font-semibold hidden xl:table-cell">Bank</th>
                                    <th className="px-4 py-3 font-semibold">Jumlah</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold hidden lg:table-cell">Tanggal</th>
                                    <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {displayWithdraws.length > 0 ? (
                                    displayWithdraws.map((withdraw, index) => {
                                        const globalIndex = pagesVisited + index + 1;
                                        return (
                                            <tr 
                                                key={withdraw.id} 
                                                className="hover:bg-blue-50 transition-colors duration-150"
                                            >
                                                <td className="px-4 py-3 text-center font-medium text-gray-700">
                                                    {globalIndex}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 hidden md:table-cell font-mono text-xs">
                                                    {formatId(withdraw.id)}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {withdraw.user?.username || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                                                    {withdraw.user?.email || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                                                    {withdraw.user?.phone || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700 hidden xl:table-cell">
                                                    <div className="text-xs">
                                                        {formatBankAccount(withdraw.bankAccount)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-blue-600">
                                                    {formatCurrency(withdraw.amount || 0)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(withdraw.status)}`}>
                                                        {getStatusText(withdraw.status)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 hidden lg:table-cell text-xs">
                                                    {formatDate(withdraw.createdAt)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        {withdraw.status?.toUpperCase() === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleDelete(withdraw.id)}
                                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition active:scale-95 shadow-sm hover:shadow-md"
                                                                title="Hapus"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    // ✅ HANYA tampilkan empty state, TIDAK ADA LOADING SPINNER
                                    <tr>
                                        <td colSpan="10" className="px-4 py-12 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="mt-2 text-gray-500 font-medium">Tidak ada data</p>
                                            <p className="text-gray-400 text-sm">Belum ada riwayat penarikan</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pageCount > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 border-t bg-gray-50 gap-3">
                            <div className="text-sm text-gray-600">
                                Menampilkan {pagesVisited + 1} - {Math.min(pagesVisited + withdrawsPerPage, dataWithdraws.length)} dari {dataWithdraws.length} data
                            </div>
                            
                            <ReactPaginate
                                previousLabel={"← Prev"}
                                nextLabel={"Next →"}
                                pageCount={pageCount}
                                onPageChange={changePage}
                                forcePage={pageNumber}
                                containerClassName="flex items-center gap-1"
                                pageClassName="hidden sm:block"
                                pageLinkClassName="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition text-sm"
                                activeLinkClassName="!bg-blue-500 !text-white !border-blue-500 font-semibold"
                                previousClassName="block"
                                previousLinkClassName="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition text-sm font-medium"
                                nextClassName="block"
                                nextLinkClassName="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition text-sm font-medium"
                                disabledLinkClassName="!opacity-50 !cursor-not-allowed !hover:bg-white"
                                breakLabel="..."
                                breakClassName="px-2 text-gray-500"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}