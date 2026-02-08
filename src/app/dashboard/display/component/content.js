'use client';

import ModalButton from './modal/modalButtonDisplay';
import ModalBoxDisplayComponent from './modal/modalBoxComponent';
import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import axios from '@/app/lib/axios';
import { TrashIcon } from '@heroicons/react/24/outline';
import ConfirmPopup from '@/app/components/modal/modalConfirm';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

export default function DisplayContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [rekenings, setRekenings] = useState([]);
  const [banners, setBanners] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const [formData, setFormData] = useState({
    contact: { platform: '', number: '', link: '' },
    rekening: { bankName: '', accountNumber: '', accountHolder: '' },
    banner: { title: '', imageFile: null, imagePreview: '' },
  });

  const CONTACT_PLATFORMS = ['WhatsApp', 'Telegram'];

  const fetchAllData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [contactRes, rekeningRes, bannerRes] = await Promise.all([
        axios.get("/api/contact"),
        axios.get("/api/rekening"),
        axios.get("/api/banner"),
      ]);

      setContacts(Array.isArray(contactRes.data.data) ? contactRes.data.data : []);
      setRekenings(Array.isArray(rekeningRes.data.data) ? rekeningRes.data.data : []);
      setBanners(Array.isArray(bannerRes.data.data) ? bannerRes.data.data : []);

      console.log('Data loaded:', {
        contacts: contactRes.data.data?.length || 0,
        rekenings: rekeningRes.data.data?.length || 0,
        banners: bannerRes.data.data?.length || 0
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      const msg = error.response?.data?.message || "Gagal memuat data. Silakan coba lagi.";
      setErrorMessage(msg);
      
      setContacts([]);
      setRekenings([]);
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setIsModalOpen(false);
    
    if (formData.banner.imagePreview) {
      URL.revokeObjectURL(formData.banner.imagePreview);
    }

    setFormData({
      contact: { platform: '', number: '', link: '' },
      rekening: { bankName: '', accountNumber: '', accountHolder: '' },
      banner: { title: '', imageFile: null, imagePreview: '' },
    });
    setErrorMessage(null);
    setSuccessMessage(null);
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
    // Clear error when user types
    setErrorMessage(null);
  };

  const handleBannerImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrorMessage("Ukuran file maksimal 5MB");
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Format file harus JPG, PNG, atau WEBP");
        return;
      }

      if (formData.banner.imagePreview) {
        URL.revokeObjectURL(formData.banner.imagePreview);
      }

      setFormData((prev) => ({
        ...prev,
        banner: {
          ...prev.banner,
          imageFile: file,
          imagePreview: URL.createObjectURL(file),
        },
      }));
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modalType === 'Contact') {
      if (!formData.contact.platform || !formData.contact.number) {
        setErrorMessage("Platform dan nomor wajib diisi");
        return;
      }
    } else if (modalType === 'Rekening') {
      if (!formData.rekening.bankName || !formData.rekening.accountNumber || !formData.rekening.accountHolder) {
        setErrorMessage("Semua field wajib diisi");
        return;
      }
    } else if (modalType === 'Banner') {
      if (!formData.banner.title || !formData.banner.imageFile) {
        setErrorMessage("Judul dan gambar banner wajib diisi");
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      switch (modalType) {
        case "Banner": {
          const payload = new FormData();
          payload.append("title", formData.banner.title);
          payload.append("image", formData.banner.imageFile);
          
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

      setSuccessMessage(`Berhasil menambahkan ${modalType.toLowerCase()}`);
      
      // Auto close modal after success
      setTimeout(() => {
        handleCloseModal();
      }, 1500);

    } catch (error) {
      console.error("Submit error:", error);
      const msg = error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (type, id, currentStatus) => {
    setToggleLoading(id);
    setErrorMessage(null);
    
    try {
      await axios.patch(`/api/${type}/${id}/toggle-active`, {
        isActive: !currentStatus
      });

      await fetchAllData();
      
      // Show success indicator
      const successMsg = `Status berhasil diubah menjadi ${!currentStatus ? 'aktif' : 'nonaktif'}`;
      setSuccessMessage(successMsg);

    } catch (error) {
      console.error("Toggle error:", error);
      const msg = error.response?.data?.message || "Gagal mengubah status";
      setErrorMessage(msg);
    } finally {
      setToggleLoading(null);
    }
  };

  const renderModalContent = () => {
    const titleMap = {
      Contact: 'Tambah Kontak',
      Rekening: 'Tambah Rekening',
      Banner: 'Tambah Banner',
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
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <XCircleIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}

          {modalType === 'Contact' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform <span className="text-red-500">*</span>
                </label>
                <select
                  name="platform"
                  value={formData.contact.platform}
                  onChange={handleChange}
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="number"
                  value={formData.contact.number}
                  onChange={handleChange}
                  required
                  placeholder="contoh: 628123456789"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="url"
                  name="link"
                  value={formData.contact.link}
                  onChange={handleChange}
                  placeholder="https://wa.me/628123456789"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </>
          )}

          {modalType === 'Rekening' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bank <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.rekening.bankName}
                  onChange={handleChange}
                  required
                  placeholder="contoh: BCA, Mandiri, BRI"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemilik Rekening <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.rekening.accountHolder}
                  onChange={handleChange}
                  required
                  placeholder="contoh: John Doe"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Rekening <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.rekening.accountNumber}
                  onChange={handleChange}
                  required
                  placeholder="1234567890"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </>
          )}

          {modalType === "Banner" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Banner <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.banner.title}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan judul banner"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Gambar Banner <span className="text-red-500">*</span>
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
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="bannerUpload"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleBannerImage}
                  />
                </label>
              </div>
            </>
          )}

          <ModalButton
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-lg font-medium transition duration-200 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Menyimpan...
              </span>
            ) : (
              'Simpan'
            )}
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
    setDeleteLoading(true);

    try {
      await axios.delete(`/api/${type}/${id}`);
      await fetchAllData();

      setSuccessMessage("Data berhasil dihapus");
      
      // Close confirm and clear
      setTimeout(() => {
        closeConfirm();
      }, 1500);

    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.message || "Gagal menghapus data. Silakan coba lagi.";
      setErrorMessage(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getBannerImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/placeholder-banner.png';
    if (imageUrl.startsWith('http')) return imageUrl;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${cleanPath}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-md bg-white p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Grouping contacts by platform
  const whatsappContacts = contacts.filter(c => c.platform === 'WhatsApp');
  const telegramContacts = contacts.filter(c => c.platform === 'Telegram');

  return (
    <div className="rounded-md bg-white p-4 md:p-6 shadow-sm">
      {/* Global Messages */}
      {errorMessage && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
          <XCircleIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* WHATSAPP CONTACT CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-green-400 to-green-200 flex items-center justify-between p-4">
            <h3 className="font-semibold text-gray-800">WhatsApp</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Contact')}
              className="text-sm bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg transition"
            >
              + Tambah
            </ModalButton>
          </div>

          {whatsappContacts.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <InformationCircleIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada kontak WhatsApp</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
              {whatsappContacts.map((c) => (
                <div
                  key={c.id}
                  className={`relative border p-3 rounded-lg space-y-2 ${
                    c.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {c.isActive && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => openConfirm("contact", c.id, "kontak WhatsApp")}
                      className="text-white bg-red-500 p-1.5 rounded-md hover:bg-red-700 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">Nomor:</span>
                    <p className="text-sm text-gray-700 font-medium">{c.number}</p>
                  </div>
                  
                  {c.link && (
                    <div>
                      <span className="text-xs text-gray-500">Link:</span>
                      <p className="text-sm text-blue-600 underline break-all">{c.link}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleToggleActive('contact', c.id, c.isActive)}
                    disabled={toggleLoading === c.id}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                      toggleLoading === c.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : c.isActive
                        ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {toggleLoading === c.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Memproses...
                      </span>
                    ) : c.isActive ? (
                      'Nonaktifkan'
                    ) : (
                      'Aktifkan'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TELEGRAM CONTACT CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-blue-400 to-blue-200 flex items-center justify-between p-4">
            <h3 className="font-semibold text-gray-800">Telegram</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Contact')}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
            >
              + Tambah
            </ModalButton>
          </div>

          {telegramContacts.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <InformationCircleIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada kontak Telegram</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
              {telegramContacts.map((c) => (
                <div
                  key={c.id}
                  className={`relative border p-3 rounded-lg space-y-2 ${
                    c.isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {c.isActive && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => openConfirm("contact", c.id, "kontak Telegram")}
                      className="text-white bg-red-500 p-1.5 rounded-md hover:bg-red-700 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">Nomor:</span>
                    <p className="text-sm text-gray-700 font-medium">{c.number}</p>
                  </div>
                  
                  {c.link && (
                    <div>
                      <span className="text-xs text-gray-500">Link:</span>
                      <p className="text-sm text-blue-600 underline break-all">{c.link}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleToggleActive('contact', c.id, c.isActive)}
                    disabled={toggleLoading === c.id}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                      toggleLoading === c.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : c.isActive
                        ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {toggleLoading === c.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Memproses...
                      </span>
                    ) : c.isActive ? (
                      'Nonaktifkan'
                    ) : (
                      'Aktifkan'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* REKENING CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-purple-400 to-purple-200 flex items-center justify-between p-4">
            <h3 className="font-semibold text-gray-800">Rekening Bank</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Rekening')}
              className="text-sm bg-purple-600 text-white hover:bg-purple-700 px-3 py-1.5 rounded-lg transition"
            >
              + Tambah
            </ModalButton>
          </div>

          {rekenings.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <InformationCircleIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada data rekening</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
              {rekenings.map((r) => (
                <div
                  key={r.id}
                  className={`relative border p-3 rounded-lg space-y-2 ${
                    r.isActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {r.isActive && (
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => openConfirm("rekening", r.id, "rekening")}
                      className="text-white bg-red-500 p-1.5 rounded-md hover:bg-red-700 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Nama Bank:</span>
                    <p className="text-sm font-semibold text-gray-800">{r.bankName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Nama Pemilik:</span>
                    <p className="text-sm text-gray-700">{r.accountHolder}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Nomor Rekening:</span>
                    <p className="text-sm text-gray-700 font-mono">{r.accountNumber}</p>
                  </div>

                  <button
                    onClick={() => handleToggleActive('rekening', r.id, r.isActive)}
                    disabled={toggleLoading === r.id}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                      toggleLoading === r.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : r.isActive
                        ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {toggleLoading === r.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Memproses...
                      </span>
                    ) : r.isActive ? (
                      'Nonaktifkan'
                    ) : (
                      'Aktifkan'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BANNER CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-orange-400 to-orange-200 flex items-center justify-between p-4">
            <h3 className="font-semibold text-gray-800">Banner</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Banner')}
              className="text-sm bg-orange-600 text-white hover:bg-orange-700 px-3 py-1.5 rounded-lg transition"
            >
              + Tambah
            </ModalButton>
          </div>

          {banners.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <InformationCircleIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada banner</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="relative border border-gray-200 p-3 rounded-lg bg-gray-50 space-y-1"
                >
                  <button
                    onClick={() => openConfirm("banner", b.id, "banner")}
                    className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-md hover:bg-red-700 cursor-pointer z-10 transition"
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
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-banner.png';
                      }}
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
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
}