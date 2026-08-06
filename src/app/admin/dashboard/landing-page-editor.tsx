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
  Boxes,
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
  Calculator,
  Code2,
} from "lucide-react";
import { DEFAULT_NAVBAR_DATA, DEFAULT_COMPANY_NAV_LINKS, CompanyNavItem } from "@/data/default-navbar-data";
import {
  DEFAULT_LANDING_DATA,
  DEFAULT_TECH_CATEGORIES,
  DEFAULT_TECH_ITEMS,
  DEFAULT_STATS_HEADER,
  DEFAULT_STATS_DATA,
  DEFAULT_FOOTER_DATA,
} from "@/data/default-landing-data";
import { SERVICES_DATA, INDUSTRIES_DATA } from "@/data/landing-data";

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
    desc: "Configure the section badge, title, subtitle, and add/edit/reorder/remove any number of animated stat counters.",
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

  // Available items for manual selection on landing page
  const [availableFaqs, setAvailableFaqs] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [availableIndustries, setAvailableIndustries] = useState<any[]>([]);
  const [availableTestimonials, setAvailableTestimonials] = useState<any[]>([]);
  const [availableBlogPosts, setAvailableBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    if (activeSectionId === "faqs" || activeSectionId === "faq") {
      async function loadFaqsForSelector() {
        try {
          const res = await fetch("/api/faqs");
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setAvailableFaqs(json.data);
          }
        } catch (err) {
          console.warn("Failed to load FAQs for selector:", err);
        }
      }
      loadFaqsForSelector();
    }

    if (activeSectionId === "services") {
      async function loadServicesForSelector() {
        try {
          const res = await fetch("/api/services");
          const json = await res.json();
          if (json.success && json.data && Array.isArray(json.data.services) && json.data.services.length > 0) {
            setAvailableServices(json.data.services);
          } else {
            setAvailableServices(SERVICES_DATA);
          }
        } catch (err) {
          setAvailableServices(SERVICES_DATA);
        }
      }
      loadServicesForSelector();
    }

    if (activeSectionId === "industries") {
      async function loadIndustriesForSelector() {
        try {
          const res = await fetch("/api/industries");
          const json = await res.json();
          if (json.success && json.data && Array.isArray(json.data.industries) && json.data.industries.length > 0) {
            setAvailableIndustries(json.data.industries);
          } else {
            setAvailableIndustries(INDUSTRIES_DATA);
          }
        } catch (err) {
          setAvailableIndustries(INDUSTRIES_DATA);
        }
      }
      loadIndustriesForSelector();
    }

    if (activeSectionId === "testimonials") {
      async function loadTestimonialsForSelector() {
        try {
          const res = await fetch("/api/testimonials");
          const json = await res.json();
          if (json.success && json.data && Array.isArray(json.data.testimonials)) {
            const approved = json.data.testimonials.filter((t: any) => t.status === "APPROVED" || !t.status);
            setAvailableTestimonials(approved);
          }
        } catch (err) {
          console.warn("Failed to load testimonials for selector:", err);
        }
      }
      loadTestimonialsForSelector();
    }

    if (activeSectionId === "blog") {
      async function loadBlogsForSelector() {
        try {
          const res = await fetch("/api/blog/posts");
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setAvailableBlogPosts(json.data);
          } else {
            const res2 = await fetch("/api/blog");
            const json2 = await res2.json();
            if (json2.success && json2.data && Array.isArray(json2.data.posts)) {
              setAvailableBlogPosts(json2.data.posts);
            }
          }
        } catch (err) {
          console.warn("Failed to load blog posts for selector:", err);
        }
      }
      loadBlogsForSelector();
    }
  }, [activeSectionId]);

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

  // New Pillar Input State (Inside Hero Config)
  const [newPillarText, setNewPillarText] = useState("");

  // Hero Value Pillars CRUD Handlers
  function handleAddPillar() {
    if (!newPillarText || !newPillarText.trim()) {
      toast.error("Please enter pillar title text");
      return;
    }
    const currentPillars = landingData.hero?.pillars || DEFAULT_LANDING_DATA.hero.pillars;
    setLandingData({
      ...landingData,
      hero: {
        ...landingData.hero,
        pillars: [...currentPillars, newPillarText.trim()],
      },
    });
    setNewPillarText("");
    toast.success(`Added value pillar "${newPillarText.trim()}"`);
  }

  function handleUpdatePillar(index: number, value: string) {
    const currentPillars = [...(landingData.hero?.pillars || DEFAULT_LANDING_DATA.hero.pillars)];
    currentPillars[index] = value;
    setLandingData({
      ...landingData,
      hero: { ...landingData.hero, pillars: currentPillars },
    });
  }

  function handleDeletePillar(index: number) {
    const currentPillars = [...(landingData.hero?.pillars || DEFAULT_LANDING_DATA.hero.pillars)];
    const removed = currentPillars[index];
    currentPillars.splice(index, 1);
    setLandingData({
      ...landingData,
      hero: { ...landingData.hero, pillars: currentPillars },
    });
    toast.info(`Removed pillar "${removed}"`);
  }

  function handleMovePillar(index: number, direction: "up" | "down") {
    const currentPillars = [...(landingData.hero?.pillars || DEFAULT_LANDING_DATA.hero.pillars)];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentPillars.length) return;
    const temp = currentPillars[index];
    currentPillars[index] = currentPillars[targetIndex];
    currentPillars[targetIndex] = temp;
    setLandingData({
      ...landingData,
      hero: { ...landingData.hero, pillars: currentPillars },
    });
  }

  // Tech Stack & Categories Input State (Inside TechStack Config)
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTechName, setNewTechName] = useState("");
  const [newTechCategory, setNewTechCategory] = useState("Web Development");
  const [newTechTagline, setNewTechTagline] = useState("");
  const [newTechIconUrl, setNewTechIconUrl] = useState("");

  // Tech Category CRUD Handlers
  function handleAddTechCategory() {
    if (!newCategoryName || !newCategoryName.trim()) {
      toast.error("Please enter a Category name");
      return;
    }
    const name = newCategoryName.trim();
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const currentCategories = landingData.techCategories || DEFAULT_TECH_CATEGORIES;
    setLandingData({
      ...landingData,
      techCategories: [...currentCategories, { id, name }],
    });
    setNewCategoryName("");
    toast.success(`Created tech category "${name}"`);
  }

  function handleDeleteTechCategory(id: string) {
    const currentCategories = [...(landingData.techCategories || DEFAULT_TECH_CATEGORIES)];
    const filtered = currentCategories.filter((c) => c.id !== id);
    setLandingData({
      ...landingData,
      techCategories: filtered,
    });
    toast.info("Deleted tech category");
  }

  // Tech Item CRUD Handlers
  function handleAddTechItem() {
    if (!newTechName || !newTechName.trim()) {
      toast.error("Please enter technology name");
      return;
    }
    const name = newTechName.trim();
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const currentItems = landingData.techItems || DEFAULT_TECH_ITEMS;

    const newItem = {
      id,
      name,
      category: newTechCategory,
      tagline: newTechTagline.trim() || `${name} Integration`,
      iconUrl: newTechIconUrl.trim(),
    };

    setLandingData({
      ...landingData,
      techItems: [newItem, ...currentItems],
    });

    setNewTechName("");
    setNewTechTagline("");
    setNewTechIconUrl("");
    toast.success(`Added technology "${name}" under ${newTechCategory}!`);
  }

  function handleUpdateTechItem(index: number, key: string, value: any) {
    const currentItems = [...(landingData.techItems || DEFAULT_TECH_ITEMS)];
    currentItems[index] = {
      ...currentItems[index],
      [key]: value,
    };
    setLandingData({
      ...landingData,
      techItems: currentItems,
    });
  }

  function handleDeleteTechItem(index: number) {
    const currentItems = [...(landingData.techItems || DEFAULT_TECH_ITEMS)];
    const removed = currentItems[index];
    currentItems.splice(index, 1);
    setLandingData({
      ...landingData,
      techItems: currentItems,
    });
    toast.info(`Removed "${removed.name}" from tech stack`);
  }

  function handleMoveTechItem(index: number, direction: "up" | "down") {
    const currentItems = [...(landingData.techItems || DEFAULT_TECH_ITEMS)];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentItems.length) return;
    const temp = currentItems[index];
    currentItems[index] = currentItems[targetIndex];
    currentItems[targetIndex] = temp;
    setLandingData({
      ...landingData,
      techItems: currentItems,
    });
  }

  // Stats & Key Metrics Input State (Inside Stats Config)
  const [newStatLabel, setNewStatLabel] = useState("");
  const [newStatValue, setNewStatValue] = useState("");
  const [newStatSuffix, setNewStatSuffix] = useState("+");

  // Stats Item CRUD Handlers
  function handleAddStatItem() {
    if (!newStatLabel || !newStatLabel.trim()) {
      toast.error("Please enter a stat label");
      return;
    }
    if (newStatValue === "" || isNaN(Number(newStatValue))) {
      toast.error("Please enter a valid numeric stat value");
      return;
    }
    const label = newStatLabel.trim();
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const currentStats = landingData.stats || DEFAULT_STATS_DATA;

    const newItem = {
      id,
      value: Number(newStatValue),
      suffix: newStatSuffix.trim(),
      label,
    };

    setLandingData({
      ...landingData,
      stats: [...currentStats, newItem],
    });

    setNewStatLabel("");
    setNewStatValue("");
    setNewStatSuffix("+");
    toast.success(`Added stat metric "${label}"`);
  }

  function handleUpdateStatItem(index: number, key: string, value: any) {
    const currentStats = [...(landingData.stats || DEFAULT_STATS_DATA)];
    currentStats[index] = {
      ...currentStats[index],
      [key]: key === "value" ? Number(value) || 0 : value,
    };
    setLandingData({
      ...landingData,
      stats: currentStats,
    });
  }

  function handleDeleteStatItem(index: number) {
    const currentStats = [...(landingData.stats || DEFAULT_STATS_DATA)];
    const removed = currentStats[index];
    currentStats.splice(index, 1);
    setLandingData({
      ...landingData,
      stats: currentStats,
    });
    toast.info(`Removed stat metric "${removed.label}"`);
  }

  function handleMoveStatItem(index: number, direction: "up" | "down") {
    const currentStats = [...(landingData.stats || DEFAULT_STATS_DATA)];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentStats.length) return;
    const temp = currentStats[index];
    currentStats[index] = currentStats[targetIndex];
    currentStats[targetIndex] = temp;
    setLandingData({
      ...landingData,
      stats: currentStats,
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {/* Section Info & Back Button */}
          <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => {
                setActiveSectionId(null);
                if (onCloseSection) onCloseSection();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Back to All Landing Sections</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded shrink-0">
                  #{currentSectionMeta.number}
                </span>
                <SectionIcon className="h-4 w-4 text-violet-600 shrink-0" />
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {currentSectionMeta.title}
                </h2>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
                {currentSectionMeta.desc}
              </p>
            </div>
          </div>

          {/* Right Actions: Cancel & Save Section Config */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/60 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                setActiveSectionId(null);
                if (onCloseSection) onCloseSection();
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveLandingConfig}
              className="px-4 sm:px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Save className="h-4 w-4 shrink-0" />}
              <span className="whitespace-nowrap">{isSaving ? "Saving..." : "Save Section Config"}</span>
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

              {/* HERO VALUE PILLARS CONFIGURATOR (FULL CRUD: ADD, EDIT, DELETE, REORDER) */}
              <div className="md:col-span-2 p-4 rounded-xl bg-violet-500/10 border border-violet-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-violet-600" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                      Hero Key Value Pillars (Checkmark Badges)
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {(landingData.hero?.pillars || DEFAULT_LANDING_DATA.hero.pillars).length} Pillars Active
                  </span>
                </div>

                {/* Add New Pillar Input Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter new value pillar (e.g. SOC2 Type II Certified)..."
                    value={newPillarText}
                    onChange={(e) => setNewPillarText(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddPillar}
                    className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Pillar</span>
                  </button>
                </div>

                {/* List of Hero Value Pillars with Edit, Move, Delete */}
                <div className="space-y-2">
                  {(landingData.hero?.pillars || DEFAULT_LANDING_DATA.hero.pillars).map((pillar: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <input
                          type="text"
                          value={pillar}
                          onChange={(e) => handleUpdatePillar(idx, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMovePillar(idx, "up")}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-violet-600 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (landingData.hero?.pillars || DEFAULT_LANDING_DATA.hero.pillars).length - 1}
                          onClick={() => handleMovePillar(idx, "down")}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-violet-600 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePillar(idx)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 cursor-pointer ml-1"
                          title="Delete Pillar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                  Primary Button Redirect URL Link
                </label>
                <input
                  type="text"
                  value={landingData.hero?.primaryCtaLink || "/contact"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, primaryCtaLink: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-violet-600 dark:text-violet-400 font-mono font-bold"
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Secondary Button Redirect URL Link
                </label>
                <input
                  type="text"
                  value={landingData.hero?.secondaryCtaLink || "/case-studies"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, secondaryCtaLink: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-violet-600 dark:text-violet-400 font-mono font-bold"
                />
              </div>

              {/* ESTIMATOR WIDGET CONTROLS */}
              <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-violet-600" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Instant Development Estimator Configurator
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Estimator Box Header Title
                    </label>
                    <input
                      type="text"
                      value={landingData.hero?.estimatorTitle || "Instant Development Estimator"}
                      onChange={(e) =>
                        setLandingData({
                          ...landingData,
                          hero: { ...landingData.hero, estimatorTitle: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Option 1 (MVP) Title & Weeks
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Title..."
                        value={landingData.hero?.estimatorMvpTitle || "AI MVP / Prototype"}
                        onChange={(e) =>
                          setLandingData({
                            ...landingData,
                            hero: { ...landingData.hero, estimatorMvpTitle: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Wks"
                        value={landingData.hero?.estimatorMvpWeeks || 3}
                        onChange={(e) =>
                          setLandingData({
                            ...landingData,
                            hero: { ...landingData.hero, estimatorMvpWeeks: Number(e.target.value) },
                          })
                        }
                        className="w-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2 py-1.5 text-xs font-bold font-mono text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Option 2 (Enterprise) Title & Weeks
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Title..."
                        value={landingData.hero?.estimatorScaleTitle || "Full Enterprise Product"}
                        onChange={(e) =>
                          setLandingData({
                            ...landingData,
                            hero: { ...landingData.hero, estimatorScaleTitle: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Wks"
                        value={landingData.hero?.estimatorScaleWeeks || 8}
                        onChange={(e) =>
                          setLandingData({
                            ...landingData,
                            hero: { ...landingData.hero, estimatorScaleWeeks: Number(e.target.value) },
                          })
                        }
                        className="w-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2 py-1.5 text-xs font-bold font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* HERO RIGHT SHOWCASE MEDIA & CLOUDINARY UPLOAD */}
              <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-violet-600" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Hero Right Media Showcase & Image Configurator
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Showcase Window Title Label
                    </label>
                    <input
                      type="text"
                      value={landingData.hero?.showcaseTitle || "clickpoint-studio-v2.ts"}
                      onChange={(e) =>
                        setLandingData({
                          ...landingData,
                          hero: { ...landingData.hero, showcaseTitle: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Overlay Badge (Top Left)
                    </label>
                    <input
                      type="text"
                      value={landingData.hero?.showcaseBadgeTopLeft || "99.9% Uptime SLA"}
                      onChange={(e) =>
                        setLandingData({
                          ...landingData,
                          hero: { ...landingData.hero, showcaseBadgeTopLeft: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Overlay Badge (Bottom Right)
                    </label>
                    <input
                      type="text"
                      value={landingData.hero?.showcaseBadgeBottomRight || "Autonomous AI RAG Engine"}
                      onChange={(e) =>
                        setLandingData({
                          ...landingData,
                          hero: { ...landingData.hero, showcaseBadgeBottomRight: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FileUploadControl
                      label="Hero Right Showcase Image (Cloudinary Supported)"
                      value={landingData.hero?.imageUrl || ""}
                      placeholder="e.g. Unsplash URL or Upload Cloudinary Image"
                      helperText="Displayed inside 3D glassmorphic studio canvas"
                      onChange={(val) =>
                        setLandingData({
                          ...landingData,
                          hero: { ...landingData.hero, imageUrl: val },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Social Proof Text (Displayed under Testimonials Rating)
                </label>
                <input
                  type="text"
                  value={landingData.hero?.socialProofText || "Engineered 50+ successful web & AI applications"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      hero: { ...landingData.hero, socialProofText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 03: STATS & KEY METRICS BAR CONFIGURATOR */}
        {activeSectionId === "stats" && (
          <div className="space-y-6">
            {/* HEADER COPY CONFIGURATOR */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  03.A
                </span>
                <h3 className="text-sm font-bold">Stats Section Header Copy</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={landingData.statsHeader?.badge ?? DEFAULT_STATS_HEADER.badge}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        statsHeader: { ...landingData.statsHeader, badge: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Title Prefix Text
                  </label>
                  <input
                    type="text"
                    value={landingData.statsHeader?.title ?? DEFAULT_STATS_HEADER.title}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        statsHeader: { ...landingData.statsHeader, title: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Title Highlight (Orange/Gradient Text)
                  </label>
                  <input
                    type="text"
                    value={landingData.statsHeader?.titleHighlight ?? DEFAULT_STATS_HEADER.titleHighlight}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        statsHeader: { ...landingData.statsHeader, titleHighlight: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-amber-500 font-extrabold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={landingData.statsHeader?.subtitle ?? DEFAULT_STATS_HEADER.subtitle}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        statsHeader: { ...landingData.statsHeader, subtitle: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-3 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* STAT METRICS CONFIGURATOR (FULL CRUD) */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                    03.B
                  </span>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-violet-600" />
                    Key Metrics Counters ({(landingData.stats || DEFAULT_STATS_DATA).length} Stats)
                  </h3>
                </div>
              </div>

              {/* Add New Stat Item Box */}
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-200 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-violet-700 dark:text-violet-300">Add New Stat Counter</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Value (e.g. 89)..."
                    value={newStatValue}
                    onChange={(e) => setNewStatValue(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                  />

                  <input
                    type="text"
                    placeholder="Suffix (e.g. %, +)..."
                    value={newStatSuffix}
                    onChange={(e) => setNewStatSuffix(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                  />

                  <input
                    type="text"
                    placeholder="Label (e.g. Growth in business value)..."
                    value={newStatLabel}
                    onChange={(e) => setNewStatLabel(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddStatItem}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Stat Counter</span>
                </button>
              </div>

              {/* LIST OF STAT ITEMS */}
              <div className="space-y-3">
                {(landingData.stats || DEFAULT_STATS_DATA).map((item: any, idx: number) => (
                  <div
                    key={item.id || idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="font-mono text-xs font-bold text-slate-400 w-6 shrink-0">
                        {idx + 1}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 min-w-0">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Value</label>
                          <input
                            type="number"
                            value={item.value ?? 0}
                            onChange={(e) => handleUpdateStatItem(idx, "value", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-900 dark:text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Suffix</label>
                          <input
                            type="text"
                            value={item.suffix || ""}
                            onChange={(e) => handleUpdateStatItem(idx, "suffix", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-900 dark:text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Label</label>
                          <input
                            type="text"
                            value={item.label || ""}
                            onChange={(e) => handleUpdateStatItem(idx, "label", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStatItem(idx, "up")}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === (landingData.stats || DEFAULT_STATS_DATA).length - 1}
                        onClick={() => handleMoveStatItem(idx, "down")}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteStatItem(idx)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                        title="Delete Stat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 08: TESTIMONIALS SECTION — MANAGED VIA DEDICATED TESTIMONIALS PAGE EDITOR */}
        {activeSectionId === "testimonials" && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #08
              </span>
              <h3 className="text-sm font-bold">Testimonials Section Copy Configuration</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The landing page pulls its testimonials badge, title, subtitle, rating trust metrics,
              review button, and "Explore All Testimonials" button live from the same content used on the
              public <span className="font-bold text-slate-700 dark:text-slate-300">/testimonials</span> page.
              To edit that copy, open{" "}
              <span className="font-bold text-violet-600 dark:text-violet-300">
                Testimonials Page → Testimonials &amp; Reviews Section
              </span>{" "}
              in the sidebar. Changes made there update this landing section automatically — no separate
              configuration is needed here.
            </p>
          </div>
        )}

        {/* SECTION 05: TECH STACK & ARCHITECTURE CONFIGURATOR */}
        {activeSectionId === "techstack" && (
          <div className="space-y-6">
            {/* HEADER COPY CONFIGURATOR */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  05.A
                </span>
                <h3 className="text-sm font-bold">Tech Stack Section Header Copy</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={landingData.techStackHeader?.badge || "Tech Stack & Architecture"}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        techStackHeader: { ...landingData.techStackHeader, badge: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Title Prefix Text
                  </label>
                  <input
                    type="text"
                    value={landingData.techStackHeader?.title || "Built with Modern"}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        techStackHeader: { ...landingData.techStackHeader, title: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Title Highlight (Orange/Gradient Text)
                  </label>
                  <input
                    type="text"
                    value={landingData.techStackHeader?.titleHighlight || "Battle-Tested Technologies"}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        techStackHeader: { ...landingData.techStackHeader, titleHighlight: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-amber-500 font-extrabold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={landingData.techStackHeader?.subtitle || "We leverage cutting-edge frameworks, cloud platforms, and AI SDKs to build enterprise-grade software."}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        techStackHeader: { ...landingData.techStackHeader, subtitle: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-3 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* TECH CATEGORIES CONFIGURATOR (FULL CRUD) */}
            <div className="rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-violet-50/20 to-white dark:from-[#131927] dark:to-[#131927] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                    05.B
                  </span>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-violet-600" />
                    Tech Stack Categories ({(landingData.techCategories || DEFAULT_TECH_CATEGORIES).length} Categories)
                  </h3>
                </div>
              </div>

              {/* Add New Category Box */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-500/10 border border-violet-200 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Create new Tech Category (e.g. AI & LLM Infra)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={handleAddTechCategory}
                  className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Category Badges Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(landingData.techCategories || DEFAULT_TECH_CATEGORIES).map((cat: any) => (
                  <div
                    key={cat.id || cat.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <span>{cat.name}</span>
                    {cat.id !== "all" && cat.name !== "All Technologies" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTechCategory(cat.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* TECH STACK ITEMS CONFIGURATOR (FULL CRUD WITH CLOUDINARY LOGO UPLOAD) */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                    05.C
                  </span>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-violet-600" />
                    Tech Stack Items Grid ({(landingData.techItems || DEFAULT_TECH_ITEMS).length} Technologies)
                  </h3>
                </div>
              </div>

              {/* Add New Tech Stack Item Box */}
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-200 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-violet-700 dark:text-violet-300">Add New Technology to Stack</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Tech Name (e.g. OpenAI GPT-4o)..."
                    value={newTechName}
                    onChange={(e) => setNewTechName(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                  />

                  <select
                    value={newTechCategory}
                    onChange={(e) => setNewTechCategory(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-bold"
                  >
                    {(landingData.techCategories || DEFAULT_TECH_CATEGORIES)
                      .filter((c: any) => c.id !== "all" && c.name !== "All Technologies")
                      .map((c: any) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Tagline / Subtext (e.g. LLM RAG Pipeline)..."
                    value={newTechTagline}
                    onChange={(e) => setNewTechTagline(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-medium"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <div className="flex-1">
                    <FileUploadControl
                      label="Tech Logo Image (PNG / SVG via Cloudinary)"
                      value={newTechIconUrl}
                      placeholder="e.g. Cloudinary Image URL or PNG link..."
                      onChange={(val) => setNewTechIconUrl(val)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTechItem}
                    className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-end"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Technology</span>
                  </button>
                </div>
              </div>

              {/* LIST OF TECH STACK ITEMS */}
              <div className="space-y-3">
                {(landingData.techItems || DEFAULT_TECH_ITEMS).map((item: any, idx: number) => (
                  <div
                    key={item.id || idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="font-mono text-xs font-bold text-slate-400 w-6 shrink-0">
                        {idx + 1}
                      </span>

                      {/* Image Logo Thumbnail */}
                      <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        {item.iconUrl ? (
                          <img src={item.iconUrl} alt={item.name} className="h-full w-full object-contain" />
                        ) : (
                          <Code2 className="h-5 w-5 text-violet-600" />
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 min-w-0">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Tech Name</label>
                          <input
                            type="text"
                            value={item.name || ""}
                            onChange={(e) => handleUpdateTechItem(idx, "name", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-900 dark:text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Category</label>
                          <select
                            value={item.category || "Web Development"}
                            onChange={(e) => handleUpdateTechItem(idx, "category", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-900 dark:text-white font-bold"
                          >
                            {(landingData.techCategories || DEFAULT_TECH_CATEGORIES)
                              .filter((c: any) => c.id !== "all" && c.name !== "All Technologies")
                              .map((c: any) => (
                                <option key={c.id || c.name} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Tagline / Subtext</label>
                          <input
                            type="text"
                            value={item.tagline || ""}
                            onChange={(e) => handleUpdateTechItem(idx, "tagline", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveTechItem(idx, "up")}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === (landingData.techItems || DEFAULT_TECH_ITEMS).length - 1}
                        onClick={() => handleMoveTechItem(idx, "down")}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTechItem(idx)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                        title="Delete Tech Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 11: CALL TO ACTION (CTA) BANNER CONFIGURATOR */}
        {activeSectionId === "cta" && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                11
              </span>
              <h3 className="text-sm font-bold">Universal Call to Action (CTA) Banner Configurator</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This CTA section is rendered above the footer across <strong>ALL website pages</strong> (Landing Page, About Us, Services, Case Studies, Careers, Blog, Contact, FAQs).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Top Pill Badge Text
                </label>
                <input
                  type="text"
                  value={landingData.ctaBanner?.badge || "Ready to Scale?"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      ctaBanner: { ...landingData.ctaBanner, badge: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Headline Prefix Text
                </label>
                <input
                  type="text"
                  value={landingData.ctaBanner?.title || "Let's Build Your Next"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      ctaBanner: { ...landingData.ctaBanner, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Headline Gradient Highlight Text
                </label>
                <input
                  type="text"
                  value={landingData.ctaBanner?.titleHighlight || "Breakthrough Product"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      ctaBanner: { ...landingData.ctaBanner, titleHighlight: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-amber-500 font-extrabold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CTA Banner Subtitle / Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={landingData.ctaBanner?.subtitle || "Partner with our engineering team to design, build, and launch software systems that outperform."}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      ctaBanner: { ...landingData.ctaBanner, subtitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-3 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary CTA Button Label Text
                </label>
                <input
                  type="text"
                  value={landingData.ctaBanner?.buttonText || "Schedule Technical Consultation"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      ctaBanner: { ...landingData.ctaBanner, buttonText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary CTA Button Redirect URL Route
                </label>
                <input
                  type="text"
                  value={landingData.ctaBanner?.buttonLink || "/contact"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      ctaBanner: { ...landingData.ctaBanner, buttonLink: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-violet-600 dark:text-violet-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Secondary Button Label Text
                </label>
                <input
                  type="text"
                  value={landingData.ctaBanner?.secondaryButtonText || "Explore Case Studies"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      ctaBanner: { ...landingData.ctaBanner, secondaryButtonText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Secondary Button Redirect URL Route
                </label>
                <input
                  type="text"
                  value={landingData.ctaBanner?.secondaryButtonLink || "/case-studies"}
                  onChange={(e) =>
                    setLandingData({
                      ...landingData,
                      ctaBanner: { ...landingData.ctaBanner, secondaryButtonLink: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-violet-600 dark:text-violet-400 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION #12: FOOTER NAVIGATION, BRAND CREDITS & ROUTE CONFIGURATION */}
        {activeSectionId === "footer" && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  #12
                </span>
                <h3 className="text-sm font-bold">Footer Navigation, Brand Credits & Routes Configuration</h3>
              </div>
              <span className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-950/40 px-2.5 py-1 rounded-lg border border-violet-200 dark:border-violet-800/60">
                All footer content & link routes update dynamically live across all pages
              </span>
            </div>

            {/* Brand Logo & Slogan */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-2">
                <Globe className="h-4 w-4" /> 1. Brand Logo & Tagline Description
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FileUploadControl
                    label="Footer Brand Logo Image (Upload to Cloudinary or Paste URL)"
                    value={landingData.footer?.logoUrl || landingData.footerData?.logoUrl || "/images/clickpointfinal.png"}
                    placeholder="e.g. /images/clickpointfinal.png or Cloudinary URL"
                    helperText="Recommended height: 36px to 45px PNG/SVG transparent logo"
                    onChange={(val) =>
                      setLandingData({
                        ...landingData,
                        footer: { ...landingData.footer, logoUrl: val },
                        footerData: { ...landingData.footerData, logoUrl: val },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Logo Alt / Fallback Text
                  </label>
                  <input
                    type="text"
                    value={landingData.footer?.logoText || landingData.footerData?.logoText || "Clickpoint Innovations"}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        footer: { ...landingData.footer, logoText: e.target.value },
                        footerData: { ...landingData.footerData, logoText: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Tagline / Slogan Description Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={landingData.footer?.description || landingData.footerData?.description || ""}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        footer: { ...landingData.footer, description: e.target.value },
                        footerData: { ...landingData.footerData, description: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-3 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                2. Social Media Handle URLs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={landingData.footer?.socialLinks?.linkedin || landingData.footerData?.socialLinks?.linkedin || ""}
                    onChange={(e) => {
                      const social = { ...(landingData.footer?.socialLinks || landingData.footerData?.socialLinks || {}), linkedin: e.target.value };
                      setLandingData({
                        ...landingData,
                        footer: { ...landingData.footer, socialLinks: social },
                        footerData: { ...landingData.footerData, socialLinks: social },
                      });
                    }}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Twitter / X URL
                  </label>
                  <input
                    type="text"
                    value={landingData.footer?.socialLinks?.twitter || landingData.footerData?.socialLinks?.twitter || ""}
                    onChange={(e) => {
                      const social = { ...(landingData.footer?.socialLinks || landingData.footerData?.socialLinks || {}), twitter: e.target.value };
                      setLandingData({
                        ...landingData,
                        footer: { ...landingData.footer, socialLinks: social },
                        footerData: { ...landingData.footerData, socialLinks: social },
                      });
                    }}
                    placeholder="https://x.com/..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={landingData.footer?.socialLinks?.instagram || landingData.footerData?.socialLinks?.instagram || ""}
                    onChange={(e) => {
                      const social = { ...(landingData.footer?.socialLinks || landingData.footerData?.socialLinks || {}), instagram: e.target.value };
                      setLandingData({
                        ...landingData,
                        footer: { ...landingData.footer, socialLinks: social },
                        footerData: { ...landingData.footerData, socialLinks: social },
                      });
                    }}
                    placeholder="https://instagram.com/..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    value={landingData.footer?.socialLinks?.youtube || landingData.footerData?.socialLinks?.youtube || ""}
                    onChange={(e) => {
                      const social = { ...(landingData.footer?.socialLinks || landingData.footerData?.socialLinks || {}), youtube: e.target.value };
                      setLandingData({
                        ...landingData,
                        footer: { ...landingData.footer, socialLinks: social },
                        footerData: { ...landingData.footerData, socialLinks: social },
                      });
                    }}
                    placeholder="https://youtube.com/..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Navigation Columns Editor */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  3. Footer Navigation Columns & Redirect Routes
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const cols = [...(landingData.footer?.columns || landingData.footerData?.columns || DEFAULT_FOOTER_DATA.columns)];
                    cols.push({ title: "New Section", links: [{ label: "New Link", href: "/contact" }] });
                    setLandingData({
                      ...landingData,
                      footer: { ...landingData.footer, columns: cols },
                      footerData: { ...landingData.footerData, columns: cols },
                    });
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 text-xs font-bold border border-violet-200 dark:border-violet-800/60 hover:bg-violet-100 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Navigation Column
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(landingData.footer?.columns || landingData.footerData?.columns || DEFAULT_FOOTER_DATA.columns).map((col: any, colIdx: number) => (
                  <div key={colIdx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Column #{colIdx + 1} Title
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const cols = [...(landingData.footer?.columns || landingData.footerData?.columns || DEFAULT_FOOTER_DATA.columns)];
                          cols.splice(colIdx, 1);
                          setLandingData({
                            ...landingData,
                            footer: { ...landingData.footer, columns: cols },
                            footerData: { ...landingData.footerData, columns: cols },
                          });
                        }}
                        className="text-red-500 hover:text-red-700 text-xs p-1"
                        title="Remove Column"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={col.title || ""}
                      onChange={(e) => {
                        const cols = JSON.parse(JSON.stringify(landingData.footer?.columns || landingData.footerData?.columns || DEFAULT_FOOTER_DATA.columns));
                        cols[colIdx].title = e.target.value;
                        setLandingData({
                          ...landingData,
                          footer: { ...landingData.footer, columns: cols },
                          footerData: { ...landingData.footerData, columns: cols },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                    />

                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase text-slate-500">Links ({col.links?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cols = JSON.parse(JSON.stringify(landingData.footer?.columns || landingData.footerData?.columns || DEFAULT_FOOTER_DATA.columns));
                            cols[colIdx].links = cols[colIdx].links || [];
                            cols[colIdx].links.push({ label: "Page Link", href: "/contact" });
                            setLandingData({
                              ...landingData,
                              footer: { ...landingData.footer, columns: cols },
                              footerData: { ...landingData.footerData, columns: cols },
                            });
                          }}
                          className="text-[11px] font-bold text-violet-600 hover:underline"
                        >
                          + Add Link
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {Array.isArray(col.links) && col.links.map((link: any, linkIdx: number) => (
                          <div key={linkIdx} className="p-2 rounded-lg bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800 space-y-1.5 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const cols = JSON.parse(JSON.stringify(landingData.footer?.columns || landingData.footerData?.columns || DEFAULT_FOOTER_DATA.columns));
                                cols[colIdx].links.splice(linkIdx, 1);
                                setLandingData({
                                  ...landingData,
                                  footer: { ...landingData.footer, columns: cols },
                                  footerData: { ...landingData.footerData, columns: cols },
                                });
                              }}
                              className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <input
                              type="text"
                              value={link.label || ""}
                              onChange={(e) => {
                                const cols = JSON.parse(JSON.stringify(landingData.footer?.columns || landingData.footerData?.columns || DEFAULT_FOOTER_DATA.columns));
                                cols[colIdx].links[linkIdx].label = e.target.value;
                                setLandingData({
                                  ...landingData,
                                  footer: { ...landingData.footer, columns: cols },
                                  footerData: { ...landingData.footerData, columns: cols },
                                });
                              }}
                              placeholder="Link Label"
                              className="w-full text-xs font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 pb-0.5 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={link.href || ""}
                              onChange={(e) => {
                                const cols = JSON.parse(JSON.stringify(landingData.footer?.columns || landingData.footerData?.columns || DEFAULT_FOOTER_DATA.columns));
                                cols[colIdx].links[linkIdx].href = e.target.value;
                                setLandingData({
                                  ...landingData,
                                  footer: { ...landingData.footer, columns: cols },
                                  footerData: { ...landingData.footerData, columns: cols },
                                });
                              }}
                              placeholder="Href / Route (e.g. /about)"
                              className="w-full text-[11px] font-mono text-violet-600 dark:text-violet-400 bg-transparent focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Copyright & Legal Links */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                4. Copyright Notice & Bottom Utility Links
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Copyright Line Notice Text
                  </label>
                  <input
                    type="text"
                    value={landingData.footer?.copyrightText || landingData.footerData?.copyrightText || ""}
                    onChange={(e) =>
                      setLandingData({
                        ...landingData,
                        footer: { ...landingData.footer, copyrightText: e.target.value },
                        footerData: { ...landingData.footerData, copyrightText: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bottom Legal Utility Links
                  </label>
                  <div className="space-y-2">
                    {(landingData.footer?.bottomLinks || landingData.footerData?.bottomLinks || DEFAULT_FOOTER_DATA.bottomLinks).map((bLink: any, bIdx: number) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bLink.label || ""}
                          onChange={(e) => {
                            const bLinks = JSON.parse(JSON.stringify(landingData.footer?.bottomLinks || landingData.footerData?.bottomLinks || DEFAULT_FOOTER_DATA.bottomLinks));
                            bLinks[bIdx].label = e.target.value;
                            setLandingData({
                              ...landingData,
                              footer: { ...landingData.footer, bottomLinks: bLinks },
                              footerData: { ...landingData.footerData, bottomLinks: bLinks },
                            });
                          }}
                          placeholder="Label"
                          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={bLink.href || ""}
                          onChange={(e) => {
                            const bLinks = JSON.parse(JSON.stringify(landingData.footer?.bottomLinks || landingData.footerData?.bottomLinks || DEFAULT_FOOTER_DATA.bottomLinks));
                            bLinks[bIdx].href = e.target.value;
                            setLandingData({
                              ...landingData,
                              footer: { ...landingData.footer, bottomLinks: bLinks },
                              footerData: { ...landingData.footerData, bottomLinks: bLinks },
                            });
                          }}
                          placeholder="Href Route"
                          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs font-mono text-violet-600 dark:text-violet-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GENERIC SECTION FORM EDITOR FOR SECTIONS #03 TO #10 */}
        {["services", "industries", "timeline", "blog", "testimonials", "faqs", "stats"].includes(activeSectionId) && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  #{currentSectionMeta.number}
                </span>
                <h3 className="text-sm font-bold">{currentSectionMeta.title} Copy Configuration</h3>
              </div>
              {activeSectionId === "blog" && (
                <span className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-950/40 px-2.5 py-1 rounded-lg border border-violet-200 dark:border-violet-800/60">
                  Articles are synced automatically from Blog Manager (/blog)
                </span>
              )}
              {activeSectionId === "timeline" && (
                <span className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-950/40 px-2.5 py-1 rounded-lg border border-violet-200 dark:border-violet-800/60">
                  Milestones are synced automatically from Journey Manager (/journey)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Pill Badge Text
                </label>
                <input
                  type="text"
                  value={
                    landingData[`${activeSectionId}Header`]?.badge ||
                    landingData.faqHeader?.badge ||
                    landingData.faqsHeader?.badge ||
                    landingData.timelineHeader?.badge ||
                    landingData.journeyHeader?.badge ||
                    landingData[activeSectionId]?.badge ||
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const updateObj: any = {
                      ...landingData,
                      [`${activeSectionId}Header`]: {
                        ...landingData[`${activeSectionId}Header`],
                        badge: val,
                      },
                    };
                    if (activeSectionId === "timeline") {
                      updateObj.timelineHeader = { ...landingData.timelineHeader, badge: val };
                      updateObj.journeyHeader = { ...landingData.journeyHeader, badge: val };
                    }
                    if (activeSectionId === "faqs" || activeSectionId === "faq") {
                      updateObj.faqHeader = { ...landingData.faqHeader, ...landingData.faqsHeader, badge: val };
                      updateObj.faqsHeader = { ...landingData.faqsHeader, ...landingData.faqHeader, badge: val };
                    }
                    setLandingData(updateObj);
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Title Prefix
                </label>
                <input
                  type="text"
                  value={
                    landingData[`${activeSectionId}Header`]?.title ||
                    landingData.faqHeader?.title ||
                    landingData.faqsHeader?.title ||
                    landingData.timelineHeader?.title ||
                    landingData.journeyHeader?.title ||
                    landingData[activeSectionId]?.title ||
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const updateObj: any = {
                      ...landingData,
                      [`${activeSectionId}Header`]: {
                        ...landingData[`${activeSectionId}Header`],
                        title: val,
                      },
                    };
                    if (activeSectionId === "timeline") {
                      updateObj.timelineHeader = { ...landingData.timelineHeader, title: val };
                      updateObj.journeyHeader = { ...landingData.journeyHeader, title: val };
                    }
                    if (activeSectionId === "faqs" || activeSectionId === "faq") {
                      updateObj.faqHeader = { ...landingData.faqHeader, ...landingData.faqsHeader, title: val };
                      updateObj.faqsHeader = { ...landingData.faqsHeader, ...landingData.faqHeader, title: val };
                    }
                    setLandingData(updateObj);
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Title Highlight (Orange/Gradient)
                </label>
                <input
                  type="text"
                  value={
                    landingData[`${activeSectionId}Header`]?.titleHighlight ||
                    landingData.faqHeader?.titleHighlight ||
                    landingData.faqsHeader?.titleHighlight ||
                    landingData.timelineHeader?.titleHighlight ||
                    landingData.journeyHeader?.titleHighlight ||
                    landingData[activeSectionId]?.titleHighlight ||
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const updateObj: any = {
                      ...landingData,
                      [`${activeSectionId}Header`]: {
                        ...landingData[`${activeSectionId}Header`],
                        titleHighlight: val,
                      },
                    };
                    if (activeSectionId === "timeline") {
                      updateObj.timelineHeader = { ...landingData.timelineHeader, titleHighlight: val };
                      updateObj.journeyHeader = { ...landingData.journeyHeader, titleHighlight: val };
                    }
                    if (activeSectionId === "faqs" || activeSectionId === "faq") {
                      updateObj.faqHeader = { ...landingData.faqHeader, ...landingData.faqsHeader, titleHighlight: val };
                      updateObj.faqsHeader = { ...landingData.faqsHeader, ...landingData.faqHeader, titleHighlight: val };
                    }
                    setLandingData(updateObj);
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-amber-500 font-extrabold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section Subtitle / Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={
                    landingData[`${activeSectionId}Header`]?.subtitle ||
                    landingData.faqHeader?.subtitle ||
                    landingData.faqsHeader?.subtitle ||
                    landingData.timelineHeader?.subtitle ||
                    landingData.journeyHeader?.subtitle ||
                    landingData[activeSectionId]?.subtitle ||
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const updateObj: any = {
                      ...landingData,
                      [`${activeSectionId}Header`]: {
                        ...landingData[`${activeSectionId}Header`],
                        subtitle: val,
                      },
                    };
                    if (activeSectionId === "timeline") {
                      updateObj.timelineHeader = { ...landingData.timelineHeader, subtitle: val };
                      updateObj.journeyHeader = { ...landingData.journeyHeader, subtitle: val };
                    }
                    if (activeSectionId === "faqs" || activeSectionId === "faq") {
                      updateObj.faqHeader = { ...landingData.faqHeader, ...landingData.faqsHeader, subtitle: val };
                      updateObj.faqsHeader = { ...landingData.faqsHeader, ...landingData.faqHeader, subtitle: val };
                    }
                    setLandingData(updateObj);
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-3 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              {(activeSectionId === "faqs" || activeSectionId === "faq") && (
                <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Landing Page Manual FAQ Selector ({availableFaqs.length} Available)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Select specific FAQs below to feature on the homepage. If no questions are checked, the top 6 FAQs will be shown automatically.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const allIds = availableFaqs.map((f) => f.id);
                          setLandingData({
                            ...landingData,
                            faqHeader: { ...landingData.faqHeader, selectedFaqIds: allIds },
                            faqsHeader: { ...landingData.faqsHeader, selectedFaqIds: allIds },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLandingData({
                            ...landingData,
                            faqHeader: { ...landingData.faqHeader, selectedFaqIds: [] },
                            faqsHeader: { ...landingData.faqsHeader, selectedFaqIds: [] },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Currently Selected:{" "}
                    <span className="text-violet-600 dark:text-violet-400 font-extrabold">
                      {(landingData.faqHeader?.selectedFaqIds || landingData.faqsHeader?.selectedFaqIds || []).length} FAQs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {availableFaqs.map((faq) => {
                      const selectedIds: string[] =
                        landingData.faqHeader?.selectedFaqIds ||
                        landingData.faqsHeader?.selectedFaqIds ||
                        [];
                      const isChecked = selectedIds.includes(faq.id);

                      return (
                        <label
                          key={faq.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? "border-violet-500/60 bg-violet-50/50 dark:bg-violet-950/20"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const nextIds = e.target.checked
                                ? [...selectedIds, faq.id]
                                : selectedIds.filter((id) => id !== faq.id);
                              setLandingData({
                                ...landingData,
                                faqHeader: { ...landingData.faqHeader, selectedFaqIds: nextIds },
                                faqsHeader: { ...landingData.faqsHeader, selectedFaqIds: nextIds },
                              });
                            }}
                            className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-1">
                              {faq.category || "General"}
                            </span>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                              {faq.question}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {faq.answer}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SERVICES MANUAL SELECTOR */}
              {activeSectionId === "services" && (
                <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-2">
                        <Boxes className="h-4 w-4" />
                        Landing Page Manual Services Selector ({availableServices.length} Available)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Select specific engineering capabilities below to feature on the homepage. If no services are checked, the top 6 services will be shown automatically.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const allIds = availableServices.map((s) => s.id);
                          setLandingData({
                            ...landingData,
                            servicesHeader: { ...landingData.servicesHeader, selectedServiceIds: allIds },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLandingData({
                            ...landingData,
                            servicesHeader: { ...landingData.servicesHeader, selectedServiceIds: [] },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Currently Selected:{" "}
                    <span className="text-violet-600 dark:text-violet-400 font-extrabold">
                      {(landingData.servicesHeader?.selectedServiceIds || []).length} Services
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {availableServices.map((srv) => {
                      const selectedIds: string[] = landingData.servicesHeader?.selectedServiceIds || [];
                      const isChecked = selectedIds.includes(srv.id);

                      return (
                        <label
                          key={srv.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? "border-violet-500/60 bg-violet-50/50 dark:bg-violet-950/20"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const nextIds = e.target.checked
                                ? [...selectedIds, srv.id]
                                : selectedIds.filter((id) => id !== srv.id);
                              setLandingData({
                                ...landingData,
                                servicesHeader: { ...landingData.servicesHeader, selectedServiceIds: nextIds },
                              });
                            }}
                            className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-1">
                              {srv.badge || srv.category || "Capability"}
                            </span>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                              {srv.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {srv.description || srv.subtitle || srv.shortDesc}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* INDUSTRIES MANUAL SELECTOR */}
              {activeSectionId === "industries" && (
                <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Landing Page Manual Industries Selector ({availableIndustries.length} Available)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Select specific Industry sectors below to feature on the homepage. If no industries are checked, the top 6 sectors will be shown automatically.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const allIds = availableIndustries.map((ind) => ind.id);
                          setLandingData({
                            ...landingData,
                            industriesHeader: { ...landingData.industriesHeader, selectedIndustryIds: allIds },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLandingData({
                            ...landingData,
                            industriesHeader: { ...landingData.industriesHeader, selectedIndustryIds: [] },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Currently Selected:{" "}
                    <span className="text-violet-600 dark:text-violet-400 font-extrabold">
                      {(landingData.industriesHeader?.selectedIndustryIds || []).length} Industries
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {availableIndustries.map((ind) => {
                      const selectedIds: string[] = landingData.industriesHeader?.selectedIndustryIds || [];
                      const isChecked = selectedIds.includes(ind.id);

                      return (
                        <label
                          key={ind.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? "border-violet-500/60 bg-violet-50/50 dark:bg-violet-950/20"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const nextIds = e.target.checked
                                ? [...selectedIds, ind.id]
                                : selectedIds.filter((id) => id !== ind.id);
                              setLandingData({
                                ...landingData,
                                industriesHeader: { ...landingData.industriesHeader, selectedIndustryIds: nextIds },
                              });
                            }}
                            className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-1">
                              {ind.badge || "Domain"}
                            </span>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                              {ind.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {ind.description || ind.subtitle}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TESTIMONIALS MANUAL SELECTOR */}
              {activeSectionId === "testimonials" && (
                <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        Landing Page Manual Testimonials Selector ({availableTestimonials.length} Available)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Select specific verified client reviews below to feature on the homepage. If no reviews are checked, the top 3 approved testimonials will be shown automatically.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const allIds = availableTestimonials.map((t) => t.id);
                          setLandingData({
                            ...landingData,
                            testimonialsHeader: { ...landingData.testimonialsHeader, selectedTestimonialIds: allIds },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLandingData({
                            ...landingData,
                            testimonialsHeader: { ...landingData.testimonialsHeader, selectedTestimonialIds: [] },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Currently Selected:{" "}
                    <span className="text-violet-600 dark:text-violet-400 font-extrabold">
                      {(landingData.testimonialsHeader?.selectedTestimonialIds || []).length} Testimonials
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {availableTestimonials.map((t) => {
                      const selectedIds: string[] = landingData.testimonialsHeader?.selectedTestimonialIds || [];
                      const isChecked = selectedIds.includes(t.id);

                      return (
                        <label
                          key={t.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? "border-violet-500/60 bg-violet-50/50 dark:bg-violet-950/20"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const nextIds = e.target.checked
                                ? [...selectedIds, t.id]
                                : selectedIds.filter((id) => id !== t.id);
                              setLandingData({
                                ...landingData,
                                testimonialsHeader: { ...landingData.testimonialsHeader, selectedTestimonialIds: nextIds },
                              });
                            }}
                            className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                {t.name}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {t.role}{t.company ? ` @ ${t.company}` : ''}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2">
                              "{t.content}"
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BLOG MANUAL SELECTOR */}
              {activeSectionId === "blog" && (
                <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Landing Page Manual Blog Selector ({availableBlogPosts.length} Available)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Select specific blog articles below to feature on the homepage. If no articles are checked, the top 3 latest published blogs will be shown automatically.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const allIds = availableBlogPosts.map((b) => b.id || b.slug);
                          setLandingData({
                            ...landingData,
                            blogHeader: { ...landingData.blogHeader, selectedBlogIds: allIds },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLandingData({
                            ...landingData,
                            blogHeader: { ...landingData.blogHeader, selectedBlogIds: [] },
                          });
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Currently Selected:{" "}
                    <span className="text-violet-600 dark:text-violet-400 font-extrabold">
                      {(landingData.blogHeader?.selectedBlogIds || []).length} Articles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {availableBlogPosts.map((post) => {
                      const postId = post.id || post.slug;
                      const selectedIds: string[] = landingData.blogHeader?.selectedBlogIds || [];
                      const isChecked = selectedIds.includes(postId);
                      const postImg = post.imageUrl || post.image || post.coverImage;

                      return (
                        <label
                          key={postId}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? "border-violet-500/60 bg-violet-50/50 dark:bg-violet-950/20"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const nextIds = e.target.checked
                                ? [...selectedIds, postId]
                                : selectedIds.filter((id) => id !== postId);
                              setLandingData({
                                ...landingData,
                                blogHeader: { ...landingData.blogHeader, selectedBlogIds: nextIds },
                              });
                            }}
                            className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 shrink-0"
                          />
                          {postImg && (
                            <img
                              src={postImg}
                              alt={post.title}
                              className="h-12 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-violet-100 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-1">
                              {post.category || "Article"}
                            </span>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                              {post.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
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
