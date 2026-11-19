import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_JOURNEY_PAGE_DATA } from "@/data/default-journey-data";
import { JourneyPageContent } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { triggerReindexBackground } from "@/lib/reindex-trigger";

export async function GET() {
  try {
    const record = await prisma.journeyPage.findFirst();
    if (record && record.content) {
      const content = record.content as unknown as JourneyPageContent;
      if (content && Array.isArray(content.events)) {
        content.events = content.events.map((e) => {
          if (!e.images || e.images.length === 0) {
            const defMatch = DEFAULT_JOURNEY_PAGE_DATA.events?.find(
              (d) => d.id === e.id || d.title.toLowerCase() === e.title.toLowerCase()
            );
            return {
              ...e,
              images: defMatch?.images?.length ? defMatch.images : (e.imageUrl ? [e.imageUrl] : []),
            };
          }
          return e;
        });
      }
      return NextResponse.json({ success: true, data: content });
    }
  } catch (err) {
    console.error("Failed to query journey page from DB:", err);
  }

  return NextResponse.json({ success: true, data: DEFAULT_JOURNEY_PAGE_DATA });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = await prisma.journeyPage.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.journeyPage.update({
        where: { id: existing.id },
        data: { content: body as any },
      });
    } else {
      updated = await prisma.journeyPage.create({
        data: { id: "default", content: body as any },
      });
    }

    revalidateTag("journey-page");
    revalidatePath("/journey");
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    triggerReindexBackground();

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update journey page" },
      { status: 500 }
    );
  }
}
