"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  ArrowRight,
  MapPin,
  DollarSign,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Heart,
  Users,
  Award,
  Send,
  X,
  Search,
  UploadCloud,
  FileText,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CareersPageContent {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
  stats: { id: string; value: string; label: string }[];
  perksSection: {
    tag: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    perks: { id: string; title: string; desc: string }[];
  };
  openingsSection: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
  };
}

interface JobCategory {
  id: string;
  name: string;
}

interface JobVacancy {
  id: string;
  title: string;
  categoryId: string;
  category: { id: string; name: string };
  type: string;
  location: string;
  experience: string;
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  featured: boolean;
  isActive: boolean;
}

// Default fallback content so the page never crashes before DB loads
const DEFAULT_CONTENT: CareersPageContent = {
  hero: {
    badge: "We're Hiring • Global Remote Pods",
    title: "Build the Next Generation of",
    titleHighlight: "AI-First Software",
    subtitle:
      "Join a team of world-class engineers, product designers, and AI researchers building autonomous LLM copilots and zero-downtime enterprise platforms.",
  },
  stats: [
    { id: "st1", value: "100%", label: "Remote-First Culture" },
    { id: "st2", value: "NPR 4L", label: "Annual Tech Stipend" },
    { id: "st3", value: "4.9 / 5.0", label: "Team Glassdoor Rating" },
    { id: "st4", value: "150+", label: "Teammates Worldwide" },
  ],
  perksSection: {
    tag: "Why Clickpoint Innovation",
    title: "Perks & benefits designed for",
    titleHighlight: "high performers",
    subtitle:
      "We empower our team with complete autonomy, top-tier compensation, and world-class engineering tools.",
    perks: [],
  },
  openingsSection: {
    badge: "Available Openings",
    title: "Explore open positions",
    subtitle: "Find your next career leap and apply in under 2 minutes.",
    searchPlaceholder: "Search job title, skill, or department...",
  },
};

