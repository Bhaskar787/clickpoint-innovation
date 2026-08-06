"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Building2,
  Users,
  Globe2,
  Code2,
  Linkedin,
  Twitter,
  Target,
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

  useEffect(() => {
    // Sync client state if initialContent changes
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

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

          {/* Dynamic Team Members Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {content.leadership.team.map((member: any) => {
              const initials = getInitials(member.name);

              return (
                <div
                  key={member.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-500 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-500/15 hover:-translate-y-1.5"
                >
                  <div>
                    {/* Avatar Profile Image or Initials Frame */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br p-1 shadow-md">
                      {member.imageUrl && member.imageUrl.trim() !== "" ? (
                        <div className="h-44 w-full rounded-xl overflow-hidden relative">
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="h-44 w-full rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                          <span className="font-display text-5xl font-black tracking-wider text-white drop-shadow-md">
                            {initials}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink dark:text-white group-hover:text-violet-700 transition-colors">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
                      {member.role}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                      {member.bio}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-violet-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0a66c2] dark:text-blue-400 mb-2.5 flex items-center gap-1.5">
                      <span>Core Skills & Expertise</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.expertise.map((exp: string) => (
                        <span
                          key={exp}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-50/80 dark:bg-blue-950/40 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 shadow-2xs hover:scale-105 transition-transform"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 text-[#0a66c2]" />
                          <span>{exp}</span>
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-3 pt-3 border-t border-violet-100/60 dark:border-slate-800">
                      <a
                        href="#"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-100 dark:border-slate-700 text-ink/50 dark:text-slate-400 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href="#"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-100 dark:border-slate-700 text-ink/50 dark:text-slate-400 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                        aria-label={`${member.name} Twitter`}
                      >
                        <Twitter className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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