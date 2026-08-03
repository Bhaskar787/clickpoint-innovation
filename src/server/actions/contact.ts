"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { DEFAULT_CONTACT_PAGE_DATA } from "@/data/default-contact-data";
import { ContactPageContent, ContactInquiryItem } from "@/types";

export const getContactPage = unstable_cache(
  async (): Promise<ContactPageContent> => {
    try {
      const record = await prisma.contactPage.findFirst();
      if (record && record.content) {
        return record.content as unknown as ContactPageContent;
      }
    } catch (err) {
      console.error("Failed to query contact page from DB:", err);
    }
    return DEFAULT_CONTACT_PAGE_DATA;
  },
  ["contact-page-data"],
  { revalidate: 60, tags: ["contact-page"] }
);

export async function getContactInquiries(): Promise<ContactInquiryItem[]> {
  try {
    const list = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return list.map((i) => ({
      id: i.id,
      name: i.name,
      email: i.email,
      phone: i.phone || undefined,
      company: i.company || undefined,
      service: i.service || undefined,
      budget: i.budget || undefined,
      message: i.message,
      ipAddress: i.ipAddress || undefined,
      isRead: i.isRead,
      createdAt: i.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("Failed to fetch contact inquiries:", err);
    return [];
  }
}

export async function markInquiryAsRead(id: string) {
  try {
    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: { isRead: true },
    });
    revalidateTag("contact-page");
    revalidatePath("/contact");
    revalidatePath("/admin/dashboard");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to mark inquiry as read" };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await prisma.contactInquiry.delete({ where: { id } });
    revalidateTag("contact-page");
    revalidatePath("/contact");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete inquiry" };
  }
}
