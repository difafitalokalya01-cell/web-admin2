'use client';

import ModalButton from './modal/modalButtonDisplay';
import ModalBoxDisplayComponent from './modal/modalBoxComponent';
import { useEffect, useState } from 'react';
import { Upload, Power } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from '@/app/lib/axios';
import { TrashIcon } from '@heroicons/react/24/outline';
import ConfirmPopup from '@/app/components/modal/modalConfirm';

export default function DisplayContent({ token }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [rekenings, setRekenings] = useState([]);
  const [banners, setBanners] = useState([]);
  const [rules, setRules] = useState([]);
  const [imagePreview, setImagePreview] = useState({ isOpen: false, imageUrl: '', title: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [toggleLoading, setToggleLoading] = useState({});

  const [formData, setFormData] = useState({
    contact: { platform: '', number: '', link: '' },
    rekening: { bankName: '', accountNumber: '', accountHolder: '' },
    banner: { title: '', image: '', imagePreview: '' },
    rules: { title: '', content: '', category: '', isActive: true }
  });

  const CONTACT_PLATFORMS = ['WhatsApp', 'Telegram'];
  const BANKS = ['BCA', 'BRI', 'BNI', 'Mandiri', 'CIMB Niaga', 'BSI', 'Permata', 'Danamon', 'Lainnya'];

  const fetchAllData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const [contactRes, rekeningRes, bannerRes, rulesRes] = await Promise.all([
        axios.get("/api/contact", config),
        axios.get("/api/rekening", config),
        axios.get("/api/banner", config),
        // axios.get("/api/rules", config),
      ]);

      setContacts(contactRes.data.data || []);
      setRekenings(rekeningRes.data.data || []);
      setBanners(bannerRes.data.data || []);
      setRules(rulesRes.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error.response?.data || error);
      toast.error("Gagal memuat data");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ✅ FITUR BARU: Toggle Active Status
  const handleToggleActive = async (type, id, currentStatus, itemName = '') => {
    /*
      🔴 DIPERLUKAN ENDPOINT API BARU (UNCOMMENT SAAT SUDAH ADA):
      
      CONTACT:   PUT /api/contact/:id/active       { is_active: boolean }
      REKENING:  PUT /api/rekening/:id/set-active  (tanpa body, auto nonaktifkan lainnya)
      BANNER:    PUT /api/banner/:id/active        { is_active: boolean }
      RULES:     PUT /api/rules/:id/active         { isActive: boolean }
    */
    
    setToggleLoading(prev => ({ ...prev, [`${type}-${id}`]: true }));
    
    try {
      // TODO: Uncomment saat endpoint API sudah tersedia
      /*
      let endpoint = '';
      let payload = {};
      
      switch(type) {
        case 'contact':
          endpoint = `/api/contact/${id}/active`;
          payload = { is_active: !currentStatus };
          break;
        case 'rekening':
          endpoint = `/api/rekening/${id}/set-active`;
          break;
        case 'banner':
          endpoint = `/api/banner/${id}/active`;
          payload = { is_active: !currentStatus };
          break;
        case 'rules':
          endpoint = `/api/rules/${id}/active`;
          payload = { isActive: !currentStatus };
          break;
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      
      if (type === 'rekening') {
        await axios.put(endpoint, {}, config);
      } else {
        await axios.put(endpoint, payload, config);
      }
      
      await fetchAllData();
      */
      
      // ✅ SIMULASI (HAPUS SAAT API SUDAH SIAP)
      setTimeout(() => {
        toast.success(`Status "${itemName}" berhasil di${!currentStatus ? 'aktifkan' : 'nonaktifkan'}`);
        
        switch(type) {
          case 'contact':
            setContacts(prev => prev.map(c => 
              c.id === id ? { ...c, is_active: !currentStatus } : c
            ));
            break;
          case 'rekening':
            setRekenings(prev => prev.map(r => 
              ({ ...r, is_active: r.id === id })
            ));
            break;
          case 'banner':
            setBanners(prev => prev.map(b => 
              b.id === id ? { ...b, is_active: !currentStatus } : b
            ));
            break;
          case 'rules':
            setRules(prev => prev.map(r => 
              r.id === id ? { ...r, isActive: !currentStatus } : r
            ));
            break;
        }
      }, 300);
      
    } catch (error) {
      console.error("Toggle active gagal:", error);
      toast.error(`Gagal mengubah status ${type}`);
    } finally {
      setToggleLoading(prev => ({ ...prev, [`${type}-${id}`]: false }));
    }
  };

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
    const { name, value, type, checked } = e.target;
    const [parent, child] = name.split(".");
    
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleBannerImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        banner: {
          ...prev.banner,
          image: file,
          imagePreview: URL.createObjectURL(file),
        },
      }));
    }
  };

  const openImagePreview = (imageUrl, title) => {
    setImagePreview({ isOpen: true, imageUrl, title });
  };

  const closeImagePreview = () => {
    setImagePreview({ isOpen: false, imageUrl: '', title: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");

    try {
      switch (modalType) {
        case "Banner": {
          const payload = new FormData();
          payload.append("title", formData.banner.title);
          if (formData.banner.image) {
            payload.append("image", formData.banner.image);
          }
          await axios.post("/api/banner", payload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          break;
        }
        case "Contact": {
          await axios.post("/api/contact", formData.contact, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          break;
        }
        case "Rekening": {
          await axios.post("/api/rekening", formData.rekening, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          break;
        }
        case "Rules": {
          await axios.post("/api/rules", formData.rules, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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
      Rules: 'Detil Rules',
    };

    const gradientClasses = {
      Contact: 'bg-gradient-to-r from-blue-600 to-blue-500',
      Rekening: 'bg-gradient-to-r from-blue-600 to-blue-500',
      Banner: 'bg-gradient-to-r from-blue-600 to-blue-500',
      Rules: 'bg-gradient-to-r from-blue-600 to-blue-500',
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
                  name="contact.platform"
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
                  name="contact.number"
                  value={formData.contact.number}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  name="contact.link"
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
                  name="rekening.bankName"
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
                  name="rekening.accountNumber"
                  value={formData.rekening.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  name="rekening.accountHolder"
                  value={formData.rekening.accountHolder}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
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
                  name="banner.title"
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

          {modalType === 'Rules' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Rules
                </label>
                <input
                  type="text"
                  name="rules.title"
                  value={formData.rules.title}
                  onChange={handleChange}
                  placeholder="Masukkan judul rules..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konten Rules
                </label>
                <textarea
                  name="rules.content"
                  value={formData.rules.content}
                  onChange={handleChange}
                  rows="8"
                  placeholder="Tulis rules/panduan lengkap di sini..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Gunakan format yang jelas dan mudah dipahami oleh user
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Rules
                </label>
                <select
                  name="rules.category"
                  value={formData.rules.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition appearance-none bg-white"
                >
                  <option value="">Pilih kategori...</option>
                  <option value="general">General Rules</option>
                  <option value="payment">Payment Rules</option>
                  <option value="delivery">Delivery Rules</option>
                  <option value="return">Return & Refund Rules</option>
                  <option value="privacy">Privacy Policy</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="rules.isActive"
                    checked={formData.rules.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Aktifkan Rules ini
                  </span>
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
      } else if (type === "rules") {
        await axios.delete(`/api/rules/${id}`);
      }

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

  const getIsActive = (item, type) => {
    if (type === 'rules') return item.isActive ?? false;
    return item.is_active ?? false;
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
              {contacts.map((c) => {
                const isActive = getIsActive(c, 'contact');
                const isLoading = toggleLoading[`contact-${c.id}`];
                return (
                  <div
                    key={c.id}
                    className="relative border border-gray-200 p-3 rounded-lg bg-gray-50 space-y-1"
                  >
                    <div className={`absolute top-2 left-2 flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      isActive 
                        ? 'bg-green-100 text-green-800 ring-1 ring-green-200' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                    
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleToggleActive('contact', c.id, isActive, `${c.platform}: ${c.number}`);
                      }}
                      disabled={isLoading}
                      className={`absolute top-2 right-10 p-1.5 rounded-md transition ${
                        isLoading 
                          ? 'bg-gray-200 cursor-wait' 
                          : isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                      title={isActive ? "Nonaktifkan kontak ini" : "Aktifkan kontak ini"}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </button>
                    
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
                );
              })}
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
              {rekenings.map((r) => {
                const isActive = getIsActive(r, 'rekening');
                const isLoading = toggleLoading[`rekening-${r.id}`];
                return (
                  <div
                    key={r.id}
                    className="relative border border-gray-200 p-3 rounded-lg bg-gray-50 space-y-1"
                  >
                    <div className={`absolute top-2 left-2 flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      isActive 
                        ? 'bg-green-100 text-green-800 ring-1 ring-green-200' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      <span>{isActive ? 'Digunakan' : 'Tidak Digunakan'}</span>
                    </div>
                    
                    {!isActive && (
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleToggleActive('rekening', r.id, isActive, `${r.bankName} - ${r.accountNumber}`);
                        }}
                        disabled={isLoading}
                        className={`absolute top-2 right-10 px-2 py-1 text-xs font-medium rounded-md transition ${
                          isLoading 
                            ? 'bg-gray-200 cursor-wait' 
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                        }`}
                        title="Set sebagai rekening utama"
                      >
                        {isLoading ? 'Memproses...' : 'Jadikan Utama'}
                      </button>
                    )}
                    
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
                    <div>
                      <span className="text-xs text-gray-500">Nama Pemilik Rekening:</span>
                      <p className="text-sm text-gray-700">{r.accountHolder}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BANNER CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Belum ada banner
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-4 gap-4">
              {banners.map((b) => {
                const isActive = getIsActive(b, 'banner');
                const isLoading = toggleLoading[`banner-${b.id}`];
                return (
                  <div
                    key={b.id}
                    className="relative group bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {isActive && (
                      <div className="absolute bottom-2 left-2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        <span>Aktif</span>
                      </div>
                    )}
                    
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleToggleActive('banner', b.id, isActive, b.title);
                      }}
                      disabled={isLoading}
                      className={`absolute top-2 right-10 z-10 p-1.5 rounded-md transition-opacity ${
                        isLoading 
                          ? 'bg-gray-300 cursor-wait' 
                          : isActive 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-blue-500 text-white hover:bg-blue-600 opacity-0 group-hover:opacity-100'
                      }`}
                      title={isActive ? "Nonaktifkan banner" : "Aktifkan banner"}
                    >
                      {isLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Power className="w-3.5 h-3.5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => openConfirm("banner", b.id, "banner")}
                      className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>

                    <div
                      className="cursor-pointer"
                      onClick={() => openImagePreview(getBannerImageUrl(b.imageUrl), b.title)}
                    >
                      <img
                        src={getBannerImageUrl(b.imageUrl)}
                        alt={b.title}
                        className={`w-full h-32 object-cover transition-opacity ${
                          isActive ? 'border-l-4 border-green-500' : ''
                        }`}
                        onError={(e) => (e.currentTarget.src = '/images/placeholder-banner.png')}
                      />
                    </div>

                    <div className="p-2 bg-gray-50">
                      <p className="text-xs font-medium text-gray-700 truncate" title={b.title}>
                        {b.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RULES CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-l from-blue-400 to-blue-200 flex items-center justify-between p-4">
            <h3 className="font-semibold text-gray-800">Rules & Panduan</h3>
            <ModalButton
              type="button"
              onClick={() => handleOpenModal('Rules')}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg"
            >
              + Tambah
            </ModalButton>
          </div>
          {rules.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              Belum ada rules
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {rules.map((rule) => {
                const isActive = getIsActive(rule, 'rules');
                const isLoading = toggleLoading[`rules-${rule.id}`];
                return (
                  <div key={rule.id} className="relative border border-gray-200 p-4 rounded-lg bg-gray-50">
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleToggleActive('rules', rule.id, isActive, rule.title);
                      }}
                      disabled={isLoading}
                      className={`absolute top-2 right-10 p-1.5 rounded-md transition ${
                        isLoading 
                          ? 'bg-gray-200 cursor-wait' 
                          : isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                      title={isActive ? "Nonaktifkan rules ini" : "Aktifkan rules ini"}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => openConfirm("rules", rule.id, "rules")}
                      className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-md hover:bg-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">Judul:</span>
                        <p className="text-sm font-semibold text-gray-800">{rule.title}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Kategori:</span>
                        <p className="text-sm text-gray-700 capitalize">{rule.category}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Konten:</span>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{rule.content}</p>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isActive 
                            ? 'bg-green-100 text-green-700 ring-1 ring-green-200' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          (Hanya 1 per kategori)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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

      {imagePreview.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closeImagePreview}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">{imagePreview.title}</h3>
              <button
                onClick={closeImagePreview}
                className="text-white hover:text-gray-200 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 flex items-center justify-center bg-gray-100">
              <img
                src={imagePreview.imageUrl}
                alt={imagePreview.title}
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            </div>
            
            <div className="p-4 bg-gray-50 text-center">
              <button
                onClick={closeImagePreview}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}