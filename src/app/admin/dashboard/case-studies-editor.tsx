"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
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
} from "lucide-react";
import {
  DEFAULT_CASE_STUDIES_PAGE_DATA,
  DEFAULT_CASE_STUDY_CATEGORIES,
  DEFAULT_CASE_STUDIES_ITEMS,
} from "@/data/default-case-studies-data";

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

export default function CaseStudiesEditor() {
  const [pageContent, setPageContent] = useState<any>(DEFAULT_CASE_STUDIES_PAGE_DATA);
  const [categories, setCategories] = useState<any[]>(DEFAULT_CASE_STUDY_CATEGORIES);
  const [caseStudies, setCaseStudies] = useState<any[]>(DEFAULT_CASE_STUDIES_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [allTestimonials, setAllTestimonials] = useState<any[]>([]);

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

  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) {
      toast.error("Please enter a category name");
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`Category "${trimmed}" already exists`);
      return;
    }

    const newCat = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      description: `${trimmed} case studies & enterprise client projects`,
      order: categories.length + 1,
    };

    setCategories([...categories, newCat]);
    setNewCatName("");
    toast.success(`Category "${trimmed}" added!`);
  };

  const handleRemoveCategory = (id: string, name: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    toast.success(`Category "${name}" removed!`);
  };

  const handleAddCaseStudy = () => {
    const newStudy = {
      id: `cs-${Date.now()}`,
      slug: `new-case-study-${Date.now().toString().slice(-4)}`,
      title: "New Featured Case Study",
      client: "Enterprise Client",
      category: categories[0]?.name || "Fintech & Banking",
      description: "Brief summary description of the problem solved and technical outcome.",
      impact: "$10M+ Value Created",
      liveUrl: "https://clickpoint.com.np",
      buttonText: "Explore Live Platform",
      buttonLink: "https://clickpoint.com.np",
      techStack: ["Next.js", "TypeScript", "Python", "AWS"],
      imageGradient: "from-violet-600 to-indigo-800",
      featured: true,
      order: caseStudies.length + 1,
    };

    setCaseStudies([...caseStudies, newStudy]);
    toast.success("New case study added!");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <p className="text-xs font-semibold text-slate-500">Loading Case Studies Content Engine...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 overflow-hidden">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <FolderGit2 className="h-3 w-3" />
              Dynamic Content Engine
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {caseStudies.length} Active Studies • {categories.length} Categories
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Case Studies & Portfolio CMS
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage hero badges, impact metrics, dynamic categories, portfolio cards, and custom CTA buttons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => {
              setPageContent(DEFAULT_CASE_STUDIES_PAGE_DATA);
              setCategories(DEFAULT_CASE_STUDY_CATEGORIES);
              setCaseStudies(DEFAULT_CASE_STUDIES_ITEMS);
              toast.info("Reset to default case studies content.");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>Save Case Studies</span>
          </button>
        </div>
      </div>

      {/* STEP 1: HERO SECTION */}
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

      {/* STEP 2: IMPACT HIGHLIGHTS STATS BAR */}
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

      {/* STEP 3: DYNAMIC CATEGORIES MANAGEMENT */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FolderPlus className="h-4 w-4 text-violet-500" />
              Step 3: Dynamic Categories ({categories.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Categories create the filter tabs on the portfolio showcase and populate the case study category selector.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New Category Name (e.g. AI & ML)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat, cIdx) => (
            <div
              key={cat.id || cIdx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] space-y-2 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-800">
                  Category #{cIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat.id, cat.name)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500">Category Name</label>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => {
                    const updated = [...categories];
                    updated[cIdx].name = e.target.value;
                    setCategories(updated);
                  }}
                  className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500">Description</label>
                <input
                  type="text"
                  value={cat.description || ""}
                  onChange={(e) => {
                    const updated = [...categories];
                    updated[cIdx].description = e.target.value;
                    setCategories(updated);
                  }}
                  className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 4: CASE STUDIES ITEMS MANAGEMENT */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-violet-500" />
              Step 4: Case Studies Items ({caseStudies.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Add custom image uploads, client badges, impact metrics, tech stack tags, live URLs, and custom CTA button links.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCaseStudy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Case Study Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {caseStudies.map((cs, csIdx) => (
            <div
              key={cs.id || csIdx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] space-y-4"
            >
              {/* Item Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-violet-600 bg-violet-50 dark:bg-violet-950/60 px-2.5 py-0.5 rounded border border-violet-200 dark:border-violet-800">
                    Study #{csIdx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                    {cs.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cs.featured !== false}
                      onChange={(e) => {
                        const updated = [...caseStudies];
                        updated[csIdx].featured = e.target.checked;
                        setCaseStudies(updated);
                      }}
                      className="rounded border-slate-300 text-violet-600 h-3.5 w-3.5"
                    />
                    <span>Featured</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCaseStudies(caseStudies.filter((_: any, idx: number) => idx !== csIdx));
                      toast.success("Case study deleted.");
                    }}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500">Project Title</label>
                  <input
                    type="text"
                    value={cs.title}
                    onChange={(e) => {
                      const updated = [...caseStudies];
                      updated[csIdx].title = e.target.value;
                      setCaseStudies(updated);
                    }}
                    className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500">Client Name</label>
                  <input
                    type="text"
                    value={cs.client}
                    onChange={(e) => {
                      const updated = [...caseStudies];
                      updated[csIdx].client = e.target.value;
                      setCaseStudies(updated);
                    }}
                    className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500">Category Selection</label>
                  <select
                    value={cs.category}
                    onChange={(e) => {
                      const updated = [...caseStudies];
                      updated[csIdx].category = e.target.value;
                      const matched = categories.find((c) => c.name === e.target.value);
                      if (matched) updated[csIdx].categoryId = matched.id;
                      setCaseStudies(updated);
                    }}
                    className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500">Impact Metric Headline</label>
                  <input
                    type="text"
                    value={cs.impact || ""}
                    onChange={(e) => {
                      const updated = [...caseStudies];
                      updated[csIdx].impact = e.target.value;
                      setCaseStudies(updated);
                    }}
                    placeholder="e.g. +$42M Daily Volume"
                    className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500">Live Project URL</label>
                  <input
                    type="text"
                    value={cs.liveUrl || ""}
                    onChange={(e) => {
                      const updated = [...caseStudies];
                      updated[csIdx].liveUrl = e.target.value;
                      if (!updated[csIdx].buttonLink) updated[csIdx].buttonLink = e.target.value;
                      setCaseStudies(updated);
                    }}
                    placeholder="https://example.com"
                    className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-violet-600 dark:text-violet-400"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500">CTA Button Text & Link</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={cs.buttonText || "Explore Live Platform"}
                      onChange={(e) => {
                        const updated = [...caseStudies];
                        updated[csIdx].buttonText = e.target.value;
                        setCaseStudies(updated);
                      }}
                      placeholder="Button Text"
                      className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={cs.buttonLink || cs.liveUrl || ""}
                      onChange={(e) => {
                        const updated = [...caseStudies];
                        updated[csIdx].buttonLink = e.target.value;
                        setCaseStudies(updated);
                      }}
                      placeholder="Button Link"
                      className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[9px] font-bold text-slate-500">Case Study Description</label>
                  <textarea
                    rows={2}
                    value={cs.description}
                    onChange={(e) => {
                      const updated = [...caseStudies];
                      updated[csIdx].description = e.target.value;
                      setCaseStudies(updated);
                    }}
                    className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* Custom Image Upload & Gradient Selector */}
                <div className="sm:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <FileUploadControl
                    label="Custom Cover Image (Upload or URL)"
                    value={cs.imageUrl || ""}
                    accept="image/*"
                    onChange={(url) => {
                      const updated = [...caseStudies];
                      updated[csIdx].imageUrl = url;
                      setCaseStudies(updated);
                    }}
                  />

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Card Header Banner Gradient
                    </label>
                    <select
                      value={cs.imageGradient || "from-violet-600 to-indigo-800"}
                      onChange={(e) => {
                        const updated = [...caseStudies];
                        updated[csIdx].imageGradient = e.target.value;
                        setCaseStudies(updated);
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
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

                {/* Tech Stack Badges Management */}
                <div className="sm:col-span-3 space-y-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Tag className="h-3 w-3 text-violet-500" />
                      <span>Tech Stack Badges ({cs.techStack?.length || 0})</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Type tag & press Enter or comma</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-white dark:bg-[#080b11] border border-slate-200 dark:border-slate-800 min-h-[36px]">
                    {cs.techStack && cs.techStack.length > 0 ? (
                      cs.techStack.map((tech: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-[#131c31] text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...caseStudies];
                              const current = updated[csIdx].techStack || [];
                              updated[csIdx].techStack = current.filter((_: string, i: number) => i !== tIdx);
                              setCaseStudies(updated);
                            }}
                            className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic font-medium px-1">
                        No tech stack tags added yet. Type below to add.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add tech stack tag (e.g. Next.js, Python, Plaid API)..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim().replace(/,/g, "");
                          if (val) {
                            const updated = [...caseStudies];
                            const current = updated[csIdx].techStack || [];
                            if (!current.includes(val)) {
                              updated[csIdx].techStack = [...current, val];
                              setCaseStudies(updated);
                              (e.target as HTMLInputElement).value = "";
                              toast.success(`Added tag "${val}"`);
                            }
                          }
                        }
                      }}
                      className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const val = input.value.trim().replace(/,/g, "");
                          const updated = [...caseStudies];
                          const current = updated[csIdx].techStack || [];
                          if (!current.includes(val)) {
                            updated[csIdx].techStack = [...current, val];
                            setCaseStudies(updated);
                            input.value = "";
                            toast.success(`Added tag "${val}"`);
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
      </div>

      {/* STEP 5: DEEP ARCHITECTURE BREAKDOWN & BENCHMARK SHOWCASE SECTION */}
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

      {/* STEP 6: EXECUTIVE ENDORSEMENTS & TESTIMONIALS SELECTOR */}
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
    </div>
  );
}
