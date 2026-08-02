"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Phone,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";

const ALL_FAQS = [
  {
    id: "pod-speed",
    q: "How fast can Clickpoint kick off a new engineering pod?",
    a: "We can onboard and deploy a dedicated engineering pod within 3 to 5 business days following technical scope alignment.",
    category: "Engineering & Stack",
  },
  {
    id: "nda-security",
    q: "Do you sign NDAs before initial technical discovery calls?",
    a: "Yes. We execute a standard mutual Non-Disclosure Agreement (NDA) before reviewing proprietary code, architectures, or data models.",
    category: "Security & NDAs",
  },
  {
    id: "billing-models",
    q: "What engagement and billing models do you offer?",
    a: "We offer both Fixed-Scope Milestone SOWs for defined deliverables and Dedicated Monthly Pods for continuous product scaling.",
    category: "Pricing & Billing Models",
  },
  {
    id: "ip-ownership",
    q: "Who owns the IP and source code developed by Clickpoint?",
    a: "You retain 100% full intellectual property (IP), source code repository, and patent ownership upon project delivery.",
    category: "Security & NDAs",
  },
  {
    id: "post-launch-sla",
    q: "Do you provide post-launch maintenance & SLA support?",
    a: "Yes. We offer 24/7 SLA monitoring, zero-downtime cloud maintenance, and ongoing feature enhancement retainers.",
    category: "Support & Maintenance",
  },
  {
    id: "ai-hallucinations",
    q: "How do you prevent AI model hallucinations in production apps?",
    a: "We implement Retrieval-Augmented Generation (RAG) with PgVector / Pinecone vector indexes, confidence score evaluation guards, and deterministic fallback logic.",
    category: "AI Integration & Copilots",
  },
  {
    id: "tech-stack-flexibility",
    q: "Can Clickpoint work with our existing codebase and cloud infrastructure?",
    a: "Absolutely. Our engineers specialize in React, Next.js, Node.js, Python, PostgreSQL, AWS, GCP, and Kubernetes integrations.",
    category: "Engineering & Stack",
  },
  {
    id: "hipaa-pci-compliance",
    q: "Are your software engineering practices HIPAA and PCI-DSS compliant?",
    a: "Yes. We design zero-trust data architectures with end-to-end encryption, automated security vulnerability scanning, and tenant data isolation.",
    category: "Security & NDAs",
  },
  {
    id: "team-timezones",
    q: "How do you handle team communication across timezones?",
    a: "We operate distributed delivery hubs across 3 timezones (US, Europe, APAC) providing continuous 24/7 engineering coverage with daily Slack and GitHub updates.",
    category: "Support & Maintenance",
  },
  {
    id: "fixed-price-guarantee",
    q: "Are there any hidden fees in Fixed-Scope SOW contracts?",
    a: "No. Our Fixed-Scope SOW contracts include clear milestone deliverables, sprint schedules, and guaranteed cost caps with zero surprise fees.",
    category: "Pricing & Billing Models",
  },
  {
    id: "llm-fine-tuning",
    q: "Do you fine-tune open-source AI models (Llama 3 / Mistral) for enterprise clients?",
    a: "Yes. We fine-tune custom open-source models using LoRA / QLoRA on domain datasets to achieve enterprise privacy and domain accuracy.",
    category: "AI Integration & Copilots",
  },
  {
    id: "code-quality-audits",
    q: "Do you provide code quality and security audit reviews for existing apps?",
    a: "Yes. Our senior architects perform comprehensive code reviews, performance bottleneck analysis, and security vulnerability audits.",
    category: "Engineering & Stack",
  },
];

const CATEGORIES = ["ALL", "AI Integration & Copilots", "Engineering & Stack", "Pricing & Billing Models", "Security & NDAs", "Support & Maintenance"];

const STACK_TOP = 80;
const STACK_OFFSET = 12;
const MAX_DEPTH = 5;

