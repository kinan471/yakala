import { NextResponse } from "next/server";
import { discoverViaSitemap, processQueue } from "@/lib/discovery";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "all"; 
    const secret = searchParams.get("secret") || req.headers.get("Authorization")?.replace("Bearer ", "");

    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "discover") {
      console.log("[API] Triggering Map Discovery...");
      const count = await discoverViaSitemap();
      return NextResponse.json({ success: true, discovered: count, message: "Discovery phase complete." });
    }

    if (action === "process") {
      console.log("[API] Triggering Parallel Processing...");
      const count = await processQueue(3); // Concurrency 3
      return NextResponse.json({ success: true, processed: count, message: "Processing phase complete." });
    }

    if (action === "all") {
      console.log("[API] Triggering Combined Discovery & Processing...");
      const discovered = await discoverViaSitemap();
      // Only process a small amount to prevent Vercel 10s timeout
      const processed = await processQueue(2); 
      return NextResponse.json({ 
        success: true, 
        discovered, 
        processed, 
        message: "Discovery & processing complete." 
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Support GET for Vercel Cron
export async function GET(req: Request) {
  return POST(new Request(req.url, { method: "POST" }));
}
