"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Star,
  Zap,
  Building2,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_CASE_STUDIES_PAGE_DATA,
  DEFAULT_CASE_STUDY_CATEGORIES,
  DEFAULT_CASE_STUDIES_ITEMS,
} from "@/data/default-case-studies-data";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Clickpoint's AI engineering team transformed our legacy financial audit pipeline into a real-time autonomous agent pod. Our daily processing volume jumped from $4M to $42M+ with zero downtime.",
    name: "Rajesh Verma",
    role: "VP of Product Engineering",
    company: "Khataflow Inc.",
    rating: 5,
    gradient: "from-violet-600 to-indigo-700",
  },
  {
    id: 2,
    quote:
      "The headless e-commerce build and AI visual search feature engineered by Clickpoint delivered an immediate +34% lift in checkout conversions. Their technical speed is unmatched.",
    name: "Claire Bennett",
    role: "Chief Product Officer",
    company: "Caratlane Global",
    rating: 5,
    gradient: "from-amber-600 to-rose-700",
  },
  {
    id: 3,
    quote:
      "HIPAA compliance and clinical accuracy were critical for our platform. Clickpoint delivered an automated AI claims engine achieving 99.8% accuracy and cutting adjudication cycles by 3.5x.",
    name: "Dr. Evelyn Vance",
    role: "Head of Digital Health Solutions",
    company: "MediPulse Health",
    rating: 5,
    gradient: "from-emerald-600 to-teal-800",
  },
];

