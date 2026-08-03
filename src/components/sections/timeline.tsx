"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle2,
  Milestone,
  ArrowRight,
  Zap,
  Code2,
  Users,
  Bot,
  Sparkles,
  Trophy,
  Rocket,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { JourneyPageContent } from "@/types";
import { DEFAULT_JOURNEY_PAGE_DATA } from "@/data/default-journey-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ICON_LIST = [Zap, Code2, Users, Bot, Trophy, Rocket, Globe, Sparkles];

interface TimelineProps {
  initialContent?: JourneyPageContent;
}

export default function Timeline({ initialContent }: TimelineProps) {
  const [content, setContent] = useState<JourneyPageContent>(
    initialContent || DEFAULT_JOURNEY_PAGE_DATA
  );

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
              metricsBar: json.data.metricsBar?.length ? json.data.metricsBar : DEFAULT_JOURNEY_PAGE_DATA.metricsBar,
              eras: json.data.eras?.length ? json.data.eras : DEFAULT_JOURNEY_PAGE_DATA.eras,
              events: json.data.events?.length ? json.data.events : DEFAULT_JOURNEY_PAGE_DATA.events,
              ctaSection: { ...DEFAULT_JOURNEY_PAGE_DATA.ctaSection, ...json.data.ctaSection },
            });
          }
        })
        .catch((err) => console.warn("Timeline fetch error:", err));
    }
  }, [initialContent]);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGLineElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const heroBadge =
    content.landingTimelineHeader?.badge || content.hero?.badge || "Our Journey";
  const heroTitle =
    content.landingTimelineHeader?.title ||
    "From a 4-person studio to an AI-first partner";
  const heroSubtitle =
    content.landingTimelineHeader?.subtitle ||
    "A decade of engineering excellence, technical milestones, and continuous growth.";
  const ctaBtnText =
    content.landingTimelineHeader?.ctaText ||
    "Explore Complete Company Journey & Events Gallery";

  const milestoneEras =
    content.eras && content.eras.length > 0 ? content.eras : DEFAULT_JOURNEY_PAGE_DATA.eras;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        });
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const isEven = i % 2 === 0;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 30,
            x: isEven ? -20 : 20,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [milestoneEras]);

  return (
    <section
      ref={containerRef}
      id="timeline"
      className="relative overflow-hidden bg-cloud-100 dark:bg-[#0f172a]/40 py-20 lg:py-28 text-ink dark:text-white"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300"
          >
            <Milestone className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
            {heroBadge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl"
          >
            {heroTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-ink/75 dark:text-slate-300 sm:text-lg"
          >
            {heroSubtitle}
          </motion.p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Timeline Center Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 md:block">
            <div className="h-full w-full bg-violet-200/60 dark:bg-slate-800 rounded-full" />
            <svg className="absolute top-0 left-0 h-full w-full overflow-visible">
              <line
                ref={pathRef}
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke="url(#beam-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#f58220" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute left-4 sm:left-6 top-0 h-full w-0.5 bg-gradient-to-b from-violet-600 via-indigo-500 to-amber-500 md:hidden" />

          <div className="space-y-10 md:space-y-20">
            {milestoneEras.map((era, index) => {
              const isEven = index % 2 === 0;
              const Icon = ICON_LIST[index % ICON_LIST.length] || Milestone;
              const displayYear = era.displayYear || era.yearRange;
              const tags =
                era.achievements && era.achievements.length > 0
                  ? era.achievements
                  : era.stats?.map((s) => `${s.value} ${s.label}`) || [];
              const description = era.narrativeParagraphs?.[0] || era.subtitle;

              return (
                <div
                  key={era.id || index}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={cn(
                    "relative flex flex-col md:flex-row md:items-stretch justify-between gap-6",
                    isEven ? "md:flex-row-reverse" : ""
                  )}
                >
                  {/* Circle Icon Badge */}
                  <div className="absolute left-4 sm:left-6 top-0 z-20 flex -translate-x-1/2 items-center justify-center md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#131c31] shadow-md transition-transform duration-300 hover:scale-110">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-300" />
                    </div>
                  </div>

                  {/* Left Column: Text Card */}
                  <div className="pl-10 sm:pl-14 w-full md:w-1/2 md:px-6 lg:px-8 flex flex-col">
                    <div
                      className={cn(
                        "group relative flex-1 flex flex-col justify-between rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-5 sm:p-6 lg:p-7 shadow-sm transition-all duration-300",
                        "hover:-translate-y-1 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10"
                      )}
                    >
                      <div>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="font-display text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-300">
                            {displayYear}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                            {era.subtitle}
                          </span>
                        </div>

                        <h3 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white">
                          {era.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/75 dark:text-slate-300">
                          {description}
                        </p>
                      </div>

                      {tags && tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-violet-100 dark:border-slate-800">
                          {tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="rounded-md bg-violet-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-violet-600 dark:text-violet-300 transition-colors group-hover:bg-violet-600 group-hover:text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Matching Height Visual Image Card */}
                  <div className="hidden md:flex md:w-1/2 md:px-6 lg:px-8 flex-col">
                    {era.imageUrl ? (
                      <div className="group relative flex-1 overflow-hidden rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-1.5 shadow-md transition-all duration-500 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1">
                        <div className="relative h-full min-h-[240px] w-full overflow-hidden rounded-xl bg-slate-900">
                          <img
                            src={era.imageUrl}
                            alt={era.title}
                            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white z-10">
                            <span className="rounded-full bg-violet-600/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-violet-400/40 shadow-sm">
                              {displayYear} Era
                            </span>
                            <span className="text-[11px] font-medium text-white/90 drop-shadow-md truncate max-w-[180px]">
                              {era.subtitle}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 rounded-2xl border border-dashed border-violet-200 dark:border-slate-800 bg-violet-50/40 dark:bg-slate-900/30 flex items-center justify-center p-6 text-center text-xs text-ink/50 dark:text-slate-500">
                        {era.title}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button to Full Journey & Events Page */}
        <div className="mt-16 text-center">
          <Link
            href="/journey"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition-all hover:bg-violet-700 dark:hover:bg-amber-600 hover:shadow-xl hover:scale-105"
          >
            <span>{ctaBtnText}</span>
            <ArrowRight className="h-4 w-4 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}