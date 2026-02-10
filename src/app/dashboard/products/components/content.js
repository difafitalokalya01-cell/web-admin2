"use client";

import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ProductCard from "./modal/card";
import AddIcon from "@/assets/icons/productIcons/add.png";
import Image from "next/image";
import { AddProductModal } from "./modal/tambah.product";
import axios from "@/app/lib/axios";
import { toast } from "react-toastify";

export default function ContentProductPage({ products = [] }) {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState(products || []);
  const [isLoading, setIsLoading] = useState(false);

  // Optional: Re-fetch products on mount jika diperlukan
  useEffect(() => {
    // Jika initial products kosong dan ingin fetch ulang
    if (!products || products.length === 0) {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      const data = res.data.data || res.data || [];
      setAllProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } 
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = allProducts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(allProducts.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleAddProduct = async (payload) => {
    const toastId = toast.loading("Menambah produk...");

    try {
      const res = await axios.post("/api/product/create", payload);
      const newProduct = res.data.data;
      setAllProducts((prev) => [newProduct, ...prev]);
      
      toast.update(toastId, {
        render: "Produk berhasil ditambahkan!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Gagal menambah produk:", error);
      
      toast.update(toastId, {
        render: error.response?.data?.message || "Gagal menambah produk",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    const toastId = toast.loading("Menghapus produk...");

    try {
      await axios.delete(`/api/products/${id}`);
      
      setAllProducts((prev) => prev.filter((p) => p.id !== id));

      toast.update(toastId, {
        render: "Produk berhasil dihapus!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
      
      toast.update(toastId, {
        render: error.response?.data?.message || "Gagal menghapus produk",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  if (isLoading && allProducts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-white rounded-md p-3 space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="lg:hidden"
          aria-label="Tambah produk"
        >
          <Image src={AddIcon} alt="Tambah" width={24} height={24} />
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-300 hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-300 px-4 py-2 active:scale-95 rounded-lg shadow-md text-gray-700 font-medium hidden lg:inline"
        >
          + Tambah Data
        </button>
      </div>

      {allProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Tidak ada produk</p>
          <p className="text-sm mt-2">Klik tombol "Tambah Data" untuk menambah produk baru</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentPageData.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDeleteSuccess={handleDeleteProduct}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex justify-center mt-6">
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName="flex gap-2 items-center justify-center select-none text-sm"
                pageClassName="group"
                pageLinkClassName="block px-3 py-1 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-100 transition"
                activeLinkClassName="border-blue-400 text-blue-600 font-semibold"
                previousClassName="group"
                previousLinkClassName="block px-3 py-1 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-100 transition"
                nextClassName="group"
                nextLinkClassName="block px-3 py-1 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-100 transition"
                disabledClassName="opacity-40 cursor-not-allowed"
                breakLabel="..."
                breakLinkClassName="block px-3 py-1 text-gray-500"
              />
            </div>
          )}
        </>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}