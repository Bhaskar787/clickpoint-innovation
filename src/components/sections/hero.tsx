"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowRight,
  Zap,
  Star,
  CheckCircle2,
  Calculator,
  Activity,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";
import { HeroTabletMockup } from "@/components/sections/hero-tablet-mockup";

// Container animations
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

interface HeroProps {
  initialData?: any;
}

export default function Hero({ initialData }: HeroProps = {}) {
  const blobRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Interactivity state
  const [projectScope, setProjectScope] = useState<"mvp" | "scale">("mvp");

  // Dynamic Landing Content State
  const [heroData, setHeroData] = useState<any>(initialData || null);

  // Dynamic Testimonial Ratings State
  const [ratingStats, setRatingStats] = useState<{
    avgRating: string;
    totalReviews: number;
    avatars: { initials: string; avatarUrl?: string; name: string }[];
  }>({
    avgRating: "4.9",
    totalReviews: 50,
    avatars: [
      { initials: "AK", name: "Alex K." },
      { initials: "SR", name: "Sarah R." },
      { initials: "MP", name: "Marcus P." },
      { initials: "EK", name: "Elena K." },
    ],
  });

  // Fetch dynamic Hero landing configuration & real testimonials rating
  useEffect(() => {
    async function loadDynamicHeroData() {
      try {
        // 1. Fetch Landing Page Config
        const landingRes = await fetch("/api/landing");
        const landingJson = await landingRes.json();
        if (landingJson.success && landingJson.data && landingJson.data.hero) {
          setHeroData({
            ...DEFAULT_LANDING_DATA.hero,
            ...landingJson.data.hero,
          });
        } else {
          setHeroData(DEFAULT_LANDING_DATA.hero);
        }
      } catch (err) {
        console.warn("Using default hero content:", err);
        setHeroData(DEFAULT_LANDING_DATA.hero);
      }

      try {
        // 2. Fetch Real Testimonials from DB for dynamic rating & trust metrics
        const testimonialsRes = await fetch("/api/testimonials");
        const testimonialsJson = await testimonialsRes.json();
        if (testimonialsJson.success && testimonialsJson.data) {
          const list = testimonialsJson.data.testimonials || [];
          if (list.length > 0) {
            const sumRating = list.reduce((acc: number, item: any) => acc + (item.rating || 5), 0);
            const avg = (sumRating / list.length).toFixed(1);
            const clientAvatars = list.slice(0, 4).map((t: any) => ({
              initials: (t.name || t.clientName || "CL").slice(0, 2).toUpperCase(),
              avatarUrl: t.avatarUrl || t.avatar || t.imageUrl,
              name: t.name || t.clientName || "Client",
            }));

            setRatingStats({
              avgRating: avg,
              totalReviews: list.length,
              avatars: clientAvatars,
            });
          }
        }
      } catch (err) {
        console.warn("Using default rating stats:", err);
      }
    }

    loadDynamicHeroData();
  }, []);

  // GSAP Background Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (blobRef.current) {
        gsap.to(blobRef.current, {
          rotate: 360,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
      }
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          rotate: -360,
          duration: 60,
          ease: "none",
          repeat: -1,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  // Fallback while loading initial data (Prevents old image flash)
  const currentHero = heroData || DEFAULT_LANDING_DATA.hero;

  const mvpWeeks = Number(currentHero.estimatorMvpWeeks) || 3;
  const scaleWeeks = Number(currentHero.estimatorScaleWeeks) || 8;
  const estimatedWeeks = projectScope === "mvp" ? mvpWeeks : scaleWeeks;

  const pillars = currentHero.pillars || DEFAULT_LANDING_DATA.hero.pillars;
  const imageUrl = currentHero.imageUrl || DEFAULT_LANDING_DATA.hero.imageUrl;

  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 transition-colors duration-300 bg-slate-50 dark:bg-[#0b0d22] text-slate-900 dark:text-slate-100">
      
      {/* ================= SPOTLIGHT & GRAPH GRID BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]" 
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[850px] rounded-full bg-gradient-to-tr from-violet-600/25 via-indigo-600/20 to-blue-500/10 dark:from-violet-600/30 dark:via-indigo-500/20 dark:to-purple-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          
          {/* ================= LEFT COLUMN: COPY & DYNAMIC CONVERSION ================= */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-w-0">
            
            {/* DYNAMIC TOP BADGE */}
            <motion.div variants={itemVariants} className="inline-flex max-w-full">
              <div className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-xs border border-violet-200/80 bg-violet-50/90 dark:border-white/[0.08] dark:bg-white/[0.04] px-3.5 py-1 text-fluid-2xs font-semibold uppercase tracking-[0.06em] text-violet-600 dark:text-violet-300">
                <Zap className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-300 animate-pulse" />
                <span className="break-words">{currentHero.badge || "Next-Gen Engineering Studio"}</span>
                {currentHero.badgeSubtext && (
                  <>
                    <span className="hidden h-1 w-1 shrink-0 rounded-full bg-violet-400 dark:bg-violet-500 min-[400px]:inline-block" />
                    <span className="text-violet-600 dark:text-violet-300 font-medium break-words lowercase">
                      {currentHero.badgeSubtext}
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* DYNAMIC MAIN HEADLINE */}
            <motion.h1
              variants={itemVariants}
              className="mt-6 hero-title text-slate-900 dark:text-white"
            >
              {currentHero.title || "Empowering Business with"}{" "}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-violet-600 dark:from-orange-400 dark:via-amber-400 dark:to-violet-400 bg-clip-text text-transparent">
                {currentHero.titleHighlight || "Clickpoint Precision"}
              </span>
            </motion.h1>

            {/* DYNAMIC SUBTITLE */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-[640px] hero-subtitle text-slate-600 dark:text-slate-300"
            >
              {currentHero.subtitle || "From Autonomous AI Agents to enterprise-grade web applications, we design and scale custom software built to outpace your competition."}
            </motion.p>

            {/* DYNAMIC VALUE PILLARS */}
            {pillars && pillars.length > 0 && (
              <motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-slate-700 dark:text-slate-300 font-medium">
                {pillars.map((pillarText: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span>{pillarText}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* DYNAMIC PRIMARY & SECONDARY ACTION BUTTONS (44px height, 6px radius, 12px gap) */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:items-center">
              <a href={currentHero.primaryCtaLink || "/contact"} className="w-full min-[400px]:w-auto"> 
                <Button size="default" className="group w-full min-[400px]:w-auto h-11 px-6 rounded-sm font-semibold transition-all">
                  <span>{currentHero.primaryCtaText || "Start Your Project"}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <a href={currentHero.secondaryCtaLink || "/case-studies"} className="w-full min-[400px]:w-auto">
                <Button variant="outline" size="default" className="w-full min-[400px]:w-auto h-11 px-6 rounded-sm font-semibold">
                  <span>{currentHero.secondaryCtaText || "Explore Case Studies"}</span>
                </Button>
              </a>
            </motion.div>

            {/* 100% DYNAMIC INSTANT DEVELOPMENT ESTIMATOR WIDGET (8px radius, 16px padding) */}
            <motion.div variants={itemVariants} className="mt-8 w-full min-w-0 max-w-[560px] rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c0e22]/90 p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em] flex items-center gap-1.5 min-w-0">
                  <Calculator className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
                  <span className="break-words">{currentHero.estimatorTitle || "Instant Development Estimator"}</span>
                </span>
                <span className="shrink-0 self-start text-[12px] font-semibold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/80 px-2.5 py-0.5 rounded-xs border border-violet-100 dark:border-violet-800/50 whitespace-nowrap">
                  {estimatedWeeks} Weeks Avg. Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2 text-[14px] font-medium">
                <button
                  onClick={() => setProjectScope("mvp")}
                  className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                    projectScope === "mvp"
                      ? "border-violet-600 bg-violet-50/90 text-violet-900 dark:border-violet-500 dark:bg-violet-950/90 dark:text-violet-300"
                      : "border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090b1c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xs">{currentHero.estimatorMvpTitle || "AI MVP / Prototype"}</p>
                    <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">{mvpWeeks} wks</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{currentHero.estimatorMvpSubtext || "Fast 2-4 week launch"}</p>
                </button>

                <button
                  onClick={() => setProjectScope("scale")}
                  className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                    projectScope === "scale"
                      ? "border-violet-600 bg-violet-50/90 text-violet-900 dark:border-violet-500 dark:bg-violet-950/90 dark:text-violet-300"
                      : "border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090b1c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xs">{currentHero.estimatorScaleTitle || "Full Enterprise Product"}</p>
                    <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">{scaleWeeks} wks</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{currentHero.estimatorScaleSubtext || "Scalable Architecture"}</p>
                </button>
              </div>
            </motion.div>

            {/* DYNAMIC SOCIAL PROOF & TESTIMONIALS RATING BAR (32px circles, -8px overlap) */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-4 pt-4 border-t border-slate-200/80 dark:border-white/[0.08] min-[400px]:flex-row min-[400px]:items-center">
              {/* Dynamic Client Avatars (32px circles, -8px overlap) */}
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                {ratingStats.avatars.map((client, i) => (
                  <div
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#0b0d22] bg-slate-800 overflow-hidden flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                    title={client.name}
                  >
                    {client.avatarUrl ? (
                      <img src={client.avatarUrl} alt={client.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{client.initials}</span>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                    {ratingStats.avgRating}/5 Rating ({ratingStats.totalReviews}+ Verified Reviews)
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-normal">
                  {currentHero.socialProofText || "Engineered 50+ successful web & AI applications"}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT COLUMN: 3D TILTED TABLET MOCKUP WITH HOVER STRAIGHTEN ================= */}
          <div className="relative mx-auto w-full min-w-0 max-w-[580px] flex items-center justify-center">
            <HeroTabletMockup imageUrl={imageUrl} />
          </div>

        </div>
      </div>
    </section>
  );
}