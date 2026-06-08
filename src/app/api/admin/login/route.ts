import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "El acceso ahora usa Supabase Auth desde /admin/login." },
    { status: 410 },
  );
}
