"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DEFAULT_STATS_HEADER, DEFAULT_STATS_DATA } from "@/data/default-landing-data";

function CounterNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

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
    <span ref={ref} className="stat-number text-ink dark:text-white">
      {displayValue}
      <span className="text-violet-600 dark:text-violet-300 font-extrabold">{suffix}</span>
    </span>
  );
}

interface StatsSectionProps {
  initialHeader?: any;
  initialStats?: any[];
}

export default function StatsSection({ initialHeader, initialStats }: StatsSectionProps = {}) {
  const [statsHeader, setStatsHeader] = useState(initialHeader || DEFAULT_STATS_HEADER);
  const [statsItems, setStatsItems] = useState<
    { id?: string; value: number; suffix?: string; label: string }[]
  >(initialStats && initialStats.length > 0 ? initialStats : DEFAULT_STATS_DATA);

  useEffect(() => {
    if (!initialHeader || !initialStats || initialStats.length === 0) {
      async function loadDynamicStats() {
        try {
          const res = await fetch("/api/landing");
          const json = await res.json();
          if (json.success && json.data) {
            if (json.data.statsHeader && !initialHeader) {
              setStatsHeader({ ...DEFAULT_STATS_HEADER, ...json.data.statsHeader });
            }
            if (Array.isArray(json.data.stats) && json.data.stats.length > 0 && (!initialStats || initialStats.length === 0)) {
              setStatsItems(json.data.stats);
            }
          }
        } catch (err) {
          console.warn("Using default stats content:", err);
        }
      }

      loadDynamicStats();
    }
  }, [initialHeader, initialStats]);

  return (
    <section className="relative py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-y border-slate-200/60 dark:border-slate-800/40 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <span className="section-badge mb-3 inline-flex items-center gap-1.5 rounded-xs border border-violet-200/80 dark:border-white/[0.08] bg-violet-50 dark:bg-white/[0.04] px-2.5 py-1 text-violet-600 dark:text-violet-300 text-[12px] font-semibold uppercase tracking-[0.06em]">
            {statsHeader.badge}
          </span>
          <h2 className="section-title text-ink dark:text-white">
            {statsHeader.title}{" "}
            <span className="text-violet-600 dark:text-[#f58220]">
              {statsHeader.titleHighlight}
            </span>
          </h2>
          <p className="mt-3 section-subtitle text-ink/70 dark:text-slate-300">
            {statsHeader.subtitle}
          </p>
        </div>

        {/* 3 cols x 2 rows Desktop, 2 cols Mobile */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {statsItems.map((s, idx) => {
            const rawSuffix = s.suffix || "";
            const cleanSuffix = (rawSuffix === "-" || rawSuffix === "–" || rawSuffix === "—") ? "+" : rawSuffix;

            return (
              <motion.div
                key={s.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04, ease: "easeOut" }}
                className="h-full"
              >
                <div className="h-full group flex flex-col justify-between rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 shadow-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-white/[0.16] hover:-translate-y-0.5">
                  <div>
                    <CounterNumber value={Number(s.value) || 0} suffix={cleanSuffix} />
                    <p className="mt-2 text-[14px] leading-normal font-medium text-ink/75 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                      {s.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
