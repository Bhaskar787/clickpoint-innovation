import { getServiceBySlug } from "@/server/actions/services";
import { SERVICES_DATA } from "@/data/landing-data";
import ServiceDetailClient from "./service-detail-client";

export const dynamicParams = true;
export const revalidate = 60;

interface ServicePageProps {
  params: {
    id: string;
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  let targetService: any = await getServiceBySlug(params.id);

  // Fallback to static landing data if not found in DB
  if (!targetService) {
    const raw = SERVICES_DATA.find((s) => s.id === params.id) || null;
    if (raw) {
      const { icon, ...cleanRaw } = raw as any;
      const iconStr = typeof icon === "string" ? icon : (raw.iconName || "");
      targetService = {
        ...cleanRaw,
        icon: iconStr,
        iconName: iconStr,
      };
    }
  } else {
    const iconStr = typeof targetService.icon === "string"
      ? targetService.icon
      : (typeof targetService.iconName === "string" ? targetService.iconName : "");
    const { icon, ...cleanTarget } = targetService;
    targetService = {
      ...cleanTarget,
      icon: iconStr,
      iconName: iconStr,
    };
  }

  return (
    <ServiceDetailClient initialService={targetService} serviceId={params.id} />
  );
}
