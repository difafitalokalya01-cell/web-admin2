"use client";

import { useState } from "react";
import ReactPaginate from "react-paginate";
import ProductCard from "./modal/card";
import AddIcon from "@/assets/icons/productIcons/add.png";
import Image from "next/image";
import { AddProductModal } from "./modal/tambah.product";

export default function ContentProductPage({ products }) {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const offset = currentPage * itemsPerPage;
  const currentPageData = products.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentPageData.map((product) => (
          <ProductCard key={product.id} product={product} />
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

      {products.length === 0 && (
        <p className="text-center text-gray-500 py-8">Tidak ada produk.</p>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}