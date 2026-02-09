import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token) {
  try {
    if (!token) return null;
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return payload;
  } catch (e) {
    console.error("❌ JWT Verify Error:", e.message);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  
  const payload = token ? await verifyToken(token) : null;
  const isValid = !!payload;
  const isAdmin = payload?.role === "admin";

  // Redirect logic
  if (pathname === "/login" && isValid && isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") && (!isValid || !isAdmin)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("admin_token");
    return response;
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isValid && isAdmin ? "/dashboard" : "/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};