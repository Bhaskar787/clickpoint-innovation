"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ArrowRight, Quote, MessageSquare, CheckCircle2, MessageSquarePlus } from "lucide-react";
import FeedbackModal from "@/components/testimonials/feedback-modal";
import { TestimonialItem } from "@/types";

function getInitials(name: string): string {
  if (!name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export default function TestimonialsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [heroContent, setHeroContent] = useState<any>({
    badge: "Client Proof & Verified Reviews",
    title: "Trusted by tech leaders worldwide",
    subtitle: "See how our AI & software engineering pods drive measurable ROI for startups and enterprise platforms.",
    reviewModalButtonText: "Give Review / Feedback",
  });
  const [metrics, setMetrics] = useState<any[]>([
    { label: "Average Client Rating", value: "4.9 / 5.0" },
    { label: "Verified Reviews", value: "350+" },
    { label: "Client Retention Rate", value: "89%" },
  ]);

  async function loadDynamicTestimonials() {
    try {
      const res = await fetch("/api/testimonials");
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.hero) setHeroContent(json.data.hero);
        if (json.data.metrics && json.data.metrics.length > 0) setMetrics(json.data.metrics);
        if (json.data.testimonials && json.data.testimonials.length > 0) {
          setTestimonials(json.data.testimonials);
        }
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    }
  }

  useEffect(() => {
    loadDynamicTestimonials();
  }, []);

  const displayItems = testimonials.slice(0, 3);

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 bg-cloud-100/70 border-t border-violet-100 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <MessageSquare className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              {heroContent.badge || "Client Proof & Verified Reviews"}
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink dark:text-white">
              {heroContent.title || "Trusted by tech leaders worldwide"}
            </h2>
            <p className="mt-3 text-xs sm:text-base text-ink/70 dark:text-slate-300">
              {heroContent.subtitle || "See how our AI & software engineering pods drive measurable ROI."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/25 transition-all hover:scale-105"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>{heroContent.reviewModalButtonText || "Give Review / Feedback"}</span>
            </button>

            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-violet-600 dark:text-violet-300 transition-all hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25"
            >
              <span>Explore All Testimonials</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic Rating Stats & Trust Metrics Bar */}
        {metrics.length > 0 && (
          <div className="mb-14 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-violet-200/60 dark:border-slate-800 py-6 bg-white/40 dark:bg-slate-900/40 rounded-2xl backdrop-blur-xs">
            {metrics.map((m, idx) => (
              <div key={idx} className="text-center px-4">
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400">
                  {m.value}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                  <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                    Verified Review
                  </span>
                </div>

                <Quote className="h-8 w-8 text-violet-200 dark:text-slate-700 mb-2" />

                <p className="text-xs leading-relaxed text-ink/80 dark:text-slate-300 font-medium italic">
                  "{item.content}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-violet-100 dark:border-slate-800 flex items-center gap-3">
                <div className="relative shrink-0 h-10 w-10 rounded-xl overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {item.avatarUrl ? (
                    <Image src={item.avatarUrl} alt={item.clientName} fill className="object-cover" />
                  ) : (
                    <span>{getInitials(item.clientName)}</span>
                  )}
                </div>

                <div>
                  <h4 className="font-display text-sm font-bold text-ink dark:text-white flex items-center gap-1">
                    {item.clientName}
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-300">
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
