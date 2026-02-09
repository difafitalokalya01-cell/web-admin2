import { NextResponse } from "next/server";

function parseJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

export async function middleware(request) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;
  
  console.log('Middleware triggered:', { pathname, hasToken: !!token });
  
  const payload = parseJwt(token);
  const isValid = payload && payload.exp * 1000 > Date.now();
  
  console.log('Token validation:', { isValid, payload });

  // Redirect dari login ke dashboard jika sudah login
  if (pathname === "/login" && isValid) {
    console.log('Redirecting from login to dashboard');
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") || pathname === "/") {
    if (!isValid) {
      console.log('Token invalid, redirecting to login');
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (token) response.cookies.delete("admin_token");
      return response;
    }
    
    // Redirect root ke dashboard
    if (pathname === "/") {
      console.log('Redirecting root to dashboard');
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};