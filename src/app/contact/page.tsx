"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Building2,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";

const OBJECTIVES = [
  "AI Integration & LLM Copilot",
  "Web Application Engineering",
  "Mobile App Development",
  "Cloud & DevOps Architecture",
  "Security & Compliance Audit",
  "Other Strategic Growth",
];

const BUDGET_RANGES = [
  "NPR 5L - 15L ($5k - $15k)",
  "NPR 15L - 35L ($15k - $35k)",
  "NPR 35L - 75L ($35k - $75k)",
  "NPR 75L+ ($75k+ Enterprise)",
];

const FAQS = [
  {
    q: "How fast can Clickpoint kick off a new engineering pod?",
    a: "We can onboard and deploy a dedicated engineering pod within 3 to 5 business days following technical scope alignment.",
  },
  {
    q: "Do you sign NDAs before initial technical discovery calls?",
    a: "Yes. We execute a standard mutual Non-Disclosure Agreement (NDA) before reviewing proprietary code, architectures, or data models.",
  },
  {
    q: "What engagement and billing models do you offer?",
    a: "We offer both Fixed-Scope Milestone SOWs for defined deliverables and Dedicated Monthly Pods for continuous product scaling.",
  },
  {
    q: "Who owns the IP and source code developed by Clickpoint?",
    a: "You retain 100% full intellectual property (IP), source code repository, and patent ownership upon project delivery.",
  },
  {
    q: "Do you provide post-launch maintenance & SLA support?",
    a: "Yes. We offer 24/7 SLA monitoring, zero-downtime cloud maintenance, and ongoing feature enhancement retainers.",
  },
];

