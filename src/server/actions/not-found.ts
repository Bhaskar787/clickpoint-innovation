"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { NotFoundPageContent } from "@/types";
import { DEFAULT_NOT_FOUND_DATA } from "@/data/default-not-found-data";

export const getNotFoundPage = unstable_cache(
  async (): Promise<NotFoundPageContent> => {
    try {
      const record = await prisma.notFoundPage.findFirst();
      if (record && record.content) {
        return record.content as unknown as NotFoundPageContent;
      }
    } catch (err) {
      console.error("Failed to query 404 page from DB:", err);
    }
    return DEFAULT_NOT_FOUND_DATA;
  },
  ["not-found-page-data"],
  { revalidate: 60, tags: ["not-found-page"] }
);

export async function updateNotFoundPage(content: NotFoundPageContent) {
  try {
    const existing = await prisma.notFoundPage.findFirst();
    let updated;
    if (existing) {
      updated = await prisma.notFoundPage.update({
        where: { id: existing.id },
        data: { content: content as any },
      });
    } else {
      updated = await prisma.notFoundPage.create({
        data: { id: "default", content: content as any },
      });
    }

    revalidateTag("not-found-page");
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update 404 page" };
  }
}