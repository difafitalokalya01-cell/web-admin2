'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from "@/app/lib/image.helper";

export default function ModalAssignTask({ 
  item, 
  selectedProduct, 
  onClose, 
  onSelectProduct, 
  onAssignTask 
}) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [productImageState, setProductImageState] = useState({ loading: true, error: false });

  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
    setProductImageState({ loading: true, error: false });
  }, [item, selectedProduct]);

  if (!item) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    setImageLoading(false);
    setImageError(true);
    e.target.onerror = null;
  };

  const handleProductImageLoad = () => {
    setProductImageState({ loading: false, error: false });
  };

  const handleProductImageError = (e) => {
    setProductImageState({ loading: false, error: true });
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

  const userAvatarUrl = getImageUrl(item.user?.profilePicture, 'users');
  const productImageUrl = selectedProduct ? getImageUrl(selectedProduct.imageUrl, 'products') : null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-task-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center bg-blue-500 text-white sticky top-0 z-10">
          <h2 id="assign-task-modal-title" className="text-xl font-bold">Assign Task to User</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* User Profile Card */}
          <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-700 text-sm">User Information</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-col md:flex-row gap-5">
                {/* Avatar Section */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  {imageLoading && (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    </div>
                  )}
                  
                  {userAvatarUrl && !imageError ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <Image
                        src={userAvatarUrl}
                        alt={`${item.user.username} profile`}
                        width={80}
                        height={80}
                        className="object-cover"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        unoptimized
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {item.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                
                {/* User Details */}
                <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3">
                  <DetailItem label="Username" value={item.user?.username || '-'} />
                  <DetailItem label="Email" value={item.user?.email || '-'} />
                  <DetailItem label="Phone" value={item.user?.phone || '-'} />
                  <DetailItem 
                    label="Balance" 
                    value={formatCurrency(item.user?.balance || 0)}
                    valueClass="font-bold text-emerald-600"
                  />
                  <DetailItem 
                    label="Current Level" 
                    value={`Level ${item.user?.userLevel?.currentLevel || 1}`}
                    valueClass="font-medium text-blue-600"
                  />
                  <DetailItem 
                    label="Total Tasks" 
                    value={`${item.user?.userLevel?.totalTasks || 0} completed`}
                    valueClass="font-medium text-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Selection */}
          {selectedProduct ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-700 text-sm">Selected Product</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-emerald-500" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                  Assigned
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-5">
                  {productImageUrl && (
                    <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative">
                      {productImageState.loading && (
                        <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      {productImageState.error ? (
                        <div className="text-gray-400 p-2">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-xs mt-1">Image unavailable</p>
                        </div>
                      ) : (
                        <Image
                          src={productImageUrl}
                          alt={selectedProduct.name}
                          width={128}
                          height={128}
                          className="object-contain p-1"
                          onLoad={handleProductImageLoad}
                          onError={handleProductImageError}
                          unoptimized
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{selectedProduct.name}</h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price</span>
                        <span className="font-medium text-gray-900">{formatCurrency(selectedProduct.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Commission</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(selectedProduct.commission)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-gray-500">Store</span>
                        <span className="flex items-center gap-1.5 font-medium text-gray-800">
                          {getShopIcon(selectedProduct.shopName)}
                          <span className="max-w-[120px] truncate">{selectedProduct.shopName}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed rounded-xl border-gray-300 p-8 text-center bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors"
              onClick={onSelectProduct}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectProduct()}
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="font-medium text-gray-700 mb-1">No product selected</p>
              <p className="text-gray-500 text-sm mb-3">Click here to assign a product for this task</p>
              <span className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-blue-600 text-xs font-medium rounded-full hover:bg-blue-50 transition-colors">
                <svg className="-ml-1 mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Select Product
              </span>
            </div>
          )}

          {/* Request Details */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-700 text-sm">Request Details</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Request ID</p>
                  <p className="font-mono font-medium text-gray-800 bg-gray-50 p-1.5 rounded border border-gray-200">{item.assignedByUserId.substring(0, 12)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Request Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Status</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    <svg className="-ml-1 mr-1.5 h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Awaiting Product Assignment
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Notice */}
          {selectedProduct && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-900">Task Assignment Notice</p>
                <p className="text-blue-800 text-sm mt-0.5">
                  After assignment, the user will receive an instant notification and can begin the task immediately. 
                  Ensure all product details are accurate before sending.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          
          {selectedProduct ? (
            <button
              onClick={onAssignTask}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Assign Task
            </button>
          ) : (
            <button
              onClick={onSelectProduct}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Select Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for consistent detail display
const DetailItem = ({ label, value, valueClass = "font-medium text-gray-900" }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-sm ${valueClass}`}>{value}</p>
  </div>
);