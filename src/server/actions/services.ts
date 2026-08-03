"use server";

import { requirePermission } from "@/lib/permissions";
import { ALL_PERMISSIONS } from "@/lib/permissions/constants";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { ServicesPageContent, ServiceItem } from "@/types";

/**
 * Public Cached Services Catalog Getter
 */
const getServicesPageCached = unstable_cache(
  async () => {
    const record = await prisma.servicesPage.findFirst();
    if (!record) return null;

    return record.content as unknown as ServicesPageContent;
  },
  ["services-page-public"],
  { revalidate: 300, tags: ["services-page"] }
);

/**
 * Get Public Services Catalog (Cached)
 */
export async function getServicesPage() {
  try {
    return await getServicesPageCached();
  } catch (error) {
    console.error("Failed to fetch services page:", error);
    return null;
  }
}

/**
 * Get Single Service by Unique ID / Slug (Cached)
 */
export async function getServiceBySlug(slug: string) {
  try {
    const pageData = await getServicesPage();
    if (!pageData || !pageData.services) return null;

    const matchedService = pageData.services.find(
      (s: ServiceItem) => s.id.toLowerCase() === slug.toLowerCase()
    );

    return matchedService || null;
  } catch (error) {
    console.error(`Failed to fetch service with slug '${slug}':`, error);
    return null;
  }
}

/**
 * Get Admin Services Catalog (Requires CMS_SERVICES_READ)
 */
export async function getServicesForAdmin() {
  await requirePermission(ALL_PERMISSIONS.CMS_SERVICES_READ);

  const record = await prisma.servicesPage.findFirst();
  if (!record) return null;

  return {
    id: record.id,
    content: record.content as unknown as ServicesPageContent,
    updatedAt: record.updatedAt,
  };
}

/**
 * Save / Update Full Services Page & Catalog (Requires CMS_SERVICES_UPDATE)
 */
export async function saveServicesPage(payload: ServicesPageContent) {
  await requirePermission(ALL_PERMISSIONS.CMS_SERVICES_UPDATE);

  const existingRecord = await prisma.servicesPage.findFirst();

  const result = await prisma.$transaction(async (tx) => {
    if (existingRecord) {
      return await tx.servicesPage.update({
        where: { id: existingRecord.id },
        data: {
          content: payload as any,
        },
      });
    } else {
      return await tx.servicesPage.create({
        data: {
          id: "default",
          content: payload as any,
        },
      });
    }
  });

  revalidateTag("services-page");

  return {
    success: true,
    id: result.id,
    message: existingRecord ? "Services page updated successfully" : "Services page created successfully",
  };
}

/**
 * Delete / Remove Single Service Item by ID (Requires CMS_SERVICES_UPDATE)
 */
export async function deleteService(serviceId: string) {
  await requirePermission(ALL_PERMISSIONS.CMS_SERVICES_UPDATE);

  const record = await prisma.servicesPage.findFirst();
  if (!record) {
    throw new Error("Services page content not found");
  }

  const currentContent = record.content as unknown as ServicesPageContent;
  const updatedServices = (currentContent.services || []).filter(
    (s: ServiceItem) => s.id.toLowerCase() !== serviceId.toLowerCase()
  );

  const updatedContent: ServicesPageContent = {
    ...currentContent,
    services: updatedServices,
  };

  await prisma.servicesPage.update({
    where: { id: record.id },
    data: {
      content: updatedContent as any,
    },
  });

  revalidateTag("services-page");

  return {
    success: true,
    message: `Service '${serviceId}' deleted successfully`,
  };
}
