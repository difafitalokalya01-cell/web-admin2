'use client';

import { useEffect, useState } from 'react';
import { 
  Upload, Phone, MessageCircle, Building2, ImageIcon, 
  X, Plus, Trash2, Power, PowerOff,
  GripVertical
} from 'lucide-react';
import axios from '@/app/lib/axios';
import ConfirmPopup from '@/app/components/modal/modalConfirm';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 ${styles[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <X size={18} />
      </button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, icon: Icon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="text-gray-600" size={24} />}
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

function SortableBannerItem({ banner, onDelete, getBannerImageUrl }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-lg overflow-hidden border-2 ${
        isDragging ? 'border-orange-400 shadow-2xl z-50' : 'border-gray-200'
      } group bg-white`}
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg cursor-grab active:cursor-grabbing z-10 transition-all"
        title="Drag untuk mengatur urutan"
      >
        <GripVertical size={20} className="text-gray-600" />
      </button>

      <img
        src={getBannerImageUrl(banner.imageUrl)}
        alt={banner.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = '/images/placeholder-banner.png';
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">{banner.title}</p>
            <p className="text-white/70 text-xs">Order: {banner.order}</p>
          </div>
          
          <button
            onClick={() => onDelete(banner)}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Hapus banner"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContentDisplay({ token }) {
  const [modals, setModals] = useState({
    whatsapp: false,
    telegram: false,
    rekening: false,
    banner: false
  });

  const [contacts, setContacts] = useState([]);
  const [rekenings, setRekenings] = useState([]);
  const [banners, setBanners] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [formData, setFormData] = useState({
    whatsapp: { number: '', link: '' },
    telegram: { number: '', link: '' },
    rekening: { bankName: '', accountNumber: '', accountHolder: '' },
    banner: { title: '', imageFile: null, imagePreview: '' },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [contactRes, rekeningRes, bannerRes] = await Promise.all([
        axios.get("/api/contact"),
        axios.get("/api/rekening"),
        axios.get("/api/banner"),
      ]);

      setContacts(Array.isArray(contactRes.data.data) ? contactRes.data.data : []);
      setRekenings(Array.isArray(rekeningRes.data.data) ? rekeningRes.data.data : []);
      setBanners(Array.isArray(bannerRes.data.data) ? bannerRes.data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Gagal memuat data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex((b) => b.id === active.id);
    const newIndex = banners.findIndex((b) => b.id === over.id);

    const newBanners = arrayMove(banners, oldIndex, newIndex);

    const updatedBanners = newBanners.map((banner, index) => ({
      ...banner,
      order: index
    }));

    setBanners(updatedBanners);

    await saveBannerOrder(updatedBanners);
  };

  const saveBannerOrder = async (reorderedBanners) => {
    setIsSavingOrder(true);
    try {
      const payload = reorderedBanners.map((banner) => ({
        id: banner.id,
        order: banner.order
      }));

      await axios.patch('/api/banner/reorder', {
        banners: payload
      });

      console.log('✅ Banner order saved');
      showToast('Urutan banner berhasil diupdate');

    } catch (error) {
      console.error('❌ Save order error:', error);
      showToast('Gagal menyimpan urutan banner', 'error');
      await fetchAllData();
    } finally {
      setIsSavingOrder(false);
    }
  };

  const openModal = (type) => {
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
    if (formData.banner.imagePreview) {
      URL.revokeObjectURL(formData.banner.imagePreview);
    }
    setFormData({
      whatsapp: { number: '', link: '' },
      telegram: { number: '', link: '' },
      rekening: { bankName: '', accountNumber: '', accountHolder: '' },
      banner: { title: '', imageFile: null, imagePreview: '' },
    });
  };

  const handleChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleBannerImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Ukuran file maksimal 5MB", "error");
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast("Format file harus JPG, PNG, atau WEBP", "error");
        return;
      }

      if (formData.banner.imagePreview) {
        URL.revokeObjectURL(formData.banner.imagePreview);
      }

      setFormData(prev => ({
        ...prev,
        banner: {
          ...prev.banner,
          imageFile: file,
          imagePreview: URL.createObjectURL(file),
        },
      }));
    }
  };

  const handleSubmit = async (type) => {
    try {
      switch (type) {
        case 'whatsapp': {
          if (!formData.whatsapp.number) {
            showToast("Nomor WhatsApp wajib diisi", "error");
            return;
          }
          await axios.post("/api/contact", {
            platform: 'WhatsApp',
            number: formData.whatsapp.number,
            link: formData.whatsapp.link
          });
          showToast("Kontak WhatsApp berhasil ditambahkan");
          break;
        }
        case 'telegram': {
          if (!formData.telegram.number) {
            showToast("Nomor Telegram wajib diisi", "error");
            return;
          }
          await axios.post("/api/contact", {
            platform: 'Telegram',
            number: formData.telegram.number,
            link: formData.telegram.link
          });
          showToast("Kontak Telegram berhasil ditambahkan");
          break;
        }
        case 'rekening': {
          if (!formData.rekening.bankName || !formData.rekening.accountNumber || !formData.rekening.accountHolder) {
            showToast("Semua field wajib diisi", "error");
            return;
          }
          await axios.post("/api/rekening", formData.rekening);
          showToast("Rekening berhasil ditambahkan");
          break;
        }
        case 'banner': {
          if (!formData.banner.title || !formData.banner.imageFile) {
            showToast("Judul dan gambar banner wajib diisi", "error");
            return;
          }
          
          const payload = new FormData();
          payload.append("title", formData.banner.title);
          payload.append("image", formData.banner.imageFile);
          
          await axios.post("/api/banner", payload, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 60000,
          });
          
          showToast("Banner berhasil ditambahkan");
          break;
        }
      }

      await fetchAllData();
      closeModal(type);
    } catch (error) {
      console.error("Submit error:", error);
      showToast(error.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  const handleToggleActive = async (type, id, currentStatus) => {
    try {
      await axios.patch(`/api/${type}/${id}/toggle-active`, {
        isActive: !currentStatus
      });
      await fetchAllData();
      showToast(`Status berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (error) {
      console.error("Toggle error:", error);
      showToast("Gagal mengubah status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;

    try {
      await axios.delete(`/api/${type}/${id}`);
      await fetchAllData();
      showToast("Data berhasil dihapus");
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete error:", error);
      showToast(error.response?.data?.message || "Gagal menghapus data", "error");
    }
  };

  const getBannerImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/placeholder-banner.png';
    return imageUrl;
  };

  const whatsappContacts = contacts.filter(c => c.platform === 'WhatsApp');
  const telegramContacts = contacts.filter(c => c.platform === 'Telegram');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Konten</h1>
          <p className="text-gray-600 mt-1">Kelola kontak, rekening, dan banner website</p>
        </div>

        {/* WhatsApp Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <Phone size={24} />
              <h2 className="text-lg font-semibold">WhatsApp</h2>
            </div>
            <button
              onClick={() => openModal('whatsapp')}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className="p-4">
            {whatsappContacts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Phone size={48} className="mx-auto mb-3 opacity-50" />
                <p>Belum ada kontak WhatsApp</p>
              </div>
            ) : (
              <div className="space-y-2">
                {whatsappContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      contact.isActive
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        contact.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        <Phone className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{contact.number}</p>
                          {contact.isActive && (
                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                              Aktif
                            </span>
                          )}
                        </div>
                        {contact.link && (
                          <p className="text-sm text-blue-600 truncate">{contact.link}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive('contact', contact.id, contact.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          contact.isActive
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {contact.isActive ? <PowerOff size={20} /> : <Power size={20} />}
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'contact', id: contact.id });
                          setConfirmOpen(true);
                        }}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Telegram Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <MessageCircle size={24} />
              <h2 className="text-lg font-semibold">Telegram</h2>
            </div>
            <button
              onClick={() => openModal('telegram')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className="p-4">
            {telegramContacts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
                <p>Belum ada kontak Telegram</p>
              </div>
            ) : (
              <div className="space-y-2">
                {telegramContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      contact.isActive
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        contact.isActive ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        <MessageCircle className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{contact.number}</p>
                          {contact.isActive && (
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                              Aktif
                            </span>
                          )}
                        </div>
                        {contact.link && (
                          <p className="text-sm text-blue-600 truncate">{contact.link}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive('contact', contact.id, contact.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          contact.isActive
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {contact.isActive ? <PowerOff size={20} /> : <Power size={20} />}
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'contact', id: contact.id });
                          setConfirmOpen(true);
                        }}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rekening Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <Building2 size={24} />
              <h2 className="text-lg font-semibold">Rekening Bank</h2>
            </div>
            <button
              onClick={() => openModal('rekening')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className="p-4">
            {rekenings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Building2 size={48} className="mx-auto mb-3 opacity-50" />
                <p>Belum ada rekening bank</p>
              </div>
            ) : (
              <div className="space-y-2">
                {rekenings.map((rekening) => (
                  <div
                    key={rekening.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      rekening.isActive
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        rekening.isActive ? 'bg-purple-500' : 'bg-gray-400'
                      }`}>
                        <Building2 className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{rekening.bankName}</p>
                          {rekening.isActive && (
                            <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{rekening.accountHolder}</p>
                        <p className="text-sm text-gray-500 font-mono">{rekening.accountNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive('rekening', rekening.id, rekening.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          rekening.isActive
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                      >
                        {rekening.isActive ? <PowerOff size={20} /> : <Power size={20} />}
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'rekening', id: rekening.id });
                          setConfirmOpen(true);
                        }}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Banner Section with Drag & Drop */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <ImageIcon size={24} />
              <div>
                <h2 className="text-lg font-semibold">Banner ({banners.length})</h2>
                <p className="text-xs text-white/80">Drag untuk mengatur urutan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isSavingOrder && (
                <span className="text-white text-sm flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              )}
              <button
                onClick={() => openModal('banner')}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Tambah
              </button>
            </div>
          </div>

          <div className="p-4">
            {banners.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                <p>Belum ada banner</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={banners.map(b => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {banners.map((banner) => (
                      <SortableBannerItem
                        key={banner.id}
                        banner={banner}
                        onDelete={(banner) => {
                          setDeleteTarget({ type: 'banner', id: banner.id });
                          setConfirmOpen(true);
                        }}
                        getBannerImageUrl={getBannerImageUrl}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
      <Modal
        isOpen={modals.whatsapp}
        onClose={() => closeModal('whatsapp')}
        title="Tambah WhatsApp"
        icon={Phone}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('whatsapp'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.whatsapp.number}
              onChange={(e) => handleChange('whatsapp', 'number', e.target.value)}
              placeholder="628123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link (Opsional)</label>
            <input
              type="url"
              value={formData.whatsapp.link}
              onChange={(e) => handleChange('whatsapp', 'link', e.target.value)}
              placeholder="https://wa.me/628123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Simpan
          </button>
        </form>
      </Modal>

      {/* Telegram Modal */}
      <Modal
        isOpen={modals.telegram}
        onClose={() => closeModal('telegram')}
        title="Tambah Telegram"
        icon={MessageCircle}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('telegram'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telegram <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.telegram.number}
              onChange={(e) => handleChange('telegram', 'number', e.target.value)}
              placeholder="628123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link (Opsional)</label>
            <input
              type="url"
              value={formData.telegram.link}
              onChange={(e) => handleChange('telegram', 'link', e.target.value)}
              placeholder="https://t.me/username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Simpan
          </button>
        </form>
      </Modal>

      {/* Rekening Modal */}
      <Modal
        isOpen={modals.rekening}
        onClose={() => closeModal('rekening')}
        title="Tambah Rekening"
        icon={Building2}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('rekening'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Bank <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.rekening.bankName}
              onChange={(e) => handleChange('rekening', 'bankName', e.target.value)}
              placeholder="BCA, Mandiri, BRI"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Pemilik Rekening <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.rekening.accountHolder}
              onChange={(e) => handleChange('rekening', 'accountHolder', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Rekening <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.rekening.accountNumber}
              onChange={(e) => handleChange('rekening', 'accountNumber', e.target.value)}
              placeholder="1234567890"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Simpan
          </button>
        </form>
      </Modal>

      {/* Banner Modal */}
      <Modal
        isOpen={modals.banner}
        onClose={() => closeModal('banner')}
        title="Tambah Banner"
        icon={ImageIcon}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('banner'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Banner <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.banner.title}
              onChange={(e) => handleChange('banner', 'title', e.target.value)}
              placeholder="Masukkan judul banner"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Gambar <span className="text-red-500">*</span>
            </label>
            <label
              htmlFor="bannerUpload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition overflow-hidden"
            >
              {formData.banner.imagePreview ? (
                <img
                  src={formData.banner.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Klik untuk memilih gambar</p>
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
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Simpan
          </button>
        </form>
      </Modal>

      {/* Confirm Delete */}
      {confirmOpen && (
        <ConfirmPopup
          isOpen={confirmOpen}
          message="Apakah Anda yakin ingin menghapus data ini?"
          onCancel={() => {
            setConfirmOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}