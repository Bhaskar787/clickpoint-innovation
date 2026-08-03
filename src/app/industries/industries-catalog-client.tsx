"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
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
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 border-b border-violet-100/70 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50/80 dark:bg-slate-800/80 px-4 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 shadow-xs backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-base leading-relaxed text-ink/70 dark:text-slate-300 sm:text-lg"
            >
              {hero.subtitle}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Dynamic Industry Sectors Catalog Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {industriesList.map((ind: IndustryItem, idx: number) => (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-sm transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-600/10 hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300">
                      <Building2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                      {ind.subtitle || ind.heroBadge || "Enterprise Sector"}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {ind.projects?.length || 0} Live Case Studies
                    </span>
                  </div>

                  <h2 className="mt-6 font-display text-2xl font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {ind.title}
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink/75 dark:text-slate-300">
                    {ind.desc}
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-violet-50/50 dark:bg-slate-900/60 p-3 border border-violet-100/80 dark:border-slate-800">
                    {ind.keyMetrics?.slice(0, 3).map((m: any, mIdx: number) => (
                      <div key={mIdx} className="text-center">
                        <p className="font-display text-sm font-extrabold text-violet-600 dark:text-violet-300">{m.value}</p>
                        <p className="text-[9px] font-medium text-ink/65 dark:text-slate-400 line-clamp-1">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Target Solutions List */}
                  <div className="mt-6 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40 dark:text-slate-400">
                      Core Sector Engineering
                    </p>
                    {ind.solutions?.slice(0, 2).map((sol: any, sIdx: number) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs font-medium text-ink/80 dark:text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                        <span>{typeof sol === "string" ? sol : sol.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explore Link CTA */}
                <div className="mt-8 pt-4 border-t border-violet-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/industries/${ind.id}`}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors"
                  >
                    <span>Explore {ind.title.split("&")[0]} Practice</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <span className="text-[10px] font-mono text-slate-400">
                    /industries/{ind.id}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
      <Footer />
    </main>
  );
}
