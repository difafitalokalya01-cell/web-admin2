'use client';

import ContentUserPage from "./components/content.js";
import { useEffect, useState } from "react";
import axios from "@/app/lib/axios";

export default function UserPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const res = await axios.get('/api/admin/users');
        
        setData(res.data?.usersData || []);
        setError(null);
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        setError(error.response?.data?.message || 'Gagal memuat data user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="h-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data user...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="h-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full">
      <ContentUserPage initialData={data} />
    </section>
  );
}