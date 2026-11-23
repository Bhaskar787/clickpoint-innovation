"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/confirm-dialog";
import {
  Save,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Info,
  Zap,
  Layers,
  Bot,
  Code2,
  Palette,
  LineChart,
  Boxes,
  Cpu,
  ShieldCheck,
  Clock,
  Award,
  UploadCloud,
  X,
  Image as ImageIcon,
  Video,
  ListPlus,
  Tag,
  Type,
  TrendingUp,
  MousePointerClick,
  FileText,
  Workflow,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Link as LinkIcon,
  Pencil,
  Search,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SectionNavSidebar, SectionNavItem } from "@/components/admin/dashboard/section-nav-sidebar";
import { ServiceIcon, ServiceIconPicker } from "@/components/ui/industry-icon";

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
                toast.info("Cleared media URL");
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
          <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-200 shrink-0">
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          </div>
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

export const DEFAULT_SERVICES_CONTENT = {
  hero: {
    badge: "Full-Spectrum Software Engineering Pods",
    title: "Engineering Next-Gen AI & Digital Solutions",
    subtitle:
      "From custom autonomous LLM agents to high-concurrency cloud microservices, we build scalable software systems designed for compounding business velocity.",
  },
  catalogSection: {
    tag: "Our Core Disciplines",
    title: "End-to-End Capabilities Built for Scale",
  },
  processSection: {
    tag: "Engineering Process & Pod Model",
    title: "How Our Dedicated Pods Build & Scale Software",
    subtitle:
      "A disciplined, 4-phase agile engineering methodology engineered for sub-second performance, continuous deployment, and enterprise security.",
    steps: [
      {
        step: "01",
        title: "Discovery & Pod Assembly",
        desc: "We analyze product specs, define technical architecture, and assemble a dedicated 100% senior engineering pod tailored to your stack.",
        deliverable: "Architecture Blueprint & Pod Roadmap",
      },
      {
        step: "02",
        title: "Rapid Prototyping & MVP",
        desc: "2-4 week sprint cycles delivering functional code, interactive Figma UI prototypes, and early CI/CD pipeline integration.",
        deliverable: "Working MVP & Automated Test Suite",
      },
      {
        step: "03",
        title: "Continuous Integration & AI Pods",
        desc: "Daily code commits, automated peer code reviews, LLM copilot augmentation, and real-time staging deployments.",
        deliverable: "Production Release Candidate",
      },
      {
        step: "04",
        title: "Scale, SLA & Managed Ops",
        desc: "99.99% uptime monitoring, auto-scaling cloud microservices, SOC2 data isolation, and ongoing maintenance SLA.",
        deliverable: "Enterprise SLA & Live Production",
      },
    ],
  },
  services: [
    {
      id: "ai-eng",
      title: "AI Product Engineering",
      subtitle: "Copilots, Autonomous Agents & LLM-Native Platforms",
      buttonText: "Explore Capabilities",
      desc: "Transform enterprise workflows with custom LLMs, autonomous AI agents, and RAG architectures integrated directly into your data pipeline.",
      fullOverview:
        "Clickpoint Innovation specializes in building LLM-native applications that go far beyond standard API integrations. We design production-grade autonomous agent pods, vector database knowledge bases, and fine-tuned domain models.",
      heroBadge: "AI & Autonomous Systems",
      icon: "BsRobot",
      iconName: "BsRobot",
      imageUrl: "",
      keyMetrics: [
        { label: "Execution Latency", value: "< 250ms" },
        { label: "Accuracy Rate", value: "99.4%" },
        { label: "Efficiency Gain", value: "4.5x" },
      ],
      features: [
        { title: "Autonomous AI Agent Pods", desc: "Multi-agent orchestration frameworks capable of complex tool execution." },
        { title: "Retrieval-Augmented Generation (RAG)", desc: "Enterprise vector storage indexing proprietary documents." },
        { title: "Fine-Tuned Domain LLMs", desc: "Custom model fine-tuning for specific verticals." },
      ],
      workflow: [
        { step: "01", title: "Data Ingestion & RAG Indexing", desc: "Extracting, chunking, and embedding unstructured enterprise knowledge." },
        { step: "02", title: "Agent Orchestration", desc: "Building stateful multi-agent workflows with tools, memory, and safety guardrails." },
        { step: "03", title: "Model Fine-Tuning & Evaluation", desc: "Optimizing prompts, fine-tuning open weights, and evaluating task accuracy." },
        { step: "04", title: "Enterprise API & UI Deployment", desc: "Deploying secure, sub-second latency REST/GraphQL endpoints and copilot UIs." },
      ],
      useCases: [
        "Automated Customer Support Agents",
        "Proprietary Enterprise Document Search",
        "Autonomous Code & Refactoring Assistants",
        "Predictive Business Intelligence Engines",
      ],
      techStack: ["Python", "LangChain", "LlamaIndex", "Pinecone", "OpenAI API", "Next.js"],
      ctaPrimaryText: "Request Service Audit",
      ctaPrimaryRoute: "/contact",
      ctaSecondaryText: "All Services",
      ctaSecondaryRoute: "/services",
      overviewTag: "Detailed Overview",
      overviewHeading: "How We Deliver Exceptional",
      capabilitiesTag: "Core Capabilities",
      capabilitiesHeading: "Engineered features for maximum impact",
      blueprintTag: "Execution Blueprint",
      blueprintHeading: "Our step-by-step delivery process",
      useCasesHeading: "Primary Use Cases for",
    },
    {
      id: "web-dev",
      title: "Web & App Development",
      subtitle: "Full-Stack React, Next.js & Mobile Engineering",
      buttonText: "Explore Capabilities",
      desc: "Engineered for speed, scale, and sub-second load times. We build resilient Web & Mobile applications that convert and compound.",
      fullOverview:
        "Our full-stack engineering pods build mission-critical web applications, enterprise portals, and mobile apps using Next.js App Router, React Native, and serverless edge computing architectures.",
      heroBadge: "Full-Stack Web & Mobile",
      icon: "BsCodeSlash",
      iconName: "BsCodeSlash",
      imageUrl: "",
      keyMetrics: [
        { label: "Lighthouse Score", value: "98/100" },
        { label: "Core Web Vitals", value: "Passed" },
        { label: "Uptime SLA", value: "99.99%" },
      ],
      features: [
        { title: "Next.js App Router & SSR", desc: "Server-side rendering and edge caching for ultra-fast load speed." },
        { title: "Cross-Platform Mobile Apps", desc: "Native iOS & Android apps built with React Native." },
        { title: "Microservices Architecture", desc: "Decoupled backend API services built with Node.js & Go." },
      ],
      workflow: [
        { step: "01", title: "Discovery & System Architecture", desc: "Mapping user journeys, database schemas, and edge caching strategies." },
        { step: "02", title: "Frontend & Design System", desc: "Coding accessible, high-performance UI components in Next.js & Tailwind." },
        { step: "03", title: "Backend & Cloud API Integration", desc: "Developing REST/gRPC microservices with Postgres and Redis caching." },
        { step: "04", title: "CI/CD & Security Audits", desc: "Automating zero-downtime deployments with SOC2 security compliance." },
      ],
      useCases: [
        "B2B SaaS Portals & Dashboards",
        "High-Scale E-Commerce Stores",
        "Cross-Platform Native Mobile Apps",
        "Real-Time Analytics Platforms",
      ],
      techStack: ["React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", "PostgreSQL"],
      ctaPrimaryText: "Request Service Audit",
      ctaPrimaryRoute: "/contact",
      ctaSecondaryText: "All Services",
      ctaSecondaryRoute: "/services",
      overviewTag: "Detailed Overview",
      overviewHeading: "How We Deliver Exceptional",
      capabilitiesTag: "Core Capabilities",
      capabilitiesHeading: "Engineered features for maximum impact",
      blueprintTag: "Execution Blueprint",
      blueprintHeading: "Our step-by-step delivery process",
      useCasesHeading: "Primary Use Cases for",
    },
    {
      id: "ui-ux",
      title: "UI/UX & Product Design",
      subtitle: "Design Systems, Motion Micro-Animations & CRO",
      buttonText: "Explore Capabilities",
      desc: "Human-centric digital interfaces designed to engage users, eliminate friction, and maximize conversion rates.",
      fullOverview:
        "We craft conversion-focused design systems, interactive prototypes, and accessible UI component libraries tailored for B2B SaaS and complex web applications.",
      heroBadge: "Design Systems & UX",
      icon: "BsPalette",
      iconName: "BsPalette",
      imageUrl: "",
      keyMetrics: [
        { label: "Conversion Lift", value: "+38%" },
        { label: "Design Velocity", value: "2x" },
        { label: "User Retention", value: "+45%" },
      ],
      features: [
        { title: "Design Systems & UI Kits", desc: "Scalable component libraries built in Figma and coded in React." },
        { title: "User Journey & Wireframing", desc: "Data-driven UX research mapping user flows and micro-interactions." },
      ],
      workflow: [
        { step: "01", title: "UX Audit & Analytics Review", desc: "Analyzing drop-off friction points, heatmaps, and user interview data." },
        { step: "02", title: "Wireframes & Information Architecture", desc: "Mapping user flows, screen hierarchies, and conversion pathways." },
        { step: "03", title: "Design System & Figma Components", desc: "Building tokenized design systems with micro-animations." },
        { step: "04", title: "Hand-off & React Component Build", desc: "Coding component tokens directly into Tailwind & React libraries." },
      ],
      useCases: [
        "B2B SaaS Product Redesigns",
        "Design System Tokenization",
        "Conversion Rate Optimization (CRO)",
        "Interactive Motion Prototypes",
      ],
      techStack: ["Figma", "Framer Motion", "TailwindCSS", "Storybook", "Adobe CC"],
      ctaPrimaryText: "Request Service Audit",
      ctaPrimaryRoute: "/contact",
      ctaSecondaryText: "All Services",
      ctaSecondaryRoute: "/services",
      overviewTag: "Detailed Overview",
      overviewHeading: "How We Deliver Exceptional",
      capabilitiesTag: "Core Capabilities",
      capabilitiesHeading: "Engineered features for maximum impact",
      blueprintTag: "Execution Blueprint",
      blueprintHeading: "Our step-by-step delivery process",
      useCasesHeading: "Primary Use Cases for",
    },
    {
      id: "growth",
      title: "Growth Marketing & CRO",
      subtitle: "Technical SEO, Conversion Optimization & Lifecycle",
      buttonText: "Explore Capabilities",
      desc: "Scientific growth engines driving customer acquisition, funnel conversion, and long-term customer lifetime value.",
      fullOverview:
        "Our growth specialists combine technical SEO, CRO A/B testing frameworks, and automated email lifecycle sequences to scale monthly recurring revenue.",
      heroBadge: "Growth & Conversion",
      icon: "BsGraphUpArrow",
      iconName: "BsGraphUpArrow",
      imageUrl: "",
      keyMetrics: [
        { label: "Organic Traffic", value: "+210%" },
        { label: "CAC Reduction", value: "-35%" },
        { label: "Pipeline ARR", value: "3.2x" },
      ],
      features: [
        { title: "Technical SEO Audits", desc: "Indexation, schema markup, and speed optimization for top rankings." },
        { title: "Funnel Conversion Testing", desc: "Scientific A/B testing optimizing landing page conversions." },
      ],
      workflow: [
        { step: "01", title: "Growth & SEO Audit", desc: "Identifying high-intent keywords, technical SEO errors, and landing page leaks." },
        { step: "02", title: "Landing Page & Copy CRO", desc: "Writing high-converting value props and designing high-velocity landing pages." },
        { step: "03", title: "A/B Testing & Funnel Tuning", desc: "Deploying scientific split tests to optimize click-through and trial signups." },
        { step: "04", title: "Automated Lifecycle Engines", desc: "Setting up automated email, SMS, and retargeting sequences." },
      ],
      useCases: [
        "Organic Traffic & SEO Scaling",
        "Landing Page Conversion Lift",
        "SaaS Lifecycle Email Automation",
        "Paid CAC Optimization",
      ],
      techStack: ["Google Analytics 4", "Semrush", "Mixpanel", "HubSpot", "Hotjar"],
      ctaPrimaryText: "Request Service Audit",
      ctaPrimaryRoute: "/contact",
      ctaSecondaryText: "All Services",
      ctaSecondaryRoute: "/services",
      overviewTag: "Detailed Overview",
      overviewHeading: "How We Deliver Exceptional",
      capabilitiesTag: "Core Capabilities",
      capabilitiesHeading: "Engineered features for maximum impact",
      blueprintTag: "Execution Blueprint",
      blueprintHeading: "Our step-by-step delivery process",
      useCasesHeading: "Primary Use Cases for",
    },
  ],
};

