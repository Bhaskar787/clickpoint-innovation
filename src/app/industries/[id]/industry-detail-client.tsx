"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Layers,
  FolderGit2,
  TrendingUp,
  Star,
} from "lucide-react";
import { IndustryItem } from "@/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTASection from "@/components/sections/cta-section";
import { IndustryIcon } from "@/components/ui/industry-icon";

interface IndustryDetailClientProps {
  industry: IndustryItem;
}

export default function IndustryDetailClient({ industry }: IndustryDetailClientProps) {
  return (
    <main className="relative overflow-hidden bg-white dark:bg-[#0b0f19]">
      <Navbar />

      {/* Background Glow Overlay */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/10 via-indigo-500/5 to-transparent blur-3xl" />

      {/* SEQUENCE #01: HERO BANNER HEADER */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 border-b border-violet-100/70 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <Link href="/portfolio" className="hover:text-violet-600 dark:hover:text-white transition-colors">Portfolio</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <span className="font-semibold text-violet-600 dark:text-violet-400">{industry.title}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Left Column: Title & Description */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-xs border border-violet-200/80 dark:border-white/[0.08] bg-violet-50/80 dark:bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-violet-700 dark:text-violet-300">
                <IndustryIcon
                  icon={industry.icon}
                  iconName={industry.iconName}
                  industryId={industry.id}
                  className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300 shrink-0"
                />
                <span>{industry.heroBadge || industry.subtitle || "Enterprise Domain Practice"}</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
                {industry.title}
              </h1>

              <p className="text-base leading-relaxed text-ink/75 dark:text-slate-300 sm:text-lg">
                {industry.desc}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-sm bg-violet-600 hover:bg-violet-700 text-xs font-semibold text-white shadow-xs transition-all"
                >
                  <span>Book Industry Discovery Call</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-sm border border-slate-300 dark:border-white/[0.18] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>All Portfolio Sectors</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Clean Image Holder Frame (12px Radius, 1px Border, Shadow MD) */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-[16/10] w-full rounded-lg border border-slate-200/80 dark:border-white/[0.10] shadow-md overflow-hidden bg-slate-950 group">
                {industry.imageUrl ? (
                  <Image
                    src={industry.imageUrl}
                    alt={industry.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 p-8 text-white flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="rounded-xs bg-white/10 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                        {industry.title}
                      </span>
                      <span className="rounded-xs bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Verified Pod
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white/70 uppercase tracking-widest">
                        Core Discipline
                      </p>
                      <p className="font-display text-2xl font-bold text-white mt-1">
                        {industry.subtitle || industry.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEQUENCE #02: KEY PERFORMANCE METRICS BAR */}
      {industry.keyMetrics && industry.keyMetrics.length > 0 && (
        <section className="py-12 bg-violet-50/60 dark:bg-[#0f172a]/70 border-b border-violet-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Key Performance Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {industry.keyMetrics.map((metric: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 shadow-xs text-center"
                >
                  <p className="font-display text-3xl sm:text-4xl font-extrabold text-violet-600 dark:text-violet-300">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEQUENCE #03: AUDITED COMPLIANCE & SECURITY BADGES */}
      {industry.complianceBadges && industry.complianceBadges.length > 0 && (
        <section className="py-12 border-b border-violet-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h3 className="font-display text-lg font-bold text-ink dark:text-white">
                  Audited Compliance & Security Standards
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {industry.complianceBadges.map((badge: string, bIdx: number) => (
                  <div key={bIdx} className="flex items-center gap-2 rounded-xs bg-slate-50 dark:bg-white/[0.04] p-3 border border-slate-200/80 dark:border-white/[0.08] text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEQUENCE #04: SECTOR PERSPECTIVE & NARRATIVE OVERVIEW */}
      {industry.fullOverview && (
        <section className="py-16 bg-white dark:bg-[#0b0f19] border-b border-violet-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                {industry.overviewTag || "Sector Perspective"}
              </span>
              <h2 className="font-display text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">
                {industry.overviewHeading || `Architecting software for ${industry.title}`}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-ink/75 dark:text-slate-300 pt-2">
                {industry.fullOverview}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SEQUENCE #05: FEATURED CASE STUDIES & LIVE PROJECTS */}
      {(() => {
        const visibleProjects = (industry.projects || []).filter(
          (p: any) => !p.isDraft && p.status !== "draft"
        );
        if (!visibleProjects || visibleProjects.length === 0) return null;

        return (
          <section className="py-20 lg:py-28 border-b border-violet-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f172a]/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-14 max-w-2xl">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  {industry.projectsTag || "Live Case Studies"}
                </p>
                <h2 className="font-display text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">
                  {industry.projectsHeading || `Featured projects built for ${industry.title}`}
                </h2>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {visibleProjects.map((proj: any, pIdx: number) => (
                  <div
                    key={proj.id || pIdx}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 sm:p-7 shadow-sm hover:border-slate-300 dark:hover:border-white/[0.16] hover:-translate-y-0.5 transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-xs bg-violet-100 dark:bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-white/[0.08]">
                            {proj.client}
                          </span>
                          {proj.featured && (
                            <span
                              className="inline-flex items-center justify-center rounded-xs bg-amber-100 dark:bg-amber-950/80 p-1 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700"
                              title="Featured"
                            >
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            </span>
                          )}
                        </div>
                        {proj.impact && (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-xs border border-emerald-500/20">
                            {proj.impact}
                          </span>
                        )}
                      </div>

                      <h3 className="card-title text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                        {proj.title}
                      </h3>

                      <p className="card-body text-ink/70 dark:text-slate-300">
                        {proj.desc}
                      </p>

                      {/* Tech Stack Pills */}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.techStack.map((tech: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="rounded-xs bg-slate-100 dark:bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {proj.liveUrl && (
                      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                        >
                          <span>View Live Project</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        <span className="text-[10px] font-mono text-slate-400">
                          {proj.liveUrl.replace("https://", "")}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* SEQUENCE #06: TARGET ENGINEERING SOLUTIONS GRID */}
      {industry.solutions && industry.solutions.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#0b0f19]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                {industry.solutionsTag || "Target Solutions"}
              </p>
              <h2 className="font-display text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">
                {industry.solutionsHeading || `Specialized engineering for ${industry.title}`}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {industry.solutions.map((sol: any, sIdx: number) => {
                const title = typeof sol === "string" ? sol : sol.title;
                const desc = typeof sol === "string" ? "" : sol.desc;

                return (
                  <div
                    key={sIdx}
                    className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 shadow-xs space-y-3 hover:border-slate-300 dark:hover:border-white/[0.16] hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-violet-600 text-white font-bold text-xs">
                      0{sIdx + 1}
                    </div>
                    <h4 className="card-title text-ink dark:text-white">
                      {title}
                    </h4>
                    {desc && (
                      <p className="text-xs text-ink/70 dark:text-slate-300 leading-relaxed">
                        {desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SEQUENCE #07: CTA SECTION & FOOTER */}
      <CTASection />
      <Footer />
    </main>
  );
}
