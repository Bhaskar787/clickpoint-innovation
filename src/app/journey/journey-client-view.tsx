"use client";

import { useState, useRef, useEffect } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All Events");
  const [activeEventModal, setActiveEventModal] = useState<EventItem | null>(null);
  const [isQuickEnquiryOpen, setIsQuickEnquiryOpen] = useState<boolean>(false);

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

  // Filter events by category
  const filteredEvents =
    selectedCategory === "All Events"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const rawCategories =
    content.eventCategories && content.eventCategories.length > 0
      ? content.eventCategories
      : DEFAULT_JOURNEY_PAGE_DATA.eventCategories || [];

  const categories = [
    "All Events",
    ...rawCategories.filter((c) => c !== "All Events"),
  ];

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-300 text-xs font-extrabold uppercase tracking-widest shadow-xs">
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
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/70 dark:bg-[#131c31]/80 backdrop-blur-md border border-violet-100 dark:border-slate-800 shadow-lg">
                {metricsBar.map((mb, idx) => (
                  <div key={idx} className="text-center p-2">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400">
                      {mb.value}
                    </p>
                    <p className="text-xs font-bold text-ink dark:text-white mt-0.5">{mb.label}</p>
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

                    {/* RIGHT COLUMN: HIGH-RES ERA PHOTO CARD */}
                    <div className="lg:col-span-5">
                      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-3 sm:p-4 shadow-xl shadow-violet-950/5">
                        <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden rounded-2xl sm:rounded-[24px]">
                          <Image
                            src={activeEra.imageUrl}
                            alt={activeEra.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 42vw"
                            priority
                            className="object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Top-Left Floating Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <span className="font-poppins rounded-full bg-violet-600/90 text-white px-3.5 py-1 text-xs font-bold backdrop-blur-md shadow-xs">
                              {activeEra.displayYear} Era
                            </span>
                          </div>

                          {/* Bottom Caption Overlay */}
                          {activeEra.quoteText && (
                            <div className="absolute bottom-4 left-4 right-4 z-10 rounded-2xl bg-[#0c1020]/90 text-white p-4 sm:p-5 backdrop-blur-md border border-white/10 shadow-lg">
                              <Quote className="h-4 w-4 text-violet-400 mb-1.5" />
                              <p className="font-poppins italic text-xs sm:text-sm text-slate-200 leading-relaxed">
                                "{activeEra.quoteText}"
                              </p>
                              {activeEra.quoteAuthor && (
                                <p className="font-poppins text-[10px] sm:text-xs font-bold uppercase tracking-wider text-violet-400 mt-2 block">
                                  — {activeEra.quoteAuthor}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
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
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-violet-200 dark:border-slate-800 bg-white dark:bg-[#131c31] text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:border-violet-400 dark:hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-poppins text-xs font-semibold"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEraIndex((prev) => Math.min(eras.length - 1, prev + 1))}
                    disabled={activeEraIndex === eras.length - 1}
                    aria-label="Next Era"
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-violet-200 dark:border-slate-800 bg-white dark:bg-[#131c31] text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:border-violet-400 dark:hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-poppins text-xs font-semibold"
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

                    {/* Active Filled Progress Line (Glowing & 100% visible in Night Mode) */}
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-500 dark:from-violet-500 dark:via-purple-400 dark:to-violet-400 rounded-full transition-[width] duration-500 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)] dark:shadow-[0_0_16px_rgba(167,139,250,0.95),0_0_6px_rgba(192,132,252,0.9)] z-1"
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

              {/* Event Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-violet-600 dark:bg-violet-600 text-white shadow-md"
                        : "bg-cloud-100 dark:bg-slate-800 text-ink/70 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-700 border border-violet-100 dark:border-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Grid Layout */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={event.id}
                    onClick={() => setActiveEventModal(event)}
                    className={`group relative overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-slate-900 shadow-xl cursor-pointer ${
                      event.colSpanDesktop || "lg:col-span-1"
                    } ${event.heightClass || "h-[360px]"}`}
                  >
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-85 group-hover:opacity-100"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-violet-300 dark:text-violet-300 border border-violet-500/30">
                        <Milestone className="h-3 w-3 text-amber-400" />
                        {event.category}
                      </span>
                      {event.keyMetric && (
                        <span className="rounded-full bg-amber-500/90 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide backdrop-blur-md">
                          {event.keyMetric}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-10 flex items-end justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 mb-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-violet-400" />
                            {event.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 truncate max-w-[200px]">
                            <MapPin className="h-3.5 w-3.5 text-violet-400" />
                            {event.location}
                          </span>
                        </div>

                        <h3 className="font-display text-2xl font-extrabold text-white group-hover:text-violet-300 transition-colors">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-300 line-clamp-1">
                          {event.subtitle}
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 dark:bg-slate-800/80 text-white backdrop-blur-md border border-white/20 group-hover:bg-violet-600 group-hover:border-violet-600 group-hover:scale-110 transition-all duration-300">
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* ================= EVENT LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {activeEventModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 sm:p-8 shadow-2xl my-8"
            >
              <button
                onClick={() => setActiveEventModal(null)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-ink dark:text-white hover:bg-violet-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl">
                <Image
                  src={activeEventModal.imageUrl}
                  alt={activeEventModal.title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold">
                    {activeEventModal.category}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold">{activeEventModal.title}</h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink/70 dark:text-slate-300 border-b border-violet-100 dark:border-slate-800 pb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    {activeEventModal.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    {activeEventModal.location}
                  </span>
                  {activeEventModal.attendees && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      {activeEventModal.attendees}
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-ink/80 dark:text-slate-300">
                  {activeEventModal.fullStory}
                </p>

                {activeEventModal.highlights && activeEventModal.highlights.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-slate-400 mb-2">
                      Event Highlights & Takeaways
                    </h4>
                    <div className="space-y-2">
                      {activeEventModal.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-medium text-ink/80 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => setActiveEventModal(null)}
                    className="font-bold cursor-pointer"
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
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
                <div key={pillar.id || idx} className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-5 border border-violet-100 dark:border-slate-700">
                    <EthosIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink dark:text-white">{pillar.title}</h3>
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