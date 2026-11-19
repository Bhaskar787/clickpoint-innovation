"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { DEFAULT_JOURNEY_PAGE_DATA } from "@/data/default-journey-data";
import { JourneyPageContent } from "@/types";

export const getJourneyPage = unstable_cache(
  async (): Promise<JourneyPageContent> => {
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
        return content;
      }
    } catch (err) {
      console.error("Failed to query journey page from DB:", err);
    }
    return DEFAULT_JOURNEY_PAGE_DATA;
  },
  ["journey-page-data"],
  { revalidate: 60, tags: ["journey-page"] }
);

export async function updateJourneyPage(content: JourneyPageContent) {
  try {
    const existing = await prisma.journeyPage.findFirst();
    let updated;
    if (existing) {
      updated = await prisma.journeyPage.update({
        where: { id: existing.id },
        data: { content: content as any },
      });
    } else {
      updated = await prisma.journeyPage.create({
        data: { id: "default", content: content as any },
      });
    }

    revalidateTag("journey-page");
    revalidatePath("/journey");
    revalidatePath("/events");
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update journey page" };
  }
}
