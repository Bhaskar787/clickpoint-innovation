"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { ContactPageContent } from "@/types";
import { DEFAULT_CONTACT_PAGE_DATA } from "@/data/default-contact-data";
import { broadcastNotification } from "@/lib/realtime-notifications";

interface ContactClientViewProps {
  initialContent: ContactPageContent;
}

export default function ContactClientView({ initialContent }: ContactClientViewProps) {
  const content = initialContent || DEFAULT_CONTACT_PAGE_DATA;

  const hero = content.hero || DEFAULT_CONTACT_PAGE_DATA.hero;
  const contactInfo = content.contactInfo || DEFAULT_CONTACT_PAGE_DATA.contactInfo;
  const formFields = content.formFields || DEFAULT_CONTACT_PAGE_DATA.formFields;

  // Clean objectives from database or fallback, filtering out any raw placeholder
  const rawObjectives =
    formFields.serviceOptions && formFields.serviceOptions.length > 0
      ? formFields.serviceOptions
      : DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions;

  const OBJECTIVES = Array.from(
    new Set(
      rawObjectives.filter((o) => Boolean(o && o.trim() && o.trim() !== "New Primary Objective"))
    )
  );
  if (OBJECTIVES.length === 0) {
    OBJECTIVES.push(
      "AI Copilot & Autonomous Pods",
      "Headless Next.js Web Platform",
      "Cross-Platform iOS & Android App",
      "UI/UX Design System",
      "Cloud Infrastructure & DevOps"
    );
  }

  const [selectedObjective, setSelectedObjective] = useState<string>(OBJECTIVES[0] || "AI Copilot & Autonomous Pods");
  const [customConcept, setCustomConcept] = useState<string>("");
  const [currency, setCurrency] = useState<"USD" | "NPR">(formFields.defaultCurrency || "USD");
  const [budget, setBudget] = useState<string>("");
  const [submittedDetails, setSubmittedDetails] = useState<{ service: string; budget: string } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const telHref = `tel:${(contactInfo.phone || "").replace(/[^+\d]/g, "")}`;
  const mailHref = `mailto:${contactInfo.email || ""}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill out your Name, Work Email, Contact Phone Number, and Message before submitting.");
      return;
    }

    // 1. Resolve final service / objective
    let finalService = selectedObjective;
    if (selectedObjective === "CUSTOM" || !selectedObjective) {
      if (!customConcept.trim()) {
        toast.error("Please enter your custom project objective or concept.");
        return;
      }
      finalService = customConcept.trim();
    } else if (customConcept.trim()) {
      finalService = `${selectedObjective}: ${customConcept.trim()}`;
    }

    // 2. Resolve final budget (in selective USD $ or NPR)
    let finalBudget = budget.trim();
    if (!finalBudget) {
      toast.error(`Please enter your target budget or investment (in ${currency}).`);
      return;
    }

    if (currency === "USD") {
      if (!finalBudget.startsWith("$") && !finalBudget.toUpperCase().startsWith("USD")) {
        finalBudget = `$${finalBudget}`;
      }
    } else {
      if (!finalBudget.toUpperCase().startsWith("NPR") && !finalBudget.startsWith("रू")) {
        finalBudget = `NPR ${finalBudget}`;
      }
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Sending your message to engineering team...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          service: finalService,
          budget: finalBudget,
          message,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        localStorage.setItem("clickpoint_last_contact_time", Date.now().toString());
        toast.success(
          json.message || "Message Sent Successfully! Our engineering team will contact you shortly.",
          { id: toastId, duration: 6000 }
        );
        setSubmittedDetails({ service: finalService, budget: finalBudget });
        setFormSubmitted(true);

        broadcastNotification({
          id: json.data?.id || `contact-${Date.now()}`,
          type: "CONTACT",
          category: "CONTACT",
          title: "Contact Lead Inquiry",
          clientName: name.trim(),
          email: email.trim(),
          subtext: finalService ? `${finalService} (${finalBudget || ""})` : email.trim(),
          content: message.trim(),
          createdAt: new Date().toISOString(),
          targetTab: "contact-page",
        });
      } else {
        toast.error(json.error || "Failed to send message.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative bg-background text-ink">
      <Navbar />

      {/* Hero Header */}
      <section className="overflow-hidden pt-32 pb-8 lg:pt-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* LEFT-ALIGNED BREADCRUMB ROUTE */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Contact</span>
          </div>

          {/* CENTER-ALIGNED HERO CONTENT */}
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-violet-50 dark:bg-white/[0.04] border border-violet-200/80 dark:border-white/[0.08] text-violet-600 dark:text-violet-300 text-[12px] font-semibold uppercase tracking-[0.06em] shadow-xs">
              <Mail className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{hero.badge || "Get In Touch"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {hero.title ? (
                <>
                  {hero.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {hero.title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  Let’s Build Something Amazing{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    Together
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium pt-1">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Contact Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid min-w-0 items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            
            {/* Left Column: Interactive Project Inquiry Form */}
            <div className="min-w-0 w-full rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-5 sm:p-7 lg:p-10 shadow-xs">
              {!formSubmitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-ink dark:text-white break-words">
                      {hero.formTitle}
                    </h3>
                    <p className="mt-1 text-xs text-ink/65 dark:text-slate-300 break-words">
                      {hero.formSubtitle}
                    </p>
                  </div>

                  {/* 1. Select Primary Objective */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-slate-300">
                        1. Select Primary Objective *
                      </label>
                      <span className="text-[11px] font-medium text-violet-600 dark:text-violet-400">
                        Select an option or write your own concept
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Objective Selective Dropdown */}
                      <div className="relative">
                        <select
                          value={selectedObjective}
                          onChange={(e) => setSelectedObjective(e.target.value)}
                          className="w-full appearance-none rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-cloud-100/50 dark:bg-slate-800/80 px-3.5 py-3 pr-10 text-xs font-semibold text-ink dark:text-white focus:border-violet-600 focus:outline-hidden focus:ring-1 focus:ring-violet-600/30 cursor-pointer shadow-xs transition-colors"
                        >
                          {OBJECTIVES.map((obj) => (
                            <option key={obj} value={obj} className="dark:bg-slate-800 dark:text-white">
                              {obj}
                            </option>
                          ))}
                          <option value="CUSTOM" className="dark:bg-slate-800 dark:text-violet-300 font-bold">
                            Write Own Concept / Custom Objective
                          </option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      </div>

                      {/* Write Own Concept Input - Auto-selects custom mode on typing */}
                      <div>
                        <input
                          type="text"
                          value={customConcept}
                          onChange={(e) => {
                            setCustomConcept(e.target.value);
                            if (e.target.value.trim() && selectedObjective !== "CUSTOM") {
                              setSelectedObjective("CUSTOM");
                            }
                          }}
                          required={selectedObjective === "CUSTOM"}
                          placeholder={
                            selectedObjective === "CUSTOM"
                              ? "Write your own project concept or objective in detail"
                              : "Write your own concept or specific project focus"
                          }
                          className={`w-full rounded-sm border px-3.5 py-2.5 text-xs font-normal text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-violet-600/30 transition-all ${
                            selectedObjective === "CUSTOM"
                              ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/30 ring-1 ring-violet-500/20"
                              : "border-slate-200/80 dark:border-white/[0.08] bg-cloud-100/50 dark:bg-slate-800/80 focus:border-violet-600"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Target Investment / Budget Range */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-slate-300">
                        {formFields.budgetTitle || "2. Target Investment / Budget Range *"}
                      </label>

                      {/* Selective Currency Switcher: USD ($) vs NPR */}
                      <div className="inline-flex items-center rounded-xs bg-cloud-100/90 dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setCurrency("USD")}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
                            currency === "USD"
                              ? "bg-violet-600 text-white shadow-xs"
                              : "text-ink/65 dark:text-slate-400 hover:text-ink dark:hover:text-white"
                          }`}
                        >
                          USD ($)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrency("NPR")}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
                            currency === "NPR"
                              ? "bg-violet-600 text-white shadow-xs"
                              : "text-ink/65 dark:text-slate-400 hover:text-ink dark:hover:text-white"
                          }`}
                        >
                          NPR (NP)
                        </button>
                      </div>
                    </div>

                    <div className="relative flex items-center">
                      <div className="pointer-events-none absolute left-3.5 flex items-center select-none">
                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                          {currency === "USD" ? "$" : "NPR"}
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder={
                          currency === "USD"
                            ? "e.g. 10,000 – 25,000 or 50,000"
                            : "e.g. 500,000 – 1,500,000 or 2,500,000"
                        }
                        className={`w-full rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-cloud-100/50 dark:bg-slate-800/80 py-2.5 pr-3.5 text-xs font-normal text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-600 focus:outline-hidden focus:ring-1 focus:ring-violet-600/30 transition-colors ${
                          currency === "USD" ? "pl-9" : "pl-14"
                        }`}
                      />
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Full Name *"
                          className="w-full rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-cloud-100/50 dark:bg-slate-800/80 p-3 text-xs font-normal text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-600 focus:outline-hidden focus:ring-1 focus:ring-violet-600/30"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Work Email Address *"
                          className="w-full rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-cloud-100/50 dark:bg-slate-800/80 p-3 text-xs font-normal text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-600 focus:outline-hidden focus:ring-1 focus:ring-violet-600/30"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone / WhatsApp (+977 / +44 / +1) *"
                          className="w-full rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-cloud-100/50 dark:bg-slate-800/80 p-3 text-xs font-normal text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-600 focus:outline-hidden focus:ring-1 focus:ring-violet-600/30"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Company / Startup Name"
                          className="w-full rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-cloud-100/50 dark:bg-slate-800/80 p-3 text-xs font-normal text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-600 focus:outline-hidden focus:ring-1 focus:ring-violet-600/30"
                        />
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your project requirements, tech stack preferences, or target launch timeline..."
                        className="w-full rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-cloud-100/50 dark:bg-slate-800/80 p-3 text-xs font-normal text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-600 focus:outline-hidden focus:ring-1 focus:ring-violet-600/30"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} variant="primary" size="lg" className="w-full rounded-sm shadow-xs font-semibold cursor-pointer">
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                    {isSubmitting ? "Sending..." : hero.submitButtonText}
                  </Button>
                </form>
              ) : (
                <div className="py-12 sm:py-16 text-center space-y-5 px-2">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-white break-words">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm max-w-md mx-auto text-ink/75 dark:text-slate-300 leading-relaxed break-words">
                    Thank you for reaching out. Our principal engineering architect has received your inquiry for{" "}
                    <span className="font-bold text-violet-700 dark:text-violet-300">
                      {submittedDetails?.service || selectedObjective}
                    </span>{" "}
                    with estimated investment of{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {submittedDetails?.budget || budget}
                    </span>{" "}
                    and will respond to your email within{" "}
                    <span className="font-bold text-violet-700 dark:text-violet-300">2 hours</span>.
                  </p>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setName("");
                      setEmail("");
                      setPhone("");
                      setCompany("");
                      setMessage("");
                      setCustomConcept("");
                      setBudget("");
                      setCurrency(formFields.defaultCurrency || "USD");
                      setSubmittedDetails(null);
                      setFormSubmitted(false);
                    }}
                    className="mt-4 border-violet-200 dark:border-slate-700 text-ink dark:text-slate-200 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Hanging Global Engineering Hubs & Direct Channels */}
            <div className="sticky top-24 z-10 min-w-0 self-start space-y-8">
              
              {/* Office / HQ Card */}
              <div className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-5 sm:p-7 shadow-xs transition-all hover:border-slate-300 dark:hover:border-white/[0.16]">
                <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5 sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700 font-bold shadow-xs">
                    <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-ink dark:text-white break-words">{contactInfo.address}</h3>
                    <p className="text-xs font-semibold text-violet-600 dark:text-violet-300 break-words">{contactInfo.addressSubtext}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-ink/80 dark:text-slate-300">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                    <span className="break-words">{contactInfo.address}</span>
                  </div>
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Phone className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                    <a href={telHref} className="break-all hover:text-violet-600 dark:hover:text-violet-300 font-bold transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Mail className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                    <a href={mailHref} className="break-all hover:text-violet-600 dark:hover:text-violet-300 font-medium transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Clock className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                    <span className="break-words">{contactInfo.hours}</span>
                  </div>
                </div>
              </div>

              {/* Direct Channels Box */}
              <div className="rounded-md border border-slate-200/80 dark:border-white/[0.08] bg-gradient-to-br from-[#1b4397] via-[#153880] to-[#0e2764] p-5 sm:p-7 text-white shadow-xs">
                <h4 className="font-display text-lg font-bold text-white mb-2 break-words">
                  {contactInfo.directChannelsTitle || "Direct Executive Email Channels"}
                </h4>
                <p className="text-xs text-violet-200/80 leading-relaxed mb-4 break-words">
                  {contactInfo.directChannelsSubtitle || "For urgent technical RFPs or enterprise partnership inquiries:"}
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex flex-col gap-1 py-1.5 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <span className="shrink-0 text-violet-300">Client Inquiries</span>
                    <a href={mailHref} className="font-mono text-white font-bold hover:underline break-all sm:text-right">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex flex-col gap-1 py-1.5 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <span className="shrink-0 text-violet-300">Direct Contact</span>
                    <a href={telHref} className="font-mono text-white font-bold hover:underline break-all sm:text-right">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex flex-col gap-1 py-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="shrink-0 text-violet-300">Working Hours</span>
                    <span className="font-mono text-white font-bold break-words sm:text-right">
                      {contactInfo.hours}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Landscape Google Location Map Section */}
      <section className="overflow-hidden py-16 lg:py-24 bg-cloud-100/70 dark:bg-slate-900/40 border-t border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl min-w-0 text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-violet-50 dark:bg-white/[0.04] border border-violet-200/80 dark:border-white/[0.08] text-violet-600 dark:text-violet-300 text-[12px] font-semibold uppercase tracking-[0.06em] shadow-xs">
              <MapPin className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{contactInfo.mapBadge || "Visit Our Headquarters"}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {contactInfo.mapTitle ? (
                <>
                  {contactInfo.mapTitle.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    {contactInfo.mapTitle.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  Locate Click Point{" "}
                  <span className="text-violet-600 dark:text-orange-500">
                    Innovations
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
              {contactInfo.mapSubtitle || `${contactInfo.address} — ${contactInfo.hours}`}
            </p>
          </div>

          {/* Landscape Embedded Google Map */}
          <div className="overflow-hidden rounded-lg border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131c31] p-1.5 shadow-md">
            <iframe
              src={contactInfo.mapUrl || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapUrl}
              width="100%"
              height="480"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Click Point Innovations Location Map"
              className="w-full h-[420px] sm:h-[480px] lg:h-[520px] rounded-md"
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