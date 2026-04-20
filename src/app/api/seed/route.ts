import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const seedProperties = [
    // ── BLACK LUXURY (Residencial) ──
    {
        title: "Residencia de Autor en Valle Real",
        slug: "residencia-autor-valle-real",
        description: "Espectacular residencia de 850 m² construidos sobre terreno de 1,200 m² en la zona más exclusiva de Valle Real, Zapopan. Diseño arquitectónico de firma con doble altura en sala principal, muro cortina con vista panorámica a campo de golf, cocina italiana Boffi, pisos de mármol Calacatta y sistema domótico Crestron de última generación. Incluye cava privada, gimnasio, alberca infinity con terraza lounge y estacionamiento para 6 vehículos con elevador automotriz.",
        property_use: "Residencial",
        property_type: "Casa",
        business_type: "Venta",
        price: 45000000,
        currency: "MXN",
        m2_construction: 850,
        m2_terrain: 1200,
        address: { custom: "Valle Real, Zapopan, Jalisco" },
        cover_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Penthouse Sky Residence Santa Fe",
        slug: "penthouse-sky-residence-santa-fe",
        description: "Penthouse de 520 m² con terraza de 180 m² en el piso 42 de torre icónica en Santa Fe. Vista 360° de la Ciudad de México, acabados Poliform, pisos de madera de ingeniería Garofoli y baños con mármol Emperador. Tres recámaras en suite, sala de cine, bar privado y acceso exclusivo a club de residentes con alberca rooftop, spa y concierge 24/7.",
        property_use: "Residencial",
        property_type: "Departamento",
        business_type: "Venta",
        price: 2800000,
        currency: "USD",
        m2_construction: 520,
        m2_terrain: null,
        address: { custom: "Santa Fe, Ciudad de México" },
        cover_image: "https://images.unsplash.com/photo-1600607687931-cebf00363ceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Desarrollo Residencial Bosques del Pedregal",
        slug: "desarrollo-residencial-bosques-pedregal",
        description: "Proyecto exclusivo de 12 residencias unifamiliares en terrenos de 600 m² promedio dentro de coto privado con acceso controlado. Preventa con personalización de interiores. Arquitectura contemporánea con techos verdes, paneles solares y sistemas de captación pluvial. Amenidades: casa club, área fitness, senderos y parque central. Entrega estimada Q4 2027.",
        property_use: "Residencial",
        property_type: "Casa",
        business_type: "Venta",
        price: 18500000,
        currency: "MXN",
        m2_construction: 450,
        m2_terrain: 600,
        address: { custom: "Bosques del Pedregal, CDMX" },
        cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: true,
        is_assignment: false,
        is_featured: false,
        status: "Available"
    },
    {
        title: "Villa Frente al Mar en Punta Mita",
        slug: "villa-frente-mar-punta-mita",
        description: "Villa de ultra-lujo con acceso directo a playa privada en el exclusivo desarrollo Punta Mita. 6 recámaras en suite, alberca infinity edge de 25 metros, palapa con cocina gourmet exterior, muelle privado y helipuerto. Programa de renta vacacional con operador premium incluido. Rendimiento estimado 6.2% anual en USD.",
        property_use: "Residencial",
        property_type: "Casa",
        business_type: "Venta",
        price: 8500000,
        currency: "USD",
        m2_construction: 1200,
        m2_terrain: 2500,
        address: { custom: "Punta Mita, Nayarit" },
        cover_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },

    // ── BLACK BUSINESS (Comercial) ──
    {
        title: "Oficina Corporativa Prime en Torre Reforma",
        slug: "oficina-corporativa-torre-reforma",
        description: "Piso completo de 1,800 m² en Torre Reforma, el edificio corporativo más icónico de Latinoamérica. Acabados grado A+, piso técnico elevado, sistema HVAC independiente y certificación LEED Gold. Vista panorámica a Paseo de la Reforma y Chapultepec. Incluye 25 cajones de estacionamiento y acceso a helipuerto y business center.",
        property_use: "Comercial",
        property_type: "Oficina",
        business_type: "Renta",
        price: 680000,
        currency: "MXN",
        m2_construction: 1800,
        m2_terrain: 1800,
        address: { custom: "Paseo de la Reforma 483, CDMX" },
        cover_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Plaza Comercial Satélite Premium",
        slug: "plaza-comercial-satelite-premium",
        description: "Plaza comercial de 4,500 m² con 18 locales ancla y 32 locales secundarios en zona de alto tráfico vehicular y peatonal. Ocupación actual del 94%. Inquilinos triple-net con contratos a 5-10 años. Cap rate actual de 8.2%. Incluye estacionamiento para 320 vehículos, food court y áreas comunes con diseño biofílico.",
        property_use: "Comercial",
        property_type: "Plaza",
        business_type: "Venta",
        price: 125000000,
        currency: "MXN",
        m2_construction: 4500,
        m2_terrain: 6000,
        address: { custom: "Ciudad Satélite, Naucalpan, Estado de México" },
        cover_image: "https://images.unsplash.com/photo-1416339442236-8ceb164046f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Local Flagship Polanco",
        slug: "local-flagship-polanco",
        description: "Local comercial de 280 m² en esquina sobre Av. Presidente Masaryk, la calle comercial más exclusiva de México. Doble frente con aparador de cristal templado de piso a techo. Ideal para flagship store de marca de lujo, galería o showroom premium. Altura de 5.5 metros, acceso independiente y bodega en sótano.",
        property_use: "Comercial",
        property_type: "Local",
        business_type: "Renta",
        price: 320000,
        currency: "MXN",
        m2_construction: 280,
        m2_terrain: 280,
        address: { custom: "Av. Presidente Masaryk, Polanco, CDMX" },
        cover_image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: false,
        status: "Available"
    },
    {
        title: "Oficinas Coworking Premium Monterrey",
        slug: "oficinas-coworking-premium-monterrey",
        description: "Edificio completo de 3,200 m² acondicionado como coworking premium en San Pedro Garza García. 8 pisos con terraza rooftop, cafetería, salas de juntas con videoconferencia Cisco y gym privado. Operación estabilizada con 87% de ocupación. NOI mensual de $1.2M MXN. Ideal para inversión con operador existente.",
        property_use: "Comercial",
        property_type: "Oficina",
        business_type: "Venta",
        price: 68000000,
        currency: "MXN",
        m2_construction: 3200,
        m2_terrain: 800,
        address: { custom: "San Pedro Garza García, Monterrey" },
        cover_image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: false,
        status: "Available"
    },

    // ── BLACK INDUSTRIAL ──
    {
        title: "Nave Industrial Clase A Apodaca",
        slug: "nave-industrial-clase-a-apodaca",
        description: "Nave industrial de 15,000 m² construidos sobre terreno de 22,000 m² en el corredor industrial de Apodaca, NL. Altura libre de 12 metros, 8 andenes de descarga, sistema contra incendios, oficinas administrativas de 800 m² y patio de maniobras para tractocamiones. Certificación ISO 14001. Ideal para manufactura, logística o distribución. Disponible build-to-suit.",
        property_use: "Industrial",
        property_type: "Nave",
        business_type: "Renta",
        price: 1250000,
        currency: "MXN",
        m2_construction: 15000,
        m2_terrain: 22000,
        address: { custom: "Parque Industrial Apodaca, Nuevo León" },
        cover_image: "https://images.unsplash.com/photo-1586528116311-ad8ed7451430?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Terreno Macro Industrial Querétaro",
        slug: "terreno-macro-industrial-queretaro",
        description: "Terreno de 180,000 m² (18 hectáreas) dentro de parque industrial con servicios completos en el corredor Querétaro-San Luis. Uso de suelo industrial pesado, acceso ferroviario a 500m, conexión directa a autopista 57D. Infraestructura hidráulica, eléctrica y de gas natural disponible. Ideal para desarrollo de parque logístico o planta de manufactura de gran formato.",
        property_use: "Industrial",
        property_type: "Terreno",
        business_type: "Venta",
        price: 4200000,
        currency: "USD",
        m2_construction: null,
        m2_terrain: 180000,
        address: { custom: "Corredor Industrial Querétaro-SLP" },
        cover_image: "https://images.unsplash.com/photo-1587293852726-59cb2f295e86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Centro de Distribución Last-Mile CDMX",
        slug: "centro-distribucion-last-mile-cdmx",
        description: "Bodega de distribución de 3,500 m² en zona estratégica para logística de última milla en la CDMX. 6 posiciones de carga, cross-docking habilitado, oficinas climatizadas, sistema de racks selectivos instalados y sistema de monitoreo CCTV 24/7. Contrato vigente con operador e-commerce. Cap rate de 9.1%.",
        property_use: "Industrial",
        property_type: "Bodega",
        business_type: "Venta",
        price: 32000000,
        currency: "MXN",
        m2_construction: 3500,
        m2_terrain: 5000,
        address: { custom: "Iztapalapa, Ciudad de México" },
        cover_image: "https://images.unsplash.com/photo-1580983546050-dfc791334860?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: false,
        is_featured: false,
        status: "Available"
    },
    {
        title: "Parque Logístico Bajío - Cesión de Derechos",
        slug: "parque-logistico-bajio-cesion",
        description: "Cesión de derechos sobre 3 naves industriales de 8,000 m² cada una en parque logístico premium del Bajío. Contratos NNN vigentes con inquilinos AAA (automotriz y aeroespacial) a 10 años. Rendimiento estabilizado del 8.5% anual en USD. Oportunidad única de adquirir activos productivos con flujo inmediato y potencial de apreciación por nearshoring.",
        property_use: "Industrial",
        property_type: "Parque",
        business_type: "Cesión",
        price: 15000000,
        currency: "USD",
        m2_construction: 24000,
        m2_terrain: 45000,
        address: { custom: "León-Silao, Guanajuato" },
        cover_image: "https://images.unsplash.com/photo-1542152648-9da3e9e1bbba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_project: false,
        is_assignment: true,
        is_featured: true,
        status: "Available"
    },
];

export async function GET() {
    console.log("Entering SSR Database Seed...");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: "Missing Env Vars for Supabase Client" }, { status: 500 });
    }

    // We create the client using the powerful SERVICE ROLE to bypass RLS policies
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Clear existing seed data first to avoid duplicates
    const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
        console.error("SEED CLEANUP ERROR:", deleteError);
    }

    const { data, error } = await supabase.from('properties').insert(seedProperties).select();

    if (error) {
        console.error("NATIVE SUPABASE ERROR:", error);
        return NextResponse.json({
            error: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        seededRows: data.length,
        breakdown: {
            luxury: data.filter(p => p.property_use === 'Residencial').length,
            business: data.filter(p => p.property_use === 'Comercial').length,
            industrial: data.filter(p => p.property_use === 'Industrial').length,
        }
    });
}
