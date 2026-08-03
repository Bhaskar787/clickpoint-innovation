"use server";

import { requirePermission } from "@/lib/permissions";
import { ALL_PERMISSIONS } from "@/lib/permissions/constants";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { AboutPageContent } from "@/types";

export interface AboutUsHighlight {
  label: string;
  value: string;
}

export interface AboutUsValue {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface AboutUsProcessStep {
  id?: string;
  title: string;
  description: string;
  order?: number;
  isActive?: boolean;
}

export interface AboutUsCraftItem {
  id?: string;
  title: string;
  description: string;
  order?: number;
  isActive?: boolean;
}

export interface AboutUsPayload {
  // Hero Section
  badge?: string;
  title?: string;
  highlightTitle?: string;
  subtitle?: string;
  videoUrl?: string;

  // Mission & Core Values Section
  missionTag?: string;
  missionTitle?: string;
  missionSubtitle?: string;
  missionBullets?: string[];
  values?: AboutUsValue[];

  // Stats Section
  statsTag?: string;
  statsTitle?: string;
  statsSubtitle?: string;

  // Leadership Team Section
  leadershipTag?: string;
  leadershipTitle?: string;
  leadershipHighlightTitle?: string;
  leadershipSubtitle?: string;

  // Full Content JSON fallback
  content?: AboutPageContent;

  isPublished?: boolean;
}

/**
 * Public Cached About Us Data Getter
 */
const getAboutUsCached = unstable_cache(
  async () => {
    const aboutRecord = await prisma.aboutPage.findFirst();
    if (!aboutRecord) return null;

    return aboutRecord.content as unknown as AboutPageContent;
  },
  ["about-us-public"],
  { revalidate: 300, tags: ["about-us"] }
);

/**
 * Get Public About Us Page Content (Cached)
 */
export async function getAboutUs() {
  try {
    return await getAboutUsCached();
  } catch (error) {
    console.error("Failed to fetch about us content:", error);
    return null;
  }
}

/**
 * Get Admin About Us Page Content (Requires CMS_ABOUT_READ)
 */
export async function getAboutUsForAdmin() {
  await requirePermission(ALL_PERMISSIONS.CMS_ABOUT_READ);

  const aboutRecord = await prisma.aboutPage.findFirst();
  if (!aboutRecord) return null;

  return {
    id: aboutRecord.id,
    content: aboutRecord.content as unknown as AboutPageContent,
    updatedAt: aboutRecord.updatedAt,
  };
}

/**
 * Save / Update About Us Page Content (Requires CMS_ABOUT_UPDATE)
 */
export async function saveAboutUs(payload: AboutUsPayload | AboutPageContent) {
  await requirePermission(ALL_PERMISSIONS.CMS_ABOUT_UPDATE);

  const existingAboutUs = await prisma.aboutPage.findFirst();

  // Standardize content object structure
  const contentToSave = "hero" in payload ? payload : payload.content;

  if (!contentToSave) {
    throw new Error("Invalid payload: Missing About Us content structure.");
  }

  const result = await prisma.$transaction(async (tx) => {
    if (existingAboutUs) {
      return await tx.aboutPage.update({
        where: { id: existingAboutUs.id },
        data: {
          content: contentToSave as any,
        },
      });
    } else {
      return await tx.aboutPage.create({
        data: {
          id: "default",
          content: contentToSave as any,
        },
      });
    }
  });

  // Revalidate public static tags cache
  revalidateTag("about-us");

  return {
    success: true,
    id: result.id,
    message: existingAboutUs ? "About Us page updated successfully" : "About Us page created successfully",
  };
}

/**
 * Delete About Us Content (Requires CMS_ABOUT_UPDATE)
 */
export async function deleteAboutUs() {
  await requirePermission(ALL_PERMISSIONS.CMS_ABOUT_UPDATE);

  const existingAboutUs = await prisma.aboutPage.findFirst();

  if (!existingAboutUs) {
    throw new Error("About Us content not found");
  }

  await prisma.aboutPage.delete({
    where: { id: existingAboutUs.id },
  });

  revalidateTag("about-us");

  return {
    success: true,
    message: "About Us content reset successfully",
  };
}
