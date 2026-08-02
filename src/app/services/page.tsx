"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Bot,
  Code2,
  Palette,
  LineChart,
  Boxes,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Clock,
  Award,
  GitBranch,
  Workflow,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTASection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { SERVICES_DATA } from "@/data/landing-data";

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
 
  services: SERVICES_DATA.map((s) => ({
    ...s,
    imageUrl: s.imageUrl || "",
    keyMetrics: s.keyMetrics || [],
    features: s.features || [],
    techStack: s.techStack || [],
  })),
};

export default function ServicesPage() {
  const [content, setContent] = useState(DEFAULT_SERVICES_CONTENT);

  useEffect(() => {
    const saved = localStorage.getItem("services_page_content");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContent({
          hero: parsed.hero || DEFAULT_SERVICES_CONTENT.hero,
          catalogSection: parsed.catalogSection || DEFAULT_SERVICES_CONTENT.catalogSection,
          services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_SERVICES_CONTENT.services,
        });
      } catch (err) {
        console.error("Failed to parse services_page_content:", err);
      }
    }
  }, []);

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        {/* Glow background effects */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-40 right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-500/20 via-violet-400/10 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-ember-400/15 to-transparent blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Services & Capabilities</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800/90 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-sm backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{content.hero.badge}</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl">
              {content.hero.title}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-ink/75 dark:text-slate-300 sm:text-lg lg:text-xl">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Services Dynamic Grid Section */}
      <section className="py-16 lg:py-24 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-t border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <Layers className="h-3.5 w-3.5" />
              {content.catalogSection?.tag || "Our Core Disciplines"} ({content.services.length} Services)
            </div>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
              {content.catalogSection?.title || "End-to-End Capabilities Built for Scale"}
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {content.services.map((service, index) => (
              <div
                key={service.id || index}
                className="group relative flex flex-col justify-between rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-600"
              >
                <div>
                  {/* Media Frame (Upload or Placeholder Video/Image) */}
                  {service.imageUrl && service.imageUrl.trim() !== "" && (
                    <div className="mb-6 h-48 w-full overflow-hidden rounded-2xl border border-violet-100 dark:border-slate-800 bg-slate-900 relative shadow-inner">
                      {service.imageUrl.endsWith(".mp4") || service.imageUrl.includes("video") ? (
                        <video
                          src={service.imageUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  )}

                  {/* Top Badge & Title Header */}
                  {service.heroBadge && (
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-50 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-violet-600 dark:text-violet-300">
                      <Sparkles className="h-3 w-3 text-violet-500" />
                      <span>{service.heroBadge}</span>
                    </div>
                  )}

                  <h3 className="font-display text-2xl font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#f58220] tracking-wide">
                    {service.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-slate-300">
                    {service.desc}
                  </p>

                  {/* Key Metrics Grid */}
                  {service.keyMetrics && service.keyMetrics.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-violet-50/60 dark:bg-slate-900/60 p-3 text-center border border-violet-100/60 dark:border-slate-800">
                      {service.keyMetrics.map((metric, mIdx) => (
                        <div key={mIdx}>
                          <p className="font-display text-base font-extrabold text-violet-600 dark:text-violet-300">
                            {metric.value}
                          </p>
                          <p className="text-[9px] font-medium text-ink/60 dark:text-slate-400 truncate">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/40 dark:text-slate-400">
                        Key Capabilities
                      </p>
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-ink/80 dark:text-slate-200">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400 mt-0.5" />
                          <span>
                            <strong className="font-bold text-ink dark:text-white">{feat.title}: </strong>
                            {feat.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  {service.techStack && service.techStack.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-violet-100/60 dark:border-slate-800">
                      {service.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Button */}
                <div className="mt-8 pt-4 border-t border-violet-100 dark:border-slate-800">
                  <Link href={`/services/${service.id}`}>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-bold group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all dark:border-slate-700"
                    >
                      <span>{service.buttonText || "Explore Capabilities"}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Standards Grid */}
      <section className="py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-t border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <Award className="h-3.5 w-3.5" />
              The Clickpoint Guarantee
            </div>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
              Why Global Enterprise Leaders Choose Us
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-white">2-4 Week MVP Delivery</h3>
              <p className="mt-2 text-xs text-ink/70 dark:text-slate-300 leading-relaxed">
                Rapid prototyping sprints delivering production-grade software prototypes fast.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-white">SOC2 & Enterprise Security</h3>
              <p className="mt-2 text-xs text-ink/70 dark:text-slate-300 leading-relaxed">
                Strict data privacy guarantees, zero third-party training leakage, and security audits.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-white">Senior Engineering Pods</h3>
              <p className="mt-2 text-xs text-ink/70 dark:text-slate-300 leading-relaxed">
                Dedicated senior full-stack and AI engineers embedded directly into your product development lifecycle.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-white">99.9% Uptime & SLA</h3>
              <p className="mt-2 text-xs text-ink/70 dark:text-slate-300 leading-relaxed">
                Architected with sub-100ms latency targets, auto-scaling infrastructure, and monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Call To Action */}
      <CTASection />

      <Footer />
    </main>
  );
}
