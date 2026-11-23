"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/confirm-dialog";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Tag,
  Type,
  FileText,
  Link as LinkIcon,
  UploadCloud,
  X,
  Loader2,
  Layers,
  FolderGit2,
  ExternalLink,
  TrendingUp,
  FolderPlus,
  Image as ImageIcon,
  Quote,
  Star,
  Pencil,
  Search,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Globe,
  Sparkles,
  Check,
  Building2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import {
  DEFAULT_CASE_STUDIES_PAGE_DATA,
  DEFAULT_CASE_STUDY_CATEGORIES,
  DEFAULT_CASE_STUDIES_ITEMS,
} from "@/data/default-case-studies-data";
import { SectionNavSidebar, SectionNavItem } from "@/components/admin/dashboard/section-nav-sidebar";

const CASE_STUDIES_SECTIONS_CATALOG: SectionNavItem[] = [
  {
    id: "cs-hero",
    number: "01",
    title: "Hero Banner & Headlines",
    desc: "Header badge, main title, orange highlight title, and descriptive subtitle.",
    icon: Type,
    badge: "Hero Banner",
  },
  {
    id: "cs-stats",
    number: "02",
    title: "Impact Highlights Bar (4 Stats)",
    desc: "Key quantitative performance statistics and enterprise metric indicators.",
    icon: TrendingUp,
    badge: "Impact Stats",
  },
  {
    id: "cs-categories",
    number: "03",
    title: "Dynamic Portfolio Categories",
    desc: "Create and manage sector filter categories for client case studies.",
    icon: FolderPlus,
    badge: "Categories",
  },
  {
    id: "cs-items",
    number: "04",
    title: "Case Studies Items Manager",
    desc: "Manage client projects, live URLs, summaries, impacts, and tech stack tags.",
    icon: FolderGit2,
    badge: "Case Studies",
  },
  {
    id: "cs-architecture",
    number: "05",
    title: "Deep Architecture & Benchmarks",
    desc: "System metrics, 4-tier system pipeline steps, and enterprise benchmark bars.",
    icon: Layers,
    badge: "Architecture",
  },
  {
    id: "cs-testimonials",
    number: "06",
    title: "Executive Endorsements & Reviews",
    desc: "Headline titles and client testimonial selectors for case study showcase.",
    icon: Quote,
    badge: "Testimonials",
  },
];

interface FileUploadControlProps {
  label: string;
  value: string;
  accept: string;
  onChange: (url: string) => void;
}

