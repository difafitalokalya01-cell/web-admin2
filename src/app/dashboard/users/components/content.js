'use client';

import Header from "@/app/components/layouts/header";
import ModalBoxDataUsers from "./modal/modalComponent";
import { useState } from "react";
import ConfirmPopup from "@/app/components/modal/modalConfirm";
import ReactPaginate from "react-paginate";

export default function ContentUserPage({ dataUsers }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const usersPerPage = 50;
  const [pageNumber, setPageNumber] = useState(0);

  const pageCount = Math.ceil(dataUsers.length / usersPerPage);

  const pagesVisited = pageNumber * usersPerPage;
  const displayUsers = dataUsers.slice(pagesVisited, pagesVisited + usersPerPage);

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

  const handleConfirmDelete = () => {
    if (userToDelete) {
      // 🔥 Lakukan logika hapus di sini (misal: panggil API)
      console.log("Menghapus pengguna:", userToDelete.id);
      // Contoh: onDeleteUser(userToDelete.id);
    }
    setIsConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="py-2">
        <div className="w-full overflow-x-auto bg-white shadow-md rounded-md overflow-y-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="sticky top-0 bg-blue-100 text-gray-800 z-10">
              <tr>
                <th className="px-3 py-2 w-12">No</th>
                <th className="px-3 py-2 hidden md:table-cell">ID</th>
                <th className="px-3 py-2">Username</th>
                <th className="px-3 py-2 hidden md:table-cell">Email</th>
                <th className="px-3 py-2 hidden md:table-cell">Nomor HP</th>
                <th className="px-3 py-2 hidden md:table-cell">Terakhir Login</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((user, index) => {
                const globalIndex = pagesVisited + index + 1;
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50 transition-colors duration-150 border-b border-gray-300"
                  >
                    <td className="px-3 py-2 text-center">{globalIndex}</td>
                    <td className="px-3 py-2 hidden md:table-cell">{user.id}</td>
                    <td className="px-3 py-2">{user.username}</td>
                    <td className="px-3 py-2 hidden md:table-cell">{user.email}</td>
                    <td className="px-3 py-2 hidden md:table-cell">{user.phone}</td>
                    <td className="px-3 py-2 hidden md:table-cell">{user.terakhirLogin}</td>
                    <td className="px-3 py-2">{user.category}</td>
                    <td className="px-2 py-2 text-center flex flex-col md:flex-row justify-center items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 active:scale-95 rounded-md text-xs transition"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 active:scale-95 rounded-md text-xs transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {displayUsers.length === 0 && (
            <div className="text-center py-4 text-gray-500">Tidak ada data.</div>
          )}
        </div>

        <div className="flex justify-center items-center mt-1">
        <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName="flex items-center justify-center select-none text-sm"
            pageClassName="group"
            pageLinkClassName="block px-3 py-1 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-100 transition"
            activeLinkClassName="border-blue-400 text-blue-600 font-semibold"
            previousClassName="group"
            previousLinkClassName="block px-3 py-1 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-100 transition"
            nextClassName="group"
            nextLinkClassName="block px-3 py-1 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-100 transition"
            disabledClassName="opacity-40 cursor-not-allowed"
            breakLabel="..."
            breakClassName="px-3 py-1 text-gray-500"
        />
        </div>



        {isModalOpen && (
          <ModalBoxDataUsers
            user={selectedUser}
            onClose={handleCloseModal}
            onDeleteClick={handleDelete}
          />
        )}

        {isConfirmOpen && (
          <ConfirmPopup
            isOpen={isConfirmOpen}
            message="Apakah Anda yakin akan menghapus akun ini?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </div>
  );
}