"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { DEFAULT_FAQS } from "@/data/default-faq-data";
import { FaqCategory } from "@/types";

// Ordered list of FAQ categories, used by the public /faqs page to render
// category tabs in the same order the admin arranges them in the dashboard.
export const getFaqCategories = unstable_cache(
  async (): Promise<FaqCategory[]> => {
    try {
      const rows = await prisma.faqCategory.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      });

      if (rows && rows.length > 0) {
        return rows.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          order: c.order,
        }));
      }
    } catch (err) {
      console.error("Failed to query FAQ categories from DB:", err);
    }

    // Fallback: derive categories from the default FAQ data, preserving
    // first-appearance order.
    const seen = new Set<string>();
    return DEFAULT_FAQS.filter((f) => {
      if (seen.has(f.category)) return false;
      seen.add(f.category);
      return true;
    }).map((f, i) => ({ id: f.categoryId, name: f.category, order: i }));
  },
  ["faq-categories-data"],
  { revalidate: 60, tags: ["faq-categories"] }
);
