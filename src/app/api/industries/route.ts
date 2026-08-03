import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_INDUSTRIES_PAGE_DATA } from "@/data/default-industries-data";

/**
 * Strips Lucide component functions / non-serializable objects before JSON response
 */
function sanitizeIndustriesData(data: any) {
  if (!data) return data;
  const clone = JSON.parse(JSON.stringify(data));
  if (clone.industries && Array.isArray(clone.industries)) {
    clone.industries = clone.industries.map((ind: any) => {
      const { icon, ...rest } = ind;
      return rest;
    });
  }
  return clone;
}

// GET /api/industries — Fetch Industries Page Content from DB (or seed defaults)
export async function GET() {
  try {
    let pageRecord = await prisma.industriesPage.findFirst();

    if (!pageRecord) {
      console.log("No industries page found in DB. Seeding default content...");
      pageRecord = await prisma.industriesPage.create({
        data: {
          id: "default",
          content: DEFAULT_INDUSTRIES_PAGE_DATA as any,
        },
      });
    }

    const sanitizedContent = sanitizeIndustriesData(pageRecord.content);

    return NextResponse.json({
      success: true,
      data: sanitizedContent,
      updatedAt: pageRecord.updatedAt,
    });
  } catch (error: any) {
    console.error("GET /api/industries error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch industries page content",
        fallback: sanitizeIndustriesData(DEFAULT_INDUSTRIES_PAGE_DATA),
      },
      { status: 500 }
    );
  }
}

// PUT /api/industries — Update Industries Page Content in DB
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.hero || !Array.isArray(body.industries)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload structure" },
        { status: 400 }
      );
    }

    const existing = await prisma.industriesPage.findFirst();

    const sanitizedToSave = sanitizeIndustriesData(body);

    let updatedRecord;
    if (existing) {
      updatedRecord = await prisma.industriesPage.update({
        where: { id: existing.id },
        data: {
          content: sanitizedToSave as any,
        },
      });
    } else {
      updatedRecord = await prisma.industriesPage.create({
        data: {
          id: "default",
          content: sanitizedToSave as any,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: sanitizeIndustriesData(updatedRecord.content),
      message: "Industries content saved successfully to database",
    });
  } catch (error: any) {
    console.error("PUT /api/industries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save industries content" },
      { status: 500 }
    );
  }
}
