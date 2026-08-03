"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { DEFAULT_TESTIMONIALS_PAGE_DATA } from "@/data/default-testimonials-data";
import { TestimonialItem, TestimonialsPageContent } from "@/types";

export const getTestimonialsPage = unstable_cache(
  async (): Promise<TestimonialsPageContent> => {
    try {
      const record = await prisma.testimonialsPage.findFirst();
      if (record && record.content) {
        return record.content as unknown as TestimonialsPageContent;
      }
    } catch (err) {
      console.error("Failed to query testimonials page from DB:", err);
    }
    return DEFAULT_TESTIMONIALS_PAGE_DATA;
  },
  ["testimonials-page-data"],
  { revalidate: 60, tags: ["testimonials-page"] }
);

export async function getApprovedTestimonials(): Promise<TestimonialItem[]> {
  try {
    const list = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });

    if (list.length > 0) {
      return list.map((t) => ({
        id: t.id,
        clientName: t.clientName,
        clientRole: t.clientRole,
        company: t.company,
        content: t.content,
        rating: t.rating,
        avatarUrl: t.avatarUrl || undefined,
        featured: t.featured,
        isApproved: t.isApproved,
        isRead: t.isRead,
        createdAt: t.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    console.error("Failed to fetch approved testimonials:", err);
  }

  return DEFAULT_TESTIMONIALS_PAGE_DATA.testimonials || [];
}

export async function approveTestimonial(id: string, isApproved: boolean) {
  try {
    const updated = await prisma.testimonial.update({
      where: { id },
      data: { isApproved, isRead: true },
    });
    revalidateTag("testimonials-page");
    revalidatePath("/");
    revalidatePath("/testimonials");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update approval status" };
  }
}

export async function markTestimonialAsRead(id: string) {
  try {
    const updated = await prisma.testimonial.update({
      where: { id },
      data: { isRead: true },
    });
    revalidateTag("testimonials-page");
    revalidatePath("/");
    revalidatePath("/testimonials");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to mark review as read" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidateTag("testimonials-page");
    revalidatePath("/");
    revalidatePath("/testimonials");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete review" };
  }
}
