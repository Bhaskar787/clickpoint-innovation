"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Zap,
  ArrowRight,
  CheckCircle2,
  Boxes,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTASection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";

interface ServicesCatalogClientProps {
  initialContent: any;
}

export default function ServicesCatalogClient({ initialContent }: ServicesCatalogClientProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

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
          {/* LEFT-ALIGNED BREADCRUMB ROUTE */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Services & Capabilities</span>
          </div>

          {/* CENTER-ALIGNED HERO CONTENT */}
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-300 text-xs font-extrabold uppercase tracking-widest shadow-xs">
              <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{content?.hero?.badge || "Services & Capabilities"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {content?.hero?.title ? (
                <>
                  {content.hero.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {content.hero.title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  End-to-End Software &{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    AI Engineering
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium pt-1">
              {content?.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 lg:py-24 bg-cloud-100/50 dark:bg-[#0b1120]/40 border-y border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              {content?.catalogSection?.tag || "Our Core Disciplines"}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {content?.catalogSection?.title ? (
                <>
                  {content.catalogSection.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {content.catalogSection.title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  End-to-End Capabilities Built for{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    Scale
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* Dynamic Services Cards */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {content?.services?.map((service: any) => (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-md transition-all duration-500 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-500/15 hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 dark:border-slate-700 bg-violet-50 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-violet-700 dark:text-violet-300">
                      <Boxes className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                      <span>{service.heroBadge || service.subtitle}</span>
                    </span>

                    <span className="font-mono text-xs font-extrabold text-slate-400">
                      /{service.id}
                    </span>
                  </div>

                  {/* Optional Service Media Image */}
                  {service.imageUrl && service.imageUrl.trim() !== "" && (
                    <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <h3 className="font-display text-2xl font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-ink/75 dark:text-slate-300">
                    {service.desc}
                  </p>

                  {/* Metrics Badges */}
                  {service.keyMetrics && service.keyMetrics.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {service.keyMetrics.map((met: any, idx: number) => (
                        <div key={idx} className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2 text-center">
                          <p className="font-display text-sm font-extrabold text-violet-600 dark:text-violet-400">
                            {met.value}
                          </p>
                          <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                            {met.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  {service.techStack && service.techStack.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap gap-1.5">
                        {service.techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            <CheckCircle2 className="h-2.5 w-2.5 text-violet-500" />
                            <span>{tech}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link href={`/services/${service.id}`}>
                    <Button className="group/btn bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md px-5 cursor-pointer">
                      <span>{service.buttonText || "Explore Capabilities"}</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>

                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    ID: {service.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Agile Process Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              {content?.processSection?.tag || "Engineering Process & Pod Model"}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {content?.processSection?.title ? (
                <>
                  {content.processSection.title.split(" ").slice(0, -3).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {content.processSection.title.split(" ").slice(-3).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  How Our Dedicated Pods Build &{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    Scale Software
                  </span>
                </>
              )}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium pt-1">
              {content?.processSection?.subtitle || "A disciplined, 4-phase agile engineering methodology engineered for sub-second performance, continuous deployment, and enterprise security."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content?.processSection?.steps?.map((step: any, idx: number) => (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-sm transition-all hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
              >
                <span className="font-mono text-2xl font-black text-violet-600 dark:text-violet-400">
                  {step.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                  {step.desc}
                </p>
                {step.deliverable && (
                  <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-violet-700 dark:text-violet-300">
                    Deliverable: {step.deliverable}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}