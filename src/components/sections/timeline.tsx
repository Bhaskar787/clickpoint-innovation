"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { JourneyPageContent, TimelineEra } from "@/types";
import { DEFAULT_JOURNEY_PAGE_DATA } from "@/data/default-journey-data";

// -----------------------------------------------------------------------------
// Helper: getStageDomain
// -----------------------------------------------------------------------------

function getStageDomain(era: TimelineEra, index: number): string {
  const combined = ((era.title || "") + " " + (era.subtitle || "")).toUpperCase();
  if (combined.includes("AI") || combined.includes("AUTONOMOUS") || combined.includes("AGENT")) {
    return combined.includes("AUTONOMOUS") ? "AUTONOMOUS AI" : "AI & AUTOMATION";
  }
  if (combined.includes("FINTECH") || combined.includes("BANKING") || combined.includes("MICROSERVICE")) {
    return "FINTECH & CLOUD";
  }
  if (combined.includes("GLOBAL") || combined.includes("INTERNATIONAL") || combined.includes("HUB")) {
    return "GLOBAL EXPANSION";
  }
  if (combined.includes("FOUND") || combined.includes("INCEPTION") || combined.includes("STUDIO")) {
    return "FOUNDATIONS";
  }
  if (combined.includes("HQ") || combined.includes("SCALE") || combined.includes("ENTERPRISE")) {
    return "ENTERPRISE SCALE";
  }
  if (combined.includes("CLOUD")) return "CLOUD INFRA";
  if (combined.includes("SOFTWARE")) return "SOFTWARE DEV";

  if (era.title) {
    const words = era.title.replace(/[^a-zA-Z\s]/g, "").trim().split(/\s+/).filter((w) => w.length > 2);
    if (words.length > 0) {
      return words.slice(0, 2).join(" ").toUpperCase();
    }
  }

  const defaults = ["FOUNDATIONS", "CLOUD", "GLOBAL", "AI EXPANSION", "HQ & SCALE", "NEXT-GEN"];
  return defaults[index % defaults.length];
}

// -----------------------------------------------------------------------------
// MAIN TIMELINE COMPONENT
// -----------------------------------------------------------------------------

interface TimelineProps {
  initialContent?: JourneyPageContent;
  landingHeader?: any;
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
}

