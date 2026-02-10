"use client";

import { TrashIcon, PencilSquareIcon, MapPinIcon, StarIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import ConfirmPopup from "@/app/components/modal/modalConfirm";
import { useState } from "react";
import axios from "@/app/lib/axios";
import { toast } from "react-toastify";

export default function ProductCard({ product, onDeleteSuccess }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  const handleDeleteById = async () => {
      try {
        // Delegate ke parent
        await onDeleteSuccess(product.id);
        setIsConfirmOpen(false);
      } catch (err) {
        // Error ditangani di parent
        setIsConfirmOpen(false);
      }
    };

  // Render stars for rating
  const renderRating = (rating) => {
    const stars = [];
    const ratingValue = parseFloat(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        stars.push(
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else if (i - 0.5 <= ratingValue) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <StarIconSolid className="w-4 h-4 text-yellow-400 absolute top-0 left-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-56 overflow-hidden">
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name || "Product image"}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-2">
              <ShoppingCartIcon className="w-10 h-10 text-gray-500" />
            </div>
            <span className="text-gray-500 text-sm font-medium">No Image</span>
          </div>
        )}
        
        {/* Badge for sold items if available */}
        {product.sold && product.sold > 0 && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {product.sold} Terjual
          </div>
        )}

        {/* Quick action buttons overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white rounded-lg transition-all shadow-lg hover:scale-110 active:scale-95"
            aria-label="Hapus produk"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Product Name */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg leading-tight min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Shop Name */}
        {product.shopName && (
          <p className="text-sm text-gray-500 mb-2 font-medium">
            {product.shopName}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex gap-0.5">
              {renderRating(product.rating)}
            </div>
            <span className="text-sm font-semibold text-gray-700 ml-1">
              {parseFloat(product.rating).toFixed(1)}
            </span>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>
        )}

        {/* Location */}
        {product.storeLocation && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
            <MapPinIcon className="w-4 h-4" />
            <span className="line-clamp-1">{product.storeLocation}</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <p className="text-2xl font-bold text-blue-600">
            {product.price 
              ? `Rp ${Number(product.price).toLocaleString("id-ID")}` 
              : "Harga tidak tersedia"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 flex items-center gap-2">
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <PencilSquareIcon className="w-4 h-4" />
          Edit
        </button>

        {product.productUrl && (
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all active:scale-95"
          >
            Link
          </a>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {isConfirmOpen && (
        <ConfirmPopup
          isOpen={isConfirmOpen}
          message="Apakah Anda yakin akan menghapus produk ini?"
          onConfirm={handleDeleteById}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}