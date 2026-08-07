"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Code2,
  Palette,
  LineChart,
  Boxes,
  Cpu,
  Layers,
} from "lucide-react";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";
import { SERVICES_DATA } from "@/data/landing-data";

// Number of services shown in the homepage preview grid before linking out to /services
const HOMEPAGE_SERVICES_PREVIEW_COUNT = 6;

// Fallback icon lookup keyed by known service ids (matches admin-seeded defaults);
// unknown/custom services added later in admin cycle through the fallback list below.
const SERVICE_ICON_MAP: Record<string, any> = {
  "ai-eng": Bot,
  "web-dev": Code2,
  "ui-ux": Palette,
  growth: LineChart,
  "platform-mod": Boxes,
  mlops: Cpu,
};
const FALLBACK_ICONS = [Layers, Boxes, Code2, Cpu, LineChart, Palette];

function resolveServiceIcon(id: string, idx: number) {
  return SERVICE_ICON_MAP[id] || FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
}

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

  const displayItems = services.slice(0, HOMEPAGE_SERVICES_PREVIEW_COUNT);

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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((s, idx) => {
            const Icon = s.icon || resolveServiceIcon(s.id, idx);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={`/services/${s.id}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-sm shadow-violet-950/[0.03] transition-colors hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-50 dark:bg-slate-800/50 transition-transform duration-500 group-hover:scale-150" />
                  <div className="relative">
                    {Icon && (
                      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 transition-colors group-hover:bg-violet-600 group-hover:text-white shadow-sm">
                        <Icon className="h-5 w-5" />
                      </span>
                    )}
                    <h3 className="mb-2 flex items-center gap-1.5 card-title text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                      {s.title}
                      <ArrowUpRight className="h-4 w-4 -translate-y-0.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 text-violet-600 dark:text-violet-300" />
                    </h3>
                    <p className="card-body text-ink/65 dark:text-slate-300">{s.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-fluid-xs font-bold text-violet-600 dark:text-violet-300 group-hover:translate-x-1 transition-transform">
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
