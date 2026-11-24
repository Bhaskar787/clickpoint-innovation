"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
} from "lucide-react";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";
import { INDUSTRIES_DATA } from "@/data/landing-data";
import { IndustryIcon } from "@/components/ui/industry-icon";

// Number of industries shown in the homepage preview grid before linking out to /industries
const HOMEPAGE_INDUSTRIES_PREVIEW_COUNT = 6;

interface IndustriesSectionProps {
  initialHeader?: any;
  initialIndustries?: any[];
}

export default function IndustriesSection({ initialHeader, initialIndustries }: IndustriesSectionProps = {}) {
  const [industriesHeader, setIndustriesHeader] = useState(
    initialHeader || DEFAULT_LANDING_DATA.industriesHeader
  );
  const [industries, setIndustries] = useState<any[]>(
    initialIndustries && initialIndustries.length > 0 ? initialIndustries : INDUSTRIES_DATA
  );

  useEffect(() => {
    async function loadDynamicIndustriesHeader() {
      try {
        const res = await fetch("/api/landing");
        const json = await res.json();
        if (json.success && json.data && json.data.industriesHeader) {
          setIndustriesHeader({ ...DEFAULT_LANDING_DATA.industriesHeader, ...json.data.industriesHeader });
        }
      } catch (err) {
        console.warn("Using default industries header content:", err);
      }
    }

    async function loadDynamicIndustriesCatalog() {
      try {
        const res = await fetch("/api/industries");
        const json = await res.json();
        if (json.success && json.data && Array.isArray(json.data.industries) && json.data.industries.length > 0) {
          setIndustries(json.data.industries);
        }
      } catch (err) {
        console.warn("Using default industries catalog content:", err);
      }
    }

    if (!initialHeader) loadDynamicIndustriesHeader();
    if (!initialIndustries || initialIndustries.length === 0) loadDynamicIndustriesCatalog();
  }, [initialHeader, initialIndustries]);

  const selectedIds: string[] = industriesHeader?.selectedIndustryIds || [];
  const displayItems = (
    selectedIds.length > 0
      ? industries.filter((ind) => selectedIds.includes(ind.id))
      : industries
  ).slice(0, HOMEPAGE_INDUSTRIES_PREVIEW_COUNT);

  return (
    <section id="industries" className="relative py-20 lg:py-28 bg-cloud-100/70 dark:bg-[#0f172a]/50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <div className="section-badge mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-violet-600 dark:text-violet-300">
            <Building2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
            {industriesHeader.badge}
          </div>
          <h2 className="section-title text-ink dark:text-white">
            {industriesHeader.title}{" "}
            <span className="text-violet-600 dark:text-[#f58220]">{industriesHeader.titleHighlight}</span>
          </h2>
          <p className="mt-3 section-subtitle text-ink/70 dark:text-slate-300">
            {industriesHeader.subtitle}
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((ind, idx) => {
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                className="h-full"
              >
                <div className="h-full group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-sm transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1.5">
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100/80 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100/50 dark:border-slate-700 group-hover:bg-violet-600 group-hover:text-white transition-colors shadow-sm">
                      <IndustryIcon
                        icon={ind.icon}
                        iconName={ind.iconName}
                        industryId={ind.id}
                        fallbackIndex={idx}
                        className="h-6 w-6 text-violet-600 dark:text-violet-300 group-hover:text-white transition-colors"
                      />
                    </span>
                    {ind.keyMetrics?.[0] && (
                      <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-2.5 py-1 text-fluid-2xs font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                        {ind.keyMetrics[0].value} {ind.keyMetrics[0].label}
                      </span>
                    )}
                  </div>

                  <h3 className="card-title text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {ind.title}
                  </h3>

                  <p className="mt-2 card-body text-ink/65 dark:text-slate-300">
                    {ind.desc}
                  </p>

                  {/* Capability / Solution Pills (Image 2 Match: Clean subtle pills, 2 items + count, no green text) */}
                  {(() => {
                    const rawTags: string[] = (
                      ind.cardTags && ind.cardTags.length > 0
                        ? ind.cardTags
                        : ind.solutions && ind.solutions.length > 0
                        ? ind.solutions.map((s: any) => (typeof s === "string" ? s : s.title))
                        : (ind.projects || []).map((p: any) => p.title)
                    ).filter(Boolean);

                    const displayTags = rawTags.slice(0, 2);
                    const remainingCount = Math.max(0, rawTags.length - 2);

                    if (displayTags.length === 0) return null;

                    return (
                      <div className="mt-5 space-y-2">
                        {displayTags[0] && (
                          <div>
                            <span className="inline-flex items-center rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
                              {displayTags[0]}
                            </span>
                          </div>
                        )}
                        {displayTags[1] && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
                              {displayTags[1]}
                            </span>
                            {remainingCount > 0 && (
                              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                                +{remainingCount}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Bottom Action Link (Single Selective URL) */}
                {(() => {
                  let targetUrl = `/portfolio/${ind.id}`;
                  let linkLabel = ind.cardCustomLabel || "Explore Sector Solutions";

                  if (ind.cardLinkType === "custom" && ind.cardCustomUrl) {
                    targetUrl = ind.cardCustomUrl;
                  } else if (ind.cardLinkType === "project") {
                    const selectedProj =
                      ind.projects?.find(
                        (p: any) => p.id === ind.selectedProjectId || p.title === ind.selectedProjectId
                      ) || ind.projects?.find((p: any) => p.liveUrl);

                    if (selectedProj?.liveUrl) {
                      targetUrl = selectedProj.liveUrl;
                      if (!ind.cardCustomLabel) {
                        linkLabel = `View ${selectedProj.title || "Project"}`;
                      }
                    }
                  } else if (ind.cardCustomUrl) {
                    targetUrl = ind.cardCustomUrl;
                  } else if (ind.href) {
                    targetUrl = ind.href;
                  }

                  const isExternal = targetUrl.startsWith("http://") || targetUrl.startsWith("https://");

                  return (
                    <div className="mt-8 pt-4 border-t border-violet-100 dark:border-slate-800">
                      {isExternal ? (
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-fluid-xs font-bold text-violet-600 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200 transition-colors group/link"
                        >
                          <span>{linkLabel}</span>
                          <ArrowUpRight className="h-4 w-4 text-violet-600 dark:text-violet-300 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      ) : (
                        <Link
                          href={targetUrl}
                          className="inline-flex items-center gap-1.5 text-fluid-xs font-bold text-violet-600 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200 transition-colors group/link"
                        >
                          <span>{linkLabel}</span>
                          <ArrowUpRight className="h-4 w-4 text-violet-600 dark:text-violet-300 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
