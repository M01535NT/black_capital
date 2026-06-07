/** Next.js 16+ proxy convention – replaces deprecated middleware. */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, isValidTokenFormat } from "@/lib/auth";

// Paths that don't require auth
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

// API routes that are public (lead capture, brochure send)
const PUBLIC_API_PATHS = ["/api/send-brochure", "/api/public-leads"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /admin and /api routes
  const isAdmin = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");

  if (!isAdmin && !isApi) {
    return NextResponse.next();
  }

  // Allow public paths
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    // Redirect already-logged-in users away from login page
    const session = request.cookies.get(AUTH_COOKIE);
    if (session?.value && isValidTokenFormat(session.value) && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Allow public API endpoints
  if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check auth for all other admin & API routes
  const session = request.cookies.get(AUTH_COOKIE);
  if (!session?.value || !isValidTokenFormat(session.value)) {
    // For API routes, return 401 JSON
    if (isApi) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    // For admin pages, redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
