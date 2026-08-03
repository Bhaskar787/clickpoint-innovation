"use server";

import { requirePermission } from "@/lib/permissions";
import { ALL_PERMISSIONS } from "@/lib/permissions/constants";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { CaseStudyItem } from "@/types";

/**
 * Public Cached Case Studies Getter
 */
const getCaseStudiesCached = unstable_cache(
  async () => {
    return await prisma.caseStudy.findMany({
      orderBy: { order: "asc" },
    });
  },
  ["case-studies-public"],
  { revalidate: 300, tags: ["case-studies"] }
);

/**
 * Get Public Case Studies List (Cached)
 */
export async function getCaseStudies() {
  try {
    return await getCaseStudiesCached();
  } catch (error) {
    console.error("Failed to fetch case studies:", error);
    return [];
  }
}

/**
 * Get Case Study by Slug (Cached)
 */
export async function getCaseStudyBySlug(slug: string) {
  try {
    return await prisma.caseStudy.findUnique({
      where: { slug: slug.toLowerCase() },
    });
  } catch (error) {
    console.error(`Failed to fetch case study with slug '${slug}':`, error);
    return null;
  }
}

/**
 * Save / Update Case Study Project (Requires CMS_CASE_STUDIES_UPDATE)
 */
export async function saveCaseStudy(payload: Partial<CaseStudyItem> & { title: string; client: string; category: string; description: string }) {
  await requirePermission(ALL_PERMISSIONS.CMS_CASE_STUDIES_UPDATE);

  const slug = payload.slug
    ? payload.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    : payload.title.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const existing = await prisma.caseStudy.findUnique({
    where: { slug },
  });

  const caseStudyData = {
    slug,
    title: payload.title,
    client: payload.client,
    category: payload.category,
    description: payload.description,
    challenge: payload.challenge || null,
    solution: payload.solution || null,
    results: payload.results || null,
    metrics: payload.metrics ? (payload.metrics as any) : null,
    techStack: payload.techStack ? (payload.techStack as any) : null,
    imageUrl: payload.imageUrl || null,
    featured: payload.featured ?? false,
    order: payload.order ?? 0,
  };

  let result;
  if (existing) {
    result = await prisma.caseStudy.update({
      where: { slug },
      data: caseStudyData,
    });
  } else {
    result = await prisma.caseStudy.create({
      data: caseStudyData,
    });
  }

  revalidateTag("case-studies");

  return {
    success: true,
    id: result.id,
    slug: result.slug,
    message: existing ? "Case study updated successfully" : "Case study created successfully",
  };
}

/**
 * Delete Case Study (Requires CMS_CASE_STUDIES_UPDATE)
 */
export async function deleteCaseStudy(id: string) {
  await requirePermission(ALL_PERMISSIONS.CMS_CASE_STUDIES_UPDATE);

  await prisma.caseStudy.delete({
    where: { id },
  });

  revalidateTag("case-studies");

  return {
    success: true,
    message: "Case study deleted successfully",
  };
}
