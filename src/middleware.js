import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function verifyToken(token) {
  try {
    if (!token) {
      console.log("❌ No token to verify");
      return null;
    }
    
    // ✅ Pakai JWT_SECRET_ADMIN (bukan JWT_SECRET)
    const secret = process.env.JWT_SECRET_ADMIN;
    
    if (!secret) {
      console.error("❌ JWT_SECRET_ADMIN not configured in Vercel!");
      return null;
    }
    
    console.log("🔑 Verifying admin token...");
    
    const payload = jwt.verify(token, secret);
    
    console.log("✅ Token verified successfully:", payload);
    return payload;
  } catch (e) {
    console.error("❌ JWT Verify Error:", e.message);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  let token = request.cookies.get("admin_token")?.value;
  
  console.log("🔒 Middleware Check:", {
    pathname,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 30) + "..." : "none",
  });

  let payload = null;
  
  if (token) {
    payload = verifyToken(token);
  }
  
  const isValid = !!payload;
  const isAdmin = payload?.role === "admin";
  
  console.log("👤 Auth Status:", { isValid, isAdmin });

  if (pathname === "/login" && isValid && isAdmin) {
    console.log("↪️ Already logged in, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isValid || !isAdmin) {
      console.log("🚫 Unauthorized, redirecting to login");
      
      const response = NextResponse.redirect(new URL("/login", request.url));
      return response;
    }
    
    console.log("✅ Access granted to dashboard");
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (isValid && isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};