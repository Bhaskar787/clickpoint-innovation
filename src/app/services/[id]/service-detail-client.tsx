"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Zap,
  Cpu,
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
  // Find fallback from static landing data if initialService is blank
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
    useCasesHeading: "Primary Use Cases for",
  };

  const baseService = initialService || staticFallback;
  const [service, setService] = useState<any>(baseService);

  useEffect(() => {
    const saved = localStorage.getItem("services_page_content");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.services)) {
          const found = parsed.services.find((s: any) => s.id === serviceId);
          if (found) {
            setService({
              ...baseService,
              ...found,
              keyMetrics: (found.keyMetrics && found.keyMetrics.length > 0) ? found.keyMetrics : baseService.keyMetrics,
              features: (found.features && found.features.length > 0) ? found.features : baseService.features,
              workflow: (found.workflow && found.workflow.length > 0) ? found.workflow : baseService.workflow,
              useCases: (found.useCases && found.useCases.length > 0) ? found.useCases : baseService.useCases,
              techStack: (found.techStack && found.techStack.length > 0) ? found.techStack : baseService.techStack,
            });
          }
        }
      } catch (err) {
        console.error("Failed to parse services_page_content:", err);
      }
    }
  }, [serviceId, baseService]);

  const IconComponent = Cpu;

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24">
        {/* Background glow effects */}
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

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left: Copy */}
            <div>
              {service.heroBadge && (
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300">
                  <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                  <span>{service.heroBadge}</span>
                </div>
              )}

              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
                {service.title}
              </h1>

              <p className="mt-4 font-display text-lg font-bold text-violet-600 dark:text-violet-300 sm:text-xl">
                {service.subtitle}
              </p>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70 dark:text-slate-300 sm:text-lg">
                {service.desc}
              </p>

              {/* Key Metrics Row */}
              {service.keyMetrics && service.keyMetrics.length > 0 && (
                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-violet-100 dark:border-slate-800 py-6">
                  {service.keyMetrics.map((metric: any, idx: number) => (
                    <div key={idx}>
                      <p className="font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">
                        <span className="text-violet-600 dark:text-violet-300">{metric.value}</span>
                      </p>
                      <p className="mt-1 text-xs font-medium text-ink/60 dark:text-slate-400">{metric.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={service.ctaPrimaryRoute || "/contact"}>
                  <Button variant="primary" size="lg" className="group shadow-lg shadow-violet-600/25 font-bold">
                    {service.ctaPrimaryText || "Request Service Audit"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href={service.ctaSecondaryRoute || "/services"}>
                  <Button variant="outline" size="lg" className="border-violet-200 dark:border-slate-700 font-bold">
                    <ArrowLeft className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-300" />
                    {service.ctaSecondaryText || "All Services"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Technical Visual Showcase Card */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative overflow-hidden rounded-2xl border border-violet-100/90 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-8 shadow-2xl shadow-violet-950/10 backdrop-blur-xl">
                {service.imageUrl && service.imageUrl.trim() !== "" ? (
                  <div className="mb-6 h-56 w-full overflow-hidden rounded-xl border border-violet-100 dark:border-slate-800 bg-slate-900">
                    {service.imageUrl.endsWith(".mp4") || service.imageUrl.includes("video") ? (
                      <video src={service.imageUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                    ) : (
                      <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-b border-violet-100 dark:border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700 shadow-md">
                        <IconComponent className="h-6 w-6 text-violet-600 dark:text-violet-300" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-ink dark:text-white">{service.title}</h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Production Certified Pod
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                      Enterprise Grade
                    </span>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {service.techStack && service.techStack.length > 0 && (
                    <div className="rounded-xl border border-violet-100 dark:border-slate-800 bg-cloud-100/70 dark:bg-slate-900/60 p-4">
                      <p className="text-xs font-bold text-ink/50 dark:text-slate-400 uppercase tracking-wider">
                        Core Technology Stack
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {service.techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="rounded-md bg-white dark:bg-slate-800 border border-violet-100 dark:border-slate-700 px-2.5 py-1 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl bg-ink p-4 text-xs font-mono text-white/80 shadow-inner">
                    <div className="flex items-center justify-between text-white/40 text-[10px] mb-2 font-sans border-b border-white/10 pb-1.5">
                      <span>POD DEPLOYMENT STATUS</span>
                      <span className="text-emerald-400 font-semibold font-mono">100% HEALTHY</span>
                    </div>
                    <p className="text-violet-300">$ clickpoint service --init --id={service.id}</p>
                    <p className="text-emerald-400 mt-1">✓ Architecture blueprint validated</p>
                    <p className="text-white/60 mt-0.5">✓ {service.features?.length || 0} Capability pods active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview & Narrative */}
      {service.fullOverview && (
        <section className="py-16 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-y border-violet-100/80 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                {service.overviewTag || "Detailed Overview"}
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink dark:text-white">
                {service.overviewHeading || "How We Deliver Exceptional"} <span className="text-violet-600 dark:text-violet-300">{service.title}</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/75 dark:text-slate-300 sm:text-lg">
                {service.fullOverview}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Capabilities & Features Grid */}
      {service.features && service.features.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                {service.capabilitiesTag || "Core Capabilities"}
              </p>
              <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
                {service.capabilitiesHeading || "Engineered features for maximum impact"}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {service.features.map((feature: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-sm transition-all hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 font-display font-bold text-sm border border-violet-100 dark:border-slate-700 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink dark:text-white">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/65 dark:text-slate-300">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process & Delivery Workflow */}
      {service.workflow && service.workflow.length > 0 && (
        <section className="py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-t border-violet-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                {service.blueprintTag || "Execution Blueprint"}
              </p>
              <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
                {service.blueprintHeading || "Our step-by-step delivery process"}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.workflow.map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm transition-all hover:border-violet-300 dark:hover:border-violet-600"
                >
                  <span className="font-display text-3xl font-extrabold text-violet-600/40 dark:text-violet-400/40">
                    {step.step || `0${idx + 1}`}
                  </span>
                  <h4 className="mt-3 font-display text-base font-bold text-ink dark:text-white">{step.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-ink/65 dark:text-slate-300">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Use Cases Section */}
      {service.useCases && service.useCases.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 sm:p-12 shadow-sm">
              <h3 className="font-display text-2xl font-bold text-ink dark:text-white mb-6">
                {service.useCasesHeading || "Primary Use Cases for"} <span className="text-violet-600 dark:text-violet-300">{service.title}</span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {service.useCases.map((uc: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-violet-100 dark:border-slate-800 bg-violet-50/60 dark:bg-slate-900/60 p-4">
                    <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-300 shrink-0" />
                    <span className="text-sm font-semibold text-ink dark:text-white">{uc}</span>
                  </div>
                ))}
              </div>
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