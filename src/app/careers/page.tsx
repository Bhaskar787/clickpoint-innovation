"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  Users,
  Sparkles,
  Zap,
  Globe,
  Heart,
  Award,
  BookOpen,
  Send,
  X,
  Search,
  Building2,
  UploadCloud,
  FileText,
  Paperclip,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";

interface JobOpening {
  id: string;
  title: string;
  department: "Engineering & AI" | "Product & Design" | "Growth & Marketing" | "DevOps & Security";
  type: "Full-Time" | "Contract";
  location: "Remote (Global)" | "Remote (US / EU)" | "Remote (APAC)";
  experience: "Senior" | "Lead" | "Principal";
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  featured?: boolean;
}

const JOB_OPENINGS: JobOpening[] = [
  {
    id: "senior-fullstack-ai-engineer",
    title: "Senior Full-Stack AI Engineer",
    department: "Engineering & AI",
    type: "Full-Time",
    location: "Remote (Global)",
    experience: "Senior",
    salary: "NPR 25,00,000 - 35,00,000 / year + Equity",
    summary: "Architect and scale production-grade Next.js web applications, vector search indexes (PgVector/Pinecone), and LLM agent workflows for enterprise clients.",
    responsibilities: [
      "Design type-safe React/Next.js frontend interfaces and serverless Node.js API routes.",
      "Integrate OpenAI, Claude 3.5 Sonnet, and open-source models with sub-second streaming SLAs.",
      "Build production RAG pipelines with vector databases, embedding chunking, and tenant isolation.",
      "Optimize web performance, Core Web Vitals, and Lighthouse scores across desktop and mobile.",
    ],
    requirements: [
      "5+ years of software engineering experience with Next.js, React, TypeScript, and Node.js.",
      "2+ years of hands-on experience integrating LLM APIs, vector stores, and AI agent frameworks.",
      "Deep understanding of PostgreSQL, Redis, Docker, and CI/CD pipelines.",
    ],
    featured: true,
  },
  {
    id: "lead-mlops-llm-architect",
    title: "Lead MLOps & Production LLM Architect",
    department: "Engineering & AI",
    type: "Full-Time",
    location: "Remote (Global)",
    experience: "Lead",
    salary: "NPR 30,00,000 - 45,00,000 / year + Equity",
    summary: "Lead the deployment, fine-tuning, and monitoring of high-throughput LLMs, autonomous agent pods, and multi-cloud AI infrastructure.",
    responsibilities: [
      "Architect scalable GPU inference clusters using vLLM, TensorRT-LLM, and Kubernetes.",
      "Implement model evaluation loops, hallucination guards, and automated fallback logic.",
      "Design SOC2 Type II and HIPAA compliant AI data ingestion pipelines.",
    ],
    requirements: [
      "6+ years in MLOps, PyTorch, Python, Docker, Kubernetes, and Cloud AI (AWS / GCP / Azure).",
      "Proven track record deploying fine-tuned LLMs and RAG systems in mission-critical environments.",
    ],
    featured: true,
  },
  {
    id: "senior-frontend-engineer",
    title: "Senior Next.js & Frontend Architect",
    department: "Engineering & AI",
    type: "Full-Time",
    location: "Remote (Global)",
    experience: "Senior",
    salary: "NPR 20,00,000 - 30,00,000 / year + Equity",
    summary: "Craft micro-animated, ultra-responsive web application interfaces using Next.js App Router, Tailwind CSS, and Framer Motion.",
    responsibilities: [
      "Build complex interactive dashboard UIs with 60fps animations and fluid layout math.",
      "Ensure web accessibility (WCAG AA), responsive mobile layouts, and SEO best practices.",
    ],
    requirements: [
      "4+ years mastering React, Next.js, TypeScript, Tailwind CSS, and Framer Motion.",
      "Strong portfolio demonstrating high-end visual design and smooth micro-interactions.",
    ],
  },
  {
    id: "autonomous-ai-agent-developer",
    title: "Autonomous AI Agent Systems Developer",
    department: "Engineering & AI",
    type: "Full-Time",
    location: "Remote (US / EU)",
    experience: "Senior",
    salary: "NPR 22,00,000 - 32,00,000 / year + Equity",
    summary: "Engineers multi-agent orchestration workflows (LangGraph, AutoGen, CrewAI) that perform complex multi-step data processing autonomously.",
    responsibilities: [
      "Develop deterministic state graph routines for multi-agent negotiation and task delegation.",
      "Integrate web scraping, browser automation, and API connectors for autonomous workers.",
    ],
    requirements: [
      "3+ years building Python background workers, AsyncIO, and AI agent frameworks.",
      "Experience with stateful graph execution engines and API webhooks.",
    ],
  },
  {
    id: "principal-product-designer",
    title: "Principal Product Designer (UI/UX)",
    department: "Product & Design",
    type: "Full-Time",
    location: "Remote (Global)",
    experience: "Principal",
    salary: "NPR 22,00,000 - 30,00,000 / year + Equity",
    summary: "Own the end-to-end user experience, design system tokens, and interactive mockups for enterprise AI products and SaaS platforms.",
    responsibilities: [
      "Create high-fidelity Figma design systems, interactive prototypes, and component guidelines.",
      "Conduct user research sessions with C-suite executives and product managers.",
    ],
    requirements: [
      "6+ years of UI/UX product design experience for complex B2B SaaS or enterprise software.",
      "Mastery of Figma, glassmorphism design tokens, micro-interactions, and design systems.",
    ],
    featured: true,
  },
  {
    id: "technical-product-manager",
    title: "Technical Product Manager - AI Solutions",
    department: "Product & Design",
    type: "Full-Time",
    location: "Remote (Global)",
    experience: "Lead",
    salary: "NPR 25,00,000 - 35,00,000 / year + Equity",
    summary: "Bridge client business objectives with engineering pod execution, defining product roadmaps and sprint milestones for client launches.",
    responsibilities: [
      "Gather requirements, write detailed technical specifications, and prioritize sprint backlogs.",
      "Manage client stakeholder communications, demo sessions, and release cycles.",
    ],
    requirements: [
      "4+ years as a Technical PM managing web/mobile software or AI engineering projects.",
      "Strong background understanding APIs, system architecture, and agile methodologies.",
    ],
  },
  {
    id: "head-of-growth-marketing",
    title: "Head of Growth Marketing & Technical Content",
    department: "Growth & Marketing",
    type: "Full-Time",
    location: "Remote (Global)",
    experience: "Lead",
    salary: "NPR 18,00,000 - 25,00,000 / year + Equity",
    summary: "Drive inbound developer interest, technical content SEO strategy, and growth marketing funnels for Clickpoint Innovation.",
    responsibilities: [
      "Publish in-depth engineering blogs, whitepapers, and developer documentation.",
      "Execute multi-channel growth campaigns across LinkedIn, Twitter/X, and tech publications.",
    ],
    requirements: [
      "4+ years in growth marketing for developer tools, B2B SaaS, or software consultancies.",
      "Exceptional technical writing ability capable of explaining AI architecture clearly.",
    ],
  },
  {
    id: "cloud-security-devsecops-lead",
    title: "Cloud Security & DevSecOps Lead",
    department: "DevOps & Security",
    type: "Full-Time",
    location: "Remote (Global)",
    experience: "Lead",
    salary: "NPR 25,00,000 - 36,00,000 / year + Equity",
    summary: "Enforce SOC2 Type II, HIPAA, and PCI-DSS security compliance across multi-cloud Kubernetes clusters and CI/CD pipelines.",
    responsibilities: [
      "Manage AWS/GCP cloud security policies, Terraform IaC, and automated vulnerability scanning.",
      "Conduct penetration testing, security audits, and zero-trust IAM policy management.",
    ],
    requirements: [
      "5+ years in DevSecOps, AWS/GCP, Kubernetes, Terraform, SOC2, and ISO 27001.",
      "Strong expertise in zero-trust architecture and automated container scanning.",
    ],
  },
];

