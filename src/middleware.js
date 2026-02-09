import { NextResponse } from "next/server";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString();
    return JSON.parse(jsonPayload);
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
  
  console.log('Token validation:', { isValid, payload, token: token?.substring(0, 20) });

  if (pathname === "/login" && isValid) {
    console.log('Redirecting from login to dashboard');
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") || pathname === "/") {
    if (!isValid) {
      console.log('Token invalid, redirecting to login');
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (token) {
        response.cookies.delete("admin_token");
      }
      return response;
    }
    
    if (pathname === "/") {
      console.log('Redirecting root to dashboard');
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};