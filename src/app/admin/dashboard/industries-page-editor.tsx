"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
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
} from "lucide-react";
import { DEFAULT_INDUSTRIES_PAGE_DATA } from "@/data/default-industries-data";

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
  const [formData, setFormData] = useState<any>(DEFAULT_INDUSTRIES_PAGE_DATA);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>("fintech");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadIndustriesData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/industries");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
          if (json.data.industries && json.data.industries.length > 0) {
            setSelectedIndustryId(json.data.industries[0].id);
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

  const currentIndustry = formData.industries?.find((ind: any) => ind.id === selectedIndustryId) || formData.industries?.[0];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-4 sm:p-8 space-y-3">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-violet-600 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center">Loading Industries database record...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-4 sm:space-y-6 text-slate-900 dark:text-white">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 overflow-hidden p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
              Industries Page Configurator (/industries & /industries/[id])
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage main industry sector cards, compliance badges, case study projects, and custom industry detail pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_INDUSTRIES_PAGE_DATA)}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-1.5"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: MAIN HERO BANNER */}
      {(!sectionId || sectionId === "ind-hero") && (
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

      {/* SECTION 2: INDUSTRY SECTOR CARDS MANAGER */}
      {(!sectionId || sectionId === "ind-grid") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-xs sm:text-sm font-bold">
                Industry Sector Cards Manager ({formData.industries?.length || 0} Sectors)
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                const uniqueId = `industry-${Date.now().toString().slice(-4)}`;
                const newInd = {
                  id: uniqueId,
                  title: "New Enterprise Sector",
                  subtitle: "Specialized Industry Solution & Automation",
                  desc: "High performance cloud engineering and automated domain workflows.",
                  fullOverview: "Detailed overview narrative for this domain sector.",
                  heroBadge: "Custom Industry Practice",
                  href: `/industries/${uniqueId}`,
                  keyMetrics: [
                    { label: "Execution Speed", value: "3x" },
                    { label: "Audit Accuracy", value: "99.9%" },
                  ],
                  complianceBadges: ["SOC2 Type II", "ISO 27001"],
                  projects: [
                    {
                      id: `proj-${uniqueId}`,
                      title: "Custom Domain Platform",
                      client: "Enterprise Client",
                      desc: "Real-time automated domain workflow engine.",
                      impact: "$10M+ Value Created",
                      liveUrl: "https://clickpoint.com.np",
                      techStack: ["Next.js", "TypeScript"],
                    },
                  ],
                  solutions: [
                    { title: "Automated Workflow Engine", desc: "Domain-specific rule execution." },
                  ],
                  overviewTag: "Sector Perspective",
                  overviewHeading: "Architecting software for enterprise scale",
                  complianceTag: "Compliance & Security",
                  complianceHeading: "Audited architecture protocols",
                  projectsTag: "Live Case Studies",
                  projectsHeading: "Featured projects built for enterprise",
                  solutionsTag: "Target Solutions",
                  solutionsHeading: "Specialized engineering",
                };
                setFormData({ ...formData, industries: [...(formData.industries || []), newInd] });
                setSelectedIndustryId(uniqueId);
                toast.success(`Created new industry sector item (ID: ${uniqueId})!`);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Industry</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {formData.industries?.map((ind: any, idx: number) => (
              <div
                key={ind.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-3 ${
                  selectedIndustryId === ind.id
                    ? "border-violet-500 bg-violet-50/20 dark:bg-violet-950/20 ring-1 ring-violet-500/50"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-100 dark:bg-violet-950 px-2 py-0.5 rounded shrink-0">
                      Industry #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedIndustryId(ind.id)}
                      className={`text-[11px] font-semibold underline transition-colors truncate ${
                        selectedIndustryId === ind.id
                          ? "text-violet-600 font-bold"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {selectedIndustryId === ind.id ? "Currently Editing" : "Edit Details"}
                    </button>
                  </div>

                  {formData.industries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const indToDelete = ind;
                        const updated = formData.industries.filter((i: any) => i.id !== ind.id);
                        setFormData({ ...formData, industries: updated });
                        if (selectedIndustryId === ind.id) {
                          setSelectedIndustryId(updated[0]?.id || "fintech");
                        }
                        toast.success(`Deleted industry "${indToDelete.title}"`);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/50 shrink-0"
                      title="Delete industry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      <LinkIcon className="h-3 w-3 text-violet-500 shrink-0" />
                      ID / Slug
                    </label>
                    <input
                      type="text"
                      value={ind.id}
                      onChange={(e) => {
                        const newId = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                        const updated = [...formData.industries];
                        const oldId = updated[idx].id;
                        updated[idx].id = newId;
                        updated[idx].href = `/industries/${newId}`;
                        setFormData({ ...formData, industries: updated });
                        if (selectedIndustryId === oldId) setSelectedIndustryId(newId);
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs font-mono font-bold text-violet-600 dark:text-violet-400"
                    />
                    <span className="text-[9px] text-slate-400 block truncate">Route: /industries/{ind.id}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Industry Title
                    </label>
                    <input
                      type="text"
                      value={ind.title}
                      onChange={(e) => {
                        const updated = [...formData.industries];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, industries: updated });
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Subtitle Badge Tag
                  </label>
                  <input
                    type="text"
                    value={ind.subtitle || ""}
                    onChange={(e) => {
                      const updated = [...formData.industries];
                      updated[idx].subtitle = e.target.value;
                      setFormData({ ...formData, industries: updated });
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Catalog Card Summary Description
                  </label>
                  <textarea
                    rows={2}
                    value={ind.desc}
                    onChange={(e) => {
                      const updated = [...formData.industries];
                      updated[idx].desc = e.target.value;
                      setFormData({ ...formData, industries: updated });
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: INDIVIDUAL INDUSTRY DETAIL PAGE CONFIGURATOR */}
      {(!sectionId || sectionId === "ind-details") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #03
              </span>
              <h3 className="text-xs sm:text-sm font-bold">
                Individual Industry Detail View Configurator (`/industries/[id]`)
              </h3>
            </div>

            {/* Industry Selector Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-500 shrink-0">Select Industry:</label>
              <select
                value={selectedIndustryId}
                onChange={(e) => setSelectedIndustryId(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-violet-300 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/40 px-3 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 focus:outline-none"
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
                      value={currentIndustry.overviewTag || "Sector Perspective"}
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
                      value={currentIndustry.overviewHeading || `Architecting software for ${currentIndustry.title}`}
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
                        updated[idx].complianceBadges = [...badges, "New Compliance Badge"];
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Badge</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {currentIndustry.complianceBadges?.map((badge: string, bIdx: number) => (
                    <div key={bIdx} className="flex items-center gap-2 bg-white dark:bg-[#0b0f19] p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <input
                        type="text"
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
                        className="text-red-400 hover:text-red-600 p-1 shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 4: Featured Case Studies & Live Projects */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <FolderGit2 className="h-4 w-4 text-violet-500 shrink-0" />
                    Step 4: Featured Projects ({currentIndustry.projects?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.industries];
                      const idx = updated.findIndex((i: any) => i.id === currentIndustry.id);
                      if (idx !== -1) {
                        const projs = updated[idx].projects || [];
                        updated[idx].projects = [
                          ...projs,
                          {
                            id: `proj-${Date.now().toString().slice(-4)}`,
                            title: "New Featured Project",
                            client: "Client Name",
                            desc: "Project summary description",
                            impact: "$5M+ Value Impact",
                            liveUrl: "https://clickpoint.com.np",
                            techStack: ["Next.js", "TypeScript"],
                            imageGradient: "from-violet-600 to-indigo-800",
                          },
                        ];
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentIndustry.projects?.map((proj: any, pIdx: number) => (
                    <div key={proj.id || pIdx} className="p-3 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-violet-600 bg-violet-50 dark:bg-violet-950 px-2 py-0.5 rounded">
                          Project #{pIdx + 1}
                        </span>
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
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
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
                            value={proj.client}
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
                            value={proj.desc}
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
                          { label: "New Metric Label", value: "99%" },
                        ];
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Metric</span>
                  </button>
                </div>

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
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-500">Metric Value</label>
                        <input
                          type="text"
                          value={metric.value}
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
                          value={metric.label}
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
                          { title: "New Domain Solution", desc: "Detailed solution description." },
                        ];
                        setFormData({ ...formData, industries: updated });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Solution</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentIndustry.solutions?.map((sol: any, sIdx: number) => {
                    const solTitle = typeof sol === "string" ? sol : sol.title;
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
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500">Solution Title</label>
                          <input
                            type="text"
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
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}