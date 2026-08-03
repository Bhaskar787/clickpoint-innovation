"use server";

import { requirePermission } from "@/lib/permissions";
import { ALL_PERMISSIONS } from "@/lib/permissions/constants";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { IndustryItem } from "@/types";
import { DEFAULT_INDUSTRIES_PAGE_DATA } from "@/data/default-industries-data";

export interface IndustriesPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  industries: IndustryItem[];
}

/**
 * Public Cached Industries Getter
 */
const getIndustriesPageCached = unstable_cache(
  async () => {
    const record = await prisma.industriesPage.findFirst();
    if (!record) return DEFAULT_INDUSTRIES_PAGE_DATA as unknown as IndustriesPageContent;

    return record.content as unknown as IndustriesPageContent;
  },
  ["industries-page-public"],
  { revalidate: 300, tags: ["industries-page"] }
);

/**
 * Get Public Industries Page Content (Cached)
 */
export async function getIndustriesPage() {
  try {
    return await getIndustriesPageCached();
  } catch (error) {
    console.error("Failed to fetch industries page content:", error);
    return DEFAULT_INDUSTRIES_PAGE_DATA as unknown as IndustriesPageContent;
  }
}

/**
 * Get Single Industry by Unique ID / Slug (Cached)
 */
export async function getIndustryBySlug(slug: string) {
  try {
    const pageData = await getIndustriesPage();
    if (!pageData || !pageData.industries) return null;

    const matched = pageData.industries.find(
      (ind: IndustryItem) => ind.id.toLowerCase() === slug.toLowerCase()
    );

    return matched || null;
  } catch (error) {
    console.error(`Failed to fetch industry with slug '${slug}':`, error);
    return null;
  }
}

/**
 * Save / Update Full Industries Page Content (Requires CMS_SERVICES_UPDATE)
 */
export async function saveIndustriesPage(payload: IndustriesPageContent) {
  await requirePermission(ALL_PERMISSIONS.CMS_SERVICES_UPDATE);

  const existingRecord = await prisma.industriesPage.findFirst();

  const result = await prisma.$transaction(async (tx) => {
    if (existingRecord) {
      return await tx.industriesPage.update({
        where: { id: existingRecord.id },
        data: {
          content: payload as any,
        },
      });
    } else {
      return await tx.industriesPage.create({
        data: {
          id: "default",
          content: payload as any,
        },
      });
    }
  });

  revalidateTag("industries-page");

  return {
    success: true,
    id: result.id,
    message: existingRecord ? "Industries content updated successfully" : "Industries content created successfully",
  };
}

/**
 * Delete / Remove Single Industry by ID (Requires CMS_SERVICES_UPDATE)
 */
export async function deleteIndustry(industryId: string) {
  await requirePermission(ALL_PERMISSIONS.CMS_SERVICES_UPDATE);

  const record = await prisma.industriesPage.findFirst();
  if (!record) {
    throw new Error("Industries page content not found");
  }

  const currentContent = record.content as unknown as IndustriesPageContent;
  const updatedIndustries = (currentContent.industries || []).filter(
    (ind: IndustryItem) => ind.id.toLowerCase() !== industryId.toLowerCase()
  );

  const updatedContent: IndustriesPageContent = {
    ...currentContent,
    industries: updatedIndustries,
  };

  await prisma.industriesPage.update({
    where: { id: record.id },
    data: {
      content: updatedContent as any,
    },
  });

  revalidateTag("industries-page");

  return {
    success: true,
    message: `Industry '${industryId}' deleted successfully`,
  };
}
