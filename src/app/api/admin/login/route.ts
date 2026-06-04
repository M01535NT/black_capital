import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { AUTH_COOKIE, deriveToken, timingSafeEqual } from "@/lib/auth";

const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 horas

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Servidor no configurado" },
        { status: 500 }
      );
    }

    // Constant-time comparison for admin password
    if (!timingSafeEqual(password || "", adminPassword)) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Set httpOnly cookie with derived token (not plain text password)
    const token = await deriveToken(adminPassword);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("API/login", "[API /admin/login] Error:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
