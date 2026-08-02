"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICES_DATA } from "@/data/landing-data";

export default function Services() {
  return (
    <section id="services" className="relative py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
            Our Core Services
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-ink dark:text-white">
            Partnerships that extend your{" "}
            <span className="text-violet-600 dark:text-[#f58220]">capabilities</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_DATA.map((s, idx) => {
            const Icon = s.icon;
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
                    <h3 className="mb-2 flex items-center gap-1.5 font-display text-sm sm:text-base md:text-lg font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                      {s.title}
                      <ArrowUpRight className="h-4 w-4 -translate-y-0.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 text-violet-600 dark:text-violet-300" />
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-ink/65 dark:text-slate-300">{s.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-300 group-hover:translate-x-1 transition-transform">
                      Learn More & Details →
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