export default function CaseStudiesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [pageContent, setPageContent] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCaseStudiesData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/case-studies");
        const json = await res.json();
        if (json.success && json.data) {
          setPageContent(json.data.pageContent || DEFAULT_CASE_STUDIES_PAGE_DATA);
          setCategories(json.data.categories && json.data.categories.length > 0 ? json.data.categories : DEFAULT_CASE_STUDY_CATEGORIES);
          setCaseStudies(json.data.caseStudies && json.data.caseStudies.length > 0 ? json.data.caseStudies : DEFAULT_CASE_STUDIES_ITEMS);
          setDbTestimonials(json.data.testimonials || []);
        } else {
          setPageContent(DEFAULT_CASE_STUDIES_PAGE_DATA);
          setCategories(DEFAULT_CASE_STUDY_CATEGORIES);
          setCaseStudies(DEFAULT_CASE_STUDIES_ITEMS);
        }
      } catch (err) {
        console.error("Failed to load dynamic case studies from DB:", err);
        setPageContent(DEFAULT_CASE_STUDIES_PAGE_DATA);
        setCategories(DEFAULT_CASE_STUDY_CATEGORIES);
        setCaseStudies(DEFAULT_CASE_STUDIES_ITEMS);
      } finally {
        setIsLoading(false);
      }
    }
    loadCaseStudiesData();
  }, []);

  if (isLoading || !pageContent) {
    return (
      <main className="relative overflow-x-hidden bg-background text-ink min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="h-10 w-10 text-violet-600 animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Loading Case Studies...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  const categoryFilterList = ["ALL", ...categories.map((c) => c.name)];

  const filteredCaseStudies =
    activeCategory === "ALL"
      ? caseStudies
      : caseStudies.filter(
          (cs) => cs.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  const hero = pageContent.hero || DEFAULT_CASE_STUDIES_PAGE_DATA.hero;
  const showcase = pageContent.showcase || DEFAULT_CASE_STUDIES_PAGE_DATA.showcase;
  const testimonialsHeader = pageContent.testimonialsSection || {
    badge: "Executive Endorsements",
    title: "Trusted by tech leaders around the globe",
    selectedTestimonialIds: [],
  };

  const selectedIds: string[] = (testimonialsHeader.selectedTestimonialIds || []).map((id: any) => String(id));

  let displayTestimonials: any[] = [];

  if (selectedIds.length > 0 && dbTestimonials.length > 0) {
    displayTestimonials = dbTestimonials
      .filter((t: any) => selectedIds.includes(String(t.id)))
      .slice(0, 3);
  }

  if (displayTestimonials.length === 0 && dbTestimonials.length > 0) {
    displayTestimonials = dbTestimonials.slice(0, 3);
  }

  if (displayTestimonials.length === 0) {
    displayTestimonials = TESTIMONIALS.map((t) => ({
      id: t.id.toString(),
      clientName: t.name,
      clientRole: t.role,
      company: t.company,
      content: t.quote,
      rating: t.rating,
    }));
  }

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24 bg-cloud-100/70 dark:bg-[#0b0f19] border-b border-violet-100 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-400/30 via-indigo-300/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-ember-300/25 to-transparent blur-[110px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Case Studies</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs">
              <FileText className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge}</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              {hero.title}{" "}
              {hero.highlightTitle && (
                <span className="text-violet-600 dark:text-[#f58220]">
                  {hero.highlightTitle}
                </span>
              )}
            </h1>

            <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-ink/75 dark:text-slate-300 sm:text-xl">
              {hero.subtitle}
            </p>

            {/* Impact Highlights Bar */}
            {hero.stats && hero.stats.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-6 sm:grid-cols-4 shadow-xl shadow-violet-950/[0.04] backdrop-blur-xl">
                {hero.stats.map((st: any, idx: number) => (
                  <div key={idx} className="p-2 text-center">
                    <p className={`font-display text-3xl font-extrabold ${idx % 2 === 0 ? "text-violet-600 dark:text-violet-300" : "text-[#f58220]"}`}>
                      {st.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">{st.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Tabs & Case Studies Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter Tabs */}
          <div className="mb-14 flex flex-wrap items-center justify-center gap-2">
            {categoryFilterList.map((catName) => {
              const isActive = activeCategory === catName;
              return (
                <button
                  key={catName}
                  onClick={() => setActiveCategory(catName)}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                      : "bg-cloud-100 text-ink/70 hover:bg-violet-50 hover:text-violet-700 border border-violet-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                  }`}
                >
                  {catName === "ALL" ? "All Case Studies" : catName}
                </button>
              );
            })}
          </div>

          {/* Case Study Cards Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              <p className="text-sm font-semibold text-slate-500">Loading Case Studies Portfolio...</p>
            </div>
          ) : filteredCaseStudies.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31]">
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                No case studies found in "{activeCategory}".
              </p>
              <button
                onClick={() => setActiveCategory("ALL")}
                className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold"
              >
                View All Case Studies
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredCaseStudies.map((project) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={project.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-500 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-500/15 hover:-translate-y-1.5"
                  >
                    <div>
                      {/* Visual Image / Banner Header */}
                      {project.imageUrl ? (
                        <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                              {project.client}
                            </span>
                            <span className="rounded-full bg-violet-600/90 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                              {project.category}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`relative h-44 w-full rounded-2xl bg-gradient-to-br ${
                            project.imageGradient || "from-violet-600 to-indigo-800"
                          } p-5 text-white shadow-inner flex flex-col justify-between overflow-hidden group-hover:scale-[1.02] transition-transform duration-500`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#ffffff20,transparent)]" />
                          
                          <div className="flex items-center justify-between relative z-10">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/30">
                              {project.client}
                            </span>
                            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/90">
                              {project.category}
                            </span>
                          </div>

                          {project.impact && (
                            <div className="relative z-10">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                                Impact Delivered
                              </p>
                              <h4 className="font-display text-2xl font-extrabold text-white">
                                {project.impact}
                              </h4>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-violet-50 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                            {project.category}
                          </span>
                          {project.impact && (
                            <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>{project.impact}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-xl font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                          {project.description || project.desc}
                        </p>

                        {/* Tech Stack Badges */}
                        {project.techStack && project.techStack.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {project.techStack.map((tech: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="rounded-md bg-cloud-100/70 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-ink/70 dark:text-slate-300 border border-violet-100/60 dark:border-slate-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom CTA Link */}
                    {(project.buttonLink || project.liveUrl) && (
                      <div className="mt-8 pt-4 border-t border-violet-100 dark:border-slate-800 flex items-center justify-between">
                        <a
                          href={project.buttonLink || project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-white transition-colors"
                        >
                          <span>{project.buttonText || "Explore Live Platform"}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </section>

      {/* Featured Deep-Dive Benchmark Showcase Section */}
      {showcase && (
        <section className="py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-t border-violet-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="mb-16 max-w-3xl">
              {showcase.badge && (
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                  {showcase.badge}
                </span>
              )}
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl">
                {showcase.title}
              </h2>
              {showcase.subtitle && (
                <p className="mt-4 text-base text-ink/75 dark:text-slate-300">
                  {showcase.subtitle}
                </p>
              )}
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: Transformation Comparison Table */}
              <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-xl shadow-violet-950/[0.04]">
                <h3 className="font-display text-xl font-bold text-ink dark:text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  {showcase.metricsTitle || "Measurable Benchmark Impact"}
                </h3>

                <div className="space-y-4 text-xs font-medium">
                  <div className="grid grid-cols-3 gap-2 pb-3 border-b border-violet-100 dark:border-slate-800 font-bold uppercase tracking-wider text-ink/50 dark:text-slate-400">
                    <span>Metric</span>
                    <span className="text-red-500">Before Clickpoint</span>
                    <span className="text-violet-600 dark:text-violet-300">After Clickpoint</span>
                  </div>

                  {showcase.metrics?.map((m: any, mIdx: number) => (
                    <div key={mIdx} className="grid grid-cols-3 gap-2 py-2 border-b border-violet-100/60 dark:border-slate-800 last:border-0">
                      <span className="font-bold text-ink dark:text-white">{m.metric}</span>
                      <span className="text-red-500">{m.before}</span>
                      <span className="font-bold text-violet-700 dark:text-violet-300">{m.after}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Key Engineering Deliverables */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-ink dark:text-white">
                    {showcase.deliverablesTitle || "Engineering Breakdown & Architecture"}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink/75 dark:text-slate-300">
                    {showcase.deliverablesSub}
                  </p>
                </div>

                <div className="space-y-3">
                  {showcase.deliverables?.map((del: any, dIdx: number) => (
                    <div key={dIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-ink dark:text-white">{del.title}</h4>
                        <p className="text-xs text-ink/70 dark:text-slate-300">{del.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {showcase.buttonLink && (
                  <a
                    href={showcase.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all"
                  >
                    <span>{showcase.buttonText || "View Live Platform"}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Client Executive Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f58220]">
              {testimonialsHeader.badge || "Executive Endorsements"}
            </p>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              {testimonialsHeader.title || "Trusted by tech leaders around the globe"}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {displayTestimonials.map((t: any, idx: number) => {
              const gradients = [
                "from-violet-600 to-indigo-700",
                "from-amber-600 to-rose-700",
                "from-emerald-600 to-teal-800",
                "from-purple-600 to-indigo-800",
              ];
              const gradient = gradients[idx % gradients.length];
              const initials = (t.clientName || t.name || "Client")
                .split(" ")
                .map((n: string) => n[0])
                .join("");

              return (
                <div
                  key={t.id || idx}
                  className="flex flex-col justify-between rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-amber-500">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-xs leading-relaxed text-ink/80 dark:text-slate-300 font-medium italic">
                      "{t.content || t.quote}"
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-violet-100 dark:border-slate-800 flex items-center gap-3">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.clientName || t.name}
                        className="h-10 w-10 rounded-xl object-cover border border-violet-100 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${gradient} text-white font-bold text-sm shadow-xs shrink-0`}>
                        {initials}
                      </div>
                    )}
                    <div>
                      <h4 className="font-display text-sm font-bold text-ink dark:text-white">
                        {t.clientName || t.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                        {t.clientRole || t.role}, {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
