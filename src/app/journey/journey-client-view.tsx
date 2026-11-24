"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Milestone,
  Calendar,
  MapPin,
  Users,
  Award,
  Zap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  X,
  Camera,
  CheckCircle2,
  Quote,
  Code2,
  Bot,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";
import CtaSection from "@/components/sections/cta-section";
import { JourneyPageContent, TimelineEra, EventItem } from "@/types";
import { DEFAULT_JOURNEY_PAGE_DATA } from "@/data/default-journey-data";
import { cn } from "@/lib/utils";

interface JourneyClientViewProps {
  initialContent: JourneyPageContent;
}

export default function JourneyClientView({ initialContent }: JourneyClientViewProps) {
  const content = initialContent || DEFAULT_JOURNEY_PAGE_DATA;

  const hero = content.hero || DEFAULT_JOURNEY_PAGE_DATA.hero;
  const metricsBar = content.metricsBar && content.metricsBar.length > 0 ? content.metricsBar : DEFAULT_JOURNEY_PAGE_DATA.metricsBar;
  const eras: TimelineEra[] = content.eras && content.eras.length > 0 ? content.eras : DEFAULT_JOURNEY_PAGE_DATA.eras;
  const events: EventItem[] = content.events && content.events.length > 0 ? content.events : DEFAULT_JOURNEY_PAGE_DATA.events;

  const [activeEraIndex, setActiveEraIndex] = useState<number>(Math.min(4, eras.length - 1));
  const [activeEventModal, setActiveEventModal] = useState<EventItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [originRect, setOriginRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isQuickEnquiryOpen, setIsQuickEnquiryOpen] = useState<boolean>(false);

  const handleOpenEvent = (e: React.MouseEvent<HTMLDivElement>, event: EventItem) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOriginRect({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
    setActiveEventModal(event);
    setActivePhotoIndex(0);
  };

  const handleCloseEvent = useCallback(() => {
    if (activeEventModal) {
      const el = document.getElementById(`event-card-${activeEventModal.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setOriginRect({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    setActiveEventModal(null);
  }, [activeEventModal]);

  useEffect(() => {
    if (activeEventModal) {
      document.body.style.overflow = "hidden";
      const photos = (activeEventModal.images && activeEventModal.images.length > 0)
        ? activeEventModal.images
        : [activeEventModal.imageUrl];

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleCloseEvent();
        } else if (e.key === "ArrowLeft") {
          setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
        } else if (e.key === "ArrowRight") {
          setActivePhotoIndex((prev) => (prev + 1) % photos.length);
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [activeEventModal, handleCloseEvent]);

  const originAnim = (() => {
    if (!originRect || typeof window === "undefined") {
      return {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, x: 0, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.85 },
      };
    }
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = originRect.x - centerX;
    const deltaY = originRect.y - centerY;
    const targetWidth = Math.min(window.innerWidth * 0.95, 1152);
    const scale = Math.max(originRect.width / targetWidth, 0.22);
    return {
      initial: { opacity: 0, x: deltaX, y: deltaY, scale },
      animate: { opacity: 1, x: 0, y: 0, scale: 1 },
      exit: { opacity: 0, x: deltaX, y: deltaY, scale },
    };
  })();

  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Smoothly center active era node into view on mobile or scroll
  useEffect(() => {
    const activeNode = nodeRefs.current[activeEraIndex];
    if (activeNode && timelineScrollRef.current) {
      const container = timelineScrollRef.current;
      const nodeLeft = activeNode.offsetLeft;
      const nodeWidth = activeNode.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollTarget = nodeLeft - containerWidth / 2 + nodeWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
    }
  }, [activeEraIndex]);

  const activeEra = eras[activeEraIndex] || eras[0];

  return (
    <div className="min-h-screen bg-background text-ink dark:text-white transition-colors duration-200">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-gradient-to-b from-violet-50/70 via-background to-background dark:from-[#090b1c] dark:via-[#0b0e26] dark:to-background border-b border-violet-100 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-violet-400/30 via-indigo-300/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-amber-400/20 to-transparent blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* LEFT-ALIGNED BREADCRUMB ROUTE */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Our Journey & Events</span>
          </div>

          {/* CENTER-ALIGNED HERO CONTENT */}
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-violet-50 dark:bg-white/[0.04] border border-violet-200/80 dark:border-white/[0.08] text-violet-600 dark:text-violet-300 text-[12px] font-semibold uppercase tracking-[0.06em]">
              <Milestone className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge || "Our Journey & Milestones"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {hero.title ? (
                <>
                  {hero.title.split(" ").slice(0, -3).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {hero.title.split(" ").slice(-3).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  From a 4-person studio to an{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    AI-first partner
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium pt-1">
              {hero.subtitle}
            </p>

            {/* Metrics Counter Bar */}
            {metricsBar && metricsBar.length > 0 && (
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-md bg-white/70 dark:bg-[#131c31]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
                {metricsBar.map((mb, idx) => (
                  <div key={idx} className="text-center p-2">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400">
                      {mb.value}
                    </p>
                    <p className="text-xs font-semibold text-ink dark:text-white mt-1">{mb.label}</p>
                    {mb.sublabel && (
                      <p className="text-[10px] text-ink/60 dark:text-slate-400 font-medium">{mb.sublabel}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: INTERACTIVE HORIZONTAL TIMELINE ================= */}
      {eras && eras.length > 0 && (
        <section className="py-16 lg:py-24 bg-violet-50/40 dark:bg-[#080d19] border-b border-violet-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            {/* TOP DISPLAY AREA: 2-COLUMN STORY & IMAGE */}
            <div className="relative mb-14 sm:mb-20">
              <AnimatePresence mode="wait">
                {activeEra && (
                  <motion.div
                    key={activeEra.id || activeEraIndex}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center"
                  >
                    {/* LEFT COLUMN: STORY CONTENT */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                      <span className="font-poppins text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 block">
                        {activeEra.displayYear || activeEra.yearRange}
                      </span>

                      <h2 className="font-poppins text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                        {activeEra.title}
                      </h2>

                      {activeEra.subtitle && (
                        <p className="font-poppins text-xs sm:text-sm font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                          {activeEra.subtitle}
                        </p>
                      )}

                      <div className="space-y-3 sm:space-y-3.5 font-poppins text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                        {activeEra.narrativeParagraphs?.map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                      </div>

                      {/* Key Stats Bar with Top Divider */}
                      {activeEra.stats && activeEra.stats.length > 0 && (
                        <div className="pt-5 mt-6 border-t border-violet-100 dark:border-slate-800/80 grid grid-cols-3 gap-4 sm:gap-6">
                          {activeEra.stats.map((st, i) => (
                            <div key={i}>
                              <p className="font-poppins text-lg sm:text-xl font-extrabold text-violet-600 dark:text-violet-400">
                                {st.value}
                              </p>
                              <p className="font-poppins text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                {st.label || st.sublabel}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RIGHT COLUMN: CLEAN ERA PHOTO FRAME (12px Radius, 1px Border, Shadow MD) */}
                    <div className="lg:col-span-5">
                      <div className="relative aspect-[4/3] sm:h-[400px] w-full overflow-hidden rounded-lg border border-slate-200/80 dark:border-white/[0.10] bg-slate-950 shadow-md group">
                        <Image
                          src={activeEra.imageUrl}
                          alt={activeEra.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          priority
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Top-Left Floating Badge */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className="rounded-xs bg-violet-600/90 text-white px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md shadow-xs">
                            {activeEra.displayYear} Era
                          </span>
                        </div>

                        {/* Bottom Caption Overlay */}
                        {activeEra.quoteText && (
                          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 rounded-md bg-[#0c1020]/90 text-white p-3.5 sm:p-4 backdrop-blur-md border border-white/10 shadow-sm">
                            <Quote className="h-3.5 w-3.5 text-violet-400 mb-1" />
                            <p className="italic text-xs text-slate-200 leading-relaxed">
                              "{activeEra.quoteText}"
                            </p>
                            {activeEra.quoteAuthor && (
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 mt-1.5 block">
                                — {activeEra.quoteAuthor}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ================= BOTTOM HORIZONTAL TIMELINE BAR ================= */}
            <div className="relative mt-12 sm:mt-16 pt-8 border-t border-violet-100 dark:border-slate-800/80">
              {/* Header with Prev/Next Controls */}
              <div className="flex items-center justify-between mb-6 px-2 sm:px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                  <span className="font-poppins text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Timeline Stage {activeEraIndex + 1} of {eras.length}
                  </span>
                </div>

                {/* Quick Prev / Next Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveEraIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeEraIndex === 0}
                    aria-label="Previous Era"
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:border-violet-400 dark:hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-poppins text-xs font-semibold shadow-xs"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEraIndex((prev) => Math.min(eras.length - 1, prev + 1))}
                    disabled={activeEraIndex === eras.length - 1}
                    aria-label="Next Era"
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:border-violet-400 dark:hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-poppins text-xs font-semibold shadow-xs"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Track Container */}
              <div
                ref={timelineScrollRef}
                className="w-full overflow-x-auto no-scrollbar py-3 scroll-smooth px-6 sm:px-10"
                tabIndex={0}
                role="tablist"
                aria-label="Milestone Eras"
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    setActiveEraIndex((prev) => Math.max(0, prev - 1));
                  } else if (e.key === "ArrowRight") {
                    setActiveEraIndex((prev) => Math.min(eras.length - 1, prev + 1));
                  }
                }}
              >
                <div className="min-w-[620px] sm:min-w-0 relative w-full h-24">
                  {/* Continuous Base Spine Line */}
                  <div className="absolute left-0 right-0 top-6 -translate-y-1/2 pointer-events-none h-1.5 z-0">
                    {/* Inactive Base Line */}
                    <div className="h-full w-full bg-violet-200/70 dark:bg-slate-700/80 rounded-full" />

                    {/* Active Filled Progress Line (Clean solid line, no glow) */}
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-500 dark:from-violet-500 dark:via-purple-400 dark:to-violet-400 rounded-full transition-[width] duration-500 ease-out z-1"
                      style={{
                        width: `${(activeEraIndex / Math.max(1, eras.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Absolute Positioned Era Nodes with Mathematical Precision */}
                  {eras.map((era, index) => {
                    const isActive = activeEraIndex === index;
                    const isPast = index < activeEraIndex;
                    const percentLeft = (index / Math.max(1, eras.length - 1)) * 100;

                    return (
                      <div
                        key={era.id || index}
                        ref={(el) => {
                          nodeRefs.current[index] = el;
                        }}
                        style={{ left: `${percentLeft}%` }}
                        className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10"
                      >
                        {/* Circle Point Dot Button (w-12 h-12 = 48px x 48px, centering dot at y=24) */}
                        <button
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-label={`Select ${era.displayYear} era`}
                          onClick={() => setActiveEraIndex(index)}
                          className="group relative flex h-12 w-12 items-center justify-center cursor-pointer focus:outline-none"
                        >
                          {isActive ? (
                            /* Active Circle Dot: Outer Translucent Halo + Solid Violet Circle + Center White Dot */
                            <div className="relative flex items-center justify-center">
                              {/* Outer Translucent Halo */}
                              <motion.div
                                layoutId="activeTimelineHalo"
                                className="absolute size-11 sm:size-12 rounded-full bg-violet-600/20 dark:bg-violet-400/25"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              />
                              {/* Middle Solid Violet Circle */}
                              <div className="relative z-10 size-7 sm:size-8 rounded-full bg-violet-600 dark:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/40 dark:shadow-violet-400/50">
                                {/* Center White Point Dot */}
                                <span className="size-2 sm:size-2.5 rounded-full bg-white block" />
                              </div>
                            </div>
                          ) : isPast ? (
                            /* Visited / Reached Circle Dot on Fillup Line */
                            <div className="size-7 sm:size-8 rounded-full border-2 border-violet-500 dark:border-violet-400 bg-violet-50 dark:bg-[#1a1c36] flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-xs shadow-violet-500/20">
                              <span className="size-2 sm:size-2.5 rounded-full bg-violet-600 dark:bg-violet-400 group-hover:scale-125 transition-transform block" />
                            </div>
                          ) : (
                            /* Future Unvisited Circle Dot */
                            <div className="size-7 sm:size-8 rounded-full border-2 border-violet-200/80 dark:border-slate-700 bg-white dark:bg-[#131c31] flex items-center justify-center transition-all duration-200 group-hover:border-violet-400 dark:group-hover:border-slate-500 group-hover:scale-110 shadow-xs">
                              <span className="size-2 sm:size-2.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-violet-500 dark:group-hover:bg-slate-400 transition-colors block" />
                            </div>
                          )}
                        </button>

                        {/* Year Text Label Directly Below Dot */}
                        <button
                          type="button"
                          onClick={() => setActiveEraIndex(index)}
                          className={cn(
                            "mt-2.5 sm:mt-3 text-center whitespace-nowrap transition-colors duration-200 font-poppins cursor-pointer select-none",
                            isActive
                              ? "font-extrabold text-sm sm:text-base text-violet-600 dark:text-violet-400"
                              : isPast
                              ? "font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-300"
                              : "font-medium text-xs sm:text-sm text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          )}
                        >
                          {era.displayYear}
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* ================= SECTION 2: GALLERY OF EVENTS & CULTURE ================= */}
      {events && events.length > 0 && (
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl space-y-3 text-left">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  {content.eventsSection?.badge || DEFAULT_JOURNEY_PAGE_DATA.eventsSection?.badge || "Company Culture & Events"}
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  {content.eventsSection?.title || DEFAULT_JOURNEY_PAGE_DATA.eventsSection?.title || "Moments That Define Our"}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {content.eventsSection?.highlightText || DEFAULT_JOURNEY_PAGE_DATA.eventsSection?.highlightText || "Engineering Spirit"}
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-medium pt-1">
                  {content.eventsSection?.subtitle || DEFAULT_JOURNEY_PAGE_DATA.eventsSection?.subtitle || "Explore photos, hackathons, global tech expos, and team celebrations across our engineering hubs."}
                </p>
              </div>
            </div>

            {/* Dynamic 4-Column Grid Layout (Broadway Infosys Style) */}
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {events.map((event) => {
                  const photos = (event.images && event.images.length > 0)
                    ? event.images
                    : [event.imageUrl];

                  return (
                    <motion.div
                      layout
                      id={`event-card-${event.id}`}
                      key={event.id}
                      onClick={(e) => handleOpenEvent(e, event)}
                      className="group relative cursor-pointer overflow-hidden rounded-md bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-white/[0.16] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                    >
                      {/* Cover Photo Frame with subtle hover zoom only on image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                        {/* Photo Count Badge (Bottom-Left, Broadway Infosys Reference Style) */}
                        <div className="absolute bottom-2.5 left-2.5 z-10">
                          <span className="inline-flex items-center gap-1 rounded-xs bg-black/75 backdrop-blur-md px-2 py-0.5 text-[11px] font-semibold text-white border border-white/10 shadow-xs">
                            <Camera className="h-3 w-3 text-amber-400" />
                            <span>{photos.length} Photos</span>
                          </span>
                        </div>

                        {/* Key Metric Badge (Top-Right if present) */}
                        {event.keyMetric && (
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <span className="rounded-xs bg-amber-500/95 text-slate-950 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide backdrop-blur-md">
                              {event.keyMetric}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Details Box */}
                      <div className="p-3 sm:p-3.5 text-left flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {event.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {event.subtitle}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          <span className="flex items-center gap-1 truncate max-w-[150px]">
                            <Calendar className="h-3 w-3 text-violet-500 shrink-0" />
                            {event.date}
                          </span>
                          <span className="text-violet-600 dark:text-violet-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            View <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* ================= EVENT BROADWAY INFOSYS LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {activeEventModal && (
          <motion.div
            key="event-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-hidden"
            onClick={handleCloseEvent}
          >
            <motion.div
              key="event-modal-dialog"
              initial={originAnim.initial}
              animate={originAnim.animate}
              exit={originAnim.exit}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 280,
                mass: 0.85,
              }}
              className="relative w-[95vw] max-w-6xl h-[88vh] max-h-[820px] bg-slate-950 rounded-lg border border-slate-700/80 dark:border-white/[0.12] shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const photos = (activeEventModal.images && activeEventModal.images.length > 0)
                  ? activeEventModal.images
                  : [activeEventModal.imageUrl];
                const currentPhoto = photos[activePhotoIndex] || activeEventModal.imageUrl;

                return (
                  <>
                    {/* Left Column: Full Theater Stage with Ambient Backdrop (~68% on Desktop) */}
                    <div className="relative md:w-[65%] lg:w-[68%] h-[45%] md:h-full bg-slate-950 shrink-0 flex items-center justify-center overflow-hidden select-none">
                      {/* Ambient Blurred Backdrop */}
                      {currentPhoto && (
                        <div
                          className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-125 opacity-35 pointer-events-none"
                          style={{ backgroundImage: `url(${currentPhoto})` }}
                        />
                      )}

                      {/* Main Sharp Photo */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-8">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={currentPhoto}
                            src={currentPhoto}
                            alt={activeEventModal.title}
                            initial={{ opacity: 0.4, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.4 }}
                            transition={{ duration: 0.2 }}
                            className="max-h-full max-w-full object-contain rounded-xs drop-shadow-2xl"
                          />
                        </AnimatePresence>
                      </div>

                      {/* Bottom Stage Overlay (Broadway Infosys Title Banner) */}
                      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 sm:p-6 text-left pointer-events-none">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          {activeEventModal.keyMetric && (
                            <span className="inline-block px-2 py-0.5 rounded-xs text-[9px] font-semibold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                              {activeEventModal.keyMetric}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                          {activeEventModal.title}
                        </h3>
                        {activeEventModal.subtitle && (
                          <p className="mt-0.5 text-xs sm:text-sm text-slate-300 drop-shadow-sm line-clamp-1">
                            {activeEventModal.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Prev/Next Navigation Controls */}
                      {photos.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
                            }}
                            aria-label="Previous photo"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg cursor-pointer"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoIndex((prev) => (prev + 1) % photos.length);
                            }}
                            aria-label="Next photo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg cursor-pointer"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Right Column: Clean Detail Panel (~32% on Desktop, matching Broadway Infosys) */}
                    <div className="relative md:w-[35%] lg:w-[32%] h-[55%] md:h-full bg-white dark:bg-[#131c31] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
                      {/* Header with Title, Date and Close Button */}
                      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 shrink-0 relative pr-14 text-left">
                        <button
                          onClick={handleCloseEvent}
                          aria-label="Close modal"
                          className="absolute top-4 sm:top-5 right-4 sm:right-5 flex h-8 w-8 items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {activeEventModal.title}
                        </h4>

                        <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{activeEventModal.date}</span>
                        </div>

                        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {activePhotoIndex + 1} of {photos.length} {photos.length === 1 ? "image" : "images"}
                        </p>

                        <div className="mt-3 border-b border-slate-200 dark:border-slate-800" />
                      </div>

                      {/* Scrollable Details Body */}
                      <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left flex-1">
                        {/* Multi-Photo Thumbnails 2-Column Grid (Broadway Infosys Gallery Style - Image 4) */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {photos.map((photoUrl, pIdx) => {
                            const isCurrent = pIdx === activePhotoIndex;
                            return (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => setActivePhotoIndex(pIdx)}
                                title={`View image ${pIdx + 1}`}
                                className={`group/thumb relative aspect-[4/3] overflow-hidden rounded-xs border transition-all text-left cursor-pointer ${
                                  isCurrent
                                    ? "border-2 border-violet-600 ring-2 ring-violet-500/30 scale-[1.01]"
                                    : "border-slate-200 dark:border-slate-700/80 opacity-80 hover:opacity-100 hover:border-slate-400"
                                }`}
                              >
                                <img
                                  src={photoUrl}
                                  alt={`Gallery photo ${pIdx + 1}`}
                                  className="h-full w-full object-cover object-center group-hover/thumb:scale-105 transition-transform duration-300"
                                />
                                {/* Broadway-style hover title overlay */}
                                <div
                                  className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1 transition-opacity ${
                                    isCurrent ? "opacity-100" : "opacity-0 group-hover/thumb:opacity-100"
                                  }`}
                                >
                                  <p className="text-[10px] font-bold text-white text-center truncate px-1">
                                    {activeEventModal.title}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Full Story Description */}
                        {activeEventModal.fullStory && (
                          <div className="pt-2">
                            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                              About This Event
                            </h5>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                              {activeEventModal.fullStory}
                            </p>
                          </div>
                        )}

                        {/* Highlights & Key Takeaways */}
                        {activeEventModal.highlights && activeEventModal.highlights.length > 0 && (
                          <div className="pt-2">
                            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-[#0a66c2] dark:text-blue-400 mb-2 flex items-center gap-1.5">
                              <span>Highlights & Key Takeaways</span>
                            </h5>
                            <div className="space-y-1.5">
                              {activeEventModal.highlights.map((h, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                                  <span>{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer CTA */}
                      <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
                        <span className="text-[11px] font-medium text-slate-400">
                          Clickpoint Events & Culture
                        </span>

                        <button
                          onClick={handleCloseEvent}
                          className="px-5 py-2 text-xs font-semibold rounded-sm border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SECTION 3: CORE OPERATING VALUES ================= */}
      <section className="py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-t border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 text-left mb-16">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              {content.ethosSection?.badge || "Engineering Ethos"}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {content.ethosSection?.title || "The 4 Pillars That Guide"}{" "}
              <span className="text-violet-600 dark:text-orange-500">
                {content.ethosSection?.highlightText || "Our Work"}
              </span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(content.ethosSection?.pillars || DEFAULT_JOURNEY_PAGE_DATA.ethosSection?.pillars || []).map((pillar, idx) => {
              const EthosIcon = [Zap, Code2, Users, Bot][idx % 4] || Zap;
              return (
                <div key={pillar.id || idx} className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-violet-50 dark:bg-white/[0.04] text-violet-600 dark:text-violet-300 mb-5 border border-violet-100 dark:border-white/[0.08]">
                    <EthosIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink dark:text-white">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DYNAMIC UNIVERSAL CALL TO ACTION ================= */}
      <CtaSection />

      <Footer />

      <QuickEnquiryModal
        isOpen={isQuickEnquiryOpen}
        onClose={() => setIsQuickEnquiryOpen(false)}
      />
    </div>
  );
}