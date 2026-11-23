"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/confirm-dialog";
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
  Milestone,
  Pencil,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { SectionNavSidebar, SectionNavItem } from "@/components/admin/dashboard/section-nav-sidebar";
import { TeamMember } from "@/types";

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

export interface AboutPageFormData {
  hero: {
    badge: string;
    title: string;
    highlightText: string;
    subtitle: string;
    primaryBtnText: string;
    secondaryBtnText: string;
    videoUrl: string;
  };
  stats: {
    id: string;
    value: string;
    suffix: string;
    label: string;
  }[];
  mission: {
    tag: string;
    heading: string;
    highlightHeading: string;
    paragraph1: string;
    paragraph2: string;
    bullets: string[];
    cardTitle: string;
    cardDesc: string;
    statBox1Label: string;
    statBox1Value: string;
    statBox2Label: string;
    statBox2Value: string;
  };
  values: {
    tag: string;
    title: string;
    highlightTitle: string;
    items: {
      id: string;
      title: string;
      description: string;
    }[];
  };
  leadership: {
    tag: string;
    title: string;
    highlightTitle: string;
    subtitle: string;
    team: TeamMember[];
  };
  timelineHeader: {
    badge: string;
    title: string;
    subtitle: string;
  };
}

// Default Initial Form State
export const DEFAULT_ABOUT_DATA: AboutPageFormData = {
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

const ABOUT_SECTIONS_CATALOG: SectionNavItem[] = [
  {
    id: "about-hero",
    number: "01",
    title: "About Hero Banner & Metrics",
    desc: "Header badge, video URL, headline titles, and call-to-action buttons.",
    icon: Info,
    badge: "Hero Banner",
  },
  {
    id: "about-mission",
    number: "02",
    title: "Our Mission & Core Values",
    desc: "Mission statement, engineering excellence pillars, and corporate principles.",
    icon: ShieldCheck,
    badge: "Mission & Values",
  },
  {
    id: "about-stats",
    number: "03",
    title: "Pods & Corporate Statistics",
    desc: "Global delivery pod metrics, continuous integration stats, and impact numbers.",
    icon: Award,
    badge: "Impact Metrics",
  },
  {
    id: "about-team",
    number: "04",
    title: "Leadership & Executive Team",
    desc: "Manage team member profiles, roles, bios, profile images, and LinkedIn links.",
    icon: Users,
    badge: "Team Profiles",
  },
  {
    id: "about-journey",
    number: "05",
    title: "Company Journey Timeline Header",
    desc: "Timeline section badge, headline, and continuous growth narrative.",
    icon: Milestone,
    badge: "Company Story",
  },
];

interface AboutPageEditorProps {
  sectionId: string | null;
  onCloseSection: () => void;
}

export default function AboutPageEditor({ sectionId, onCloseSection }: AboutPageEditorProps) {
  const { confirm } = useConfirm();
  const [formData, setFormData] = useState<AboutPageFormData>(DEFAULT_ABOUT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>(sectionId || "about-hero");

  // Leadership Member Modal & Search State
  const [editingMember, setEditingMember] = useState<{
    member: TeamMember;
    isNew: boolean;
    index?: number;
  } | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleOpenAddMember() {
    setEditingMember({
      isNew: true,
      member: {
        id: `team-${Date.now()}`,
        name: "",
        role: "",
        bio: "",
        imageUrl: "",
        expertise: ["Cloud Architecture", "AI Leadership"],
        linkedinUrl: "",
      },
    });
  }

  function handleOpenEditMember(member: TeamMember, index: number) {
    setEditingMember({
      isNew: false,
      index,
      member: {
        ...member,
        expertise: [...(member.expertise || [])],
      },
    });
  }

  function handleSaveMember() {
    if (!editingMember) return;
    const { member, isNew, index } = editingMember;

    if (!member.name.trim()) {
      toast.error("Please enter the member's full name.");
      return;
    }
    if (!member.role.trim()) {
      toast.error("Please enter the member's title / designation.");
      return;
    }

    if (isNew) {
      setFormData((prev) => ({
        ...prev,
        leadership: {
          ...prev.leadership,
          team: [...prev.leadership.team, member],
        },
      }));
      toast.success(`Added "${member.name}" to leadership team!`);
    } else if (typeof index === "number") {
      setFormData((prev) => {
        const updated = [...prev.leadership.team];
        updated[index] = member;
        return {
          ...prev,
          leadership: {
            ...prev.leadership,
            team: updated,
          },
        };
      });
      toast.success(`Updated "${member.name}" profile!`);
    }

    setEditingMember(null);
  }

  async function handleDeleteMember(memberToDelete: TeamMember) {
    const ok = await confirm({
      title: "Delete Leadership Member",
      message: `Are you sure you want to delete "${memberToDelete.name}" from the leadership team? Any associated cloud photo will also be removed.`,
      confirmText: "Delete Member",
      variant: "danger",
    });
    if (!ok) return;

    if (memberToDelete.imageUrl) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: memberToDelete.imageUrl }),
      }).catch((err) => console.warn("Failed to delete member photo:", err));
    }

    setFormData((prev) => ({
      ...prev,
      leadership: {
        ...prev.leadership,
        team: prev.leadership.team.filter((m) => m.id !== memberToDelete.id),
      },
    }));
    toast.success(`Deleted team member "${memberToDelete.name}"`);
  }

  function handleMoveMember(currentIndex: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= formData.leadership.team.length) return;

    setFormData((prev) => {
      const updated = [...prev.leadership.team];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return {
        ...prev,
        leadership: { ...prev.leadership, team: updated },
      };
    });
  }

  useEffect(() => {
    if (sectionId) {
      setActiveSectionId(sectionId);
    }
  }, [sectionId]);

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
    const ok = await confirm({
      title: "Reset About Page Content",
      message: "Are you sure you want to reset all About Page content to defaults? This will restore default mission, stats, core values, and executive leadership members.",
      confirmText: "Reset to Defaults",
      variant: "warning",
      icon: "refresh",
    });
    if (!ok) return;

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

  const currentSectionMeta =
    ABOUT_SECTIONS_CATALOG.find((s) => s.id === activeSectionId) || ABOUT_SECTIONS_CATALOG[0];
  const SectionIcon = currentSectionMeta.icon || Info;

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 text-slate-900 dark:text-white">
      {/* 2-Column Master-Detail Selection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Selector */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-4">
          <SectionNavSidebar
            title="About Us Sections"
            sections={ABOUT_SECTIONS_CATALOG}
            activeSectionId={activeSectionId}
            onSelectSection={(id) => setActiveSectionId(id)}
            accentColor="blue"
          />
        </div>

        {/* Right Column: Active Section Editor Workspace */}
        <div className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-5">
          {/* Active Section Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 shrink-0">
                  #{currentSectionMeta.number}
                </span>
                <SectionIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
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
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
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
          {activeSectionId === "about-hero" && (
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
      {activeSectionId === "about-mission" && (
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
      {activeSectionId === "about-stats" && (
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

      {/* SECTION 4: LEADERSHIP TEAM BADGES & TITLES + TABULAR DIRECTORY & EDIT MODAL */}
      {activeSectionId === "about-team" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-md">
                #04
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Leadership Section Badges, Titles & Team Members
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Manage section headings and executive leadership profiles in tabular format.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                {formData.leadership?.team?.length || 0} Members Configured
              </span>
              <button
                type="button"
                onClick={handleOpenAddMember}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {/* Section Headings Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Leadership Tag Badge
              </label>
              <input
                type="text"
                value={formData.leadership.tag}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadership: { ...formData.leadership, tag: e.target.value },
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadership: { ...formData.leadership, title: e.target.value },
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadership: { ...formData.leadership, subtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Members Table Directory Header with Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Team Directory (Tabular View)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click “Edit” on any row to open the full profile editor popup modal.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by name, role, skill..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {memberSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMemberSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Tabular List of Team Members */}
          {(() => {
            const filteredTeam = (formData.leadership?.team || []).filter((m) => {
              if (!memberSearchQuery.trim()) return true;
              const q = memberSearchQuery.toLowerCase();
              return (
                m.name?.toLowerCase().includes(q) ||
                m.role?.toLowerCase().includes(q) ||
                m.bio?.toLowerCase().includes(q) ||
                m.expertise?.some((skill) => skill.toLowerCase().includes(q))
              );
            });

            if (filteredTeam.length === 0) {
              return (
                <div className="text-center py-12 p-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl sm:rounded-2xl space-y-2">
                  <Users className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {memberSearchQuery ? "No members match your search filter." : "No team members configured yet."}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    {memberSearchQuery
                      ? "Try searching with a different term or clear the filter."
                      : "Add leadership and executive members to display them in the about page team section."}
                  </p>
                  {memberSearchQuery ? (
                    <button
                      type="button"
                      onClick={() => setMemberSearchQuery("")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Clear Search Filter
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenAddMember}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add First Member</span>
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f1422]">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-3 w-16 text-center">Order</th>
                      <th className="py-3 px-4">Member Profile</th>
                      <th className="py-3 px-4">Role / Title</th>
                      <th className="py-3 px-4">Bio Excerpt</th>
                      <th className="py-3 px-4">Core Expertise</th>
                      <th className="py-3 px-4 text-center">Social</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {filteredTeam.map((member) => {
                      const originalIdx = formData.leadership.team.findIndex((m) => m.id === member.id);
                      const computedInitials = getInitials(member.name);
                      const isFirst = originalIdx === 0;
                      const isLast = originalIdx === formData.leadership.team.length - 1;

                      return (
                        <tr
                          key={member.id}
                          className="bg-white dark:bg-[#131927] hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          {/* Order with Up/Down buttons */}
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-mono text-[11px] font-bold text-slate-400">
                                {String(originalIdx + 1).padStart(2, "0")}
                              </span>
                              <div className="flex flex-col opacity-60 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  disabled={isFirst}
                                  onClick={() => handleMoveMember(originalIdx, "up")}
                                  className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer"
                                  title="Move up"
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isLast}
                                  onClick={() => handleMoveMember(originalIdx, "down")}
                                  className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer"
                                  title="Move down"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Member Avatar & Full Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {member.imageUrl && member.imageUrl.trim() !== "" ? (
                                <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 bg-slate-900">
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
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                                  {computedInitials}
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-extrabold text-slate-900 dark:text-white block truncate">
                                  {member.name || "Unnamed Member"}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400 block truncate">
                                  {member.imageUrl ? "Custom Photo" : `Initials (${computedInitials})`}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Role / Title */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 truncate max-w-[200px]">
                              {member.role || "No Title"}
                            </span>
                          </td>

                          {/* Bio Excerpt */}
                          <td className="py-3.5 px-4 max-w-[220px]">
                            <p
                              className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed"
                              title={member.bio}
                            >
                              {member.bio || <span className="text-slate-400 italic">No bio provided</span>}
                            </p>
                          </td>

                          {/* Core Expertise Tags */}
                          <td className="py-3.5 px-4 max-w-[200px]">
                            <div className="flex flex-wrap items-center gap-1">
                              {(member.expertise || []).slice(0, 2).map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[110px]"
                                >
                                  {skill}
                                </span>
                              ))}
                              {(member.expertise || []).length > 2 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900">
                                  +{member.expertise!.length - 2}
                                </span>
                              )}
                              {(!member.expertise || member.expertise.length === 0) && (
                                <span className="text-slate-400 text-[11px] italic">None</span>
                              )}
                            </div>
                          </td>

                          {/* Social / LinkedIn */}
                          <td className="py-3.5 px-4 text-center">
                            {member.linkedinUrl ? (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-colors"
                                title="View LinkedIn Profile"
                              >
                                <Linkedin className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">-</span>
                            )}
                          </td>

                          {/* Actions: Edit & Delete */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditMember(member, originalIdx)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors cursor-pointer"
                                title="Edit Member Profile"
                              >
                                <Pencil className="h-3 w-3" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteMember(member)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Member"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}

          {/* Interactive Member Edit / Add Popup Modal */}
          {mounted && typeof window !== "undefined" && editingMember && createPortal(
            <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
              <div className="bg-white dark:bg-[#131927] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full my-6 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/60 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {editingMember.isNew ? "Add Leadership Member" : "Edit Leadership Member"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {editingMember.isNew
                          ? "Configure member details, portrait photo, bio, and LinkedIn expertise tags."
                          : `Editing profile for "${editingMember.member.name || "Team Member"}"`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                  {/* Live Card Preview Box */}
                  <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 p-3.5 flex items-center gap-3.5">
                    {editingMember.member.imageUrl && editingMember.member.imageUrl.trim() !== "" ? (
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm shrink-0 bg-slate-900">
                        <img
                          src={editingMember.member.imageUrl}
                          alt={editingMember.member.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
                        {getInitials(editingMember.member.name)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {editingMember.member.name || "Member Name"}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          Live Preview
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                        {editingMember.member.role || "Title / Designation"}
                      </p>
                    </div>
                  </div>

                  {/* Full Name & Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ashok Khanal, Rabin Shrestha"
                        value={editingMember.member.name}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            member: { ...editingMember.member, name: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block">
                        Title / Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Founder & Chief Executive Officer (CEO)"
                        value={editingMember.member.role}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            member: { ...editingMember.member, role: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Profile Photo File Upload */}
                  <FileUploadControl
                    label="Profile Photo File / Image URL (Cloudinary Supported)"
                    value={editingMember.member.imageUrl || ""}
                    accept="image/*"
                    mediaType="image"
                    placeholder="Upload image file to Cloudinary or enter URL..."
                    helperText={`Leave blank to display initials (${getInitials(editingMember.member.name)})`}
                    onChange={(val) =>
                      setEditingMember({
                        ...editingMember,
                        member: { ...editingMember.member, imageUrl: val },
                      })
                    }
                  />

                  {/* LinkedIn URL */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                      <Linkedin className="h-3.5 w-3.5 text-[#0a66c2]" />
                      LinkedIn Profile URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={editingMember.member.linkedinUrl || ""}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          member: { ...editingMember.member, linkedinUrl: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Professional Bio */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Professional Bio
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {editingMember.member.bio?.length || 0} characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Describe the leader's engineering expertise, track record, and technical leadership..."
                      value={editingMember.member.bio || ""}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          member: { ...editingMember.member, bio: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  {/* LinkedIn-Style Core Expertise Tag Manager */}
                  <LinkedInSkillSection
                    skills={editingMember.member.expertise || []}
                    onChange={(updatedSkills) =>
                      setEditingMember({
                        ...editingMember,
                        member: { ...editingMember.member, expertise: updatedSkills },
                      })
                    }
                  />
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-50/60 dark:bg-slate-900/50">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveMember}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{editingMember.isNew ? "Add Team Member" : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      )}

      {/* SECTION 5: TIMELINE JOURNEY SECTION HEADER (ABOUT PAGE ONLY) */}
      {(activeSectionId === "about-journey" || activeSectionId === "05") && (
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
      </div>
    </div>
  );
}