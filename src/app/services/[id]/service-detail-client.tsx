"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Zap,
  Cpu,
  Layers,
  Code2,
  Workflow,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { SERVICES_DATA } from "@/data/landing-data";

interface ServiceDetailClientProps {
  initialService: any;
  serviceId: string;
}

export default function ServiceDetailClient({ initialService, serviceId }: ServiceDetailClientProps) {
  // Static fallback if initialService is not found
  const staticFallback = SERVICES_DATA.find((s) => s.id === serviceId) || {
    id: serviceId,
    title: "Custom Service Engineering",
    subtitle: "Enterprise Digital Solution & Cloud Pod",
    desc: "Transform enterprise workflows with custom software, sub-second execution speed, and resilient cloud architectures.",
    fullOverview:
      "Clickpoint Innovation specializes in building production-grade enterprise software solutions tailored for high concurrency, real-time data processing, and compounding business velocity.",
    heroBadge: "Custom Engineering Pod",
    imageUrl: "",
    keyMetrics: [
      { label: "Execution Latency", value: "< 250ms" },
      { label: "Accuracy Rate", value: "99.4%" },
      { label: "Efficiency Gain", value: "4.5x" },
    ],
    features: [
      { title: "Autonomous Execution Pods", desc: "Dedicated senior engineering teams integrated into your development lifecycle." },
      { title: "Sub-Second Latency Architecture", desc: "Edge caching, vector indexing, and high-concurrency API microservices." },
      { title: "SOC2 & Security Isolation", desc: "Strict data privacy guarantees, zero third-party training leakage, and audited code." },
    ],
    workflow: [
      { step: "01", title: "Discovery & Architecture", desc: "Analyzing requirements, defining database schemas, and assembling the pod." },
      { step: "02", title: "Rapid Prototyping MVP", desc: "2-4 week sprint cycles delivering functional code and automated test suites." },
      { step: "03", title: "Continuous CI/CD Integration", desc: "Daily code commits, automated peer reviews, and real-time staging deployments." },
      { step: "04", title: "Enterprise SLA & Managed Ops", desc: "99.99% uptime monitoring, auto-scaling infrastructure, and 24/7 maintenance SLA." },
    ],
    useCases: [
      "Enterprise Process Automation",
      "Custom Cloud Platform Migration",
      "High-Scale API Microservices",
      "Real-Time Data Analytics Engines",
    ],
    techStack: ["Next.js", "TypeScript", "Python", "Node.js", "Docker", "AWS"],
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

  const baseService = initialService || staticFallback;
  const [service, setService] = useState<any>(baseService);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* ========================================================================= */}
      {/* SEQUENCE STEP 1: HERO BANNER & KEY PERFORMANCE METRICS */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24">
        {/* Background Glows */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-violet-400/30 via-violet-300/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-ember-300/20 to-transparent blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <Link href="/services" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Services
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">{service.title}</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            {/* Hero Tag Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800/90 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-sm backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{service.heroBadge || service.subtitle || "Custom Engineering Pod"}</span>
            </div>

            {/* Main Service Title */}
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl">
              {service.title}
            </h1>

            {/* Subtitle Description */}
            <p className="mt-6 text-base leading-relaxed text-ink/70 dark:text-slate-300 sm:text-lg">
              {service.desc}
            </p>

            {/* Key Performance Metrics Glass Banner */}
            {service.keyMetrics && service.keyMetrics.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white/80 dark:bg-[#131c31]/90 p-6 sm:grid-cols-3 shadow-xl backdrop-blur-xl">
                {service.keyMetrics.map((met: any, idx: number) => (
                  <div key={idx} className="p-2 text-center">
                    <p className="font-display text-3xl font-black text-violet-600 dark:text-violet-400">
                      {met.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-ink/70 dark:text-slate-300">
                      {met.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href={service.ctaPrimaryRoute || "/contact"}>
                <Button size="lg" className="group bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg border-none px-6">
                  <span>{service.ctaPrimaryText || "Request Service Audit"}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={service.ctaSecondaryRoute || "/services"}>
                <Button variant="outline" size="lg" className="border-violet-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-ink dark:text-white font-bold hover:bg-violet-50 dark:hover:bg-slate-800 px-6">
                  <span>{service.ctaSecondaryText || "All Services"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SEQUENCE STEP 2: DETAILED OVERVIEW NARRATIVE & PRIMARY FOCUS AREAS */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 bg-cloud-100/60 dark:bg-[#0b1120]/40 border-y border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              {/* Dynamic Overview Tag */}
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                {service.overviewTag || "Detailed Overview"}
              </p>

              {/* Dynamic Overview Heading */}
              <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
                {service.overviewHeading || "How We Deliver Exceptional"} {service.title}
              </h2>

              {/* Dynamic Full Overview Narrative */}
              <p className="mt-4 text-base leading-relaxed text-ink/75 dark:text-slate-300">
                {service.fullOverview || service.desc}
              </p>

              {/* Dynamic Primary Focus Areas / Use Cases List */}
              {service.useCases && service.useCases.length > 0 && (
                <div className="mt-8 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {service.useCasesHeading || "Primary Focus Areas"}
                  </p>
                  {service.useCases.map((uc: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-violet-600 shrink-0" />
                      <span className="text-sm font-semibold text-ink dark:text-white">{uc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cloudinary Media Image / Video Card */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              {service.imageUrl && service.imageUrl.trim() !== "" ? (
                <div className="relative overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-3 shadow-2xl">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                </div>
              ) : (
                <div className="group relative overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-2xl shadow-violet-950/10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
                    <Cpu className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-ink dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-slate-300">
                    {service.subtitle}
                  </p>
                  {service.techStack && service.techStack.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                      {service.techStack.map((tech: string) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700"
                        >
                          <CheckCircle2 className="h-3 w-3 text-violet-600" />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SEQUENCE STEP 3: CORE CAPABILITIES & FEATURE CARDS */}
      {/* ========================================================================= */}
      {service.features && service.features.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                {service.capabilitiesTag || "Core Capabilities"}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
                {service.capabilitiesHeading || "Engineered features for maximum impact"}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.features.map((feat: any, idx: number) => (
                <div
                  key={idx}
                  className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-sm transition-all hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 font-bold text-sm">
                    {idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink dark:text-white">{feat.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SEQUENCE STEP 4: EXECUTION BLUEPRINT & 4-STEP AGILE DELIVERY WORKFLOW */}
      {/* ========================================================================= */}
      {service.workflow && service.workflow.length > 0 && (
        <section className="py-20 lg:py-28 bg-cloud-100/50 dark:bg-[#0b1120]/40 border-t border-violet-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                {service.blueprintTag || "Execution Blueprint"}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
                {service.blueprintHeading || "Our step-by-step delivery process"}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.workflow.map((wf: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-sm transition-all hover:border-violet-300 dark:hover:border-slate-700"
                >
                  <span className="font-mono text-2xl font-black text-violet-600 dark:text-violet-400">
                    {wf.step}
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink dark:text-white">
                    {wf.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                    {wf.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SEQUENCE STEP 5: TECH STACK BADGES GRID */}
      {/* ========================================================================= */}
      {service.techStack && service.techStack.length > 0 && (
        <section className="py-16 bg-white dark:bg-[#131c31] border-t border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
              Technologies & Infrastructure Stack
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {service.techStack.map((tech: string, tIdx: number) => (
                <span
                  key={tIdx}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 dark:border-slate-700 bg-violet-50/60 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 shadow-xs"
                >
                  <Code2 className="h-3.5 w-3.5 text-violet-500" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}