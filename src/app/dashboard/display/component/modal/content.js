"use client";
import { useState } from "react";
import {
  PlusCircle,
  Phone,
  MessageCircle,
  CreditCard,
  Image as ImageIcon,
  Upload,
  FileText,
} from "lucide-react";

export default function ContentDisplayPage() {
  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});

  const handleAdd = (type) => {
    setFormType(type);
    setFormData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType === "contact") setContacts([...contacts, formData]);
    else if (formType === "account") setAccounts([...accounts, formData]);
    else if (formType === "banner") setBanners([...banners, formData]);

    setFormType(null);
    setFormData({});
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Format tidak valid! Harus .jpg atau .png");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        url: reader.result,
        filename: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-6 space-y-6">
      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Informasi Website
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAdd("contact")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all text-sm font-medium"
          >
            <PlusCircle size={16} /> Tambah Kontak
          </button>
          <button
            onClick={() => handleAdd("account")}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-all text-sm font-medium"
          >
            <PlusCircle size={16} /> Tambah Rekening
          </button>
          <button
            onClick={() => handleAdd("banner")}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-2 transition-all text-sm font-medium"
          >
            <PlusCircle size={16} /> Tambah Banner
          </button>
        </div>
      </div>

      {/* 🔹 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CONTACT BOX */}
        <CardBox title="Kontak" icon={<Phone className="text-blue-500" />}>
          {contacts.length === 0 ? (
            <EmptyText text="Belum ada data kontak" />
          ) : (
            <ul className="space-y-2">
              {contacts.map((c, i) => (
                <li
                  key={i}
                  className="bg-white border rounded-md p-3 flex items-center gap-3"
                >
                  {c.platform === "whatsapp" && (
                    <MessageCircle className="text-green-500" size={18} />
                  )}
                  {c.platform === "telegram" && (
                    <MessageCircle className="text-blue-500" size={18} />
                  )}
                  <span className="text-sm font-medium">{c.number}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBox>

        {/* ACCOUNT BOX */}
        <CardBox title="Nomor Rekening" icon={<CreditCard className="text-green-500" />}>
          {accounts.length === 0 ? (
            <EmptyText text="Belum ada data rekening" />
          ) : (
            <ul className="space-y-2">
              {accounts.map((a, i) => (
                <li key={i} className="bg-white border rounded-md p-3">
                  <p className="text-sm font-semibold">{a.bank}</p>
                  <p className="text-xs text-gray-600">{a.number}</p>
                </li>
              ))}
            </ul>
          )}
        </CardBox>

        {/* BANNER BOX */}
        <CardBox
          title="Banner"
          icon={<ImageIcon className="text-yellow-500" />}
          fullWidth
        >
          {banners.length === 0 ? (
            <EmptyText text="Belum ada banner" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {banners.map((b, i) => (
                <div
                  key={i}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <img
                    src={b.url}
                    alt={b.caption}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-2 text-center text-xs text-gray-700">
                    <p className="font-semibold truncate">{b.filename}</p>
                    <p className="text-gray-500">{b.caption || "Tanpa keterangan"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBox>
      </div>

      {/* 🔹 Form Modal */}
      {formType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 capitalize flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              Tambah {formType}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formType === "contact" && (
                <>
                  <select
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    required
                  >
                    <option value="">Pilih Platform</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Nomor HP"
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    required
                  />
                </>
              )}

              {formType === "account" && (
                <>
                  <input
                    type="text"
                    placeholder="Nama Bank"
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, bank: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Nomor Rekening"
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    required
                  />
                </>
              )}

              {formType === "banner" && (
                <>
                  <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center hover:bg-gray-50 transition-all">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 mb-1">
                      Pilih file banner (JPG atau PNG)
                    </p>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleBannerUpload}
                      className="w-full text-sm text-gray-700"
                      required
                    />
                  </div>
                  {formData.url && (
                    <div className="mt-3 flex flex-col items-center">
                      <img
                        src={formData.url}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded-md border"
                      />
                      <p className="text-xs text-gray-600 mt-1">{formData.filename}</p>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Keterangan (opsional)"
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, caption: e.target.value })
                    }
                  />
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setFormType(null)}
                  className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🔸 Komponen Kecil Reusable */
function CardBox({ title, icon, children, fullWidth }) {
  return (
    <div
      className={`${
        fullWidth ? "col-span-2" : ""
      } w-full min-h-72 bg-gray-50 border border-gray-200 rounded-md shadow-inner p-4 overflow-auto`}
    >
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function EmptyText({ text }) {
  return (
    <p className="text-gray-500 text-sm italic flex items-center gap-2">
      <span>•</span> {text}
    </p>
  );
}
