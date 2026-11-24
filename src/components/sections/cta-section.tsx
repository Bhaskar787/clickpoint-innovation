"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";
import { useSiteData } from "@/components/common/theme-provider";

const CTA_CACHE_KEY = "clickpoint_cta_cache_v2";

function getCachedCtaData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CTA_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface CtaSectionProps {
  initialData?: any;
}

export default function CtaSection({ initialData }: CtaSectionProps = {}) {
  const { cta: contextCta } = useSiteData();
  const effectiveInitial = initialData || contextCta;

  const [ctaData, setCtaData] = useState<any>(() => effectiveInitial || getCachedCtaData() || DEFAULT_LANDING_DATA.ctaBanner);

  useEffect(() => {
    if (effectiveInitial) {
      setCtaData(effectiveInitial);
      try {
        localStorage.setItem(CTA_CACHE_KEY, JSON.stringify(effectiveInitial));
      } catch {}
    }
  }, [effectiveInitial]);

  useEffect(() => {
    if (!initialData) {
      async function loadCtaData() {
        try {
          const res = await fetch("/api/landing");
          const json = await res.json();
          if (json.success && json.data && json.data.ctaBanner) {
            const merged = {
              ...DEFAULT_LANDING_DATA.ctaBanner,
              ...json.data.ctaBanner,
            };
            setCtaData(merged);
            try {
              localStorage.setItem(CTA_CACHE_KEY, JSON.stringify(merged));
            } catch {}
          }
        } catch (err) {
          console.warn("Using default CTA banner content:", err);
        }
      }

      loadCtaData();
    }
  }, [initialData]);

  return (
    <section className="relative py-20 lg:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-lg bg-slate-950 border border-white/[0.10] px-8 py-16 text-center shadow-lg"
        >
          {/* Ambient Glowing Spotlights */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/40 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-orange-500/30 blur-[100px]" />

          <div className="relative z-10 max-w-[640px] mx-auto">
            {/* Dynamic Badge */}
            {ctaData.badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs border border-white/[0.10] bg-white/[0.04] text-violet-300 text-[12px] font-semibold uppercase tracking-[0.06em] mb-6">
                <span>{ctaData.badge}</span>
              </div>
            )}

            {/* Main Title with Gradient Highlight */}
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-white leading-[1.2]">
              {ctaData.title || "Let's Build Your Next"}{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-violet-400 bg-clip-text text-transparent">
                {ctaData.titleHighlight || "Breakthrough Product"}
              </span>
            </h2>

            {/* Dynamic Subtitle */}
            <p className="mt-4 text-[16px] sm:text-[18px] text-slate-300 font-normal leading-relaxed">
              {ctaData.subtitle || "Partner with our engineering team to design, build, and launch software systems that outperform."}
            </p>

            {/* Dynamic Action Buttons (44px height, 6px radius, 12px gap) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={ctaData.buttonLink || "/contact"} className="w-full sm:w-auto">
                <Button size="default" className="group w-full sm:w-auto h-11 px-6 rounded-sm font-semibold shadow-sm transition-all">
                  <span>{ctaData.buttonText || "Schedule Technical Consultation"}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <a href={ctaData.secondaryButtonLink || "/case-studies"} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full sm:w-auto h-11 px-6 rounded-sm font-semibold border-white/[0.18] text-slate-200 hover:bg-white/[0.06]"
                >
                  <span>{ctaData.secondaryButtonText || "Explore Case Studies"}</span>
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
