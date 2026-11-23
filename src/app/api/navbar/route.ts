import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_NAVBAR_DATA } from "@/data/default-navbar-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const landingRecord = await prisma.landingPage.findFirst();
    const servicesRecord = await prisma.servicesPage.findFirst().catch(() => null);
    const industriesRecord = await prisma.industriesPage.findFirst().catch(() => null);

    const allServices = (servicesRecord?.content as any)?.services || [];
    const allIndustries = (industriesRecord?.content as any)?.industries || [];

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
      allServices,
      allIndustries,
    };

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const navbar = body.navbar || body;

    const existing = await prisma.landingPage.findFirst();
    let updatedRecord;

    if (existing) {
      const existingContent = (existing.content as any) || {};
      const existingNavbar = existingContent.navbar || {};

      const mergedNavbar = {
        ...DEFAULT_NAVBAR_DATA,
        ...existingNavbar,
        ...navbar,
        services: {
          ...DEFAULT_NAVBAR_DATA.services,
          ...(existingNavbar.services || {}),
          ...(navbar.services || {}),
          featuredCard: {
            ...DEFAULT_NAVBAR_DATA.services?.featuredCard,
            ...(existingNavbar.services?.featuredCard || {}),
            ...(navbar.services?.featuredCard || {}),
          },
        },
        industries: {
          ...DEFAULT_NAVBAR_DATA.industries,
          ...(existingNavbar.industries || {}),
          ...(navbar.industries || {}),
        },
      };
      const mergedContent = {
        ...existingContent,
        navbar: mergedNavbar,
      };
      updatedRecord = await prisma.landingPage.update({
        where: { id: existing.id },
        data: { content: mergedContent },
      });
    } else {
      updatedRecord = await prisma.landingPage.create({
        data: {
          id: "default",
          content: {
            navbar,
          },
        },
      });
    }

    revalidateTag("landing-page");
    revalidatePath("/", "layout");

    const content = (updatedRecord?.content || {}) as any;
    return NextResponse.json({ success: true, navbar: content.navbar || navbar });
  } catch (error: any) {
    console.error("PUT /api/navbar error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
