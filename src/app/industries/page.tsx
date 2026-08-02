"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LiaIndustrySolid } from "react-icons/lia";
import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  HeartPulse,
  ShoppingBag,
  Layers,
  Truck,
  GraduationCap,
  Building2,
  Lock,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { INDUSTRIES_DATA } from "@/data/landing-data";

export default function IndustriesIndexPage() {
  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24 bg-cloud-100/70 dark:bg-[#0f172a]/50 border-b border-violet-100 dark:border-slate-800">
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
            <span className="text-violet-600 dark:text-violet-300 font-bold">Industry Practices</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs">
              <LiaIndustrySolid className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              <span>Domain Expertise & Vertical Specialization</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              Tailored Digital Solutions for{" "}
              <span className="text-[#1b4397] dark:text-[#f58220]">
                High-Growth Sectors
              </span>
            </h1>

            <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-ink/75 dark:text-slate-300 sm:text-xl">
              We combine deep vertical domain knowledge with modern AI, cloud infrastructure, and human-centric UX to build software that compounds in enterprise value.
            </p>

            {/* Impact Highlights Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-6 sm:grid-cols-4 shadow-xl shadow-violet-950/[0.04] backdrop-blur-xl">
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">6</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Core Vertical Practices</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-[#f58220]">350+</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Enterprise Builds Deployed</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">100%</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">SOC2 & HIPAA Compliant</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-[#f58220]">89%</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Client Retention Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Matrix Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f58220]">
              Sector Practices
            </p>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              Specialized engineering for <span className="text-violet-600 dark:text-[#f58220]">your domain</span>
            </h2>
            <p className="mt-3 text-base text-ink/75 dark:text-slate-300">
              Select your industry to explore domain capabilities, live client case studies, and compliance frameworks.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            {INDUSTRIES_DATA.map((ind) => {
              const Icon = ind.icon || Building2;
              return (
                <div
                  key={ind.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-md transition-all duration-500 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-500/15"
                >
                  <div>
                    {/* Header Bar */}
                    <div className="flex items-center justify-between border-b border-violet-100 dark:border-slate-800 pb-6 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform">
                          <Icon className="h-7 w-7 text-violet-600 dark:text-violet-300" />
                        </div>
                        <div>
                          <h3 className="font-display text-2xl font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                            {ind.title}
                          </h3>
                          <p className="text-xs font-semibold text-violet-600 dark:text-violet-300">{ind.heroBadge}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                        {ind.projects.length} Case Studies
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-ink/75 dark:text-slate-300">
                      {ind.desc}
                    </p>

                    {/* Metrics Bar */}
                    <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-cloud-100/70 dark:bg-slate-900/60 p-4 border border-violet-100 dark:border-slate-800">
                      {ind.keyMetrics.map((m, idx) => (
                        <div key={idx} className="text-center">
                          <p className="font-display text-lg font-extrabold text-violet-600 dark:text-violet-300">{m.value}</p>
                          <p className="text-[10px] font-medium text-ink/65 dark:text-slate-400 line-clamp-1">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Solutions Pods */}
                    <div className="mt-6">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40 dark:text-slate-400 mb-2.5">
                        Target Engineering Solutions
                      </p>
                      <div className="space-y-2">
                        {ind.solutions.slice(0, 2).map((sol, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-ink/80 dark:text-slate-300 font-medium">
                            <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                            <span>{sol.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-8 pt-6 border-t border-violet-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link
                      href={ind.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-white dark:text-violet-300 border border-transparent dark:border-slate-700 shadow-md shadow-violet-600/25 transition-all hover:bg-violet-700 dark:hover:bg-slate-700 hover:shadow-lg"
                    >
                      <span>Explore {ind.title.split("&")[0]} Solutions</span>
                      <ArrowRight className="h-3.5 w-3.5 text-white dark:text-violet-300" />
                    </Link>

                    {ind.projects[0] && (
                      <a
                        href={ind.projects[0].liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/70 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                      >
                        <span>Live: {ind.projects[0].title}</span>
                        <ExternalLink className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Compliance & Security Matrix */}
      <section className="py-20 lg:py-28 bg-cloud-100/70 dark:bg-[#0f172a]/50 border-y border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              Enterprise Security & Compliance
            </div>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              Zero-Trust Architecture Across <span className="text-violet-600 dark:text-[#f58220]">Every Industry</span>
            </h2>
            <p className="mt-3 text-base text-ink/75 dark:text-slate-300">
              Strict regulatory compliance and multi-tenant data isolation built into every engineering pipeline.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 font-bold mb-4">
                <Lock className="h-5 w-5" />
              </span>
              <h4 className="font-display text-base font-bold text-ink dark:text-white">HIPAA & HITECH</h4>
              <p className="mt-2 text-xs leading-relaxed text-ink/65 dark:text-slate-300">
                Encrypted ePHI patient data streams with audit logging for healthcare portals.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 font-bold mb-4">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h4 className="font-display text-base font-bold text-ink dark:text-white">PCI-DSS & SOC2</h4>
              <p className="mt-2 text-xs leading-relaxed text-ink/65 dark:text-slate-300">
                Bank-grade tokenization, multi-currency ledger security, and AML compliance.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 font-bold mb-4">
                <Layers className="h-5 w-5" />
              </span>
              <h4 className="font-display text-base font-bold text-ink dark:text-white">Multi-Tenant Isolation</h4>
              <p className="mt-2 text-xs leading-relaxed text-ink/65 dark:text-slate-300">
                Schema-level database partitioning ensuring complete B2B SaaS tenant data privacy.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 font-bold mb-4">
                <Building2 className="h-5 w-5" />
              </span>
              <h4 className="font-display text-base font-bold text-ink dark:text-white">GDPR & ISO/IEC 27001</h4>
              <p className="mt-2 text-xs leading-relaxed text-ink/65 dark:text-slate-300">
                Global user privacy controls, right-to-be-forgotten webhooks, and security monitoring.
              </p>
            </div>
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
