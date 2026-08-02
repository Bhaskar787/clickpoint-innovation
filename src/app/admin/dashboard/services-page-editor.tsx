"use client";

import { useState, useRef, useEffect } from "react";
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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
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
              onClick={() => onChange("")}
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
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shrink-0"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Choose File</span>
        </button>
      </div>

      {value && value.trim() !== "" && (
        <div className="mt-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-200 shrink-0">
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden text-[11px]">
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {value.startsWith("blob:") ? "Uploaded Local File" : value}
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

const DEFAULT_SERVICES_CONTENT = {
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
    {
      id: "platform-mod",
      title: "Platform Modernization",
      subtitle: "Legacy Code Migration & Cloud-Native Architectures",
      buttonText: "Explore Capabilities",
      desc: "Upgrade legacy monoliths to zero-downtime, distributed serverless cloud platforms built for auto-scaling.",
      fullOverview:
        "Technical debt holds back fast-growing companies. We help enterprise teams decouple monolithic legacy codebases into modern cloud-native microservices.",
      heroBadge: "Cloud & Infrastructure",
      imageUrl: "",
      keyMetrics: [
        { label: "Infra Cost Reduction", value: "40%" },
        { label: "Deploy Frequency", value: "20x/day" },
        { label: "Migration Downtime", value: "0 mins" },
      ],
      features: [
        { title: "Monolith-to-Microservices Migration", desc: "Strangler fig pattern migration strategy to replace legacy monolith modules." },
        { title: "Database Refactoring & Sharding", desc: "Migrating legacy relational databases to distributed PostgreSQL and Redis layers." },
      ],
      workflow: [
        { step: "01", title: "Architecture Assessment", desc: "Mapping dependencies, bottleneck points, and compliance constraints." },
        { step: "02", title: "Target Cloud Blueprint", desc: "Designing multi-region, resilient cloud infrastructure topology." },
        { step: "03", title: "Incremental Migration", desc: "Migrating services and data stores step-by-step with shadow traffic validation." },
        { step: "04", title: "Final Cutover & Decommission", desc: "Achieving zero-downtime switch to the modernized cloud platform." },
      ],
      useCases: [
        "Monolith Breakdown",
        "Multi-Cloud Migration",
        "Database Optimization",
        "SOC2 Compliance Infra Setup",
      ],
      techStack: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform", "PostgreSQL", "Redis"],
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
      id: "mlops",
      title: "MLOps & Data Pipelines",
      subtitle: "Continuous Model Training, Monitoring & Vector DBs",
      buttonText: "Explore Capabilities",
      desc: "Automate machine learning model deployment pipelines, feature stores, and real-time monitoring infrastructure.",
      fullOverview:
        "Bridge the gap between data science research and live production applications with enterprise MLOps architectures.",
      heroBadge: "Data Pipelines & MLOps",
      imageUrl: "",
      keyMetrics: [
        { label: "Model Training Speed", value: "5x" },
        { label: "Inference Latency", value: "< 15ms" },
        { label: "Data Pipeline Uptime", value: "99.9%" },
      ],
      features: [
        { title: "Automated Model Training & CI/CD", desc: "Triggering automatic retraining pipelines when data drift is detected." },
        { title: "Enterprise Feature Stores", desc: "Centralizing real-time feature engineering for low-latency model inference." },
      ],
      workflow: [
        { step: "01", title: "Data Pipeline Audit", desc: "Evaluating data sources, vector stores, and latency targets." },
        { step: "02", title: "Feature Store Setup", desc: "Configuring feature stores for online/offline model feature retrieval." },
        { step: "03", title: "Pipeline Automation", desc: "Setting up automated retraining and model evaluation tests." },
        { step: "04", title: "Monitoring & Governance", desc: "Deploying model drift monitoring and explainability dashboards." },
      ],
      useCases: [
        "Real-Time Fraud Detection",
        "Recommendation Engine Scaling",
        "Vector Database Knowledge Retrieval",
        "Automated Model Drift Alerting",
      ],
      techStack: ["Python", "Kubeflow", "MLflow", "Pinecone", "Snowflake", "dbt", "Airflow"],
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

export default function ServicesPageEditor({ sectionId, onCloseSection, onNavigateToDetailSection }: ServicesPageEditorProps) {
  const [formData, setFormData] = useState(DEFAULT_SERVICES_CONTENT);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string>(DEFAULT_SERVICES_CONTENT.services[0]?.id || "ai-eng");

  // Load previously saved content (including any custom services added to the
  // catalog) back into the editor whenever it mounts. Without this, switching
  // admin tabs or refreshing the page would silently reset everything back to
  // the hardcoded defaults, making newly added services "disappear" from the
  // Individual Service Detail Pages configurator.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("services_page_content");
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedServices =
          Array.isArray(parsed.services) && parsed.services.length > 0
            ? parsed.services.map((svc: any) => ({
                // Fill in any missing detail-page fields with placeholders so
                // every service always has full stats, description, tags,
                // workflow, etc. even if it was saved before those fields
                // existed.
                id: svc.id,
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
                useCasesHeading: svc.useCasesHeading || "Primary Use Cases for",
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
    } catch (err) {
      console.error("Failed to load saved services_page_content:", err);
    }
  }, []);

  function handleSave() {
    localStorage.setItem("services_page_content", JSON.stringify(formData));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  function handleReset() {
    setFormData(DEFAULT_SERVICES_CONTENT);
    setSelectedDetailId(DEFAULT_SERVICES_CONTENT.services[0]?.id || "ai-eng");
    localStorage.removeItem("services_page_content");
  }

  const selectedServiceIndex = formData.services.findIndex((s) => s.id === selectedDetailId);
  const currentService = selectedServiceIndex !== -1 ? formData.services[selectedServiceIndex] : formData.services[0];

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131927] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Editing Services Page & Individual Service Detail Pages (/services/[id])
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage main services catalog cards and individual detail page fields (/services/[id]) for all active services.
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            {saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved & Published!</span>
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

      {/* HERO SECTION FIELDS */}
      {(!sectionId || sectionId === "services-hero") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Services Hero Banner Badges & Titles</h3>
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

            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500" />
                Hero Main Headline Title
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
          </div>
        </div>
      )}

      {/* DYNAMIC SERVICES LIST (ADD & DELETE SERVICES + METRICS + BUTTONS) */}
      {(!sectionId || sectionId === "services-list") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Core Services Cards Catalog ({formData.services.length} Active Services)
              </h3>
            </div>

            <button
              onClick={() => {
                const newId = `custom-service-${Date.now()}`;
                const newService = {
                  id: newId,
                  title: "New Custom Engineering Service",
                  subtitle: "Specialized Enterprise Solution",
                  buttonText: "Explore Capabilities",
                  desc: "Detailed description of custom engineering service capabilities.",
                  fullOverview: "Comprehensive overview narrative explaining how we deliver custom software engineering for this discipline.",
                  heroBadge: "Custom Engineering Pod",
                  imageUrl: "",
                  keyMetrics: [
                    { label: "Execution Latency", value: "< 250ms" },
                    { label: "Accuracy Rate", value: "99.4%" },
                    { label: "Efficiency Gain", value: "4.5x" },
                  ],
                  features: [
                    { title: "Core Feature 1", desc: "Detailed breakdown of capability 1." },
                    { title: "Core Feature 2", desc: "Detailed breakdown of capability 2." },
                  ],
                  workflow: [
                    { step: "01", title: "Discovery & Architecture", desc: "Mapping specifications and assembling the engineering pod." },
                    { step: "02", title: "Prototyping & MVP Sprint", desc: "Delivering working software in 2-4 week sprint cycles." },
                  ],
                  useCases: [
                    "Enterprise Process Automation",
                    "Custom Cloud Platform Building",
                  ],
                  techStack: ["Next.js", "Python", "Cloud"],
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
                };
                setFormData({ ...formData, services: [...formData.services, newService] });
                setSelectedDetailId(newId);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Service to Catalog</span>
            </button>
          </div>

          {/* Section Header Badges & Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500" />
                Catalog Section Tag Badge
              </label>
              <input
                type="text"
                value={formData.catalogSection.tag}
                onChange={(e) => setFormData({ ...formData, catalogSection: { ...formData.catalogSection, tag: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500" />
                Catalog Section Main Title
              </label>
              <input
                type="text"
                value={formData.catalogSection.title}
                onChange={(e) => setFormData({ ...formData, catalogSection: { ...formData.catalogSection, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="space-y-6">
            {formData.services.map((service, sIdx) => (
              <div
                key={service.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4"
              >
                {/* Service Card Top Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                      #{sIdx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {service.title || "Unnamed Service"}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      (ID: {service.id})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Select this exact service and jump straight into its
                        // individual detail-page configurator, instead of
                        // staying on the full catalog list.
                        setSelectedDetailId(service.id);
                        if (onNavigateToDetailSection) {
                          onNavigateToDetailSection(service.id);
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 px-3 py-1 rounded-lg transition-colors border border-blue-200 dark:border-blue-800/60"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Configure Detail Page</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.services.filter((s) => s.id !== service.id);
                        setFormData({ ...formData, services: updated });
                        if (selectedDetailId === service.id && updated.length > 0) {
                          setSelectedDetailId(updated[0].id);
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Service</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <Type className="h-3.5 w-3.5 text-blue-500" />
                      Service Card Title
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[sIdx].title = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subtitle Tagline
                    </label>
                    <input
                      type="text"
                      value={service.subtitle}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[sIdx].subtitle = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <Tag className="h-3.5 w-3.5 text-blue-500" />
                      Service Hero Badge Pill
                    </label>
                    <input
                      type="text"
                      value={service.heroBadge}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[sIdx].heroBadge = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <MousePointerClick className="h-3.5 w-3.5 text-blue-500" />
                      CTA Button Label Text
                    </label>
                    <input
                      type="text"
                      value={service.buttonText || "Explore Capabilities"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[sIdx].buttonText = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Service Media File Upload Control */}
                  <div className="md:col-span-2">
                    <FileUploadControl
                      label="Service Photo / Video File / URL"
                      value={service.imageUrl || ""}
                      accept="image/*,video/*"
                      mediaType="image"
                      placeholder="Upload image/video file or enter URL..."
                      helperText="Custom thumbnail image/video for service card & detail page header"
                      onChange={(val) => {
                        const updated = [...formData.services];
                        updated[sIdx].imageUrl = val;
                        setFormData({ ...formData, services: updated });
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Short Description (Card Overview)
                    </label>
                    <textarea
                      rows={2}
                      value={service.desc}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[sIdx].desc = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tech Stack Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={service.techStack.join(", ")}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[sIdx].techStack = e.target.value.split(",").map((t) => t.trim());
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* DYNAMIC KEY METRICS SECTION (< 250ms Execution Latency, 99.4% Accuracy Rate, etc.) */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Key Metrics Pairs ({service.keyMetrics?.length || 0})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.services];
                        if (!updated[sIdx].keyMetrics) updated[sIdx].keyMetrics = [];
                        updated[sIdx].keyMetrics.push({ value: "99.9%", label: "Metric Label" });
                        setFormData({ ...formData, services: updated });
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Metric Pair</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {service.keyMetrics?.map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-1.5 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase text-blue-600">Metric #{mIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.services];
                              updated[sIdx].keyMetrics = updated[sIdx].keyMetrics.filter((_, i) => i !== mIdx);
                              setFormData({ ...formData, services: updated });
                            }}
                            className="text-red-500 hover:text-red-700 p-0.5"
                            title="Remove metric"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-400">Value (e.g. &lt; 250ms, 99.4%)</label>
                          <input
                            type="text"
                            value={metric.value}
                            onChange={(e) => {
                              const updated = [...formData.services];
                              updated[sIdx].keyMetrics[mIdx].value = e.target.value;
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-blue-600 dark:text-blue-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-400">Label (e.g. Execution Latency)</label>
                          <input
                            type="text"
                            value={metric.label}
                            onChange={(e) => {
                              const updated = [...formData.services];
                              updated[sIdx].keyMetrics[mIdx].label = e.target.value;
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-[11px] text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC SERVICE FEATURES LIST */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Service Feature Bullets ({service.features.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.services];
                        updated[sIdx].features.push({
                          title: "New Capability Feature",
                          desc: "Description of feature capability.",
                        });
                        setFormData({ ...formData, services: updated });
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Feature Bullet</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] flex items-center justify-between gap-2"
                      >
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[sIdx].features[fIdx].title = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="flex-1 text-xs bg-transparent border-none font-semibold text-slate-900 dark:text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.services];
                            updated[sIdx].features = updated[sIdx].features.filter((_, i) => i !== fIdx);
                            setFormData({ ...formData, services: updated });
                          }}
                          className="text-red-500 hover:text-red-700 p-0.5"
                          title="Remove feature"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENGINEERING PROCESS & POD MODEL SECTION (Global 4-Step Process shown on /services) */}
      {(!sectionId || sectionId === "services-process") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #03
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Engineering Process &amp; Pod Model</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500" />
                Process Section Tag Badge
              </label>
              <input
                type="text"
                value={formData.processSection.tag}
                onChange={(e) =>
                  setFormData({ ...formData, processSection: { ...formData.processSection, tag: e.target.value } })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500" />
                Process Section Main Title
              </label>
              <input
                type="text"
                value={formData.processSection.title}
                onChange={(e) =>
                  setFormData({ ...formData, processSection: { ...formData.processSection, title: e.target.value } })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Process Section Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.processSection.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, processSection: { ...formData.processSection, subtitle: e.target.value } })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* 4-STEP GLOBAL PROCESS EDITOR */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Workflow className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Process Phases ({formData.processSection.steps?.length || 0})
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const steps = formData.processSection.steps || [];
                  const nextNum = String(steps.length + 1).padStart(2, "0");
                  setFormData({
                    ...formData,
                    processSection: {
                      ...formData.processSection,
                      steps: [
                        ...steps,
                        {
                          step: nextNum,
                          title: `Phase ${nextNum}`,
                          desc: "Description of this engineering process phase.",
                          deliverable: "Phase Deliverable",
                        },
                      ],
                    },
                  });
                }}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Process Phase</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.processSection.steps?.map((stepItem: any, pIdx: number) => (
                <div
                  key={pIdx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-600">
                      Phase #{stepItem.step || `0${pIdx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const steps = formData.processSection.steps.filter((_: any, i: number) => i !== pIdx);
                        setFormData({ ...formData, processSection: { ...formData.processSection, steps } });
                      }}
                      className="text-red-500 hover:text-red-700 p-0.5"
                      title="Remove phase"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-semibold">Code</label>
                      <input
                        type="text"
                        value={stepItem.step}
                        onChange={(e) => {
                          const steps = [...formData.processSection.steps];
                          steps[pIdx] = { ...steps[pIdx], step: e.target.value };
                          setFormData({ ...formData, processSection: { ...formData.processSection, steps } });
                        }}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9px] text-slate-400 font-semibold">Phase Title</label>
                      <input
                        type="text"
                        value={stepItem.title}
                        onChange={(e) => {
                          const steps = [...formData.processSection.steps];
                          steps[pIdx] = { ...steps[pIdx], title: e.target.value };
                          setFormData({ ...formData, processSection: { ...formData.processSection, steps } });
                        }}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold">Phase Narrative Description</label>
                    <textarea
                      rows={2}
                      value={stepItem.desc}
                      onChange={(e) => {
                        const steps = [...formData.processSection.steps];
                        steps[pIdx] = { ...steps[pIdx], desc: e.target.value };
                        setFormData({ ...formData, processSection: { ...formData.processSection, steps } });
                      }}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold">Key Deliverable</label>
                    <input
                      type="text"
                      value={stepItem.deliverable || ""}
                      onChange={(e) => {
                        const steps = [...formData.processSection.steps];
                        steps[pIdx] = { ...steps[pIdx], deliverable: e.target.value };
                        setFormData({ ...formData, processSection: { ...formData.processSection, steps } });
                      }}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: INDIVIDUAL SERVICE DETAIL PAGES CONFIGURATOR (/services/[id]) */}
      {(!sectionId || sectionId === "services-details" || sectionId === "services-detail-config") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #03
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Individual Service Detail Pages Configurator (/services/[id])
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Service:
              </label>
              <select
                value={selectedDetailId}
                onChange={(e) => setSelectedDetailId(e.target.value)}
                className="rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 text-xs font-bold text-blue-900 dark:text-blue-200 focus:outline-none"
              >
                {formData.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} (Route: /services/{s.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentService && selectedServiceIndex !== -1 && (
            <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-5">
              <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-800 pb-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Configuring Detail Page for &quot;{currentService.title}&quot;
                  </h4>
                </div>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                  /services/{currentService.id}
                </span>
              </div>

              {/* CORE IDENTITY FIELDS (Title, Subtitle, Badge, Button, Description) */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <Type className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Core Identity &amp; Hero Content
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={currentService.title}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].title = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subtitle Tagline
                    </label>
                    <input
                      type="text"
                      value={currentService.subtitle}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].subtitle = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <Tag className="h-3.5 w-3.5 text-blue-500" />
                      Hero Badge Pill
                    </label>
                    <input
                      type="text"
                      value={currentService.heroBadge || ""}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].heroBadge = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <MousePointerClick className="h-3.5 w-3.5 text-blue-500" />
                      CTA Button Label Text
                    </label>
                    <input
                      type="text"
                      value={currentService.buttonText || "Explore Capabilities"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].buttonText = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Short Description (Card Overview)
                    </label>
                    <textarea
                      rows={2}
                      value={currentService.desc}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].desc = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FileUploadControl
                      label="Service Photo / Video File / URL"
                      value={currentService.imageUrl || ""}
                      accept="image/*,video/*"
                      mediaType="image"
                      placeholder="Upload image/video file or enter URL..."
                      helperText="Custom thumbnail image/video for detail page header"
                      onChange={(val) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].imageUrl = val;
                        setFormData({ ...formData, services: updated });
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tech Stack Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(currentService.techStack || []).join(", ")}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].techStack = e.target.value.split(",").map((t: string) => t.trim());
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC KEY METRICS SECTION (< 250ms Execution Latency, 99.4% Accuracy Rate, etc.) */}
              <div className="pt-3 border-t border-blue-200 dark:border-blue-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Key Metrics Pairs ({currentService.keyMetrics?.length || 0})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.services];
                      if (!updated[selectedServiceIndex].keyMetrics) updated[selectedServiceIndex].keyMetrics = [];
                      updated[selectedServiceIndex].keyMetrics.push({ value: "99.9%", label: "Metric Label" });
                      setFormData({ ...formData, services: updated });
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Metric Pair</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentService.keyMetrics?.map((metric: any, mIdx: number) => (
                    <div
                      key={mIdx}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-1.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase text-blue-600">Metric #{mIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].keyMetrics = updated[selectedServiceIndex].keyMetrics.filter((_: any, i: number) => i !== mIdx);
                            setFormData({ ...formData, services: updated });
                          }}
                          className="text-red-500 hover:text-red-700 p-0.5"
                          title="Remove metric"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-400">Value (e.g. &lt; 250ms, 99.4%)</label>
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].keyMetrics[mIdx].value = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-blue-600 dark:text-blue-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-400">Label (e.g. Execution Latency)</label>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].keyMetrics[mIdx].label = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-[11px] text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HERO ACTION BUTTONS (Request Service Audit / All Services) */}
              <div className="pt-3 border-t border-blue-200 dark:border-blue-800 space-y-3">
                <div className="flex items-center gap-1.5">
                  <MousePointerClick className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Hero Action Buttons &amp; Routes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-2">
                    <span className="text-[10px] font-bold uppercase text-blue-600">Primary Button</span>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-semibold">Button Text</label>
                      <input
                        type="text"
                        value={currentService.ctaPrimaryText || "Request Service Audit"}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].ctaPrimaryText = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-semibold">Button Route / Link</label>
                      <input
                        type="text"
                        value={currentService.ctaPrimaryRoute || "/contact"}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].ctaPrimaryRoute = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        placeholder="/contact"
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-blue-600 dark:text-blue-400"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-2">
                    <span className="text-[10px] font-bold uppercase text-blue-600">Secondary Button</span>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-semibold">Button Text</label>
                      <input
                        type="text"
                        value={currentService.ctaSecondaryText || "All Services"}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].ctaSecondaryText = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-semibold">Button Route / Link</label>
                      <input
                        type="text"
                        value={currentService.ctaSecondaryRoute || "/services"}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].ctaSecondaryRoute = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        placeholder="/services"
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-blue-600 dark:text-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* DETAILED OVERVIEW SECTION LABEL, HEADING & NARRATIVE */}
              <div className="pt-3 border-t border-blue-200 dark:border-blue-800 space-y-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Detailed Overview Section Labels
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold">Eyebrow Tag Text</label>
                    <input
                      type="text"
                      value={currentService.overviewTag || "Detailed Overview"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].overviewTag = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold">
                      Section Heading (service title is appended automatically)
                    </label>
                    <input
                      type="text"
                      value={currentService.overviewHeading || "How We Deliver Exceptional"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].overviewHeading = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Overview Narrative (Rendered on /services/{currentService.id})
                  </label>
                  <textarea
                    rows={4}
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

              {/* CORE CAPABILITIES SECTION LABEL + HEADING */}
              <div className="pt-3 border-t border-blue-200 dark:border-blue-800 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Core Capabilities Section Labels
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold">Eyebrow Tag Text</label>
                    <input
                      type="text"
                      value={currentService.capabilitiesTag || "Core Capabilities"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].capabilitiesTag = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold">Section Heading</label>
                    <input
                      type="text"
                      value={currentService.capabilitiesHeading || "Engineered features for maximum impact"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].capabilitiesHeading = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC SERVICE FEATURES LIST */}
              <div className="pt-3 border-t border-blue-200 dark:border-blue-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Service Feature Bullets ({currentService.features?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.services];
                      if (!updated[selectedServiceIndex].features) updated[selectedServiceIndex].features = [];
                      updated[selectedServiceIndex].features.push({
                        title: "New Capability Feature",
                        desc: "Description of feature capability.",
                      });
                      setFormData({ ...formData, services: updated });
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Feature Bullet</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentService.features?.map((feat: any, fIdx: number) => (
                    <div
                      key={fIdx}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-1.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase text-blue-600">Feature #{fIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].features = updated[selectedServiceIndex].features.filter((_: any, i: number) => i !== fIdx);
                            setFormData({ ...formData, services: updated });
                          }}
                          className="text-red-500 hover:text-red-700 p-0.5"
                          title="Remove feature"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].features[fIdx].title = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        placeholder="Feature title"
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 font-semibold text-slate-900 dark:text-white focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={feat.desc}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].features[fIdx].desc = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        placeholder="Feature description"
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* EXECUTION BLUEPRINT SECTION LABEL + HEADING */}
              <div className="pt-3 border-t border-blue-200 dark:border-blue-800 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Workflow className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Execution Blueprint Section Labels
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold">Eyebrow Tag Text</label>
                    <input
                      type="text"
                      value={currentService.blueprintTag || "Execution Blueprint"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].blueprintTag = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold">Section Heading</label>
                    <input
                      type="text"
                      value={currentService.blueprintHeading || "Our step-by-step delivery process"}
                      onChange={(e) => {
                        const updated = [...formData.services];
                        updated[selectedServiceIndex].blueprintHeading = e.target.value;
                        setFormData({ ...formData, services: updated });
                      }}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 4-STEP EXECUTION WORKFLOW EDITOR */}
              <div className="space-y-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Workflow className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Execution Blueprint Steps ({currentService.workflow?.length || 0})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.services];
                      if (!updated[selectedServiceIndex].workflow) updated[selectedServiceIndex].workflow = [];
                      const nextNum = String(updated[selectedServiceIndex].workflow.length + 1).padStart(2, "0");
                      updated[selectedServiceIndex].workflow.push({
                        step: nextNum,
                        title: `Step ${nextNum}. Execution Phase`,
                        desc: "Detailed description of execution phase workflow.",
                      });
                      setFormData({ ...formData, services: updated });
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Workflow Step</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentService.workflow?.map((stepItem: any, wfIdx: number) => (
                    <div
                      key={wfIdx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-600">
                          Step #{stepItem.step || `0${wfIdx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].workflow = updated[selectedServiceIndex].workflow.filter((_: any, i: number) => i !== wfIdx);
                            setFormData({ ...formData, services: updated });
                          }}
                          className="text-red-500 hover:text-red-700 p-0.5"
                          title="Remove step"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] text-slate-400 font-semibold">Code</label>
                          <input
                            type="text"
                            value={stepItem.step}
                            onChange={(e) => {
                              const updated = [...formData.services];
                              updated[selectedServiceIndex].workflow[wfIdx].step = e.target.value;
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[9px] text-slate-400 font-semibold">Step Title</label>
                          <input
                            type="text"
                            value={stepItem.title}
                            onChange={(e) => {
                              const updated = [...formData.services];
                              updated[selectedServiceIndex].workflow[wfIdx].title = e.target.value;
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-400 font-semibold">Step Narrative Description</label>
                        <textarea
                          rows={2}
                          value={stepItem.desc}
                          onChange={(e) => {
                            const updated = [...formData.services];
                            updated[selectedServiceIndex].workflow[wfIdx].desc = e.target.value;
                            setFormData({ ...formData, services: updated });
                          }}
                          className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* USE CASES SECTION HEADING */}
              <div className="pt-3 border-t border-blue-200 dark:border-blue-800 space-y-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Use Cases Section Heading
                  </span>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 font-semibold">
                    Heading Prefix (service title is appended automatically)
                  </label>
                  <input
                    type="text"
                    value={currentService.useCasesHeading || "Primary Use Cases for"}
                    onChange={(e) => {
                      const updated = [...formData.services];
                      updated[selectedServiceIndex].useCasesHeading = e.target.value;
                      setFormData({ ...formData, services: updated });
                    }}
                    className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* PRIMARY USE CASES EDITOR */}
              <div className="space-y-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Primary Use Cases ({currentService.useCases?.length || 0})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.services];
                      if (!updated[selectedServiceIndex].useCases) updated[selectedServiceIndex].useCases = [];
                      updated[selectedServiceIndex].useCases.push("New Custom Enterprise Use Case");
                      setFormData({ ...formData, services: updated });
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Use Case</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentService.useCases?.map((uc: string, uIdx: number) => (
                    <div
                      key={uIdx}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] flex items-center justify-between gap-2"
                    >
                      <input
                        type="text"
                        value={uc}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].useCases[uIdx] = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        className="flex-1 text-xs bg-transparent border-none font-semibold text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.services];
                          updated[selectedServiceIndex].useCases = updated[selectedServiceIndex].useCases.filter((_: any, i: number) => i !== uIdx);
                          setFormData({ ...formData, services: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-0.5"
                        title="Remove use case"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}