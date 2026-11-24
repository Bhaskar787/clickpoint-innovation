"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/confirm-dialog";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Building2,
  Tag,
  Type,
  FileText,
  Link as LinkIcon,
  UploadCloud,
  X,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  FolderGit2,
  ExternalLink,
  Pencil,
  Search,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Star,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { DEFAULT_INDUSTRIES_PAGE_DATA } from "@/data/default-industries-data";
import { SectionNavSidebar, SectionNavItem } from "@/components/admin/dashboard/section-nav-sidebar";
import {
  getCaseStudiesForIndustry,
  caseStudyToIndustryProject,
  syncProjectCategoryUniqueness,
  isProjectMatchingCaseStudy,
} from "@/lib/catalog-sync";
import { IndustryIcon, IndustryIconPicker } from "@/components/ui/industry-icon";

const INDUSTRIES_SECTIONS_CATALOG: SectionNavItem[] = [
  {
    id: "ind-hero",
    number: "01",
    title: "Industries Hero Banner & Headlines",
    desc: "Header badge, main title, and descriptive subtitle for the industries directory.",
    icon: Building2,
    badge: "Hero Banner",
  },
  {
    id: "ind-grid",
    number: "02",
    title: "Industry Sector Cards Manager",
    desc: "Manage domain sectors, routes, subtitles, and card overview summaries.",
    icon: Layers,
    badge: "Sectors Grid",
  },
  {
    id: "ind-details",
    number: "03",
    title: "Individual Industry Detail Pages",
    desc: "Per-industry case studies, compliance badges, metrics, and custom solutions.",
    icon: FolderGit2,
    badge: "Detail Pages",
  },
];

interface FileUploadControlProps {
  label: string;
  value: string;
  accept: string;
  placeholder?: string;
  onChange: (val: string) => void;
  mediaType: "image" | "video";
}

