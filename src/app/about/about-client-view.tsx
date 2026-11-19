"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Building2,
  Users,
  Globe2,
  Code2,
  Linkedin,
  Twitter,
  Target,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Timeline from "@/components/sections/timeline";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { STATS_DATA } from "@/data/landing-data";

function getInitials(name: string): string {
  if (!name || !name.trim()) return "CP";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AboutClientViewProps {
  initialContent: any;
  journeyContent?: any;
}

export default function AboutClientView({ initialContent, journeyContent }: AboutClientViewProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [originRect, setOriginRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    // Sync client state if initialContent changes
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleClose = useCallback(() => {
    if (selectedMember) {
      const cardEl = document.getElementById(`team-card-${selectedMember.id}`);
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        setOriginRect({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    setSelectedMember(null);
  }, [selectedMember]);

  const handleSelectMember = useCallback((member: any) => {
    setSelectedMember(member);
    const cardEl = document.getElementById(`team-card-${member.id}`);
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      setOriginRect({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        } else if (e.key === "ArrowLeft") {
          const team = content.leadership?.team || [];
          if (team.length > 0) {
            const idx = team.findIndex((m: any) => m.id === selectedMember.id);
            const newIdx = (idx - 1 + team.length) % team.length;
            handleSelectMember(team[newIdx]);
          }
        } else if (e.key === "ArrowRight") {
          const team = content.leadership?.team || [];
          if (team.length > 0) {
            const idx = team.findIndex((m: any) => m.id === selectedMember.id);
            const newIdx = (idx + 1) % team.length;
            handleSelectMember(team[newIdx]);
          }
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
  }, [selectedMember, content.leadership?.team, handleClose, handleSelectMember]);

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
      initial: {
        opacity: 0,
        x: deltaX,
        y: deltaY,
        scale: scale,
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      },
      exit: {
        opacity: 0,
        x: deltaX,
        y: deltaY,
        scale: scale,
      },
    };
  })();

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Hero Section - Direct Text Over Video */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        {/* Background Video */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <video
            key={content.hero.videoUrl || "default-video"}
            src={content.hero.videoUrl || "/images/video.mp4"}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
          >
            <source src={content.hero.videoUrl || "/images/video.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-cloud-100/35 dark:to-[#0b1120]" />
        </div>

        {/* Ambient Glow Accents */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-32 right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-500/30 via-indigo-500/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-amber-500/20 to-transparent blur-[110px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          {/* LEFT-ALIGNED BREADCRUMB ROUTE */}
          <div className="mb-8 flex items-center justify-start gap-2 text-xs font-semibold text-slate-200 drop-shadow-sm">
            <Link href="/" className="hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-violet-300 font-bold">About Us</span>
          </div>

          {/* CENTER-ALIGNED HERO CONTENT */}
          <div className="mx-auto max-w-4xl text-center space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-slate-900/80 px-4 py-1.5 text-xs font-bold text-violet-200 backdrop-blur-md shadow-lg uppercase tracking-widest">
              <Building2 className="h-3.5 w-3.5 text-violet-400" />
              <span>{content.hero.badge || "About Click Point Innovations"}</span>
            </div>

            {/* Main Title with Adaptive Highlighting */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg leading-[1.12]">
              {content.hero.title ? (
                <>
                  {content.hero.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-violet-400 dark:text-orange-500">
                    {content.hero.title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  Architecting Tomorrow’s{" "}
                  <span className="text-violet-400 dark:text-orange-500">
                    Digital Ecosystems
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-100 max-w-2xl mx-auto font-medium drop-shadow-md pt-1">
              {content.hero.subtitle}
            </p>

            {/* Glassmorphic Stats Banner */}
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-white/20 bg-slate-900/70 p-6 sm:grid-cols-4 shadow-2xl backdrop-blur-xl">
              {(content.stats && content.stats.length > 0 ? content.stats : STATS_DATA).map((stat: any) => (
                <div key={stat.id} className="p-2 text-center">
                  <p className="font-display text-3xl font-black text-white sm:text-4xl drop-shadow-sm">
                    <span className="text-violet-400">{stat.value}</span>
                    <span className="text-amber-400">{stat.suffix}</span>
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-200 tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="#leadership">
                <Button size="lg" className="group bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-xl border-none px-6 cursor-pointer">
                  {content.hero.primaryBtnText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="#story">
                <Button variant="outline" size="lg" className="border-white/40 bg-slate-900/60 text-white font-semibold backdrop-blur-md hover:bg-slate-800 hover:text-white px-6 shadow-lg cursor-pointer">
                  {content.hero.secondaryBtnText}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Vision Section */}
      <section id="story" className="py-20 lg:py-28 bg-cloud-100/70 dark:bg-slate-900/40 border-y border-violet-100/80 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-3 text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                {content.mission.tag}
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {content.mission.heading ? (
                  <>
                    {content.mission.heading.split(" ").slice(0, -2).join(" ")}{" "}
                    <span className="text-violet-600 dark:text-orange-500">
                      {content.mission.heading.split(" ").slice(-2).join(" ")}
                    </span>
                  </>
                ) : (
                  <>
                    Engineered to Drive Measurable{" "}
                    <span className="text-violet-600 dark:text-orange-500">
                      Enterprise Impact
                    </span>
                  </>
                )}
              </h2>

              <p className="text-base leading-relaxed text-ink/75 dark:text-slate-300 font-medium pt-2">
                {content.mission.paragraph1}
              </p>
              <p className="text-base leading-relaxed text-ink/75 dark:text-slate-300">
                {content.mission.paragraph2}
              </p>

              {/* Dynamic Feature Bullets */}
              <div className="mt-8 space-y-3 pt-2">
                {content.mission.bullets.map((bullet: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="text-sm font-semibold text-ink dark:text-white">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Global Engineering Pods Visual Card */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="group relative overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-2xl shadow-violet-950/10">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl transition-all duration-700 group-hover:scale-125" />
                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/30">
                    <Globe2 className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-ink dark:text-white">
                    {content.mission.cardTitle || "Global Engineering Pods"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-slate-300">
                    {content.mission.cardDesc || "Our distributed engineering pods operate round-the-clock, delivering continuous integration and rapid feature deployments with zero downtime."}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-violet-100 dark:border-slate-800">
                    <div className="rounded-xl bg-violet-50/80 dark:bg-slate-800 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                        {content.mission.statBox1Label || "Timezones Covered"}
                      </p>
                      <p className="font-display text-xl font-bold text-ink dark:text-white">
                        {content.mission.statBox1Value || "3 Continents"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-violet-50/80 dark:bg-slate-800 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                        {content.mission.statBox2Label || "Code Reviews"}
                      </p>
                      <p className="font-display text-xl font-bold text-ink dark:text-white">
                        {content.mission.statBox2Value || "100% Peer Audited"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl space-y-3 text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              {content.values.tag}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {content.values.title ? (
                <>
                  {content.values.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {content.values.title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  Core Operating Principles That{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    Drive Us
                  </span>
                </>
              )}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.values.items.map((val: any) => (
              <div
                key={val.id}
                className="group rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-sm transition-all hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Code2 className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-ink dark:text-white">{val.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65 dark:text-slate-300">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Team Section */}
      <section id="leadership" className="py-20 lg:py-28 bg-cloud-100/70 dark:bg-[#0f172a]/50 border-t border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl space-y-3 text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              {content.leadership.tag}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {content.leadership.title ? (
                <>
                  {content.leadership.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {content.leadership.title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  Engineers, Designers & AI{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    Architects
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium pt-1">
              {content.leadership.subtitle}
            </p>
          </div>

          {/* Dynamic Team Members 4-Column Portrait Grid */}
          <div className="grid gap-2 sm:gap-2.5 lg:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {content.leadership.team.map((member: any) => {
              const initials = getInitials(member.name);

              return (
                <div
                  id={`team-card-${member.id}`}
                  key={member.id}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setOriginRect({
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                      width: rect.width,
                      height: rect.height,
                    });
                    setSelectedMember(member);
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-[4px] bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-xs h-[390px] sm:h-[430px] lg:h-[450px] w-full flex flex-col justify-end"
                >
                  {/* Full-bleed Profile Photo with subtle hover zoom only on image */}
                  {member.imageUrl && member.imageUrl.trim() !== "" ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white">
                      <span className="font-display text-5xl sm:text-6xl font-black text-white drop-shadow-md">
                        {initials}
                      </span>
                    </div>
                  )}

                  {/* Bottom Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />

                  {/* Name and Designation Overlay at Bottom */}
                  <div className="relative z-10 p-3.5 sm:p-4 text-left">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                      {member.name}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-300 leading-tight">
                      {member.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Member Detail Modal with Smooth Stretching Small-to-Big Animation */}
          <AnimatePresence>
            {selectedMember && (
              <motion.div
                key="leadership-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-hidden"
                onClick={handleClose}
              >
                <motion.div
                  key="leadership-modal-dialog"
                  initial={originAnim.initial}
                  animate={originAnim.animate}
                  exit={originAnim.exit}
                  transition={{
                    type: "spring",
                    damping: 28,
                    stiffness: 280,
                    mass: 0.85,
                  }}
                  className="relative w-[95vw] max-w-6xl h-[88vh] max-h-[820px] bg-slate-950 rounded-[4px] border border-slate-700/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Column: Full Theater Stage with Ambient Backdrop (~68% on Desktop) */}
                  <div className="relative md:w-[65%] lg:w-[68%] h-[45%] md:h-full bg-slate-950 shrink-0 flex items-center justify-center overflow-hidden select-none">
                    {/* Ambient Blurred Backdrop */}
                    {selectedMember.imageUrl && selectedMember.imageUrl.trim() !== "" && (
                      <div
                        className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-125 opacity-35 pointer-events-none"
                        style={{ backgroundImage: `url(${selectedMember.imageUrl})` }}
                      />
                    )}

                    {/* Main Sharp Profile Photo */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-8">
                      <AnimatePresence mode="wait">
                        {selectedMember.imageUrl && selectedMember.imageUrl.trim() !== "" ? (
                          <motion.img
                            key={selectedMember.id}
                            src={selectedMember.imageUrl}
                            alt={selectedMember.name}
                            initial={{ opacity: 0.4, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.4 }}
                            transition={{ duration: 0.2 }}
                            className="max-h-full max-w-full object-contain rounded-[4px] drop-shadow-2xl"
                          />
                        ) : (
                          <motion.div
                            key={`initials-${selectedMember.id}`}
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.4 }}
                            className="h-44 w-44 rounded-[4px] bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white"
                          >
                            <span className="font-display text-7xl font-black text-white drop-shadow-md">
                              {getInitials(selectedMember.name)}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Stage Overlay (like Broadway Infosys Title banner) */}
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 sm:p-6 text-left pointer-events-none">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-violet-600 text-white mb-1.5 shadow-xs">
                        {selectedMember.role}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                        {selectedMember.name}
                      </h3>
                    </div>

                    {/* Prev/Next Navigation Controls */}
                    {content.leadership?.team?.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const team = content.leadership.team;
                            const idx = team.findIndex((m: any) => m.id === selectedMember.id);
                            const newIdx = (idx - 1 + team.length) % team.length;
                            handleSelectMember(team[newIdx]);
                          }}
                          aria-label="Previous leader"
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const team = content.leadership.team;
                            const idx = team.findIndex((m: any) => m.id === selectedMember.id);
                            const newIdx = (idx + 1) % team.length;
                            handleSelectMember(team[newIdx]);
                          }}
                          aria-label="Next leader"
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Right Column: Clean Detail Panel (~32% on Desktop, matching Broadway Infosys) */}
                  <div className="relative md:w-[35%] lg:w-[32%] h-[55%] md:h-full bg-white dark:bg-[#131c31] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
                    {/* Header with Title and Close Button */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 shrink-0 relative pr-14 text-left">
                      <button
                        onClick={handleClose}
                        aria-label="Close details"
                        className="absolute top-4 sm:top-5 right-4 sm:right-5 flex h-8 w-8 items-center justify-center rounded-[4px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {selectedMember.name}
                      </h4>
                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-violet-600 dark:text-violet-400">
                        {selectedMember.role}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-slate-400">
                        {(() => {
                          const team = content.leadership?.team || [];
                          const idx = team.findIndex((m: any) => m.id === selectedMember.id);
                          return `${idx >= 0 ? idx + 1 : 1} of ${team.length} Team Members`;
                        })()}
                      </p>
                    </div>

                    {/* Scrollable Details Body */}
                    <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left flex-1">
                      {/* Team Roster Thumbnails (Broadway Infosys Gallery Style) */}
                      {content.leadership?.team?.length > 1 && (
                        <div>
                          <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                            Team Members
                          </h5>
                          <div className="grid grid-cols-3 gap-2">
                            {content.leadership.team.map((m: any) => {
                              const isCurrent = m.id === selectedMember.id;
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => handleSelectMember(m)}
                                  title={m.name}
                                  className={`group/thumb relative aspect-square overflow-hidden rounded-[4px] border transition-all text-left ${
                                    isCurrent
                                      ? "border-violet-600 ring-2 ring-violet-600/40 dark:ring-violet-400/50 scale-[1.02]"
                                      : "border-slate-200 dark:border-slate-700/80 opacity-70 hover:opacity-100 hover:border-violet-400"
                                  }`}
                                >
                                  {m.imageUrl && m.imageUrl.trim() !== "" ? (
                                    <img
                                      src={m.imageUrl}
                                      alt={m.name}
                                      className="h-full w-full object-cover object-top"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                                      {getInitials(m.name)}
                                    </div>
                                  )}
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-1">
                                    <p className="text-[9px] font-bold text-white truncate text-center">
                                      {m.name.split(" ")[0]}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Professional Background */}
                      {selectedMember.bio && (
                        <div className="pt-2">
                          <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                            Professional Background
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {selectedMember.bio}
                          </p>
                        </div>
                      )}

                      {/* Core Skills & Expertise */}
                      {selectedMember.expertise && selectedMember.expertise.length > 0 && (
                        <div className="pt-2">
                          <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-[#0a66c2] dark:text-blue-400 mb-2 flex items-center gap-1.5">
                            <span>Core Skills & Expertise</span>
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedMember.expertise.map((exp: string) => (
                              <span
                                key={exp}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-50/90 dark:bg-blue-950/50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60"
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 text-[#0a66c2]" />
                                <span>{exp}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Social Links & Close CTA Footer */}
                    <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
                      <div className="flex items-center gap-2">
                        <a
                          href="#"
                          className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 transition-colors"
                          aria-label={`${selectedMember.name} LinkedIn`}
                        >
                          <Linkedin className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href="#"
                          className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-500 dark:hover:bg-sky-950/60 transition-colors"
                          aria-label={`${selectedMember.name} Twitter`}
                        >
                          <Twitter className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      <button
                        onClick={handleClose}
                        className="px-5 py-2 text-xs font-bold rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Embedded Milestone Timeline with About-specific dynamic header */}
      <Timeline
        initialContent={journeyContent}
        customBadge={content.timelineHeader?.badge}
        customTitle={content.timelineHeader?.title}
        customSubtitle={content.timelineHeader?.subtitle}
      />

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}