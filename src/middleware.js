import { NextResponse } from "next/server";

function parseJwt(token) {
  try {
    console.log('🔐 [MW] Attempting to parse JWT (first 50 chars):', token?.substring(0, 50));
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString();
    const payload = JSON.parse(jsonPayload);
    console.log('✅ [MW] JWT parsed successfully:', payload);
    return payload;
  } catch (e) {
    console.error('❌ [MW] Error parsing JWT:', e.message);
    return null;
  }
}

export async function middleware(request) {
  console.log('🛡️ [MW] Middleware triggered');
  console.log('📍 [MW] Pathname:', request.nextUrl.pathname);
  console.log('🌐 [MW] URL:', request.url);

  const token = request.cookies.get("admin_token")?.value;
  console.log('🍪 [MW] Cookie "admin_token" found:', !!token);
  console.log('🍪 [MW] Token value (first 50 chars):', token?.substring(0, 50));

  const { pathname } = request.nextUrl;
  
  const payload = parseJwt(token);
  const now = Date.now();
  const tokenExpiry = payload?.exp ? payload.exp * 1000 : null;
  const isValid = payload && tokenExpiry > now;

  console.log('📊 [MW] Token validation:', {
    hasPayload: !!payload,
    tokenExpiry: tokenExpiry,
    currentTime: now,
    isExpired: tokenExpiry ? tokenExpiry <= now : null,
    isValid: isValid
  });

  // Redirect dari login ke dashboard jika sudah login
  if (pathname === "/login" && isValid) {
    console.log('➡️ [MW] Redirecting from /login to /dashboard (already logged in)');
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") || pathname === "/") {
    console.log('🔒 [MW] Protected route accessed:', pathname);
    
    if (!isValid) {
      console.warn('⚠️ [MW] Invalid token, redirecting to /login');
      const response = NextResponse.redirect(new URL("/login", request.url));
      if (token) {
        console.log('🗑️ [MW] Deleting invalid admin_token cookie');
        response.cookies.delete("admin_token");
      }
      return response;
    }
    
    console.log('✅ [MW] Token valid, allowing access');
    
    // Redirect root ke dashboard
    if (pathname === "/") {
      console.log('➡️ [MW] Redirecting / to /dashboard');
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  console.log('✅ [MW] Middleware completed, proceeding to next');
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};