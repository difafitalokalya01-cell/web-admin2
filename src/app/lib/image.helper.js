// app/lib/image.helper.js
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'web-server-production-a47f.up.railway.app';

/**
 * Build full image URL from path
 * @param {string} path - Path dari database (filename atau path)
 * @param {string} type - 'users' | 'products' | 'topups' | 'transferproof'
 * @returns {string|null} Full URL atau null
 */
export const getImageUrl = (path, type = 'users') => {
  if (!path || path === 'null' || path === 'undefined' || path.trim() === '') {
    return null;
  }

  // Jika sudah full URL, return langsung
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Bersihkan path dari whitespace dan slash tidak perlu
  const cleanPath = (p) => {
    if (!p) return '';
    p = p.trim();
    // Hapus slash di awal jika ada
    p = p.replace(/^\/+/, '');
    return p;
  };

  const cleanedPath = cleanPath(path);
  console.log(`[DEBUG] getImageUrl - path: "${path}", type: "${type}", cleaned: "${cleanedPath}"`);

  // Handle berdasarkan type
  switch (type) {
    case 'users':
      // Untuk users: hapus prefix jika ada
      const userFilename = cleanedPath.replace(/^uploads\/users\//, '');
      return `${BACKEND_URL}/uploads/users/${userFilename}`;

    case 'products':
      // ✅ PERBAIKAN: Untuk produk, path di DB sudah lengkap
      // Cek jika path sudah mengandung uploads/products/
      if (cleanedPath.startsWith('uploads/products/')) {
        return `${BACKEND_URL}/${cleanedPath}`;
      }
      // Jika hanya filename, tambahkan folder
      return `${BACKEND_URL}/uploads/products/${cleanedPath}`;

    case 'topups':
    case 'transferproof':
      // Untuk topups: hapus prefix jika ada
      const topupFilename = cleanedPath
        .replace(/^uploads\/topups\//, '')
        .replace(/^uploads\/transferproof\//, '');
      return `${BACKEND_URL}/uploads/transferproof/${topupFilename}`;

    default:
      // Default: anggap path sudah benar
      return `${BACKEND_URL}/${cleanedPath}`;
  }
};

/**
 * Get image URL khusus untuk Next.js Image component
 * @param {string} path - Path dari database
 * @param {string} type - 'users' | 'products' | 'topups'
 * @returns {string|null} URL yang sudah diformat
 */
export const getImageSrc = (path, type = 'users') => {
  return getImageUrl(path, type);
};

export const BACKEND_BASE_URL = BACKEND_URL;