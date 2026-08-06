"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ArrowRight, Quote, CheckCircle2, MessageSquarePlus } from "lucide-react";
import FeedbackModal from "@/components/testimonials/feedback-modal";
import { TestimonialItem } from "@/types";

import { DEFAULT_LANDING_DATA, DEFAULT_TESTIMONIALS_HEADER } from "@/data/default-landing-data";

function getInitials(name: string): string {
  if (!name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

interface TestimonialsSectionProps {
  initialHeader?: any;
  initialTestimonials?: TestimonialItem[];
}

export default function TestimonialsSection({ initialHeader, initialTestimonials }: TestimonialsSectionProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials || []);
  const [headerContent, setHeaderContent] = useState<any>(
    initialHeader || DEFAULT_LANDING_DATA.testimonialsHeader || DEFAULT_TESTIMONIALS_HEADER
  );
  const [metrics, setMetrics] = useState<any[]>([
    { label: "Average Client Rating", value: "4.9 / 5.0" },
    { label: "Verified Reviews", value: "350+" },
    { label: "Client Retention Rate", value: "89%" },
  ]);

  const loadDynamicTestimonials = useCallback(async () => {
    try {
      if (!initialHeader) {
        const landingRes = await fetch("/api/landing");
        const landingJson = await landingRes.json();
        if (landingJson.success && landingJson.data && landingJson.data.testimonialsHeader) {
          setHeaderContent({ ...DEFAULT_TESTIMONIALS_HEADER, ...landingJson.data.testimonialsHeader });
        }
      }

      if (!initialTestimonials || initialTestimonials.length === 0) {
        const res = await fetch("/api/testimonials");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.metrics && json.data.metrics.length > 0) setMetrics(json.data.metrics);
          if (json.data.testimonials && json.data.testimonials.length > 0) {
            setTestimonials(json.data.testimonials);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    }
  }, [initialHeader, initialTestimonials]);

  useEffect(() => {
    if (!initialHeader || !initialTestimonials || initialTestimonials.length === 0) {
      loadDynamicTestimonials();
    }
  }, [initialHeader, initialTestimonials, loadDynamicTestimonials]);

  const displayItems = testimonials.slice(0, 3);

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 bg-cloud-100/70 border-t border-violet-100 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* LEFT-ALIGNED SECTION HEADER & CTA BUTTONS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-3 text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              {headerContent.badge || "Client Proof & Verified Reviews"}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {headerContent.title}{" "}
              {headerContent.titleHighlight && (
                <span className="text-violet-600 dark:text-orange-500">
                  {headerContent.titleHighlight}
                </span>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-medium pt-1">
              {headerContent.subtitle || "See how our AI & software engineering pods drive measurable ROI for startups and enterprise platforms."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 text-fluid-sm font-bold shadow-lg shadow-violet-600/25 transition-all hover:scale-105 cursor-pointer"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>{headerContent.reviewModalButtonText || "Give Review / Feedback"}</span>
            </button>

            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-2.5 text-fluid-sm font-bold text-violet-600 dark:text-violet-300 transition-all hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25"
            >
              <span>{headerContent.ctaButtonText || "Explore All Testimonials"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic Rating Stats & Trust Metrics Bar */}
        {metrics.length > 0 && (
          <div className="mb-14 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-violet-200/60 dark:border-slate-800 py-6 bg-white/40 dark:bg-slate-900/40 rounded-2xl backdrop-blur-xs">
            {metrics.map((m, idx) => (
              <div key={idx} className="text-center px-4">
                <p className="stat-number text-violet-600 dark:text-violet-400">
                  {m.value}
                </p>
                <p className="mt-1 text-fluid-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials 3-Column Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group flex flex-col justify-between rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-2.5 py-0.5 text-fluid-2xs font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                    Verified Review
                  </span>
                </div>

                <Quote className="h-8 w-8 text-violet-200 dark:text-slate-700 mb-2" />

                <p className="card-body text-ink/80 dark:text-slate-300 font-medium italic">
                  "{item.content}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-violet-100 dark:border-slate-800 flex items-center gap-3">
                <div className="relative shrink-0 h-10 w-10 rounded-xl overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-800 text-white font-bold text-fluid-xs flex items-center justify-center shadow-xs">
                  {item.avatarUrl ? (
                    <Image src={item.avatarUrl} alt={item.clientName} fill className="object-cover" />
                  ) : (
                    <span>{getInitials(item.clientName)}</span>
                  )}
                </div>

                <div>
                  <h4 className="font-display text-fluid-sm font-bold text-ink dark:text-white flex items-center gap-1">
                    {item.clientName}
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-fluid-2xs font-semibold text-violet-600 dark:text-violet-300">
                    {item.clientRole}, {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Give Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadDynamicTestimonials}
      />
    </section>
  );
}

