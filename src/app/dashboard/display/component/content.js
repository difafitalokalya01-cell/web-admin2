'use client';

import ModalButton from './modal/modalButtonDisplay';
import ModalBoxDisplayComponent from './modal/modalBoxComponent';
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from '@/app/lib/axios';

export default function DisplayContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [formData, setFormData] = useState({
    contact: { platform: '', number: '', link: '' },
    rekening: { bankName: '', accountNumber: '' },
    banner: { title: '', image: '' },
  });

const CONTACT_PLATFORMS = [
  'WhatsApp',
  'Telegram'
];

const BANKS = [
  'BCA',
  'BRI',
  'BNI',
  'Mandiri',
  'CIMB Niaga',
  'BSI',
  'Permata',
  'Danamon',
  'Lainnya',
];

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setIsModalOpen(false);
  };

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

  const handleBannerImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      },
    }));
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Loading...");

    try {
      switch (modalType) {
        case "Banner": {
          const payload = new FormData();
          payload.append("title", formData.banner.title);

          if (formData.banner.imageFile) {
            payload.append("image", formData.banner.imageFile);
          }

          await axios.post("/api/banner", payload, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          toast.update(toastId, {
            type: "success",
            render: "Berhasil update data banner",
            isLoading: false,
            autoClose: 2000,
          });

          break;
        }

        case "Contact": {
          await axios.post("/api/contact", formData.contact);

          toast.update(toastId, {
            type: "success",
            render: "Berhasil update data kontak",
            isLoading: false,
            autoClose: 2000,
          });

          break;
        }

        case "Rekening": {
          await axios.post("/api/rekening", formData.rekening);

          toast.update(toastId, {
            type: "success",
            render: "Berhasil update data rekening",
            isLoading: false,
            autoClose: 2000,
          });

          break;
        }
      }

      handleCloseModal(); // hanya sukses
    } catch (error) {
      console.error(error);

      const status = error.response?.status;

      if(status === 400){
        toast.update(toastId, {
        type: "error",
        render: error.response?.data?.message,
        isLoading: false,
        autoClose: 2000,
      });

      }

      toast.update(toastId, {
        type: "error",
        render: error.response?.data?.message,
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const renderModalContent = () => {
    const titleMap = {
      Contact: 'Detil Kontak',
      Rekening: 'Detil Rekening',
      Banner: 'Detil Banner',
    };

    const gradientClasses = {
      Contact: 'bg-gradient-to-r from-blue-600 to-blue-500',
      Rekening: 'bg-gradient-to-r from-blue-600 to-blue-500',
      Banner: 'bg-gradient-to-r from-blue-600 to-blue-500',
    };

    return (
      <>
        <div className={`w-full rounded-t-md ${gradientClasses[modalType]} p-5 text-white`}>
          <h2 className="text-xl font-semibold">{titleMap[modalType]}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {modalType === 'Contact' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  name="platform"
                  value={formData.contact.platform}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition appearance-none bg-white"
                >
                <option value="">Pilih platform...</option>
                {CONTACT_PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor</label>
                <input
                  type="text"
                  name="number"
                  value={formData.contact.number}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.contact.link}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </>
          )}

          {modalType === 'Rekening' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                <select
                  name="bankName"
                  value={formData.rekening.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition appearance-none bg-white"
                >
                  <option value="">Pilih bank...</option>
                  {BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.rekening.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500  outline-none transition"
                />
              </div>
            </>
          )}

          {modalType === "Banner" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Banner</label>
                <input
                  type="text"
                  name="title"
                  value={formData.banner.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Gambar Banner
                </label>

                <label
                  htmlFor="bannerUpload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  {formData.banner.imagePreview ? (
                    <img
                      src={formData.banner.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">Klik untuk memilih gambar</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="bannerUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerImage}
                  />
                </label>
              </div>
            </>
          )}

          <ModalButton
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-lg font-medium transition duration-200"
          >
            Simpan
          </ModalButton>
        </form>
      </>
    );
  };

  return (
    <div className="rounded-md bg-white p-4 md:p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Kontak</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Contact')}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium transition"
            >
              + Tambah
            </ModalButton>
          </div>
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            Belum ada data kontak
          </div>
        </div>

        {/* Rekening Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Rekening</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Rekening')}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700px-3 py-1.5 rounded-lg font-medium transition"
            >
              + Tambah
            </ModalButton>
          </div>
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            Belum ada data rekening
          </div>
        </div>

        {/* Banner Card (full width on mobile, col-span-2 on desktop) */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Banner</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Banner')}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium transition"
            >
              + Tambah
            </ModalButton>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Belum ada banner
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalBoxDisplayComponent isOpen={isModalOpen} onClose={handleCloseModal}>
        {renderModalContent()}
      </ModalBoxDisplayComponent>
    </div>
  );
}