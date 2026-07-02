import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { isAdmin, requireApiProfile } from "@/lib/auth";
import { getFaqCatalog, saveFaqCatalog } from "@/lib/faq-catalog";
import { normalizeFaqCatalog } from "@/lib/property-faqs";

export async function GET() {
    try {
        const profile = await requireApiProfile();
        if (!profile || !isAdmin(profile)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const catalog = await getFaqCatalog();
        return NextResponse.json({ catalog });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno del servidor";
        logger.error("API/faq-catalog", "[GET]", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const profile = await requireApiProfile();
        if (!profile || !isAdmin(profile)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const catalog = normalizeFaqCatalog(body?.catalog);
        if (catalog.length === 0) {
            return NextResponse.json(
                { error: "El catálogo no puede quedar vacío." },
                { status: 400 },
            );
        }

        const { error } = await saveFaqCatalog(catalog, profile.id);
        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }
        return NextResponse.json({ catalog });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno del servidor";
        logger.error("API/faq-catalog", "[PUT]", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
