"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, ChevronRight } from "lucide-react";
import { IndustriesPageContent, IndustryItem } from "@/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTASection from "@/components/sections/cta-section";

interface IndustriesCatalogClientProps {
  initialContent: IndustriesPageContent;
}

export default function IndustriesCatalogClient({ initialContent }: IndustriesCatalogClientProps) {
  const hero = initialContent?.hero || {
    badge: "Industry Domain Solutions",
    title: "Tailored Engineering for High-Growth Enterprise Sectors",
    subtitle:
      "Deep domain expertise, SOC2 & HIPAA compliant security models, and specialized AI infrastructure built for mission-critical industries.",
  };

  const industriesList = initialContent?.industries || [];

  return (
    <main className="relative overflow-hidden bg-white dark:bg-[#0b0f19]">
      <Navbar />
      {/* Background Glow Overlay */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/10 via-indigo-500/5 to-transparent blur-3xl" />

      {/* Main Hero Header */}
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-16 border-b border-violet-100/70 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* LEFT-ALIGNED BREADCRUMB ROUTE */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Portfolio</span>
          </div>

          {/* CENTER-ALIGNED HERO CONTENT */}
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-300 text-xs font-extrabold uppercase tracking-widest shadow-xs"
            >
              <Building2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge || "Industry Domain Solutions"}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
            >
              {hero.title ? (
                <>
                  {hero.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-violet-400">
                    {hero.title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  Tailored Engineering for{" "}
                  <span className="text-violet-600 dark:text-violet-400">
                    High-Growth Sectors
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed pt-1"
            >
              {hero.subtitle}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Dynamic Industry Sectors Catalog Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {industriesList.map((ind: IndustryItem, idx: number) => {
              const projectCount = ind.projects?.length || 0;
              return (
                <motion.div
                  key={ind.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                  className="h-full"
                >
                  <div className="h-full group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100/90 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 sm:p-7 shadow-xs transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-600/10 hover:-translate-y-1">
                    <div>
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full border border-violet-200/80 dark:border-slate-700 bg-violet-50/80 dark:bg-slate-800/80 px-2.5 py-1 text-[11px] font-bold text-violet-700 dark:text-violet-300 truncate max-w-[65%]">
                          <span className="truncate">{ind.heroBadge || ind.title}</span>
                        </span>

                        {projectCount > 0 && (
                          <span className="shrink-0 inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                            <span>
                              {projectCount} {projectCount === 1 ? "Case Study" : "Case Studies"}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors leading-snug">
                        {ind.title}
                      </h2>

                      {ind.subtitle && (
                        <p className="mt-1 text-[11px] font-semibold text-violet-600/90 dark:text-violet-400/90 line-clamp-1">
                          {ind.subtitle}
                        </p>
                      )}

                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3 min-h-[3.8rem]">
                        {ind.desc}
                      </p>

                      {/* Key Metrics Grid - Readable & Non-Truncating */}
                      {ind.keyMetrics && ind.keyMetrics.length > 0 && (
                        <div className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 p-2.5 sm:p-3 border border-violet-100/70 dark:border-slate-800/80 divide-x divide-slate-200/80 dark:divide-slate-800">
                          {ind.keyMetrics.slice(0, 3).map((m: any, mIdx: number) => (
                            <div key={mIdx} className="px-1 text-center" title={m.label}>
                              <p className="font-display text-xs sm:text-sm lg:text-base font-extrabold text-violet-700 dark:text-violet-300 tracking-tight leading-none truncate">
                                {m.value}
                              </p>
                              <p className="text-[10px] leading-tight font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 h-7 flex items-center justify-center text-center">
                                {m.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Target Solutions List */}
                      {ind.solutions && ind.solutions.length > 0 && (
                        <div className="mt-5 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Core Sector Engineering
                          </p>
                          {ind.solutions.slice(0, 2).map((sol: any, sIdx: number) => (
                            <div key={sIdx} className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{typeof sol === "string" ? sol : sol.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Explore Link CTA */}
                    <div className="mt-6 pt-4 border-t border-violet-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <Link
                        href={`/portfolio/${ind.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors group/cta"
                      >
                        <span>Explore {ind.title.split("&")[0].trim()}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
      <Footer />
    </main>
  );
}