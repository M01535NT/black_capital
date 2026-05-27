import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateSessionToken } from "@/lib/auth";

// Same seed data as before — kept brief for space
const seedProperties = [
  { title: "Residencia de Autor en Valle Real", slug: "residencia-autor-valle-real", description: "Espectacular residencia de 850 m² construidos sobre terreno de 1,200 m² en la zona más exclusiva de Valle Real, Zapopan.", property_use: "Residencial", property_type: "Casa", business_type: "Venta", price: 45000000, currency: "MXN", m2_construction: 850, m2_terrain: 1200, address: "Valle Real, Zapopan, Jalisco", cover_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: true, status: "Available" },
  { title: "Penthouse Sky Residence Santa Fe", slug: "penthouse-sky-residence-santa-fe", description: "Penthouse de 520 m² con terraza de 180 m² en el piso 42 de torre icónica en Santa Fe.", property_use: "Residencial", property_type: "Departamento", business_type: "Venta", price: 2800000, currency: "USD", m2_construction: 520, m2_terrain: null, address: "Santa Fe, Ciudad de México", cover_image: "https://images.unsplash.com/photo-1600607687931-cebf00363ceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: true, status: "Available" },
  { title: "Desarrollo Residencial Bosques del Pedregal", slug: "desarrollo-residencial-bosques-pedregal", description: "Proyecto exclusivo de 12 residencias unifamiliares en terrenos de 600 m² promedio dentro de coto privado con acceso controlado.", property_use: "Residencial", property_type: "Casa", business_type: "Venta", price: 18500000, currency: "MXN", m2_construction: 450, m2_terrain: 600, address: "Bosques del Pedregal, CDMX", cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: true, is_assignment: false, is_featured: false, status: "Available" },
  { title: "Villa Frente al Mar en Punta Mita", slug: "villa-frente-mar-punta-mita", description: "Villa de ultra-lujo con acceso directo a playa privada en el exclusivo desarrollo Punta Mita.", property_use: "Residencial", property_type: "Casa", business_type: "Venta", price: 8500000, currency: "USD", m2_construction: 1200, m2_terrain: 2500, address: "Punta Mita, Nayarit", cover_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: true, status: "Available" },
  { title: "Oficina Corporativa Prime en Torre Reforma", slug: "oficina-corporativa-torre-reforma", description: "Piso completo de 1,800 m² en Torre Reforma, el edificio corporativo más icónico de Latinoamérica.", property_use: "Comercial", property_type: "Oficina", business_type: "Renta", price: 680000, currency: "MXN", m2_construction: 1800, m2_terrain: 1800, address: "Paseo de la Reforma 483, CDMX", cover_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: true, status: "Available" },
  { title: "Plaza Comercial Satélite Premium", slug: "plaza-comercial-satelite-premium", description: "Plaza comercial de 4,500 m² con 18 locales ancla y 32 locales secundarios.", property_use: "Comercial", property_type: "Plaza", business_type: "Venta", price: 125000000, currency: "MXN", m2_construction: 4500, m2_terrain: 6000, address: "Ciudad Satélite, Naucalpan, Estado de México", cover_image: "https://images.unsplash.com/photo-1416339442236-8ceb164046f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: true, status: "Available" },
  { title: "Local Flagship Polanco", slug: "local-flagship-polanco", description: "Local comercial de 280 m² en esquina sobre Av. Presidente Masaryk.", property_use: "Comercial", property_type: "Local", business_type: "Renta", price: 320000, currency: "MXN", m2_construction: 280, m2_terrain: 280, address: "Av. Presidente Masaryk, Polanco, CDMX", cover_image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: false, status: "Available" },
  { title: "Oficinas Coworking Premium Monterrey", slug: "oficinas-coworking-premium-monterrey", description: "Edificio completo de 3,200 m² acondicionado como coworking premium en San Pedro Garza García.", property_use: "Comercial", property_type: "Oficina", business_type: "Venta", price: 68000000, currency: "MXN", m2_construction: 3200, m2_terrain: 800, address: "San Pedro Garza García, Monterrey", cover_image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: false, status: "Available" },
  { title: "Nave Industrial Clase A Apodaca", slug: "nave-industrial-clase-a-apodaca", description: "Nave industrial de 15,000 m² construidos sobre terreno de 22,000 m² en el corredor industrial de Apodaca, NL.", property_use: "Industrial", property_type: "Nave", business_type: "Renta", price: 1250000, currency: "MXN", m2_construction: 15000, m2_terrain: 22000, address: "Parque Industrial Apodaca, Nuevo León", cover_image: "https://images.unsplash.com/photo-1586528116311-ad8ed7451430?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: true, status: "Available" },
  { title: "Terreno Macro Industrial Querétaro", slug: "terreno-macro-industrial-queretaro", description: "Terreno de 180,000 m² (18 hectáreas) dentro de parque industrial con servicios completos.", property_use: "Industrial", property_type: "Terreno", business_type: "Venta", price: 4200000, currency: "USD", m2_construction: null, m2_terrain: 180000, address: "Corredor Industrial Querétaro-SLP", cover_image: "https://images.unsplash.com/photo-1587293852726-59cb2f295e86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: true, status: "Available" },
  { title: "Centro de Distribución Last-Mile CDMX", slug: "centro-distribucion-last-mile-cdmx", description: "Bodega de distribución de 3,500 m² en zona estratégica para logística de última milla.", property_use: "Industrial", property_type: "Bodega", business_type: "Venta", price: 32000000, currency: "MXN", m2_construction: 3500, m2_terrain: 5000, address: "Iztapalapa, Ciudad de México", cover_image: "https://images.unsplash.com/photo-1580983546050-dfc791334860?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: false, is_featured: false, status: "Available" },
  { title: "Parque Logístico Bajío - Cesión de Derechos", slug: "parque-logistico-bajio-cesion", description: "Cesión de derechos sobre 3 naves industriales de 8,000 m² cada una en parque logístico premium del Bajío.", property_use: "Industrial", property_type: "Parque", business_type: "Cesión", price: 15000000, currency: "USD", m2_construction: 24000, m2_terrain: 45000, address: "León-Silao, Guanajuato", cover_image: "https://images.unsplash.com/photo-1542152648-9da3e9e1bbba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", is_project: false, is_assignment: true, is_featured: true, status: "Available" },
];

// Changed from GET to POST — must be called intentionally, not accidental GET
export async function POST(request: Request) {
  // Auth check
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const session = cookieStore.get("bc_admin_session");
  if (!session?.value || !(await validateSessionToken(session.value))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Clear existing seed data first
  const { error: deleteError } = await supabase
    .from("properties")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) {
    console.error("SEED CLEANUP ERROR:", deleteError);
  }

  const { data, error } = await supabase.from("properties").insert(seedProperties).select();

  if (error) {
    console.error("NATIVE SUPABASE ERROR:", error);
    return NextResponse.json(
      { error: error.message, details: error.details, hint: error.hint, code: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    seededRows: data.length,
    breakdown: {
      luxury: data.filter((p: any) => p.property_use === "Residencial").length,
      business: data.filter((p: any) => p.property_use === "Comercial").length,
      industrial: data.filter((p: any) => p.property_use === "Industrial").length,
    },
  });
}
