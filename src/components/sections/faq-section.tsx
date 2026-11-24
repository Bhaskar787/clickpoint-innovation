"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ArrowRight, MessageSquare, Phone } from "lucide-react";
import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";
import { FaqItem } from "@/types";

import { DEFAULT_LANDING_DATA, DEFAULT_FAQ_HEADER } from "@/data/default-landing-data";

const STACK_TOP = 80; // px top sticky offset right under navbar (navbar height ~64px-72px)
const STACK_OFFSET = 12; // px stacked card offset
const MAX_DEPTH = 5;

interface FaqSectionProps {
  initialHeader?: any;
  initialFaqs?: FaqItem[];
  faqs?: FaqItem[];
  phone?: string;
  phoneSubtext?: string;
}

export default function FaqSection({
  initialHeader,
  initialFaqs,
  faqs: propFaqs,
  phone = "+977-981846632",
  phoneSubtext = "Hours: Sun - Fri, 9:00 AM - 6:00 PM",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [depths, setDepths] = useState<number[]>([]);
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState<boolean>(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollY = useRef<number>(0);
  const lastUserOpenTime = useRef<number>(0);
  const openScrollY = useRef<number>(0);

  const [headerContent, setHeaderContent] = useState<any>(
    initialHeader || DEFAULT_LANDING_DATA.faqHeader || DEFAULT_FAQ_HEADER
  );
  const [faqsList, setFaqsList] = useState<FaqItem[]>(
    initialFaqs && initialFaqs.length > 0
      ? initialFaqs
      : propFaqs && propFaqs.length > 0
      ? propFaqs
      : []
  );

  useEffect(() => {
    async function loadDynamicFaqData() {
      try {
        if (!initialHeader) {
          const landingRes = await fetch("/api/landing");
          const landingJson = await landingRes.json();
          if (landingJson.success && landingJson.data && (landingJson.data.faqHeader || landingJson.data.faqsHeader)) {
            const h = landingJson.data.faqHeader || landingJson.data.faqsHeader;
            setHeaderContent({ ...DEFAULT_FAQ_HEADER, ...h });
          }
        }

        if ((!initialFaqs || initialFaqs.length === 0) && (!propFaqs || propFaqs.length === 0)) {
          const res = await fetch("/api/faqs");
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setFaqsList(json.data.slice(0, 6));
          }
        }
      } catch (err) {
        console.warn("Using fallback FAQs data:", err);
      }
    }

    if (!initialHeader || (!initialFaqs && !propFaqs)) {
      loadDynamicFaqData();
    }
  }, [initialHeader, initialFaqs, propFaqs]);

  // Calculate sticky stacking depth
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

  // Auto-close open accordion dropdown when it touches the navbar top while scrolling
  const checkAutoClose = useCallback(() => {
    if (typeof window === "undefined") return;

    const currentScrollY = window.scrollY;
    const prevScrollY = lastScrollY.current;
    lastScrollY.current = currentScrollY;

    if (openIndex === null) return;

    const el = cardRefs.current[openIndex];
    if (!el) return;

    const isScrollingDown = currentScrollY > prevScrollY;

    // Prevent immediate close on click micro-jitter (within 350ms and < 15px scroll)
    const timeSinceOpen = Date.now() - lastUserOpenTime.current;
    const scrollDeltaSinceOpen = currentScrollY - openScrollY.current;
    if (timeSinceOpen < 350 && scrollDeltaSinceOpen < 15) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const cardStickyTop = STACK_TOP + openIndex * STACK_OFFSET;

    const header = document.querySelector("header");
    const navbarBottom = header ? header.getBoundingClientRect().bottom : STACK_TOP;

    // Threshold where the opened card touches the navbar / reaches sticky top
    const touchesNavbar = rect.top <= Math.max(cardStickyTop + 4, navbarBottom + 12);

    if (touchesNavbar && (isScrollingDown || rect.top <= navbarBottom)) {
      setOpenIndex(null);
    }
  }, [openIndex]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        measure();
        checkAutoClose();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    checkAutoClose();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure, checkAutoClose, faqsList.length]);

  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-t border-slate-200/60 dark:border-slate-800/40 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="section-badge mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-violet-600 dark:text-violet-300">
              <HelpCircle className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              {headerContent.badge || "Interactive Knowledgebase"}
            </div>
            <h2 className="section-title text-ink dark:text-white">
              {headerContent.title}{" "}
              {headerContent.titleHighlight && (
                <span className="text-violet-600 dark:text-[#f58220]">
                  {headerContent.titleHighlight}
                </span>
              )}
            </h2>
            <p className="mt-3 section-subtitle text-ink/70 dark:text-slate-300">
              {headerContent.subtitle || "Scroll down to watch our stacked FAQ cards settle in place as you explore answers."}
            </p>
          </div>

          <Link
            href="/faqs"
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-2.5 text-fluid-sm font-bold text-violet-600 dark:text-violet-300 transition-all hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25 shrink-0 group"
          >
            <span>View All FAQs</span>
            <ArrowRight className="h-4 w-4 text-violet-600 dark:text-violet-300 group-hover:text-white" />
          </Link>
        </div>

        {/* 2-Column Layout: Stacking Cards on Left + Sticky Guidance Box on Right */}
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          
          {/* Left Column: Stacking Sticky FAQ Cards */}
          <div className="flex flex-col gap-3 relative min-w-0">
            {faqsList.map((faq, i) => {
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
                    className={`relative rounded-xl border transition-[border-color,box-shadow,background-color] duration-200 ${
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
                        className="absolute inset-0 rounded-xl bg-slate-900 pointer-events-none transition-opacity duration-300"
                        style={{ opacity: dim }}
                      />
                    )}

                    <button
                      onClick={() => {
                        if (isOpen) {
                          setOpenIndex(null);
                        } else {
                          lastUserOpenTime.current = Date.now();
                          openScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;
                          setOpenIndex(i);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-5 ${isOpen ? "pb-2.5" : ""} text-left font-display text-fluid-base font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors cursor-pointer`}
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-2.5 py-0.5 text-fluid-2xs font-bold text-violet-700 dark:text-violet-300 shrink-0 border border-violet-200 dark:border-slate-700">
                          {faq.category}
                        </span>
                        <span className="text-ink dark:text-white">{faq.question}</span>
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
                        <div className="px-5 pb-5 pt-0 card-body text-ink/75 dark:text-slate-300">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Spacer height for stacking scroll clearance */}
            <div aria-hidden style={{ height: `${faqsList.length * STACK_OFFSET + 30}px` }} />
          </div>

          {/* Right Column: Sticky Guidance Box */}
          <aside className="sticky top-28 self-start">
            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-md space-y-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/30">
                <MessageSquare className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-display text-fluid-lg font-bold text-ink dark:text-white">Need personal guidance?</h3>
                <p className="mt-1 card-body text-ink/70 dark:text-slate-300">
                  Our principal engineering architects are ready to evaluate your software architecture and project scope.
                </p>
              </div>

              <div className="pt-4 border-t border-violet-100 dark:border-slate-800 space-y-2 text-fluid-xs">
                <a href={telHref} className="flex items-center gap-2 font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-violet-600" />
                  <span>{phone}</span>
                </a>
                <p className="text-label text-ink/50">
                  {phoneSubtext}
                </p>
              </div>

              <button
                onClick={() => setQuickEnquiryOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-fluid-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors"
              >
                <span>Submit Quick Enquiry</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </aside>

        </div>
      </div>

      <QuickEnquiryModal
        isOpen={quickEnquiryOpen}
        onClose={() => setQuickEnquiryOpen(false)}
      />
    </section>
  );
}