// Map perk index to a deterministic icon
const PERK_ICONS = [Globe, DollarSign, Zap, Heart, Users, Award, Briefcase, Sparkles];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CareersPage() {
  const [content, setContent] = useState<CareersPageContent>(DEFAULT_CONTENT);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeJobModal, setActiveJobModal] = useState<JobVacancy | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Fetch page content from DB
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/careers");
        const json = await res.json();
        if (json.success && json.data) setContent(json.data);
      } catch {
        // silently use default
      } finally {
        setLoadingContent(false);
      }
    }
    load();
  }, []);

  // Fetch categories and vacancies from DB
  useEffect(() => {
    async function load() {
      try {
        const [catRes, vacRes] = await Promise.all([
          fetch("/api/careers/categories"),
          fetch("/api/careers/vacancies"),
        ]);
        const [catJson, vacJson] = await Promise.all([catRes.json(), vacRes.json()]);
        if (catJson.success) setCategories(catJson.data || []);
        if (vacJson.success) setVacancies(vacJson.data || []);
      } catch {
        // silently use empty arrays
      } finally {
        setLoadingJobs(false);
      }
    }
    load();
  }, []);

  const filteredJobs = vacancies.filter((job) => {
    const matchesCat = selectedCategoryId === "ALL" || job.categoryId === selectedCategoryId;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.summary.toLowerCase().includes(q) ||
      job.category.name.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const { hero, stats, perksSection, openingsSection } = content;

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* ------------------------------------------------------------------ */}
      {/* HERO SECTION                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24 bg-cloud-100/70 border-b border-violet-100">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-400/30 via-indigo-300/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-ember-300/25 to-transparent blur-[110px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60">
            <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Careers</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs">
              <Briefcase className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              {hero.title}{" "}
              <span className="text-[#1b4397] dark:text-[#f58220]">{hero.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-ink/75 sm:text-xl">
              {hero.subtitle}
            </p>

            {/* Stat Counter Bar */}
            {stats.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-6 sm:grid-cols-4 shadow-xl shadow-violet-950/[0.04] backdrop-blur-xl">
                {stats.map((stat, idx) => (
                  <div key={stat.id} className="p-2 text-center">
                    <p className={`font-display text-3xl font-extrabold ${idx % 2 === 0 ? "text-violet-600 dark:text-violet-300" : "text-[#f58220]"}`}>
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PERKS & BENEFITS                                                    */}
      {/* ------------------------------------------------------------------ */}
      {perksSection.perks.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f58220]">
                {perksSection.tag}
              </p>
              <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
                {perksSection.title}{" "}
                <span className="text-violet-600 dark:text-[#f58220]">{perksSection.titleHighlight}</span>
              </h2>
              <p className="mt-3 text-base text-ink/75 dark:text-slate-300">{perksSection.subtitle}</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {perksSection.perks.map((perk, idx) => {
                const Icon = PERK_ICONS[idx % PERK_ICONS.length];
                return (
                  <div
                    key={perk.id}
                    className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/30 mb-5">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink dark:text-white">{perk.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">{perk.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* OPEN VACANCIES                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="openings"
        className="py-20 lg:py-28 bg-cloud-100/70 dark:bg-[#0f172a]/50 border-y border-violet-100 dark:border-slate-800"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
              <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              {openingsSection.badge}
            </div>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              {openingsSection.title}{" "}
              {!loadingJobs && <span className="text-violet-600 dark:text-violet-300">({filteredJobs.length})</span>}
            </h2>
            <p className="mt-3 text-base text-ink/75 dark:text-slate-300">{openingsSection.subtitle}</p>

            {/* Search */}
            <div className="relative mt-8 mx-auto max-w-md">
              <input
                type="text"
                placeholder={openingsSection.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 py-3.5 pl-11 pr-4 text-sm font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 shadow-sm transition-all focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-slate-400" />
            </div>
          </div>

          {/* Category filter tabs — built from DB categories */}
          {categories.length > 0 && (
            <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedCategoryId("ALL")}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  selectedCategoryId === "ALL"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                    : "bg-white dark:bg-slate-800 text-ink/70 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-700 hover:text-violet-700 dark:hover:text-white border border-violet-100 dark:border-slate-700"
                }`}
              >
                All Departments
              </button>
              {categories.map((cat) => {
                const isActive = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                        : "bg-white dark:bg-slate-800 text-ink/70 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-700 hover:text-violet-700 dark:hover:text-white border border-violet-100 dark:border-slate-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Job Cards */}
          <div className="space-y-4 max-w-5xl mx-auto">
            {loadingJobs ? (
              // Skeleton loader
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 animate-pulse"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex gap-2">
                        <div className="h-5 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                      </div>
                      <div className="h-6 w-64 rounded-lg bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="h-10 w-36 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                  </div>
                </div>
              ))
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
                >
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700">
                        {job.category.name}
                      </span>
                      <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {job.type}
                      </span>
                      {job.featured && (
                        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                          Featured Priority
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                      {job.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-ink/75 dark:text-slate-300 line-clamp-2">
                      {job.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink/60 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-[#f58220]" />
                            {job.salary}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setActiveJobModal(job);
                        setApplicationSubmitted(false);
                        setResumeFile(null);
                      }}
                      className="w-full md:w-auto shadow-md shadow-violet-600/25 font-bold"
                    >
                      View Role & Apply
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#131c31] rounded-3xl border border-violet-100 dark:border-slate-800">
                <p className="text-base font-semibold text-ink/60 dark:text-slate-300">
                  No open roles match your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategoryId("ALL");
                  }}
                  className="mt-3 text-xs font-bold text-violet-700 dark:text-violet-300 underline"
                >
                  Reset filters & view all jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* APPLICATION MODAL                                                   */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {activeJobModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveJobModal(null)}
              className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close */}
              <button
                onClick={() => setActiveJobModal(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-cloud-100 text-ink/60 hover:bg-violet-100 hover:text-violet-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {!applicationSubmitted ? (
                <div>
                  {/* Job Header */}
                  <div className="mb-6 pb-6 border-b border-violet-100">
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                      {activeJobModal.category.name}
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                      {activeJobModal.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-ink/60">
                      <span className="flex items-center gap-1 text-violet-700">
                        <MapPin className="h-3.5 w-3.5" />
                        {activeJobModal.location}
                      </span>
                      {activeJobModal.salary && (
                        <>
                          <span>•</span>
                          <span className="text-ember-500 font-bold">{activeJobModal.salary}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6 text-xs leading-relaxed text-ink/80">
                    {activeJobModal.summary && (
                      <div>
                        <h4 className="font-display text-sm font-bold text-ink mb-2">Role Overview</h4>
                        <p>{activeJobModal.summary}</p>
                      </div>
                    )}

                    {activeJobModal.responsibilities?.length > 0 && (
                      <div>
                        <h4 className="font-display text-sm font-bold text-ink mb-2">Key Responsibilities</h4>
                        <ul className="space-y-1.5">
                          {activeJobModal.responsibilities.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeJobModal.requirements?.length > 0 && (
                      <div>
                        <h4 className="font-display text-sm font-bold text-ink mb-2">Role Requirements</h4>
                        <ul className="space-y-1.5">
                          {activeJobModal.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Application Form */}
                    <div className="mt-8 pt-6 border-t border-violet-100">
                      <h4 className="font-display text-base font-bold text-ink mb-4">Submit Application</h4>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setApplicationSubmitted(true);
                        }}
                        className="space-y-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Alex Johnson"
                              className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="alex@example.com"
                              className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                              LinkedIn Profile URL *
                            </label>
                            <input
                              type="url"
                              required
                              placeholder="https://linkedin.com/in/alex"
                              className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                              Portfolio / GitHub URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://github.com/alex"
                              className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        {/* Resume Upload */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                            Attach Resume / CV * (.pdf, .doc, .docx, .jpg, .png)
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              id="resume-upload"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              required={!resumeFile}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setResumeFile(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                            {!resumeFile ? (
                              <label
                                htmlFor="resume-upload"
                                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 bg-cloud-100/50 p-5 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-50/50 transition-all group"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 group-hover:scale-110 transition-transform">
                                  <UploadCloud className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-ink">Click to upload or drag & drop your Resume</p>
                                  <p className="text-[10px] text-ink/60 mt-0.5">Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                                </div>
                              </label>
                            ) : (
                              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-ink truncate max-w-[220px] sm:max-w-[320px]">
                                      {resumeFile.name}
                                    </p>
                                    <p className="text-[10px] font-semibold text-emerald-700">
                                      {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • File Attached Successfully
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setResumeFile(null)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink/70 hover:bg-rose-100 hover:text-rose-600 transition-colors shadow-xs"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                            Why Clickpoint Innovation? (Brief Intro)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Tell us about your technical projects and why you're excited about this role..."
                            className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                          />
                        </div>

                        <Button type="submit" variant="primary" size="lg" className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Application
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink">Application Received!</h3>
                  <p className="text-xs max-w-md mx-auto text-ink/75 leading-relaxed">
                    Thank you for applying for{" "}
                    <span className="font-bold text-violet-700">{activeJobModal.title}</span>. Our talent acquisition
                    lead will review your profile and reach out within 48 hours.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setActiveJobModal(null)} className="mt-4">
                    Close Window
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CtaSection />
      <Footer />
    </main>
  );
}
