"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Layers,
  FolderGit2,
  TrendingUp,
} from "lucide-react";
import { IndustryItem } from "@/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTASection from "@/components/sections/cta-section";

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
            <span>/</span>
            <Link href="/industries" className="hover:text-violet-600 dark:hover:text-white transition-colors">Industries</Link>
            <span>/</span>
            <span className="font-semibold text-violet-600 dark:text-violet-400">{industry.title}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Left Column: Title & Description */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50/80 dark:bg-slate-800/80 px-4 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 backdrop-blur-md">
                <Building2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                <span>{industry.heroBadge || industry.subtitle || "Enterprise Domain Practice"}</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
                {industry.title}
              </h1>

              <p className="text-base leading-relaxed text-ink/75 dark:text-slate-300 sm:text-lg">
                {industry.desc}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-105"
                >
                  <span>Book Industry Discovery Call</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/industries"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>All Industry Sectors</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Cloudinary Media / Gradient Container */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border border-violet-100/90 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-6 shadow-2xl shadow-violet-950/10 backdrop-blur-xl space-y-5">
                {industry.imageUrl ? (
                  <div className="relative h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <Image src={industry.imageUrl} alt={industry.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="relative h-72 w-full rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-700 to-slate-900 p-8 text-white flex flex-col justify-between overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
                        {industry.title}
                      </span>
                      <span className="rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Verified Pod
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                        Core Discipline
                      </p>
                      <p className="font-display text-2xl font-extrabold text-white mt-1">
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
                  className="rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-xs hover:border-violet-400 transition-all text-center"
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
            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-gradient-to-r from-violet-50/50 via-white to-violet-50/50 dark:from-slate-900/60 dark:via-[#131c31] dark:to-slate-900/60 p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h3 className="font-display text-lg font-bold text-ink dark:text-white">
                  Audited Compliance & Security Standards
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {industry.complianceBadges.map((badge: string, bIdx: number) => (
                  <div key={bIdx} className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 p-3 border border-violet-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
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
      {industry.projects && industry.projects.length > 0 && (
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
              {industry.projects.map((proj: any, pIdx: number) => (
                <div
                  key={proj.id || pIdx}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-sm hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300">
                        {proj.client}
                      </span>
                      {proj.impact && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          {proj.impact}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                      {proj.title}
                    </h3>

                    <p className="text-sm text-ink/75 dark:text-slate-300 leading-relaxed">
                      {proj.desc}
                    </p>

                    {/* Tech Stack Pills */}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.techStack.map((tech: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {proj.liveUrl && (
                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-violet-600 dark:text-violet-400 hover:underline"
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
      )}

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
                    className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-violet-50/30 dark:bg-[#131c31] p-6 shadow-xs space-y-3 hover:border-violet-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white font-extrabold text-xs shadow-md shadow-violet-600/20">
                      0{sIdx + 1}
                    </div>
                    <h4 className="font-display text-lg font-bold text-ink dark:text-white">
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