export default function ContactPage() {
  const [selectedObjective, setSelectedObjective] = useState<string>("AI Integration & LLM Copilot");
  const [selectedBudget, setSelectedBudget] = useState<string>("NPR 15L - 35L ($15k - $35k)");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="relative bg-background text-ink">
      <Navbar />

      {/* Main Interactive Contact Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 items-start">
            
            {/* Left Column: Interactive Project Inquiry Form */}
            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 sm:p-10 shadow-xl shadow-violet-950/[0.04]">
              {!formSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink dark:text-white">
                      Start Your Project Discovery
                    </h3>
                    <p className="mt-1 text-xs text-ink/65 dark:text-slate-300">
                      Fill out the form below to receive a custom proposal and technical breakdown.
                    </p>
                  </div>

                  {/* Objective Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-3">
                      1. Select Primary Objective *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {OBJECTIVES.map((obj) => {
                        const isSelected = selectedObjective === obj;
                        return (
                          <button
                            type="button"
                            key={obj}
                            onClick={() => setSelectedObjective(obj)}
                            className={`rounded-xl p-3 text-xs font-bold text-left transition-all duration-200 border ${
                              isSelected
                                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/25"
                                : "bg-cloud-100/60 text-ink/75 border-violet-100 hover:bg-violet-50 hover:text-violet-700 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                            }`}
                          >
                            {obj}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-3">
                      2. Target Investment / Budget Range *
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {BUDGET_RANGES.map((b) => {
                        const isSelected = selectedBudget === b;
                        return (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setSelectedBudget(b)}
                            className={`rounded-xl p-3 text-xs font-bold text-center transition-all duration-200 border ${
                              isSelected
                                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/25"
                                : "bg-cloud-100/60 text-ink/75 border-violet-100 hover:bg-violet-50 hover:text-violet-700 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Inputs */}
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400">
                      3. Your Contact & Company Details *
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name *"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          placeholder="Work Email Address *"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input
                          type="tel"
                          placeholder="Phone / WhatsApp (+977 / +44 / +1)"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Company / Startup Name"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us about your project requirements, tech stack preferences, or target launch timeline..."
                        className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg shadow-violet-600/30 font-bold">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Project Inquiry
                  </Button>
                </form>
              ) : (
                <div className="py-16 text-center space-y-5">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="font-display text-3xl font-bold text-ink dark:text-white">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm max-w-md mx-auto text-ink/75 dark:text-slate-300 leading-relaxed">
                    Thank you for reaching out. Our principal engineering architect has received your RFP for <span className="font-bold text-violet-700 dark:text-violet-300">{selectedObjective}</span> and will respond to your email within <span className="font-bold text-violet-700 dark:text-violet-300">2 hours</span>.
                  </p>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 border-violet-200 dark:border-slate-700 text-ink dark:text-slate-200"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Hanging Global Engineering Hubs & Direct Channels */}
            <div className="sticky top-24 self-start space-y-8">
              
              {/* Kathmandu Hub Card */}
              <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 pb-4 border-b border-violet-100 dark:border-slate-800 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700 font-bold shadow-md">
                    <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink dark:text-white">Nepal Engineering HQ</h3>
                    <p className="text-xs font-semibold text-violet-600 dark:text-violet-300">South Asia Operations</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-ink/80 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                    <span>New Baneshwor, Kathmandu, Nepal</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0" />
                    <a href="tel:+977981846632" className="hover:text-violet-600 dark:hover:text-violet-300 font-bold transition-colors">
                      +977-981846632
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0" />
                    <a href="mailto:info@clickpoint.com.np" className="hover:text-violet-600 dark:hover:text-violet-300 font-medium transition-colors">
                      info@clickpoint.com.np
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0" />
                    <span>Sun - Fri: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>

              {/* London Hub Card */}
              {/* <div className="rounded-3xl border border-violet-100 bg-white p-7 shadow-md transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 pb-4 border-b border-violet-100 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-md shadow-amber-500/25">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">UK & European Hub</h3>
                    <p className="text-xs font-semibold text-amber-600">London Operations</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-ink/80">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Suit T, 1st Floor St. George House, 2-4 Eastern Road, Romford, RM1 3PJ, ENGLAND</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-amber-600 shrink-0" />
                    <a href="tel:+447577078315" className="hover:text-amber-600 font-bold transition-colors">
                      +44 7577 078315
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-amber-600 shrink-0" />
                    <a href="mailto:info@clickpoint.com.np" className="hover:text-amber-600 font-medium transition-colors">
                      info@clickpoint.com.np
                    </a>
                  </div>
                </div>
              </div> */}

              {/* Direct Channels Box */}
              <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-[#1b4397] via-[#153880] to-[#0e2764] p-7 text-white shadow-xl">
                <h4 className="font-display text-lg font-bold text-white mb-2">
                  Direct Executive Email Channels
                </h4>
                <p className="text-xs text-violet-200/80 leading-relaxed mb-4">
                  For urgent technical RFPs or enterprise partnership inquiries:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-violet-300">Client Inquiries</span>
                    <a href="mailto:info@clickpoint.com.np" className="font-mono text-white font-bold hover:underline">
                      info@clickpoint.com.np
                    </a>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-violet-300">Direct Contact</span>
                    <a href="tel:+977981846632" className="font-mono text-white font-bold hover:underline">
                      +977-981846632
                    </a>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-violet-300">Working Hours</span>
                    <span className="font-mono text-white font-bold">
                      Sun - Fri: 9am - 6pm
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Landscape Google Location Map Section */}
      <section className="py-16 lg:py-24 bg-cloud-100/70 border-t border-violet-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-700">
              <MapPin className="h-3.5 w-3.5 text-violet-600" />
              Visit Our Headquarters
            </div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
              Locate <span className="text-violet-600">Click Point Innovations</span>
            </h2>
            <p className="mt-3 text-base text-ink/75">
              New Baneshwor, Kathmandu, Nepal — Open Sunday to Friday, 9:00 AM to 6:00 PM NPT.
            </p>
          </div>

          {/* Landscape Embedded Google Map */}
          <div className="overflow-hidden rounded-3xl border border-violet-200 bg-white p-2.5 shadow-2xl shadow-violet-950/[0.06]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7546660227695!2d85.33441117613393!3d27.6939765260798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb197b40492713%3A0x8337c2e6d49f6a04!2sClick%20Point%20Innovations%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1785317143002!5m2!1sen!2snp"
              width="100%"
              height="480"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Click Point Innovations Location Map"
              className="w-full h-[420px] sm:h-[480px] lg:h-[520px] rounded-2xl"
            />
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
