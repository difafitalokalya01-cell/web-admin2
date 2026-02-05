'use client'

import Header from "@/app/components/layouts/header";
import ConfirmPopup from "@/app/components/modal/modalConfirm";
import ModalAssignTask from "./modal/Modalassigntask";
import ModalSelectProduct from "./modal/Modalselectproduct";
import ModalTopup from "./modal/Modaltopup";
import ModalWithdraw from "./modal/Modalwithdraw";
import { useState, useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import axios from "@/app/lib/axios";
import Image from "next/image";
import { toast } from "react-toastify";

export default function ContentTaskPage({ data: initialData }) {
    const [data, setData] = useState(initialData);
    const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);
    const [isModalProductOpen, setIsModalProductOpen] = useState(false);
    const [isModalTopupOpen, setIsModalTopupOpen] = useState(false);
    const [isModalWithdrawOpen, setIsModalWithdrawOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('tasks');
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    
    const usersPerPage = 50;
    const [pageNumber, setPageNumber] = useState(0);
    const intervalRef = useRef(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [dataTaskRes, dataTopupRes, dataWithdrawRes] = await Promise.all([
                axios.get('/api/admin/request/tasks'),
                axios.get('/api/admin/request/topups'),
                axios.get('/api/admin/request/withdraws')
            ]);

            setData({
                tasks: dataTaskRes.data?.data?.requestTasks || [],
                topups: dataTopupRes.data?.data?.topups || [],
                withdraws: dataWithdrawRes.data?.data?.withdraws || []
            });

            console.log(setData);

            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error fetching data:', error);
            setData({
                tasks: [],
                topups: [],
                withdraws: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            fetchData();
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [pageNumber, activeTab]);

    const currentData = Array.isArray(data[activeTab]) ? data[activeTab] : [];
    
    const pageCount = Math.ceil(currentData.length / usersPerPage);
    const pagesVisited = pageNumber * usersPerPage;
    const displayItems = currentData.slice(pagesVisited, pagesVisited + usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPageNumber(0);
    };

    const handleOpenAssignTask = (item) => {
        setSelectedItem(item);
        setSelectedProduct(null); // Reset selected product
        setIsModalAssignOpen(true);
    };

    const handleSelectProduct = () => {
        setIsModalProductOpen(true);
    };

    const handleProductSelected = (product) => {
        setSelectedProduct(product);
        setIsModalProductOpen(false);
    };

    const handleAssignTask = async () => {
      const toastId = toast.loading("Mengirim tugas..");

        if (!selectedProduct) {
            alert('Silakan pilih produk terlebih dahulu');
            return;
        };

        const userId = selectedItem.assignedByUserId;

        try {
            // Endpoint versi saya: POST /api/admin/tasks/assign
            await axios.post(`/api/user/${userId}/tasks/assign`, {
                requestTaskId: selectedItem.id,
                productId: selectedProduct.id
            });

            toast.update(toastId, {
              render: "Tugas berhasil terkirim!",
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });

            setIsModalAssignOpen(false);
            setSelectedItem(null);
            setSelectedProduct(null);
            await fetchData();
        } catch (error) {
            console.error('Error assigning task:', error);
            toast.update(toastId, {
            render: error.response?.data?.message || "Gagal mengirim tugas",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
    };

    const handleOpenTopup = (item) => {
        setSelectedItem(item);
        setIsModalTopupOpen(true);
    };

    const handleTopupAction = async (action, note = '') => {
        const toastId = toast.loading(`Memproses penarikan...`);
        try {
            await axios.patch(`/api/admin/topup/${selectedItem.id}/status`, {
                status: action === 'approve' ? 'APPROVED' : 'REJECTED',
                adminNote: note || undefined
            });

            toast.update(toastId, {
                render: `Penarikan berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}!`,
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            setIsModalTopupOpen(false);
            setSelectedItem(null);
            await fetchData();
        } catch (error) {
            console.error('Error processing toptup:', error);
            toast.update(toastId, {
                render: error.response?.data?.message || "Gagal memproses topup",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const handleOpenWithdraw = (item) => {
        setSelectedItem(item);
        setIsModalWithdrawOpen(true);
    };

    const handleWithdrawAction = async (action, note = '') => {
        const toastId = toast.loading(`Memproses penarikan...`);
        try {
            await axios.patch(`/api/admin/withdraws/${selectedItem.id}/status`, {
                status: action === 'approve' ? 'APPROVED' : 'REJECTED',
                adminNote: note || undefined
            });

            toast.update(toastId, {
                render: `Penarikan berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}!`,
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            setIsModalWithdrawOpen(false);
            setSelectedItem(null);
            await fetchData();
        } catch (error) {
            console.error('Error processing withdraw:', error);
            toast.update(toastId, {
                render: error.response?.data?.message || "Gagal memproses penarikan",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const formatTime = (date) => {
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
    

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="container mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">
                            Data Permintaan
                        </h1>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={fetchData}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition active:scale-95 text-sm"
                            >
                                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {isLoading ? 'Memuat...' : 'Refresh'}
                            </button>
                            
                            <div className="text-xs text-gray-500">
                                Update: {formatTime(lastUpdate)}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex">
                        <TabButton
                            active={activeTab === 'tasks'}
                            onClick={() => handleTabChange('tasks')}
                            label="Tugas"
                            count={Array.isArray(data.tasks) ? data.tasks.length : 0}
                        />
                        <TabButton
                            active={activeTab === 'topups'}
                            onClick={() => handleTabChange('topups')}
                            label="Top Up"
                            count={Array.isArray(data.topups) ? data.topups.length : 0}
                        />
                        <TabButton
                            active={activeTab === 'withdraws'}
                            onClick={() => handleTabChange('withdraws')}
                            label="Penarikan"
                            count={Array.isArray(data.withdraws) ? data.withdraws.length : 0}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Table untuk Request Task */}
                        {activeTab === 'tasks' && (
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">No</th>
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Username</th>
                                        <th className="px-4 py-3 font-semibold">Tugas Ke</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {displayItems.map((item, index) => {
                                        const globalIndex = pagesVisited + index + 1;
                                        return (
                                            <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                                                <td className="px-4 py-3 text-center font-medium text-gray-700">
                                                    {globalIndex}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {item.assignedByUserId.substring(0, 8)}...
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {item.user?.username || '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        Tugas {item.user?.userLevel?.totalTasks || 0}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={item.isRead ? 'processed' : 'pending'} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <button
                                                            onClick={() => handleOpenAssignTask(item)}
                                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition active:scale-95 shadow-sm hover:shadow-md"
                                                            title="Kirim Tugas"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {/* Table untuk Topup */}
                        {activeTab === 'topups' && (
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">No</th>
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Username</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold">Jumlah</th>
                                        <th className="px-4 py-3 font-semibold">Saldo</th>
                                        <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {displayItems.map((item, index) => {
                                        const globalIndex = pagesVisited + index + 1;
                                        return (
                                            <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                                                <td className="px-4 py-3 text-center font-medium text-gray-700">
                                                    {globalIndex}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {item.userId.substring(0, 8)}...
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {item.user?.username || '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={item.status} />
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-green-600">
                                                    {formatCurrency(item.amount)}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {formatCurrency(item.user?.balance || 0)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <button
                                                            onClick={() => handleOpenTopup(item)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition active:scale-95 shadow-sm hover:shadow-md"
                                                            title="Proses Topup"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {/* Table untuk Withdraw */}
                        {activeTab === 'withdraws' && (
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">No</th>
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Username</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold">Jumlah</th>
                                        <th className="px-4 py-3 font-semibold">Saldo</th>
                                        <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {displayItems.map((item, index) => {
                                        const globalIndex = pagesVisited + index + 1;
                                        return (
                                            <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                                                <td className="px-4 py-3 text-center font-medium text-gray-700">
                                                    {globalIndex}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {item.userId.substring(0, 8)}...
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {item.user?.username || '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={item.status} />
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-red-600">
                                                    {formatCurrency(item.amount)}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {formatCurrency(item.user?.balance || 0)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <button
                                                            onClick={() => handleOpenWithdraw(item)}
                                                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md transition active:scale-95 shadow-sm hover:shadow-md"
                                                            title="Proses Penarikan"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {displayItems.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="mt-2 text-gray-500 font-medium">Tidak ada data</p>
                                <p className="text-gray-400 text-sm">Belum ada permintaan {activeTab}</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pageCount > 1 && (
                        <div className="flex justify-between items-center px-4 py-4 border-t bg-gray-50">
                            <div className="text-sm text-gray-600">
                                Menampilkan {pagesVisited + 1} - {Math.min(pagesVisited + usersPerPage, currentData.length)} dari {currentData.length} data
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

            {/* Modals */}
            {isModalAssignOpen && (
                <ModalAssignTask
                    item={selectedItem}
                    selectedProduct={selectedProduct}
                    onClose={() => {
                        setIsModalAssignOpen(false);
                        setSelectedItem(null);
                        setSelectedProduct(null);
                    }}
                    onSelectProduct={handleSelectProduct}
                    onAssignTask={handleAssignTask}
                />
            )}

            {isModalProductOpen && (
                <ModalSelectProduct
                    onClose={() => setIsModalProductOpen(false)}
                    onSelect={handleProductSelected}
                />
            )}

            {isModalTopupOpen && (
                <ModalTopup
                    item={selectedItem}
                    onClose={() => {
                        setIsModalTopupOpen(false);
                        setSelectedItem(null);
                    }}
                    onApprove={(note) => handleTopupAction('approve', note)}
                    onReject={(note) => handleTopupAction('reject', note)}
                />
            )}

            {isModalWithdrawOpen && (
                <ModalWithdraw
                    item={selectedItem}
                    onClose={() => {
                        setIsModalWithdrawOpen(false);
                        setSelectedItem(null);
                    }}
                    onApprove={(note) => handleWithdrawAction('approve', note)}
                    onReject={(note) => handleWithdrawAction('reject', note)}
                />
            )}
        </div>
    );
}

// Component untuk Tab Button
function TabButton({ active, onClick, label, count }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 md:flex-none px-6 py-3 font-medium transition-colors relative ${
                active
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
        >
            <span className="flex items-center justify-center gap-2">
                {label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                    active ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-600'
                }`}>
                    {count}
                </span>
            </span>
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
        </button>
    );
}

// Component untuk Status Badge
function StatusBadge({ status }) {
    const getStatusStyle = () => {
        const statusLower = status?.toLowerCase() || '';
        
        if (statusLower.includes('pending') || statusLower.includes('menunggu')) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
        if (statusLower.includes('approved') || statusLower.includes('selesai') || statusLower.includes('sukses') || statusLower.includes('completed')) {
            return 'bg-green-100 text-green-800 border-green-200';
        }
        if (statusLower.includes('rejected') || statusLower.includes('ditolak') || statusLower.includes('gagal')) {
            return 'bg-red-100 text-red-800 border-red-200';
        }
        if (statusLower.includes('processing') || statusLower.includes('proses') || statusLower.includes('processed')) {
            return 'bg-blue-100 text-blue-800 border-blue-200';
        }
        
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle()}`}>
            {status}
        </span>
    );
}