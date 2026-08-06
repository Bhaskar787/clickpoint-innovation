"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";

interface CtaSectionProps {
  initialData?: any;
}

export default function CtaSection({ initialData }: CtaSectionProps = {}) {
  const [ctaData, setCtaData] = useState<any>(initialData || DEFAULT_LANDING_DATA.ctaBanner);

  useEffect(() => {
    if (!initialData) {
      async function loadCtaData() {
        try {
          const res = await fetch("/api/landing");
          const json = await res.json();
          if (json.success && json.data && json.data.ctaBanner) {
            setCtaData({
              ...DEFAULT_LANDING_DATA.ctaBanner,
              ...json.data.ctaBanner,
            });
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
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-slate-800 px-6 py-16 text-center sm:px-16 shadow-2xl"
        >
          {/* Ambient Glowing Spotlights */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/40 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-orange-500/30 blur-[100px]" />

          <div className="relative z-10">
            {/* Dynamic Pill Badge */}
            {ctaData.badge && (
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold mb-6">
                <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
                <span>{ctaData.badge}</span>
              </div>
            )}

            {/* Dynamic Main Title */}
            <h2 className="mx-auto max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {ctaData.title || "Let's Build Your Next"}{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-violet-400 bg-clip-text text-transparent">
                {ctaData.titleHighlight || "Breakthrough Product"}
              </span>
            </h2>

            {/* Dynamic Subtitle */}
            <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              {ctaData.subtitle || "Partner with our engineering team to design, build, and launch software systems that outperform."}
            </p>

            {/* Dynamic Action Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={ctaData.buttonLink || "/contact"} className="w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-violet-600/30 transition-all">
                  <span>{ctaData.buttonText || "Schedule Technical Consultation"}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <a href={ctaData.secondaryButtonLink || "/case-studies"} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-slate-700 text-slate-200 hover:bg-slate-900 hover:border-slate-600 font-semibold px-7 py-3.5 rounded-xl"
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
