import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ========================================
// HELPER: Verify JWT dengan Secret
// ========================================
async function verifyToken(token) {
  try {
    if (!token) {
      console.log("❌ No token provided");
      return null;
    }
    
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      console.error("❌ JWT_SECRET not configured!");
      return null;
    }
    
    const encodedSecret = new TextEncoder().encode(secret);
    
    // Verify signature + expiration
    const { payload } = await jwtVerify(token, encodedSecret);
    
    console.log("✅ Token verified successfully:", payload);
    return payload;
  } catch (e) {
    console.error("❌ JWT Verify Error:", e.message);
    return null;
  }
}

// ========================================
// MIDDLEWARE UTAMA
// ========================================
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Baca token dari cookie
  const token = request.cookies.get("admin_token")?.value;
  
  console.log("🔒 Middleware Check:", {
    pathname,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + "..." : "none",
    allCookies: request.cookies.getAll().map(c => c.name)
  });

  // ========================================
  // 1. VERIFY TOKEN
  // ========================================
  let payload = null;
  
  if (token) {
    payload = await verifyToken(token);
  }
  
  const isValid = !!payload;
  const isAdmin = payload?.role === "admin";
  
  console.log("👤 Auth Status:", { isValid, isAdmin, payload });

  // ========================================
  // 2. REDIRECT LOGIC
  // ========================================
  
  // Path publik yang tidak perlu autentikasi
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Jika sudah login, akses /login → redirect ke dashboard
  if (pathname === "/login" && isValid && isAdmin) {
    console.log("↪️ Already logged in, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika akses dashboard tanpa token valid
  if (pathname.startsWith("/dashboard")) {
    if (!isValid || !isAdmin) {
      console.log("🚫 Unauthorized access to dashboard, redirecting to login");
      
      const response = NextResponse.redirect(new URL("/login", request.url));
      
      // Hapus cookie yang invalid
      response.cookies.delete("admin_token");
      
      return response;
    }
    
    // Token valid, izinkan akses
    console.log("✅ Access granted to dashboard");
    return NextResponse.next();
  }

  // Root path "/" → redirect berdasarkan status login
  if (pathname === "/") {
    if (isValid && isAdmin) {
      console.log("↪️ Root access (logged in), redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      console.log("↪️ Root access (not logged in), redirecting to login");
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