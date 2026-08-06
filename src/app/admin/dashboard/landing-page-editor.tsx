"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Globe,
  Tag,
  Type,
  Search,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
  ImageIcon,
  CheckCircle2,
  Layers,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Navigation,
  Link as LinkIcon,
  Layout,
  MessageSquare,
  Zap,
  ArrowLeft,
  Settings,
  TrendingUp,
  Sliders,
  Check,
  Building,
  HelpCircle,
  BookOpen,
  Star,
  Milestone,
  FileCode,
  SlidersHorizontal,
} from "lucide-react";
import { DEFAULT_NAVBAR_DATA, DEFAULT_COMPANY_NAV_LINKS, CompanyNavItem } from "@/data/default-navbar-data";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";

interface FileUploadControlProps {
  label: string;
  value: string;
  placeholder?: string;
  helperText?: string;
  onChange: (val: string) => void;
}

function FileUploadControl({
  label,
  value,
  placeholder,
  helperText,
  onChange,
}: FileUploadControlProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

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
        toast.success("Successfully uploaded image!", { id: toastId });
      } else {
        toast.error(data.error || "Failed to upload image", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {helperText && (
          <span className="text-[10px] text-slate-400 font-normal">{helperText}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder={placeholder || "Image URL or file path..."}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ImageIcon className="h-3.5 w-3.5" />
          </span>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                toast.info("Cleared image URL");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 cursor-pointer"
              title="Clear Image URL"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-violet-200 dark:border-violet-800/60 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload Cloudinary</span>
            </>
          )}
        </button>
      </div>

      {value && value.trim() !== "" && (
        <div className="mt-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3">
          <div className="relative h-10 w-28 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 shrink-0 flex items-center justify-center p-1">
            <img src={value} alt="Preview" className="h-full w-auto object-contain" />
          </div>
          <div className="flex-1 overflow-hidden text-[11px]">
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {value.includes("cloudinary.com") ? "Cloudinary Asset" : value}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Active on Live Page
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 12 LANDING PAGE SECTION CARDS METADATA
const LANDING_SECTIONS_CATALOG = [
  {
    id: "navbar",
    number: "01",
    title: "Header Navbar & Brand Logo",
    icon: Navigation,
    desc: "Configure Brand Logo image/text, Navigation Titles, and Company Dropdown links (`/about`, `/journey`, `/careers`, `/case-studies`, `/testimonials`, `/blog`, `/faqs`, `/contact`).",
    badge: "Header Navbar",
  },
  {
    id: "hero",
    number: "02",
    title: "Hero Section & Conversion Copy",
    icon: Zap,
    desc: "Headline titles, pill badge subtext, hero subtitle, and primary/secondary CTA action buttons.",
    badge: "Hero Section",
  },
  {
    id: "stats",
    number: "03",
    title: "Stats & Key Metrics Bar",
    icon: TrendingUp,
    desc: "Configure 4 key statistics counters (Growth Rate, Shipped Projects, Engineers, Tech Stack).",
    badge: "Metrics Bar",
  },
  {
    id: "services",
    number: "04",
    title: "Services Capability Header",
    icon: Layout,
    desc: "Core capabilities badge, headline, and service section description.",
    badge: "Services Section",
  },
  {
    id: "techstack",
    number: "05",
    title: "Tech Stack & Architecture Grid",
    icon: FileCode,
    desc: "Frameworks, AI SDKs, cloud database integrations, and tech stack subheadings.",
    badge: "Tech Stack",
  },
  {
    id: "industries",
    number: "06",
    title: "Industries Domain Expertise Header",
    icon: Building,
    desc: "FinTech, HealthTech, E-Commerce, SaaS & Enterprise domain headers.",
    badge: "Industries Section",
  },
  {
    id: "timeline",
    number: "07",
    title: "Timeline & Our Journey Header",
    icon: Milestone,
    desc: "Milestones, growth timeline section badge, headline, and subtitle.",
    badge: "Timeline Section",
  },
  {
    id: "testimonials",
    number: "08",
    title: "Testimonials & Verified Impact",
    icon: Star,
    desc: "Client review stats, rating trust metrics bar, and testimonial section badge.",
    badge: "Testimonials Section",
  },
  {
    id: "blog",
    number: "09",
    title: "Blog & Engineering Insights Section",
    icon: BookOpen,
    desc: "Technical publication header, badge, and latest blog cards preview configuration.",
    badge: "Blog Section",
  },
  {
    id: "faqs",
    number: "10",
    title: "Help & FAQ Knowledgebase Section",
    icon: HelpCircle,
    desc: "Common questions section header, subtext, and quick contact fallback number.",
    badge: "FAQ Section",
  },
  {
    id: "cta",
    number: "11",
    title: "Call to Action (CTA) Banner",
    icon: Sparkles,
    desc: "Bottom conversion banner headline, gradient callout, and consultation booking CTA button.",
    badge: "CTA Banner",
  },
  {
    id: "footer",
    number: "12",
    title: "Footer Navigation & Brand Credits",
    icon: Globe,
    desc: "Footer copyright text, brand tagline, social links, and legal links.",
    badge: "Footer Section",
  },
];

interface LandingPageEditorProps {
  sectionId?: string | null;
  onCloseSection?: () => void;
}

export default function LandingPageEditor({ sectionId, onCloseSection }: LandingPageEditorProps) {
  const [landingData, setLandingData] = useState<any>(DEFAULT_LANDING_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Active Selected Section for Dedicated Configuration (null = Catalog Overview Grid)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sectionId || null);

  // Sync prop changes
  useEffect(() => {
    if (sectionId !== undefined) {
      setActiveSectionId(sectionId);
    }
  }, [sectionId]);

  // New Company Dropdown Item Input State (Inside Navbar Config)
  const [newCompanyTitle, setNewCompanyTitle] = useState("");
  const [newCompanyDesc, setNewCompanyDesc] = useState("");
  const [newCompanyHref, setNewCompanyHref] = useState("");
  const [newCompanyBadge, setNewCompanyBadge] = useState("");

  async function loadLandingData() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/landing");
      const json = await res.json();
      if (json.success && json.data) {
        setLandingData({
          ...DEFAULT_LANDING_DATA,
          ...json.data,
          navbar: {
            ...DEFAULT_NAVBAR_DATA,
            ...(json.data.navbar || {}),
          },
        });
      }
    } catch (err) {
      toast.error("Failed to load landing page configuration");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLandingData();
  }, []);

  async function handleSaveLandingConfig() {
    setIsSaving(true);
    const toastId = toast.loading("Saving configuration to database...");

    try {
      const res = await fetch("/api/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(landingData),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Landing Page section updated successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save configuration", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save configuration", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  const navbarData = landingData.navbar || DEFAULT_NAVBAR_DATA;

  // Add new Company Dropdown Link
  function handleAddCompanyLink() {
    if (!newCompanyTitle || !newCompanyTitle.trim()) {
      toast.error("Please enter a Title for the link");
      return;
    }

    const title = newCompanyTitle.trim();
    const href = newCompanyHref.trim() || `/${title.toLowerCase().replace(/\s+/g, "-")}`;
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const currentLinks = navbarData.companyLinks || DEFAULT_COMPANY_NAV_LINKS;
    const newItem: CompanyNavItem = {
      id,
      title,
      desc: newCompanyDesc.trim() || "Milestones & details",
      href,
      badge: newCompanyBadge.trim() || undefined,
      order: currentLinks.length + 1,
    };

    setLandingData({
      ...landingData,
      navbar: {
        ...navbarData,
        companyLinks: [...currentLinks, newItem],
      },
    });

    setNewCompanyTitle("");
    setNewCompanyDesc("");
    setNewCompanyHref("");
    setNewCompanyBadge("");
    toast.success(`Added company dropdown link "${title}" -> ${href}`);
  }

  // Update Company Dropdown Link
  function handleUpdateCompanyLink(index: number, key: string, value: any) {
    const currentLinks = [...(navbarData.companyLinks || DEFAULT_COMPANY_NAV_LINKS)];
    currentLinks[index] = {
      ...currentLinks[index],
      [key]: value,
    };
    setLandingData({
      ...landingData,
      navbar: { ...navbarData, companyLinks: currentLinks },
    });
  }

  // Delete Company Dropdown Link
  function handleDeleteCompanyLink(index: number) {
    const currentLinks = [...(navbarData.companyLinks || DEFAULT_COMPANY_NAV_LINKS)];
    const removed = currentLinks[index];
    currentLinks.splice(index, 1);
    setLandingData({
      ...landingData,
      navbar: { ...navbarData, companyLinks: currentLinks },
    });
    toast.info(`Removed dropdown link "${removed.title}"`);
  }

  // Reorder Company Dropdown Link
  function handleMoveCompanyLink(index: number, direction: "up" | "down") {
    const currentLinks = [...(navbarData.companyLinks || DEFAULT_COMPANY_NAV_LINKS)];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= currentLinks.length) return;

    const temp = currentLinks[index];
    currentLinks[index] = currentLinks[targetIndex];
    currentLinks[targetIndex] = temp;

    setLandingData({
      ...landingData,
      navbar: { ...navbarData, companyLinks: currentLinks },
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] p-8 space-y-3">
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading Landing Page database configuration...</p>
      </div>
    );
  }

  const currentSectionMeta = LANDING_SECTIONS_CATALOG.find((s) => s.id === activeSectionId);

  // =========================================================================
  // VIEW MODE A: DEDICATED INDIVIDUAL SECTION EDITOR WORKSPACE
  // =========================================================================
  if (activeSectionId && currentSectionMeta) {
    const SectionIcon = currentSectionMeta.icon;

    return (
      <div className="w-full min-w-0 max-w-full space-y-6 text-slate-900 dark:text-white">
        {/* TOP DEDICATED SECTION NAVIGATION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveSectionId(null);
                if (onCloseSection) onCloseSection();
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Landing Sections</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  #{currentSectionMeta.number}
                </span>
                <SectionIcon className="h-4 w-4 text-violet-600" />
                <h2 className="text-sm font-extrabold truncate max-w-md">
                  {currentSectionMeta.title}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {currentSectionMeta.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveSectionId(null);
                if (onCloseSection) onCloseSection();
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveLandingConfig}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isSaving ? "Saving..." : "Save Section Config"}</span>
            </button>
          </div>
        </div>

        {/* SECTION 01: HEADER NAVBAR & COMPANY DROPDOWNS CONFIGURATOR */}
        {activeSectionId === "navbar" && (
          <div className="space-y-6">
            {/* BRAND LOGO & MENU TITLES */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  01.A
                </span>
                <h3 className="text-sm font-bold">Brand Logo & Top Navbar Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Name Text (Fallback if no image logo)
                  </label>
                  <input
                    type="text"
                    value={navbarData.logo?.brandName || ""}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        navbar: {
                          ...navbarData,
                          logo: { ...navbarData.logo, brandName: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    "Our Journey" Standalone Nav Title
                  </label>
                  <input
                    type="text"
                    value={navbarData.menuTitles?.journey || "Our Journey"}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        navbar: {
                          ...navbarData,
                          menuTitles: { ...navbarData.menuTitles, journey: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <FileUploadControl
                    label="Brand Logo Image (Cloudinary Supported)"
                    value={navbarData.logo?.logoUrl || ""}
                    placeholder="e.g. /images/clickpointfinal.png or Cloudinary URL"
                    helperText="Recommended height: 36px to 42px PNG/SVG transparent logo"
                    onChange={(val) =>
                      setLandingData({
                        ...landingData,
                        navbar: {
                          ...navbarData,
                          logo: { ...navbarData.logo, logoUrl: val },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* COMPANY DROPDOWN LINKS & REDIRECT TARGET URLS */}
            <div className="rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-violet-50/20 to-white dark:from-[#131927] dark:to-[#131927] p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-violet-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                      01.B
                    </span>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-violet-600 shrink-0" />
                      Company Dropdown Links & Redirect Target URLs ({(navbarData.companyLinks || DEFAULT_COMPANY_NAV_LINKS).length} Items)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Configure items displayed inside the <strong>Company Dropdown Menu</strong> (`/about`, `/journey`, `/careers`, `/case-studies`, `/testimonials`, `/blog`, `/faqs`, `/contact`).
                  </p>
                </div>
              </div>

              {/* Add New Link Box */}
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-200 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-violet-700 dark:text-violet-300">Add New Company Dropdown Link</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Title (e.g. Press Release)..."
                    value={newCompanyTitle}
                    onChange={(e) => setNewCompanyTitle(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g. Media kit)..."
                    value={newCompanyDesc}
                    onChange={(e) => setNewCompanyDesc(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Redirect URL (e.g. /press)..."
                    value={newCompanyHref}
                    onChange={(e) => setNewCompanyHref(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-violet-600 dark:text-violet-400 font-mono font-bold"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Badge (e.g. New)..."
                      value={newCompanyBadge}
                      onChange={(e) => setNewCompanyBadge(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleAddCompanyLink}
                      className="px-4 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* LIST OF COMPANY DROPDOWN LINKS */}
              <div className="space-y-3">
                {(navbarData.companyLinks || DEFAULT_COMPANY_NAV_LINKS).map((item: CompanyNavItem, idx: number) => (
                  <div
                    key={item.id || idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-mono text-xs font-bold text-slate-400 w-6 shrink-0">
                        0{idx + 1}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Link Title</label>
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => handleUpdateCompanyLink(idx, "title", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-900 dark:text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Subtitle Description</label>
                          <input
                            type="text"
                            value={item.desc || ""}
                            onChange={(e) => handleUpdateCompanyLink(idx, "desc", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Redirect Target URL Route</label>
                          <input
                            type="text"
                            value={item.href || ""}
                            onChange={(e) => handleUpdateCompanyLink(idx, "href", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-violet-600 dark:text-violet-400 font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveCompanyLink(idx, "up")}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === (navbarData.companyLinks || DEFAULT_COMPANY_NAV_LINKS).length - 1}
                        onClick={() => handleMoveCompanyLink(idx, "down")}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCompanyLink(idx)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                        title="Delete Link"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NAVBAR ACTION CTA BUTTON SETTINGS */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  01.C
                </span>
                <h3 className="text-sm font-bold">Navbar Right Action Button (CTA)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CTA Button Label Text
                  </label>
                  <input
                    type="text"
                    value={navbarData.cta?.buttonText || "Quick Enquiry"}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        navbar: {
                          ...navbarData,
                          cta: { ...navbarData.cta, buttonText: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-extrabold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Redirect Target URL (If modal disabled)
                  </label>
                  <input
                    type="text"
                    value={navbarData.cta?.buttonLink || "/contact"}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        navbar: {
                          ...navbarData,
                          cta: { ...navbarData.cta, buttonLink: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-violet-600 dark:text-violet-400 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 02: HERO SECTION CONTENT */}
        {activeSectionId === "hero" && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                02
              </span>
              <h3 className="text-sm font-bold">Hero Section Copy & Action Buttons</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Top Pill Badge Main Text
                </label>
                <input
                  type="text"
                  value={landingData.hero?.badge || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, badge: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Top Pill Badge Subtext
                </label>
                <input
                  type="text"
                  value={landingData.hero?.badgeSubtext || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, badgeSubtext: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Title (Prefix)
                </label>
                <input
                  type="text"
                  value={landingData.hero?.title || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Title Highlight (Orange/Gradient Text)
                </label>
                <input
                  type="text"
                  value={landingData.hero?.titleHighlight || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, titleHighlight: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-amber-500 font-extrabold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Subtitle / Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={landingData.hero?.subtitle || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-3 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={landingData.hero?.primaryCtaText || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, primaryCtaText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={landingData.hero?.secondaryCtaText || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, secondaryCtaText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* GENERIC SECTION FORM EDITOR FOR SECTIONS #03 TO #12 */}
        {["services", "industries", "timeline", "cta"].includes(activeSectionId) && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #{currentSectionMeta.number}
              </span>
              <h3 className="text-sm font-bold">{currentSectionMeta.title} Copy Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Pill Badge Text
                </label>
                <input
                  type="text"
                  value={landingData[`${activeSectionId}Header`]?.badge || landingData[activeSectionId]?.badge || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      [`${activeSectionId}Header`]: {
                        ...landingData[`${activeSectionId}Header`],
                        badge: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Title Prefix
                </label>
                <input
                  type="text"
                  value={landingData[`${activeSectionId}Header`]?.title || landingData[activeSectionId]?.title || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      [`${activeSectionId}Header`]: {
                        ...landingData[`${activeSectionId}Header`],
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Title Highlight (Orange/Gradient)
                </label>
                <input
                  type="text"
                  value={landingData[`${activeSectionId}Header`]?.titleHighlight || landingData[activeSectionId]?.titleHighlight || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      [`${activeSectionId}Header`]: {
                        ...landingData[`${activeSectionId}Header`],
                        titleHighlight: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-amber-500 font-extrabold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Subtitle / Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={landingData[`${activeSectionId}Header`]?.subtitle || landingData[activeSectionId]?.subtitle || ""}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      [`${activeSectionId}Header`]: {
                        ...landingData[`${activeSectionId}Header`],
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-3 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE B: CATALOG OVERVIEW GRID (SHOWS ALL 12 LANDING CONFIGURE BOXES)
  // =========================================================================
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-6 text-slate-900 dark:text-white">
      {/* TOP HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h2 className="text-base font-extrabold tracking-tight">
              Landing Page Overview (12 Section Configure Boxes)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click on any section card below to open its dedicated configurator workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setLandingData(DEFAULT_LANDING_DATA)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveLandingConfig}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save All Configs"}</span>
          </button>
        </div>
      </div>

      {/* 12 LANDING CONFIGURE BOXES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LANDING_SECTIONS_CATALOG.map((sec) => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-600/10"
            >
              <div>
                {/* Header Badge & Number */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-black text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
                    #{sec.number}
                  </span>

                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Active Live</span>
                  </span>
                </div>

                {/* Section Title & Icon */}
                <div className="flex items-start gap-3 mt-2">
                  <span className="p-2.5 rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors leading-snug">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Configure Section Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {sec.badge}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveSectionId(sec.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Configure Box</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
