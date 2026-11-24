"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Zap,
  Star,
  CheckCircle2,
  Calculator,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";
import { TabletFrame } from "@/components/sections/tablet-frame";
import { InteractiveWorkspace } from "@/components/whiteboard/interactive-workspace";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollTabletExperienceProps {
  initialData?: any;
}

export default function ScrollTabletExperience({ initialData }: ScrollTabletExperienceProps = {}) {
  // Container & GSAP refs
  const experienceContainerRef = useRef<HTMLDivElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const heroGridRef = useRef<HTMLDivElement>(null);
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const tabletWrapperRef = useRef<HTMLDivElement>(null);
  const developerImageRef = useRef<HTMLDivElement>(null);
  const workspaceScreenRef = useRef<HTMLDivElement>(null);
  const workspaceHeaderRef = useRef<HTMLDivElement>(null);
  const ambientFloorGlowRef = useRef<HTMLDivElement>(null);
  const contactShadowRef = useRef<HTMLDivElement>(null);

  // Interactivity state for Estimator
  const [projectScope, setProjectScope] = useState<"mvp" | "scale">("mvp");

  // Dynamic Landing Content State
  const [heroData, setHeroData] = useState<any>(initialData || null);

  // Dynamic Testimonial Ratings State
  const [ratingStats, setRatingStats] = useState<{
    avgRating: string;
    totalReviews: number;
    avatars: { initials: string; avatarUrl?: string; name: string }[];
  }>({
    avgRating: "4.7",
    totalReviews: 11,
    avatars: [
      { initials: "RA", name: "Rohan A." },
      { initials: "BD", name: "Binod D." },
      { initials: "TI", name: "Tara I." },
    ],
  });

  // Fetch dynamic Hero landing configuration & real testimonials rating
  useEffect(() => {
    async function loadDynamicHeroData() {
      try {
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
        setHeroData(DEFAULT_LANDING_DATA.hero);
      }

      try {
        const testimonialsRes = await fetch("/api/testimonials");
        const testimonialsJson = await testimonialsRes.json();
        if (testimonialsJson.success && testimonialsJson.data) {
          const list = testimonialsJson.data.testimonials || [];
          if (list.length > 0) {
            const sumRating = list.reduce((acc: number, item: any) => acc + (item.rating || 5), 0);
            const avg = (sumRating / list.length).toFixed(1);
            const avatarList = list.slice(0, 4).map((t: any) => ({
              initials: (t.clientName || t.authorName || "C").slice(0, 2).toUpperCase(),
              avatarUrl: t.clientAvatar || t.authorAvatar,
              name: t.clientName || t.authorName,
            }));
            setRatingStats({
              avgRating: avg,
              totalReviews: list.length,
              avatars: avatarList,
            });
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    loadDynamicHeroData();
  }, []);

  const currentHero = heroData || initialData || DEFAULT_LANDING_DATA.hero;
  const imageUrl =
    currentHero.mediaUrl ||
    currentHero.imageUrl ||
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";

  const mvpWeeks = currentHero.estimatorMvpWeeks || 3;
  const scaleWeeks = currentHero.estimatorScaleWeeks || 8;
  const estimatedWeeks = projectScope === "mvp" ? mvpWeeks : scaleWeeks;

  // Setup GSAP ScrollTrigger Sequence
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop animation (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        if (!experienceContainerRef.current || !pinStageRef.current || !tabletWrapperRef.current)
          return;

        // Initial setup for the 3D tilted tablet resting state in Hero right column
        gsap.set(tabletWrapperRef.current, {
          xPercent: 35,
          yPercent: 0,
          scale: 0.9,
          rotateX: 12,
          rotateY: -16,
          rotateZ: 2.5,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        });

        gsap.set(developerImageRef.current, { autoAlpha: 1 });
        gsap.set(workspaceScreenRef.current, { autoAlpha: 0 });
        gsap.set(workspaceHeaderRef.current, { autoAlpha: 0, y: 30 });
        gsap.set(ambientFloorGlowRef.current, { scale: 1, opacity: 0.5 });
        gsap.set(contactShadowRef.current, { scaleX: 1, opacity: 0.65 });

        // Master ScrollTrigger timeline with scrub
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: experienceContainerRef.current,
            start: "top top",
            end: "+=2200",
            pin: pinStageRef.current,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // ════════════════════════════════════════════════════════════════
        // Phase 1 -> Phase 2: Morph from Hero to Centered Workspace (0.0 - 0.40)
        // ════════════════════════════════════════════════════════════════
        tl.to(
          heroLeftRef.current,
          {
            autoAlpha: 0,
            y: -60,
            duration: 0.3,
            ease: "power2.inOut",
          },
          0
        )
          .to(
            tabletWrapperRef.current,
            {
              xPercent: 0,
              yPercent: 2,
              scale: 1.18,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              duration: 0.4,
              ease: "power2.inOut",
            },
            0
          )
          // Cross-fade screen: Developer image fades out, Interactive Whiteboard fades in
          .to(
            developerImageRef.current,
            {
              autoAlpha: 0,
              duration: 0.25,
              ease: "power1.inOut",
            },
            0.12
          )
          .to(
            workspaceScreenRef.current,
            {
              autoAlpha: 1,
              duration: 0.25,
              ease: "power1.inOut",
            },
            0.15
          )
          // Reveal Workspace Header
          .to(
            workspaceHeaderRef.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.25,
              ease: "power2.out",
            },
            0.2
          )
          // Floor glow & shadow adjust for centered large tablet
          .to(
            ambientFloorGlowRef.current,
            {
              scale: 1.35,
              opacity: 0.75,
              duration: 0.35,
            },
            0
          )
          .to(
            contactShadowRef.current,
            {
              scaleX: 1.15,
              opacity: 0.45,
              duration: 0.35,
            },
            0
          )

          // ════════════════════════════════════════════════════════════════
          // Phase 3: Pinned Interactive Hold Range (0.40 - 0.85)
          // Allows user to comfortably draw and use all whiteboard tools
          // ════════════════════════════════════════════════════════════════
          .to({}, { duration: 0.45 })

          // ════════════════════════════════════════════════════════════════
          // Phase 4: Graceful Exit Transition into next section (0.85 - 1.0)
          // ════════════════════════════════════════════════════════════════
          .to(
            tabletWrapperRef.current,
            {
              scale: 1.05,
              yPercent: -8,
              autoAlpha: 0.9,
              duration: 0.15,
              ease: "power1.in",
            },
            0.85
          )
          .to(
            workspaceHeaderRef.current,
            {
              autoAlpha: 0,
              y: -25,
              duration: 0.15,
            },
            0.85
          );
      });
    }, experienceContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={experienceContainerRef} className="relative w-full">
      {/* ══════════════════════════════════════════════════════════════
          DESKTOP & PINNED STAGE (GSAP ScrollTrigger on lg+)
          ══════════════════════════════════════════════════════════════ */}
      <div
        ref={pinStageRef}
        className="hidden lg:flex min-h-screen w-full relative flex-col justify-center items-center overflow-hidden pt-20 pb-12"
      >
        {/* Subtle Ambient Background Lighting */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent opacity-80" />

        {/* 1. Live Workspace Header (Revealed in Phase 2 & 3) */}
        <div
          ref={workspaceHeaderRef}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-30 text-center max-w-2xl px-4 pointer-events-none"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-white/[0.06] text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-2 border border-violet-200/80 dark:border-white/10 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Collaborative Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-white tracking-tight">
            From Vision to Production Software
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sketch architectures, test interfaces, and align your product roadmap right inside Clickpoint.
          </p>
        </div>

        {/* 2. Main Container with Hero Left Column & Tablet Center */}
        <div
          ref={heroGridRef}
          className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl relative flex items-center justify-between"
        >
          {/* ================= HERO LEFT CONTENT ================= */}
          <div ref={heroLeftRef} className="w-full max-w-[580px] z-20 space-y-6">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 rounded-xs border border-violet-200/80 dark:border-white/[0.08] bg-violet-50/80 dark:bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>{currentHero.badge || "NEXT-GEN ENGINEERING STUDIO"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-[52px] leading-[1.12]">
              {currentHero.title || "Empowering Business"} <br />
              <span className="text-slate-800 dark:text-slate-100">with </span>
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 bg-clip-text text-transparent">
                {currentHero.titleHighlight || "Clickpoint"}
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Precision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {currentHero.subtitle ||
                "We build high-performance web apps, scalable cloud platforms, and custom enterprise AI solutions tailored to drive exponential business growth."}
            </p>

            {/* Value Checkpoints */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Custom AI & LLM Systems</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>High-Performance Backend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Enterprise SOC2 Security</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a href={currentHero.primaryCtaLink || "/contact"}>
                <Button variant="primary" size="lg" className="rounded-sm shadow-xs font-semibold gap-2">
                  <span>{currentHero.primaryCtaText || "Schedule Consultation"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href={currentHero.secondaryCtaLink || "/case-studies"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-sm border-slate-300 dark:border-white/20 bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08] font-semibold"
                >
                  <span>{currentHero.secondaryCtaText || "Explore Our Work"}</span>
                </Button>
              </a>
            </div>

            {/* Instant Development Estimator Widget */}
            <div className="mt-6 w-full max-w-[540px] rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c0e22]/90 p-3.5 shadow-xs">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  <span>{currentHero.estimatorTitle || "Instant Development Estimator"}</span>
                </span>
                <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/80 px-2 py-0.5 rounded-xs border border-violet-200/80 dark:border-violet-800/50">
                  {estimatedWeeks} Weeks Avg. Delivery
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[13px]">
                <button
                  type="button"
                  onClick={() => setProjectScope("mvp")}
                  className={`p-2.5 rounded-sm border text-left transition-all ${
                    projectScope === "mvp"
                      ? "border-violet-600 bg-violet-50/90 text-violet-900 dark:border-violet-500 dark:bg-violet-950/90 dark:text-violet-300"
                      : "border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090b1c] text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xs">{currentHero.estimatorMvpTitle || "AI MVP / Prototype"}</p>
                    <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">{mvpWeeks} wks</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentHero.estimatorMvpSubtext || "Fast 2-4 week launch"}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setProjectScope("scale")}
                  className={`p-2.5 rounded-sm border text-left transition-all ${
                    projectScope === "scale"
                      ? "border-violet-600 bg-violet-50/90 text-violet-900 dark:border-violet-500 dark:bg-violet-950/90 dark:text-violet-300"
                      : "border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090b1c] text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xs">
                      {currentHero.estimatorScaleTitle || "Full Enterprise Product"}
                    </p>
                    <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">{scaleWeeks} wks</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentHero.estimatorScaleSubtext || "Scalable Architecture"}
                  </p>
                </button>
              </div>
            </div>

            {/* Verified Ratings Bar */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                {ratingStats.avatars.map((client, idx) => (
                  <div
                    key={idx}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950 overflow-hidden"
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
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-[12px] font-semibold text-slate-800 dark:text-slate-200">
                    {ratingStats.avgRating}/5 ({ratingStats.totalReviews}+ Verified Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= THE ANIMATED 3D TABLET CONTAINER ================= */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Tablet Positioning & 3D Extrusion Shell */}
            <div
              ref={tabletWrapperRef}
              className="relative w-full max-w-[620px] pointer-events-auto select-none"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* Ambient Floor Glow */}
              <div
                ref={ambientFloorGlowRef}
                className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 w-[88%] h-16 bg-gradient-to-r from-violet-500/20 via-indigo-500/25 to-purple-500/15 dark:from-violet-600/50 dark:via-indigo-500/60 dark:to-purple-600/40 blur-2xl dark:blur-3xl rounded-[100%]"
                aria-hidden="true"
              />

              {/* Floor Contact Shadow */}
              <div
                ref={contactShadowRef}
                className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 w-[82%] h-6 bg-slate-900/15 dark:bg-black/75 blur-md dark:blur-xl rounded-[100%]"
                aria-hidden="true"
              />

              {/* Tablet Hardware Frame */}
              <TabletFrame
                className="tablet-3d-tilted shadow-xl"
                aspectRatio="aspect-[16/10]"
                showCamera={true}
                showButtons={true}
              >
                {/* Layer 1: Original Developer Photo (Phase 1) */}
                <div
                  ref={developerImageRef}
                  className="absolute inset-0 w-full h-full z-10 transition-opacity duration-300"
                >
                  <img
                    src={imageUrl}
                    alt="Click Point Engineering"
                    className="h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Layer 2: Interactive Whiteboard Workspace (Phase 2 & 3) */}
                <div
                  ref={workspaceScreenRef}
                  className="absolute inset-0 w-full h-full z-10"
                >
                  <InteractiveWorkspace />
                </div>
              </TabletFrame>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE & TABLET VIEW (< 1024px)
          Streamlined non-pinned layout with direct touch drawing support
          ══════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden w-full pt-16 pb-12 space-y-12">
        {/* Mobile Hero Section */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="space-y-6 text-left">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 rounded-xs border border-violet-200/80 dark:border-white/[0.08] bg-violet-50/80 dark:bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>{currentHero.badge || "NEXT-GEN ENGINEERING STUDIO"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-white leading-[1.15]">
              {currentHero.title || "Empowering Business"} <br />
              <span className="text-slate-800 dark:text-slate-100">with </span>
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 bg-clip-text text-transparent">
                {currentHero.titleHighlight || "Clickpoint"}
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Precision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {currentHero.subtitle ||
                "We build high-performance web apps, scalable cloud platforms, and custom enterprise AI solutions tailored to drive exponential business growth."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a href={currentHero.primaryCtaLink || "/contact"}>
                <Button variant="primary" size="md" className="rounded-sm shadow-xs font-semibold gap-1.5">
                  <span>{currentHero.primaryCtaText || "Schedule Consultation"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href={currentHero.secondaryCtaLink || "/case-studies"}>
                <Button
                  variant="outline"
                  size="md"
                  className="rounded-sm border-slate-300 dark:border-white/20 bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-semibold"
                >
                  <span>{currentHero.secondaryCtaText || "Explore Our Work"}</span>
                </Button>
              </a>
            </div>

            {/* Mobile Hero Tablet Preview */}
            <div className="relative pt-4 w-full max-w-[500px] mx-auto">
              <TabletFrame
                className="tablet-3d-tilted shadow-lg"
                aspectRatio="aspect-[16/10]"
              >
                <img
                  src={imageUrl}
                  alt="Click Point Engineering"
                  className="h-full w-full object-cover object-top"
                />
              </TabletFrame>
            </div>
          </div>
        </div>

        {/* Mobile Interactive Workspace Section */}
        <div className="container mx-auto px-4 sm:px-6 pt-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-white/[0.06] text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-2 border border-violet-200/80 dark:border-white/10 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Collaborative Studio</span>
            </div>
            <h2 className="text-2xl font-extrabold text-ink dark:text-white tracking-tight">
              Test Our Collaborative Whiteboard
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Touch to sketch, select shapes, and test notes on the canvas below.
            </p>
          </div>

          <div className="relative w-full max-w-[560px] mx-auto h-[360px] sm:h-[420px]">
            <TabletFrame
              className="shadow-xl"
              aspectRatio="aspect-[16/10]"
            >
              <InteractiveWorkspace />
            </TabletFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