export default function FaqsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState<boolean>(false);
  const [depths, setDepths] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((faq) => {
      const matchesCategory = activeCategory === "ALL" || faq.category === activeCategory;
      const matchesSearch =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Calculate sticky card depth dynamically based on scroll position
  const measure = useCallback(() => {
    const nodes = cardRefs.current;
    const stuck: boolean[] = nodes.map((el, i) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= STACK_TOP + i * STACK_OFFSET + 2;
    });

    const next = nodes.map((_, i) => {
      if (!stuck[i]) return 0;
      let covering = 0;
      for (let j = i + 1; j < nodes.length; j++) {
        if (stuck[j]) covering++;
        else break;
      }
      return Math.min(covering, MAX_DEPTH);
    });

    setDepths((prev) => {
      if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
      return next;
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure, filteredFaqs.length]);

  return (
    <main className="relative bg-background text-ink">
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
            <span className="text-violet-600 dark:text-violet-300 font-bold">Help Center & FAQs</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs">
              <HelpCircle className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>Interactive Help Center</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              Frequently Asked{" "}
              <span className="text-[#1b4397] dark:text-[#f58220]">
                Questions
              </span>
            </h1>

            <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-ink/75 sm:text-xl">
              Scroll down to watch our stacked cards depth effect as you find answers to engineering, AI, security, and pricing models.
            </p>

            {/* Live Search Input Box */}
            <div className="relative mt-8 mx-auto max-w-md">
              <input
                type="text"
                placeholder="Search questions by keyword, topic, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-11 pr-4 text-sm font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 shadow-sm transition-all focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs & FAQ Accordion Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter Tabs */}
          <div className="mb-14 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(0);
                  }}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                      : "bg-cloud-100 text-ink/75 hover:bg-violet-50 hover:text-violet-700 border border-violet-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white dark:border-slate-700"
                  }`}
                >
                  {cat === "ALL" ? "All FAQs" : cat}
                </button>
              );
            })}
          </div>

          {/* 2-Column Grid: Stacking Sticky Cards on Left + Sticky Assistance Card on Right */}
          <div className="grid md:grid-cols-[1fr_320px] gap-8 sm:gap-10 items-start">
            
            {/* Left Column: Stacking Sticky Cards */}
            <div className="flex flex-col gap-3 relative min-w-0">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, i) => {
                  const isOpen = openIndex === i;
                  const top = STACK_TOP + i * STACK_OFFSET;
                  const depth = depths[i] ?? 0;
                  const scale = isOpen ? 1 : 1 - depth * 0.012;
                  const liftY = isOpen ? 0 : -depth * 2;
                  const dim = isOpen ? 0 : depth * 0.03;

                  return (
                    <div
                      key={faq.id}
                      className="sticky"
                      style={{
                        top: `${top}px`,
                        zIndex: isOpen ? 50 : 10 + i,
                      }}
                    >
                      <div
                        ref={(el) => { cardRefs.current[i] = el; }}
                        className={`relative rounded-2xl border transition-all duration-300 ease-out ${
                          isOpen
                            ? "border-violet-400 dark:border-violet-500 bg-white dark:bg-[#131c31] shadow-xl shadow-violet-950/10"
                            : "border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] shadow-xs hover:border-violet-300 dark:hover:border-slate-700"
                        }`}
                        style={{
                          transform: `translateY(${liftY}px) scale(${scale})`,
                          transformOrigin: "top center",
                        }}
                      >
                        {dim > 0 && (
                          <div
                            aria-hidden
                            className="absolute inset-0 rounded-2xl bg-slate-900 pointer-events-none transition-opacity duration-300"
                            style={{ opacity: dim }}
                          />
                        )}

                        <button
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                          className="w-full flex items-center justify-between p-5 text-left font-display text-base font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 pr-2">
                            <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300 shrink-0 border border-violet-200 dark:border-slate-700">
                              {faq.category}
                            </span>
                            <span className="text-ink dark:text-white font-bold">{faq.q}</span>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-violet-600 dark:text-violet-300 shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <div
                          className={`grid relative z-10 transition-[grid-template-rows,opacity] duration-350 ease-out ${
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-5 pt-0 text-xs leading-relaxed text-ink/75 dark:text-slate-300 border-t border-violet-100/60 dark:border-slate-800">
                              {faq.a}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white dark:bg-[#131c31] rounded-3xl border border-violet-100 dark:border-slate-800">
                  <p className="text-base font-semibold text-ink/60 dark:text-slate-300">No FAQs match your search query.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("ALL");
                    }}
                    className="mt-3 text-xs font-bold text-violet-700 dark:text-violet-300 underline"
                  >
                    Reset search & view all questions
                  </button>
                </div>
              )}

              {/* Stacking depth scroll space */}
              <div aria-hidden style={{ height: `${Math.max(filteredFaqs.length * STACK_OFFSET + 30, 60)}px` }} />
            </div>

            {/* Right Column: Sticky Assistance Panel */}
            <aside className="sticky top-28 self-start">
              <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-md space-y-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/30">
                  <MessageSquare className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-ink dark:text-white">Need technical guidance?</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                    Our lead architects and engineers are available to answer specific technical, architectural, or SLA questions.
                  </p>
                </div>

                <div className="pt-4 border-t border-violet-100 dark:border-slate-800 space-y-2 text-xs">
                  <a href="tel:+977981846632" className="flex items-center gap-2 font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
                    <Phone className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                    <span>+977-981846632</span>
                  </a>
                  <p className="text-[10px] text-ink/50 dark:text-slate-400 uppercase tracking-wider">
                    Available Sun-Fri, 9am - 6pm NPT
                  </p>
                </div>

                <button
                  onClick={() => setQuickEnquiryOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors"
                >
                  <span>Submit Quick Enquiry</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* Quick Enquiry Modal Popup */}
      <QuickEnquiryModal
        isOpen={quickEnquiryOpen}
        onClose={() => setQuickEnquiryOpen(false)}
      />

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