const PERKS = [
  {
    icon: Globe,
    title: "100% Remote-First Culture",
    desc: "Work from anywhere in the world with flexible working hours tailored to your lifestyle.",
  },
  {
    icon: DollarSign,
    title: "Top 5% Competitive Salary",
    desc: "Industry-leading NPR & USD salary benchmarks, stock options / equity, and annual bonuses.",
  },
  {
    icon: Zap,
    title: "NPR 4,00,000 Tech Setup & Learning",
    desc: "Annual stipend for your ideal MacBook setup, ergonomic home office, and learning courses.",
  },
  {
    icon: Heart,
    title: "Health, Wellness & PTO",
    desc: "Comprehensive health insurance, mental wellness stipends, and 25 days of paid time off.",
  },
  {
    icon: Users,
    title: "Annual Team Retreats",
    desc: "All-expenses-paid annual global team retreats in places like Bali, Tokyo, and Zurich.",
  },
  {
    icon: Award,
    title: "Rapid Career Progression",
    desc: "Direct mentorship from industry founders, biannual compensation reviews, and leadership paths.",
  },
];

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeJobModal, setActiveJobModal] = useState<JobOpening | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const filteredJobs = JOB_OPENINGS.filter((job) => {
    const matchesDept = selectedDept === "ALL" || job.department === selectedDept;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24 bg-cloud-100/70 border-b border-violet-100">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-400/30 via-indigo-300/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-ember-300/25 to-transparent blur-[110px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb - Top Left Aligned */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60">
            <Link href="/" className="hover:text-violet-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Careers</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs">
              <Briefcase className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>We&apos;re Hiring • Global Remote Pods</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              Build the Next Generation of{" "}
              <span className="text-[#1b4397] dark:text-[#f58220]">
                AI-First Software
              </span>
            </h1>

            <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-ink/75 sm:text-xl">
              Join a team of world-class engineers, product designers, and AI researchers building autonomous LLM copilots and zero-downtime enterprise platforms.
            </p>

            {/* Key Perks Counter Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-6 sm:grid-cols-4 shadow-xl shadow-violet-950/[0.04] backdrop-blur-xl">
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">100%</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Remote-First Culture</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-[#f58220]">NPR 4L</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Annual Tech Stipend</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">4.9 / 5.0</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Team Glassdoor Rating</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-[#f58220]">150+</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Teammates Worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks & Benefits Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f58220]">
              Why Clickpoint Innovation
            </p>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              Perks & benefits designed for <span className="text-violet-600 dark:text-[#f58220]">high performers</span>
            </h2>
            <p className="mt-3 text-base text-ink/75 dark:text-slate-300">
              We empower our team with complete autonomy, top-tier compensation, and world-class engineering tools.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/30 mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink dark:text-white">{perk.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Job Vacancies Section */}
      <section id="openings" className="py-20 lg:py-28 bg-cloud-100/70 dark:bg-[#0f172a]/50 border-y border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
              <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              Available Openings
            </div>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              Explore open positions ({filteredJobs.length})
            </h2>
            <p className="mt-3 text-base text-ink/75 dark:text-slate-300">
              Find your next career leap and apply in under 2 minutes.
            </p>

            {/* Live Search Box */}
            <div className="relative mt-8 mx-auto max-w-md">
              <input
                type="text"
                placeholder="Search job title, skill, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 py-3.5 pl-11 pr-4 text-sm font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 shadow-sm transition-all focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-slate-400" />
            </div>
          </div>

          {/* Department Filter Tabs */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
            {["ALL", "Engineering & AI", "Product & Design", "Growth & Marketing", "DevOps & Security"].map((dept) => {
              const isActive = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                      : "bg-white dark:bg-slate-800 text-ink/70 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-700 hover:text-violet-700 dark:hover:text-white border border-violet-100 dark:border-slate-700"
                  }`}
                >
                  {dept === "ALL" ? "All Departments" : dept}
                </button>
              );
            })}
          </div>

          {/* Job Listings Cards */}
          <div className="space-y-4 max-w-5xl mx-auto">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
                >
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700">
                        {job.department}
                      </span>
                      <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {job.type}
                      </span>
                      {job.featured && (
                        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                          Featured Priority
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                      {job.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-ink/75 dark:text-slate-300 line-clamp-2">
                      {job.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink/60 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-[#f58220]" />
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setActiveJobModal(job);
                        setApplicationSubmitted(false);
                        setResumeFile(null);
                      }}
                      className="w-full md:w-auto shadow-md shadow-violet-600/25 font-bold"
                    >
                      View Role & Apply
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#131c31] rounded-3xl border border-violet-100 dark:border-slate-800">
                <p className="text-base font-semibold text-ink/60 dark:text-slate-300">No open roles match your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDept("ALL");
                  }}
                  className="mt-3 text-xs font-bold text-violet-700 dark:text-violet-300 underline"
                >
                  Reset filters & view all jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Application Modal */}
      <AnimatePresence>
        {activeJobModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveJobModal(null)}
              className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveJobModal(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-cloud-100 text-ink/60 hover:bg-violet-100 hover:text-violet-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {!applicationSubmitted ? (
                <div>
                  <div className="mb-6 pb-6 border-b border-violet-100">
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                      {activeJobModal.department}
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                      {activeJobModal.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-ink/60">
                      <span className="flex items-center gap-1 text-violet-700">
                        <MapPin className="h-3.5 w-3.5" />
                        {activeJobModal.location}
                      </span>
                      <span>•</span>
                      <span className="text-ember-500 font-bold">{activeJobModal.salary}</span>
                    </div>
                  </div>

                  <div className="space-y-6 text-xs leading-relaxed text-ink/80">
                    <div>
                      <h4 className="font-display text-sm font-bold text-ink mb-2">Role Overview</h4>
                      <p>{activeJobModal.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-display text-sm font-bold text-ink mb-2">Key Responsibilities</h4>
                      <ul className="space-y-1.5">
                        {activeJobModal.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-display text-sm font-bold text-ink mb-2">Role Requirements</h4>
                      <ul className="space-y-1.5">
                        {activeJobModal.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Application Form */}
                    <div className="mt-8 pt-6 border-t border-violet-100">
                      <h4 className="font-display text-base font-bold text-ink mb-4">
                        Submit Application
                      </h4>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setApplicationSubmitted(true);
                        }}
                        className="space-y-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Alex Johnson"
                              className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="alex@example.com"
                              className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                              LinkedIn Profile URL *
                            </label>
                            <input
                              type="url"
                              required
                              placeholder="https://linkedin.com/in/alex"
                              className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                              Portfolio / GitHub URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://github.com/alex"
                              className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        {/* Resume / CV File Upload Field */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                            Attach Resume / CV * (.pdf, .doc, .docx, .jpg, .png)
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              id="resume-upload"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              required={!resumeFile}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setResumeFile(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                            {!resumeFile ? (
                              <label
                                htmlFor="resume-upload"
                                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 bg-cloud-100/50 p-5 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-50/50 transition-all group"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 group-hover:scale-110 transition-transform">
                                  <UploadCloud className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-ink">
                                    Click to upload or drag & drop your Resume
                                  </p>
                                  <p className="text-[10px] text-ink/60 mt-0.5">
                                    Supported Formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                                  </p>
                                </div>
                              </label>
                            ) : (
                              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-ink truncate max-w-[220px] sm:max-w-[320px]">
                                      {resumeFile.name}
                                    </p>
                                    <p className="text-[10px] font-semibold text-emerald-700">
                                      {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • File Attached Successfully
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setResumeFile(null)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink/70 hover:bg-rose-100 hover:text-rose-600 transition-colors shadow-xs"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                            Why Clickpoint Innovation? (Brief Intro)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Tell us about your technical projects and why you're excited about this role..."
                            className="w-full rounded-xl border border-violet-200 bg-cloud-100/50 p-3 text-xs text-ink focus:border-violet-600 focus:outline-hidden"
                          />
                        </div>

                        <Button type="submit" variant="primary" size="lg" className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Application
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    Application Received!
                  </h3>
                  <p className="text-xs max-w-md mx-auto text-ink/75 leading-relaxed">
                    Thank you for applying for <span className="font-bold text-violet-700">{activeJobModal.title}</span>. Our talent acquisition lead will review your profile and reach out within 48 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveJobModal(null)}
                    className="mt-4"
                  >
                    Close Window
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
