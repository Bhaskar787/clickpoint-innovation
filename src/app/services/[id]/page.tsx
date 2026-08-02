import { SERVICES_DATA } from "@/data/landing-data";
import ServiceDetailClient from "./service-detail-client";

interface ServicePageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({
    id: service.id,
  }));
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const rawService = SERVICES_DATA.find((s) => s.id === params.id) || null;
  const initialService = rawService ? { ...rawService, icon: undefined } : null;

  return (
    <ServiceDetailClient initialService={initialService} serviceId={params.id} />
  );
}