export default function Timeline({
  initialContent,
  customBadge,
  customTitle,
  customSubtitle,
}: TimelineProps) {
  const [content, setContent] = useState<JourneyPageContent>(
    initialContent || DEFAULT_JOURNEY_PAGE_DATA
  );
  const [landingHeader, setLandingHeader] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const spineTrackRef = useRef<HTMLDivElement>(null);
  const spineLineRef = useRef<HTMLDivElement>(null);
  const mobileSpineTrackRef = useRef<HTMLDivElement>(null);
  const mobileSpineLineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load landing header overrides
  useEffect(() => {
    async function loadLandingHeader() {
      try {
        const res = await fetch("/api/landing");
        const json = await res.json();
        if (json.success && json.data) {
          const header = json.data.timelineHeader || json.data.journeyHeader;
          if (header) {
            setLandingHeader(header);
          }
        }
      } catch (err) {
        console.warn("Timeline landing header fetch error:", err);
      }
    }
    loadLandingHeader();
  }, []);

  // Load dynamic journey data if not provided
  useEffect(() => {
    if (!initialContent) {
      fetch("/api/journey")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setContent({
              hero: { ...DEFAULT_JOURNEY_PAGE_DATA.hero, ...json.data.hero },
              landingTimelineHeader: {
                ...DEFAULT_JOURNEY_PAGE_DATA.landingTimelineHeader,
                ...json.data.landingTimelineHeader,
              },
              metricsBar: json.data.metricsBar?.length
                ? json.data.metricsBar
                : DEFAULT_JOURNEY_PAGE_DATA.metricsBar,
              eras: json.data.eras?.length ? json.data.eras : DEFAULT_JOURNEY_PAGE_DATA.eras,
              events: json.data.events?.length
                ? json.data.events
                : DEFAULT_JOURNEY_PAGE_DATA.events,
              ctaSection: { ...DEFAULT_JOURNEY_PAGE_DATA.ctaSection, ...json.data.ctaSection },
            });
          }
        })
        .catch((err) => console.warn("Timeline fetch error:", err));
    }
  }, [initialContent]);

  const heroBadge =
    customBadge ||
    landingHeader?.badge ||
    content.landingTimelineHeader?.badge ||
    content.hero?.badge ||
    "Our Journey";

  const rawTitle =
    customTitle ||
    landingHeader?.title ||
    content.landingTimelineHeader?.title ||
    "From a 4-person studio to an";

  const rawHighlight =
    landingHeader?.titleHighlight ||
    (content.landingTimelineHeader as any)?.titleHighlight ||
    "AI-first partner";

  let heroTitle = rawTitle;
  let heroTitleHighlight = rawHighlight;

  if (rawHighlight && rawTitle.toLowerCase().includes(rawHighlight.toLowerCase())) {
    const idx = rawTitle.toLowerCase().indexOf(rawHighlight.toLowerCase());
    heroTitle = rawTitle.substring(0, idx).trim();
    heroTitleHighlight = rawTitle.substring(idx).trim();
  } else if (customTitle && !landingHeader?.titleHighlight) {
    heroTitleHighlight = "";
  }

  const heroSubtitle =
    customSubtitle ||
    landingHeader?.subtitle ||
    content.landingTimelineHeader?.subtitle ||
    "A decade of engineering excellence, technical milestones, and continuous growth.";

  const ctaBtnText =
    content.landingTimelineHeader?.ctaText ||
    "Explore Complete Company Journey & Events Gallery";

  const milestoneEras: TimelineEra[] =
    content.eras && content.eras.length > 0 ? content.eras : DEFAULT_JOURNEY_PAGE_DATA.eras;

  const totalEras = milestoneEras.length;

  // ---------------------------------------------------------------------------
  // SMOOTH SCROLL TRACKING & VIEWPORT FADE LOGIC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;

    let rafId = 0;

    // Viewport tracker: spotlight the row currently in the reading center
    const updateActiveStageOnScroll = () => {
      if (!rowRefs.current || rowRefs.current.length === 0) return;
      const targetY = window.innerHeight * 0.5;

      // 1. Dynamic spine line fill (follows viewport reading line smoothly)
      let lineBottom = 0;
      const isDesktop = window.innerWidth >= 1024;

      if (spineTrackRef.current && spineLineRef.current) {
        const trackRect = spineTrackRef.current.getBoundingClientRect();
        const fillHeight = targetY - trackRect.top;
        const clampedHeight = Math.max(0, Math.min(trackRect.height, fillHeight));
        spineLineRef.current.style.height = `${clampedHeight}px`;
        if (isDesktop) {
          lineBottom = trackRect.top + clampedHeight;
        }
      }

      if (mobileSpineTrackRef.current && mobileSpineLineRef.current) {
        const mobileTrackRect = mobileSpineTrackRef.current.getBoundingClientRect();
        const mobileFillHeight = targetY - mobileTrackRect.top;
        const clampedMobileHeight = Math.max(0, Math.min(mobileTrackRect.height, mobileFillHeight));
        mobileSpineLineRef.current.style.height = `${clampedMobileHeight}px`;
        if (!isDesktop) {
          lineBottom = mobileTrackRect.top + clampedMobileHeight;
        }
      }

      // 2. Active milestone spotlight
      // Strictly enforces: Milestone i highlights ONLY when the spine line fill touches or passes its center point.
      let activeIdx = -1;

      for (let i = 0; i < milestoneEras.length; i++) {
        const pinEl = pinRefs.current[i];
        if (!pinEl) continue;
        const pinRect = pinEl.getBoundingClientRect();
        const pinCenterY = pinRect.top + pinRect.height / 2;

        // Line bottom must touch or reach the center point of pin i
        if (lineBottom >= pinCenterY) {
          activeIdx = i;
        } else {
          // Ordered chronologically top-down: if the line hasn't reached pin i, it cannot reach any subsequent pins
          break;
        }
      }

      // If the currently active row has completely scrolled out above the viewport, deactivate it
      if (activeIdx >= 0) {
        const activeRow = rowRefs.current[activeIdx];
        if (activeRow) {
          const rRect = activeRow.getBoundingClientRect();
          if (rRect.bottom < 0) {
            activeIdx = -1;
          }
        }
      }

      // If user has scrolled past the entire timeline (past the last milestone)
      const lastPin = pinRefs.current[milestoneEras.length - 1];
      if (lastPin) {
        const lastPinRect = lastPin.getBoundingClientRect();
        const lastPinCenter = lastPinRect.top + lastPinRect.height / 2;
        if (lastPinCenter < targetY - window.innerHeight * 0.4) {
          activeIdx = -1;
        }
      }

      setActiveStage((prev) => (prev !== activeIdx ? activeIdx : prev));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveStageOnScroll);
    };

    // Initial check
    updateActiveStageOnScroll();

    // Listen on scroll and resize
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [milestoneEras]);

  function scrollToRow(index: number) {
    const el = rowRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setActiveStage(index);
    }
  }

  return (
    <section
      ref={containerRef}
      id="timeline"
      className="relative overflow-hidden bg-white dark:bg-[#080d19] py-20 lg:py-28 text-slate-900 dark:text-white transition-colors duration-200"
    >
      {/* Background Subtle Gradient & Grid Accents */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] dark:opacity-[0.06]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER (CLEAN TYPOGRAPHY) */}
        <div className="text-left max-w-3xl space-y-3 mb-16 lg:mb-24">
          <span className="font-poppins text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {heroBadge}
          </span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            {heroTitle}{" "}
            {heroTitleHighlight && (
              <span className="text-violet-600 dark:text-violet-400">{heroTitleHighlight}</span>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-poppins text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-normal pt-1 leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* PROGRESSIVE 3-ZONE TIMELINE WORKSPACE                               */}
        {/* ------------------------------------------------------------------- */}
        <div className="relative pb-10 pt-2">
          {/* DESKTOP VERTICAL SPINE TRACK (Positioned at 170px / 200px boundary with 4px width) */}
          <div
            ref={spineTrackRef}
            className="hidden lg:block absolute bottom-12 top-6 left-[170px] xl:left-[200px] w-1.5 rounded-full bg-slate-200 dark:bg-slate-700/80 z-1 overflow-hidden"
          >
            {/* Active Violet Beam that smoothly flows down to reading line */}
            <div
              ref={spineLineRef}
              className="w-full rounded-full bg-gradient-to-b from-violet-600 to-indigo-500 dark:from-violet-500 dark:to-purple-400 shadow-[0_0_12px_rgba(83,64,214,0.45)] dark:shadow-[0_0_14px_rgba(167,139,250,0.85)] will-change-[height]"
              style={{ height: "0px" }}
            />
          </div>

          {/* MOBILE VERTICAL SPINE TRACK */}
          <div
            ref={mobileSpineTrackRef}
            className="block lg:hidden absolute left-4.5 top-4 bottom-10 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700/80 z-1 overflow-hidden"
          >
            <div
              ref={mobileSpineLineRef}
              className="w-full bg-gradient-to-b from-violet-600 to-indigo-500 dark:from-violet-500 dark:to-purple-400 rounded-full shadow-[0_0_12px_rgba(83,64,214,0.45)] dark:shadow-[0_0_14px_rgba(167,139,250,0.85)] will-change-[height]"
              style={{ height: "0px" }}
            />
          </div>

          {/* TIMELINE ROWS */}
          <div className="space-y-16 sm:space-y-20 lg:space-y-28">
            {milestoneEras.map((era, index) => {
              const isActive = activeStage === index;
              const stepFormatted = String(index + 1).padStart(2, "0");
              const totalFormatted = String(totalEras).padStart(2, "0");

              const displayYear = era.displayYear || era.yearRange || "2016";
              const stageDomain = getStageDomain(era, index);

              return (
                <div
                  key={era.id || index}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className={cn(
                    "relative z-2 flex flex-col items-start gap-6 pl-12 sm:pl-16 lg:pl-0 lg:grid lg:grid-cols-[170px_380px_1fr] lg:items-center lg:gap-10 xl:grid-cols-[200px_430px_1fr] xl:gap-14 transition-opacity duration-300 ease-out",
                    isActive
                      ? "opacity-100"
                      : "opacity-45 hover:opacity-80"
                  )}
                >
                  {/* SPINE NODE PIN (Centered on the 4px spine line & vertically aligned with row) */}
                  <div
                    ref={(el) => {
                      pinRefs.current[index] = el;
                    }}
                    onClick={() => scrollToRow(index)}
                    className={cn(
                      "absolute z-10 size-5 rounded-full border-[3px] transition-all duration-300 cursor-pointer",
                      // Mobile position
                      "left-2.5 top-6",
                      // Desktop position (centered on 170px / 200px spine track)
                      "lg:left-[162px] xl:left-[192px] lg:top-1/2 lg:-translate-y-1/2",
                      isActive
                        ? "scale-125 border-violet-600 bg-violet-600 shadow-[0_0_0_6px_rgba(83,64,214,0.22),0_0_18px_rgba(83,64,214,0.4)]"
                        : "scale-100 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_#080d19]"
                    )}
                  />

                  {/* --------------------------------------------------------- */}
                  {/* ZONE 1: USER-FRIENDLY DATE TITLE & STEP COUNTER            */}
                  {/* --------------------------------------------------------- */}
                  <div className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1.5 lg:flex-col lg:items-end lg:pr-6 lg:text-right">
                    {/* Step Index Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-md font-poppins text-[11px] font-bold tracking-wider transition-colors duration-200",
                        isActive
                          ? "bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                      )}
                    >
                      {stepFormatted} / {totalFormatted}
                    </span>

                    {/* Properly Sized Date Title */}
                    <div
                      className={cn(
                        "font-poppins text-2xl lg:text-[26px] font-extrabold tracking-tight leading-snug transition-all duration-300 cursor-pointer select-none",
                        isActive
                          ? "text-violet-600 dark:text-violet-400 scale-[1.02]"
                          : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                      )}
                      onClick={() => scrollToRow(index)}
                      title={`Jump to ${displayYear}`}
                    >
                      {displayYear}
                    </div>
                  </div>

                  {/* --------------------------------------------------------- */}
                  {/* ZONE 2: MIDDLE CARD WITH REAL DYNAMIC IMAGE                */}
                  {/* --------------------------------------------------------- */}
                  <div className="w-full">
                    <div
                      className={cn(
                        "flex w-full flex-col items-center justify-center rounded-[20px] p-3 sm:p-4 border transition-all duration-300",
                        isActive
                          ? "border-violet-300 dark:border-violet-700/80 bg-white dark:bg-slate-900 shadow-[0_20px_45px_rgba(83,64,214,0.12)] lg:-translate-y-1"
                          : "border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
                      )}
                    >
                      <div className="relative w-full h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden bg-slate-950 group">
                        <img
                          src={
                            era.imageUrl ||
                            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                          }
                          alt={era.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                        {/* Dynamic image badge */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
                          <span className="px-2.5 py-1 rounded-full bg-violet-600/90 text-[10px] font-poppins font-bold text-white backdrop-blur-md border border-violet-400/30 shadow-sm">
                            {displayYear} Era
                          </span>
                          {era.subtitle && (
                            <span className="text-[11px] font-poppins font-medium text-white/95 drop-shadow truncate max-w-[200px]">
                              {era.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --------------------------------------------------------- */}
                  {/* ZONE 3: RIGHT NARRATIVE & IMPACT CALLOUT (NO STATIC LIST)  */}
                  {/* --------------------------------------------------------- */}
                  <div className="w-full lg:pl-3 flex flex-col justify-center space-y-3 sm:space-y-4">
                    {/* Category Pill Tag */}
                    <div>
                      <span
                        className={cn(
                          "inline-block rounded-full border px-3.5 py-1 font-poppins text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-200",
                          isActive
                            ? "border-violet-200/80 bg-violet-50 dark:border-violet-800/80 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400"
                            : "border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400"
                        )}
                      >
                        {era.subtitle
                          ? era.subtitle.length > 28
                            ? stageDomain
                            : era.subtitle
                          : "Milestone"}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-poppins text-xl sm:text-2xl lg:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.25]">
                      {era.title}
                    </h3>

                    {/* Narrative Description (from real dynamic narrativeParagraphs) */}
                    <div className="space-y-2">
                      {era.narrativeParagraphs && era.narrativeParagraphs.length > 0 ? (
                        era.narrativeParagraphs.slice(0, 2).map((para, pIdx) => (
                          <p
                            key={pIdx}
                            className="font-poppins text-[14.5px] leading-[1.7] text-slate-600 dark:text-slate-300 max-w-xl font-normal"
                          >
                            {para}
                          </p>
                        ))
                      ) : (
                        <p className="font-poppins text-[14.5px] leading-[1.7] text-slate-600 dark:text-slate-300 max-w-xl font-normal">
                          {era.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Dynamic Quote Callout Card (NO static achievements) */}
                    {era.quoteText && (
                      <div
                        className={cn(
                          "flex max-w-xl items-start gap-3 rounded-lg border border-l-[3.5px] px-4 py-3 text-[13.5px] leading-relaxed font-semibold transition-colors duration-200",
                          isActive
                            ? "border-violet-200 border-l-violet-600 bg-violet-50/70 dark:border-violet-900/60 dark:border-l-violet-500 dark:bg-violet-950/30 text-slate-900 dark:text-slate-100 shadow-2xs"
                            : "border-slate-200 border-l-slate-400 bg-slate-50/70 dark:border-slate-800 dark:border-l-slate-600 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        <Clock className="mt-0.5 size-4.5 shrink-0 text-violet-600 dark:text-violet-400" />
                        <div className="space-y-1">
                          <p className="font-poppins">{era.quoteText}</p>
                          {era.quoteAuthor && (
                            <p className="font-poppins text-[11px] font-normal text-slate-500 dark:text-slate-400">
                              — {era.quoteAuthor}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Dynamic Stats Metrics from DB */}
                    {era.stats && era.stats.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {era.stats.map((st, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50/60 dark:bg-slate-800 border border-violet-100 dark:border-slate-700 font-poppins text-[11px] font-semibold text-violet-700 dark:text-violet-300"
                          >
                            <span className="font-extrabold">{st.value}</span>
                            <span className="font-normal text-slate-500 dark:text-slate-400">
                              {st.label}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CTA: FULL JOURNEY & GALLERY */}
        <div className="mt-20 lg:mt-28 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2.5 rounded-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 px-6 sm:px-7 py-3 sm:py-3.5 font-poppins text-xs sm:text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-105 cursor-pointer"
          >
            <span>{ctaBtnText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}