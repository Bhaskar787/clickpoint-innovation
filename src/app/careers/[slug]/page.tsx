"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Share2,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import JobApplyModal from "@/components/careers/job-apply-modal";
import { toast } from "sonner";

interface JobCategory {
  id: string;
  name: string;
}

export interface VacancySection {
  id: string;
  title: string;
  type: "paragraph" | "points";
  content?: string;
  items?: string[];
}

interface JobVacancy {
  id: string;
  title: string;
  slug?: string;
  categoryId: string;
  category: JobCategory;
  type: string;
  location: string;
  experience: string;
  salary: string;
  deadline?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  sections?: VacancySection[];
  featured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function getJobSections(job: JobVacancy): VacancySection[] {
  if (Array.isArray(job.sections) && job.sections.length > 0) {
    return job.sections;
  }
  // Fallback to legacy structure
  const fallback: VacancySection[] = [];
  if (job.summary || (!job.requirements?.length && !job.responsibilities?.length)) {
    fallback.push({
      id: "sec-about",
      title: "About the Position",
      type: "paragraph",
      content:
        job.summary ||
        `The ${job.title} is responsible for driving organizational outcomes, collaborating across technical and executive pods, and building high-impact enterprise software solutions for Clickpoint Innovation.`,
      items: [],
    });
  }

  if (job.requirements && job.requirements.length > 0) {
    fallback.push({
      id: "sec-qualifications",
      title: "Qualification and Experience",
      type: "points",
      content: "",
      items: job.requirements,
    });
  } else if (!job.summary && !job.responsibilities?.length) {
    fallback.push({
      id: "sec-qualifications",
      title: "Qualification and Experience",
      type: "points",
      content: "",
      items: [
        "Bachelor's degree in Computer Science, Software Engineering, IT, or equivalent practical experience.",
        "Proven experience working in high-growth software teams with modern toolchains.",
      ],
    });
  }

  if (job.responsibilities && job.responsibilities.length > 0) {
    fallback.push({
      id: "sec-responsibilities",
      title: "Job Description & Responsibilities",
      type: "points",
      content: "",
      items: job.responsibilities,
    });
  }

  return fallback;
}

function formatSalary(salary?: string | null): string {
  if (!salary || !salary.trim()) return "Negotiable";
  const clean = salary.replace(/\$/g, "").trim();
  if (!clean || /negotiable/i.test(clean)) return "Negotiable";
  if (clean.toLowerCase().includes("npr") || clean.toLowerCase().includes("rs")) return clean;
  return `NPR ${clean}`;
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

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawParam = ((params?.slug || params?.id) as string) || "";
  const identifier = decodeURIComponent(rawParam).trim();

  const [job, setJob] = useState<JobVacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    if (!identifier) return;

    async function fetchJob() {
      try {
        const res = await fetch(
          `/api/careers/vacancies?slug=${encodeURIComponent(identifier)}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (json.success && json.data) {
          setJob(json.data);
        } else {
          setJob(null);
        }
      } catch {
        setJob(null);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [identifier]);

  function handleShare() {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${job?.title || "Career Opportunity"} at Clickpoint Innovation`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <Loader2 className="h-9 w-9 text-violet-600 dark:text-violet-400 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-500">Loading position details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Position Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-6">
            This job listing may have been filled, deactivated, or relocated.
          </p>
          <Link
            href="/careers"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Explore All Openings</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const lastUpdatedDisplay = job.updatedAt
    ? new Date(job.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white">
      <Navbar />

      {/* Main Container — with pt-28 sm:pt-32 so breadcrumb is never hidden behind fixed navbar */}
      <main className="flex-1 pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* BREADCRUMB NAVIGATION */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <Link href="/careers" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Careers
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
              {job.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#131c31] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
            <Link
              href="/careers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Jobs</span>
            </Link>
          </div>
        </div>

        {/* TOP JOB HEADER CARD */}
        <div className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 min-w-0 flex-1">
              {/* Company Subtext */}
              <div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Clickpoint Innovation
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1 leading-tight tracking-tight">
                  {job.title}
                </h1>
              </div>

              {/* Meta Row with Icons */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-violet-500" />
                  <span>{job.location || "Kathmandu (On-site)"}</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Application Deadline: {formatDeadline(job.deadline)}</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Last Updated: {lastUpdatedDisplay}</span>
                </span>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-xs text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {job.type || "Full Time"}
                </span>
                <span className="px-2.5 py-0.5 rounded-xs text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {job.experience || "Mid Level"}
                </span>
                <span className="px-2.5 py-0.5 rounded-xs text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {job.category?.name || "Engineering"}
                </span>
                {job.featured && (
                  <span className="px-2.5 py-0.5 rounded-xs text-[11px] font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                    Featured Priority
                  </span>
                )}
              </div>
            </div>

            {/* Top Right Action Button */}
            <div className="shrink-0 self-start lg:self-center">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold text-xs uppercase tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Apply Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT (8 COLS DETAILS / 4 COLS SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: DETAILED SPECIFICATIONS (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            {/* DYNAMIC JOB CONTENT SECTIONS */}
            {getJobSections(job).map((section, idx) => (
              <div
                key={section.id || idx}
                className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 sm:p-8 space-y-4 shadow-xs"
              >
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {section.title}
                </h2>

                {section.type === "paragraph" ? (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {section.content || "Details for this position will be coordinated during onboarding."}
                  </p>
                ) : section.items && section.items.length > 0 ? (
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                      >
                        <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-400">
                    No points added for this section.
                  </p>
                )}
              </div>
            ))}

            {/* 4. HOW TO APPLY SECTION */}
            <div className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-violet-50/40 dark:bg-slate-900/40 p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                How to apply?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We are always keen to meet energetic and talented professionals who would like to join
                our team. Click on the button below and submit your application to apply for the post.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="px-6 py-2.5 rounded-sm bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold text-xs uppercase tracking-wide transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Apply Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* JOB OVERVIEW CARD */}
            <div className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-6 space-y-4 shadow-xs">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Job Overview
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60">
                  <span className="text-slate-400 font-medium">Last Updated:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {lastUpdatedDisplay}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60">
                  <span className="text-slate-400 font-medium">Seats:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">1 Available</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60">
                  <span className="text-slate-400 font-medium">Job Level:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {job.experience || "Mid Level"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60">
                  <span className="text-slate-400 font-medium">Job Type:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {job.type || "Full Time"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60">
                  <span className="text-slate-400 font-medium">Category:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {job.category?.name || "Engineering"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100/70 dark:border-slate-800/60">
                  <span className="text-slate-400 font-medium">Salary:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatSalary(job.salary)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">Application Deadline:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatDeadline(job.deadline)}
                  </span>
                </div>
              </div>

              {/* Note / Disclaimer Box */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xs border border-slate-100 dark:border-slate-800">
                  <strong>Note:</strong> Due to the high volume of applications, only shortlisted
                  candidates will be contacted via email or phone. If you do not hear from us within 30
                  days of applying, please consider the application not shortlisted at this time. We
                  appreciate your interest in joining Clickpoint Innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* REUSABLE JOB APPLY MODAL */}
      <JobApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
