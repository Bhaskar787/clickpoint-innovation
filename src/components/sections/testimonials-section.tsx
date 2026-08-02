"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight, Quote, MessageSquare, CheckCircle2 } from "lucide-react";

const FEATURED_TESTIMONIALS = [
  {
    id: 1,
    quote: "Clickpoint's AI engineering team transformed our legacy financial audit pipeline into a real-time autonomous agent pod. Our daily processing volume jumped from $4M to $42M+ with zero downtime.",
    name: "Rajesh Verma",
    role: "VP of Product Engineering",
    company: "Khataflow Inc.",
    industry: "Fintech",
    rating: 5,
    gradient: "from-violet-600 to-indigo-700",
  },
  {
    id: 2,
    quote: "The headless e-commerce build and AI visual search feature engineered by Clickpoint delivered an immediate +34% lift in checkout conversions. Their technical speed is unmatched.",
    name: "Claire Bennett",
    role: "Chief Product Officer",
    company: "Caratlane Global",
    industry: "E-Commerce",
    rating: 5,
    gradient: "from-amber-500 to-rose-600",
  },
  {
    id: 3,
    quote: "HIPAA compliance and clinical accuracy were critical for our platform. Clickpoint delivered an automated AI claims engine achieving 99.8% accuracy and cutting adjudication cycles by 3.5x.",
    name: "Dr. Evelyn Vance",
    role: "Head of Digital Health Solutions",
    company: "MediPulse Health",
    industry: "Healthcare",
    rating: 5,
    gradient: "from-emerald-600 to-teal-700",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-20 lg:py-28 bg-cloud-100/70 border-t border-violet-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <MessageSquare className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              Client Success & Endorsements
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink dark:text-white">
              Trusted by tech leaders <span className="text-violet-600 dark:text-[#f58220]">worldwide</span>
            </h2>
            <p className="mt-3 text-xs sm:text-base text-ink/70 dark:text-slate-300">
              See how our AI & software engineering pods drive measurable ROI for startups and enterprise platforms.
            </p>
          </div>

          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-bold text-violet-600 dark:text-violet-300 transition-all hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25 shrink-0"
          >
            <span>Explore All Testimonials</span>
            <ArrowRight className="h-4 w-4 text-violet-600 dark:text-violet-300 group-hover:text-white" />
          </Link>
        </div>

        {/* Testimonials 3-Column Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURED_TESTIMONIALS.map((item, idx) => (
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
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                    {item.industry}
                  </span>
                </div>

                <Quote className="h-8 w-8 text-violet-200 dark:text-slate-700 mb-2" />

                <p className="text-xs leading-relaxed text-ink/80 dark:text-slate-300 font-medium italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-violet-100 dark:border-slate-800 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${item.gradient} text-white font-bold text-sm shadow-xs shrink-0`}>
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
        </div>

      </div>
    </section>
  );
}
