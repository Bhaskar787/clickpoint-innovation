"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
} from "lucide-react";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";
import { SERVICES_DATA } from "@/data/landing-data";
import { ServiceIcon } from "@/components/ui/industry-icon";

// Number of services shown in the homepage preview grid before linking out to /services
const HOMEPAGE_SERVICES_PREVIEW_COUNT = 6;

interface ServicesProps {
  initialHeader?: any;
  initialServices?: any[];
}

export default function Services({ initialHeader, initialServices }: ServicesProps = {}) {
  const [servicesHeader, setServicesHeader] = useState(
    initialHeader || DEFAULT_LANDING_DATA.servicesHeader
  );
  const [services, setServices] = useState<any[]>(
    initialServices && initialServices.length > 0 ? initialServices : SERVICES_DATA
  );

  useEffect(() => {
    async function loadDynamicServicesHeader() {
      try {
        const res = await fetch("/api/landing");
        const json = await res.json();
        if (json.success && json.data && json.data.servicesHeader) {
          setServicesHeader({ ...DEFAULT_LANDING_DATA.servicesHeader, ...json.data.servicesHeader });
        }
      } catch (err) {
        console.warn("Using default services header content:", err);
      }
    }

    async function loadDynamicServicesCatalog() {
      try {
        const res = await fetch("/api/services");
        const json = await res.json();
        if (json.success && json.data && Array.isArray(json.data.services) && json.data.services.length > 0) {
          setServices(json.data.services);
        }
      } catch (err) {
        console.warn("Using default services catalog content:", err);
      }
    }

    if (!initialHeader) loadDynamicServicesHeader();
    if (!initialServices || initialServices.length === 0) loadDynamicServicesCatalog();
  }, [initialHeader, initialServices]);

  const displayItems = (
    Array.isArray(servicesHeader?.selectedServiceIds) && servicesHeader.selectedServiceIds.length > 0
      ? servicesHeader.selectedServiceIds
          .map((id: string) => services.find((s: any) => s.id === id))
          .filter(Boolean)
      : services
  ).slice(0, HOMEPAGE_SERVICES_PREVIEW_COUNT);

  return (
    <section id="services" className="relative py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="section-badge mb-3 text-violet-600 dark:text-violet-300">
            {servicesHeader.badge}
          </p>
          <h2 className="section-title text-ink dark:text-white">
            {servicesHeader.title}{" "}
            <span className="text-violet-600 dark:text-[#f58220]">{servicesHeader.titleHighlight}</span>
          </h2>
          {servicesHeader.subtitle && (
            <p className="mt-3 section-subtitle text-ink/70 dark:text-slate-300">
              {servicesHeader.subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((s: any, idx: number) => {
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05, ease: "easeOut" }}
                className="h-full"
              >
                <Link
                  href={`/services/${s.id}`}
                  className="group relative block h-full rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 shadow-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-white/[0.16] hover:-translate-y-0.5"
                >
                  <div>
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-violet-100 dark:bg-white/[0.06] text-violet-600 dark:text-violet-300 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                      <ServiceIcon
                        icon={s.icon}
                        iconName={s.iconName}
                        serviceId={s.id}
                        fallbackIndex={idx}
                        className="h-5 w-5 text-violet-600 dark:text-violet-300 group-hover:text-white transition-colors"
                      />
                    </span>
                    <h3 className="mb-2 flex items-center gap-1.5 card-title text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                      {s.title}
                      <ArrowUpRight className="h-4 w-4 -translate-y-0.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 text-violet-600 dark:text-violet-300" />
                    </h3>
                    <p className="card-body text-ink/70 dark:text-slate-300">{s.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-violet-600 dark:text-violet-300 group-hover:translate-x-1 transition-transform">
                      {s.buttonText || "Learn More & Details"} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
