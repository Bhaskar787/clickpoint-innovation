"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Info,
  ShieldCheck,
  Users,
  Award,
  Target,
  Code2,
  Bot,
  HeartHandshake,
  Globe2,
  Video,
  Layers,
  ArrowRight,
  User,
  Image as ImageIcon,
  UploadCloud,
  X,
  ListPlus,
  CheckCircle2,
  Tag,
  Type,
  TrendingUp,
  MousePointerClick,
  Linkedin,
  Sparkle,
  Loader2,
} from "lucide-react";

// Helper function to extract initials from First & Last Name
function getInitials(name: string): string {
  if (!name || !name.trim()) return "CP";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Custom Reusable File Upload & URL Control Component with Cloudinary Integration
interface FileUploadControlProps {
  label: string;
  value: string;
  accept: string;
  placeholder?: string;
  helperText?: string;
  onChange: (val: string) => void;
  mediaType: "image" | "video";
}

function FileUploadControl({
  label,
  value,
  accept,
  placeholder,
  helperText,
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
        if (data.provider === "cloudinary") {
          toast.success(`Successfully uploaded ${mediaType} to Cloudinary!`, { id: toastId });
        } else {
          toast.success(`Uploaded successfully! (Saved to local storage)`, { id: toastId });
          if (data.warning) {
            toast.info("Cloudinary 403: Please update CLOUDINARY_API_SECRET in .env", { duration: 6000 });
          }
        }
      } else {
        toast.error(data.error || "Failed to upload file", { id: toastId });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Upload failed: " + (err?.message || "Server error"), { id: toastId });
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {helperText && (
          <span className="text-[10px] text-slate-400 font-normal">{helperText}</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder || "File path or URL..."}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {mediaType === "video" ? <Video className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
          </span>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                toast.info("Cleared URL");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shrink-0 disabled:opacity-50"
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
          {mediaType === "image" ? (
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-200 shrink-0">
              <img src={value} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-12 w-20 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-black shrink-0 relative flex items-center justify-center">
              <video src={value} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1 overflow-hidden text-[11px]">
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {value.includes("cloudinary.com") ? "Cloudinary Media URL" : value}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Ready for preview & publication
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// LinkedIn Skill Section Manager Component
interface LinkedInSkillSectionProps {
  skills: string[];
  onChange: (updatedSkills: string[]) => void;
}

function LinkedInSkillSection({ skills, onChange }: LinkedInSkillSectionProps) {
  const [newSkillInput, setNewSkillInput] = useState("");

  function handleAddSkill() {
    if (!newSkillInput || !newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      toast.success(`Added skill "${trimmed}"`);
    }
    setNewSkillInput("");
  }

  function handleRemoveSkill(skillToRemove: string) {
    onChange(skills.filter((s) => s !== skillToRemove));
    toast.success(`Removed skill "${skillToRemove}"`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  }

  const SUGGESTED_SKILLS = [
    "Product Strategy",
    "AI Leadership",
    "LLM Architectures",
    "Vector Databases",
    "Microservices",
    "Next.js",
    "Technical SEO",
    "Cloud Security",
  ];

  return (
    <div className="p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Core Expertise ({skills.length})
          </span>
        </div>
        <span className="text-[10px] font-medium text-slate-400">Interactive Tag Manager</span>
      </div>

      {/* Active Skill Badges Pills */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#0b0f19] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs group hover:border-blue-400 transition-all"
          >
            <CheckCircle2 className="h-3 w-3 text-[#0a66c2] shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="text-slate-400 hover:text-red-500 rounded-full p-0.5 transition-colors shrink-0"
              title={`Remove ${skill}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {skills.length === 0 && (
          <span className="text-xs text-slate-400 italic">No skills added yet. Add a skill below.</span>
        )}
      </div>

      {/* Add New Skill Input Box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          placeholder="Type skill name & press Enter..."
          value={newSkillInput}
          onChange={(e) => setNewSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Quick Add Suggestions */}
      <div className="pt-1 flex flex-wrap items-center gap-1">
        <span className="text-[10px] text-slate-400 font-semibold mr-1 shrink-0">Quick Add:</span>
        {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 4).map((sugg) => (
          <button
            key={sugg}
            type="button"
            onClick={() => {
              onChange([...skills, sugg]);
              toast.success(`Added skill "${sugg}"`);
            }}
            className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
          >
            + {sugg}
          </button>
        ))}
      </div>
    </div>
  );
}

// Default Initial Form State
export const DEFAULT_ABOUT_DATA = {
  hero: {
    badge: "About Clickpoint Innovation",
    title: "Pioneering the AI-First Era of Software Engineering",
    highlightText: "Software Engineering",
    subtitle:
      "We help ambitious startups and global enterprise leaders design, architect, and scale compounding digital products powered by modern AI & cloud infrastructure.",
    primaryBtnText: "Meet Our Leadership",
    secondaryBtnText: "Read Our Story",
    videoUrl: "/images/video.mp4",
  },
  stats: [
    { id: "s1", value: "89", suffix: "%", label: "Growth in driving business value" },
    { id: "s2", value: "350", suffix: "+", label: "Successful projects delivered" },
    { id: "s3", value: "150", suffix: "+", label: "Skilled engineering professionals" },
    { id: "s4", value: "50", suffix: "+", label: "Cutting-edge tech stack experts" },
  ],
  mission: {
    tag: "Our Story & Mission",
    heading: "From a 4-person dev shop to a global AI partner",
    highlightHeading: "global AI partner",
    paragraph1:
      "Founded in 2016, Clickpoint Innovation was built on a singular conviction: that software engineering should be fast, resilient, and continuously compounding in value.",
    paragraph2:
      "Over the past decade, we have expanded from a lean MVP factory into an international engineering consultancy with 150+ engineers, designers, and AI specialists across 3 timezones. We combine deep technical rigor with cutting-edge LLMs and autonomous agent workflows to deliver software ready for tomorrow's scale.",
    bullets: [
      "Global 24/7 delivery pods across US, Europe & Asia",
      "SOC2 Type II certified & enterprise-grade data isolation",
      "89% long-term client retention across 350+ completed builds",
    ],
    cardTitle: "Global Engineering Pods",
    cardDesc:
      "Our distributed engineering pods operate round-the-clock, delivering continuous integration and rapid feature deployments with zero downtime.",
    statBox1Label: "Timezones Covered",
    statBox1Value: "3 Continents",
    statBox2Label: "Code Reviews",
    statBox2Value: "100% Peer Audited",
  },
  values: {
    tag: "Guiding Principles",
    title: "Our core values driving engineering culture",
    highlightTitle: "engineering culture",
    items: [
      {
        id: "val-1",
        title: "Engineering Excellence",
        description: "We take pride in clean, maintainable, sub-second codebases built with strict type safety and high test coverage.",
      },
      {
        id: "val-2",
        title: "Human + AI Synergy",
        description: "We leverage autonomous AI agent pods to augment developer productivity, shipping features 3x faster.",
      },
      {
        id: "val-3",
        title: "Client Obsession",
        description: "Your business metrics are our metrics. We align engineering output directly with conversion and revenue growth.",
      },
      {
        id: "val-4",
        title: "Enterprise Security",
        description: "SOC2 Type II compliant pipelines, zero-trust cloud architectures, and strict tenant data isolation.",
      },
    ],
  },
  leadership: {
    tag: "Leadership & Key Team Members",
    title: "Meet the minds driving Clickpoint Innovation",
    highlightTitle: "Clickpoint Innovation",
    subtitle: "Experienced technology leaders, AI architects, product designers, and growth marketers.",
    team: [
      {
        id: "ashok-khanal",
        name: "Ashok Khanal",
        role: "Founder & Chief Executive Officer (CEO)",
        bio: "Pioneering AI-first digital product engineering and enterprise technology transformation across global markets.",
        imageUrl: "",
        expertise: ["Product Strategy", "AI Leadership", "Enterprise Growth"],
      },
      {
        id: "rabin-shrestha",
        name: "Rabin Shrestha",
        role: "Chief Technology Officer (CTO & AI Architect)",
        bio: "Ex-BigTech AI lead architecting LLM copilot pods, vector indexing pipelines, and distributed multi-cloud systems.",
        imageUrl: "",
        expertise: ["LLM Architectures", "Distributed Systems", "Vector Databases"],
      },
      {
        id: "nisha-khanal",
        name: "Nisha Khanal",
        role: "Head of Digital Marketing & SEO",
        bio: "Performance growth strategist scaling B2B SaaS ARR through scientific CRO, technical SEO, and automated lifecycle engines.",
        imageUrl: "",
        expertise: ["Digital Marketing", "Technical SEO", "Growth CRO"],
      },
      {
        id: "marcus-vance",
        name: "Marcus Vance",
        role: "Head of Product & UI/UX Design",
        bio: "Award-winning product designer creating human-centric design systems, micro-animations, and conversion-optimized interfaces.",
        imageUrl: "",
        expertise: ["Design Systems", "Usability Research", "Figma & Motion"],
      },
      {
        id: "priya-patel",
        name: "Priya Patel",
        role: "VP of Engineering & MLOps",
        bio: "MLOps engineering lead automating production ML pipelines, real-time drift monitoring, and zero-downtime microservices.",
        imageUrl: "",
        expertise: ["MLOps Pipelines", "Kubernetes", "PyTorch & Retraining"],
      },
      {
        id: "david-chen",
        name: "David Chen",
        role: "Head of Enterprise Solutions & Cloud Security",
        bio: "Cloud security specialist enforcing SOC2 Type II compliance, multi-tenant database isolation, and zero-trust infrastructure.",
        imageUrl: "",
        expertise: ["Cloud Security", "SOC2 Compliance", "Terraform & AWS"],
      },
    ],
  },
  timelineHeader: {
    badge: "Our Journey",
    title: "From a 4-person studio to an AI-first partner",
    subtitle: "A decade of engineering excellence, technical milestones, and continuous growth.",
  },
};

interface AboutPageEditorProps {
  sectionId: string | null;
  onCloseSection: () => void;
}

export default function AboutPageEditor({ sectionId, onCloseSection }: AboutPageEditorProps) {
  const [formData, setFormData] = useState(DEFAULT_ABOUT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data from DB
  useEffect(() => {
    async function loadAboutData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/about");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
        }
      } catch (error) {
        console.error("Failed to load about content:", error);
        toast.error("Failed to load about page content from database.");
      } finally {
        setIsLoading(false);
      }
    }
    loadAboutData();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    const toastId = toast.loading("Saving changes to database...");
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("About page saved to database successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save changes to database", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Save failed: " + (err?.message || "Server error"), { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("Are you sure you want to reset all About Page content to defaults?")) return;

    setFormData(DEFAULT_ABOUT_DATA);
    const toastId = toast.loading("Resetting content in database...");
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_ABOUT_DATA),
      });
      const json = await res.json();
      if (json.success) {
        toast.info("Reset to default about page content!", { id: toastId });
      }
    } catch {
      toast.error("Failed to reset content", { id: toastId });
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] gap-3 bg-white dark:bg-[#131927] rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center">Loading About Page data from database...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-4 sm:space-y-6 text-slate-900 dark:text-white">
      
      {/* Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 overflow-hidden bg-white dark:bg-[#131927] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-bold flex flex-wrap items-center gap-2 break-words">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            Editing About Us Page Content & Cloudinary Uploads
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure every badge tag, section main title, stat metric (89%, 350+), Cloudinary images/videos, and team members dynamically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
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

      {/* SECTION 1: ABOUT HERO BANNER + STAT METRICS GRID */}
      {(!sectionId || sectionId === "about-hero") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-xs sm:text-sm font-bold">About Hero Banner Badges, Titles & Stat Metrics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Hero Badge Tag
              </label>
              <input
                type="text"
                value={formData.hero.badge}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, badge: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <FileUploadControl
              label="Background Video File / URL (Cloudinary Supported)"
              value={formData.hero.videoUrl}
              accept="video/*"
              mediaType="video"
              placeholder="/images/video.mp4 or Cloudinary URL"
              helperText="Upload video file to Cloudinary or enter URL"
              onChange={(val) => setFormData({ ...formData, hero: { ...formData.hero, videoUrl: val } })}
            />

            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
                rows={3}
                value={formData.hero.subtitle}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <MousePointerClick className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Primary Button Label
              </label>
              <input
                type="text"
                value={formData.hero.primaryBtnText}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, primaryBtnText: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <MousePointerClick className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Secondary Button Label
              </label>
              <input
                type="text"
                value={formData.hero.secondaryBtnText}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, secondaryBtnText: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          {/* DYNAMIC STATS BANNER METRICS GRID (89%, 350+, 150+, 50+) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 shrink-0" />
                <h4 className="text-xs font-bold">
                  Glassmorphic Stat Metrics ({formData.stats.length})
                </h4>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newStat = {
                    id: `s-${Date.now()}`,
                    value: "99",
                    suffix: "%",
                    label: "Customer Satisfaction",
                  };
                  setFormData({ ...formData, stats: [...formData.stats, newStat] });
                  toast.success("Added new stat metric!");
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Stat Metric</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {formData.stats.map((stat, stIdx) => (
                <div
                  key={stat.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-blue-600">Stat #{stIdx + 1}</span>
                    {formData.stats.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const statToDelete = formData.stats[stIdx];
                          const updated = formData.stats.filter((_, idx) => idx !== stIdx);
                          setFormData({ ...formData, stats: updated });
                          toast.success(`Deleted stat metric "${statToDelete?.label || 'Stat'}"`);
                        }}
                        className="text-red-500 hover:text-red-700 p-0.5"
                        title="Remove stat metric"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="col-span-2">
                      <label className="block text-[9px] text-slate-400">Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...formData.stats];
                          updated[stIdx].value = e.target.value;
                          setFormData({ ...formData, stats: updated });
                        }}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2 py-1 text-xs font-extrabold text-blue-600 dark:text-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-400">Suffix</label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => {
                          const updated = [...formData.stats];
                          updated[stIdx].suffix = e.target.value;
                          setFormData({ ...formData, stats: updated });
                        }}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2 py-1 text-xs font-bold text-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400">Description Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...formData.stats];
                        updated[stIdx].label = e.target.value;
                        setFormData({ ...formData, stats: updated });
                      }}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2 py-1 text-[11px] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: STORY & MISSION BADGES & TITLES */}
      {(!sectionId || sectionId === "about-mission") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #02
            </span>
            <h3 className="text-xs sm:text-sm font-bold">
              Story & Mission Section Badges & Header Titles
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Mission Tag Badge
              </label>
              <input
                type="text"
                value={formData.mission.tag}
                onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, tag: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Mission Section Title
              </label>
              <input
                type="text"
                value={formData.mission.heading}
                onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, heading: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Paragraph 1 (Story Foundation)
              </label>
              <textarea
                rows={2}
                value={formData.mission.paragraph1}
                onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, paragraph1: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Paragraph 2 (Global Growth Story)
              </label>
              <textarea
                rows={3}
                value={formData.mission.paragraph2}
                onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, paragraph2: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* DYNAMIC FEATURE BULLETS SECTION */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <h4 className="text-xs font-bold">
                  Dynamic Feature Bullet Points ({formData.mission.bullets.length})
                </h4>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    mission: {
                      ...formData.mission,
                      bullets: [...formData.mission.bullets, "New feature bullet point text"],
                    },
                  });
                  toast.success("Added new bullet point!");
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.mission.bullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const updated = [...formData.mission.bullets];
                      updated[bIdx] = e.target.value;
                      setFormData({
                        ...formData,
                        mission: { ...formData.mission, bullets: updated },
                      });
                    }}
                    className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                  {formData.mission.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.mission.bullets.filter((_, idx) => idx !== bIdx);
                        setFormData({
                          ...formData,
                          mission: { ...formData.mission, bullets: updated },
                        });
                        toast.success("Deleted bullet point!");
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded shrink-0"
                      title="Remove bullet"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC GLOBAL PODS VISUAL CARD CONFIGURATION */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-blue-600 shrink-0" />
              <h4 className="text-xs font-bold">
                Global Engineering Pods Card Headline & Stat Badges
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Card Headline Title
                </label>
                <input
                  type="text"
                  value={formData.mission.cardTitle}
                  onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, cardTitle: e.target.value } })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Card Description Narrative
                </label>
                <input
                  type="text"
                  value={formData.mission.cardDesc}
                  onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, cardDesc: e.target.value } })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Stat 1 Label & Value
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={formData.mission.statBox1Label}
                    onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, statBox1Label: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.mission.statBox1Value}
                    onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, statBox1Value: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Stat 2 Label & Value
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={formData.mission.statBox2Label}
                    onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, statBox2Label: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.mission.statBox2Value}
                    onChange={(e) => setFormData({ ...formData, mission: { ...formData.mission, statBox2Value: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CORE VALUES BADGES & TITLES */}
      {(!sectionId || sectionId === "about-stats") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #03
              </span>
              <h3 className="text-xs sm:text-sm font-bold">Core Values Badges & Section Titles</h3>
            </div>

            <button
              type="button"
              onClick={() => {
                const newValue = {
                  id: `val-${Date.now()}`,
                  title: "New Core Value",
                  description: "Detailed description of this core principle.",
                };
                setFormData({
                  ...formData,
                  values: {
                    ...formData.values,
                    items: [...formData.values.items, newValue],
                  },
                });
                toast.success("Added new core value!");
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Core Value</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Core Values Tag Badge
              </label>
              <input
                type="text"
                value={formData.values.tag}
                onChange={(e) => setFormData({ ...formData, values: { ...formData.values, tag: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Core Values Section Title
              </label>
              <input
                type="text"
                value={formData.values.title}
                onChange={(e) => setFormData({ ...formData, values: { ...formData.values, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {formData.values.items.map((val, idx) => (
              <div key={val.id} className="p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-blue-600">Value #{idx + 1}</span>
                  {formData.values.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const valToDelete = formData.values.items[idx];
                        const updated = formData.values.items.filter((_, i) => i !== idx);
                        setFormData({
                          ...formData,
                          values: { ...formData.values, items: updated },
                        });
                        toast.success(`Deleted value "${valToDelete.title}"`);
                      }}
                      className="text-red-500 hover:text-red-700 p-0.5"
                      title="Remove core value"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">Value Title</label>
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => {
                      const updated = [...formData.values.items];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, values: { ...formData.values, items: updated } });
                    }}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">Value Description</label>
                  <textarea
                    rows={2}
                    value={val.description}
                    onChange={(e) => {
                      const updated = [...formData.values.items];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, values: { ...formData.values, items: updated } });
                    }}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: LEADERSHIP TEAM BADGES & TITLES + LINKEDIN SKILL SECTION */}
      {(!sectionId || sectionId === "about-team") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #04
              </span>
              <h3 className="text-xs sm:text-sm font-bold">Leadership Section Badges, Titles & Team Members</h3>
            </div>

            <button
              type="button"
              onClick={() => {
                const newMember = {
                  id: `team-${Date.now()}`,
                  name: "New Team Member",
                  role: "Software Architect",
                  bio: "Experienced engineer leading high-scale product development.",
                  imageUrl: "",
                  expertise: ["Cloud Architecture", "Next.js", "AI Integrations"],
                };
                setFormData({
                  ...formData,
                  leadership: {
                    ...formData.leadership,
                    team: [...formData.leadership.team, newMember],
                  },
                });
                toast.success("Added new team member!");
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Leadership Tag Badge
              </label>
              <input
                type="text"
                value={formData.leadership.tag}
                onChange={(e) => setFormData({ ...formData, leadership: { ...formData.leadership, tag: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Leadership Main Title
              </label>
              <input
                type="text"
                value={formData.leadership.title}
                onChange={(e) => setFormData({ ...formData, leadership: { ...formData.leadership, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Leadership Subtitle
              </label>
              <input
                type="text"
                value={formData.leadership.subtitle}
                onChange={(e) => setFormData({ ...formData, leadership: { ...formData.leadership, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {formData.leadership.team.map((member, idx) => {
              const computedInitials = getInitials(member.name);

              return (
                <div key={member.id} className="p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  
                  {/* Top Bar with Live Image / Initials Avatar Preview */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center gap-3 min-w-0">
                      {member.imageUrl && member.imageUrl.trim() !== "" ? (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-sm shrink-0">
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                          {computedInitials}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate">{member.name || "Unnamed Member"}</h4>
                        <p className="text-[10px] font-medium text-slate-400 truncate">
                          {member.imageUrl && member.imageUrl.trim() !== "" ? "Custom Image Uploaded" : `Initials Avatar (${computedInitials})`}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const memberToDelete = member;
                        if (memberToDelete.imageUrl) {
                          fetch("/api/upload", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url: memberToDelete.imageUrl }),
                          }).catch((err) => console.warn("Failed to delete member photo from Cloudinary:", err));
                        }
                        const updated = formData.leadership.team.filter((m) => m.id !== member.id);
                        setFormData({
                          ...formData,
                          leadership: { ...formData.leadership, team: updated },
                        });
                        toast.success(`Deleted team member "${memberToDelete.name}"`);
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors shrink-0"
                      title="Delete member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Member Name & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                      <input
                        type="text"
                        placeholder="First & Last Name"
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...formData.leadership.team];
                          updated[idx].name = e.target.value;
                          setFormData({ ...formData, leadership: { ...formData.leadership, team: updated } });
                        }}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">Title / Designation</label>
                      <input
                        type="text"
                        placeholder="CEO, CTO, Lead Engineer"
                        value={member.role}
                        onChange={(e) => {
                          const updated = [...formData.leadership.team];
                          updated[idx].role = e.target.value;
                          setFormData({ ...formData, leadership: { ...formData.leadership, team: updated } });
                        }}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Image File Upload Control */}
                  <FileUploadControl
                    label="Profile Photo File / Image URL (Cloudinary Supported)"
                    value={member.imageUrl || ""}
                    accept="image/*"
                    mediaType="image"
                    placeholder="Upload image file to Cloudinary or enter URL..."
                    helperText={`Leave blank to display initials (${computedInitials})`}
                    onChange={(val) => {
                      const updated = [...formData.leadership.team];
                      updated[idx].imageUrl = val;
                      setFormData({ ...formData, leadership: { ...formData.leadership, team: updated } });
                    }}
                  />

                  {/* Professional Bio */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">Professional Bio</label>
                    <textarea
                      rows={2}
                      value={member.bio}
                      onChange={(e) => {
                        const updated = [...formData.leadership.team];
                        updated[idx].bio = e.target.value;
                        setFormData({ ...formData, leadership: { ...formData.leadership, team: updated } });
                      }}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* LINKEDIN-STYLE INTERACTIVE SKILLS SECTION */}
                  <LinkedInSkillSection
                    skills={member.expertise || []}
                    onChange={(updatedSkills) => {
                      const updated = [...formData.leadership.team];
                      updated[idx].expertise = updatedSkills;
                      setFormData({ ...formData, leadership: { ...formData.leadership, team: updated } });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 5: TIMELINE JOURNEY SECTION HEADER (ABOUT PAGE ONLY) */}
      {(!sectionId || sectionId === "about-journey" || sectionId === "05") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #05
            </span>
            <h3 className="text-xs sm:text-sm font-bold">
              Timeline & Journey Section Header (About Page Only)
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize the section badge, main title, and narrative description specifically for the About page timeline. Milestone era nodes are synchronized live from the Journey page database records.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Badge Tag (e.g. Our Journey)
              </label>
              <input
                type="text"
                value={formData.timelineHeader?.badge || "Our Journey"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timelineHeader: {
                      badge: e.target.value,
                      title: formData.timelineHeader?.title || "From a 4-person studio to an AI-first partner",
                      subtitle: formData.timelineHeader?.subtitle || "A decade of engineering excellence, technical milestones, and continuous growth.",
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Main Title (e.g. From a 4-person studio to an AI-first partner)
              </label>
              <input
                type="text"
                value={formData.timelineHeader?.title || "From a 4-person studio to an AI-first partner"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timelineHeader: {
                      badge: formData.timelineHeader?.badge || "Our Journey",
                      title: e.target.value,
                      subtitle: formData.timelineHeader?.subtitle || "A decade of engineering excellence, technical milestones, and continuous growth.",
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={formData.timelineHeader?.subtitle || "A decade of engineering excellence, technical milestones, and continuous growth."}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timelineHeader: {
                      badge: formData.timelineHeader?.badge || "Our Journey",
                      title: formData.timelineHeader?.title || "From a 4-person studio to an AI-first partner",
                      subtitle: e.target.value,
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}