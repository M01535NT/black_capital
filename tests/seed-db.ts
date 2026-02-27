import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables! Check your .env.local file. We need NEXT_PUBLIC_SUPABASE_ANON_KEY to seed.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyProperties = [
    {
        title: "Oficina Corporativa Prime San Pedro - Test",
        description: "Oficina de alto nivel funcional en San Pedro Garza Garcia. Perfecta para testing E2E con Playwright.",
        property_use: "Comercial",
        property_type: "Oficina",
        business_type: "Renta",
        price: 85000,
        currency: "MXN",
        m2_construction: 120,
        m2_terrain: 120,
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Residencia Luxury Valle Alto - Test",
        description: "Hermosa residencia de lujo, ideal para validaciones del portal Black Luxury. E2E QA Test.",
        property_use: "Residencial",
        property_type: "Casa",
        business_type: "Venta",
        price: 25000000,
        currency: "MXN",
        m2_construction: 600,
        m2_terrain: 1000,
        is_project: false,
        is_assignment: false,
        is_featured: true,
        status: "Available"
    },
    {
        title: "Bodega Industrial Carretera Nacional - Test",
        description: "Nave industrial de prueba para la marca Black Industrial.",
        property_use: "Industrial",
        property_type: "Bodega",
        business_type: "Venta",
        price: 18000000,
        currency: "MXN",
        m2_construction: 1500,
        m2_terrain: 1500,
        is_project: false,
        is_assignment: false,
        is_featured: false,
        status: "Available"
    }
];

async function seed() {
    console.log("🌱 Seeding dummy database objects...");
    const { data, error } = await supabase.from('properties').insert(dummyProperties).select();

    if (error) {
        console.error("❌ Failed to seed:", error);
    } else {
        console.log(`✅ Emptied ${data.length} sample properties into the database.`);
    }
}

seed();
