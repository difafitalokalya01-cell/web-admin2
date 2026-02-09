import { NextResponse } from "next/server";

function parseJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  } catch (e) {
    return null;
  }
}

export async function middleware(request) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;
  
  const payload = parseJwt(token);
  const isValid = payload && payload.exp * 1000 > Date.now();

  if (pathname === "/login" && isValid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") || pathname === "/") {
    if (!isValid) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (token) response.cookies.delete("admin_token");
      return response;
    }
    
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};