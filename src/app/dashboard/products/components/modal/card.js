"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import ConfirmPopup from "@/app/components/modal/modalConfirm";
import { useState } from "react";
import axios from "@/app/lib/axios";
import { toast } from "react-toastify";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductCard({ product }) {
  const [productToDelete, setProductToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(null);

  const imageUrl = product?.imageUrl
    ? `${BASE_URL}/uploads${product.imageUrl}`
    : null;


  const handleDelete = (product) => {
    console.log(product);
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteById = async () => {

    const toastId = toast.loading('Loading...');

    try {
      const res = await axios.delete(`api/products/${productToDelete.id}`);

      toast.update(toastId, {
        render: "Product berhasil dihapus",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      })

      setIsConfirmOpen(false);
      setProductToDelete(null);

    } catch(err) {

      toast.update(toastId, {
        render: "Gagal hapus product",
        type: "error",
        isLoading: false,
        autoClose: 2000
      });

    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-100 flex flex-col">
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name || "Product image"}
            className="object-contain w-full h-full"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/no-image.png";
            }}
          />
        ) : (
          <span className="text-gray-500 text-lg">No Image</span>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
          {product.description}
        </p>
        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
          {product.storeLocation}
        </p>
        <div className="mt-auto">
          <p className="text-lg font-bold">
            {product.price ? `Rp ${product.price.toLocaleString()}` : "—"}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center">
        <button className="w-full bg-blue-300 hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-300 text-gray-600 border border-blue-300 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95">
          Edit Product
        </button>

        <button onClick={() => handleDelete(product)}
          className="ml-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors active:scale-95"
        >
          <TrashIcon className="w-5 h-5" />
        </button>

        {isConfirmOpen && (
          <ConfirmPopup
            isOpen={isConfirmOpen}
            message="Apakah Anda yakin akan menghapus akun ini?"
            onConfirm={handleDeleteById}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </div>
  );
}