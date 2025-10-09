import Header from "@/app/components/layouts/header";
import ContentProductPage from "./components/content";

export default function ProductPages() {
  const dataProduct = [
    { id: 1, image: '', title: 'surya 16', description: 'Rokok surya isi 16 batang', price: '47000' },
    { id: 2, image: '', title: 'surya 12', description: 'Rokok surya isi 12 batang', price: '27000' },
    { id: 3, image: '', title: 'susu kedelai', description: 'susu kedelai kacang ijo', price: '27000' },
    { id: 4, image: '', title: 'kondom sutra', description: 'kondom bahan sutera ukuran xxxxxxxl', price: '27000' },
    { id: 5, image: '', title: 'nasi goreng', description: 'nasi di tumis sebenernya...', price: '27000' },
    { id: 6, image: '', title: 'Produk 6', description: 'Deskripsi 6', price: '10000' },
    { id: 7, image: '', title: 'Produk 7', description: 'Deskripsi 7', price: '10000' },
    { id: 8, image: '', title: 'Produk 8', description: 'Deskripsi 8', price: '10000' },
    { id: 9, image: '', title: 'Produk 9', description: 'Deskripsi 9', price: '10000' },
    { id: 10, image: '', title: 'Produk 10', description: 'Deskripsi 10', price: '10000' },
    { id: 11, image: '', title: 'Produk 11', description: 'Deskripsi 11', price: '10000' },
    { id: 12, image: '', title: 'Produk 12', description: 'Deskripsi 12', price: '10000' },
    { id: 13, image: '', title: 'Produk 13', description: 'Ini akan muncul di halaman 2', price: '10000' },
  ];

  return (
    <section className="w-full min-h-screen ">
      <Header />
      <div className="w-full py-2">
        <ContentProductPage products={dataProduct} />
      </div>
    </section>
  );
}