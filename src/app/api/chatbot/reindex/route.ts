import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // Allow up to 120s for full vector reindexing

export async function POST(req: Request) {
  try {
    if (process.env.VERCEL && (!process.env.INGESTION_SERVICE_URL || process.env.INGESTION_SERVICE_URL.includes("localhost"))) {
      return NextResponse.json({
        success: true,
        message: "Live Supabase database RAG is active on Vercel. Full external vector re-indexing is reserved for dedicated container clusters.",
      });
    }

    const ingestionUrl = process.env.INGESTION_SERVICE_URL || "http://localhost:8001";
    const apiKey = process.env.INTERNAL_API_KEY || "clickpoint-secret-internal-key-2026";

    // Reindexing across all 13 tables & vector embedding generation typically takes 15-35 seconds
    const res = await fetch(`${ingestionUrl}/reindex`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": apiKey,
      },
      signal: AbortSignal.timeout(120000), // 120 seconds
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: "Failed to trigger reindexing", details: errText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Reindex API error:", error);
    return NextResponse.json(
      { error: "Internal server error triggering reindex", details: error.message },
      { status: 500 }
    );
  }
}
