"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  ArrowRight,
  MapPin,
  DollarSign,
  CheckCircle2,
  Coffee,
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
  Loader2,
  PenTool,
  Paperclip,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { broadcastNotification } from "@/lib/realtime-notifications";

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

const PERK_ICONS = [Globe, DollarSign, Zap, Heart, Users, Award, Briefcase, Coffee];
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ---------------------------------------------------------------------------
// Rate-limit tracker (10 seconds per session)
// ---------------------------------------------------------------------------
let lastSubmitTime = 0;

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

  // Application form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLinkedIn, setFormLinkedIn] = useState("");
  const [formPortfolio, setFormPortfolio] = useState("");
  const [formCoverLetter, setFormCoverLetter] = useState("");
  const [coverLetterMode, setCoverLetterMode] = useState<"write" | "upload">("write");
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverLetterFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch page content
  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/careers");
        const json = await res.json();
        if (json.success && json.data) setContent(json.data as CareersPageContent);
      } catch { /* use defaults */ }
      finally { setLoadingContent(false); }
    }
    fetchContent();
  }, []);

  // Fetch categories + vacancies
  useEffect(() => {
    async function fetchJobs() {
      try {
        const [catRes, vacRes] = await Promise.all([
          fetch("/api/careers/categories"),
          fetch("/api/careers/vacancies"),
        ]);
        const catJson = await catRes.json();
        const vacJson = await vacRes.json();
        if (catJson.success && Array.isArray(catJson.data)) setCategories(catJson.data);
        if (vacJson.success && Array.isArray(vacJson.data)) setVacancies(vacJson.data);
      } catch { /* silent */ }
      finally { setLoadingJobs(false); }
    }
    fetchJobs();
  }, []);

  // Reset form when modal changes
  useEffect(() => {
    setFormName(""); setFormEmail(""); setFormPhone(""); setFormLinkedIn("");
    setFormPortfolio(""); setFormCoverLetter(""); setResumeFile(null);
    setApplicationSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [activeJobModal]);

  // Filtered vacancies
  const filteredVacancies = vacancies.filter((v) => {
    const matchCat = selectedCategoryId === "ALL" || v.categoryId === selectedCategoryId;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.category?.name.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_RESUME_TYPES.includes(file.type) && !file.name.endsWith(".pdf")) {
      toast.error("Please upload a PDF, Word document, or image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10 MB.");
      return;
    }
    setResumeFile(file);
  }

  async function handleSubmitApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!activeJobModal) return;

    // Client-side 10-second rate limit
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      const wait = Math.ceil((10000 - (now - lastSubmitTime)) / 1000);
      toast.error(`Please wait ${wait} second${wait > 1 ? "s" : ""} before submitting again.`);
      return;
    }

    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      toast.error("Please enter your name, email, and contact phone number.");
      return;
    }
    if (!resumeFile) {
      toast.error("Please attach your resume or CV.");
      return;
    }

    setSubmitting(true);
    lastSubmitTime = now;

    const fd = new FormData();
    fd.append("name", formName.trim());
    fd.append("email", formEmail.trim());
    fd.append("phone", formPhone.trim());
    fd.append("linkedIn", formLinkedIn.trim());
    fd.append("portfolio", formPortfolio.trim());
    fd.append("coverLetter", formCoverLetter.trim());
    if (coverLetterFile) {
      fd.append("coverLetterFile", coverLetterFile);
    }
    fd.append("jobVacancyId", activeJobModal.id);
    fd.append("jobTitle", activeJobModal.title);
    fd.append("resume", resumeFile);

    try {
      const res = await fetch("/api/jobs/apply", { method: "POST", body: fd });
      const json = await res.json();

      if (json.success) {
        setApplicationSubmitted(true);
        toast.success(`Application submitted for ${activeJobModal.title}! We'll be in touch within 48 hours.`, {
          duration: 6000,
          position: "top-right",
        });

        // Broadcast real-time event to Admin Dashboard
        broadcastNotification({
          id: json.data?.id || `jobapp-${Date.now()}`,
          type: "JOB_APPLICATION",
          category: "JOB_APPLICATION",
          title: "New Job Application",
          clientName: formName.trim(),
          email: formEmail.trim(),
          subtext: `Applied for: ${activeJobModal.title}`,
          content: formCoverLetter.trim() || `${formName.trim()} applied for ${activeJobModal.title}`,
          createdAt: new Date().toISOString(),
          targetTab: "job-applied",
        });
      } else {
        toast.error(json.error || "Failed to submit. Please try again.", {
          duration: 5000,
          position: "top-right",
        });
        if (json.rateLimited) lastSubmitTime = 0;
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

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
          
          {/* LEFT-ALIGNED BREADCRUMB ROUTE */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Careers</span>
          </div>

          {/* CENTER-ALIGNED HERO CONTENT */}
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
                <div key={s.id} className="p-4 rounded-2xl bg-white/70 dark:bg-[#131c31]/80 backdrop-blur-md border border-violet-100 dark:border-slate-800 shadow-sm text-center">
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-300">{s.value}</div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-1">{s.label}</div>
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
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium pt-1">{perks.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.perks.map((perk, i) => {
              const Icon = PERK_ICONS[i % PERK_ICONS.length];
              return (
                <div key={perk.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-9 w-9 rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-ink dark:text-white mb-1">{perk.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Open Positions ───────────────────────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {openings.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{openings.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{openings.subtitle}</p>
        </div>

        {/* Search + Category Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={openings.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-ink dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategoryId("ALL")}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedCategoryId === "ALL"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#131c31] border border-violet-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-400"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
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

        {/* Job Cards */}
        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No positions found</p>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-xs text-violet-600 dark:text-violet-400 underline cursor-pointer">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVacancies.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-2xl border bg-white dark:bg-[#131c31] p-5 shadow-sm hover:shadow-md cursor-pointer transition-all group ${
                  job.featured
                    ? "border-violet-300 dark:border-violet-700 ring-1 ring-violet-200 dark:ring-violet-800"
                    : "border-violet-100 dark:border-slate-800"
                }`}
                onClick={() => setActiveJobModal(job)}
              >
                {job.featured && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 text-[10px] font-bold border border-violet-200 dark:border-slate-700">
                    ⭐ Featured
                  </span>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{job.category?.name}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {job.summary || "Exciting opportunity to work on cutting-edge technology."}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { icon: MapPin, label: job.location },
                    { icon: Briefcase, label: job.type },
                    { icon: Award, label: job.experience },
                    ...(job.salary ? [{ icon: DollarSign, label: job.salary }] : []),
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      <Icon className="h-2.5 w-2.5" />
                      {label}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-violet-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">Click to apply</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-300 group-hover:gap-2 transition-all">
                    Apply Now <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <CtaSection />
      <Footer />

      {/* ─── Job Application Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {activeJobModal && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setActiveJobModal(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl my-auto max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-[#131c31] shadow-2xl border border-violet-100 dark:border-slate-800 overflow-hidden"
            >
              {/* Sticky Top Header Bar */}
              <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 sm:px-8 bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                      {activeJobModal.category?.name || "Career Opportunity"}
                    </span>
                    {activeJobModal.featured && (
                      <span className="px-1.5 py-0.5 rounded bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 text-[9px] font-bold">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-white truncate">
                    {activeJobModal.title}
                  </h2>
                  <div className="flex flex-wrap gap-2.5 mt-1">
                    {[
                      { icon: MapPin, label: activeJobModal.location },
                      { icon: Briefcase, label: activeJobModal.type },
                      { icon: Award, label: activeJobModal.experience },
                    ].filter((item) => Boolean(item.label)).map(({ icon: Icon, label }) => (
                      <span key={label} className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <Icon className="h-3 w-3 text-violet-500" /> {label}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveJobModal(null)}
                  className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Scrollable Modal Content Body */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                {!applicationSubmitted ? (
                  <>
                    {/* Job Summary */}
                    {activeJobModal.summary && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {activeJobModal.summary}
                      </p>
                    )}

                    {/* Responsibilities & Requirements */}
                    {(activeJobModal.responsibilities?.length > 0 || activeJobModal.requirements?.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-violet-100 dark:border-slate-800">
                        {activeJobModal.responsibilities?.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">What You'll Do</h4>
                            <ul className="space-y-1">
                              {activeJobModal.responsibilities.slice(0, 4).map((r: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" /> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {activeJobModal.requirements?.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Requirements</h4>
                            <ul className="space-y-1">
                              {activeJobModal.requirements.slice(0, 4).map((r: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                  <CheckCircle2 className="h-3 w-3 text-violet-500 mt-0.5 shrink-0" /> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Application Form */}
                    <div className="pt-2 border-t border-violet-100 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-ink dark:text-white mb-4 flex items-center gap-2">
                        <Send className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                        Submit Your Application
                      </h3>

                      <form onSubmit={handleSubmitApplication} className="space-y-4">
                        {/* Name + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-1">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              required
                              placeholder="Your full name"
                              className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-ink dark:text-slate-100 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-1">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                              required
                              placeholder="you@email.com"
                              className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-ink dark:text-slate-100 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                            />
                          </div>
                        </div>

                        {/* Phone + LinkedIn */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-1">
                              Phone / Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={formPhone}
                              onChange={(e) => setFormPhone(e.target.value)}
                              required
                              placeholder="+1 (555) 000-0000"
                              className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-ink dark:text-slate-100 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-1">
                              LinkedIn Profile
                            </label>
                            <input
                              type="url"
                              value={formLinkedIn}
                              onChange={(e) => setFormLinkedIn(e.target.value)}
                              placeholder="linkedin.com/in/yourprofile"
                              className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-ink dark:text-slate-100 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                            />
                          </div>
                        </div>

                        {/* Portfolio */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-1">
                            Portfolio / GitHub URL
                          </label>
                          <input
                            type="url"
                            value={formPortfolio}
                            onChange={(e) => setFormPortfolio(e.target.value)}
                            placeholder="github.com/yourusername or portfolio.com"
                            className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-ink dark:text-slate-100 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                          />
                        </div>

                        {/* Resume Upload */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-1">
                            Resume / CV <span className="text-red-500">*</span>
                          </label>
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed p-5 cursor-pointer transition-all ${
                              resumeFile
                                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-700"
                                : "border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                              className="hidden"
                              onChange={handleResumeChange}
                            />
                            {resumeFile ? (
                              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                <FileText className="h-5 w-5 shrink-0" />
                                <div>
                                  <div className="text-xs font-semibold">{resumeFile.name}</div>
                                  <div className="text-[10px] text-emerald-600/70 dark:text-emerald-500">
                                    {(resumeFile.size / 1024).toFixed(0)} KB · Click to change
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <UploadCloud className="h-6 w-6 text-slate-400" />
                                <div className="text-center">
                                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Click to upload resume or CV
                                  </div>
                                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                    PDF, Word, JPEG, PNG · Max 10 MB
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Cover Letter Section — Write Text OR Attach Image/Document File */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 dark:text-slate-300">
                              Cover Letter <span className="text-slate-400 font-normal text-[10px] lowercase">(optional)</span>
                            </label>

                            {/* Mode Switcher Tabs */}
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                              <button
                                type="button"
                                onClick={() => setCoverLetterMode("write")}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                                  coverLetterMode === "write"
                                    ? "bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                                }`}
                              >
                                <PenTool className="h-3 w-3" /> Write Text
                              </button>
                              <button
                                type="button"
                                onClick={() => setCoverLetterMode("upload")}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                                  coverLetterMode === "upload"
                                    ? "bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                                }`}
                              >
                                <Paperclip className="h-3 w-3" /> Attach Image / File
                              </button>
                            </div>
                          </div>

                          {coverLetterMode === "write" ? (
                            <textarea
                              rows={3}
                              value={formCoverLetter}
                              onChange={(e) => setFormCoverLetter(e.target.value)}
                              placeholder="Write or paste your cover letter, technical background, and why you're excited about this role..."
                              className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-ink dark:text-slate-100 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30 resize-none"
                            />
                          ) : (
                            <div
                              onClick={() => coverLetterFileInputRef.current?.click()}
                              className="border-2 border-dashed border-violet-200 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-center"
                            >
                              <input
                                ref={coverLetterFileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setCoverLetterFile(file);
                                }}
                              />
                              {coverLetterFile ? (
                                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                                  <FileText className="h-4 w-4" />
                                  <span>{coverLetterFile.name} ({(coverLetterFile.size / 1024).toFixed(0)} KB)</span>
                                  <span className="text-[10px] text-slate-400 font-normal">· Click to change</span>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <UploadCloud className="h-5 w-5 text-slate-400 mx-auto" />
                                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Click to upload Cover Letter Image or Document
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    Supports PNG, JPG, JPEG, PDF, Word
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={submitting}
                          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Submitting Application...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Submit Application
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  /* Success State */
                  <div className="py-12 text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-md"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold text-ink dark:text-white">Application Received!</h3>
                    <p className="text-xs max-w-md mx-auto text-ink/75 dark:text-slate-400 leading-relaxed">
                      Thank you for applying for{" "}
                      <span className="font-bold text-violet-700 dark:text-violet-400">{activeJobModal.title}</span>.
                      Our talent acquisition lead will review your profile and reach out within 48 hours.
                    </p>
                    <Button
                      onClick={() => setActiveJobModal(null)}
                      className="mt-4 px-6 py-2 rounded-xl border border-violet-200 dark:border-slate-700 text-white dark:text-white text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Close Window
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}