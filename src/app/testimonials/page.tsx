"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  ChevronRight,
  Star,
  Quote,
  CheckCircle2,
  Building2,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";

const ALL_TESTIMONIALS = [
  {
    id: 1,
    quote: "Clickpoint's AI engineering team transformed our legacy financial audit pipeline into a real-time autonomous agent pod. Our daily processing volume jumped from $4M to $42M+ with zero downtime.",
    name: "Rajesh Verma",
    role: "VP of Product Engineering",
    company: "Khataflow Inc.",
    category: "Fintech & Banking",
    rating: 5,
    gradient: "from-violet-600 to-indigo-700",
    verified: true,
  },
  {
    id: 2,
    quote: "The headless e-commerce build and AI visual search feature engineered by Clickpoint delivered an immediate +34% lift in checkout conversions. Their technical speed is unmatched.",
    name: "Claire Bennett",
    role: "Chief Product Officer",
    company: "Caratlane Global",
    category: "E-Commerce",
    rating: 5,
    gradient: "from-amber-500 to-rose-600",
    verified: true,
  },
  {
    id: 3,
    quote: "HIPAA compliance and clinical accuracy were critical for our platform. Clickpoint delivered an automated AI claims engine achieving 99.8% accuracy and cutting adjudication cycles by 3.5x.",
    name: "Dr. Evelyn Vance",
    role: "Head of Digital Health Solutions",
    company: "MediPulse Health",
    category: "Healthcare & MedTech",
    rating: 5,
    gradient: "from-emerald-600 to-teal-700",
    verified: true,
  },
  {
    id: 4,
    quote: "Clickpoint rebuilt our multi-tenant SaaS infrastructure from scratch. They reduced our AWS infrastructure bill by 40% while handling 100,000+ concurrent WebSockets with sub-100ms latency.",
    name: "Marcus Thorne",
    role: "Co-Founder & CTO",
    company: "Synthworks AI Studio",
    category: "SaaS & AI",
    rating: 5,
    gradient: "from-blue-600 to-indigo-800",
    verified: true,
  },
  {
    id: 5,
    quote: "Our real-time fleet tracking and automated driver dispatch system processes 50,000+ daily deliveries. Clickpoint's engineering quality and 24/7 SLA support are world class.",
    name: "Vikram Malhotra",
    role: "VP of Supply Chain Engineering",
    company: "Airblock Logistics",
    category: "Logistics & EdTech",
    rating: 5,
    gradient: "from-purple-600 to-violet-800",
    verified: true,
  },
  {
    id: 6,
    quote: "The Socratic AI tutor system built by Clickpoint helped us scale to 50,000+ active students in 6 months. Student engagement metrics doubled within the first month of launch.",
    name: "Sarah Jenkins",
    role: "Director of Product",
    company: "EduLearn Technologies",
    category: "Logistics & EdTech",
    rating: 5,
    gradient: "from-pink-600 to-rose-700",
    verified: true,
  },
  {
    id: 7,
    quote: "Working with Clickpoint felt like extending our internal engineering team. Their engineers possess deep domain expertise in vector databases, LLMs, and high-concurrency microservices.",
    name: "David Chen",
    role: "Chief Architect",
    company: "FinEdge Banking",
    category: "Fintech & Banking",
    rating: 5,
    gradient: "from-cyan-600 to-blue-700",
    verified: true,
  },
  {
    id: 8,
    quote: "Their 2-week AI Studio accelerator delivered a working LLM copilot that automated 70% of our customer support tickets on day one. Unbelievable execution speed.",
    name: "Ananya Sharma",
    role: "Head of Customer Experience",
    company: "Zaggle Enterprise",
    category: "SaaS & AI",
    rating: 5,
    gradient: "from-orange-500 to-amber-600",
    verified: true,
  },
  {
    id: 9,
    quote: "Clickpoint's security auditing and SOC2 compliance guidance helped us close 3 major enterprise Fortune 500 deals that were previously stuck in security review.",
    name: "Robert Sterling",
    role: "VP of Enterprise Sales",
    company: "Datamind Analytics",
    category: "SaaS & AI",
    rating: 5,
    gradient: "from-emerald-500 to-teal-800",
    verified: true,
  },
];

const CATEGORIES = ["ALL", "Fintech & Banking", "Healthcare & MedTech", "E-Commerce", "SaaS & AI", "Logistics & EdTech"];

export default function TestimonialsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredTestimonials =
    activeCategory === "ALL"
      ? ALL_TESTIMONIALS
      : ALL_TESTIMONIALS.filter((t) => t.category === activeCategory);

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24 bg-cloud-100/70 border-b border-violet-100">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-400/30 via-indigo-300/20 to-transparent blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Client Testimonials</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs">
              <MessageSquare className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>Verified Client Success & Endorsements</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              What Industry Leaders Say About{" "}
              <span className="text-violet-600 dark:text-[#f58220]">
                Clickpoint Innovation
              </span>
            </h1>

            <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-ink/75 dark:text-slate-300 sm:text-xl">
              Read how our AI-first engineering pods partner with founders, CTOs, and enterprise leaders to ship high-impact digital products.
            </p>

            {/* Impact Counter Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-violet-100 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-6 sm:grid-cols-4 shadow-xl shadow-violet-950/[0.04] backdrop-blur-xl">
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">4.9 / 5.0</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Average Client Rating</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-[#f58220]">350+</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Product Builds Shipped</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-300">98%</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Client Satisfaction Score</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-display text-3xl font-extrabold text-[#f58220]">89%</p>
                <p className="mt-1 text-xs font-medium text-ink/65 dark:text-slate-300">Long-Term Retention Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs & Testimonials Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Tabs */}
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
                  {cat === "ALL" ? "All Reviews" : cat}
                </button>
              );
            })}
          </div>

          {/* Testimonials 3-Column Grid */}
          <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredTestimonials.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                        ))}
                      </div>
                      <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                        {item.category}
                      </span>
                    </div>

                    <Quote className="h-8 w-8 text-violet-200 dark:text-slate-700 mb-2" />

                    <p className="text-xs leading-relaxed text-ink/80 dark:text-slate-300 font-medium italic">
                      "{item.quote}"
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-violet-100 dark:border-slate-800 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${item.gradient} text-white font-bold text-sm shadow-xs shrink-0`}>
                      {item.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-ink dark:text-white flex items-center gap-1">
                        {item.name}
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      </h4>
                      <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-300">{item.role}, {item.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
