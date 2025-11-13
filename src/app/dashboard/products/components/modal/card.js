"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductCard({ product }) {
  const imageUrl = product?.imageUrl
    ? `${BASE_URL}/uploads${product.imageUrl}`
    : null;

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

      <div className="px-4 pb-4">
        <button className="w-full bg-blue-300 hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-300 text-gray-600 border border-blue-300 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95">
          Lihat Detail
        </button>
      </div>
    </div>
  );
}