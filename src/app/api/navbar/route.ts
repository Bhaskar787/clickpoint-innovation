import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_NAVBAR_DATA } from "@/data/default-navbar-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const landingRecord = await prisma.landingPage.findFirst();
    const content = (landingRecord?.content || {}) as any;
    const navbar = content.navbar || DEFAULT_NAVBAR_DATA;

    return NextResponse.json(
      { success: true, navbar },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/navbar error:", error);
    return NextResponse.json({ success: true, navbar: DEFAULT_NAVBAR_DATA });
  }
}
