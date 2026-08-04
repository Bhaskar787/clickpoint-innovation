"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { DEFAULT_FAQS } from "@/data/default-faq-data";
import { FaqItem } from "@/types";

export const getFaqs = unstable_cache(
  async (): Promise<FaqItem[]> => {
    try {
      const rows = await prisma.faq.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: { category: { select: { id: true, name: true } } },
      });

      if (rows && rows.length > 0) {
        return rows.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          categoryId: f.categoryId,
          category: f.category.name,
          order: f.order,
        }));
      }
    } catch (err) {
      console.error("Failed to query FAQs from DB:", err);
    }
    return DEFAULT_FAQS;
  },
  ["faqs-data"],
  { revalidate: 60, tags: ["faqs"] }
);
