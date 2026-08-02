"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Star,
  Zap,
  Building2,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { INDUSTRIES_DATA } from "@/data/landing-data";

const CATEGORIES = ["ALL", "Fintech", "Healthcare", "E-Commerce", "SaaS", "Logistics", "EdTech"];

// Extract all case study projects with industry metadata
const ALL_CASE_STUDIES = INDUSTRIES_DATA.flatMap((ind) =>
  ind.projects.map((proj) => ({
    ...proj,
    industryId: ind.id,
    industryTitle: ind.title,
  }))
);

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Clickpoint's AI engineering team transformed our legacy financial audit pipeline into a real-time autonomous agent pod. Our daily processing volume jumped from $4M to $42M+ with zero downtime.",
    name: "Rajesh Verma",
    role: "VP of Product Engineering",
    company: "Khataflow Inc.",
    rating: 5,
    gradient: "from-violet-600 to-indigo-700",
  },
  {
    id: 2,
    quote: "The headless e-commerce build and AI visual search feature engineered by Clickpoint delivered an immediate +34% lift in checkout conversions. Their technical speed is unmatched.",
    name: "Claire Bennett",
    role: "Chief Product Officer",
    company: "Caratlane Global",
    rating: 5,
    gradient: "from-amber-600 to-rose-700",
  },
  {
    id: 3,
    quote: "HIPAA compliance and clinical accuracy were critical for our platform. Clickpoint delivered an automated AI claims engine achieving 99.8% accuracy and cutting adjudication cycles by 3.5x.",
    name: "Dr. Evelyn Vance",
    role: "Head of Digital Health Solutions",
    company: "MediPulse Health",
    rating: 5,
    gradient: "from-emerald-600 to-teal-800",
  },
];

