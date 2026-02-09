'use client';

import Header from "@/app/components/layouts/header";
import ModalBoxDataUsers from "./modal/modalComponent";
import { useEffect, useState } from "react";
import ConfirmPopup from "@/app/components/modal/modalConfirm";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import axios from "@/app/lib/axios";
import useSWR from 'swr';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ProfileIcon from "@/assets/icons/loginIcons/user.png";

// ✅ Fetcher function untuk SWR
const fetcher = async (url) => {
  const response = await axios.get(url);
  
  if (response.data && Array.isArray(response.data.usersData)) {
    return response.data.usersData;
  } else {
    console.warn("Unexpected response format:", response.data);
    return [];
  }
};

export default function ContentUserPage({ initialData = [] }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const usersPerPage = 50;
  const [pageNumber, setPageNumber] = useState(0);
  
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setIsPageVisible(isVisible);
      setShouldFetch(isVisible);
      
      if (isVisible) {
        console.log('👀 User kembali ke halaman - mulai fetch');
      } else {
        console.log('😴 User meninggalkan halaman - stop fetch');
      }
    };

    setIsPageVisible(document.visibilityState === 'visible');
    setShouldFetch(document.visibilityState === 'visible');

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const { data: usersData, error, mutate, isValidating } = useSWR(
    shouldFetch ? '/api/admin/users' : null,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnMount: false,
      revalidateIfStale: false,
      refreshInterval: shouldFetch ? 10000 : 0, 
      revalidateOnFocus: false, 
      revalidateOnReconnect: shouldFetch,
      keepPreviousData: true,
      onError: (err) => {
        console.error('❌ SWR Error:', err);
        
        // ✅ Handle 401: stop fetch & redirect ke login
        if (err.response?.status === 401) {
          console.error('❌ Token expired, redirecting to login');
          
          // Stop auto-refresh
          setShouldFetch(false);
          
          // Hapus token
          localStorage.removeItem('admin_token');
          localStorage.removeItem('adminId');
          localStorage.removeItem('adminName');
          
          // Redirect ke login setelah delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
        }
      },
    }
  );

  const [users, setUsers] = useState(() => usersData ?? initialData ?? []);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => {
        const query = searchQuery.toLowerCase();
        return (
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.id?.toString().includes(query) ||
          user.phone?.toLowerCase().includes(query)
        );
      })
    : [];

  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const displayUsers = filteredUsers.slice(pagesVisited, pagesVisited + usersPerPage);

  useEffect(() => {
    setPageNumber(0);
  }, [searchQuery]);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const handleRefresh = () => {
    mutate();
  };

  const handleConfirmDeleteById = async () => {
    const toastId = toast.loading('Menghapus user...');
    
    try {
      await axios.delete(`/api/admin/users/${userToDelete.id}`);

      toast.update(toastId, {
        render: "User berhasil dihapus",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      await mutate();
      setIsConfirmOpen(false);
      setUserToDelete(null);

    } catch(err) {
      console.error('❌ Delete error:', err);
      toast.update(toastId, {
        render: err.response?.data?.message || "Gagal hapus user",
        type: "error",
        isLoading: false,
        autoClose: 2000
      });
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setUserToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">⚠️ Gagal memuat data</p>
            <p className="text-sm mt-1">{error.message}</p>
            {error.response?.status === 401 && (
              <p className="text-sm mt-2">Redirecting to login...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isPageVisible ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-500">
                    {isPageVisible ? 'Live' : 'Paused'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Total: <span className="font-semibold text-blue-600">{filteredUsers.length}</span> user
                {searchQuery && ` (dari ${users.length} user)`}
              </p>
            </div>

            <div className="flex gap-2 flex-1 lg:max-w-md">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari username, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                />
              </div>

              <button
                onClick={handleRefresh}
                disabled={isValidating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <ArrowPathIcon className={`w-5 h-5 ${isValidating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {!isPageVisible && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">
              Auto-refresh dinonaktifkan karena Anda tidak berada di halaman ini. Kembali ke tab ini untuk melanjutkan.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">No</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Profile</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">ID User</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Nomor HP</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Saldo</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Level</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Provider</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Bank Akun</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Terdaftar</th>
                  <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayUsers.map((user, index) => {
                  const globalIndex = pagesVisited + index + 1;
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                        {globalIndex}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.profilePicture
                                ? `${process.env.NEXT_PUBLIC_API_URL}${user.profilePicture}`
                                : ProfileIcon.src
                            }
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = ProfileIcon.src;
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{user.username}</p>
                            <p className="text-xs text-gray-500">
                              {user.isVerified ? '✓ Verified' : '⚠ Unverified'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                        {user.id}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {user.phone || '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-600 whitespace-nowrap">
                        Rp {(user.balance || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.userLevel?.currentLevel || 'CLASSIC'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                          user.provider === 'google' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.provider?.toUpperCase() || 'LOCAL'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-semibold text-xs">
                          {user.bankAccounts?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition active:scale-95"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md transition active:scale-95"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {displayUsers.length === 0 && (
              <div className="text-center py-12">
                {isValidating ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500">Memuat data...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500">
                      {searchQuery ? 'Tidak ada user yang sesuai dengan pencarian' : 'Tidak ada data user'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {pageCount > 1 && (
            <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
              <ReactPaginate
                previousLabel="← Prev"
                nextLabel="Next →"
                pageCount={pageCount}
                onPageChange={changePage}
                forcePage={pageNumber}
                containerClassName="flex items-center justify-center gap-1 select-none flex-wrap"
                pageClassName="hidden sm:block"
                pageLinkClassName="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition cursor-pointer"
                activeLinkClassName="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                previousClassName="block"
                previousLinkClassName="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition cursor-pointer"
                nextClassName="block"
                nextLinkClassName="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition cursor-pointer"
                disabledClassName="opacity-50 cursor-not-allowed"
                breakLabel="..."
                breakClassName="px-2 py-2 text-sm text-gray-500"
              />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ModalBoxDataUsers
          user={selectedUser}
          onClose={handleCloseModal}
          onDeleteClick={handleDelete}
          onMutate={mutate}
        />
      )}

      {isConfirmOpen && (
        <ConfirmPopup
          isOpen={isConfirmOpen}
          message="Apakah Anda yakin akan menghapus akun ini?"
          onConfirm={handleConfirmDeleteById}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}