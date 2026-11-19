"use client";

import { useState, useEffect } from "react";
import React from 'react';
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Loader2,
  Briefcase,
  Tag,
  Type,
  TrendingUp,
  FolderPlus,
  Edit3,
  Check,
  X,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  ListPlus,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  MapPin,
  Banknote,
  Clock,
  Building2,
  GraduationCap,
  Eye,
  ExternalLink,
} from "lucide-react";
import { SectionNavSidebar, SectionNavItem } from "@/components/admin/dashboard/section-nav-sidebar";

const CAREERS_SECTIONS_CATALOG: SectionNavItem[] = [
  {
    id: "careers-hero",
    number: "01",
    title: "Hero Banner & Key Metrics",
    desc: "Header badge, title headlines, subtitle narrative, and stats metrics bar.",
    icon: Briefcase,
    badge: "Hero & Stats",
  },
  {
    id: "careers-perks",
    number: "02",
    title: "Perks & Benefits Section",
    desc: "Section tag, title highlight, subtitle, and employee perks cards.",
    icon: CheckCircle2,
    badge: "Perks",
  },
  {
    id: "careers-openings",
    number: "03",
    title: "Open Vacancies Header",
    desc: "Section badge, title, subtitle, and job search box placeholder.",
    icon: Type,
    badge: "Openings Header",
  },
  {
    id: "careers-categories",
    number: "04",
    title: "Job Categories & Departments",
    desc: "Create and manage departmental categories (Engineering, AI, Product, Design).",
    icon: FolderPlus,
    badge: "Departments",
  },
  {
    id: "careers-vacancies",
    number: "05",
    title: "Job Vacancies Manager",
    desc: "Create, edit, toggle active status, and manage open job listings.",
    icon: ListPlus,
    badge: "Vacancies",
  },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CareerStat {
  id: string;
  value: string;
  label: string;
}

interface CareerPerk {
  id: string;
  title: string;
  desc: string;
}

interface CareersPageContent {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
  stats: CareerStat[];
  perksSection: {
    tag: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    perks: CareerPerk[];
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
  description: string | null;
  order: number;
  _count?: { vacancies: number };
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
  order: number;
}

interface CareersPageEditorProps {
  sectionId: string | null;
  onCloseSection: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugifyText(text: string): string {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// ---------------------------------------------------------------------------
// Default content
// ---------------------------------------------------------------------------

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
    perks: [
      { id: "p1", title: "100% Remote-First Culture", desc: "Work from anywhere in the world with flexible working hours." },
      { id: "p2", title: "Top 5% Competitive Salary", desc: "Industry-leading NPR & USD salary benchmarks, stock options / equity, and annual bonuses." },
      { id: "p3", title: "NPR 4,00,000 Tech Setup & Learning", desc: "Annual stipend for your ideal MacBook setup, ergonomic home office, and learning courses." },
      { id: "p4", title: "Health, Wellness & PTO", desc: "Comprehensive health insurance, mental wellness stipends, and 25 days of paid time off." },
      { id: "p5", title: "Annual Team Retreats", desc: "All-expenses-paid annual global team retreats in places like Bali, Tokyo, and Zurich." },
      { id: "p6", title: "Rapid Career Progression", desc: "Direct mentorship from industry founders, biannual compensation reviews, and leadership paths." },
    ],
  },
  openingsSection: {
    badge: "Available Openings",
    title: "Explore open positions",
    subtitle: "Find your next career leap and apply in under 2 minutes.",
    searchPlaceholder: "Search job title, skill, or department...",
  },
};

// ---------------------------------------------------------------------------
// Constants & Defaults
// ---------------------------------------------------------------------------

const DEFAULT_VACANCY_FORM: Omit<JobVacancy, "id" | "category"> = {
  title: "",
  slug: "",
  categoryId: "",
  type: "Full-Time",
  location: "Remote (Global)",
  experience: "Senior",
  salary: "",
  deadline: "",
  summary: "",
  responsibilities: [],
  requirements: [],
  featured: false,
  isActive: true,
  order: 0,
};

// ---------------------------------------------------------------------------
// Helper: InteractiveListBuilder — for responsibilities / requirements
// ---------------------------------------------------------------------------

function InteractiveListBuilder({
  title,
  subtitle,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  subtitle?: string;
  items: string[];
  onChange: (updated: string[]) => void;
  placeholder?: string;
}) {
  const [draftItem, setDraftItem] = useState("");

  const addItem = () => {
    const trimmed = draftItem.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraftItem("");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, val: string) => {
    const copy = [...items];
    copy[index] = val;
    onChange(copy);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const copy = [...items];
    [copy[index], copy[targetIndex]] = [copy[targetIndex], copy[index]];
    onChange(copy);
  };

  return (
    <div className="space-y-3 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] shadow-xs">
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-6 px-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          No items added yet. Use the field below to add an entry.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <span className="font-mono text-[10px] font-bold text-slate-400 w-5 text-center shrink-0">
                {idx + 1}.
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
                className="flex-1 bg-transparent border-0 text-xs text-slate-800 dark:text-slate-150 focus:outline-none focus:ring-0 px-1 py-1"
              />
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(idx, "up")}
                  disabled={idx === 0}
                  title="Move Up"
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, "down")}
                  disabled={idx === items.length - 1}
                  title="Move Down"
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  title="Remove Item"
                  className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Item */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        <input
          type="text"
          value={draftItem}
          onChange={(e) => setDraftItem(e.target.value)}
          placeholder={placeholder || "Type item text and press Enter..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dedicated Separate Page Vacancy Editor Component
// ---------------------------------------------------------------------------

interface DedicatedVacancyEditorProps {
  editingVacancy: JobVacancy | null;
  formData: Omit<JobVacancy, "id" | "category">;
  onChange: (updated: Omit<JobVacancy, "id" | "category">) => void;
  categories: JobCategory[];
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

function DedicatedVacancyEditor({
  editingVacancy,
  formData,
  onChange,
  categories,
  isSaving,
  onSave,
  onCancel,
  onDelete,
}: DedicatedVacancyEditorProps) {
  const isEditing = Boolean(editingVacancy);
  const setField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    onChange({ ...formData, [field]: value });
  };

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 text-slate-900 dark:text-white animate-in fade-in-50 duration-200">
      {/* TOP HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2 text-xs font-bold shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Back to Vacancies Table</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Briefcase className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {isEditing ? "Editing Role" : "New Role Draft"}
                </span>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {isEditing ? `Edit: ${formData.title || "Untitled Vacancy"}` : "Create & Publish New Job Vacancy"}
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                {isEditing
                  ? `Position ID: ${editingVacancy!.id} • Department: ${selectedCategory?.name || "Unassigned"}`
                  : "Fill in position requirements, compensation, and candidate criteria to publish on /careers."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
          {isEditing && (
            <a
              href={`/careers/${formData.slug || editingVacancy?.slug || editingVacancy?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              title="Open public job vacancy page in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span>Live Page</span>
            </a>
          )}

          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-4 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 shrink-0" />
                <span>{isEditing ? "Save Vacancy Changes" : "Publish Job Vacancy"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN WORKSPACE (8 cols form / 4 cols sidebar + preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PRIMARY FORM FIELDS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD 1: POSITION ESSENTIALS */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-mono text-xs font-black text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                01
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Position Essentials &amp; Role Details
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Set the job title, assign to a departmental category, and write the primary narrative.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const prevAutoSlug = slugifyText(formData.title);
                    const isSlugUntouchedOrMatchesOld = !formData.slug || formData.slug === prevAutoSlug;
                    setField("title", newTitle);
                    if (isSlugUntouchedOrMatchesOld) {
                      setField("slug", slugifyText(newTitle));
                    }
                  }}
                  placeholder="e.g. Lead Autonomous AI Agent Engineer"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* URL Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    URL Slug
                  </label>
                  {formData.title && (
                    <button
                      type="button"
                      onClick={() => setField("slug", slugifyText(formData.title))}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Reset to title slug
                    </button>
                  )}
                </div>
                <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs">
                  <span className="text-slate-400 select-none shrink-0 font-mono">/careers/</span>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setField("slug", slugifyText(e.target.value))}
                    placeholder={slugifyText(formData.title || "job-title")}
                    className="w-full bg-transparent font-mono text-xs text-slate-900 dark:text-white focus:outline-none ml-1"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Public SEO URL for applicants:{" "}
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    /careers/{formData.slug || slugifyText(formData.title) || "job-title"}
                  </span>
                </p>
              </div>

              {/* Category / Department */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Department / Category <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {categories.length} {categories.length === 1 ? "category" : "categories"} available
                  </span>
                </div>

                {categories.length === 0 ? (
                  <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-bold">No job categories defined yet!</p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      Please return to Section #04 (Job Categories &amp; Departments) to create at least one category before publishing vacancies.
                    </p>
                  </div>
                ) : (
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setField("categoryId", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="">— Select Department Category —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Role Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Role Summary &amp; Overview
                </label>
                <textarea
                  rows={4}
                  value={formData.summary}
                  onChange={(e) => setField("summary", e.target.value)}
                  placeholder="Provide a compelling overview of this role, what the candidate will build, and how they will drive impact at Clickpoint Innovation..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: KEY RESPONSIBILITIES */}
          <InteractiveListBuilder
            title="Key Responsibilities"
            subtitle="Outline the day-to-day duties, technical ownership, and architectural milestones."
            items={formData.responsibilities || []}
            onChange={(items) => setField("responsibilities", items)}
            placeholder="e.g. Architect and maintain high-throughput vector ingestion pipelines with pgvector..."
          />

          {/* CARD 3: REQUIREMENTS & QUALIFICATIONS */}
          <InteractiveListBuilder
            title="Candidate Requirements & Qualifications"
            subtitle="Specify mandatory qualifications, framework expertise, years of experience, and mindsets."
            items={formData.requirements || []}
            onChange={(items) => setField("requirements", items)}
            placeholder="e.g. 4+ years of production experience with Next.js App Router, TypeScript, and Prisma..."
          />
        </div>

        {/* RIGHT COLUMN: LOGISTICS, STATUS & PREVIEW (4 COLS) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-4">
          {/* CARD 1: PUBLISHING & VISIBILITY */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Publishing &amp; Visibility
              </h3>
            </div>

            <div className="space-y-3">
              {/* Active Toggle Switch Card */}
              <div
                onClick={() => setField("isActive", !formData.isActive)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  formData.isActive
                    ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        formData.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                    />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {formData.isActive ? "Active (Live on Site)" : "Inactive (Draft / Hidden)"}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formData.isActive
                      ? "Visible to public applicants on /careers."
                      : "Hidden from applicants. Only admins can see."}
                  </p>
                </div>
                <div
                  className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                    formData.isActive ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      formData.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>

              {/* Featured Priority Toggle Card */}
              <div
                onClick={() => setField("featured", !formData.featured)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  formData.featured
                    ? "border-violet-300 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles
                      className={`h-3.5 w-3.5 ${
                        formData.featured ? "text-violet-600 dark:text-violet-400" : "text-slate-400"
                      }`}
                    />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Featured Priority
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formData.featured
                      ? "Pinned at top with a special highlight badge."
                      : "Standard priority placement on careers list."}
                  </p>
                </div>
                <div
                  className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                    formData.featured ? "bg-violet-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      formData.featured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: WORKPLACE & COMPENSATION */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Logistics &amp; Compensation
              </h3>
            </div>

            <div className="space-y-3">
              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Employment Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setField("type", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Experience Level
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setField("experience", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {["Junior", "Mid-Level", "Senior", "Lead", "Principal", "Director"].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setField("location", e.target.value)}
                    placeholder="e.g. Remote (Global) or Kathmandu"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Salary Benchmark
                </label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setField("salary", e.target.value)}
                    placeholder="e.g. NPR 25,00,000 - 35,00,000 / year"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Application Deadline
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.deadline || ""}
                    onChange={(e) => setField("deadline", e.target.value)}
                    placeholder="e.g. 2026-11-30 or Nov 30, 2026"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Display Order Priority
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) => setField("order", parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: LIVE PUBLIC CARD SIMULATION */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Live Candidate Card Preview</h4>
              </div>
              <span className="text-[10px] text-slate-400">Public View</span>
            </div>

            {/* Simulating public card */}
            <div
              className={`rounded-2xl border p-4 transition-all relative ${
                formData.featured
                  ? "border-violet-300 dark:border-violet-700 ring-1 ring-violet-200 dark:ring-violet-800 bg-violet-50/20 dark:bg-slate-900/40"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
              }`}
            >
              {formData.featured && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 text-[10px] font-bold border border-violet-200 dark:border-slate-700">
                  Featured
                </span>
              )}

              <div className="flex items-start gap-2.5 mb-2.5 pr-14">
                <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {formData.title || "Position Title Here"}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedCategory?.name || "Department"}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {formData.summary || "Summary of role and engineering mission..."}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  { icon: MapPin, label: formData.location || "Remote" },
                  { icon: Briefcase, label: formData.type || "Full-Time" },
                  { icon: GraduationCap, label: formData.experience || "Senior" },
                  ...(formData.salary ? [{ icon: Banknote, label: formData.salary }] : []),
                ].map(({ icon: Icon, label }, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                  >
                    <Icon className="h-2.5 w-2.5 text-slate-400" />
                    <span className="truncate max-w-[120px]">{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 4: ACTIONS & DANGER ZONE */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 space-y-3 shadow-xs">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isEditing ? "Save Vacancy Changes" : "Publish Job Vacancy"}</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel &amp; Return to Table
            </button>

            {isEditing && onDelete && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100/60 dark:hover:bg-red-950/40 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Vacancy Permanently</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Main editor component
// ---------------------------------------------------------------------------

export default function CareersPageEditor({ sectionId, onCloseSection }: CareersPageEditorProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    sectionId === "careers-jobs" ? "careers-vacancies" : (sectionId || "careers-hero")
  );
  const [formData, setFormData] = useState<CareersPageContent>(DEFAULT_CONTENT);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    if (sectionId) {
      if (sectionId === "careers-jobs") {
        setActiveSectionId("careers-vacancies");
      } else {
        setActiveSectionId(sectionId);
      }
    }
  }, [sectionId]);

  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [isLoadingVacancies, setIsLoadingVacancies] = useState(true);
  const [vacancyViewMode, setVacancyViewMode] = useState<"catalog" | "editor">("catalog");
  const [editingVacancy, setEditingVacancy] = useState<JobVacancy | null>(null);
  const [vacancyFormData, setVacancyFormData] = useState<Omit<JobVacancy, "id" | "category">>(DEFAULT_VACANCY_FORM);
  const [isSavingVacancy, setIsSavingVacancy] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/careers");
        const json = await res.json();
        if (json.success && json.data) setFormData(json.data);
      } catch {
        toast.error("Failed to load careers page content");
      } finally {
        setIsLoadingContent(false);
      }
    }
    load();
  }, []);

  async function loadCategories() {
    setIsLoadingCategories(true);
    try {
      const res = await fetch("/api/careers/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data || []);
    } catch {
      toast.error("Failed to load job categories");
    } finally {
      setIsLoadingCategories(false);
    }
  }

  async function loadVacancies() {
    setIsLoadingVacancies(true);
    try {
      const res = await fetch("/api/careers/vacancies?admin=true");
      const json = await res.json();
      if (json.success) setVacancies(json.data || []);
    } catch {
      toast.error("Failed to load job vacancies");
    } finally {
      setIsLoadingVacancies(false);
    }
  }

  useEffect(() => {
    loadCategories();
    loadVacancies();
  }, []);

  async function handleSaveContent() {
    setIsSavingContent(true);
    const toastId = toast.loading("Saving careers page content...");
    try {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Careers page content saved!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save", { id: toastId });
      }
    } catch {
      toast.error("Save failed", { id: toastId });
    } finally {
      setIsSavingContent(false);
    }
  }

  async function handleResetContent() {
    if (!confirm("Reset all careers page content to defaults?")) return;
    setFormData(DEFAULT_CONTENT);
    await fetch("/api/careers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(DEFAULT_CONTENT),
    });
    toast.info("Reset to default careers page content");
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    setIsSavingCategory(true);
    const toastId = toast.loading("Creating category...");
    try {
      const res = await fetch("/api/careers/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, description: newCategoryDesc, order: categories.length }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Category "${newCategoryName}" created!`, { id: toastId });
        setNewCategoryName("");
        setNewCategoryDesc("");
        await loadCategories();
      } else {
        toast.error(json.error || "Failed to create category", { id: toastId });
      }
    } catch {
      toast.error("Failed to create category", { id: toastId });
    } finally {
      setIsSavingCategory(false);
    }
  }

  async function handleUpdateCategory() {
    if (!editingCategory) return;
    setIsSavingCategory(true);
    const toastId = toast.loading("Updating category...");
    try {
      const res = await fetch("/api/careers/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editingCategory.name,
          description: editingCategory.description,
          order: editingCategory.order,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Category updated!", { id: toastId });
        setEditingCategory(null);
        await loadCategories();
      } else {
        toast.error(json.error || "Failed to update category", { id: toastId });
      }
    } catch {
      toast.error("Failed to update category", { id: toastId });
    } finally {
      setIsSavingCategory(false);
    }
  }

  async function handleDeleteCategory(cat: JobCategory) {
    const count = cat._count?.vacancies ?? 0;
    if (count > 0) {
      toast.error(`Cannot delete — ${count} vacancies still use this category. Reassign or delete them first.`);
      return;
    }
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    const toastId = toast.loading("Deleting category...");
    try {
      const res = await fetch(`/api/careers/categories?id=${cat.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Category deleted!", { id: toastId });
        await loadCategories();
      } else {
        toast.error(json.error || "Failed to delete category", { id: toastId });
      }
    } catch {
      toast.error("Failed to delete category", { id: toastId });
    }
  }

  function openCreateVacancy() {
    setEditingVacancy(null);
    setVacancyFormData({
      ...DEFAULT_VACANCY_FORM,
      categoryId: categories[0]?.id || "",
      order: vacancies.length,
    });
    setVacancyViewMode("editor");
  }

  function openEditVacancy(v: JobVacancy) {
    setEditingVacancy(v);
    setVacancyFormData({
      title: v.title,
      slug: v.slug || slugifyText(v.title),
      categoryId: v.categoryId,
      type: v.type,
      location: v.location,
      experience: v.experience,
      salary: v.salary || "",
      deadline: v.deadline || "",
      summary: v.summary || "",
      responsibilities: Array.isArray(v.responsibilities) ? [...v.responsibilities] : [],
      requirements: Array.isArray(v.requirements) ? [...v.requirements] : [],
      featured: Boolean(v.featured),
      isActive: Boolean(v.isActive),
      order: typeof v.order === "number" ? v.order : 0,
    });
    setVacancyViewMode("editor");
  }

  function closeVacancyEditor() {
    setVacancyViewMode("catalog");
    setEditingVacancy(null);
  }

  async function handleSaveVacancy() {
    if (!vacancyFormData.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!vacancyFormData.categoryId) {
      toast.error("Please select a department category");
      return;
    }
    setIsSavingVacancy(true);
    const isEditing = Boolean(editingVacancy);
    const toastId = toast.loading(isEditing ? "Updating vacancy..." : "Creating vacancy...");

    try {
      const res = await fetch("/api/careers/vacancies", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing
            ? { ...vacancyFormData, id: editingVacancy!.id }
            : vacancyFormData
        ),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(
          isEditing
            ? `Vacancy "${vacancyFormData.title}" updated!`
            : `Vacancy "${vacancyFormData.title}" published!`,
          { id: toastId }
        );
        setVacancyViewMode("catalog");
        setEditingVacancy(null);
        await loadVacancies();
      } else {
        toast.error(json.error || `Failed to ${isEditing ? "update" : "create"} vacancy`, { id: toastId });
      }
    } catch {
      toast.error(`Failed to ${isEditing ? "update" : "create"} vacancy`, { id: toastId });
    } finally {
      setIsSavingVacancy(false);
    }
  }

  async function handleDeleteVacancy(v: JobVacancy) {
    if (!confirm(`Delete vacancy "${v.title}"? This cannot be undone.`)) return;
    const toastId = toast.loading("Deleting vacancy...");
    try {
      const res = await fetch(`/api/careers/vacancies?id=${v.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Vacancy deleted!", { id: toastId });
        if (editingVacancy?.id === v.id) {
          setVacancyViewMode("catalog");
          setEditingVacancy(null);
        }
        await loadVacancies();
      } else {
        toast.error(json.error || "Failed to delete vacancy", { id: toastId });
      }
    } catch {
      toast.error("Failed to delete vacancy", { id: toastId });
    }
  }

  async function handleToggleActive(v: JobVacancy) {
    const toastId = toast.loading(v.isActive ? "Deactivating..." : "Activating...");
    try {
      const res = await fetch("/api/careers/vacancies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: v.id, isActive: !v.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(v.isActive ? "Vacancy deactivated (hidden from site)" : "Vacancy activated (visible on site)", { id: toastId });
        await loadVacancies();
      } else {
        toast.error(json.error || "Failed to update status", { id: toastId });
      }
    } catch {
      toast.error("Failed to update status", { id: toastId });
    }
  }

  if (isLoadingContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] gap-3 bg-white dark:bg-[#131927] rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-violet-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading careers page data...</p>
      </div>
    );
  }

  if (vacancyViewMode === "editor") {
    return (
      <DedicatedVacancyEditor
        editingVacancy={editingVacancy}
        formData={vacancyFormData}
        onChange={setVacancyFormData}
        categories={categories}
        isSaving={isSavingVacancy}
        onSave={handleSaveVacancy}
        onCancel={closeVacancyEditor}
        onDelete={editingVacancy ? () => handleDeleteVacancy(editingVacancy) : undefined}
      />
    );
  }

  const currentSectionMeta =
    CAREERS_SECTIONS_CATALOG.find((s) => s.id === activeSectionId) || CAREERS_SECTIONS_CATALOG[0];
  const SectionIcon = currentSectionMeta.icon || Briefcase;

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 text-slate-900 dark:text-white">
      {/* 2-Column Master-Detail Selection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Selector */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-4">
          <SectionNavSidebar
            title="Careers Sections"
            sections={CAREERS_SECTIONS_CATALOG}
            activeSectionId={activeSectionId}
            onSelectSection={(id) => setActiveSectionId(id)}
            accentColor="violet"
          />
        </div>

        {/* Right Column: Active Section Editor Workspace */}
        <div className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-5">
          {/* Active Section Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20 shrink-0">
                  #{currentSectionMeta.number}
                </span>
                <SectionIcon className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <h2 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {currentSectionMeta.title}
                </h2>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
                {currentSectionMeta.desc}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleResetContent}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveContent}
                disabled={isSavingContent}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-md shadow-violet-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {isSavingContent ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 1: HERO */}
          {activeSectionId === "careers-hero" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">#01</span>
            <h3 className="text-xs sm:text-sm font-bold">Hero Banner — Badge, Titles & Subtitle</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-violet-500 shrink-0" /> Hero Badge Text
              </label>
              <input
                type="text"
                value={formData.hero.badge}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, badge: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-violet-500 shrink-0" /> Hero Title (before highlight)
              </label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-violet-500 shrink-0" /> Highlight Text (coloured portion)
              </label>
              <input
                type="text"
                value={formData.hero.titleHighlight}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, titleHighlight: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hero Subtitle / Description</label>
              <textarea
                rows={3}
                value={formData.hero.subtitle}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Stats bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-600 shrink-0" />
                <h4 className="text-xs font-bold">Counter Stats Bar ({formData.stats.length})</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    stats: [...formData.stats, { id: `st-${Date.now()}`, value: "0", label: "New Stat" }],
                  });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Stat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {formData.stats.map((stat, idx) => (
                <div key={stat.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-violet-600">Stat #{idx + 1}</span>
                    {formData.stats.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, stats: formData.stats.filter((_, i) => i !== idx) });
                        }}
                        className="text-red-500 hover:text-red-700 p-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Value (e.g. 100%)"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...formData.stats];
                      updated[idx] = { ...updated[idx], value: e.target.value };
                      setFormData({ ...formData, stats: updated });
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...formData.stats];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setFormData({ ...formData, stats: updated });
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PERKS SECTION HEADINGS + PERKS CARDS */}
      {(activeSectionId === "careers-perks" || activeSectionId === "careers-hero-perks") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">#02</span>
            <h3 className="text-xs sm:text-sm font-bold">Perks & Benefits Section — Headings & Perk Cards</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section Tag (orange small text)</label>
              <input
                type="text"
                value={formData.perksSection.tag}
                onChange={(e) => setFormData({ ...formData, perksSection: { ...formData.perksSection, tag: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section Title</label>
              <input
                type="text"
                value={formData.perksSection.title}
                onChange={(e) => setFormData({ ...formData, perksSection: { ...formData.perksSection, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title Highlight (coloured part)</label>
              <input
                type="text"
                value={formData.perksSection.titleHighlight}
                onChange={(e) => setFormData({ ...formData, perksSection: { ...formData.perksSection, titleHighlight: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={formData.perksSection.subtitle}
                onChange={(e) => setFormData({ ...formData, perksSection: { ...formData.perksSection, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Perks Cards */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold">Perk Cards ({formData.perksSection.perks.length})</h4>
              <button
                type="button"
                onClick={() => {
                  const newPerk: CareerPerk = { id: `p-${Date.now()}`, title: "New Perk", desc: "Perk description here." };
                  setFormData({
                    ...formData,
                    perksSection: { ...formData.perksSection, perks: [...formData.perksSection.perks, newPerk] },
                  });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Perk
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.perksSection.perks.map((perk, idx) => (
                <div key={perk.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-violet-600">Perk #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.perksSection.perks.filter((_, i) => i !== idx);
                        setFormData({ ...formData, perksSection: { ...formData.perksSection, perks: updated } });
                      }}
                      className="text-red-500 hover:text-red-700 p-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Perk Title"
                    value={perk.title}
                    onChange={(e) => {
                      const updated = [...formData.perksSection.perks];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setFormData({ ...formData, perksSection: { ...formData.perksSection, perks: updated } });
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Perk description..."
                    value={perk.desc}
                    onChange={(e) => {
                      const updated = [...formData.perksSection.perks];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      setFormData({ ...formData, perksSection: { ...formData.perksSection, perks: updated } });
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: OPENINGS SECTION HEADINGS */}
      {activeSectionId === "careers-openings" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">#03</span>
            <h3 className="text-xs sm:text-sm font-bold">Open Vacancies Section — Headings & Search Placeholder</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section Badge</label>
              <input
                type="text"
                value={formData.openingsSection.badge}
                onChange={(e) => setFormData({ ...formData, openingsSection: { ...formData.openingsSection, badge: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section Title</label>
              <input
                type="text"
                value={formData.openingsSection.title}
                onChange={(e) => setFormData({ ...formData, openingsSection: { ...formData.openingsSection, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={formData.openingsSection.subtitle}
                onChange={(e) => setFormData({ ...formData, openingsSection: { ...formData.openingsSection, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Search Box Placeholder Text</label>
              <input
                type="text"
                value={formData.openingsSection.searchPlaceholder}
                onChange={(e) => setFormData({ ...formData, openingsSection: { ...formData.openingsSection, searchPlaceholder: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: JOB CATEGORIES MANAGER */}
      {activeSectionId === "careers-categories" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">#04</span>
            <h3 className="text-xs sm:text-sm font-bold">Job Category Manager — Create & Edit Departments</h3>
          </div>

          {/* Create new category */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <FolderPlus className="h-4 w-4 shrink-0" /> Create New Category / Department
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Engineering & AI"
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateCategory(); }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={handleCreateCategory}
              disabled={isSavingCategory}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isSavingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Category
            </button>
          </div>

          {/* Existing categories list */}
          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-8 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              <span className="text-xs text-slate-400">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">No categories yet. Create one above to start adding vacancies.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60"
                >
                  {editingCategory?.id === cat.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={editingCategory.description || ""}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        placeholder="Description..."
                        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{cat.name}</span>
                        <span className="rounded-full bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300 shrink-0">
                          {cat._count?.vacancies ?? 0} vacancies
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{cat.description}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {editingCategory?.id === cat.id ? (
                      <>
                        <button
                          onClick={handleUpdateCategory}
                          disabled={isSavingCategory}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {isSavingCategory ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: JOB VACANCIES MANAGER */}
      {(activeSectionId === "careers-vacancies" || activeSectionId === "careers-jobs") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #05
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Job Vacancies Manager ({vacancies.length} total)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click &quot;New Vacancy&quot; or select &quot;Edit&quot; on any role to open the dedicated full-page job editor.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openCreateVacancy}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Vacancy</span>
            </button>
          </div>

          {/* Vacancies Tabular Layout */}
          {isLoadingVacancies ? (
            <div className="flex items-center justify-center py-12 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-xs text-slate-400 font-medium">Loading vacancies catalog...</span>
            </div>
          ) : vacancies.length === 0 ? (
            <div className="text-center py-12 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <Briefcase className="h-9 w-9 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No vacancies published yet</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Create departmental categories in Section #04 first, then click &quot;New Vacancy&quot; above to publish your first role.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateVacancy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Publish First Vacancy</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                    <th scope="col" className="px-3.5 sm:px-4 py-3">
                      Job Title
                    </th>
                    <th scope="col" className="px-3.5 sm:px-4 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-3.5 sm:px-4 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-3.5 sm:px-4 py-3">
                      Location
                    </th>
                    <th scope="col" className="px-3.5 sm:px-4 py-3">
                      Salary
                    </th>
                    <th scope="col" className="px-3.5 sm:px-4 py-3">
                      Deadline
                    </th>
                    <th scope="col" className="px-3.5 sm:px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-3.5 sm:px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#131927]">
                  {vacancies.map((v) => (
                    <tr
                      key={v.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-3.5 sm:px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[160px] sm:max-w-xs font-bold text-slate-900 dark:text-white">
                            {v.title}
                          </span>
                          {v.featured && (
                            <span className="rounded-full bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300 shrink-0">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3.5 sm:px-4 py-3.5">
                        <span className="inline-block rounded-full bg-violet-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 dark:text-violet-300 whitespace-nowrap">
                          {v.category?.name || "Unassigned"}
                        </span>
                      </td>

                      <td className="px-3.5 sm:px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {v.type}
                      </td>

                      <td className="px-3.5 sm:px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {v.location}
                      </td>

                      <td className="px-3.5 sm:px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {v.salary || "—"}
                      </td>

                      <td className="px-3.5 sm:px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {v.deadline || "Ongoing"}
                      </td>

                      <td className="px-3.5 sm:px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(v)}
                          title={
                            v.isActive
                              ? "Deactivate (hide from site)"
                              : "Activate (show on site)"
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            v.isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {v.isActive ? (
                            <ToggleRight className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5 shrink-0" />
                          )}
                          {v.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="px-3.5 sm:px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/careers/${v.slug || slugifyText(v.title) || v.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`View ${v.title} on public careers page`}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="h-3 w-3 text-slate-500" />
                            <span>View</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => openEditVacancy(v)}
                            title={`Edit ${v.title} in dedicated page`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteVacancy(v)}
                            title="Delete vacancy"
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

        </div>
      </div>
    </div>
  );
}