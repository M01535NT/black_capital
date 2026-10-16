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

// API routes that are public (lead capture, protected document request)
const PUBLIC_API_PATHS = ["/api/public-leads", "/api/document-access"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Preview inherits project variables on Vercel. Keep every administrative and
  // API path closed until a separate, reachable backend is provisioned.
  if (process.env.VERCEL_ENV === "preview") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Esta vista previa es de solo lectura. Los envíos están desactivados." }, { status: 503 });
    }
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/?preview=readonly", request.url));
    }
  }

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
