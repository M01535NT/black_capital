import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const dummyProperties = [
    {
        title: "Oficina Corporativa Prime San Pedro - Test",
        slug: "oficina-corporativa-prime-san-pedro-test",
        description: "Oficina de alto nivel funcional en San Pedro Garza Garcia. Perfecta para testing E2E con Playwright.",
        property_use: "Comercial",
        property_type: "Oficina",
        business_type: "Renta",
        price: 85000,
        currency: "MXN",
        m2_construction: 120,
        m2_terrain: 120,
        address: { custom: "Av. Roble 660, Valle del Campestre, San Pedro" },
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Residencia Luxury Valle Alto - Test",
        slug: "residencia-luxury-valle-alto-test",
        description: "Hermosa residencia de lujo, ideal para validaciones del portal Black Luxury. E2E QA Test.",
        property_use: "Residencial",
        property_type: "Casa",
        business_type: "Venta",
        price: 25000000,
        currency: "MXN",
        m2_construction: 600,
        m2_terrain: 1000,
        address: { custom: "Club Dorado, Valle Alto, Monterrey" },
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Bodega Industrial Carretera Nacional - Test",
        slug: "bodega-industrial-carretera-nacional-test",
        description: "Nave industrial de prueba para la marca Black Industrial.",
        property_use: "Industrial",
        property_type: "Bodega",
        business_type: "Venta",
        price: 18000000,
        currency: "MXN",
        m2_construction: 1500,
        m2_terrain: 1500,
        address: { custom: "Parque Industrial Sur, Monterrey" },
        is_project: false,
        is_assignment: false,
        is_featured: false,
        status: "Available"
    }
];

export async function GET() {
    console.log("Entering SSR Database Seed...");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: "Missing Env Vars for Service Role" }, { status: 500 });
    }

    // We create the client using the powerful SERVICE ROLE to bypass RLS policies
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.from('properties').insert(dummyProperties).select();

    if (error) {
        console.error("NATIVE SUPABASE ERROR:", error);
        return NextResponse.json({
            error: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        }, { status: 500 });
    }

    return NextResponse.json({ success: true, seededRows: data.length });
}
