"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote, MessageSquarePlus, CheckCircle2, Sparkles, Filter } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTASection from "@/components/sections/cta-section";
import FeedbackModal from "@/components/testimonials/feedback-modal";
import { TestimonialsPageContent, TestimonialItem } from "@/types";

function getInitials(name: string): string {
  if (!name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

interface TestimonialsClientViewProps {
  initialContent: TestimonialsPageContent;
  initialTestimonials: TestimonialItem[];
}

export default function TestimonialsClientView({
  initialContent,
  initialTestimonials,
}: TestimonialsClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | "ALL">("ALL");

  const hero = initialContent?.hero || {
    badge: "Client Proof & Verified Reviews",
    title: "Trusted by Fast-Growing Startups & Enterprise Leaders Worldwide",
    subtitle:
      "Read real reviews, verified ROI impact metrics, and engineering experiences from founders, CTOs, and product leaders who build with Clickpoint Innovation.",
    reviewModalButtonText: "Give Review / Feedback",
  };

  const metrics = initialContent?.metrics || [
    { label: "Average Client Rating", value: "4.9 / 5.0" },
    { label: "Verified Reviews", value: "350+" },
    { label: "Client Retention Rate", value: "89%" },
  ];

  async function refreshTestimonials() {
    try {
      const res = await fetch("/api/testimonials");
      const json = await res.json();
      if (json.success && json.data.testimonials) {
        setTestimonials(json.data.testimonials);
      }
    } catch (err) {
      console.error("Failed to refresh testimonials:", err);
    }
  }

  const filteredTestimonials = testimonials.filter((t) => {
    if (selectedStarFilter === "ALL") return true;
    return t.rating === selectedStarFilter;
  });

  return (
    <main className="relative overflow-hidden bg-white dark:bg-[#0b0f19]">
      <Navbar />

      {/* Glow Overlay */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/10 via-indigo-500/5 to-transparent blur-3xl" />

      {/* STEP 1: Hero Banner */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 border-b border-violet-100/70 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50/80 dark:bg-slate-800/80 px-4 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 shadow-xs backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-2xl text-base leading-relaxed text-ink/70 dark:text-slate-300 sm:text-lg"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white px-7 py-3.5 text-sm font-extrabold shadow-xl shadow-violet-600/30 transition-all hover:scale-105"
              >
                <MessageSquarePlus className="h-5 w-5" />
                <span>{hero.reviewModalButtonText || "Give Review / Feedback"}</span>
              </button>
            </motion.div>

            {/* Performance Stats Bar */}
            {metrics.length > 0 && (
              <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-violet-100 dark:border-slate-800">
                {metrics.map((m: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-violet-50/50 dark:bg-slate-900/60 border border-violet-100 dark:border-slate-800">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-300">{m.value}</p>
                    <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STEP 2: Filter & Testimonials Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Star Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-violet-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Filter by Rating ({filteredTestimonials.length} Verified Reviews)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedStarFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedStarFilter === "ALL"
                    ? "bg-violet-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                All Ratings
              </button>

              {[5, 4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedStarFilter(star)}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedStarFilter === star
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{star} Stars</span>
                </button>
              ))}
            </div>
          </div>

          {/* Testimonials Cards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTestimonials.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-sm transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-600/10 hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold">
                      Verified Client
                    </span>
                  </div>

                  <Quote className="h-8 w-8 text-violet-200 dark:text-slate-700 mb-3" />

                  <p className="text-xs sm:text-sm leading-relaxed text-ink/80 dark:text-slate-300 font-medium italic">
                    "{item.content}"
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-violet-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="relative shrink-0 h-11 w-11 rounded-2xl overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-800 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
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
      </section>

      {/* Give Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshTestimonials}
      />

      <CTASection />
      <Footer />
    </main>
  );
}
