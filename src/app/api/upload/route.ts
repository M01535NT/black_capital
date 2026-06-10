import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, requireApiProfile } from "@/lib/auth";

const ALLOWED_BUCKETS = new Set(["public", "secure-brochures"]);

export async function POST(req: NextRequest) {
  try {
    const profile = await requireApiProfile();
    if (!profile || !isAdmin(profile)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const propertyId = formData.get("propertyId") as string | null;
    const purpose = (formData.get("purpose") as string | null) || "property";
    const bucket = (formData.get("bucket") as string) || "public";

    // Validate bucket whitelist
    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json(
        { error: `Bucket "${bucket}" no permitido. Solo se permite: ${[...ALLOWED_BUCKETS].join(", ")}` },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
    }

    if (purpose === "property" && !propertyId) {
      return NextResponse.json({ error: "Falta propertyId" }, { status: 400 });
    }

    // Validate file size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Archivo demasiado grande (máx 10 MB)" }, { status: 400 });
    }

    // Validate content type
    const allowedTypes = purpose === "agent-profile"
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = purpose === "agent-profile"
      ? `agents/profile-photos/${Date.now()}-${safeName}`
      : `${propertyId}/${Date.now()}-${safeName}`;

    const supabase = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, Buffer.from(arrayBuffer), {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      logger.error("API/upload", "[Upload] Supabase storage error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const publicUrlData = bucket === "public"
      ? supabase.storage.from(bucket).getPublicUrl(fileName).data
      : null;

    return NextResponse.json({
      url: publicUrlData?.publicUrl || null,
      bucket,
      path: data.path,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    logger.error("API/upload", "[Upload] Unexpected error:", err);
    return NextResponse.json({ error: `Error al subir archivo: ${message}` }, { status: 500 });
  }
}
