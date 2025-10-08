'use client'

import Header from "@/app/components/layouts/header";
import ModalBoxDataUsers from "@/app/components/modal/modalComponent";
import { useState  } from "react";

export default function UsersPages() {

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const data = [
    { id: 1, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Admin" },
    { id: 2, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "User" },
    { id: 3, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Staff" },
  ];

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModal
  };

    return (
        <section className="w-full min-h-screen">
            <Header/>
            <div className="py-6">
                <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full text-sm text-left border-collapse">
                        <thead>
                        <tr className="bg-blue-100 text-gray-800">
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

192.168.110.146

                        {data.map((user, index) => (
                            <tr
                            key={index}
                            className="hover:bg-blue-50 transition-colors duration-150"
                            >
                            <td className="px-3 py-2 hidden md:table-cell">{user.id}</td>
                            <td className="px-3 py-2">{user.username}</td>
                            <td className="px-3 py-2 hidden md:table-cell">{user.email}</td>
                            <td className="px-3 py-2 hidden md:table-cell">{user.phone}</td>
                            <td className="px-3 py-2 hidden md:table-cell">{user.terakhirLogin}</td>
                            <td className="px-3 py-2">{user.category}</td>
                            <td className="px-3 py-2 text-center">
                                <button
                                onClick={() => handleOpenModal(user)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs transition"
                                >
                                Detail
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                {isModalOpen && (
                    <ModalBoxDataUsers user={selectedUser} onClose={handleCloseModal} />
                )}
             </div>
            </div>
        </section>
    )
}