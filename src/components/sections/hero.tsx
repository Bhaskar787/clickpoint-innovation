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
            
            {/* DYNAMIC TOP PILL BADGE */}
            <motion.div variants={itemVariants} className="inline-flex max-w-full">
              <div className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-200/80 bg-violet-50/90 dark:border-violet-800/60 dark:bg-violet-950/60 px-3 py-1 sm:px-4 sm:py-1.5 text-fluid-xs font-semibold text-violet-600 dark:text-violet-300 shadow-xs backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-300 animate-pulse" />
                <span className="break-words">{currentHero.badge || "Next-Gen Engineering Studio"}</span>
                {currentHero.badgeSubtext && (
                  <>
                    <span className="hidden h-1 w-1 shrink-0 rounded-full bg-violet-400 dark:bg-violet-500 min-[400px]:inline-block" />
                    <span className="text-violet-600 dark:text-violet-300 font-medium break-words">
                      {currentHero.badgeSubtext}
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* DYNAMIC MAIN HEADLINE */}
            <motion.h1
              variants={itemVariants}
              className="mt-6 hero-title sm:leading-[1.12]"
            >
              {currentHero.title || "Empowering Business with"}{" "}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-violet-600 dark:from-orange-400 dark:via-amber-400 dark:to-violet-400 bg-clip-text text-transparent">
                {currentHero.titleHighlight || "Clickpoint Precision"}
              </span>
            </motion.h1>

            {/* DYNAMIC SUBTITLE */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl hero-subtitle text-slate-600 dark:text-slate-300"
            >
              {currentHero.subtitle || "From Autonomous AI Agents to enterprise-grade web applications, we design and scale custom software built to outpace your competition."}
            </motion.p>

            {/* DYNAMIC VALUE PILLARS */}
            {pillars && pillars.length > 0 && (
              <motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-fluid-sm text-slate-700 dark:text-slate-300 font-medium">
                {pillars.map((pillarText: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span>{pillarText}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* DYNAMIC PRIMARY & SECONDARY ACTION BUTTONS */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center min-[400px]:gap-4">
              <a href={currentHero.primaryCtaLink || "/contact"} className="w-full min-[400px]:w-auto"> 
                <Button size="lg" className="group w-full min-[400px]:w-auto shadow-md shadow-violet-600/20 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
                  <span>{currentHero.primaryCtaText || "Start Your Project"}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <a href={currentHero.secondaryCtaLink || "/case-studies"} className="w-full min-[400px]:w-auto">
                <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3 rounded-xl">
                  <span>{currentHero.secondaryCtaText || "Explore Case Studies"}</span>
                </Button>
              </a>
            </motion.div>

            {/* 100% DYNAMIC INSTANT DEVELOPMENT ESTIMATOR WIDGET */}
            <motion.div variants={itemVariants} className="mt-8 w-full min-w-0 max-w-lg rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0c0e22]/80 p-3.5 sm:p-4 backdrop-blur-md">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-fluid-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                  <Calculator className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
                  <span className="break-words">{currentHero.estimatorTitle || "Instant Development Estimator"}</span>
                </span>
                <span className="shrink-0 self-start text-fluid-xs font-bold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-100 dark:border-violet-800/50 whitespace-nowrap">
                  {estimatedWeeks} Weeks Avg. Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2 text-fluid-sm font-medium">
                <button
                  onClick={() => setProjectScope("mvp")}
                  className={`py-2.5 px-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    projectScope === "mvp"
                      ? "border-violet-600 bg-violet-50/90 text-violet-900 dark:border-violet-500 dark:bg-violet-950/90 dark:text-violet-300 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090b1c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs">{currentHero.estimatorMvpTitle || "AI MVP / Prototype"}</p>
                    <span className="text-[10px] font-extrabold text-violet-600 dark:text-violet-400">{mvpWeeks} wks</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{currentHero.estimatorMvpSubtext || "Fast 2-4 week launch"}</p>
                </button>

                <button
                  onClick={() => setProjectScope("scale")}
                  className={`py-2.5 px-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    projectScope === "scale"
                      ? "border-violet-600 bg-violet-50/90 text-violet-900 dark:border-violet-500 dark:bg-violet-950/90 dark:text-violet-300 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090b1c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs">{currentHero.estimatorScaleTitle || "Full Enterprise Product"}</p>
                    <span className="text-[10px] font-extrabold text-violet-600 dark:text-violet-400">{scaleWeeks} wks</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{currentHero.estimatorScaleSubtext || "Scalable Architecture"}</p>
                </button>
              </div>
            </motion.div>

            {/* DYNAMIC SOCIAL PROOF & TESTIMONIALS RATING BAR */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 min-[400px]:flex-row min-[400px]:items-center">
              {/* Dynamic Real Testimonial Client Avatars */}
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                {ratingStats.avatars.map((client, i) => (
                  <div
                    key={i}
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#070814] bg-gradient-to-tr from-violet-500 to-indigo-600 overflow-hidden flex items-center justify-center text-white text-fluid-xs font-bold shrink-0 shadow-xs"
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
                <div className="flex items-center gap-1 text-amber-500 text-fluid-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-fluid-xs font-bold text-slate-800 dark:text-slate-200">
                    {ratingStats.avgRating}/5 Rating ({ratingStats.totalReviews}+ Verified Reviews)
                  </span>
                </div>
                <p className="text-fluid-xs text-slate-500 dark:text-slate-400 font-medium">
                  {currentHero.socialProofText || "Engineered 50+ successful web & AI applications"}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT COLUMN: BIGGER DYNAMIC IMAGE SHOWCASE (NO TABS, CLEAN SHADOWLESS FRAME) ================= */}
    {/* ================= RIGHT COLUMN: HIGH-TECH DYNAMIC SHOWCASE ================= */}
<div className="relative mx-auto w-full min-w-0 max-w-lg lg:max-w-none">
  <div className="relative flex min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] w-full items-center justify-center">
    
    {/* Animated Radial Background Orbs */}
    <div 
      ref={ringRef} 
      className="absolute h-[380px] w-[380px] sm:h-[480px] sm:w-[480px] lg:h-[520px] lg:w-[520px] rounded-full border border-dashed border-violet-500/20 dark:border-violet-500/30 pointer-events-none" 
    />
    <div 
      ref={blobRef} 
      className="absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-gradient-to-tr from-violet-600/30 via-indigo-500/20 to-amber-500/20 blur-[100px] pointer-events-none" 
    />

    {/* Floating Metric Badge - Top Left */}
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="absolute -top-3 left-4 sm:-left-4 z-30 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl backdrop-blur-md"
    >
      <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
      <Activity className="h-4 w-4 text-emerald-500" />
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">{currentHero.showcaseBadgeTopLeftLabel || "System SLA"}</span>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{currentHero.showcaseBadgeTopLeft || "99.9% Uptime"}</span>
      </div>
    </motion.div>

    {/* Floating Metric Badge - Bottom Right */}
    <motion.div 
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="absolute -bottom-3 right-4 sm:-right-4 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-violet-500/30 shadow-xl backdrop-blur-md"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 dark:text-violet-400">
        <Cpu className="h-4 w-4" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">{currentHero.showcaseBadgeBottomRightLabel || "AI Core"}</span>
        <span className="text-xs font-bold text-violet-600 dark:text-violet-300">{currentHero.showcaseBadgeBottomRight || "Autonomous RAG"}</span>
      </div>
    </motion.div>

    {/* Glassmorphic App Window Frame */}
    <div className="relative z-10 w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
      
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="truncate max-w-[180px] sm:max-w-none">{currentHero.showcaseTitle || "clickpoint-studio-v2.ts"}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <div className="h-2 w-8 rounded-full bg-slate-300/60 dark:bg-slate-800" />
        </div>
      </div>

      {/* Main Showcase Canvas */}
      <div className="p-3 sm:p-4">
        <div className="relative h-80 sm:h-96 lg:h-[420px] w-full rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-950 group">
          {imageUrl ? (
            <>
              {/* Dynamic Image View with Gradient Overlay */}
              <img
                src={imageUrl}
                alt="Studio Showcase"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 opacity-80 transition-opacity group-hover:opacity-60" />
            </>
          ) : (
            /* Interactive Simulated UI Dashboard Placeholder (Renders when no image is supplied) */
            <div className="h-full w-full bg-[#070913] p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden font-sans">
              
              {/* Subtle Grid Pattern Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Top Dashboard Controls */}
              <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="h-2.5 w-24 rounded bg-slate-200 dark:bg-slate-700 font-bold text-xs text-slate-200">AI Cluster #01</div>
                    <div className="h-2 w-16 rounded bg-slate-500 dark:bg-slate-500 mt-1" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  LIVE AGENTS
                </span>
              </div>

              {/* Animated Interactive Graph & Stats Bars */}
              <div className="relative z-10 my-auto space-y-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Latencies</span>
                    <span className="text-sm font-bold text-white font-mono">14.2ms</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Throughput</span>
                    <span className="text-sm font-bold text-violet-400 font-mono">1.2k/s</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Accuracy</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">99.4%</span>
                  </div>
                </div>

                {/* Simulated Chart Bars */}
                <div className="h-28 w-full rounded-lg bg-slate-900/60 border border-slate-800/80 p-3 flex items-end justify-between gap-1.5 sm:gap-2">
                  {[40, 65, 45, 80, 55, 90, 75, 100, 85, 95].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: "10%" }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.05, repeat: Infinity, repeatType: "reverse" }}
                      className="w-full bg-gradient-to-t from-violet-700 to-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Console Activity Line */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping" />
                  <span className="text-slate-300">Processing vector pipelines...</span>
                </div>
                <span className="text-slate-500">v2.4.0</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>
    </section>
  );
}