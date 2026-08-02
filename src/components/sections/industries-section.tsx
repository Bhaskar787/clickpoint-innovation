"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Building2 } from "lucide-react";
import { INDUSTRIES_DATA } from "@/data/landing-data";

export default function IndustriesSection() {
  return (
    <section id="industries" className="relative py-20 lg:py-28 bg-cloud-100/70 border-y border-violet-100/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
            <Building2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
            Industry Specialization
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-ink dark:text-white">
            Tailored digital solutions for <span className="text-violet-600 dark:text-[#f58220]">high-growth sectors</span>
          </h2>
          <p className="mt-3 text-xs sm:text-base text-ink/70 dark:text-slate-300">
            Deep domain expertise across regulation, data pipelines, and user expectations in core industries.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES_DATA.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-sm transition-all hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    {Icon && (
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100/80 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100/50 dark:border-slate-700 group-hover:bg-violet-600 group-hover:text-white transition-colors shadow-sm">
                        <Icon className="h-6 w-6 text-violet-600 dark:text-violet-300 group-hover:text-white transition-colors" />
                      </span>
                    )}
                    <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                      {ind.keyMetrics[0]?.value} {ind.keyMetrics[0]?.label}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-xl font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {ind.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/65 dark:text-slate-300">
                    {ind.desc}
                  </p>

                  {/* Featured Projects Preview Links */}
                  <div className="mt-6 pt-4 border-t border-violet-100 dark:border-slate-800 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink/40 dark:text-slate-400">
                      Featured Case Studies & Live Work
                    </p>
                    {ind.projects.map((proj) => (
                      <div key={proj.id} className="flex items-center justify-between text-xs py-1">
                        <span className="font-semibold text-ink/80 dark:text-slate-200 group-hover:text-ink dark:group-hover:text-white">
                          {proj.title}
                        </span>
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Live <ExternalLink className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="mt-8 pt-4 border-t border-violet-100 dark:border-slate-800">
                  <Link
                    href={`/industries/${ind.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200 transition-colors group/link"
                  >
                    Explore Industry Solutions
                    <ArrowUpRight className="h-4 w-4 text-violet-600 dark:text-violet-300 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
