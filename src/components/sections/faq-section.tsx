// "use client";

// import { useState, useRef, useEffect, useCallback, useMemo } from "react";
// import Link from "next/link";
// import { HelpCircle, ChevronDown, ArrowRight, Sparkles, MessageSquare, Phone } from "lucide-react";
// import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";

// const LANDING_FAQS = [
//   {
//     id: "pod-speed",
//     q: "How fast can Clickpoint kick off a new engineering pod?",
//     a: "We can onboard and deploy a dedicated engineering pod within 3 to 5 business days following technical scope alignment.",
//     category: "Engineering",
//   },
//   {
//     id: "nda-security",
//     q: "Do you sign NDAs before initial technical discovery calls?",
//     a: "Yes. We execute a standard mutual Non-Disclosure Agreement (NDA) before reviewing proprietary code, architectures, or data models.",
//     category: "Security",
//   },
//   {
//     id: "billing-models",
//     q: "What engagement and billing models do you offer?",
//     a: "We offer both Fixed-Scope Milestone SOWs for defined deliverables and Dedicated Monthly Pods for continuous product scaling.",
//     category: "Billing",
//   },
//   {
//     id: "ip-ownership",
//     q: "Who owns the IP and source code developed by Clickpoint?",
//     a: "You retain 100% full intellectual property (IP), source code repository, and patent ownership upon project delivery.",
//     category: "IP & Legal",
//   },
//   {
//     id: "post-launch-sla",
//     q: "Do you provide post-launch maintenance & SLA support?",
//     a: "Yes. We offer 24/7 SLA monitoring, zero-downtime cloud maintenance, and ongoing feature enhancement retainers.",
//     category: "Support",
//   },
//   {
//     id: "ai-hallucinations",
//     q: "How do you prevent AI model hallucinations in production apps?",
//     a: "We implement Retrieval-Augmented Generation (RAG) with PgVector / Pinecone vector indexes, confidence evaluation guards, and deterministic fallback logic.",
//     category: "AI & LLM",
//   },
// ];

// const STACK_TOP = 80; // px top sticky offset right under navbar (navbar height ~64px-72px)
// const STACK_OFFSET = 12; // px stacked card offset
// const MAX_DEPTH = 5;

// export default function FaqSection() {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);
//   const [depths, setDepths] = useState<number[]>([]);
//   const [quickEnquiryOpen, setQuickEnquiryOpen] = useState<boolean>(false);
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

//   // Calculate sticky stacking depth
//   const measure = useCallback(() => {
//     const nodes = cardRefs.current;
//     const stuck: boolean[] = nodes.map((el, i) => {
//       if (!el) return false;
//       const rect = el.getBoundingClientRect();
//       return rect.top <= STACK_TOP + i * STACK_OFFSET + 2;
//     });

//     const next = nodes.map((_, i) => {
//       if (!stuck[i]) return 0;
//       let covering = 0;
//       for (let j = i + 1; j < nodes.length; j++) {
//         if (stuck[j]) covering++;
//         else break;
//       }
//       return Math.min(covering, MAX_DEPTH);
//     });

//     setDepths((prev) => {
//       if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
//       return next;
//     });
//   }, []);

//   useEffect(() => {
//     let raf = 0;
//     const onScroll = () => {
//       cancelAnimationFrame(raf);
//       raf = requestAnimationFrame(measure);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     measure();
//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//     };
//   }, [measure]);

//   return (
//     <section id="faq" className="relative py-20 lg:py-28 bg-cloud-100/60 border-t border-violet-100">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Section Header */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
//           <div className="max-w-2xl">
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
//               <HelpCircle className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
//               Interactive Knowledgebase
//             </div>
//             <h2 className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl">
//               Frequently Asked <span className="text-violet-600 dark:text-[#f58220]">Questions</span>
//             </h2>
//             <p className="mt-3 text-base text-ink/70 dark:text-slate-300">
//               Scroll down to watch our stacked FAQ cards settle in place as you explore answers.
//             </p>
//           </div>

//           <Link
//             href="/faqs"
//             className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-bold text-violet-600 dark:text-violet-300 transition-all hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25 shrink-0 group"
//           >
//             <span>View All FAQs</span>
//             <ArrowRight className="h-4 w-4 text-violet-600 dark:text-violet-300 group-hover:text-white" />
//           </Link>
//         </div>

//         {/* 2-Column Layout: Stacking Cards on Left + Sticky Guidance Box on Right */}
//         <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          
//           {/* Left Column: Stacking Sticky FAQ Cards */}
//           <div className="flex flex-col gap-3 relative min-w-0">
//             {LANDING_FAQS.map((faq, i) => {
//               const isOpen = openIndex === i;
//               const top = STACK_TOP + i * STACK_OFFSET;
//               const depth = depths[i] ?? 0;
//               const scale = isOpen ? 1 : 1 - depth * 0.012;
//               const liftY = isOpen ? 0 : -depth * 2;
//               const dim = isOpen ? 0 : depth * 0.03;

//               return (
//                 <div
//                   key={faq.id}
//                   className="sticky"
//                   style={{
//                     top: `${top}px`,
//                     zIndex: isOpen ? 50 : 10 + i,
//                   }}
//                 >
//                   <div
//                     ref={(el) => { cardRefs.current[i] = el; }}
//                     className={`relative rounded-2xl border transition-all duration-300 ease-out ${
//                       isOpen
//                         ? "border-violet-400 dark:border-violet-500 bg-white dark:bg-[#131c31] shadow-xl shadow-violet-950/10"
//                         : "border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] shadow-xs hover:border-violet-300 dark:hover:border-slate-700"
//                     }`}
//                     style={{
//                       transform: `translateY(${liftY}px) scale(${scale})`,
//                       transformOrigin: "top center",
//                     }}
//                   >
//                     {dim > 0 && (
//                       <div
//                         aria-hidden
//                         className="absolute inset-0 rounded-2xl bg-slate-900 pointer-events-none transition-opacity duration-300"
//                         style={{ opacity: dim }}
//                       />
//                     )}

