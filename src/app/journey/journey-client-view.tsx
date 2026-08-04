"use client";

import { useState } from "react";
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
import { JourneyPageContent, TimelineEra, EventItem } from "@/types";
import { DEFAULT_JOURNEY_PAGE_DATA } from "@/data/default-journey-data";

interface JourneyClientViewProps {
  initialContent: JourneyPageContent;
}

export default function JourneyClientView({ initialContent }: JourneyClientViewProps) {
  const content = initialContent || DEFAULT_JOURNEY_PAGE_DATA;

  const hero = content.hero || DEFAULT_JOURNEY_PAGE_DATA.hero;
  const metricsBar = content.metricsBar && content.metricsBar.length > 0 ? content.metricsBar : DEFAULT_JOURNEY_PAGE_DATA.metricsBar;
  const eras: TimelineEra[] = content.eras && content.eras.length > 0 ? content.eras : DEFAULT_JOURNEY_PAGE_DATA.eras;
  const events: EventItem[] = content.events && content.events.length > 0 ? content.events : DEFAULT_JOURNEY_PAGE_DATA.events;
  const ctaSection = content.ctaSection || DEFAULT_JOURNEY_PAGE_DATA.ctaSection;

  const [activeEraIndex, setActiveEraIndex] = useState<number>(Math.min(4, eras.length - 1));
  const [selectedCategory, setSelectedCategory] = useState<string>("All Events");
  const [activeEventModal, setActiveEventModal] = useState<EventItem | null>(null);
  const [isQuickEnquiryOpen, setIsQuickEnquiryOpen] = useState<boolean>(false);

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
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Our Journey & Events</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs backdrop-blur-md">
              <Milestone className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge}</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              {hero.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-ink/75 dark:text-slate-300 sm:text-lg lg:text-xl max-w-3xl mx-auto">
              {hero.subtitle}
            </p>

            {/* Metrics Counter Bar */}
            {metricsBar && metricsBar.length > 0 && (
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/70 dark:bg-[#131c31]/80 backdrop-blur-md border border-violet-100 dark:border-slate-800 shadow-lg">
                {metricsBar.map((mb, idx) => (
                  <div key={idx} className="text-center p-2">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-[#f58220]">
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
        <section className="py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-b border-violet-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            {/* TOP DISPLAY AREA: 2-COLUMN STORY & IMAGE */}
            <AnimatePresence mode="wait">
              {activeEra && (
                <motion.div
                  key={activeEra.id || activeEraIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center mb-16 sm:mb-24"
                >
                  {/* LEFT COLUMN: STORY CONTENT */}
                  <div className="lg:col-span-7 space-y-5">
                    <span className="text-sm font-semibold tracking-wider text-ink/60 dark:text-slate-400 uppercase">
                      {activeEra.yearRange}
                    </span>

                    <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl">
                      {activeEra.title}
                    </h2>

                    <p className="text-xs font-bold uppercase tracking-wider text-[#f58220]">
                      {activeEra.subtitle}
                    </p>

                    <div className="space-y-4 text-base leading-relaxed text-ink/80 dark:text-slate-300 sm:text-lg">
                      {activeEra.narrativeParagraphs?.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>

                    {/* Key Stats Bar */}
                    {activeEra.stats && activeEra.stats.length > 0 && (
                      <div className="pt-4 grid grid-cols-3 gap-3 border-t border-violet-200/80 dark:border-slate-800">
                        {activeEra.stats.map((st, i) => (
                          <div key={i}>
                            <p className="font-display text-lg font-extrabold text-violet-600 dark:text-violet-300 sm:text-xl">
                              {st.value}
                            </p>
                            <p className="text-[11px] font-semibold text-ink/60 dark:text-slate-400">{st.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: HIGH-RES ERA PHOTO CARD */}
                  <div className="lg:col-span-5">
                    <div className="relative overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-3 shadow-2xl">
                      <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden rounded-2xl">
                        <Image
                          src={activeEra.imageUrl}
                          alt={activeEra.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          priority
                          className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        
                        {/* Badge Overlay */}
                        <div className="absolute top-4 left-4">
                          <span className="rounded-full bg-violet-600/90 text-white px-3 py-1 text-xs font-bold backdrop-blur-md">
                            {activeEra.displayYear} Era
                          </span>
                        </div>

                        {/* Bottom Caption Overlay */}
                        {activeEra.quoteText && (
                          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-slate-950/80 p-4 text-xs text-white backdrop-blur-md border border-white/10">
                            <Quote className="h-4 w-4 text-violet-400 mb-1" />
                            <p className="italic text-slate-200">{activeEra.quoteText}</p>
                            {activeEra.quoteAuthor && (
                              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">
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

            {/* BOTTOM TIMELINE BAR WITH CIRCLE BUTTONS & YEAR LABELS */}
            <div className="relative mt-8 pt-8 border-t border-violet-100 dark:border-slate-800/80">
              <div className="relative w-full h-1 bg-violet-200/80 dark:bg-slate-800 rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-violet-600 dark:bg-violet-600 rounded-full"
                  animate={{
                    width: `${(activeEraIndex / Math.max(1, eras.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />

                <div className="absolute inset-0 flex items-center justify-between -top-[14px]">
                  {eras.map((era, index) => {
                    const isActive = activeEraIndex === index;
                    return (
                      <div key={era.id || index} className="relative flex flex-col items-center">
                        <button
                          onClick={() => setActiveEraIndex(index)}
                          aria-label={`Select ${era.displayYear}`}
                          className={`group flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-violet-600 dark:bg-violet-600 text-white ring-4 ring-violet-200 dark:ring-slate-700 shadow-lg scale-125 z-10"
                              : "bg-white dark:bg-[#131c31] border-2 border-violet-300 dark:border-slate-700 text-ink/50 hover:border-violet-600 dark:hover:border-violet-400 hover:scale-110"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full transition-colors ${
                              isActive
                                ? "bg-white"
                                : "bg-violet-300 dark:bg-slate-600 group-hover:bg-violet-600"
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => setActiveEraIndex(index)}
                          className={`mt-4 text-xs sm:text-sm transition-all duration-300 ${
                            isActive
                              ? "font-extrabold text-violet-600 dark:text-violet-300 scale-105"
                              : "font-semibold text-ink/60 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300"
                          }`}
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
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                  <Camera className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                  {content.eventsSection?.badge || DEFAULT_JOURNEY_PAGE_DATA.eventsSection!.badge}
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl">
                  {content.eventsSection?.title || DEFAULT_JOURNEY_PAGE_DATA.eventsSection!.title}
                </h2>
                <p className="mt-3 text-base text-ink/75 dark:text-slate-300">
                  {content.eventsSection?.subtitle || DEFAULT_JOURNEY_PAGE_DATA.eventsSection!.subtitle}
                </p>
              </div>

              {/* Event Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
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
                        <Sparkles className="h-3 w-3 text-amber-400" />
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
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-ink dark:text-white hover:bg-violet-100 dark:hover:bg-slate-700 transition-colors"
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
                    className="font-bold"
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
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <Award className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              {content.ethosSection?.badge || "Engineering Ethos"}
            </div>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              {content.ethosSection?.title || "The 4 Pillars That Guide"}{" "}
              <span className="text-violet-600 dark:text-violet-300">
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

      {/* ================= CALL TO ACTION ================= */}
      <section className="relative py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-center sm:px-16"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/40 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-ember-500/30 blur-[100px]" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {ctaSection?.title || "Ready to Build Your Next High-Impact Product With Us?"}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/60">
                {ctaSection?.subtitle || "Partner with Clickpoint Innovation to design, engineer, and deploy resilient cloud architecture and AI copilots."}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsQuickEnquiryOpen(true)}
                  className="group font-bold shadow-lg shadow-violet-600/30 cursor-pointer"
                >
                  <span>{ctaSection?.buttonText || "Start Project Inquiry"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link href="/careers">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-bold"
                  >
                    Explore Careers
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <QuickEnquiryModal
        isOpen={isQuickEnquiryOpen}
        onClose={() => setIsQuickEnquiryOpen(false)}
      />
    </div>
  );
}