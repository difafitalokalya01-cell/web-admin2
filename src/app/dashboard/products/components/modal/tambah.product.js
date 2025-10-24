import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import axios from "@/app/lib/axios";

export function AddProductModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    storeLocation: "",
    imageFile: null, 
    imagePreview: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file, 
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Mengunggah...");

    try {
      if (!formData.name || !formData.price || !formData.storeLocation) {
        toast.update(toastId, {
          render: "Nama, harga, dan lokasi toko wajib diisi",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        return;
      }

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("description", formData.description || "");
      payload.append("storeLocation", formData.storeLocation);
      if (formData.imageFile) {
        payload.append("image", formData.imageFile);
      }

      await onSubmit(payload);

      setFormData({
        name: "",
        price: "",
        description: "",
        storeLocation: "",
        imageFile: null,
        imagePreview: null,
      });
      onClose();

      toast.update(toastId, {
        render: "Produk berhasil ditambahkan",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

    } catch (err) {
      console.error("Upload error:", err);
      toast.update(toastId, {
        render: err.response?.data?.message || "Gagal upload produk",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 className="text-xl font-bold">Tambah Produk Baru</h2>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/30 text-white hover:bg-white/50 transition"
          aria-label="Tutup"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Contoh: Baju Kaos Polos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga (Rp) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Contoh: 50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokasi Toko *
            </label>
            <input
              type="text"
              name="storeLocation"
              value={formData.storeLocation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Contoh: Jakarta Pusat"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Deskripsi produk..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Produk
            </label>

            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">
                    Klik untuk memilih gambar
                  </p>
                </div>
              )}
              <input
                type="file"
                id="imageUpload"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
