import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_AUTH_COOKIE = "bc_admin_session";
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const session = request.cookies.get(ADMIN_AUTH_COOKIE);
    if (session?.value === "authenticated" && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

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
