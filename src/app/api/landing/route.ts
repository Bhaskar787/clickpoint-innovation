import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_NAVBAR_DATA, DEFAULT_SYSTEM_SETTINGS } from "@/data/default-navbar-data";
import { triggerReindexBackground } from "@/lib/reindex-trigger";

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
            systemSettings: DEFAULT_SYSTEM_SETTINGS,
          } as any,
        },
      });
    }

    const content = (landingRecord?.content || {}) as any;
    const rawNavbar = content.navbar || {};
    const navbar = {
      ...DEFAULT_NAVBAR_DATA,
      ...rawNavbar,
      services: {
        ...DEFAULT_NAVBAR_DATA.services,
        ...(rawNavbar.services || {}),
        featuredCard: {
          ...DEFAULT_NAVBAR_DATA.services?.featuredCard,
          ...(rawNavbar.services?.featuredCard || {}),
        },
      },
      industries: {
        ...DEFAULT_NAVBAR_DATA.industries,
        ...(rawNavbar.industries || {}),
      },
    };
    const systemSettings = {
      ...DEFAULT_SYSTEM_SETTINGS,
      ...(content.systemSettings || {}),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          ...content,
          navbar,
          systemSettings,
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
      {
        success: true,
        data: {
          navbar: DEFAULT_NAVBAR_DATA,
          systemSettings: DEFAULT_SYSTEM_SETTINGS,
        },
      },
      { status: 200 }
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
      const existingContent = (existing.content as any) || {};
      const mergedContent = {
        ...existingContent,
        ...body,
        systemSettings: {
          ...(existingContent.systemSettings || {}),
          ...(body.systemSettings || {}),
        },
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
    revalidatePath("/", "layout");
    triggerReindexBackground();

    return NextResponse.json({
      success: true,
      message: "Landing page & navbar configuration saved to database successfully!",
      data: updatedRecord.content,
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
