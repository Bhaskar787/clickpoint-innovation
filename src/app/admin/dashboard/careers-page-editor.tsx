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
  Sparkles,
  ChevronDown,
  ChevronUp,
  ListPlus,
  CheckCircle2,
} from "lucide-react";

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
  order: number;
}

interface CareersPageEditorProps {
  sectionId: string | null;
  onCloseSection: () => void;
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
// Helper: ListEditor — for responsibilities / requirements
// ---------------------------------------------------------------------------

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (updated: string[]) => void;
  placeholder?: string;
}) {
  const [newItem, setNewItem] = useState("");

  function add() {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setNewItem("");
  }

  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  function update(idx: number, val: string) {
    const copy = [...items];
    copy[idx] = val;
    onChange(copy);
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-violet-500 shrink-0 mt-2" />
          <input
            type="text"
            value={item}
            onChange={(e) => update(idx, e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => remove(idx)}
            className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-1">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder || "Add item and press Enter..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
        />
        <button
          type="button"
          onClick={add}
          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors shrink-0"
        >
          <ListPlus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VacancyFormFields
// ---------------------------------------------------------------------------

function VacancyFormFields({
  data,
  onChange,
  categories,
}: {
  data: Omit<JobVacancy, "id" | "category">;
  onChange: (updated: Omit<JobVacancy, "id" | "category">) => void;
  categories: JobCategory[];
}) {
  const set = (field: keyof typeof data, value: unknown) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
      {/* Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Senior Full-Stack AI Engineer"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category / Department *</label>
          {categories.length === 0 ? (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              ⚠ Create at least one category first
            </p>
          ) : (
            <select
              value={data.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
            >
              <option value="">— Select category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Employment Type</label>
          <select
            value={data.type}
            onChange={(e) => set("type", e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          >
            {["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Remote (Global)"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Experience Level</label>
          <select
            value={data.experience}
            onChange={(e) => set("experience", e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          >
            {["Junior", "Mid-Level", "Senior", "Lead", "Principal", "Director"].map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>

        {/* Salary */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Salary Range</label>
          <input
            type="text"
            value={data.salary}
            onChange={(e) => set("salary", e.target.value)}
            placeholder="e.g. NPR 25,00,000 - 35,00,000 / year + Equity"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>

        {/* Summary */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role Summary</label>
          <textarea
            rows={3}
            value={data.summary}
            onChange={(e) => set("summary", e.target.value)}
            placeholder="Brief description of the role..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Key Responsibilities ({(data.responsibilities || []).length})
        </label>
        <ListEditor
          items={data.responsibilities || []}
          onChange={(items) => set("responsibilities", items)}
          placeholder="Add a responsibility..."
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Requirements ({(data.requirements || []).length})
        </label>
        <ListEditor
          items={data.requirements || []}
          onChange={(items) => set("requirements", items)}
          placeholder="Add a requirement..."
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <button
            type="button"
            onClick={() => set("featured", !data.featured)}
            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
              data.featured
                ? "bg-violet-600 border-violet-600 text-white"
                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            }`}
          >
            {data.featured && <Check className="h-3 w-3" />}
          </button>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mark as Featured Priority</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <button
            type="button"
            onClick={() => set("isActive", !data.isActive)}
            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
              data.isActive
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            }`}
          >
            {data.isActive && <Check className="h-3 w-3" />}
          </button>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Active (visible on site)</span>
        </label>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main editor component
// ---------------------------------------------------------------------------

export default function CareersPageEditor({ sectionId, onCloseSection }: CareersPageEditorProps) {
  const [formData, setFormData] = useState<CareersPageContent>(DEFAULT_CONTENT);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isSavingContent, setIsSavingContent] = useState(false);

  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [isLoadingVacancies, setIsLoadingVacancies] = useState(true);
  const [editingVacancy, setEditingVacancy] = useState<JobVacancy | null>(null);
  const [expandedVacancyId, setExpandedVacancyId] = useState<string | null>(null);
  const [isSavingVacancy, setIsSavingVacancy] = useState(false);
  const [showNewVacancyForm, setShowNewVacancyForm] = useState(false);
  const [newVacancy, setNewVacancy] = useState<Omit<JobVacancy, "id" | "category">>({
    title: "",
    categoryId: "",
    type: "Full-Time",
    location: "Remote (Global)",
    experience: "Senior",
    salary: "",
    summary: "",
    responsibilities: [],
    requirements: [],
    featured: false,
    isActive: true,
    order: 0,
  });

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

  async function handleCreateVacancy() {
    if (!newVacancy.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!newVacancy.categoryId) {
      toast.error("Please select a category");
      return;
    }
    setIsSavingVacancy(true);
    const toastId = toast.loading("Creating vacancy...");
    try {
      const res = await fetch("/api/careers/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVacancy),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Vacancy "${newVacancy.title}" created!`, { id: toastId });
        setShowNewVacancyForm(false);
        setNewVacancy({
          title: "",
          categoryId: categories[0]?.id || "",
          type: "Full-Time",
          location: "Remote (Global)",
          experience: "Senior",
          salary: "",
          summary: "",
          responsibilities: [],
          requirements: [],
          featured: false,
          isActive: true,
          order: vacancies.length,
        });
        await loadVacancies();
      } else {
        toast.error(json.error || "Failed to create vacancy", { id: toastId });
      }
    } catch {
      toast.error("Failed to create vacancy", { id: toastId });
    } finally {
      setIsSavingVacancy(false);
    }
  }

  async function handleUpdateVacancy() {
    if (!editingVacancy) return;
    setIsSavingVacancy(true);
    const toastId = toast.loading("Saving vacancy...");
    try {
      const res = await fetch("/api/careers/vacancies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingVacancy),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Vacancy updated!", { id: toastId });
        setEditingVacancy(null);
        setExpandedVacancyId(null);
        await loadVacancies();
      } else {
        toast.error(json.error || "Failed to update vacancy", { id: toastId });
      }
    } catch {
      toast.error("Failed to update vacancy", { id: toastId });
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

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6 text-slate-900 dark:text-white">

      {/* ACTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131927] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-violet-600 shrink-0" />
            Careers Page Editor — Full Dynamic Control
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Edit hero text, stats, perks section headings, manage job categories, and create/edit vacancies.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <button
            onClick={handleResetContent}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSaveContent}
            disabled={isSavingContent}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-md shadow-violet-500/20 transition-all disabled:opacity-50"
          >
            {isSavingContent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Page Content
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      {(!sectionId || sectionId === "careers-hero") && (
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
                <Sparkles className="h-3.5 w-3.5 text-violet-500 shrink-0" /> Highlight Text (coloured portion)
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
      {(!sectionId || sectionId === "careers-hero") && (
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
      {(!sectionId || sectionId === "careers-jobs") && (
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
      {(!sectionId || sectionId === "careers-jobs") && (
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
      {(!sectionId || sectionId === "careers-jobs") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #05
              </span>
              <h3 className="text-xs sm:text-sm font-bold">
                Job Vacancies Manager ({vacancies.length} total)
              </h3>
            </div>
            <button
              onClick={() => {
                setShowNewVacancyForm(!showNewVacancyForm);
                setNewVacancy((prev) => ({
                  ...prev,
                  categoryId: categories[0]?.id || "",
                }));
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              {showNewVacancyForm ? (
                <X className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {showNewVacancyForm ? "Cancel" : "New Vacancy"}
            </button>
          </div>

          {/* New Vacancy Form */}
          {showNewVacancyForm && (
            <div className="space-y-3 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <FolderPlus className="h-4 w-4 shrink-0" /> Creating New Job Vacancy
              </h4>
              <VacancyFormFields
                data={newVacancy}
                onChange={(updated) =>
                  setNewVacancy(
                    updated as Omit<JobVacancy, "id" | "category">
                  )
                }
                categories={categories}
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCreateVacancy}
                  disabled={isSavingVacancy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {isSavingVacancy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Create Vacancy
                </button>
                <button
                  onClick={() => setShowNewVacancyForm(false)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Vacancies Tabular Layout */}
          {isLoadingVacancies ? (
            <div className="flex items-center justify-center py-8 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              <span className="text-xs text-slate-400">Loading vacancies...</span>
            </div>
          ) : vacancies.length === 0 ? (
            <div className="text-center py-10 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <Briefcase className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No vacancies yet. Create categories first, then add vacancies above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse min-w-[640px]">
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
                      Status
                    </th>
                    <th scope="col" className="px-3.5 sm:px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#131927]">
                  {vacancies.map((v) => {
                    const isExpanded = expandedVacancyId === v.id;
                    return (
                      <React.Fragment key={v.id}>
                        <tr
                          className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                            isExpanded ? "bg-blue-50/40 dark:bg-slate-800/30" : ""
                          }`}
                        >
                          <td className="px-3.5 sm:px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <span className="truncate max-w-[140px] sm:max-w-xs font-semibold">
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
                              {v.category.name}
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

                          <td className="px-3.5 sm:px-4 py-3.5 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleActive(v)}
                              title={
                                v.isActive
                                  ? "Deactivate (hide from site)"
                                  : "Activate (show on site)"
                              }
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
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
                              <button
                                onClick={() => {
                                  if (isExpanded) {
                                    setExpandedVacancyId(null);
                                    setEditingVacancy(null);
                                  } else {
                                    setExpandedVacancyId(v.id);
                                    setEditingVacancy({ ...v });
                                  }
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                {isExpanded ? (
                                  <ChevronUp className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                )}
                              </button>

                              <button
                                onClick={() => handleDeleteVacancy(v)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && editingVacancy && (
                          <tr className="bg-slate-50/60 dark:bg-slate-900/60">
                            <td colSpan={7} className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
                              <div className="space-y-4 max-w-5xl mx-auto">
                                <VacancyFormFields
                                  data={{
                                    title: editingVacancy.title,
                                    categoryId: editingVacancy.categoryId,
                                    type: editingVacancy.type,
                                    location: editingVacancy.location,
                                    experience: editingVacancy.experience,
                                    salary: editingVacancy.salary,
                                    summary: editingVacancy.summary,
                                    responsibilities: editingVacancy.responsibilities,
                                    requirements: editingVacancy.requirements,
                                    featured: editingVacancy.featured,
                                    isActive: editingVacancy.isActive,
                                    order: editingVacancy.order,
                                  }}
                                  onChange={(updated) =>
                                    setEditingVacancy({
                                      ...editingVacancy,
                                      ...updated,
                                    })
                                  }
                                  categories={categories}
                                />
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    onClick={handleUpdateVacancy}
                                    disabled={isSavingVacancy}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                                  >
                                    {isSavingVacancy ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Save className="h-4 w-4" />
                                    )}
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={() => {
                                      setExpandedVacancyId(null);
                                      setEditingVacancy(null);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  >
                                    <X className="h-3.5 w-3.5" /> Cancel
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}