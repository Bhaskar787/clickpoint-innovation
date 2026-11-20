"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Banknote,
  Send,
  Clock,
  Calendar,
  Search,
  Globe,
  Zap,
  Heart,
  Users,
  Award,
  Coffee,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import JobApplyModal from "@/components/careers/job-apply-modal";

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
  slug?: string;
  title: string;
  categoryId: string;
  category: { id: string; name: string };
  type: string;
  location: string;
  experience: string;
  salary: string;
  deadline?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  featured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Default fallback content
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

const PERK_ICONS = [Globe, Banknote, Zap, Heart, Users, Award, Briefcase, Coffee];

function formatLastUpdated(dateStr?: string): string {
  if (!dateStr) return "1 day ago";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Recently";
  }
}

function formatDeadline(deadline?: string | null): string {
  if (!deadline || !deadline.trim()) return "Ongoing";
  try {
    const d = new Date(deadline);
    if (!isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(deadline)) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return deadline;
  } catch {
    return deadline || "Ongoing";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const CAREERS_CACHE_KEY = "clickpoint_careers_cache_v2";

function getCachedCareers() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CAREERS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CareersPage() {
  const [content, setContent] = useState<CareersPageContent>(DEFAULT_CONTENT);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeJobModal, setActiveJobModal] = useState<JobVacancy | null>(null);

  const PAGE_SIZE = 8;

  // Fetch page content
  useEffect(() => {
    const cached = getCachedCareers();
    if (cached?.content) setContent(cached.content);
    if (cached?.categories) setCategories(cached.categories);
    if (cached?.vacancies) setVacancies(cached.vacancies);

    async function fetchContent() {
      try {
        const res = await fetch("/api/careers");
        const json = await res.json();
        if (json.success && json.data) {
          setContent(json.data as CareersPageContent);
          try {
            const current = getCachedCareers() || {};
            localStorage.setItem(CAREERS_CACHE_KEY, JSON.stringify({ ...current, content: json.data }));
          } catch {}
        }
      } catch {
        /* use defaults */
      } finally {
        setLoadingContent(false);
      }
    }
    fetchContent();
  }, []);

  // Fetch categories + vacancies
  useEffect(() => {
    async function fetchJobs() {
      try {
        const [catRes, vacRes] = await Promise.all([
          fetch("/api/careers/categories", { cache: "no-store" }),
          fetch("/api/careers/vacancies", { cache: "no-store" }),
        ]);
        const catJson = await catRes.json();
        const vacJson = await vacRes.json();
        if (catJson.success && Array.isArray(catJson.data)) setCategories(catJson.data);
        if (vacJson.success && Array.isArray(vacJson.data)) setVacancies(vacJson.data);
        try {
          const current = getCachedCareers() || {};
          localStorage.setItem(
            CAREERS_CACHE_KEY,
            JSON.stringify({
              ...current,
              categories: catJson.success ? catJson.data : current.categories,
              vacancies: vacJson.success ? vacJson.data : current.vacancies,
            })
          );
        } catch {}
      } catch {
        /* silent */
      } finally {
        setLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  // Filtered vacancies
  const filteredVacancies = vacancies.filter((v) => {
    const matchCat = selectedCategoryId === "ALL" || v.categoryId === selectedCategoryId;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.category?.name?.toLowerCase().includes(q) ||
      v.location?.toLowerCase().includes(q) ||
      v.type?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Pagination calculation
  const totalItems = filteredVacancies.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const currentVacancies = filteredVacancies.slice(startIndex, endIndex);

  const hero = content.hero || DEFAULT_CONTENT.hero;
  const stats = content.stats || DEFAULT_CONTENT.stats;
  const perks = content.perksSection || DEFAULT_CONTENT.perksSection;
  const openings = content.openingsSection || DEFAULT_CONTENT.openingsSection;

  return (
    <main className="min-h-screen bg-cloud-100 dark:bg-slate-950 text-ink dark:text-slate-100">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 border-b border-violet-100/70 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left-Aligned Breadcrumb Route */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Careers</span>
          </div>

          {/* Center-Aligned Hero Content */}
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-300 text-xs font-extrabold uppercase tracking-widest shadow-xs"
            >
              <Briefcase className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge || "Careers & Openings"}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
            >
              {hero.title ? (
                <>
                  {hero.title}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {hero.titleHighlight}
                  </span>
                </>
              ) : (
                <>
                  Build the Next Generation of{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    AI-First Software
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium pt-1"
            >
              {hero.subtitle}
            </motion.p>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto"
            >
              {stats.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-[#131c31]/80 backdrop-blur-md border border-violet-100 dark:border-slate-800 shadow-sm text-center"
                >
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-300">
                    {s.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Perks ────────────────────────────────────────────────────────── */}
      {perks.perks && perks.perks.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              {perks.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {perks.title}{" "}
              <span className="text-violet-600 dark:text-orange-500">{perks.titleHighlight}</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium pt-1">
              {perks.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.perks.map((perk, i) => {
              const Icon = PERK_ICONS[i % PERK_ICONS.length];
              return (
                <div
                  key={perk.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-9 w-9 rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-ink dark:text-white mb-1">{perk.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Open Positions (Matching Reference Layout with Original Colors) ─ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {openings.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {openings.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            {openings.subtitle}
          </p>
        </div>

        {/* Search + Category Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={openings.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-ink dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId("ALL");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedCategoryId === "ALL"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#131c31] border border-violet-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-400"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? "bg-violet-600 text-white shadow-xs"
                    : "bg-white dark:bg-[#131c31] border border-violet-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards — 2-Column Responsive Grid matching Reference Structure */}
        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-white dark:bg-[#131c31] rounded-2xl border border-violet-100 dark:border-slate-800 p-8">
            <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No matching job positions found
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="text-xs text-violet-600 dark:text-violet-400 underline font-semibold cursor-pointer"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {currentVacancies.map((job) => (
              <div
                key={job.id}
                className={`group relative rounded-2xl border bg-white dark:bg-[#131c31] p-5 sm:p-6 shadow-xs hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                  job.featured
                    ? "border-violet-300 dark:border-violet-700 ring-1 ring-violet-200 dark:ring-violet-800"
                    : "border-violet-100 dark:border-slate-800"
                }`}
              >
                {/* Top Section */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Company Logo Badge */}
                      <div className="h-11 w-11 rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0">
                        <Briefcase className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        {/* Company Label */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wide uppercase">
                            Clickpoint Innovation
                          </span>
                          {job.featured && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700">
                               Featured
                            </span>
                          )}
                        </div>

                        {/* Job Title */}
                        <Link
                          href={`/careers/${job.slug || job.id}`}
                          className="font-bold text-sm sm:text-base text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors line-clamp-1 mt-0.5 block"
                        >
                          {job.title}
                        </Link>
                      </div>
                    </div>

                    {/* Top-Right Paper Plane Icon Button (Opens Career Details) */}
                    <Link
                      href={`/careers/${job.slug || job.id}`}
                      title="View Position Details"
                      className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:border-violet-400 dark:hover:text-violet-300 dark:hover:border-violet-500 flex items-center justify-center transition-colors shrink-0 shadow-2xs"
                    >
                      <Send className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* Location & Last Updated */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3 pl-1">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]">
                        {job.location || "Kathmandu (On-site)"}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>Last Updated: {formatLastUpdated(job.updatedAt || job.createdAt)}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div>
                  {/* Clean Horizontal Divider */}
                  <hr className="border-t border-slate-100 dark:border-slate-800/80 my-3.5" />

                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* Tag Pills (Type, Level, Category) */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/90 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {job.type || "Full Time"}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/90 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {job.experience || "Mid Level"}
                      </span>
                      {job.category?.name && (
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/90 text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                          {job.category.name}
                        </span>
                      )}
                    </div>

                    {/* Deadline with Clock Icon */}
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>Deadline: {formatDeadline(job.deadline)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Working Pagination Bar */}
        {totalPages > 0 && filteredVacancies.length > 0 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} results
            </p>

            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-violet-600 text-white shadow-xs"
                      : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Page Button */}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      <CtaSection />
      <Footer />

      {/* Application Popup Modal */}
      <JobApplyModal
        job={activeJobModal}
        isOpen={Boolean(activeJobModal)}
        onClose={() => setActiveJobModal(null)}
      />
    </main>
  );
}