import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Admin auth cookie name
const ADMIN_AUTH_COOKIE = "bc_admin_session";

// Rutas que NO requieren auth (login page + API)
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo proteger rutas /admin/*
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Permitir acceso a páginas públicas del admin
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    // Si ya tiene sesión, redirigir al dashboard
    const session = request.cookies.get(ADMIN_AUTH_COOKIE);
    if (session?.value === "authenticated" && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Verificar sesión para todas las demás rutas /admin/*
  const session = request.cookies.get(ADMIN_AUTH_COOKIE);
  if (!session || session.value !== "authenticated") {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
