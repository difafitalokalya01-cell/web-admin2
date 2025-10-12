'use client'

import ModalButton from "./modal/modalButtonDisplay";
import ModalBoxDisplayComponent from "./modal/modalBoxComponent";
import { useState } from "react";

export default function DisplayContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // state untuk menampung data form
  const [formData, setFormData] = useState({
    contact: { platform: "", hp: "" },
    rekening: { bank: "", nomor: "" },
    banner: { title: "", image: "" },
  });

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setIsModalOpen(false);
  };

  // update data form berdasarkan modal yang sedang aktif
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [modalType.toLowerCase()]: {
        ...prev[modalType.toLowerCase()],
        [name]: value,
      },
    }));
  };

  // submit form, untuk sementara hanya log data ke console
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data tersimpan sementara:", formData[modalType.toLowerCase()]);
    handleCloseModal();
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "Contact":
        return (
          <>
            <div className="w-full rounded-t-md bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
              <h2 className="text-xl font-bold">Masukkan Detil Contact</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Platform</label>
                <input
                  type="text"
                  name="platform"
                  value={formData.contact.platform}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nomor</label>
                <input
                  type="text"
                  name="hp"
                  value={formData.contact.hp}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <ModalButton type="submit" onClick={handleSubmit} className="bg-blue-300 w-full">Simpan</ModalButton>
            </form>
          </>
        );

      case "Rekening":
        return (
          <>
            <div className="w-full rounded-t-md bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
              <h2 className="text-xl font-bold">Masukkan Detil Rekening</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Nama Bank</label>
                <input
                  type="text"
                  name="bank"
                  value={formData.rekening.bank}
                  onChange={handleChange}
                  className="w-full border border-gray-300  p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nomor Rekening</label>
                <input
                  type="text"
                  name="nomor"
                  value={formData.rekening.nomor}
                  onChange={handleChange}
                  className="w-full border border-gray-300  p-2 rounded-md"
                />
              </div>
              <ModalButton type="submit" onClick={handleSubmit} className="bg-blue-300 w-full">Simpan</ModalButton>
            </form>
          </>
        );

      case "Banner":
        return (
          <>
            <div className="w-full rounded-t-md bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
              <h2 className="text-xl font-bold">Masukkan Detil Banner</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Judul Banner</label>
                <input
                  type="text"
                  name="title"
                  value={formData.banner.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300  p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">URL Gambar</label>
                <input
                  type="text"
                  name="image"
                  value={formData.banner.image}
                  onChange={handleChange}
                  className="w-full border border-gray-300  p-2 rounded-md"
                />
              </div>
              <ModalButton type="submit" onClick={handleSubmit} className="bg-blue-300 w-full">Simpan</ModalButton>
            </form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-md md:flex md:items-start md:justify-between gap-3">
      <div className="grid grid-rows-2 gap-3 md:w-1/2 w-full">
        {/* Contact */}
        <div className="shadow h-64 w-full rounded-md bg-white">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-600">Contact</h3>
            <ModalButton type="button" onClick={() => handleOpenModal("Contact")} className="bg-blue-300">
              + Tambah
            </ModalButton>
          </div>
        </div>

        {/* Rekening */}
        <div className="shadow h-64 w-full rounded-md bg-white">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-600">Rekening</h3>
            <ModalButton type="button" onClick={() => handleOpenModal("Rekening")} className="bg-blue-300">
              + Tambah
            </ModalButton>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="shadow h-[530px] mt-3 md:mt-0 md:w-1/2 w-full rounded-md bg-white">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-600">Banner</h3>
          <ModalButton type="button" onClick={() => handleOpenModal("Banner")} className="bg-blue-300">
            + Tambah
          </ModalButton>
        </div>
      </div>

      {/* Modal Box */}
      <ModalBoxDisplayComponent isOpen={isModalOpen} onClose={handleCloseModal}>
        {renderModalContent()}
      </ModalBoxDisplayComponent>
    </div>
  );
}
