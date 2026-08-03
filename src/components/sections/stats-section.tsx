"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STATS_DATA } from "@/data/landing-data";

function CounterNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1600; // ms
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        // Ease out quad
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        setDisplayValue(Math.floor(easedProgress * end));
        requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-ink dark:text-white">
      {displayValue}
      <span className="text-violet-600 dark:text-violet-300 font-extrabold">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-y border-violet-100/70 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
            Growth Story
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink dark:text-white">
            Numbers that back our{" "}
            <span className="text-violet-600 dark:text-[#f58220]">
              product obsession
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-base text-ink/70 dark:text-slate-300">
            Proven engineering impact delivered for high-growth tech startups and Fortune 500 enterprises.
          </p>
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {STATS_DATA.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-600/10 hover:-translate-y-1"
            >
              <div>
                <CounterNumber value={s.value} suffix={s.suffix || ""} />
                <p className="mt-2 text-xs leading-relaxed font-semibold text-ink/75 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  {s.label}
                </p>
              </div>

              <div className="mt-4 h-1 w-full rounded-full bg-violet-50 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full w-0 group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
