'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "@/app/lib/axios";
import { getImageUrl } from "@/app/lib/image.helper";

export default function ModalSelectProduct({ 
  onClose, 
  onSelect,
  userLevel = 'CLASSIC' 
}) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imageLoadStates, setImageLoadStates] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/products');
            setProducts(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Gagal memuat produk: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (products.length > 0) {
            setImageLoadStates(prev => {
                const newStates = { ...prev };
                products.forEach(product => {
                    if (!newStates[product.id]) {
                        newStates[product.id] = { loading: true, error: false };
                    }
                });
                return newStates;
            });
        }
    }, [products]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // ✅ Perbaikan: Gunakan parameter price & props userLevel yang benar
    const calculateCommission = (price) => {
        const levelMap = {
            CLASSIC: 20,
            SILVER: 25,
            GOLD: 30,
            PLATINUM: 35
        };

        // userLevel adalah string seperti "CLASSIC", bukan object
        const commissionPercentage = levelMap[userLevel.toUpperCase()] || 15;
        return Math.floor((price * commissionPercentage) / 100);
    };

    // ✅ Perbaikan: Gunakan props userLevel yang benar
    const getCommissionPercentage = () => {
        const levelMap = {
            CLASSIC: 20,
            SILVER: 25,
            GOLD: 30,
            PLATINUM: 35
        };
        return levelMap[userLevel.toUpperCase()] || 15;
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shopName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = () => {
        if (selectedProduct) {
            onSelect(selectedProduct);
        }
    };

    const handleImageLoad = (productId) => {
        setImageLoadStates(prev => ({
            ...prev,
            [productId]: { loading: false, error: false }
        }));
    };

    const handleImageError = (productId, e) => {
        setImageLoadStates(prev => ({
            ...prev,
            [productId]: { loading: false, error: true }
        }));
        e.target.onerror = null;
    };

    const getShopIcon = (shopName) => {
        const shopIcons = {
            'tokopedia': '🏪',
            'shopee': '🛒',
            'lazada': '🛍️',
            'bukalapak': '📦',
            'blibli': '📱',
            'tiktok shop': '🎵',
        };
        return shopIcons[shopName?.toLowerCase()] || '🏪';
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 flex justify-between bg-blue-500 items-center rounded-t-lg flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Pilih Produk</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Tutup modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 py-4 flex-shrink-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari produk atau toko..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            aria-label="Cari produk"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {isLoading ? 'Memuat...' : `Ditemukan ${filteredProducts.length} produk`}
                    </p>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 border-t-2"></div>
                            <p className="mt-4 text-gray-500 font-medium">Memuat produk...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada produk ditemukan</p>
                            <p className="text-gray-400 text-sm mt-1">Coba ubah kata kunci pencarian</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredProducts.map((product) => {
                                // ✅ Hitung komisi untuk setiap produk
                                const commission = calculateCommission(product.price);
                                const commissionPercentage = getCommissionPercentage();
    
                                const imageState = imageLoadStates[product.id] || { loading: false, error: false };
                                
                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => setSelectedProduct(product)}
                                        className={`text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                            selectedProduct?.id === product.id
                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm hover:bg-gray-50'
                                        }`}
                                        aria-label={`Pilih produk ${product.name}`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Product Image Container */}
                                            <div className="flex-shrink-0 relative w-20 h-20">
                                                {/* Loading Overlay */}
                                                {imageState.loading && (
                                                    <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                    </div>
                                                )}

                                                {/* Error State */}
                                                {imageState.error ? (
                                                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                    </div>
                                                ) : product.imageUrl ? (
                                                <Image
                                                    src={getImageUrl(product.imageUrl, 'products')}
                                                    alt={product.name}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-lg object-cover border border-gray-200"
                                                    onLoad={() => handleImageLoad(product.id)}
                                                    onError={(e) => handleImageError(product.id, e)}
                                                />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center border border-gray-200">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 truncate mb-1">{product.name}</h3>
                                                
                                                <div className="space-y-1.5 text-sm">
                                                    {/* Price */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 text-xs">Harga:</span>
                                                        <span className="font-semibold text-gray-800">{formatCurrency(product.price)}</span>
                                                    </div>
                                                    
                                                    {/* Commission */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 text-xs">Komisi:</span>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-semibold text-green-600">{formatCurrency(commission)}</span>
                                                            <span className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                                                                {commissionPercentage}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Shop Info */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 text-xs">Toko:</span>
                                                        <div className="flex items-center gap-1 font-medium text-gray-700 truncate">
                                                            <span>{getShopIcon(product.shopName)}</span>
                                                            <span className="truncate">{product.shopName}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Rating & Sales */}
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div className="flex items-center gap-0.5">
                                                            <span className="text-yellow-500">★</span>
                                                            <span className="font-medium text-gray-700">{product.rating.toFixed(1)}</span>
                                                        </div>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-gray-500">{product.sold} terjual</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Selected Indicator */}
                                            {selectedProduct?.id === product.id && (
                                                <div className="flex-shrink-0 flex items-start pt-1">
                                                    <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 flex justify-between rounded-b-lg items-center flex-shrink-0 bg-gray-50">
                    <div>
                        {selectedProduct && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Terpilih:</span>
                                <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
                                    {selectedProduct.name}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSelect}
                            disabled={!selectedProduct}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Pilih Produk Ini
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}