function FileUploadControl({
  label,
  value,
  accept,
  placeholder,
  onChange,
  mediaType,
}: FileUploadControlProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${mediaType} to Cloudinary...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (value) {
        formData.append("previousUrl", value);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        onChange(data.url);
        toast.success(`Successfully uploaded ${mediaType}!`, { id: toastId });
      } else {
        toast.error(data.error || "Failed to upload file", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "https://res.cloudinary.com/... or upload file"}
          className="w-full sm:flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
        />
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
          >
            {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
            <span>{isUploading ? "Uploading..." : "Upload File"}</span>
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Clear URL"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      {value && (
        <div className="relative mt-2 h-24 w-36 sm:w-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}

interface IndustriesPageEditorProps {
  sectionId: string | null;
  onCloseSection?: () => void;
}

export default function IndustriesPageEditor({ sectionId, onCloseSection }: IndustriesPageEditorProps) {
  const { confirm } = useConfirm();
  const [activeSectionId, setActiveSectionId] = useState<string>(sectionId || "ind-hero");
  const [formData, setFormData] = useState<any>(DEFAULT_INDUSTRIES_PAGE_DATA);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>("fintech");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");
  const [editingCatalogIndustry, setEditingCatalogIndustry] = useState<{
    industry: any;
    index?: number;
    isNew: boolean;
  } | null>(null);
  const [editingDetailIndustryId, setEditingDetailIndustryId] = useState<string | null>(null);
  const [detailSearchQuery, setDetailSearchQuery] = useState("");

  // Cross-catalog Portfolio Case Studies State
  const [availableCaseStudies, setAvailableCaseStudies] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [importProjectModalOpen, setImportProjectModalOpen] = useState(false);
  const [targetProjectIndexForSync, setTargetProjectIndexForSync] = useState<number | null>(null);
  const [projectPickerSearch, setProjectPickerSearch] = useState("");
  const [confirmDeleteSectorModal, setConfirmDeleteSectorModal] = useState<{
    industry: any;
    index: number;
    linkedCount: number;
    sampleTitles: string[];
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sectionId) {
      setActiveSectionId(sectionId);
    }
  }, [sectionId]);

  useEffect(() => {
    async function loadIndustriesData() {
      try {
        setIsLoading(true);
        const [indRes, csRes] = await Promise.all([
          fetch("/api/industries"),
          fetch("/api/case-studies").catch(() => null),
        ]);
        const json = await indRes.json();
        let loadedCaseStudies: any[] = [];
        if (csRes && csRes.ok) {
          const csJson = await csRes.json();
          if (csJson.success && csJson.data) {
            loadedCaseStudies = csJson.data.caseStudies || [];
            setAvailableCaseStudies(loadedCaseStudies);
            setAvailableCategories(csJson.data.categories || []);
          }
        }
        if (json.success && json.data) {
          let indData = json.data;
          if (loadedCaseStudies.length > 0 && Array.isArray(indData.industries)) {
            const { industries: synced } = syncProjectCategoryUniqueness(
              loadedCaseStudies,
              indData.industries
            );
            indData = { ...indData, industries: synced };
          }
          setFormData(indData);
          if (indData.industries && indData.industries.length > 0) {
            setSelectedIndustryId(indData.industries[0].id);
          }
        }
      } catch (err: any) {
        toast.error("Failed to load industries content from database.");
      } finally {
        setIsLoading(false);
      }
    }
    loadIndustriesData();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    const toastId = toast.loading("Saving Industries page content to database...");

    try {
      const res = await fetch("/api/industries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Industries page updated successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save industries content.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    const ok = await confirm({
      title: "Reset Industries Content",
      message: "Are you sure you want to reset all Industries content to defaults? This will restore default hero, catalog, and detailed industry pages.",
      confirmText: "Reset to Defaults",
      variant: "warning",
      icon: "refresh",
    });
    if (!ok) return;
    setFormData(DEFAULT_INDUSTRIES_PAGE_DATA);
    if (DEFAULT_INDUSTRIES_PAGE_DATA.industries && DEFAULT_INDUSTRIES_PAGE_DATA.industries.length > 0) {
      setSelectedIndustryId(DEFAULT_INDUSTRIES_PAGE_DATA.industries[0].id);
    }
    const toastId = toast.loading("Resetting industries in database...");
    try {
      const res = await fetch("/api/industries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_INDUSTRIES_PAGE_DATA),
      });
      const json = await res.json();
      if (json.success) {
        toast.info("Reset to default Industries content!", { id: toastId });
      }
    } catch {
      toast.error("Failed to reset content", { id: toastId });
    }
  }

  function handleOpenAddIndustry() {
    const uniqueId = `industry-${Date.now().toString().slice(-4)}`;
    const newInd = {
      id: uniqueId,
      title: "",
      subtitle: "",
      desc: "",
      fullOverview: "",
      heroBadge: "",
      href: `/industries/${uniqueId}`,
      icon: "",
      iconName: "",
      keyMetrics: [],
      complianceBadges: [],
      projects: [],
      solutions: [],
      overviewTag: "",
      overviewHeading: "",
      complianceTag: "",
      complianceHeading: "",
      projectsTag: "",
      projectsHeading: "",
      solutionsTag: "",
      solutionsHeading: "",
    };

    setEditingCatalogIndustry({
      industry: newInd,
      isNew: true,
    });
  }

  function handleOpenEditCatalogIndustry(ind: any, index: number) {
    setEditingCatalogIndustry({
      industry: {
        ...ind,
        icon: ind.icon || ind.iconName || "",
        iconName: ind.iconName || ind.icon || "",
      },
      index,
      isNew: false,
    });
  }

  function handleSaveCatalogIndustryModal() {
    if (!editingCatalogIndustry) return;
    const { industry, isNew, index } = editingCatalogIndustry;
    if (!industry.title?.trim()) {
      toast.error("Please enter an Industry Title");
      return;
    }
    if (!industry.id?.trim()) {
      toast.error("Please enter a unique URL Slug / ID");
      return;
    }

    const cleanSlug = industry.id.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const finalIndustry = {
      ...industry,
      id: cleanSlug,
      href: `/industries/${cleanSlug}`,
    };

    let nextIndustries = [...(formData.industries || [])];
    if (isNew) {
      nextIndustries.push(finalIndustry);
      toast.success(`Industry "${finalIndustry.title}" added to catalog!`);
    } else if (typeof index === "number") {
      nextIndustries[index] = finalIndustry;
      toast.success(`Industry "${finalIndustry.title}" updated!`);
    }

    setFormData({ ...formData, industries: nextIndustries });
    setEditingCatalogIndustry(null);
  }

  function handleInitiateDeleteIndustry(ind: any, index: number) {
    if ((formData.industries?.length || 0) <= 1) {
      toast.error("Cannot delete the only industry in the catalog.");
      return;
    }

    const linked = (availableCaseStudies || []).filter((cs) => {
      return (
        cs.category?.toLowerCase() === ind.title?.toLowerCase() ||
        cs.categoryId === ind.id ||
        cs.categoryId === `cat-${ind.id}`
      );
    });
    const sampleTitles = linked.slice(0, 3).map((cs) => cs.title);

    setConfirmDeleteSectorModal({
      industry: ind,
      index,
      linkedCount: linked.length,
      sampleTitles,
    });
  }

  function handleConfirmDeleteSector() {
    if (!confirmDeleteSectorModal) return;
    const { industry: ind, index, linkedCount } = confirmDeleteSectorModal;

    const updated = formData.industries.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, industries: updated });

    if (selectedIndustryId === ind.id) {
      setSelectedIndustryId(updated[0]?.id || "fintech");
    }
    if (editingDetailIndustryId === ind.id) {
      setEditingDetailIndustryId(null);
    }

    // Safely reassign linked case studies to "General" in client state
    setAvailableCaseStudies((prev) =>
      prev.map((cs) => {
        if (
          cs.category?.toLowerCase() === ind.title?.toLowerCase() ||
          cs.categoryId === ind.id ||
          cs.categoryId === `cat-${ind.id}`
        ) {
          return { ...cs, category: "General", categoryId: null };
        }
        return cs;
      })
    );

    // Remove matching category from available categories in client state
    setAvailableCategories((prev) =>
      prev.filter(
        (c) =>
          c.id !== ind.id &&
          c.id !== `cat-${ind.id}` &&
          c.name?.toLowerCase() !== ind.title?.toLowerCase()
      )
    );

    setConfirmDeleteSectorModal(null);
    toast.success(
      linkedCount > 0
        ? `Deleted sector "${ind.title}" and synced Case Studies catalog. ${linkedCount} project(s) safely moved to "General".`
        : `Deleted industry sector "${ind.title}".`
    );
  }

  function handleMoveIndustry(index: number, direction: "UP" | "DOWN") {
    const list = [...(formData.industries || [])];
    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({ ...formData, industries: list });
  }

  function handleNavigateToIndustryDetail(industryId: string) {
    setSelectedIndustryId(industryId);
    setEditingDetailIndustryId(industryId);
    setActiveSectionId("ind-details");
  }

  function handleBackToDetailDirectory() {
    setEditingDetailIndustryId(null);
  }

  const targetDetailId = editingDetailIndustryId || selectedIndustryId;
  const currentIndustry =
    formData.industries?.find((ind: any) => ind.id === targetDetailId) || formData.industries?.[0];

  const matchingCaseStudies = getCaseStudiesForIndustry(availableCaseStudies, currentIndustry);
  const featuredCaseStudy = matchingCaseStudies.find((cs: any) => cs.featured) || matchingCaseStudies[0];

  function handleAutoFillFeaturedProject() {
    if (!featuredCaseStudy) {
      toast.error(`No case study found for "${currentIndustry?.title || "this sector"}" in the Case Studies catalog.`);
      return;
    }
    const updated = [...formData.industries];
    const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
    if (idx === -1) return;

    const converted = caseStudyToIndustryProject(featuredCaseStudy);
    const existing = [...(updated[idx].projects || [])];

    if (existing.length === 0) {
      existing.push(converted);
    } else {
      existing[0] = {
        ...converted,
        id: existing[0].id || converted.id,
      };
    }

    updated[idx].projects = existing;

    // Enforce 1 project = 1 sector uniqueness: purge from all other sectors
    for (let i = 0; i < updated.length; i++) {
      if (i !== idx && Array.isArray(updated[i].projects)) {
        updated[i].projects = updated[i].projects.filter(
          (p: any) => !isProjectMatchingCaseStudy(p, featuredCaseStudy)
        );
      }
    }

    setFormData({ ...formData, industries: updated });
    toast.success(`Project #1 auto-filled from featured case study "${featuredCaseStudy.title}"!`);
  }

  function handleSelectCaseStudyToImport(cs: any) {
    const updated = [...formData.industries];
    const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
    if (idx === -1) return;

    const converted = caseStudyToIndustryProject(cs);
    const existing = [...(updated[idx].projects || [])];

    if (targetProjectIndexForSync !== null && typeof targetProjectIndexForSync === "number") {
      existing[targetProjectIndexForSync] = {
        ...converted,
        id: existing[targetProjectIndexForSync].id || converted.id,
      };
      toast.success(`Synced Project #${targetProjectIndexForSync + 1} with "${cs.title}"!`);
    } else {
      existing.push(converted);
      toast.success(`Added "${cs.title}" to featured projects!`);
    }

    updated[idx].projects = existing;

    // Enforce 1 project = 1 sector uniqueness: purge from all other sectors
    for (let i = 0; i < updated.length; i++) {
      if (i !== idx && Array.isArray(updated[i].projects)) {
        updated[i].projects = updated[i].projects.filter(
          (p: any) => !isProjectMatchingCaseStudy(p, cs)
        );
      }
    }

    setFormData({ ...formData, industries: updated });
    setImportProjectModalOpen(false);
    setTargetProjectIndexForSync(null);
  }

  async function handleToggleProjectFeatured(pIdx: number) {
    const updated = [...formData.industries];
    const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
    if (idx === -1) return;

    const currentProj = updated[idx].projects[pIdx];
    const nextFeatured = !Boolean(currentProj.featured);
    updated[idx].projects[pIdx] = {
      ...currentProj,
      featured: nextFeatured,
    };
    setFormData({ ...formData, industries: updated });

    toast.success(
      nextFeatured
        ? `"${currentProj.title || `Project #${pIdx + 1}`}" marked as Featured (ON)!`
        : `"${currentProj.title || `Project #${pIdx + 1}`}" unfeatured (OFF).`
    );

    // Cross-Catalog Instant Sync: if linked to a case study, sync directly to Case Studies
    const csId = currentProj.caseStudyId || (currentProj.id?.startsWith("cs-") ? currentProj.id : null);
    if (csId) {
      try {
        await fetch("/api/case-studies", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: csId,
            featured: nextFeatured,
          }),
        });
      } catch (err) {
        console.warn("Background case study sync failed:", err);
      }
    }
  }

  async function handleToggleProjectStatus(pIdx: number) {
    const updated = [...formData.industries];
    const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
    if (idx === -1) return;

    const currentProj = updated[idx].projects[pIdx];
    const currentlyDraft = Boolean(currentProj.isDraft || currentProj.status === "draft");
    const nextDraft = !currentlyDraft;
    updated[idx].projects[pIdx] = {
      ...currentProj,
      isDraft: nextDraft,
      status: nextDraft ? "draft" : "published",
    };
    setFormData({ ...formData, industries: updated });

    toast.success(
      !nextDraft
        ? `"${currentProj.title || `Project #${pIdx + 1}`}" is now Active (Live)!`
        : `"${currentProj.title || `Project #${pIdx + 1}`}" set to Inactive (Draft).`
    );

    // Cross-Catalog Instant Sync: if linked to a case study, sync directly to Case Studies
    const csId = currentProj.caseStudyId || (currentProj.id?.startsWith("cs-") ? currentProj.id : null);
    if (csId) {
      try {
        await fetch("/api/case-studies", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: csId,
            isDraft: nextDraft,
            status: nextDraft ? "draft" : "published",
          }),
        });
      } catch (err) {
        console.warn("Background case study sync failed:", err);
      }
    }
  }

  function handleAddBlankProject() {
    const updated = [...formData.industries];
    const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
    if (idx === -1) return;

    const blank = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      title: "",
      client: "",
      desc: "",
      impact: "",
      liveUrl: "",
      techStack: [],
      imageGradient: "from-violet-600 to-indigo-800",
      featured: false,
      isDraft: true,
      status: "draft",
    };

    const existing = [...(updated[idx].projects || [])];
    existing.push(blank);
    updated[idx].projects = existing;
    setFormData({ ...formData, industries: updated });
    setImportProjectModalOpen(false);
    setTargetProjectIndexForSync(null);
    toast.success(`Added blank custom project to ${currentIndustry.title}!`);
  }

  const filteredCatalogIndustries = (formData.industries || []).filter((ind: any) => {
    if (!catalogSearchQuery.trim()) return true;
    const q = catalogSearchQuery.toLowerCase();
    return (
      ind.title?.toLowerCase().includes(q) ||
      ind.id?.toLowerCase().includes(q) ||
      ind.subtitle?.toLowerCase().includes(q) ||
      ind.desc?.toLowerCase().includes(q)
    );
  });

  const filteredDetailIndustries = (formData.industries || []).filter((ind: any) => {
    if (!detailSearchQuery.trim()) return true;
    const q = detailSearchQuery.toLowerCase();
    return (
      ind.title?.toLowerCase().includes(q) ||
      ind.id?.toLowerCase().includes(q) ||
      ind.heroBadge?.toLowerCase().includes(q) ||
      ind.complianceBadges?.some((b: string) => b.toLowerCase().includes(q)) ||
      ind.projects?.some((p: any) => p.title?.toLowerCase().includes(q) || p.techStack?.some((t: string) => t.toLowerCase().includes(q)))
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-4 sm:p-8 space-y-3">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-violet-600 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center">Loading Industries database record...</p>
      </div>
    );
  }

  const currentSectionMeta =
    INDUSTRIES_SECTIONS_CATALOG.find((s) => s.id === activeSectionId) || INDUSTRIES_SECTIONS_CATALOG[0];
  const SectionIcon = currentSectionMeta.icon || Building2;

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 text-slate-900 dark:text-white">
      {/* 2-Column Master-Detail Selection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Selector */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-4">
          <SectionNavSidebar
            title="Industries Sections"
            sections={INDUSTRIES_SECTIONS_CATALOG}
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
                onClick={handleReset}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-md shadow-violet-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {isSaving ? (
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

          {/* SECTION 1: MAIN HERO BANNER */}
          {activeSectionId === "ind-hero" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-xs sm:text-sm font-bold">Industries Catalog Main Hero Banner</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                Hero Badge Tag
              </label>
              <input
                type="text"
                value={formData.hero.badge}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, badge: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                Hero Main Title
              </label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hero Subtitle Description
              </label>
              <textarea
                rows={2}
                value={formData.hero.subtitle}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INDUSTRY SECTOR CARDS MANAGER - TABULAR FORM */}
      {activeSectionId === "ind-grid" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-5">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  #02
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Industry Sector Cards Manager
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {formData.industries?.length || 0} Total Sectors
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                Manage all industry sector cards displayed on the <span className="font-mono text-violet-600 dark:text-violet-400">/portfolio</span> and <span className="font-mono text-violet-600 dark:text-violet-400">/industries</span> catalog. Reorder items, edit card info in a modal, or jump straight to deep detail configuration.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddIndustry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Industry</span>
              </button>
            </div>
          </div>

          {/* Filter & Live Search Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search sectors by title, slug, subtitle..."
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {catalogSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCatalogSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <span className="text-[11px] font-medium text-slate-500 shrink-0">
              Showing {filteredCatalogIndustries.length} of {formData.industries?.length || 0} sectors
            </span>
          </div>

          {/* Tabular Form of Industry Sectors */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="py-3 px-3 w-16 text-center">Order</th>
                  <th className="py-3 px-3 min-w-[200px]">Sector &amp; Slug</th>
                  <th className="py-3 px-3 min-w-[150px]">Subtitle Badge</th>
                  <th className="py-3 px-3 min-w-[240px]">Card Description Summary</th>
                  <th className="py-3 px-3 min-w-[170px]">Configured Assets</th>
                  <th className="py-3 px-3 text-right min-w-[210px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCatalogIndustries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No industries match your search &quot;{catalogSearchQuery}&quot;
                    </td>
                  </tr>
                ) : (
                  filteredCatalogIndustries.map((ind: any) => {
                    const realIndex = (formData.industries || []).findIndex((i: any) => i.id === ind.id);
                    return (
                      <tr
                        key={ind.id}
                        className={`hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors ${
                          selectedIndustryId === ind.id ? "bg-violet-50/30 dark:bg-violet-950/20" : ""
                        }`}
                      >
                        {/* Order Reorder */}
                        <td className="py-3 px-2 text-center align-middle">
                          <div className="flex items-center justify-center gap-0.5">
                            <span className="font-mono text-[11px] font-bold text-slate-500 w-4">
                              {realIndex + 1}
                            </span>
                            <div className="flex flex-col">
                              <button
                                type="button"
                                disabled={realIndex === 0}
                                onClick={() => handleMoveIndustry(realIndex, "UP")}
                                className="p-0.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 disabled:hover:text-slate-400"
                                title="Move Up"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={realIndex === (formData.industries?.length || 1) - 1}
                                onClick={() => handleMoveIndustry(realIndex, "DOWN")}
                                className="p-0.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 disabled:hover:text-slate-400"
                                title="Move Down"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Title & Slug */}
                        <td className="py-3 px-3 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 border border-violet-200/80 dark:border-violet-900/60 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-300">
                              <IndustryIcon
                                icon={ind.icon}
                                iconName={ind.iconName}
                                industryId={ind.id}
                                className="h-4 w-4"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {ind.title || "Untitled Sector"}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <a
                                  href={`/industries/${ind.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-mono text-[11px] text-violet-600 dark:text-violet-400 hover:underline"
                                >
                                  <span>/industries/{ind.id}</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Subtitle Badge */}
                        <td className="py-3 px-3 align-middle">
                          <span className="inline-block max-w-[150px] truncate px-2 py-0.5 rounded text-[11px] font-medium bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200/50 dark:border-violet-900/50">
                            {ind.subtitle || "No Subtitle"}
                          </span>
                        </td>

                        {/* Summary */}
                        <td className="py-3 px-3 align-middle">
                          <p className="line-clamp-2 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                            {ind.desc || "No description specified."}
                          </p>
                        </td>

                        {/* Configured Assets Badges */}
                        <td className="py-3 px-3 align-middle">
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {ind.keyMetrics?.length || 0} KPIs
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {ind.complianceBadges?.length || 0} Badges
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {ind.projects?.length || 0} Projects
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded border border-violet-200/50 dark:border-violet-900/50 max-w-[180px] truncate" title={ind.cardLinkType === "custom" ? ind.cardCustomUrl : ind.cardLinkType === "project" ? `Project: ${ind.selectedProjectId}` : `/portfolio/${ind.id}`}>
                              <LinkIcon className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">
                                {ind.cardLinkType === "custom"
                                  ? (ind.cardCustomUrl || "Custom URL")
                                  : ind.cardLinkType === "project"
                                  ? `Live: ${ind.selectedProjectId || "First"}`
                                  : `/portfolio/${ind.id}`}
                              </span>
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 align-middle text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCatalogIndustry(ind, realIndex)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors"
                              title="Edit Sector Card"
                            >
                              <Pencil className="h-3 w-3 text-slate-500" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleNavigateToIndustryDetail(ind.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold transition-colors shadow-xs"
                              title="Configure Detail Page (/industries/[id])"
                            >
                              <span>Detail Page</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>

                            {(formData.industries?.length || 0) > 1 && (
                              <button
                                type="button"
                                onClick={() => handleInitiateDeleteIndustry(ind, realIndex)}
                                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                                title="Delete Industry Sector"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Notice */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Tip: To edit the full breakdown (Overview, Compliance, Projects, KPIs, Solutions), click &quot;Detail Page&quot; on any sector.</span>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-xs transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving..." : "Save Industries"}</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: INDIVIDUAL INDUSTRY DETAIL PAGE CONFIGURATOR */}
      {activeSectionId === "ind-details" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-5">
          {editingDetailIndustryId === null ? (
            /* =========================================================================
               TABULAR DIRECTORY OF ALL INDUSTRY DETAIL PAGES
               ========================================================================= */
            <div className="space-y-4">
              {/* Directory Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                      #03
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Individual Industry Detail Pages Directory
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                      {formData.industries?.length || 0} Detail Pages
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                    Directory of deep domain route pages (<span className="font-mono text-violet-600 dark:text-violet-400">/industries/[id]</span>). Click <span className="font-semibold text-slate-700 dark:text-slate-200">&quot;Edit Detail Page&quot;</span> on any row to configure its full overview narrative, compliance protocols, featured case studies, and target solutions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSectionId("ind-grid")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <span>View Sectors Grid (#02)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Filter / Search Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search detail pages by title, slug, hero badge, or compliance..."
                    value={detailSearchQuery}
                    onChange={(e) => setDetailSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {detailSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setDetailSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <span className="text-[11px] font-medium text-slate-500 shrink-0">
                  Showing {filteredDetailIndustries.length} of {formData.industries?.length || 0} industries
                </span>
              </div>

              {/* Tabular Table of Detail Pages */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                      <th className="py-3 px-3 w-12 text-center">#</th>
                      <th className="py-3 px-3 min-w-[210px]">Industry &amp; Route</th>
                      <th className="py-3 px-3 min-w-[150px]">Hero Section Badge</th>
                      <th className="py-3 px-3 min-w-[170px]">Key Metrics (KPIs)</th>
                      <th className="py-3 px-3 min-w-[160px]">Compliance Badges</th>
                      <th className="py-3 px-3 min-w-[130px]">Projects</th>
                      <th className="py-3 px-3 min-w-[130px]">Solutions</th>
                      <th className="py-3 px-3 text-right min-w-[160px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredDetailIndustries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                          No industry detail pages match your query &quot;{detailSearchQuery}&quot;
                        </td>
                      </tr>
                    ) : (
                      filteredDetailIndustries.map((ind: any) => {
                        const realIdx = (formData.industries || []).findIndex((i: any) => i.id === ind.id);
                        return (
                          <tr
                            key={ind.id}
                            className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                          >
                            {/* Number */}
                            <td className="py-3.5 px-3 text-center align-middle font-mono text-[11px] font-bold text-slate-500">
                              {realIdx + 1}
                            </td>

                            {/* Title & Slug */}
                            <td className="py-3.5 px-3 align-middle">
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {ind.title}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <a
                                  href={`/industries/${ind.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-mono text-[11px] text-violet-600 dark:text-violet-400 hover:underline"
                                >
                                  <span>/industries/{ind.id}</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            </td>

                            {/* Hero Badge */}
                            <td className="py-3.5 px-3 align-middle">
                              <span className="inline-block max-w-[140px] truncate px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900/40">
                                {ind.heroBadge || "Custom Practice"}
                              </span>
                            </td>

                            {/* Key Metrics */}
                            <td className="py-3.5 px-3 align-middle">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {ind.keyMetrics && ind.keyMetrics.length > 0 ? (
                                  ind.keyMetrics.slice(0, 3).map((m: any, mIdx: number) => (
                                    <span
                                      key={mIdx}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400"
                                      title={m.label}
                                    >
                                      <span>{m.value}</span>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-400">None</span>
                                )}
                              </div>
                            </td>

                            {/* Compliance Badges */}
                            <td className="py-3.5 px-3 align-middle">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {ind.complianceBadges && ind.complianceBadges.length > 0 ? (
                                  ind.complianceBadges.slice(0, 2).map((b: string, bIdx: number) => (
                                    <span
                                      key={bIdx}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/40"
                                    >
                                      <CheckCircle2 className="h-2.5 w-2.5" />
                                      <span className="truncate max-w-[80px]">{b}</span>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-400">None</span>
                                )}
                                {(ind.complianceBadges?.length || 0) > 2 && (
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    +{(ind.complianceBadges?.length || 0) - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Projects */}
                            <td className="py-3.5 px-3 align-middle">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <FolderGit2 className="h-3 w-3 text-violet-500" />
                                <span>{ind.projects?.length || 0} projects</span>
                              </span>
                            </td>

                            {/* Solutions */}
                            <td className="py-3.5 px-3 align-middle">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                <span>{ind.solutions?.length || 0} solutions</span>
                              </span>
                            </td>

                            {/* Action Button */}
                            <td className="py-3.5 px-3 align-middle text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedIndustryId(ind.id);
                                  setEditingDetailIndustryId(ind.id);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-xs"
                              >
                                <Pencil className="h-3 w-3" />
                                <span>Edit Detail Page</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* =========================================================================
               INDIVIDUAL INDUSTRY DETAIL CONFIGURATOR VIEW (Steps 1 to 6)
               ========================================================================= */
            <div className="space-y-5">
              {/* Top Navigation & Industry Switcher Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={handleBackToDetailDirectory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-all shadow-xs shrink-0"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden sm:inline">Back to All Industries Directory</span>
                    <span className="sm:hidden">Back to Directory</span>
                  </button>
                  <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block shrink-0" />
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs text-slate-500 hidden sm:inline shrink-0">Editing Detail Page:</span>
                    <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 truncate max-w-[200px] md:max-w-[320px]">
                      {currentIndustry.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-xs font-bold text-slate-500 shrink-0">Switch Industry:</label>
                  <select
                    value={selectedIndustryId}
                    onChange={(e) => {
                      setSelectedIndustryId(e.target.value);
                      setEditingDetailIndustryId(e.target.value);
                    }}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    {formData.industries?.map((ind: any) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.title} ({ind.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentIndustry && (
                <div className="space-y-4 sm:space-y-6">
              
              {/* STEP 1: Hero & Media Upload */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-violet-500 shrink-0" />
                    Step 1: Hero Banner & Media (<span className="text-violet-600 truncate max-w-[120px] sm:max-w-none">{currentIndustry.title}</span>)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Hero Badge Tag
                    </label>
                    <input
                      type="text"
                      value={currentIndustry.heroBadge || ""}
                      onChange={(e) => {
                        const updated = [...formData.industries];
                        const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                        if (idx !== -1) updated[idx].heroBadge = e.target.value;
                        setFormData({ ...formData, industries: updated });
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FileUploadControl
                      label="Industry Cloudinary Media Header (Image / Video URL)"
                      value={currentIndustry.imageUrl || ""}
                      accept="image/*"
                      mediaType="image"
                      onChange={(url) => {
                        const updated = [...formData.industries];
                        const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                        if (idx !== -1) updated[idx].imageUrl = url;
                        setFormData({ ...formData, industries: updated });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 1.5: Landing Page Card Selective Link (Single URL) */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <LinkIcon className="h-4 w-4 text-violet-500 shrink-0" />
                    Landing Page Card Selective Link (Only 1 Link Displayed on Homepage)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Controls destination of the sector card on the homepage
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.industries];
                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                      if (idx !== -1) {
                        updated[idx].cardLinkType = "detail";
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-left ${
                      !currentIndustry.cardLinkType || currentIndustry.cardLinkType === "detail"
                        ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                        : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>Portfolio Detail Page</div>
                    <div className="text-[10px] font-mono opacity-80 mt-0.5">/portfolio/{currentIndustry.id}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.industries];
                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                      if (idx !== -1) {
                        updated[idx].cardLinkType = "project";
                        if (!updated[idx].selectedProjectId) {
                          updated[idx].selectedProjectId =
                            updated[idx].projects?.[0]?.id || updated[idx].projects?.[0]?.title;
                        }
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-left ${
                      currentIndustry.cardLinkType === "project"
                        ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                        : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>Featured Live Project</div>
                    <div className="text-[10px] opacity-80 mt-0.5">External live project / demo link</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.industries];
                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                      if (idx !== -1) {
                        updated[idx].cardLinkType = "custom";
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-left ${
                      currentIndustry.cardLinkType === "custom"
                        ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                        : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>Custom URL</div>
                    <div className="text-[10px] opacity-80 mt-0.5">Any custom web address or route</div>
                  </button>
                </div>

                {currentIndustry.cardLinkType === "project" && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Choose Project Live URL
                    </label>
                    {(currentIndustry.projects || []).length > 0 ? (
                      <select
                        value={currentIndustry.selectedProjectId || ""}
                        onChange={(e) => {
                          const updated = [...formData.industries];
                          const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                          if (idx !== -1) {
                            updated[idx].selectedProjectId = e.target.value;
                            setFormData({ ...formData, industries: updated });
                          }
                        }}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                      >
                        {currentIndustry.projects.map((proj: any, pIdx: number) => (
                          <option key={proj.id || pIdx} value={proj.id || proj.title}>
                            {proj.title} {proj.liveUrl ? `(${proj.liveUrl})` : "(No liveUrl set)"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No projects added yet in Step 4.</p>
                    )}
                  </div>
                )}

                {currentIndustry.cardLinkType === "custom" && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Custom Destination URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://... or /services/ai-mvp-development"
                      value={currentIndustry.cardCustomUrl || ""}
                      onChange={(e) => {
                        const updated = [...formData.industries];
                        const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                        if (idx !== -1) {
                          updated[idx].cardCustomUrl = e.target.value;
                          setFormData({ ...formData, industries: updated });
                        }
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Card Action Link Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Default: Explore Sector Solutions"
                    value={currentIndustry.cardCustomLabel || ""}
                    onChange={(e) => {
                      const updated = [...formData.industries];
                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                      if (idx !== -1) {
                        updated[idx].cardCustomLabel = e.target.value;
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* STEP 2: Sector Perspective & Overview */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-violet-500 shrink-0" />
                  Step 2: Sector Perspective & Detailed Overview
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Overview Section Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sector Perspective"
                      value={currentIndustry.overviewTag || ""}
                      onChange={(e) => {
                        const updated = [...formData.industries];
                        const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                        if (idx !== -1) updated[idx].overviewTag = e.target.value;
                        setFormData({ ...formData, industries: updated });
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Overview Main Headline
                    </label>
                    <input
                      type="text"
                      placeholder={currentIndustry.title ? `e.g. Architecting software for ${currentIndustry.title}` : "e.g. Architecting software"}
                      value={currentIndustry.overviewHeading || ""}
                      onChange={(e) => {
                        const updated = [...formData.industries];
                        const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                        if (idx !== -1) updated[idx].overviewHeading = e.target.value;
                        setFormData({ ...formData, industries: updated });
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Full Sector Narrative Overview Paragraph
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detailed sector overview paragraph..."
                      value={currentIndustry.fullOverview || ""}
                      onChange={(e) => {
                        const updated = [...formData.industries];
                        const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                        if (idx !== -1) updated[idx].fullOverview = e.target.value;
                        setFormData({ ...formData, industries: updated });
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: Compliance & Security Badges */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-violet-500 shrink-0" />
                    Step 3: Compliance & Security Badges ({currentIndustry.complianceBadges?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.industries];
                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                      if (idx !== -1) {
                        const badges = updated[idx].complianceBadges || [];
                        updated[idx].complianceBadges = [...badges, ""];
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Badge</span>
                  </button>
                </div>

                {(!currentIndustry.complianceBadges || currentIndustry.complianceBadges.length === 0) ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center">
                    No compliance badges added. Click &ldquo;Add Badge&rdquo; to define security credentials.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {currentIndustry.complianceBadges?.map((badge: string, bIdx: number) => (
                      <div key={bIdx} className="flex items-center gap-2 bg-white dark:bg-[#0b0f19] p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <input
                          type="text"
                          placeholder="e.g. SOC2 Type II"
                          value={badge}
                          onChange={(e) => {
                            const updated = [...formData.industries];
                            const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                            if (idx !== -1) {
                              updated[idx].complianceBadges[bIdx] = e.target.value;
                              setFormData({ ...formData, industries: updated });
                            }
                          }}
                          className="w-full bg-transparent text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.industries];
                            const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                            if (idx !== -1) {
                              updated[idx].complianceBadges = updated[idx].complianceBadges.filter((_: any, i: number) => i !== bIdx);
                              setFormData({ ...formData, industries: updated });
                            }
                          }}
                          className="text-red-400 hover:text-red-600 p-1 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* STEP 4: Featured Case Studies & Live Projects */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <FolderGit2 className="h-4 w-4 text-violet-500 shrink-0" />
                      Step 4: Featured Projects ({currentIndustry.projects?.length || 0})
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Showcase live projects and case studies for this industry sector.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetProjectIndexForSync(null);
                        setProjectPickerSearch("");
                        setImportProjectModalOpen(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>

                {/* Prominent Cross-Catalog Featured Link Banner */}
                {featuredCaseStudy && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800/60 text-xs">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-violet-600 text-white shrink-0 mt-0.5 sm:mt-0">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Portfolio Catalog Linked:
                          </span>
                          <span className="font-extrabold text-violet-700 dark:text-violet-300">
                            {featuredCaseStudy.title}
                          </span>
                          {featuredCaseStudy.featured && (
                            <span
                              className="inline-flex items-center justify-center p-1 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-500 border border-amber-300 dark:border-amber-800 shadow-2xs"
                              title="Featured"
                            >
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {featuredCaseStudy.client} • {featuredCaseStudy.impact || "High Impact Results"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoFillFeaturedProject}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-violet-300 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-[11px] transition-colors shadow-2xs shrink-0 cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3 text-violet-500" />
                      <span>Auto-Fill / Re-Sync Project #1</span>
                    </button>
                  </div>
                )}

                {(!currentIndustry.projects || currentIndustry.projects.length === 0) ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
                    <FolderGit2 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      No featured projects added to this industry yet.
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Click &ldquo;Add Project&rdquo; to select a case study or add a blank project.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentIndustry.projects.map((proj: any, pIdx: number) => (
                      <div key={proj.id || pIdx} className="p-3 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase text-violet-600 bg-violet-50 dark:bg-violet-950 px-2 py-0.5 rounded">
                              Project #{pIdx + 1}
                            </span>
                            {pIdx === 0 && featuredCaseStudy && (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                                Primary Featured Slot
                              </span>
                            )}
                            {/* Live vs Draft Status Pill */}
                            {(() => {
                              const isDraft = Boolean(proj.isDraft || proj.status === "draft");
                              return isDraft ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-800/60">
                                  <AlertCircle className="h-2.5 w-2.5 text-amber-500" />
                                  <span>Draft (Inactive)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-800/60">
                                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                  <span>Active (Live)</span>
                                </span>
                              );
                            })()}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Featured Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleProjectFeatured(pIdx)}
                              className={`inline-flex items-center justify-center p-2 rounded-md border transition-all cursor-pointer ${
                                proj.featured
                                  ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:hover:bg-amber-900/90 dark:text-amber-300 dark:border-amber-700 shadow-2xs"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-400 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-500 dark:border-slate-700"
                              }`}
                              title={
                                proj.featured
                                  ? "Featured: ON (Click to turn OFF / Unfeature)"
                                  : "Featured: OFF (Click to turn ON / Feature this project)"
                              }
                            >
                              <Star
                                className={`h-3.5 w-3.5 ${
                                  proj.featured ? "fill-amber-500 text-amber-500" : "text-slate-400"
                                }`}
                              />
                            </button>

                            {/* Active / Inactive Status Toggle Button */}
                            {(() => {
                              const isDraft = Boolean(proj.isDraft || proj.status === "draft");
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleToggleProjectStatus(pIdx)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                    !isDraft
                                      ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:hover:bg-emerald-900/90 dark:text-emerald-300 dark:border-emerald-700 shadow-2xs"
                                      : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/70 dark:hover:bg-amber-900/80 dark:text-amber-300 dark:border-amber-800"
                                  }`}
                                  title={
                                    !isDraft
                                      ? "Status: Active / Live (Click to set Inactive / Draft)"
                                      : "Status: Inactive / Draft (Click to set Active / Live)"
                                  }
                                >
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      !isDraft ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                                    }`}
                                  />
                                  <span>{!isDraft ? "Active" : "Draft (Off)"}</span>
                                </button>
                              );
                            })()}

                            {/* Set as Landing Card Link Button */}
                            {proj.liveUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...formData.industries];
                                  const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                  if (idx !== -1) {
                                    const isCurrentSelected =
                                      updated[idx].cardLinkType === "project" &&
                                      (updated[idx].selectedProjectId === (proj.id || proj.title));
                                    if (isCurrentSelected) {
                                      updated[idx].cardLinkType = "detail";
                                      updated[idx].selectedProjectId = undefined;
                                      toast.success("Card link reset to Sector Detail Page");
                                    } else {
                                      updated[idx].cardLinkType = "project";
                                      updated[idx].selectedProjectId = proj.id || proj.title;
                                      toast.success(`Homepage card link set to ${proj.title}`);
                                    }
                                    setFormData({ ...formData, industries: updated });
                                  }
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                                  currentIndustry.cardLinkType === "project" &&
                                  (currentIndustry.selectedProjectId === (proj.id || proj.title))
                                    ? "bg-violet-600 text-white border-violet-600 shadow-2xs"
                                    : "text-violet-600 dark:text-violet-400 bg-violet-50/70 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800 hover:bg-violet-100"
                                }`}
                                title="Set this project URL as the single link displayed on the landing page card"
                              >
                                <LinkIcon className="h-3 w-3" />
                                <span>
                                  {currentIndustry.cardLinkType === "project" &&
                                  (currentIndustry.selectedProjectId === (proj.id || proj.title))
                                    ? "Card Link (Selected)"
                                    : "Set as Card Link"}
                                </span>
                              </button>
                            )}

                            {matchingCaseStudies.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetProjectIndexForSync(pIdx);
                                  setProjectPickerSearch("");
                                  setImportProjectModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/60 border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer"
                                title="Sync or replace details from an existing case study"
                              >
                                <FolderGit2 className="h-3 w-3" />
                                <span>Sync</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].projects = updated[idx].projects.filter((_: any, i: number) => i !== pIdx);
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500">Project Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Real-Time Trading Engine"
                              value={proj.title || ""}
                              onChange={(e) => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].projects[pIdx].title = e.target.value;
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs text-slate-900 dark:text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-slate-500">Client Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Apex Global Markets"
                              value={proj.client || ""}
                              onChange={(e) => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].projects[pIdx].client = e.target.value;
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-slate-500">Impact Metric Statement</label>
                            <input
                              type="text"
                              placeholder="e.g. $10M+ Cost Saved"
                              value={proj.impact || ""}
                              onChange={(e) => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].projects[pIdx].impact = e.target.value;
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-bold text-slate-500">Description</label>
                            <input
                              type="text"
                              placeholder="Deliverables and architecture summary..."
                              value={proj.desc || ""}
                              onChange={(e) => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].projects[pIdx].desc = e.target.value;
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-slate-500">Live URL</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={proj.liveUrl || ""}
                              onChange={(e) => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].projects[pIdx].liveUrl = e.target.value;
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs font-mono text-violet-600 dark:text-violet-400"
                            />
                          </div>

                        {/* Tech Stack Badges Management */}
                        <div className="sm:col-span-3 space-y-2 pt-3 mt-1 border-t border-slate-200/80 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                              <Tag className="h-3 w-3 text-violet-500" />
                              <span>Tech Stack Badges ({proj.techStack?.length || 0})</span>
                            </label>
                            <span className="text-[10px] text-slate-400">
                              Type tag & press Enter or comma
                            </span>
                          </div>

                          {/* Existing Badges List */}
                          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-slate-800 min-h-[36px]">
                            {proj.techStack && proj.techStack.length > 0 ? (
                              proj.techStack.map((tech: string, tIdx: number) => (
                                <span
                                  key={tIdx}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white dark:bg-[#131c31] text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 shadow-2xs"
                                >
                                  <span>{tech}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formData.industries];
                                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                      if (idx !== -1) {
                                        const currentStack = updated[idx].projects[pIdx].techStack || [];
                                        updated[idx].projects[pIdx].techStack = currentStack.filter((_: string, i: number) => i !== tIdx);
                                        setFormData({ ...formData, industries: updated });
                                        toast.success(`Removed "${tech}"`);
                                      }
                                    }}
                                    className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                                    title={`Remove ${tech}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400 italic font-medium px-1">
                                No tech stack tags added yet. Add tags below (e.g. Next.js, Python, Plaid API).
                              </span>
                            )}
                          </div>

                          {/* Add New Tech Stack Tag Input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Add tech stack tag (e.g. Next.js, TypeScript, Python, Plaid API)..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === ",") {
                                  e.preventDefault();
                                  const val = (e.target as HTMLInputElement).value.trim().replace(/,/g, "");
                                  if (val) {
                                    const updated = [...formData.industries];
                                    const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                    if (idx !== -1) {
                                      const currentStack = updated[idx].projects[pIdx].techStack || [];
                                      if (!currentStack.includes(val)) {
                                        updated[idx].projects[pIdx].techStack = [...currentStack, val];
                                        setFormData({ ...formData, industries: updated });
                                        (e.target as HTMLInputElement).value = "";
                                        toast.success(`Added tag "${val}"`);
                                      } else {
                                        toast.error(`"${val}" already exists`);
                                      }
                                    }
                                  }
                                }
                              }}
                              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                if (input) {
                                  const val = input.value.trim().replace(/,/g, "");
                                  if (val) {
                                    const updated = [...formData.industries];
                                    const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                    if (idx !== -1) {
                                      const currentStack = updated[idx].projects[pIdx].techStack || [];
                                      if (!currentStack.includes(val)) {
                                        updated[idx].projects[pIdx].techStack = [...currentStack, val];
                                        setFormData({ ...formData, industries: updated });
                                        input.value = "";
                                        toast.success(`Added tag "${val}"`);
                                      } else {
                                        toast.error(`"${val}" already exists`);
                                      }
                                    }
                                  }
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Tag</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

              {/* STEP 5: Key Performance Metrics */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-violet-500 shrink-0" />
                    Step 5: Key Performance Metrics ({currentIndustry.keyMetrics?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.industries];
                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                      if (idx !== -1) {
                        const metrics = updated[idx].keyMetrics || [];
                        updated[idx].keyMetrics = [
                          ...metrics,
                          { label: "", value: "" },
                        ];
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Metric</span>
                  </button>
                </div>

                {(!currentIndustry.keyMetrics || currentIndustry.keyMetrics.length === 0) ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center">
                    No key performance metrics added. Click &ldquo;Add Metric&rdquo; to define KPI statistics.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentIndustry.keyMetrics?.map((metric: any, mIdx: number) => (
                      <div key={mIdx} className="p-3 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-violet-600">Metric #{mIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.industries];
                              const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                              if (idx !== -1) {
                                updated[idx].keyMetrics = updated[idx].keyMetrics.filter((_: any, i: number) => i !== mIdx);
                                setFormData({ ...formData, industries: updated });
                              }
                            }}
                            className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500">Metric Value</label>
                          <input
                            type="text"
                            placeholder="e.g. 99.9%"
                            value={metric.value || ""}
                            onChange={(e) => {
                              const updated = [...formData.industries];
                              const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                              if (idx !== -1) {
                                updated[idx].keyMetrics[mIdx].value = e.target.value;
                                setFormData({ ...formData, industries: updated });
                              }
                            }}
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs font-bold text-violet-600 dark:text-violet-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500">Metric Label</label>
                          <input
                            type="text"
                            placeholder="e.g. Uptime SLA"
                            value={metric.label || ""}
                            onChange={(e) => {
                              const updated = [...formData.industries];
                              const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                              if (idx !== -1) {
                                updated[idx].keyMetrics[mIdx].label = e.target.value;
                                setFormData({ ...formData, industries: updated });
                              }
                            }}
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* STEP 6: Target Solutions */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0" />
                    Step 6: Target Engineering Solutions ({currentIndustry.solutions?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.industries];
                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                      if (idx !== -1) {
                        const sols = updated[idx].solutions || [];
                        updated[idx].solutions = [
                          ...sols,
                          { title: "", desc: "" },
                        ];
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Solution</span>
                  </button>
                </div>

                {(!currentIndustry.solutions || currentIndustry.solutions.length === 0) ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center">
                    No domain solutions added. Click &ldquo;Add Solution&rdquo; to specify target engineering capabilities.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentIndustry.solutions?.map((sol: any, sIdx: number) => {
                      const solTitle = typeof sol === "string" ? sol : sol.title || "";
                      const solDesc = typeof sol === "string" ? "" : sol.desc || "";

                      return (
                        <div key={sIdx} className="p-3 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-violet-600">Solution #{sIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].solutions = updated[idx].solutions.filter((_: any, i: number) => i !== sIdx);
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-slate-500">Solution Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Real-Time Fraud Prevention"
                              value={solTitle}
                              onChange={(e) => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].solutions[sIdx] = {
                                    title: e.target.value,
                                    desc: solDesc,
                                  };
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs text-slate-900 dark:text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-slate-500">Solution Description</label>
                            <input
                              type="text"
                              placeholder="Describe this solution capability..."
                              value={solDesc}
                              onChange={(e) => {
                                const updated = [...formData.industries];
                                const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                                if (idx !== -1) {
                                  updated[idx].solutions[sIdx] = {
                                    title: solTitle,
                                    desc: e.target.value,
                                  };
                                  setFormData({ ...formData, industries: updated });
                                }
                              }}
                              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs text-slate-900 dark:text-white"
                            />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            </div>
          )}

          {/* Bottom Back Button & Save Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleBackToDetailDirectory}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to All Industries Directory</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving Changes..." : "Save All Industries Changes"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )}

  {/* POPUP MODAL: ADD / EDIT CATALOG INDUSTRY CARD */}
  {mounted && typeof window !== "undefined" && editingCatalogIndustry && createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingCatalogIndustry.isNew ? "Add New Industry Sector" : "Edit Industry Sector Card"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {editingCatalogIndustry.isNew
                  ? "Create a new sector card for the /portfolio & /industries grid"
                  : `Route: /industries/${editingCatalogIndustry.industry.id}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditingCatalogIndustry(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Industry Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Fintech & Financial Systems"
                value={editingCatalogIndustry.industry.title}
                onChange={(e) =>
                  setEditingCatalogIndustry({
                    ...editingCatalogIndustry,
                    industry: { ...editingCatalogIndustry.industry, title: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                URL Slug / ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. fintech"
                value={editingCatalogIndustry.industry.id}
                onChange={(e) =>
                  setEditingCatalogIndustry({
                    ...editingCatalogIndustry,
                    industry: {
                      ...editingCatalogIndustry.industry,
                      id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-mono font-bold text-violet-600 dark:text-violet-400"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                Preview: /industries/{editingCatalogIndustry.industry.id || "slug"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subtitle Badge Tag
            </label>
            <input
              type="text"
              placeholder="e.g. AI-Powered Payments, Banking & Automated Ledger Intelligence"
              value={editingCatalogIndustry.industry.subtitle || ""}
              onChange={(e) =>
                setEditingCatalogIndustry({
                  ...editingCatalogIndustry,
                  industry: { ...editingCatalogIndustry.industry, subtitle: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Catalog Card Summary Description
            </label>
            <textarea
              rows={3}
              placeholder="Summary of the industry sector displayed on catalog cards..."
              value={editingCatalogIndustry.industry.desc || ""}
              onChange={(e) =>
                setEditingCatalogIndustry({
                  ...editingCatalogIndustry,
                  industry: { ...editingCatalogIndustry.industry, desc: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Dynamic Industry Sector Icon Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Sector Domain Icon (React / Bootstrap Icons)
            </label>
            <IndustryIconPicker
              value={editingCatalogIndustry.industry.icon || editingCatalogIndustry.industry.iconName || ""}
              onChange={(iconId) =>
                setEditingCatalogIndustry({
                  ...editingCatalogIndustry,
                  industry: {
                    ...editingCatalogIndustry.industry,
                    icon: iconId,
                    iconName: iconId,
                  },
                })
              }
              industryId={editingCatalogIndustry.industry.id}
              industryTitle={editingCatalogIndustry.industry.title}
            />
          </div>

          {/* Landing Page Card Selective URL / Link Configuration */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span>Landing Page Card Link (Single Selective URL)</span>
              </label>
              <span className="text-[10px] font-semibold text-slate-400">
                Only 1 link shown per card
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditingCatalogIndustry({
                    ...editingCatalogIndustry,
                    industry: {
                      ...editingCatalogIndustry.industry,
                      cardLinkType: "detail",
                    },
                  })
                }
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  !editingCatalogIndustry.industry.cardLinkType ||
                  editingCatalogIndustry.industry.cardLinkType === "detail"
                    ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                    : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                Portfolio Page
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingCatalogIndustry({
                    ...editingCatalogIndustry,
                    industry: {
                      ...editingCatalogIndustry.industry,
                      cardLinkType: "project",
                      selectedProjectId:
                        editingCatalogIndustry.industry.selectedProjectId ||
                        editingCatalogIndustry.industry.projects?.[0]?.id ||
                        editingCatalogIndustry.industry.projects?.[0]?.title,
                    },
                  })
                }
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  editingCatalogIndustry.industry.cardLinkType === "project"
                    ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                    : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                Live Project
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingCatalogIndustry({
                    ...editingCatalogIndustry,
                    industry: {
                      ...editingCatalogIndustry.industry,
                      cardLinkType: "custom",
                    },
                  })
                }
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  editingCatalogIndustry.industry.cardLinkType === "custom"
                    ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                    : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                Custom URL
              </button>
            </div>

            {/* If Project selected */}
            {editingCatalogIndustry.industry.cardLinkType === "project" && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Select Project Live Link
                </label>
                {(editingCatalogIndustry.industry.projects || []).length > 0 ? (
                  <select
                    value={editingCatalogIndustry.industry.selectedProjectId || ""}
                    onChange={(e) =>
                      setEditingCatalogIndustry({
                        ...editingCatalogIndustry,
                        industry: {
                          ...editingCatalogIndustry.industry,
                          selectedProjectId: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {editingCatalogIndustry.industry.projects.map((proj: any, pIdx: number) => (
                      <option key={proj.id || pIdx} value={proj.id || proj.title}>
                        {proj.title} {proj.liveUrl ? `(${proj.liveUrl})` : "(No live URL set)"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No projects added to this industry yet. Add a project in the Detail Page editor first.
                  </p>
                )}
              </div>
            )}

            {/* If Custom selected */}
            {editingCatalogIndustry.industry.cardLinkType === "custom" && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Custom Destination URL
                </label>
                <input
                  type="text"
                  placeholder="https://... or /services/ai-mvp-development"
                  value={editingCatalogIndustry.industry.cardCustomUrl || ""}
                  onChange={(e) =>
                    setEditingCatalogIndustry({
                      ...editingCatalogIndustry,
                      industry: {
                        ...editingCatalogIndustry.industry,
                        cardCustomUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            )}

            {/* Custom Link Label / Button Text */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Card Action Link Label (Optional)
              </label>
              <input
                type="text"
                placeholder="Default: Explore Sector Solutions"
                value={editingCatalogIndustry.industry.cardCustomLabel || ""}
                onChange={(e) =>
                  setEditingCatalogIndustry({
                    ...editingCatalogIndustry,
                    industry: {
                      ...editingCatalogIndustry.industry,
                      cardCustomLabel: e.target.value,
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-xl border border-dashed border-violet-300 dark:border-violet-900/60 bg-violet-50/30 dark:bg-violet-950/20 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 block">
              Landing Page Card Live Preview
            </span>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100/80 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100/50 dark:border-slate-700 shadow-xs">
                  <IndustryIcon
                    icon={editingCatalogIndustry.industry.icon}
                    iconName={editingCatalogIndustry.industry.iconName}
                    industryId={editingCatalogIndustry.industry.id}
                    className="h-5 w-5 text-violet-600 dark:text-violet-300"
                  />
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/10 text-violet-600">
                  {editingCatalogIndustry.industry.subtitle || "Industry Subtitle"}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingCatalogIndustry.industry.title || "Industry Title Preview"}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {editingCatalogIndustry.industry.desc || "Sector description preview will appear here..."}
              </p>

              {/* Capability Pills Preview */}
              {(() => {
                const rawTags: string[] = (
                  editingCatalogIndustry.industry.cardTags && editingCatalogIndustry.industry.cardTags.length > 0
                    ? editingCatalogIndustry.industry.cardTags
                    : editingCatalogIndustry.industry.solutions && editingCatalogIndustry.industry.solutions.length > 0
                    ? editingCatalogIndustry.industry.solutions.map((s: any) => (typeof s === "string" ? s : s.title))
                    : (editingCatalogIndustry.industry.projects || []).map((p: any) => p.title)
                ).filter(Boolean);

                const displayTags = rawTags.slice(0, 2);
                const remaining = Math.max(0, rawTags.length - 2);

                if (displayTags.length === 0) return null;

                return (
                  <div className="space-y-1.5 pt-1">
                    {displayTags[0] && (
                      <div>
                        <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                          {displayTags[0]}
                        </span>
                      </div>
                    )}
                    {displayTags[1] && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                          {displayTags[1]}
                        </span>
                        {remaining > 0 && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            +{remaining}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Single Selective Link Preview */}
              {(() => {
                const ind = editingCatalogIndustry.industry;
                let previewUrl = `/portfolio/${ind.id || "slug"}`;
                let previewLabel = ind.cardCustomLabel || "Explore Sector Solutions";

                if (ind.cardLinkType === "custom" && ind.cardCustomUrl) {
                  previewUrl = ind.cardCustomUrl;
                } else if (ind.cardLinkType === "project") {
                  const proj = ind.projects?.find((p: any) => p.id === ind.selectedProjectId || p.title === ind.selectedProjectId) || ind.projects?.[0];
                  if (proj?.liveUrl) {
                    previewUrl = proj.liveUrl;
                    if (!ind.cardCustomLabel) previewLabel = `View ${proj.title || "Project"}`;
                  }
                }

                return (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">
                      <span>{previewLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                      {previewUrl}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setEditingCatalogIndustry(null)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!editingCatalogIndustry.isNew && (
              <button
                type="button"
                onClick={() => {
                  const indId = editingCatalogIndustry.industry.id;
                  handleSaveCatalogIndustryModal();
                  handleNavigateToIndustryDetail(indId);
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-violet-500/50 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-xs font-bold transition-colors"
              >
                <span>Save &amp; Go to Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveCatalogIndustryModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{editingCatalogIndustry.isNew ? "Add Industry to Catalog" : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )}

  {/* MODAL: ADD / IMPORT PROJECT FROM CASE STUDIES */}
  {mounted && typeof window !== "undefined" && importProjectModalOpen && createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/10 text-violet-600 dark:text-violet-400">
              <FolderGit2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {targetProjectIndexForSync !== null
                  ? `Sync Project #${targetProjectIndexForSync + 1} from Case Studies`
                  : `Add Featured Project: ${currentIndustry?.title}`}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose an existing case study from the portfolio catalog ({matchingCaseStudies.length} in this category), or create a custom project manually.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setImportProjectModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Quick Manual Add Button Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Need a custom enterprise project not in the catalog?
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                You can add a blank project card and fill in the details manually.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBlankProject}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Project Manually</span>
            </button>
          </div>

          {/* Section: Category Case Studies */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                Case Studies in &quot;{currentIndustry?.title}&quot; ({matchingCaseStudies.length})
              </span>
              {matchingCaseStudies.length > 2 && (
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter case studies..."
                    value={projectPickerSearch}
                    onChange={(e) => setProjectPickerSearch(e.target.value)}
                    className="w-full pl-7 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {matchingCaseStudies.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <FolderGit2 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  No case studies created under &quot;{currentIndustry?.title}&quot; yet.
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  You can create case studies in the Case Studies Page, or click &quot;Add Custom Project Manually&quot; above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {matchingCaseStudies
                  .filter((cs) => {
                    if (!projectPickerSearch.trim()) return true;
                    const q = projectPickerSearch.toLowerCase();
                    return (
                      cs.title?.toLowerCase().includes(q) ||
                      cs.client?.toLowerCase().includes(q) ||
                      cs.impact?.toLowerCase().includes(q) ||
                      cs.techStack?.some((t: string) => t.toLowerCase().includes(q))
                    );
                  })
                  .map((cs) => {
                    const isFeatured = Boolean(cs.featured);
                    return (
                      <div
                        key={cs.id || cs.slug}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] hover:border-violet-400 dark:hover:border-violet-600/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                              {cs.title}
                            </h4>
                            {isFeatured && (
                              <span
                                className="inline-flex items-center justify-center p-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-500 border border-amber-200 dark:border-amber-800/50"
                                title="Featured"
                              >
                                <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {cs.client || "Client"}
                            </span>
                            {cs.impact && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                                {cs.impact}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {cs.description}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {(cs.techStack || []).slice(0, 5).map((t: string, i: number) => (
                              <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectCaseStudyToImport(cs)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{targetProjectIndexForSync !== null ? "Sync to This Slot" : "Import Project"}</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setImportProjectModalOpen(false)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

  {/* =========================================================================
     CROSS-CATALOG INDUSTRY SECTOR DELETE CONFIRMATION MODAL
     ========================================================================= */}
  {mounted && typeof window !== "undefined" && confirmDeleteSectorModal && createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Delete Industry Sector & Category?
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
              Cross-catalog synchronization & data safety notice
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p>
            You are about to delete industry sector <strong className="text-slate-900 dark:text-white">"{confirmDeleteSectorModal.industry.title}"</strong> (`/industries/{confirmDeleteSectorModal.industry.id}`). This will remove the sector card, detail route, and matching Case Studies portfolio category.
          </p>

          {confirmDeleteSectorModal.linkedCount > 0 ? (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{confirmDeleteSectorModal.linkedCount} Case Study Project(s) Linked</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                To protect your data and prevent broken links, all {confirmDeleteSectorModal.linkedCount} project(s) will be automatically and safely reassigned to the <strong>"General"</strong> category:
              </p>
              {confirmDeleteSectorModal.sampleTitles.length > 0 && (
                <ul className="list-disc list-inside text-[11px] text-amber-900 dark:text-amber-200 font-mono space-y-0.5">
                  {confirmDeleteSectorModal.sampleTitles.map((t, idx) => (
                    <li key={idx} className="truncate">{t}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-slate-500 italic">
              No case studies are currently assigned to this industry sector.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setConfirmDeleteSectorModal(null)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDeleteSector}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Confirm & Delete Everywhere</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

        </div>
      </div>
    </div>
  );
}