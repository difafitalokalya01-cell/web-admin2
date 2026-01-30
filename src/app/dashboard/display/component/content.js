'use client';

import ModalButton from './modal/modalButtonDisplay';
import ModalBoxDisplayComponent from './modal/modalBoxComponent';
import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from '@/app/lib/axios';
import { TrashIcon } from '@heroicons/react/24/outline';
import ConfirmPopup from '@/app/components/modal/modalConfirm';

export default function DisplayContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [rekenings, setRekenings] = useState([]);
  const [banners, setBanners] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const [formData, setFormData] = useState({
    contact: { platform: '', number: '', link: '' },
    rekening: { bankName: '', accountNumber: '' },
    banner: { title: '', image: '' },
  });

  const CONTACT_PLATFORMS = ['WhatsApp', 'Telegram'];
  const BANKS = ['BCA', 'BRI', 'BNI', 'Mandiri', 'CIMB Niaga', 'BSI', 'Permata', 'Danamon', 'Lainnya'];

  const fetchAllData = async () => {
    try {
      const [contactRes, rekeningRes, bannerRes] = await Promise.all([
        axios.get("/api/contact"),
        axios.get("/api/rekening"),
        axios.get("/api/banner"),
      ]);
      setContacts(contactRes.data.data || []);
      setRekenings(rekeningRes.data.data || []);
      setBanners(bannerRes.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil ", error);
      toast.error("Gagal memuat data");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setIsModalOpen(false);
    if (formData.banner.imagePreview) {
      URL.revokeObjectURL(formData.banner.imagePreview);
      setFormData((prev) => ({ ...prev, banner: { ...prev.banner, imagePreview: '' } }));
    }
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
          break;
        }
        case "Contact": {
          await axios.post("/api/contact", formData.contact);
          break;
        }
        case "Rekening": {
          await axios.post("/api/rekening", formData.rekening);
          break;
        }
      }

      await fetchAllData();

      toast.update(toastId, {
        type: "success",
        render: `Berhasil update data ${modalType.toLowerCase()}`,
        isLoading: false,
        autoClose: 2000,
      });

      handleCloseModal();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Terjadi kesalahan";
      toast.update(toastId, {
        type: "error",
        render: msg,
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
            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-lg font-medium transition duration-200"
          >
            Simpan
          </ModalButton>
        </form>
      </>
    );
  };

  const openConfirm = (type, id, label) => {
    setDeleteTarget({ type, id });
    setConfirmMessage(`Hapus ${label} ini?`);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    const toastId = toast.loading("Menghapus...");

    try {
      if (type === "contact") {
        await axios.delete(`/api/contact/${id}`);
      } else if (type === "rekening") {
        await axios.delete(`/api/rekening/${id}`);
      } else if (type === "banner") {
        await axios.delete(`/api/banner/${id}`);
      }

      // ✅ Perbarui data setelah hapus
      await fetchAllData();

      toast.update(toastId, {
        type: "success",
        render: "Data berhasil dihapus",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        type: "error",
        render: "Gagal menghapus data",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      closeConfirm();
    }
  };

const getBannerImageUrl = (imageUrl) => {
  if (!imageUrl) return '/images/placeholder-banner.png';
  if (imageUrl.startsWith('http')) return imageUrl;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${cleanPath}`;
};

  return (
    <div className="rounded-md bg-white p-4 md:p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CONTACT CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-blue-400 to-blue-200 flex items-center justify-between p-4 border-gray-100">
            <h3 className="font-semibold text-gray-800">Kontak</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Contact')}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg"
            >
              + Tambah
            </ModalButton>
          </div>

          {contacts.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Belum ada data kontak
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="relative border border-gray-200 p-3 rounded-lg bg-gray-50 space-y-1"
                >
                  <button
                    onClick={() => openConfirm("contact", c.id, "kontak")}
                    className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <div>
                    <span className="text-xs text-gray-500">Platform:</span>
                    <p className="text-sm font-semibold text-gray-800">{c.platform}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Nomor:</span>
                    <p className="text-sm text-gray-700">{c.number}</p>
                  </div>
                  {c.link && (
                    <div>
                      <span className="text-xs text-gray-500">Link:</span>
                      <p className="text-sm text-blue-600 underline break-all">{c.link}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* REKENING CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-blue-400 to-blue-200 flex items-center justify-between p-4 border-gray-100">
            <h3 className="font-semibold text-gray-800">Rekening</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Rekening')}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg"
            >
              + Tambah
            </ModalButton>
          </div>

          {rekenings.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Belum ada data rekening
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
              {rekenings.map((r) => (
                <div
                  key={r.id}
                  className="relative border border-gray-200 p-3 rounded-lg bg-gray-50 space-y-1"
                >
                  <button
                    onClick={() => openConfirm("rekening", r.id, "rekening")}
                    className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <div>
                    <span className="text-xs text-gray-500">Nama Bank:</span>
                    <p className="text-sm font-semibold text-gray-800">{r.bankName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Nomor Rekening:</span>
                    <p className="text-sm text-gray-700">{r.accountNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BANNER CARD */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-blue-400 to-blue-200 flex items-center justify-between p-4 border-gray-100">
            <h3 className="font-semibold text-gray-800">Banner</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Banner')}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg"
            >
              + Tambah
            </ModalButton>
          </div>

          {banners.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              Belum ada banner
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-100 overflow-y-auto">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="relative border border-gray-200 p-3 rounded-lg bg-gray-50 space-y-1"
                >
                  <button
                    onClick={() => openConfirm("banner", b.id, "banner")}
                    className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <div>
                    <span className="text-xs text-gray-500">Judul:</span>
                    <p className="text-sm font-semibold">{b.title}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Banner:</span>
                    <img
                      src={getBannerImageUrl(b.imageUrl)}
                      alt={b.title}
                      className="w-full h-40 object-cover rounded mt-1"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalBoxDisplayComponent isOpen={isModalOpen} onClose={handleCloseModal}>
        {renderModalContent()}
      </ModalBoxDisplayComponent>

      {confirmOpen && (
        <ConfirmPopup
          isOpen={confirmOpen}
          message={confirmMessage}
          onCancel={closeConfirm}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}