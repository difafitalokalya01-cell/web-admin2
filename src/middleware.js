import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Install: npm install jose

// ========================================
// HELPER: Parse JWT (Fallback)
// ========================================
function parseJwtUnsafe(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString()
    );
    
    return payload;
  } catch (e) {
    console.error("❌ JWT Parse Error:", e.message);
    return null;
  }
}

// ========================================
// HELPER: Verify JWT dengan Secret
// ========================================
async function verifyToken(token) {
  try {
    if (!token) return null;
    
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key-change-this"
    );
    
    // Verify signature + expiration
    const { payload } = await jwtVerify(token, secret);
    
    return payload;
  } catch (e) {
    // Token invalid, expired, atau signature salah
    console.error("❌ JWT Verify Error:", e.message);
    return null;
  }
}

// ========================================
// MIDDLEWARE UTAMA
// ========================================
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  
  console.log("🔒 Middleware Check:", pathname, "| Token:", token ? "✓" : "✗");

  // ========================================
  // 1. VERIFY TOKEN
  // ========================================
  let payload = null;
  
  if (token) {
    // ✅ Verifikasi dengan secret (AMAN)
    payload = await verifyToken(token);
    
    // ⚠️ Fallback: Parse tanpa verify (TIDAK AMAN, hanya untuk dev)
    if (!payload && process.env.NODE_ENV === "development") {
      console.warn("⚠️ Using unsafe JWT parse (development only)");
      payload = parseJwtUnsafe(token);
    }
  }
  
  const isValid = !!payload;
  
  // ========================================
  // 2. VALIDASI ROLE (Opsional tapi penting)
  // ========================================
  const isAdmin = payload?.role === "admin"; // Sesuaikan dengan struktur JWT Anda
  
  console.log("👤 User Valid:", isValid, "| Role:", payload?.role || "none");

  // ========================================
  // 3. REDIRECT LOGIC
  // ========================================
  
  // 🔹 Jika user sudah login, akses /login → redirect ke dashboard
  if (pathname === "/login") {
    if (isValid && isAdmin) {
      console.log("↪️ Already logged in, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // User belum login atau bukan admin, biarkan akses /login
    return NextResponse.next();
  }

  // 🔹 Jika akses dashboard tanpa token valid
  if (pathname.startsWith("/dashboard")) {
    if (!isValid || !isAdmin) {
      console.log("🚫 Unauthorized access to dashboard, redirecting to login");
      
      const response = NextResponse.redirect(new URL("/login", request.url));
      
      // Hapus cookie yang invalid
      if (token) {
        response.cookies.delete("admin_token");
      }
      
      return response;
    }
    
    // Token valid + role admin, biarkan akses dashboard
    return NextResponse.next();
  }

  // 🔹 Root path "/" → redirect berdasarkan status login
  if (pathname === "/") {
    if (isValid && isAdmin) {
      console.log("↪️ Root access, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      console.log("↪️ Root access, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Path lain, biarkan lewat
  return NextResponse.next();
}

// ========================================
// KONFIGURASI MATCHER
// ========================================
export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
  ],
};