import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_NAVBAR_DATA } from "@/data/default-navbar-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    let landingRecord = await prisma.landingPage.findFirst();
    if (!landingRecord) {
      landingRecord = await prisma.landingPage.create({
        data: {
          id: "default",
          content: {
            navbar: DEFAULT_NAVBAR_DATA,
          } as any,
        },
      });
    }

    const content = (landingRecord?.content || {}) as any;
    const navbar = content.navbar || DEFAULT_NAVBAR_DATA;

    return NextResponse.json(
      {
        success: true,
        data: {
          ...content,
          navbar,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/landing error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch landing content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const existing = await prisma.landingPage.findFirst();
    let updatedRecord;

    if (existing) {
      const mergedContent = {
        ...((existing.content as any) || {}),
        ...body,
      };
      updatedRecord = await prisma.landingPage.update({
        where: { id: existing.id },
        data: { content: mergedContent },
      });
    } else {
      updatedRecord = await prisma.landingPage.create({
        data: { id: "default", content: body },
      });
    }

    revalidateTag("landing-page");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: updatedRecord.content,
      message: "Landing page & navbar configuration saved to database successfully!",
    });
  } catch (error: any) {
    console.error("PUT /api/landing error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save landing content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return PUT(req);
}
