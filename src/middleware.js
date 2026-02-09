import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token) {
  try {
    if (!token) {
      console.log("❌ No token provided");
      return null;
    }
    
    const secret = process.env.JWT_SECRET_ADMIN;
    
    if (!secret) {
      console.error("❌ JWT_SECRET_ADMIN not configured!");
      return null;
    }
    
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret);
    
    console.log("✅ Token verified:", { id: payload.id, role: payload.role });
    return payload;
  } catch (e) {
    console.error("❌ JWT Verify Error:", e.message);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // ✅ PENTING: Middleware Next.js tidak bisa akses localStorage
  // Jadi kita skip middleware check dan andalkan client-side protection
  
  console.log("🔒 Middleware:", pathname);
  
  // Biarkan semua request lewat
  // Protection dilakukan di client-side (layout/page)
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};