const SERVICES_SECTIONS_CATALOG: SectionNavItem[] = [
  {
    id: "services-hero",
    number: "01",
    title: "Services Catalog Hero Banner",
    desc: "Header badge, headline titles, and descriptive subtitle for the services catalog.",
    icon: Info,
    badge: "Hero Banner",
  },
  {
    id: "services-list",
    number: "02",
    title: "Core Services Cards Catalog",
    desc: "Manage all service cards, unique route slugs, card subtitles, and action buttons.",
    icon: Layers,
    badge: "Services Cards",
  },
  {
    id: "services-details",
    number: "03",
    title: "Individual Service Detail Pages",
    desc: "Per-service metrics, capabilities, 4-phase agile blueprint, and tech stack tags.",
    icon: Workflow,
    badge: "Detail Pages",
  },
];

interface ServicesPageEditorProps {
  sectionId: string | null;
  onCloseSection: () => void;
  onNavigateToDetailSection?: (serviceId: string) => void;
}

export default function ServicesPageEditor({
  sectionId,
  onCloseSection,
  onNavigateToDetailSection,
}: ServicesPageEditorProps) {
  const { confirm } = useConfirm();
  const [activeSectionId, setActiveSectionId] = useState<string>(
    sectionId === "services-catalog" ? "services-list" : sectionId === "service-detail" ? "services-details" : (sectionId || "services-hero")
  );
  const [formData, setFormData] = useState(DEFAULT_SERVICES_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string>("ai-eng");
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");
  const [editingCatalogService, setEditingCatalogService] = useState<{
    service: any;
    index?: number;
    isNew: boolean;
  } | null>(null);
  const [editingDetailServiceId, setEditingDetailServiceId] = useState<string | null>(null);
  const [detailSearchQuery, setDetailSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sectionId) {
      if (sectionId === "services-catalog") {
        setActiveSectionId("services-list");
      } else if (sectionId === "service-detail") {
        setActiveSectionId("services-details");
      } else {
        setActiveSectionId(sectionId);
      }
    }
  }, [sectionId]);

  useEffect(() => {
    async function loadServicesData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/services");
        const json = await res.json();

        if (json.success && json.data) {
          const parsed = json.data;
          const mergedServices =
            Array.isArray(parsed.services) && parsed.services.length > 0
              ? parsed.services.map((svc: any, idx: number) => ({
                  id: svc.id || `service-${idx + 1}`,
                  title: svc.title || "Unnamed Service",
                  subtitle: svc.subtitle || "Enterprise Digital Solution",
                  buttonText: svc.buttonText || "Explore Capabilities",
                  desc: svc.desc || "Detailed description of this service's capabilities.",
                  fullOverview:
                    svc.fullOverview ||
                    "Comprehensive overview narrative explaining how we deliver this discipline for enterprise clients.",
                  heroBadge: svc.heroBadge || "Custom Engineering Pod",
                  imageUrl: svc.imageUrl || "",
                  keyMetrics:
                    svc.keyMetrics && svc.keyMetrics.length > 0
                      ? svc.keyMetrics
                      : [
                          { label: "Execution Latency", value: "< 250ms" },
                          { label: "Accuracy Rate", value: "99.4%" },
                          { label: "Efficiency Gain", value: "4.5x" },
                        ],
                  features:
                    svc.features && svc.features.length > 0
                      ? svc.features
                      : [
                          { title: "Core Feature 1", desc: "Detailed breakdown of capability 1." },
                          { title: "Core Feature 2", desc: "Detailed breakdown of capability 2." },
                        ],
                  workflow:
                    svc.workflow && svc.workflow.length > 0
                      ? svc.workflow
                      : [
                          { step: "01", title: "Discovery & Architecture", desc: "Mapping specifications and assembling the engineering pod." },
                          { step: "02", title: "Prototyping & MVP Sprint", desc: "Delivering working software in 2-4 week sprint cycles." },
                        ],
                  useCases:
                    svc.useCases && svc.useCases.length > 0
                      ? svc.useCases
                      : ["Enterprise Process Automation", "Custom Cloud Platform Building"],
                  techStack:
                    svc.techStack && svc.techStack.length > 0
                      ? svc.techStack
                      : ["Next.js", "Python", "Cloud"],
                  ctaPrimaryText: svc.ctaPrimaryText || "Request Service Audit",
                  ctaPrimaryRoute: svc.ctaPrimaryRoute || "/contact",
                  ctaSecondaryText: svc.ctaSecondaryText || "All Services",
                  ctaSecondaryRoute: svc.ctaSecondaryRoute || "/services",
                  overviewTag: svc.overviewTag || "Detailed Overview",
                  overviewHeading: svc.overviewHeading || "How We Deliver Exceptional",
                  capabilitiesTag: svc.capabilitiesTag || "Core Capabilities",
                  capabilitiesHeading: svc.capabilitiesHeading || "Engineered features for maximum impact",
                  blueprintTag: svc.blueprintTag || "Execution Blueprint",
                  blueprintHeading: svc.blueprintHeading || "Our step-by-step delivery process",
                  useCasesHeading: svc.useCasesHeading || "Primary Focus Areas",
                }))
              : DEFAULT_SERVICES_CONTENT.services;

          setFormData({
            hero: { ...DEFAULT_SERVICES_CONTENT.hero, ...(parsed.hero || {}) },
            catalogSection: { ...DEFAULT_SERVICES_CONTENT.catalogSection, ...(parsed.catalogSection || {}) },
            processSection: {
              ...DEFAULT_SERVICES_CONTENT.processSection,
              ...(parsed.processSection || {}),
              steps:
                parsed.processSection?.steps && parsed.processSection.steps.length > 0
                  ? parsed.processSection.steps
                  : DEFAULT_SERVICES_CONTENT.processSection.steps,
            },
            services: mergedServices,
          });
          setSelectedDetailId(mergedServices[0]?.id || "ai-eng");
        }
      } catch (error) {
        console.error("Failed to load services content:", error);
        toast.error("Failed to load Services data from database.");
      } finally {
        setIsLoading(false);
      }
    }
    loadServicesData();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    const toastId = toast.loading("Saving services changes to database...");
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Services page saved to database successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save services page content", { id: toastId });
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error("Save failed: " + (err?.message || "Server error"), { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    const ok = await confirm({
      title: "Reset Services Content",
      message: "Are you sure you want to reset all Services data to defaults? This will overwrite all custom catalog items and configurations.",
      confirmText: "Reset to Defaults",
      variant: "warning",
      icon: "refresh",
    });
    if (!ok) return;

    setFormData(DEFAULT_SERVICES_CONTENT);
    setSelectedDetailId(DEFAULT_SERVICES_CONTENT.services[0].id);

    const toastId = toast.loading("Resetting services in database...");
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_SERVICES_CONTENT),
      });
      const json = await res.json();
      if (json.success) {
        toast.info("Reset to default Services page content!", { id: toastId });
      }
    } catch {
      toast.error("Failed to reset content", { id: toastId });
    }
  }

  function handleOpenAddService() {
    const uniqueId = `service-${Date.now().toString().slice(-4)}`;
    const newSvc = {
      id: uniqueId,
      title: "",
      subtitle: "",
      buttonText: "Explore Capabilities",
      desc: "",
      icon: "BsCodeSlash",
      iconName: "BsCodeSlash",
      fullOverview: "Detailed overview narrative explaining how we deliver this discipline for enterprise clients.",
      heroBadge: "Custom Engineering Pod",
      imageUrl: "",
      keyMetrics: [
        { label: "Execution Speed", value: "3x" },
        { label: "Reliability SLA", value: "99.9%" },
        { label: "Efficiency Gain", value: "4x" },
      ],
      features: [
        { title: "Core Feature 1", desc: "Detailed breakdown of capability 1." },
        { title: "Core Feature 2", desc: "Detailed breakdown of capability 2." },
      ],
      workflow: [
        { step: "01", title: "Discovery & Architecture", desc: "Mapping specifications and assembling the engineering pod." },
        { step: "02", title: "Prototyping & MVP Sprint", desc: "Delivering working software in 2-4 week sprint cycles." },
        { step: "03", title: "Continuous Integration & AI", desc: "Automated peer code reviews and staging deployments." },
        { step: "04", title: "Scale & Managed Ops", desc: "99.99% uptime monitoring and managed operations." },
      ],
      useCases: ["Enterprise Scale Automation", "Custom Cloud Platform Building"],
      techStack: ["Next.js", "TypeScript", "Python"],
      ctaPrimaryText: "Request Service Audit",
      ctaPrimaryRoute: "/contact",
      ctaSecondaryText: "All Services",
      ctaSecondaryRoute: "/services",
      overviewTag: "Detailed Overview",
      overviewHeading: "How We Deliver Exceptional",
      capabilitiesTag: "Core Capabilities",
      capabilitiesHeading: "Engineered features for maximum impact",
      blueprintTag: "Execution Blueprint",
      blueprintHeading: "Our step-by-step delivery process",
      useCasesHeading: "Primary Focus Areas",
    };

    setEditingCatalogService({
      service: newSvc,
      isNew: true,
    });
  }

  function handleOpenEditCatalogService(svc: any, index: number) {
    setEditingCatalogService({
      service: {
        ...svc,
        icon: typeof svc.icon === "string" ? svc.icon : (svc.iconName || ""),
        iconName: typeof svc.iconName === "string" ? svc.iconName : (typeof svc.icon === "string" ? svc.icon : ""),
      },
      index,
      isNew: false,
    });
  }

  function handleSaveCatalogServiceModal() {
    if (!editingCatalogService) return;
    const { service, isNew, index } = editingCatalogService;
    if (!service.title.trim()) {
      toast.error("Please enter a Service Title");
      return;
    }
    if (!service.id.trim()) {
      toast.error("Please enter a unique URL Slug / ID");
      return;
    }

    const cleanSlug = service.id.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const finalService = {
      ...service,
      id: cleanSlug,
    };

    let nextServices = [...formData.services];
    if (isNew) {
      nextServices.push(finalService);
      toast.success(`Service "${finalService.title}" added to catalog!`);
    } else if (typeof index === "number") {
      nextServices[index] = finalService;
      toast.success(`Service "${finalService.title}" updated!`);
    }

    setFormData({ ...formData, services: nextServices });
    setEditingCatalogService(null);
  }

  async function handleDeleteService(svc: (typeof DEFAULT_SERVICES_CONTENT.services)[0], index: number) {
    if (formData.services.length <= 1) {
      toast.error("Cannot delete the only service in the catalog.");
      return;
    }
    const ok = await confirm({
      title: "Delete Service",
      message: `Are you sure you want to delete service "${svc.title}" (/services/${svc.id})? This will remove all associated capabilities, metrics, and details.`,
      confirmText: "Delete Service",
      variant: "danger",
    });
    if (ok) {
      const updated = formData.services.filter((_, i) => i !== index);
      setFormData({ ...formData, services: updated });
      if (selectedDetailId === svc.id) {
        setSelectedDetailId(updated[0]?.id || "ai-eng");
      }
      if (editingDetailServiceId === svc.id) {
        setEditingDetailServiceId(null);
      }
      toast.success(`Deleted service "${svc.title}"`);
    }
  }

  function handleMoveService(index: number, direction: "UP" | "DOWN") {
    const list = [...formData.services];
    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({ ...formData, services: list });
  }

  function handleNavigateToServiceDetail(serviceId: string) {
    setSelectedDetailId(serviceId);
    setEditingDetailServiceId(serviceId);
    setActiveSectionId("services-details");
  }

  function handleBackToDetailDirectory() {
    setEditingDetailServiceId(null);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] gap-3 bg-white dark:bg-[#131927] rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center">Loading Services Page data from database...</p>
      </div>
    );
  }

  const targetDetailId = editingDetailServiceId || selectedDetailId;
  const selectedServiceIndex = formData.services.findIndex((s) => s.id === targetDetailId);
  const currentService = selectedServiceIndex !== -1 ? formData.services[selectedServiceIndex] : formData.services[0];

  const filteredCatalogServices = formData.services.filter((s) => {
    if (!catalogSearchQuery.trim()) return true;
    const q = catalogSearchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.subtitle && s.subtitle.toLowerCase().includes(q)) ||
      (s.desc && s.desc.toLowerCase().includes(q))
    );
  });

  const filteredDetailServices = formData.services.filter((s) => {
    if (!detailSearchQuery.trim()) return true;
    const q = detailSearchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.heroBadge && s.heroBadge.toLowerCase().includes(q)) ||
      (s.techStack && s.techStack.some((t: string) => t.toLowerCase().includes(q)))
    );
  });

  const currentSectionMeta =
    SERVICES_SECTIONS_CATALOG.find((s) => s.id === activeSectionId) || SERVICES_SECTIONS_CATALOG[0];
  const SectionIcon = currentSectionMeta.icon || Info;

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 text-slate-900 dark:text-white">
      {/* 2-Column Master-Detail Selection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Selector */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-4">
          <SectionNavSidebar
            title="Services Sections"
            sections={SERVICES_SECTIONS_CATALOG}
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

          {/* SECTION 1: MAIN SERVICES HERO BANNER & CATALOG HEADINGS */}
          {activeSectionId === "services-hero" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-xs sm:text-sm font-bold">Services Catalog Main Hero Banner & Headlines</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Hero Tag Badge
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
                rows={2}
                value={formData.hero.subtitle}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CATALOG SERVICES LIST & UNIQUE ID MANAGER - TABULAR FORM */}
      {(activeSectionId === "services-list" || activeSectionId === "services-catalog") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-5">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                  #02
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Core Services Cards Catalog
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {formData.services.length} Total Services
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                Manage all catalog cards displayed on the <span className="font-mono text-blue-600 dark:text-blue-400">/services</span> page. Reorder items, edit card info in a modal, or jump straight to deep detail configuration.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddService}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Service</span>
              </button>
            </div>
          </div>

          {/* Filter & Live Search Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services by title, slug, subtitle..."
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Showing {filteredCatalogServices.length} of {formData.services.length} services
            </span>
          </div>

          {/* Tabular Form of Catalog Services */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="py-3 px-3 w-16 text-center">Order</th>
                  <th className="py-3 px-3 min-w-[200px]">Service &amp; Slug</th>
                  <th className="py-3 px-3 min-w-[150px]">Subtitle Badge</th>
                  <th className="py-3 px-3 min-w-[240px]">Card Description &amp; CTA</th>
                  <th className="py-3 px-3 min-w-[160px]">Configured Assets</th>
                  <th className="py-3 px-3 text-right min-w-[210px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCatalogServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No services match your search &quot;{catalogSearchQuery}&quot;
                    </td>
                  </tr>
                ) : (
                  filteredCatalogServices.map((svc) => {
                    const realIndex = formData.services.findIndex((s) => s.id === svc.id);
                    return (
                      <tr
                        key={svc.id}
                        className={`hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors ${
                          selectedDetailId === svc.id ? "bg-blue-50/30 dark:bg-blue-950/20" : ""
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
                                onClick={() => handleMoveService(realIndex, "UP")}
                                className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-slate-400"
                                title="Move Up"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={realIndex === formData.services.length - 1}
                                onClick={() => handleMoveService(realIndex, "DOWN")}
                                className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-slate-400"
                                title="Move Down"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Title, Icon & Slug */}
                        <td className="py-3 px-3 align-middle">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100/80 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-200/60 dark:border-slate-700 shrink-0 shadow-xs">
                              <ServiceIcon
                                icon={(svc as any).icon}
                                iconName={(svc as any).iconName}
                                serviceId={svc.id}
                                className="h-4 w-4"
                              />
                            </span>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {svc.title || "Untitled Service"}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <a
                                  href={`/services/${svc.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  <span>/services/{svc.id}</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Subtitle Badge */}
                        <td className="py-3 px-3 align-middle">
                          <span className="inline-block max-w-[150px] truncate px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/50">
                            {svc.subtitle || "No Subtitle"}
                          </span>
                        </td>

                        {/* Summary & CTA */}
                        <td className="py-3 px-3 align-middle">
                          <p className="line-clamp-2 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                            {svc.desc || "No description specified."}
                          </p>
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              <span>Button:</span>
                              <span className="text-slate-700 dark:text-slate-200">&quot;{svc.buttonText || "Explore Capabilities"}&quot;</span>
                            </span>
                          </div>
                        </td>

                        {/* Configured Assets Badges */}
                        <td className="py-3 px-3 align-middle">
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {svc.keyMetrics?.length || 0} KPIs
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {svc.features?.length || 0} Feat.
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {svc.workflow?.length || 0} Steps
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 align-middle text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCatalogService(svc, realIndex)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors"
                              title="Edit Catalog Card"
                            >
                              <Pencil className="h-3 w-3 text-slate-500" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleNavigateToServiceDetail(svc.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
                              title="Configure Detail Page (/services/[id])"
                            >
                              <span>Detail Page</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>

                            {formData.services.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteService(svc, realIndex)}
                                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                                title="Delete Service"
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
            <span>Tip: To edit the full breakdown (KPIs, Features, Workflow, Tech Stack), click &quot;Detail Page&quot; on any service.</span>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving..." : "Save Services"}</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: INDIVIDUAL SERVICE DETAIL PAGE CONFIGURATOR */}
      {(activeSectionId === "services-details" || activeSectionId === "service-detail") && (

        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-5">
          {editingDetailServiceId === null ? (
            /* =========================================================================
               TABULAR DIRECTORY OF ALL SERVICE DETAIL PAGES
               ========================================================================= */
            <div className="space-y-4">
              {/* Directory Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                      #03
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Individual Service Detail Pages Directory
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                      {formData.services.length} Detail Pages
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                    Directory of deep detail route pages (<span className="font-mono text-blue-600 dark:text-blue-400">/services/[id]</span>). Click <span className="font-semibold text-slate-700 dark:text-slate-200">&quot;Edit Detail Page&quot;</span> on any row to configure its full overview, KPI metrics, capabilities, delivery blueprint, and tech stack.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSectionId("services-list")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <span>View Catalog Grid (#02)</span>
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
                    placeholder="Search detail pages by title, slug, hero badge, or tech..."
                    value={detailSearchQuery}
                    onChange={(e) => setDetailSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  Showing {filteredDetailServices.length} of {formData.services.length} services
                </span>
              </div>

              {/* Tabular Table of Detail Pages */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                      <th className="py-3 px-3 w-12 text-center">#</th>
                      <th className="py-3 px-3 min-w-[210px]">Service &amp; Route</th>
                      <th className="py-3 px-3 min-w-[150px]">Hero Section Badge</th>
                      <th className="py-3 px-3 min-w-[180px]">Key Metrics (KPIs)</th>
                      <th className="py-3 px-3 min-w-[120px]">Capabilities</th>
                      <th className="py-3 px-3 min-w-[120px]">Blueprint</th>
                      <th className="py-3 px-3 min-w-[160px]">Tech Stack</th>
                      <th className="py-3 px-3 text-right min-w-[160px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredDetailServices.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                          No service detail pages match your query &quot;{detailSearchQuery}&quot;
                        </td>
                      </tr>
                    ) : (
                      filteredDetailServices.map((svc) => {
                        const realIdx = formData.services.findIndex((s) => s.id === svc.id);
                        return (
                          <tr
                            key={svc.id}
                            className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                          >
                            {/* Number */}
                            <td className="py-3.5 px-3 text-center align-middle font-mono text-[11px] font-bold text-slate-500">
                              {realIdx + 1}
                            </td>

                            {/* Title & Slug */}
                            <td className="py-3.5 px-3 align-middle">
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {svc.title}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <a
                                  href={`/services/${svc.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  <span>/services/{svc.id}</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            </td>

                            {/* Hero Badge */}
                            <td className="py-3.5 px-3 align-middle">
                              <span className="inline-block max-w-[140px] truncate px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900/40">
                                {svc.heroBadge || "Default Pod"}
                              </span>
                            </td>

                            {/* Key Metrics */}
                            <td className="py-3.5 px-3 align-middle">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {svc.keyMetrics && svc.keyMetrics.length > 0 ? (
                                  svc.keyMetrics.slice(0, 3).map((m: any, mIdx: number) => (
                                    <span
                                      key={mIdx}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400"
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

                            {/* Capabilities */}
                            <td className="py-3.5 px-3 align-middle">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                <span>{svc.features?.length || 0} items</span>
                              </span>
                            </td>

                            {/* Blueprint */}
                            <td className="py-3.5 px-3 align-middle">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <Workflow className="h-3 w-3 text-blue-500" />
                                <span>{svc.workflow?.length || 0} steps</span>
                              </span>
                            </td>

                            {/* Tech Stack */}
                            <td className="py-3.5 px-3 align-middle">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {svc.techStack && svc.techStack.length > 0 ? (
                                  svc.techStack.slice(0, 2).map((t: string, tIdx: number) => (
                                    <span
                                      key={tIdx}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40"
                                    >
                                      {t}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-400">None</span>
                                )}
                                {(svc.techStack?.length || 0) > 2 && (
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    +{(svc.techStack?.length || 0) - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Action Button */}
                            <td className="py-3.5 px-3 align-middle text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDetailId(svc.id);
                                  setEditingDetailServiceId(svc.id);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs"
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
               INDIVIDUAL SERVICE DETAIL CONFIGURATOR VIEW (Steps 1 to 6)
               ========================================================================= */
            <div className="space-y-5">
              {/* Top Navigation & Service Switcher Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={handleBackToDetailDirectory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs shrink-0"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden sm:inline">Back to All Services Directory</span>
                    <span className="sm:hidden">Back to Directory</span>
                  </button>
                  <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block shrink-0" />
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs text-slate-500 hidden sm:inline shrink-0">Editing Detail Page:</span>
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 truncate max-w-[200px] md:max-w-[320px]">
                      {currentService.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-xs font-bold text-slate-500 shrink-0">Switch Service:</label>
                  <select
                    value={selectedDetailId}
                    onChange={(e) => {
                      setSelectedDetailId(e.target.value);
                      setEditingDetailServiceId(e.target.value);
                    }}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {formData.services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.title} ({svc.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentService && (
                <div className="space-y-4 sm:space-y-6">
              
              {/* STEP 1: Hero Section & Cloudinary Media Upload */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                    Step 1: Hero Banner & Media (<span className="text-blue-600 truncate max-w-[120px] sm:max-w-none">{currentService.title}</span>)
                  </h4>
                  <a
                    href={`/services/${currentService.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <span>Preview Route</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hero Section Badge Tag
                    </label>
                    <input
                      type="text"
                      value={currentService.heroBadge || ""}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].heroBadge = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <FileUploadControl
                    label="Hero / Overview Cloudinary Media Image File"
                    value={currentService.imageUrl || ""}
                    accept="image/*"
                    mediaType="image"
                    placeholder="Upload image to Cloudinary..."
                    onChange={(val) => {
                      const updated = [...formData.services];
                      updated[selectedServiceIndex].imageUrl = val;
                      setFormData({ ...formData, services: updated });
                    }}
                  />
                </div>
              </div>

              {/* STEP 2: Detailed Overview Section */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <Type className="h-4 w-4 text-blue-500 shrink-0" />
                  Step 2: Detailed Overview Section Content & Focus Areas
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Overview Section Tag Label
                    </label>
                    <input
                      type="text"
                      value={currentService.overviewTag || "Detailed Overview"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].overviewTag = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Overview Heading Prefix
                    </label>
                    <input
                      type="text"
                      value={currentService.overviewHeading || "How We Deliver Exceptional"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].overviewHeading = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Overview Detailed Paragraph Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={currentService.fullOverview || ""}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].fullOverview = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Primary Use Cases / Focus Areas */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5 w-full sm:w-auto">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Primary Focus Areas Headline
                      </label>
                      <input
                        type="text"
                        value={currentService.useCasesHeading || "Primary Focus Areas"}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].useCasesHeading = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        className="w-full sm:w-auto rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].useCases = [
                          ...(updated[selectedServiceIndex].useCases || []),
                          "New Enterprise Use Case",
                        ];
                        setFormData({ ...formData, services: updated });
                        toast.success("Added use case!");
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline self-start sm:self-auto"
                    >
                      + Add Focus Area
                    </button>
                  </div>

                  <div className="space-y-2">
                    {currentService.useCases?.map((uc: string, uIdx: number) => (
                      <div key={uIdx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                        <input
                          type="text"
                          value={uc}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].useCases[uIdx] = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                        />
                        {currentService.useCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.services];
                              updated[selectedServiceIndex].useCases = updated[selectedServiceIndex].useCases.filter(
                                (_: string, idx: number) => idx !== uIdx
                              );
                              setFormData({ ...formData, services: updated });
                              toast.success("Deleted focus area!");
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 3: Key Performance Metrics */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 shrink-0" />
                    <h4 className="text-xs font-bold">
                      Step 3: Key Performance Metrics ({currentService.keyMetrics?.length || 0})
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.services];
                      const newMetric = { label: "Performance SLA", value: "99.9%" };
                      updated[selectedServiceIndex].keyMetrics = [
                        ...(updated[selectedServiceIndex].keyMetrics || []),
                        newMetric,
                      ];
                      setFormData({ ...formData, services: updated });
                      toast.success("Added new metric!");
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentService.keyMetrics?.map((met: any, mIdx: number) => (
                    <div key={mIdx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-blue-600">Metric #{mIdx + 1}</span>
                        {currentService.keyMetrics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.services];
                              updated[selectedServiceIndex].keyMetrics = updated[selectedServiceIndex].keyMetrics.filter(
                                (_: any, idx: number) => idx !== mIdx
                              );
                              setFormData({ ...formData, services: updated });
                              toast.success("Deleted metric!");
                            }}
                            className="text-red-500 hover:text-red-700 p-0.5"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400">Value</label>
                        <input
                          type="text"
                          value={met.value}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].keyMetrics[mIdx].value = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-xs font-extrabold text-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400">Label</label>
                        <input
                          type="text"
                          value={met.label}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].keyMetrics[mIdx].label = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 4: Core Capabilities Section & Feature Cards */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <h4 className="text-xs font-bold">
                      Step 4: Core Capabilities & Feature Cards ({currentService.features?.length || 0})
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.services];
                      const newFeat = { title: "New Capability", desc: "Detailed breakdown of feature." };
                      updated[selectedServiceIndex].features = [
                        ...(updated[selectedServiceIndex].features || []),
                        newFeat,
                      ];
                      setFormData({ ...formData, services: updated });
                      toast.success("Added new feature!");
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Capabilities Section Tag
                    </label>
                    <input
                      type="text"
                      value={currentService.capabilitiesTag || "Core Capabilities"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].capabilitiesTag = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Capabilities Section Heading
                    </label>
                    <input
                      type="text"
                      value={currentService.capabilitiesHeading || "Engineered features for maximum impact"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].capabilitiesHeading = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {currentService.features?.map((feat: any, fIdx: number) => (
                    <div key={fIdx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-blue-600">Feature #{fIdx + 1}</span>
                        {currentService.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.services];
                              updated[selectedServiceIndex].features = updated[selectedServiceIndex].features.filter(
                                (_: any, idx: number) => idx !== fIdx
                              );
                              setFormData({ ...formData, services: updated });
                              toast.success("Deleted feature!");
                            }}
                            className="text-red-500 hover:text-red-700 p-0.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400">Feature Title</label>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].features[fIdx].title = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400">Description</label>
                        <textarea
                          rows={2}
                          value={feat.desc}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].features[fIdx].desc = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 5: Execution Blueprint Section & Workflow Steps */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-blue-600 shrink-0" />
                    <h4 className="text-xs font-bold">
                      Step 5: Execution Blueprint & Delivery Workflow Steps ({currentService.workflow?.length || 0})
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.services];
                      const stepNum = (updated[selectedServiceIndex].workflow?.length || 0) + 1;
                      const newStep = {
                        step: stepNum < 10 ? `0${stepNum}` : `${stepNum}`,
                        title: `Phase ${stepNum} Delivery`,
                        desc: "Step description and deliverable requirements.",
                      };
                      updated[selectedServiceIndex].workflow = [
                        ...(updated[selectedServiceIndex].workflow || []),
                        newStep,
                      ];
                      setFormData({ ...formData, services: updated });
                      toast.success("Added workflow step!");
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Blueprint Section Tag
                    </label>
                    <input
                      type="text"
                      value={currentService.blueprintTag || "Execution Blueprint"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].blueprintTag = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Blueprint Section Heading
                    </label>
                    <input
                      type="text"
                      value={currentService.blueprintHeading || "Our step-by-step delivery process"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].blueprintHeading = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentService.workflow?.map((wf: any, wIdx: number) => (
                    <div key={wIdx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold font-mono text-blue-600">Step #{wf.step}</span>
                        {currentService.workflow.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.services];
                              updated[selectedServiceIndex].workflow = updated[selectedServiceIndex].workflow.filter(
                                (_: any, idx: number) => idx !== wIdx
                              );
                              setFormData({ ...formData, services: updated });
                              toast.success("Deleted workflow step!");
                            }}
                            className="text-red-500 hover:text-red-700 p-0.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] text-slate-400">Step #</label>
                          <input
                            type="text"
                            value={wf.step}
                            onChange={(e) => {
                              const updated = [...formData.services];
                              updated[selectedServiceIndex].workflow[wIdx].step = e.target.value;
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-xs font-bold text-blue-600"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[9px] text-slate-400">Step Headline</label>
                          <input
                            type="text"
                            value={wf.title}
                            onChange={(e) => {
                              const updated = [...formData.services];
                              updated[selectedServiceIndex].workflow[wIdx].title = e.target.value;
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400">Step Description</label>
                        <textarea
                          rows={2}
                          value={wf.desc}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].workflow[wIdx].desc = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 6: Tech Stack Badges */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-blue-500 shrink-0" />
                  Step 6: Tech Stack Badges ({currentService.techStack?.length || 0})
                </h4>

                <div className="flex flex-wrap items-center gap-1.5">
                  {currentService.techStack?.map((tag: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-[#0b0f19] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      <span className="truncate max-w-[120px] sm:max-w-none">{tag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].techStack = updated[selectedServiceIndex].techStack.filter(
                            (_: string, idx: number) => idx !== tIdx
                          );
                          setFormData({ ...formData, services: updated });
                          toast.success(`Removed tag "${tag}"`);
                        }}
                        className="text-slate-400 hover:text-red-500 p-0.5 shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add tech stack tag (e.g. Next.js, Python)..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].techStack = [
                            ...(updated[selectedServiceIndex].techStack || []),
                            val,
                          ];
                          setFormData({ ...formData, services: updated });
                          (e.target as HTMLInputElement).value = "";
                          toast.success(`Added tag "${val}"`);
                        }
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
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
              <span>Back to All Services Directory</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving Changes..." : "Save All Services Changes"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )}

  {/* POPUP MODAL: ADD / EDIT CATALOG CARD */}
  {mounted && typeof window !== "undefined" && editingCatalogService && createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingCatalogService.isNew ? "Add New Catalog Service" : "Edit Catalog Service Card"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {editingCatalogService.isNew
                  ? "Create a new service card for the /services catalog grid"
                  : `Route: /services/${editingCatalogService.service.id}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditingCatalogService(null)}
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
                Service Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AI Engineering & Agentic"
                value={editingCatalogService.service.title}
                onChange={(e) =>
                  setEditingCatalogService({
                    ...editingCatalogService,
                    service: { ...editingCatalogService.service, title: e.target.value },
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
                placeholder="e.g. ai-eng"
                value={editingCatalogService.service.id}
                onChange={(e) =>
                  setEditingCatalogService({
                    ...editingCatalogService,
                    service: {
                      ...editingCatalogService.service,
                      id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                Preview: /services/{editingCatalogService.service.id || "slug"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle Badge Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Enterprise Digital Solution"
                value={editingCatalogService.service.subtitle}
                onChange={(e) =>
                  setEditingCatalogService({
                    ...editingCatalogService,
                    service: { ...editingCatalogService.service, subtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Card Button Text
              </label>
              <input
                type="text"
                placeholder="e.g. Explore Capabilities"
                value={editingCatalogService.service.buttonText || "Explore Capabilities"}
                onChange={(e) =>
                  setEditingCatalogService({
                    ...editingCatalogService,
                    service: { ...editingCatalogService.service, buttonText: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Card Summary Description
            </label>
            <textarea
              rows={3}
              placeholder="Summary of the discipline displayed on the catalog card..."
              value={editingCatalogService.service.desc}
              onChange={(e) =>
                setEditingCatalogService({
                  ...editingCatalogService,
                  service: { ...editingCatalogService.service, desc: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Dynamic Service Capability Icon Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Service Capability Icon (React / Bootstrap Icons)
            </label>
            <ServiceIconPicker
              value={editingCatalogService.service.icon || editingCatalogService.service.iconName || ""}
              onChange={(iconId) =>
                setEditingCatalogService({
                  ...editingCatalogService,
                  service: {
                    ...editingCatalogService.service,
                    icon: iconId,
                    iconName: iconId,
                  },
                })
              }
              serviceId={editingCatalogService.service.id}
            />
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-xl border border-dashed border-violet-300 dark:border-violet-900/60 bg-violet-50/30 dark:bg-violet-950/20 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 block">
              Catalog Card Live Preview
            </span>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/10 text-violet-600">
                  {editingCatalogService.service.subtitle || "Service Subtitle"}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100/80 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100/50 dark:border-slate-700 shadow-xs">
                  <ServiceIcon
                    icon={editingCatalogService.service.icon}
                    iconName={editingCatalogService.service.iconName}
                    serviceId={editingCatalogService.service.id}
                    className="h-4 w-4 text-violet-600 dark:text-violet-300"
                  />
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingCatalogService.service.title || "Service Title Preview"}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {editingCatalogService.service.desc || "Service description preview will appear here..."}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600">
                  {editingCatalogService.service.buttonText || "Explore Capabilities"} →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setEditingCatalogService(null)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!editingCatalogService.isNew && (
              <button
                type="button"
                onClick={() => {
                  const svcId = editingCatalogService.service.id;
                  handleSaveCatalogServiceModal();
                  handleNavigateToServiceDetail(svcId);
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-blue-500/50 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold transition-colors"
              >
                <span>Save &amp; Go to Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveCatalogServiceModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{editingCatalogService.isNew ? "Add Service to Catalog" : "Save Changes"}</span>
            </button>
          </div>
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