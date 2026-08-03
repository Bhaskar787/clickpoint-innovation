"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
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
} from "lucide-react";

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
      <div className="flex items-center justify-between">
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
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shrink-0 disabled:opacity-50"
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
  const [formData, setFormData] = useState(DEFAULT_SERVICES_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string>("ai-eng");

  // Load live Services data from DB on mount
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
    if (!confirm("Are you sure you want to reset all Services data to defaults?")) return;

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white dark:bg-[#131927] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Services Page data from database...</p>
      </div>
    );
  }

  const selectedServiceIndex = formData.services.findIndex((s) => s.id === selectedDetailId);
  const currentService = selectedServiceIndex !== -1 ? formData.services[selectedServiceIndex] : formData.services[0];

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131927] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Editing Services Page Content, Individual Service Detail Pages & Cloudinary Media
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure every catalog card, hero badge, metric, feature list, 4-phase agile workflow step, and unique URL slug ID (`/services/[id]`).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
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
      {(!sectionId || sectionId === "services-hero") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Services Catalog Main Hero Banner & Headlines</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500" />
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
                <Type className="h-3.5 w-3.5 text-blue-500" />
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

      {/* SECTION 2: CATALOG SERVICES LIST & UNIQUE ID MANAGER */}
      {(!sectionId || sectionId === "services-catalog" || sectionId === "services-list") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Catalog Service Cards Manager ({formData.services.length} Services)
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                const uniqueId = `service-${Date.now().toString().slice(-4)}`;
                const newSvc = {
                  id: uniqueId,
                  title: "New Custom Service",
                  subtitle: "Enterprise Engineering Discipline",
                  buttonText: "Explore Capabilities",
                  desc: "Description of the new service discipline.",
                  fullOverview: "Detailed overview narrative for this enterprise service.",
                  heroBadge: "Custom Engineering Pod",
                  imageUrl: "",
                  keyMetrics: [
                    { label: "Execution Speed", value: "3x" },
                    { label: "Reliability SLA", value: "99.9%" },
                  ],
                  features: [
                    { title: "Core Feature 1", desc: "Description of capability 1" },
                  ],
                  workflow: [
                    { step: "01", title: "Architecture & Setup", desc: "Initial pod configuration" },
                  ],
                  useCases: ["Enterprise Scale Automation"],
                  techStack: ["Next.js", "TypeScript"],
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
                setFormData({ ...formData, services: [...formData.services, newSvc] });
                setSelectedDetailId(uniqueId);
                toast.success(`Created new service item (ID: ${uniqueId})!`);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.services.map((svc, idx) => (
              <div
                key={svc.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  selectedDetailId === svc.id
                    ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 ring-1 ring-blue-500/50"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                      Service #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailId(svc.id)}
                      className={`text-[11px] font-semibold underline transition-colors ${
                        selectedDetailId === svc.id
                          ? "text-blue-600 font-bold"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {selectedDetailId === svc.id ? "Currently Editing Details" : "Edit Detailed View"}
                    </button>
                  </div>

                  {formData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const svcToDelete = svc;
                        const updated = formData.services.filter((s) => s.id !== svc.id);
                        setFormData({ ...formData, services: updated });
                        if (selectedDetailId === svc.id) {
                          setSelectedDetailId(updated[0]?.id || "ai-eng");
                        }
                        toast.success(`Deleted service "${svcToDelete.title}"`);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/50"
                      title="Delete service"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      <LinkIcon className="h-3 w-3 text-blue-500" />
                      Unique Service ID / URL Slug
                    </label>
                    <input
                      type="text"
                      value={svc.id}
                      onChange={(e) => {
                        const newId = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                        const updated = [...formData.services];
                        const oldId = updated[idx].id;
                        updated[idx].id = newId;
                        setFormData({ ...formData, services: updated });
                        if (selectedDetailId === oldId) setSelectedDetailId(newId);
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs font-mono font-bold text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-[9px] text-slate-400">Route: /services/{svc.id}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={svc.title}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, services: updated });
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
                    value={svc.subtitle}
                    onChange={(e) => {
                      const updated = [...formData.services];
                      updated[idx].subtitle = e.target.value;
                      setFormData({ ...formData, services: updated });
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
                    value={svc.desc}
                    onChange={(e) => {
                      const updated = [...formData.services];
                      updated[idx].desc = e.target.value;
                      setFormData({ ...formData, services: updated });
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: INDIVIDUAL SERVICE DETAIL PAGE CONFIGURATOR */}
      {(!sectionId || sectionId === "service-detail" || sectionId === "services-details") && (

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #03
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Individual Service Detail View Configurator (`/services/[id]`)
              </h3>
            </div>

            {/* Service Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Select Service to Edit:</label>
              <select
                value={selectedDetailId}
                onChange={(e) => setSelectedDetailId(e.target.value)}
                className="rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 focus:outline-none"
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
            <div className="space-y-6">
              
              {/* STEP 1: Hero Section & Cloudinary Media Upload */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Step 1: Hero Banner & Cloudinary Media (<span className="text-blue-600">{currentService.title}</span>)
                  </h4>
                  <a
                    href={`/services/${currentService.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <span>Preview Live Route (/services/{currentService.id})</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Type className="h-4 w-4 text-blue-500" />
                  Step 2: Detailed Overview Section Content & Focus Areas
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
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
                        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-2.5 py-1 text-xs text-slate-900 dark:text-white font-bold"
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
                      className="text-xs font-bold text-blue-600 hover:underline"
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
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded"
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
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
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
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Step 4: Core Capabilities Section & Feature Cards ({currentService.features?.length || 0})
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
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
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
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-blue-500" />
                  Step 6: Tech Stack Badges ({currentService.techStack?.length || 0})
                </h4>

                <div className="flex flex-wrap items-center gap-1.5">
                  {currentService.techStack?.map((tag: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-[#0b0f19] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      <span>{tag}</span>
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
                        className="text-slate-400 hover:text-red-500 p-0.5"
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
        </div>
      )}

    </div>
  );
}