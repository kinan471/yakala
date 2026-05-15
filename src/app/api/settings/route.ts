import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*");
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  const settings = data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const { key, value } = await req.json();
  
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