//                     <button
//                       onClick={() => setOpenIndex(isOpen ? null : i)}
//                       className="w-full flex items-center justify-between p-5 text-left font-display text-base font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
//                     >
//                       <div className="flex items-center gap-3 pr-2">
//                         <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300 shrink-0 border border-violet-200 dark:border-slate-700">
//                           {faq.category}
//                         </span>
//                         <span className="text-ink dark:text-white">{faq.q}</span>
//                       </div>
//                       <ChevronDown
//                         className={`h-5 w-5 text-violet-600 dark:text-violet-300 shrink-0 transition-transform duration-300 ${
//                           isOpen ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     <div
//                       className={`grid relative z-10 transition-[grid-template-rows,opacity] duration-350 ease-out ${
//                         isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
//                       }`}
//                     >
//                       <div className="overflow-hidden">
//                         <div className="p-5 pt-0 text-xs leading-relaxed text-ink/75 dark:text-slate-300 border-t border-violet-100/60 dark:border-slate-800">
//                           {faq.a}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Spacer height for stacking scroll clearance */}
//             <div aria-hidden style={{ height: `${LANDING_FAQS.length * STACK_OFFSET + 30}px` }} />
//           </div>

//           {/* Right Column: Sticky Guidance Box */}
//           <aside className="sticky top-28 self-start">
//             <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-md space-y-5">
//               <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/30">
//                 <MessageSquare className="h-5 w-5" />
//               </div>

//               <div>
//                 <h3 className="font-display text-lg font-bold text-ink dark:text-white">Need personal guidance?</h3>
//                 <p className="mt-1 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
//                   Our principal engineering architects are ready to evaluate your software architecture and project scope.
//                 </p>
//               </div>

//               <div className="pt-4 border-t border-violet-100 dark:border-slate-800 space-y-2 text-xs">
//                 <a href="tel:+977981846632" className="flex items-center gap-2 font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
//                   <Phone className="h-3.5 w-3.5 text-violet-600" />
//                   <span>+977-981846632</span>
//                 </a>
//                 <p className="text-[10px] text-ink/50 uppercase tracking-wider">
//                   Hours: Sun - Fri, 9:00 AM - 6:00 PM
//                 </p>
//               </div>

//               <button
//                 onClick={() => setQuickEnquiryOpen(true)}
//                 className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors"
//               >
//                 <span>Submit Quick Enquiry</span>
//                 <ArrowRight className="h-3.5 w-3.5" />
//               </button>
//             </div>
//           </aside>

//         </div>
//       </div>

//       <QuickEnquiryModal
//         isOpen={quickEnquiryOpen}
//         onClose={() => setQuickEnquiryOpen(false)}
//       />
//     </section>
//   );
// }


"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ArrowRight, MessageSquare, Phone } from "lucide-react";
import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";
import { FaqItem } from "@/types";

const STACK_TOP = 80; // px top sticky offset right under navbar (navbar height ~64px-72px)
const STACK_OFFSET = 12; // px stacked card offset
const MAX_DEPTH = 5;

interface FaqSectionProps {
  faqs: FaqItem[];
  phone: string;
  phoneSubtext: string;
}

export default function FaqSection({ faqs, phone, phoneSubtext }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [depths, setDepths] = useState<number[]>([]);
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState<boolean>(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  }, [measure, faqs.length]);

  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-cloud-100/60 border-t border-violet-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <HelpCircle className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              Interactive Knowledgebase
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl">
              Frequently Asked <span className="text-violet-600 dark:text-[#f58220]">Questions</span>
            </h2>
            <p className="mt-3 text-base text-ink/70 dark:text-slate-300">
              Scroll down to watch our stacked FAQ cards settle in place as you explore answers.
            </p>
          </div>

          <Link
            href="/faqs"
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-bold text-violet-600 dark:text-violet-300 transition-all hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25 shrink-0 group"
          >
            <span>View All FAQs</span>
            <ArrowRight className="h-4 w-4 text-violet-600 dark:text-violet-300 group-hover:text-white" />
          </Link>
        </div>

        {/* 2-Column Layout: Stacking Cards on Left + Sticky Guidance Box on Right */}
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          
          {/* Left Column: Stacking Sticky FAQ Cards */}
          <div className="flex flex-col gap-3 relative min-w-0">
            {faqs.map((faq, i) => {
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
                        <div className="p-5 pt-0 text-xs leading-relaxed text-ink/75 dark:text-slate-300 border-t border-violet-100/60 dark:border-slate-800">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Spacer height for stacking scroll clearance */}
            <div aria-hidden style={{ height: `${faqs.length * STACK_OFFSET + 30}px` }} />
          </div>

          {/* Right Column: Sticky Guidance Box */}
          <aside className="sticky top-28 self-start">
            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-md space-y-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/30">
                <MessageSquare className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-ink dark:text-white">Need personal guidance?</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                  Our principal engineering architects are ready to evaluate your software architecture and project scope.
                </p>
              </div>

              <div className="pt-4 border-t border-violet-100 dark:border-slate-800 space-y-2 text-xs">
                <a href={telHref} className="flex items-center gap-2 font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-violet-600" />
                  <span>{phone}</span>
                </a>
                <p className="text-[10px] text-ink/50 uppercase tracking-wider">
                  {phoneSubtext}
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

      <QuickEnquiryModal
        isOpen={quickEnquiryOpen}
        onClose={() => setQuickEnquiryOpen(false)}
      />
    </section>
  );
}
