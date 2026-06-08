/** Next.js 16+ proxy convention – replaces deprecated middleware. */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require auth
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/setup",
  "/admin/reset-password",
  "/admin/update-password",
  "/api/admin/setup",
  "/api/admin/login",
];

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
    return NextResponse.next();
  }

  // Allow public API endpoints
  if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Route handlers and server components perform full Supabase Auth + role checks.
  // The proxy only keeps public exceptions explicit and avoids blocking Supabase SSR cookies.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