export default function CaseStudiesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredCaseStudies =
    activeCategory === "ALL"
      ? ALL_CASE_STUDIES
      : ALL_CASE_STUDIES.filter((cs) => {
          if (activeCategory === "Fintech") return cs.industryId === "fintech";
          if (activeCategory === "Healthcare") return cs.industryId === "healthcare";
          if (activeCategory === "E-Commerce") return cs.industryId === "ecommerce";
          if (activeCategory === "SaaS") return cs.industryId === "saas";
          if (activeCategory === "Logistics") return cs.industryId === "logistics";
          if (activeCategory === "EdTech") return cs.industryId === "edtech";
          return true;
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
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Case Studies</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs">
              <FileText className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>Proven Enterprise Success & ROI</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              Category-Defining Case Studies &{" "}
              <span className="text-violet-600 dark:text-[#f58220]">
                Product Launches
              </span>
            </h1>

            <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-ink/75 sm:text-xl">
              Explore how Clickpoint Innovation partners with high-growth startups and Fortune 500 leaders to build autonomous AI copilots, zero-downtime platforms, and high-converting software.
            </p>

            {/* Impact Highlights Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-6 sm:grid-cols-4 shadow-xl shadow-violet-950/[0.04] backdrop-blur-xl">
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">$120M+</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Volume Processed Daily</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-[#f58220]">88%</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Fraud & Latency Reduction</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">3.8x</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Avg First-Year ROI</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-[#f58220]">99.99%</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Enterprise Uptime SLA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Case Studies Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter Tabs */}
          <div className="mb-14 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                      : "bg-cloud-100 text-ink/70 hover:bg-violet-50 hover:text-violet-700 border border-violet-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                  }`}
                >
                  {cat === "ALL" ? "All Case Studies" : cat}
                </button>
              );
            })}
          </div>

          {/* Case Study Cards Grid */}
          <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredCaseStudies.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-500 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-500/15 hover:-translate-y-1.5"
                >
                  <div>
                    {/* Visual Banner Header */}
                    <div
                      className={`relative h-44 w-full rounded-2xl bg-gradient-to-br ${project.imageGradient} p-5 text-white shadow-inner flex flex-col justify-between overflow-hidden group-hover:scale-[1.02] transition-transform duration-500`}
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#ffffff20,transparent)]" />
                      
                      <div className="flex items-center justify-between relative z-10">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/30">
                          {project.client}
                        </span>
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/90">
                          {project.industryTitle.split("&")[0]}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                          Impact Delivered
                        </p>
                        <h4 className="font-display text-2xl font-extrabold text-white">
                          {project.impact}
                        </h4>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-violet-50 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                          {project.industryTitle}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                        {project.desc}
                      </p>

                      {/* Architecture Tech Stack Pills */}
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-cloud-100/70 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-ink/70 dark:text-slate-300 border border-violet-100/60 dark:border-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Link */}
                  <div className="mt-8 pt-4 border-t border-violet-100 dark:border-slate-800 flex items-center justify-between">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-white transition-colors"
                    >
                      <span>Explore Live Platform</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Featured Deep-Dive Benchmark Showcase Section */}
      <section className="py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-t border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16 max-w-3xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              Deep Architecture Breakdown
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl">
              Khataflow AI Ledger Engine: <span className="text-violet-600 dark:text-[#f58220]">From $4M to $42M+ Daily Volume</span>
            </h2>
            <p className="mt-4 text-base text-ink/75 dark:text-slate-300">
              How Clickpoint engineered an autonomous financial reconciliation engine with sub-250ms latency.
            </p>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Transformation Comparison Table */}
            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-xl shadow-violet-950/[0.04]">
              <h3 className="font-display text-xl font-bold text-ink dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                Measurable Benchmark Impact
              </h3>

              <div className="space-y-4 text-xs font-medium">
                <div className="grid grid-cols-3 gap-2 pb-3 border-b border-violet-100 dark:border-slate-800 font-bold uppercase tracking-wider text-ink/50 dark:text-slate-400">
                  <span>Metric</span>
                  <span className="text-red-500">Before Clickpoint</span>
                  <span className="text-violet-600 dark:text-violet-300">After Clickpoint</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-b border-violet-100/60 dark:border-slate-800">
                  <span className="font-bold text-ink dark:text-white">Reconciliation Speed</span>
                  <span className="text-red-500">48 Hours Manual</span>
                  <span className="font-bold text-violet-700 dark:text-violet-300">Real-Time (&lt; 250ms)</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-b border-violet-100/60 dark:border-slate-800">
                  <span className="font-bold text-ink dark:text-white">Audit Accuracy</span>
                  <span className="text-red-500">91.2%</span>
                  <span className="font-bold text-violet-700 dark:text-violet-300">99.94%</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-b border-violet-100/60 dark:border-slate-800">
                  <span className="font-bold text-ink dark:text-white">Daily Volume</span>
                  <span className="text-red-500">$4.0 Million</span>
                  <span className="font-bold text-violet-700 dark:text-violet-300">$42.0 Million+</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2">
                  <span className="font-bold text-ink dark:text-white">User Satisfaction</span>
                  <span className="text-red-500">3.2 / 5.0 Rating</span>
                  <span className="font-bold text-violet-700 dark:text-violet-300">4.9 / 5.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Right: Key Engineering Deliverables */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-bold text-ink dark:text-white">
                  Engineering Breakdown & Architecture
                </h3>
                <p className="text-sm leading-relaxed text-ink/75 dark:text-slate-300">
                  Clickpoint replaced Khataflow's legacy monolithic database with an event-driven Kafka architecture, PgVector indexing, and automated AI agent audit pods.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-ink dark:text-white">Autonomous AI Audit Pods</h4>
                    <p className="text-xs text-ink/70 dark:text-slate-300">Multi-agent reasoning loops matching unmatched ledger items automatically.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-ink dark:text-white">PCI-DSS & SOC2 Type II Infrastructure</h4>
                    <p className="text-xs text-ink/70 dark:text-slate-300">Zero-trust encrypted database schemas with complete tenant isolation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-ink dark:text-white">High-Throughput Payout API</h4>
                    <p className="text-xs text-ink/70 dark:text-slate-300">Type-safe GraphQL gateway routing payouts across 5 banking partners.</p>
                  </div>
                </div>
              </div>

              <a
                href="https://khataflow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all"
              >
                <span>View Khataflow Live Platform</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Client Executive Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f58220]">
              Executive Endorsements
            </p>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              Trusted by tech leaders <span className="text-violet-600 dark:text-[#f58220]">around the globe</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="flex flex-col justify-between rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs leading-relaxed text-ink/80 dark:text-slate-300 font-medium italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-violet-100 dark:border-slate-800 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${t.gradient} text-white font-bold text-sm shadow-xs`}>
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-ink">{t.name}</h4>
                    <p className="text-[11px] font-semibold text-violet-600">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
