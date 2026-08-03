import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  ],
};

export async function GET() {
  try {
    const existing = await prisma.servicesPage.findUnique({
      where: { id: "default" },
    });

    if (existing && existing.content) {
      return NextResponse.json({ success: true, data: existing.content });
    }

    // Seed default services content if none exists
    const created = await prisma.servicesPage.create({
      data: {
        id: "default",
        content: DEFAULT_SERVICES_CONTENT,
      },
    });

    return NextResponse.json({ success: true, data: created.content });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services page content", fallback: DEFAULT_SERVICES_CONTENT },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const content = body.content || body;

    const updated = await prisma.servicesPage.upsert({
      where: { id: "default" },
      update: { content },
      create: { id: "default", content },
    });

    return NextResponse.json({
      success: true,
      message: "Services page content saved to database!",
      data: updated.content,
    });
  } catch (error) {
    console.error("PUT /api/services error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save services page content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return PUT(req);
}