function FileUploadControl({ label, value, accept, onChange }: FileUploadControlProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        onChange(json.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(json.error || "Failed to upload file");
      }
    } catch {
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or upload image file..."
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shrink-0"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <UploadCloud className="h-3.5 w-3.5" />
          )}
          <span>Upload</span>
        </button>
      </div>

      {value && (
        <div className="relative mt-2 h-24 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#080b11]">
          <img src={value} alt="Preview" className="h-full w-full object-contain" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

interface CaseStudiesEditorProps {
  sectionId?: string | null;
  onCloseSection?: () => void;
}

export default function CaseStudiesEditor({ sectionId, onCloseSection }: CaseStudiesEditorProps = {}) {
  const { confirm } = useConfirm();
  const [activeSectionId, setActiveSectionId] = useState<string>(sectionId || "cs-hero");
  const [pageContent, setPageContent] = useState<any>(DEFAULT_CASE_STUDIES_PAGE_DATA);
  const [categories, setCategories] = useState<any[]>(DEFAULT_CASE_STUDY_CATEGORIES);
  const [caseStudies, setCaseStudies] = useState<any[]>(DEFAULT_CASE_STUDIES_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [allTestimonials, setAllTestimonials] = useState<any[]>([]);

  // Section #03: Category Manager Tabular State
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<{
    isNew: boolean;
    index: number;
    category: any;
  } | null>(null);
  const [confirmDeleteCategoryModal, setConfirmDeleteCategoryModal] = useState<{
    id: string;
    name: string;
    linkedCount: number;
    sampleTitles: string[];
  } | null>(null);

  // Section #04: Case Studies Items Manager Tabular State
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [itemCategoryFilter, setItemCategoryFilter] = useState("ALL");
  const [editingCaseStudy, setEditingCaseStudy] = useState<{
    isNew: boolean;
    index: number;
    study: any;
  } | null>(null);
  const [newTechTag, setNewTechTag] = useState("");
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
    async function loadData() {
      try {
        setIsLoading(true);
        const [resCase, resTesti] = await Promise.all([
          fetch("/api/case-studies"),
          fetch("/api/testimonials?includePending=true"),
        ]);

        const jsonCase = await resCase.json();
        if (jsonCase.success && jsonCase.data) {
          if (jsonCase.data.pageContent) setPageContent(jsonCase.data.pageContent);
          if (jsonCase.data.categories) setCategories(jsonCase.data.categories);
          if (jsonCase.data.caseStudies) setCaseStudies(jsonCase.data.caseStudies);
        }

        const jsonTesti = await resTesti.json();
        if (jsonTesti.success && jsonTesti.data?.testimonials) {
          setAllTestimonials(jsonTesti.data.testimonials);
        }
      } catch {
        toast.error("Failed to load case studies content from database.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Case Studies content & categories to database...");

    try {
      const res = await fetch("/api/case-studies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageContent,
          categories,
          caseStudies,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Case Studies page & portfolio saved successfully!", { id: toastId });
        if (json.data) {
          if (json.data.pageContent) setPageContent(json.data.pageContent);
          if (json.data.categories) setCategories(json.data.categories);
          if (json.data.caseStudies) setCaseStudies(json.data.caseStudies);
        }
      } else {
        toast.error(json.error || "Failed to save content.", { id: toastId });
      }
    } catch {
      toast.error("Failed to save content.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================================
  // SECTION #03: CATEGORY MANAGER HELPERS
  // =========================================================================
  const filteredCategories = categories.filter((cat) => {
    if (!categorySearchQuery.trim()) return true;
    const q = categorySearchQuery.toLowerCase().trim();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q)
    );
  });

  const handleMoveCategory = (index: number, direction: "UP" | "DOWN") => {
    const target = direction === "UP" ? index - 1 : index + 1;
    if (target < 0 || target >= categories.length) return;
    const updated = [...categories];
    const [item] = updated.splice(index, 1);
    updated.splice(target, 0, item);
    setCategories(updated);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory({
      isNew: true,
      index: -1,
      category: {
        id: `cat-${Date.now()}`,
        name: "",
        description: "",
        order: categories.length + 1,
      },
    });
  };

  const handleOpenEditCategory = (cat: any, realIndex: number) => {
    setEditingCategory({
      isNew: false,
      index: realIndex,
      category: { ...cat },
    });
  };

  const handleSaveCategoryModal = () => {
    if (!editingCategory) return;
    const cat = editingCategory.category;
    const trimmed = (cat.name || "").trim();
    if (!trimmed) {
      toast.error("Category name is required");
      return;
    }

    if (editingCategory.isNew) {
      if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
        toast.error(`Category "${trimmed}" already exists`);
        return;
      }
      const newCat = {
        ...cat,
        id: cat.id || `cat-${Date.now()}`,
        name: trimmed,
        order: categories.length + 1,
      };
      setCategories([...categories, newCat]);
      toast.success(`Category "${trimmed}" created!`);
    } else {
      const updated = [...categories];
      const oldName = updated[editingCategory.index]?.name;
      updated[editingCategory.index] = {
        ...cat,
        name: trimmed,
      };
      // If category name was renamed, update all associated case studies
      if (oldName && oldName !== trimmed) {
        setCaseStudies((prev) =>
          prev.map((cs) => (cs.category === oldName ? { ...cs, category: trimmed } : cs))
        );
      }
      setCategories(updated);
      toast.success(`Category "${trimmed}" updated!`);
    }

    setEditingCategory(null);
  };

  const handleInitiateRemoveCategory = (id: string, name: string) => {
    const linked = caseStudies.filter(
      (cs) => cs.category?.toLowerCase() === name.toLowerCase() || cs.categoryId === id
    );
    const sampleTitles = linked.slice(0, 3).map((cs) => cs.title);
    setConfirmDeleteCategoryModal({
      id,
      name,
      linkedCount: linked.length,
      sampleTitles,
    });
  };

  const handleConfirmDeleteCategory = () => {
    if (!confirmDeleteCategoryModal) return;
    const { id, name, linkedCount } = confirmDeleteCategoryModal;

    // 1. Remove category from categories list
    setCategories(categories.filter((c) => c.id !== id));

    // 2. Safely reassign linked case studies to "General" to prevent data loss or broken catalog links
    const updatedStudies = caseStudies.map((cs) => {
      if (cs.category?.toLowerCase() === name.toLowerCase() || cs.categoryId === id) {
        return {
          ...cs,
          category: "General",
          categoryId: null,
        };
      }
      return cs;
    });
    setCaseStudies(updatedStudies);

    setConfirmDeleteCategoryModal(null);
    toast.success(
      linkedCount > 0
        ? `Category "${name}" and matching Industry Sector removed. ${linkedCount} project(s) safely moved to "General".`
        : `Category "${name}" removed.`
    );
  };

  // =========================================================================
  // SECTION #04: CASE STUDIES ITEMS HELPERS
  // =========================================================================
  const filteredCaseStudies = caseStudies.filter((cs) => {
    if (itemCategoryFilter !== "ALL" && cs.category !== itemCategoryFilter) {
      return false;
    }
    if (!itemSearchQuery.trim()) return true;
    const q = itemSearchQuery.toLowerCase().trim();
    return (
      cs.title?.toLowerCase().includes(q) ||
      cs.client?.toLowerCase().includes(q) ||
      cs.category?.toLowerCase().includes(q) ||
      cs.impact?.toLowerCase().includes(q) ||
      cs.description?.toLowerCase().includes(q) ||
      (Array.isArray(cs.techStack) && cs.techStack.some((t: string) => t.toLowerCase().includes(q)))
    );
  });

  const handleMoveCaseStudy = (index: number, direction: "UP" | "DOWN") => {
    const target = direction === "UP" ? index - 1 : index + 1;
    if (target < 0 || target >= caseStudies.length) return;
    const updated = [...caseStudies];
    const [item] = updated.splice(index, 1);
    updated.splice(target, 0, item);
    setCaseStudies(updated);
  };

  const handleOpenAddCaseStudy = () => {
    setNewTechTag("");
    const defaultCategory = categories[0]?.name || "Fintech & Banking";
    setEditingCaseStudy({
      isNew: true,
      index: -1,
      study: {
        id: `cs-${Date.now()}`,
        slug: `case-study-${Date.now().toString().slice(-4)}`,
        title: "",
        client: "",
        category: defaultCategory,
        categoryId: categories[0]?.id || "",
        description: "",
        impact: "",
        liveUrl: "",
        buttonText: "",
        buttonLink: "",
        techStack: [],
        imageGradient: "from-violet-600 to-indigo-800",
        imageUrl: "",
        featured: false,
        order: caseStudies.length + 1,
      },
    });
  };

  const handleOpenEditCaseStudy = (study: any, realIndex: number) => {
    setNewTechTag("");
    setEditingCaseStudy({
      isNew: false,
      index: realIndex,
      study: {
        ...study,
        techStack: Array.isArray(study.techStack) ? [...study.techStack] : [],
      },
    });
  };

  const handleToggleFeatured = async (realIndex: number) => {
    const item = caseStudies[realIndex];
    if (!item) return;

    const nextFeatured = !item.featured;
    const nextDraft = nextFeatured ? false : Boolean(item.isDraft);

    // Optimistically update UI
    const updated = [...caseStudies];
    updated[realIndex] = {
      ...item,
      featured: nextFeatured,
      isDraft: nextDraft,
      status: nextDraft ? "draft" : "published",
    };
    setCaseStudies(updated);

    const toastId = toast.loading(
      nextFeatured
        ? `Enabling feature for "${item.title}"...`
        : `Disabling feature for "${item.title}"...`
    );

    try {
      const res = await fetch("/api/case-studies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          featured: nextFeatured,
          isDraft: nextDraft,
          status: nextDraft ? "draft" : "published",
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(
          nextFeatured
            ? `"${item.title}" is now Featured (ON)!`
            : `"${item.title}" feature turned OFF.`,
          { id: toastId }
        );
      } else {
        // Revert on error
        setCaseStudies(caseStudies);
        toast.error(json.error || "Failed to update featured status", { id: toastId });
      }
    } catch {
      // Revert on error
      setCaseStudies(caseStudies);
      toast.error("Failed to update featured status", { id: toastId });
    }
  };

  const handleSaveCaseStudyModal = async () => {
    if (!editingCaseStudy) return;
    const study = editingCaseStudy.study;
    const trimmedTitle = (study.title || "").trim();
    if (!trimmedTitle) {
      toast.error("Case study title is required");
      return;
    }
    const trimmedClient = (study.client || "").trim();
    if (!trimmedClient) {
      toast.error("Client name is required");
      return;
    }

    const finalFeatured = Boolean(study.featured);
    const isDraft = finalFeatured ? false : Boolean(study.isDraft);

    let updatedList: any[] = [];
    let savedStudy: any;

    if (editingCaseStudy.isNew) {
      const newStudy = {
        ...study,
        id: study.id || `cs-${Date.now()}`,
        slug: study.slug || trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: trimmedTitle,
        client: trimmedClient,
        challenge: study.challenge || "",
        solution: study.solution || "",
        results: study.results || "",
        isDraft,
        status: isDraft ? "draft" : "published",
        featured: finalFeatured,
        order: caseStudies.length + 1,
      };
      savedStudy = newStudy;
      updatedList = [...caseStudies, newStudy];
      setCaseStudies(updatedList);
    } else {
      savedStudy = {
        ...study,
        title: trimmedTitle,
        client: trimmedClient,
        challenge: study.challenge || "",
        solution: study.solution || "",
        results: study.results || "",
        isDraft,
        status: isDraft ? "draft" : "published",
        featured: finalFeatured,
      };
      updatedList = [...caseStudies];
      updatedList[editingCaseStudy.index] = savedStudy;
      setCaseStudies(updatedList);
    }

    setEditingCaseStudy(null);

    // Auto-persist directly to database so changes are immediately permanent
    const toastId = toast.loading(`Saving "${trimmedTitle}" to database...`);
    try {
      const res = await fetch("/api/case-studies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageContent,
          categories,
          caseStudies: updatedList,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(
          finalFeatured
            ? `Case study "${trimmedTitle}" saved & Featured (ON)!`
            : `Case study "${trimmedTitle}" saved successfully!`,
          { id: toastId }
        );
        if (json.data?.caseStudies) {
          setCaseStudies(json.data.caseStudies);
        }
      } else {
        toast.error(json.error || "Failed to persist to database", { id: toastId });
      }
    } catch {
      toast.error("Failed to persist case study to database", { id: toastId });
    }
  };

  const handleRemoveCaseStudy = async (realIndex: number, title: string) => {
    const ok = await confirm({
      title: "Delete Case Study",
      message: `Are you sure you want to delete case study "${title}"? This cannot be undone.`,
      confirmText: "Delete Case Study",
      variant: "danger",
    });
    if (!ok) return;
    const updated = caseStudies.filter((_, idx) => idx !== realIndex);
    setCaseStudies(updated);
    toast.success(`Case study "${title}" removed!`);
  };

  const handleAddTechTagToModal = () => {
    if (!editingCaseStudy) return;
    const val = newTechTag.trim().replace(/,/g, "");
    if (!val) return;
    const current = editingCaseStudy.study.techStack || [];
    if (!current.includes(val)) {
      setEditingCaseStudy({
        ...editingCaseStudy,
        study: {
          ...editingCaseStudy.study,
          techStack: [...current, val],
        },
      });
      setNewTechTag("");
      toast.success(`Added tag "${val}"`);
    } else {
      toast.error(`Tag "${val}" already exists`);
    }
  };

  const handleRemoveTechTagFromModal = (tagIdx: number) => {
    if (!editingCaseStudy) return;
    const current = editingCaseStudy.study.techStack || [];
    setEditingCaseStudy({
      ...editingCaseStudy,
      study: {
        ...editingCaseStudy.study,
        techStack: current.filter((_: string, i: number) => i !== tagIdx),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <p className="text-xs font-semibold text-slate-500">Loading Case Studies Content Engine...</p>
      </div>
    );
  }

  const currentSectionMeta =
    CASE_STUDIES_SECTIONS_CATALOG.find((s) => s.id === activeSectionId) || CASE_STUDIES_SECTIONS_CATALOG[0];
  const SectionIcon = currentSectionMeta.icon || Type;

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 text-slate-900 dark:text-white">
      {/* 2-Column Master-Detail Selection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Selector */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-4">
          <SectionNavSidebar
            title="Case Study Sections"
            sections={CASE_STUDIES_SECTIONS_CATALOG.map((sec) => {
              if (sec.id === "cs-categories") return { ...sec, badge: `${categories.length} Categories` };
              if (sec.id === "cs-items") return { ...sec, badge: `${caseStudies.length} Studies` };
              return sec;
            })}
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
                onClick={async () => {
                  const ok = await confirm({
                    title: "Reset Case Studies Content",
                    message: "Are you sure you want to reset all Case Studies content to defaults? This will restore default hero, categories, and case study items.",
                    confirmText: "Reset to Defaults",
                    variant: "warning",
                    icon: "refresh",
                  });
                  if (!ok) return;
                  setPageContent(DEFAULT_CASE_STUDIES_PAGE_DATA);
                  setCategories(DEFAULT_CASE_STUDY_CATEGORIES);
                  setCaseStudies(DEFAULT_CASE_STUDIES_ITEMS);
                  toast.info("Reset to default case studies content.");
                }}
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

          {/* STEP 1: HERO SECTION */}
          {activeSectionId === "cs-hero" && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Type className="h-4 w-4 text-violet-500" />
          Step 1: Hero Section Content
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hero Badge Text
            </label>
            <input
              type="text"
              value={pageContent.hero?.badge || ""}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  hero: { ...pageContent.hero, badge: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Highlighted Title Text (Orange Accent)
            </label>
            <input
              type="text"
              value={pageContent.hero?.highlightTitle || ""}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  hero: { ...pageContent.hero, highlightTitle: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-semibold text-[#f58220]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hero Main Headline
            </label>
            <input
              type="text"
              value={pageContent.hero?.title || ""}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  hero: { ...pageContent.hero, title: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hero Description Subtitle
            </label>
            <textarea
              rows={2}
              value={pageContent.hero?.subtitle || ""}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  hero: { ...pageContent.hero, subtitle: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    )}

      {/* STEP 2: IMPACT HIGHLIGHTS STATS BAR */}
      {activeSectionId === "cs-stats" && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-violet-500" />
          Step 2: Impact Highlights Bar (4 Stats)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {pageContent.hero?.stats?.map((st: any, sIdx: number) => (
            <div
              key={sIdx}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] space-y-2"
            >
              <span className="text-[10px] font-bold uppercase text-violet-600">Stat #{sIdx + 1}</span>
              <div>
                <label className="block text-[9px] font-bold text-slate-500">Value (e.g. $120M+)</label>
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => {
                    const newStats = [...pageContent.hero.stats];
                    newStats[sIdx].value = e.target.value;
                    setPageContent({
                      ...pageContent,
                      hero: { ...pageContent.hero, stats: newStats },
                    });
                  }}
                  className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-extrabold text-violet-600 dark:text-violet-400"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500">Label Statement</label>
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => {
                    const newStats = [...pageContent.hero.stats];
                    newStats[sIdx].label = e.target.value;
                    setPageContent({
                      ...pageContent,
                      hero: { ...pageContent.hero, stats: newStats },
                    });
                  }}
                  className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

      {/* =========================================================================
         STEP 3: DYNAMIC PORTFOLIO CATEGORIES - TABULAR LISTING
         ========================================================================= */}
      {activeSectionId === "cs-categories" && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] space-y-4 shadow-xs">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderPlus className="h-4 w-4 text-violet-500" />
                  Step 3: Dynamic Portfolio Categories
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-900/40">
                  {categories.length} Categories
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage sector filter categories for client case studies and public showcase filter tabs.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Search Bar & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search categories by name or description..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              {categorySearchQuery && (
                <button
                  type="button"
                  onClick={() => setCategorySearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <span className="text-[11px] font-semibold text-slate-400 shrink-0">
              Showing {filteredCategories.length} of {categories.length} categories
            </span>
          </div>

          {/* Tabular Listing Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0b0f19]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-3 w-16 text-center"># / Order</th>
                    <th className="py-3 px-4 w-48 sm:w-56">Category Name</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-3 w-32 text-center">Linked Studies</th>
                    <th className="py-3 px-4 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                        {categorySearchQuery
                          ? `No categories match "${categorySearchQuery}"`
                          : "No categories added yet. Click 'Add Category' to create one."}
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat, idx) => {
                      const realIndex = categories.findIndex((c) => c.id === cat.id);
                      const linkedCount = caseStudies.filter(
                        (cs) => cs.category === cat.name || cs.categoryId === cat.id
                      ).length;

                      return (
                        <tr
                          key={cat.id || idx}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
                        >
                          {/* Order / Reorder */}
                          <td className="py-3 px-3 text-center align-middle">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-mono text-[11px] font-bold text-slate-400 w-4">
                                {realIndex + 1}
                              </span>
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  disabled={realIndex === 0}
                                  onClick={() => handleMoveCategory(realIndex, "UP")}
                                  className="p-0.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                                  title="Move Up"
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={realIndex === categories.length - 1}
                                  onClick={() => handleMoveCategory(realIndex, "DOWN")}
                                  className="p-0.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                                  title="Move Down"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Category Name */}
                          <td className="py-3 px-4 align-middle">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {cat.name}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400 block">
                                  {cat.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="py-3 px-4 align-middle">
                            <p className="line-clamp-2 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                              {cat.description || "No description provided."}
                            </p>
                          </td>

                          {/* Linked Studies */}
                          <td className="py-3 px-3 text-center align-middle">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                linkedCount > 0
                                  ? "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-900/50"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              <FolderGit2 className="h-3 w-3" />
                              <span>{linkedCount} {linkedCount === 1 ? "study" : "studies"}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 align-middle text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategory(cat, realIndex)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                                title="Edit Category"
                              >
                                <Pencil className="h-3 w-3 text-slate-500" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleInitiateRemoveCategory(cat.id, cat.name)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         STEP 4: CASE STUDIES ITEMS MANAGER - TABULAR LISTING
         ========================================================================= */}
      {activeSectionId === "cs-items" && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] space-y-4 shadow-xs">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-violet-500" />
                  Step 4: Case Studies Items Manager
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-900/40">
                  {caseStudies.length} Case Studies
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage client showcase projects, live URLs, impact indicators, cover images, and tech stack tags.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCaseStudy}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Case Study Item</span>
            </button>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, client, tech tag, impact..."
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                {itemSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setItemSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Select */}
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 shrink-0 hidden sm:inline">Category:</label>
                <select
                  value={itemCategoryFilter}
                  onChange={(e) => setItemCategoryFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="ALL">All Categories ({caseStudies.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({caseStudies.filter((cs) => cs.category === c.name).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-slate-400 shrink-0">
              Showing {filteredCaseStudies.length} of {caseStudies.length} items
            </span>
          </div>

        {/* Tabular Listing Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0b0f19]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3 w-14 text-center"># / Order</th>
                  <th className="py-3 px-4">Project & Client</th>
                  <th className="py-3 px-3 w-32">Category</th>
                  <th className="py-3 px-3 w-40">Impact Metric</th>
                  <th className="py-3 px-3 w-44">Tech Stack</th>
                  <th className="py-3 px-3 w-36">Live URL</th>
                  <th className="py-3 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {filteredCaseStudies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                      {itemSearchQuery || itemCategoryFilter !== "ALL"
                        ? `No case studies match your current search/filter.`
                        : "No case studies added yet. Click 'Add Case Study Item' to create one."}
                    </td>
                  </tr>
                ) : (
                  filteredCaseStudies.map((cs, idx) => {
                    const realIndex = caseStudies.findIndex((c) => c.id === cs.id);
                    const isFeatured = Boolean(cs.featured);

                    return (
                      <tr
                        key={cs.id || idx}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        {/* Order / Reorder */}
                        <td className="py-3 px-3 text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-mono text-[11px] font-bold text-slate-400 w-4">
                              {realIndex + 1}
                            </span>
                            <div className="flex flex-col">
                              <button
                                type="button"
                                disabled={realIndex === 0}
                                onClick={() => handleMoveCaseStudy(realIndex, "UP")}
                                className="p-0.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                                title="Move Up"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={realIndex === caseStudies.length - 1}
                                onClick={() => handleMoveCaseStudy(realIndex, "DOWN")}
                                className="p-0.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                                title="Move Down"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Project & Client */}
                        <td className="py-3 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            {/* Visual Thumbnail */}
                            <div
                              className={`h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center bg-gradient-to-br ${
                                cs.imageGradient || "from-violet-600 to-indigo-800"
                              } shadow-xs`}
                            >
                              {cs.imageUrl ? (
                                <img
                                  src={cs.imageUrl}
                                  alt={cs.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FolderGit2 className="h-4 w-4 text-white/80" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                  {cs.title}
                                </span>
                                {cs.isDraft && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    <AlertCircle className="h-2.5 w-2.5" />
                                    <span>Draft (Industry) • Incomplete</span>
                                  </span>
                                )}
                                {isFeatured && (
                                  <span
                                    className="inline-flex items-center justify-center p-1 rounded-md text-[9px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-500 border border-amber-200/60 dark:border-amber-900/40"
                                    title="Featured"
                                  >
                                    <Star className="h-3 w-3 fill-amber-500" />
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="truncate">{cs.client || "Client"}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 align-middle whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-900/50">
                            {cs.category}
                          </span>
                        </td>

                        {/* Impact Metric */}
                        <td className="py-3 px-3 align-middle whitespace-nowrap">
                          {cs.impact ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50">
                              <TrendingUp className="h-3 w-3 shrink-0" />
                              <span className="truncate">{cs.impact}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">—</span>
                          )}
                        </td>

                        {/* Tech Stack */}
                        <td className="py-3 px-3 align-middle">
                          <div className="flex flex-wrap items-center gap-1">
                            {Array.isArray(cs.techStack) && cs.techStack.length > 0 ? (
                              <>
                                {cs.techStack.slice(0, 2).map((tech: string, tIdx: number) => (
                                  <span
                                    key={tIdx}
                                    className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {cs.techStack.length > 2 && (
                                  <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                                    +{cs.techStack.length - 2}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400">None</span>
                            )}
                          </div>
                        </td>

                        {/* Live URL */}
                        <td className="py-3 px-3 align-middle whitespace-nowrap">
                          {cs.liveUrl ? (
                            <a
                              href={cs.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-violet-600 dark:text-violet-400 hover:underline"
                              title={cs.liveUrl}
                            >
                              <span className="truncate max-w-[120px]">
                                {cs.liveUrl.replace(/^https?:\/\//, "")}
                              </span>
                              <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-70" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Quick Featured On/Off Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(realIndex)}
                              className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                                isFeatured
                                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-500 border-amber-300 dark:border-amber-800 hover:bg-amber-100 shadow-2xs"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:text-amber-500 hover:border-amber-300"
                              }`}
                              title={
                                isFeatured
                                  ? "Featured: ON (Click to turn OFF / Unfeature)"
                                  : "Featured: OFF (Click to turn ON / Feature this project)"
                              }
                            >
                              <Star className={`h-4 w-4 ${isFeatured ? "fill-amber-500 text-amber-500" : "text-slate-400"}`} />
                            </button>

                            {/* Edit Item Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditCaseStudy(cs, realIndex)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                              title="Edit Case Study"
                            >
                              <Pencil className="h-3 w-3 text-slate-500" />
                              <span>Edit</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleRemoveCaseStudy(realIndex, cs.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="Delete Case Study"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

      {/* STEP 5: DEEP ARCHITECTURE BREAKDOWN & BENCHMARK SHOWCASE SECTION */}
      {activeSectionId === "cs-architecture" && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] space-y-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Layers className="h-4 w-4 text-violet-500" />
          Step 5: Deep Architecture Breakdown & Benchmark Showcase Section
        </h3>

        {/* Section Header Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Showcase Section Badge Tag
            </label>
            <input
              type="text"
              value={pageContent.showcase?.badge || ""}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  showcase: { ...pageContent.showcase, badge: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Showcase Platform Button Text & Link URL
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={pageContent.showcase?.buttonText || ""}
                onChange={(e) =>
                  setPageContent({
                    ...pageContent,
                    showcase: { ...pageContent.showcase, buttonText: e.target.value },
                  })
                }
                placeholder="e.g. View Khataflow Live Platform"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={pageContent.showcase?.buttonLink || ""}
                onChange={(e) =>
                  setPageContent({
                    ...pageContent,
                    showcase: { ...pageContent.showcase, buttonLink: e.target.value },
                  })
                }
                placeholder="https://khataflow.com"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Showcase Main Headline Title
            </label>
            <input
              type="text"
              value={pageContent.showcase?.title || ""}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  showcase: { ...pageContent.showcase, title: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Showcase Subtitle Description
            </label>
            <textarea
              rows={2}
              value={pageContent.showcase?.subtitle || ""}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  showcase: { ...pageContent.showcase, subtitle: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Benchmark Metrics Table Manager */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Benchmark Impact Table Title
              </label>
              <input
                type="text"
                value={pageContent.showcase?.metricsTitle || "Measurable Benchmark Impact"}
                onChange={(e) =>
                  setPageContent({
                    ...pageContent,
                    showcase: { ...pageContent.showcase, metricsTitle: e.target.value },
                  })
                }
                className="w-full sm:w-80 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const currentMetrics = pageContent.showcase?.metrics || [];
                const updated = [
                  ...currentMetrics,
                  { metric: "New Performance Metric", before: "Legacy Value", after: "Optimized Outcome" },
                ];
                setPageContent({
                  ...pageContent,
                  showcase: { ...pageContent.showcase, metrics: updated },
                });
                toast.success("Added metric row to table!");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Table Metric Row</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-slate-400 px-2">
              <span className="col-span-4">Metric Name</span>
              <span className="col-span-3 text-red-500">Before Clickpoint</span>
              <span className="col-span-4 text-violet-600">After Clickpoint</span>
              <span className="col-span-1 text-center">Actions</span>
            </div>

            {(pageContent.showcase?.metrics || []).map((m: any, mIdx: number) => (
              <div
                key={mIdx}
                className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800"
              >
                <input
                  type="text"
                  value={m.metric}
                  onChange={(e) => {
                    const updated = [...(pageContent.showcase?.metrics || [])];
                    updated[mIdx].metric = e.target.value;
                    setPageContent({
                      ...pageContent,
                      showcase: { ...pageContent.showcase, metrics: updated },
                    });
                  }}
                  placeholder="Metric Name"
                  className="col-span-4 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                />

                <input
                  type="text"
                  value={m.before}
                  onChange={(e) => {
                    const updated = [...(pageContent.showcase?.metrics || [])];
                    updated[mIdx].before = e.target.value;
                    setPageContent({
                      ...pageContent,
                      showcase: { ...pageContent.showcase, metrics: updated },
                    });
                  }}
                  placeholder="Before Value"
                  className="col-span-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-semibold text-red-500"
                />

                <input
                  type="text"
                  value={m.after}
                  onChange={(e) => {
                    const updated = [...(pageContent.showcase?.metrics || [])];
                    updated[mIdx].after = e.target.value;
                    setPageContent({
                      ...pageContent,
                      showcase: { ...pageContent.showcase, metrics: updated },
                    });
                  }}
                  placeholder="After Value"
                  className="col-span-4 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-extrabold text-violet-600 dark:text-violet-400"
                />

                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (pageContent.showcase?.metrics || []).filter((_: any, idx: number) => idx !== mIdx);
                      setPageContent({
                        ...pageContent,
                        showcase: { ...pageContent.showcase, metrics: updated },
                      });
                      toast.success("Removed metric row.");
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete row"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Breakdown & Deliverables Bullets Manager */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Engineering Deliverables Title
              </label>
              <input
                type="text"
                value={pageContent.showcase?.deliverablesTitle || "Engineering Breakdown & Architecture"}
                onChange={(e) =>
                  setPageContent({
                    ...pageContent,
                    showcase: { ...pageContent.showcase, deliverablesTitle: e.target.value },
                  })
                }
                className="w-full sm:w-80 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const currentDel = pageContent.showcase?.deliverables || [];
                const updated = [
                  ...currentDel,
                  { title: "New Architecture Deliverable", desc: "Detailed summary of the technical component or optimization built." },
                ];
                setPageContent({
                  ...pageContent,
                  showcase: { ...pageContent.showcase, deliverables: updated },
                });
                toast.success("Added deliverable bullet!");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Deliverable Bullet</span>
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Deliverables Overview Description
            </label>
            <textarea
              rows={2}
              value={pageContent.showcase?.deliverablesSub || ""}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  showcase: { ...pageContent.showcase, deliverablesSub: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            {(pageContent.showcase?.deliverables || []).map((del: any, dIdx: number) => (
              <div
                key={dIdx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-violet-600 bg-violet-50 dark:bg-violet-950 px-2 py-0.5 rounded">
                    Deliverable #{dIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (pageContent.showcase?.deliverables || []).filter((_: any, idx: number) => idx !== dIdx);
                      setPageContent({
                        ...pageContent,
                        showcase: { ...pageContent.showcase, deliverables: updated },
                      });
                      toast.success("Removed deliverable.");
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete deliverable"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500">Deliverable Title</label>
                    <input
                      type="text"
                      value={del.title}
                      onChange={(e) => {
                        const updated = [...(pageContent.showcase?.deliverables || [])];
                        updated[dIdx].title = e.target.value;
                        setPageContent({
                          ...pageContent,
                          showcase: { ...pageContent.showcase, deliverables: updated },
                        });
                      }}
                      className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500">Description</label>
                    <input
                      type="text"
                      value={del.desc}
                      onChange={(e) => {
                        const updated = [...(pageContent.showcase?.deliverables || [])];
                        updated[dIdx].desc = e.target.value;
                        setPageContent({
                          ...pageContent,
                          showcase: { ...pageContent.showcase, deliverables: updated },
                        });
                      }}
                      className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* STEP 6: EXECUTIVE ENDORSEMENTS & TESTIMONIALS SELECTOR */}
      {activeSectionId === "cs-testimonials" && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-2">
              <Quote className="h-4 w-4 text-violet-500" />
              Step 6: Executive Endorsements & Dynamic Testimonials Selector (Max 3 Allowed)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Customize section title, badge tag, and select up to 3 testimonials from your CMS to feature on the Case Studies page.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const top3Ids = allTestimonials.slice(0, 3).map((t: any) => String(t.id));
                setPageContent({
                  ...pageContent,
                  testimonialsSection: {
                    ...(pageContent.testimonialsSection || {}),
                    selectedTestimonialIds: top3Ids,
                  },
                });
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Select Top 3
            </button>
            <button
              type="button"
              onClick={() => {
                setPageContent({
                  ...pageContent,
                  testimonialsSection: {
                    ...(pageContent.testimonialsSection || {}),
                    selectedTestimonialIds: [],
                  },
                });
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Section Badge Tag
            </label>
            <input
              type="text"
              value={pageContent.testimonialsSection?.badge || "Executive Endorsements"}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  testimonialsSection: {
                    ...(pageContent.testimonialsSection || {}),
                    badge: e.target.value,
                  },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Main Headline Title
            </label>
            <input
              type="text"
              value={pageContent.testimonialsSection?.title || "Trusted by tech leaders around the globe"}
              onChange={(e) =>
                setPageContent({
                  ...pageContent,
                  testimonialsSection: {
                    ...(pageContent.testimonialsSection || {}),
                    title: e.target.value,
                  },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Testimonials Selection Grid */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>
              Currently Selected:{" "}
              <span className="text-violet-600 dark:text-violet-400 font-extrabold">
                {(pageContent.testimonialsSection?.selectedTestimonialIds || []).length} / 3 Testimonials
              </span>
            </span>
            {(pageContent.testimonialsSection?.selectedTestimonialIds || []).length >= 3 && (
              <span className="text-[11px] text-amber-500 dark:text-amber-400 font-bold">
                Max 3 selected limit reached
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {allTestimonials.map((testi: any) => {
              const selectedIds: string[] = (pageContent.testimonialsSection?.selectedTestimonialIds || []).map((id: any) => String(id));
              const currentId = String(testi.id);
              const isChecked = selectedIds.includes(currentId);

              return (
                <label
                  key={testi.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "border-violet-500/60 bg-violet-50/50 dark:bg-violet-950/20"
                      : selectedIds.length >= 3
                      ? "border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-[#0b0f19]/50 opacity-60"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (selectedIds.length >= 3) {
                          toast.error("You can select a maximum of 3 testimonials for the Case Studies page.");
                          return;
                        }
                        setPageContent({
                          ...pageContent,
                          testimonialsSection: {
                            ...(pageContent.testimonialsSection || {}),
                            selectedTestimonialIds: [...selectedIds, currentId],
                          },
                        });
                      } else {
                        setPageContent({
                          ...pageContent,
                          testimonialsSection: {
                            ...(pageContent.testimonialsSection || {}),
                            selectedTestimonialIds: selectedIds.filter((id) => id !== currentId),
                          },
                        });
                      }
                    }}
                    className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {testi.name || testi.clientName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {testi.role || testi.clientRole}{testi.company ? ` @ ${testi.company}` : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2">
                      "{testi.content || testi.quote}"
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    )}
      {/* =========================================================================
         MODAL 1: CATEGORY EDIT & CREATE MODAL
         ========================================================================= */}
      {mounted && typeof window !== "undefined" && editingCategory && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <FolderPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingCategory.isNew ? "Create Portfolio Category" : "Edit Category"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingCategory.isNew
                      ? "Define a new sector filter for showcase projects"
                      : `Updating ${editingCategory.category.name}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fintech & Banking, AI & Automation..."
                  value={editingCategory.category.name || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      category: { ...editingCategory.category, name: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Focus Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Automated ledger engines, payment gateways, and trading copilots."
                  value={editingCategory.category.description || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      category: { ...editingCategory.category, description: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-xl border border-dashed border-violet-300 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 block">
                  Live Showcase Filter Tab Preview
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-600 text-white shadow-xs">
                    {editingCategory.category.name || "Category Preview"}
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Inactive Tab
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategoryModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{editingCategory.isNew ? "Create Category" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
         MODAL 2: CASE STUDY ITEM EDIT & CREATE MODAL
         ========================================================================= */}
      {mounted && typeof window !== "undefined" && editingCaseStudy && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingCaseStudy.isNew ? "Add Case Study Item" : `Edit: ${editingCaseStudy.study.title}`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingCaseStudy.isNew
                      ? "Create a new client portfolio project showcase"
                      : "Modify project identity, impact metrics, live link, and tech stack"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Publication Status Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const nextDraft = !editingCaseStudy.study.isDraft;
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      study: {
                        ...editingCaseStudy.study,
                        isDraft: nextDraft,
                        status: nextDraft ? "draft" : "published",
                      },
                    });
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    editingCaseStudy.study.isDraft
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-100"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                  }`}
                  title={
                    editingCaseStudy.study.isDraft
                      ? "Draft project: only visible to admins. Click to publish live to showcase."
                      : "Published project: live on public showcase. Click to set back to draft."
                  }
                >
                  {editingCaseStudy.study.isDraft ? (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Draft (Admin Only)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Published & Live</span>
                    </>
                  )}
                </button>

                {/* Featured On/Off Toggle Button in Header */}
                <button
                  type="button"
                  onClick={() => {
                    const nextFeatured = !editingCaseStudy.study.featured;
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      study: {
                        ...editingCaseStudy.study,
                        featured: nextFeatured,
                        isDraft: nextFeatured ? false : editingCaseStudy.study.isDraft,
                        status: nextFeatured ? "published" : editingCaseStudy.study.status,
                      },
                    });
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    editingCaseStudy.study.featured
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-100 shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  title={
                    editingCaseStudy.study.featured
                      ? "Featured: ON. Click to turn OFF."
                      : "Featured: OFF. Click to turn ON."
                  }
                >
                  <Star className={`h-3.5 w-3.5 ${editingCaseStudy.study.featured ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} />
                  <span>Featured: {editingCaseStudy.study.featured ? "ON" : "OFF"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingCaseStudy(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Draft Project Notice Banner */}
              {editingCaseStudy.study.isDraft && (
                <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/70 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Draft Project (Imported from Industry Section)</p>
                    <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                      This project was added with partial details from the Industry sector. To make it visible on the public Case Studies page and unlock the <strong>Featured</strong> badge, complete the narrative below (Challenge, Solution, Results) and switch status to <strong>Published & Live</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION A: Core Project Identity */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0b0f19]/60 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 block">
                  1. Project & Client Identity
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Khataflow AI Ledger Engine"
                      value={editingCaseStudy.study.title || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, title: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Client / Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Khataflow Inc."
                      value={editingCaseStudy.study.client || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, client: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Portfolio Category
                    </label>
                    <select
                      value={editingCaseStudy.study.category || categories[0]?.name}
                      onChange={(e) => {
                        const matched = categories.find((c) => c.name === e.target.value);
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: {
                            ...editingCaseStudy.study,
                            category: e.target.value,
                            categoryId: matched?.id || editingCaseStudy.study.categoryId,
                          },
                        });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Slug Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. khataflow-ai-ledger"
                      value={editingCaseStudy.study.slug || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: {
                            ...editingCaseStudy.study,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                          },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs font-mono text-violet-600 dark:text-violet-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Impact Metric & Live Links */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0b0f19]/60 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  2. Impact Metric & External URLs
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Impact Headline Result
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $42M+ Daily Volume Processed"
                      value={editingCaseStudy.study.impact || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, impact: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Live Project Platform URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com"
                      value={editingCaseStudy.study.liveUrl || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: {
                            ...editingCaseStudy.study,
                            liveUrl: e.target.value,
                            buttonLink: editingCaseStudy.study.buttonLink || e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs font-mono text-violet-600 dark:text-violet-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Live Platform"
                      value={editingCaseStudy.study.buttonText || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, buttonText: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      CTA Button Link
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com"
                      value={editingCaseStudy.study.buttonLink || editingCaseStudy.study.liveUrl || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, buttonLink: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Description & Summary */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0b0f19]/60 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Case Study Summary Narrative
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of the challenge, system built, and technical outcome achieved..."
                  value={editingCaseStudy.study.description || ""}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      study: { ...editingCaseStudy.study, description: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3.5 py-2 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* SECTION D: Deep-Dive Architecture & Engineering Outcomes (Challenge, Solution, Results) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0b0f19]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                    Engineering Deep-Dive Narrative (Challenge, Solution, Results)
                  </span>
                  {editingCaseStudy.study.isDraft && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      Required for showcase publication
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      The Architectural Challenge / Problem Statement
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Legacy monolithic database suffering 48h reconciliation bottlenecks and high transaction drop rates..."
                      value={editingCaseStudy.study.challenge || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, challenge: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3.5 py-2 text-xs text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Clickpoint Engineering Solution & Technical Architecture
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Architected an event-driven Kafka stream with PgVector semantic indexing and automated AI agent pods..."
                      value={editingCaseStudy.study.solution || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, solution: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3.5 py-2 text-xs text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Measurable Business & Technical Results
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Achieved sub-250ms reconciliation latency, zero data loss, and $42M+ daily volume processed..."
                      value={editingCaseStudy.study.results || ""}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, results: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3.5 py-2 text-xs text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION D: Visuals & Header Gradient */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0b0f19]/60 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 block">
                  3. Cover Image & Header Gradient
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FileUploadControl
                    label="Custom Cover Image (Upload or URL)"
                    value={editingCaseStudy.study.imageUrl || ""}
                    accept="image/*"
                    onChange={(url) =>
                      setEditingCaseStudy({
                        ...editingCaseStudy,
                        study: { ...editingCaseStudy.study, imageUrl: url },
                      })
                    }
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Header Banner Gradient
                    </label>
                    <select
                      value={editingCaseStudy.study.imageGradient || "from-violet-600 to-indigo-800"}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          study: { ...editingCaseStudy.study, imageGradient: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="from-violet-600 to-indigo-800">Violet to Indigo</option>
                      <option value="from-blue-600 to-cyan-800">Blue to Cyan</option>
                      <option value="from-emerald-600 to-teal-800">Emerald to Teal</option>
                      <option value="from-amber-600 to-rose-700">Amber to Rose</option>
                      <option value="from-purple-600 to-indigo-800">Purple to Indigo</option>
                      <option value="from-blue-700 to-slate-900">Blue to Dark Slate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION E: Tech Stack Tags */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0b0f19]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-violet-500" />
                    <span>Tech Stack Badges ({editingCaseStudy.study.techStack?.length || 0})</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Type tag & press Enter</span>
                </div>

                {/* Pills List */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-700 min-h-[42px]">
                  {Array.isArray(editingCaseStudy.study.techStack) &&
                  editingCaseStudy.study.techStack.length > 0 ? (
                    editingCaseStudy.study.techStack.map((tech: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-900/50"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTechTagFromModal(tIdx)}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic px-1">
                      No tech stack tags added yet. Type below to add.
                    </span>
                  )}
                </div>

                {/* Add Tag Row */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add tag (e.g. Next.js, Python, PostgreSQL, AWS)..."
                    value={newTechTag}
                    onChange={(e) => setNewTechTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleAddTechTagToModal();
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechTagToModal}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Tag</span>
                  </button>
                </div>
              </div>

              {/* SECTION F: Live Card Preview */}
              <div className="p-4 rounded-xl border border-dashed border-violet-300 dark:border-violet-900/60 bg-violet-50/30 dark:bg-violet-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 block">
                    Showcase Card Live Preview
                  </span>
                  <span className="text-[10px] text-slate-400">Previewing live case study card</span>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] overflow-hidden shadow-xs w-full">
                  {/* Banner */}
                  <div
                    className={`h-28 w-full bg-gradient-to-br ${
                      editingCaseStudy.study.imageGradient || "from-violet-600 to-indigo-800"
                    } p-4 flex flex-col justify-between relative overflow-hidden`}
                  >
                    {editingCaseStudy.study.imageUrl && (
                      <img
                        src={editingCaseStudy.study.imageUrl}
                        alt="Preview"
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                      />
                    )}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                        {editingCaseStudy.study.category || "Category"}
                      </span>
                      {Boolean(editingCaseStudy.study.featured) && (
                        <span
                          className="inline-flex items-center justify-center p-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-2xs"
                          title="Featured"
                        >
                          <Star className="h-3 w-3 fill-current" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-white/90 relative z-10">
                      {editingCaseStudy.study.client || "Client Name"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {editingCaseStudy.study.title || "Project Title Preview"}
                      </h4>
                      {editingCaseStudy.study.impact && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="h-3 w-3" />
                          <span>{editingCaseStudy.study.impact}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {editingCaseStudy.study.description || "Project summary description preview..."}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(editingCaseStudy.study.techStack || []).slice(0, 6).map((t: string, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Priority Toggle Card */}
                  <div
                    onClick={() => {
                      const nextFeatured = !editingCaseStudy.study.featured;
                      setEditingCaseStudy({
                        ...editingCaseStudy,
                        study: {
                          ...editingCaseStudy.study,
                          featured: nextFeatured,
                          isDraft: nextFeatured ? false : editingCaseStudy.study.isDraft,
                          status: nextFeatured ? "published" : editingCaseStudy.study.status,
                        },
                      });
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      editingCaseStudy.study.featured
                        ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/30"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-lg ${
                          editingCaseStudy.study.featured
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            editingCaseStudy.study.featured ? "fill-amber-500 text-amber-500" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Featured in Portfolio & Industry
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              editingCaseStudy.study.featured
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {editingCaseStudy.study.featured ? "ENABLED (ON)" : "DISABLED (OFF)"}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {editingCaseStudy.study.featured
                            ? "Featured project with gold star badge, pinned for showcase & industry sector linking."
                            : "Standard project. Click anywhere on this card to enable Featured."}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                        editingCaseStudy.study.featured ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                          editingCaseStudy.study.featured ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setEditingCaseStudy(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCaseStudyModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{editingCaseStudy.isNew ? "Add Case Study" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
         MODAL 3: CROSS-CATALOG CATEGORY DELETE CONFIRMATION MODAL
         ========================================================================= */}
      {mounted && typeof window !== "undefined" && confirmDeleteCategoryModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Portfolio Category?
                </h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  Cross-catalog synchronization & data safety notice
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                You are about to delete <strong className="text-slate-900 dark:text-white">"{confirmDeleteCategoryModal.name}"</strong>. This will remove this category from the Case Studies catalog and also automatically delete the corresponding Industry Sector from the Industries catalog.
              </p>

              {confirmDeleteCategoryModal.linkedCount > 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{confirmDeleteCategoryModal.linkedCount} Case Study Project(s) Linked</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    To prevent any broken links or lost data, all {confirmDeleteCategoryModal.linkedCount} project(s) will be safely and automatically reassigned to the <strong>"General"</strong> category:
                  </p>
                  {confirmDeleteCategoryModal.sampleTitles.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-amber-900 dark:text-amber-200 font-mono space-y-0.5">
                      {confirmDeleteCategoryModal.sampleTitles.map((t, idx) => (
                        <li key={idx} className="truncate">{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  No case studies are currently assigned to this category.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmDeleteCategoryModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
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
