import { prisma } from "@/lib/prisma";
import { SERVICES_DATA } from "@/data/landing-data";
import ServiceDetailClient from "./service-detail-client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

interface ServicePageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  try {
    const dbRecord = await prisma.servicesPage.findUnique({
      where: { id: "default" },
    });
    if (dbRecord && dbRecord.content) {
      const content = dbRecord.content as any;
      if (Array.isArray(content.services)) {
        return content.services.map((svc: any) => ({ id: svc.id }));
      }
    }
  } catch (e) {
    // Fallback to static landing data
  }

  return SERVICES_DATA.map((service) => ({
    id: service.id,
  }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  let targetService: any = null;

  try {
    const dbRecord = await prisma.servicesPage.findUnique({
      where: { id: "default" },
    });

    if (dbRecord && dbRecord.content) {
      const content = dbRecord.content as any;
      if (Array.isArray(content.services)) {
        targetService = content.services.find((s: any) => s.id === params.id) || null;
      }
    }
  } catch (error) {
    console.error("Failed to query service detail from DB:", error);
  }

  // Fallback to static landing data if not found in DB
  if (!targetService) {
    const raw = SERVICES_DATA.find((s) => s.id === params.id) || null;
    if (raw) {
      const { icon, ...cleanRaw } = raw as any;
      targetService = cleanRaw;
    }
  } else {
    // Ensure any icon property from older records is removed
    const { icon, ...cleanTarget } = targetService;
    targetService = cleanTarget;
  }

  return (
    <ServiceDetailClient initialService={targetService} serviceId={params.id} />
  );
}
