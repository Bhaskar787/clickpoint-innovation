"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Loader2,
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

  const OBJECTIVES =
    formFields.serviceOptions && formFields.serviceOptions.length > 0
      ? formFields.serviceOptions
      : DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions;

  const BUDGET_RANGES =
    formFields.budgetOptions && formFields.budgetOptions.length > 0
      ? formFields.budgetOptions
      : DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions;

  const [selectedObjective, setSelectedObjective] = useState<string>(OBJECTIVES[0]);
  const [selectedBudget, setSelectedBudget] = useState<string>(BUDGET_RANGES[0]);
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

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill out your Name, Email, and Message before submitting.");
      return;
    }

    // 10-second rate limit check (10,000 ms)
    const TEN_SECONDS_MS = 10 * 1000;
    const lastSubmission = localStorage.getItem("clickpoint_last_contact_time");

    if (lastSubmission) {
      const elapsed = Date.now() - parseInt(lastSubmission, 10);
      if (elapsed < TEN_SECONDS_MS) {
        const secondsRemaining = Math.ceil((TEN_SECONDS_MS - elapsed) / 1000);
        toast.error(`Rate limit active: Please wait ${secondsRemaining} second(s) before sending another inquiry.`);
        return;
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
          service: selectedObjective,
          budget: selectedBudget,
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
        setFormSubmitted(true);

        broadcastNotification({
          id: json.data?.id || `contact-${Date.now()}`,
          type: "CONTACT",
          category: "CONTACT",
          title: "Contact Lead Inquiry",
          clientName: name.trim(),
          email: email.trim(),
          subtext: selectedObjective ? `${selectedObjective} (${selectedBudget || ""})` : email.trim(),
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
      <section className="overflow-hidden pt-28 pb-8 lg:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl min-w-0 text-center">
            <div className="mb-3 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] sm:px-3.5 sm:text-xs font-semibold uppercase tracking-widest text-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-300" />
              <span className="break-words">{hero.badge}</span>
            </div>
            <h1 className="font-display text-[1.65rem] leading-tight min-[400px]:text-2xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl break-words">
              {hero.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-ink/75 dark:text-slate-300 break-words">
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
            <div className="min-w-0 w-full rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-5 sm:p-7 lg:p-10 shadow-xl shadow-violet-950/[0.04]">
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

                  {/* Objective Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 dark:text-slate-400 mb-3">
                      1. Select Primary Objective *
                    </label>
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {OBJECTIVES.map((obj) => {
                        const isSelected = selectedObjective === obj;
                        return (
                          <button
                            type="button"
                            key={obj}
                            onClick={() => setSelectedObjective(obj)}
                            className={`rounded-xl p-3 text-xs font-bold text-left transition-all duration-200 border break-words ${
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
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2.5">
                      {BUDGET_RANGES.map((b) => {
                        const isSelected = selectedBudget === b;
                        return (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setSelectedBudget(b)}
                            className={`rounded-xl p-3 text-xs font-bold text-center transition-all duration-200 border break-words ${
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Full Name *"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Work Email Address *"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone / WhatsApp (+977 / +44 / +1)"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Company / Startup Name"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
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
                        className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3.5 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} variant="primary" size="lg" className="w-full shadow-lg shadow-violet-600/30 font-bold">
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
                    Thank you for reaching out. Our principal engineering architect has received your RFP for <span className="font-bold text-violet-700 dark:text-violet-300">{selectedObjective}</span> and will respond to your email within <span className="font-bold text-violet-700 dark:text-violet-300">2 hours</span>.
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
                      setFormSubmitted(false);
                    }}
                    className="mt-4 border-violet-200 dark:border-slate-700 text-ink dark:text-slate-200"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Hanging Global Engineering Hubs & Direct Channels */}
            <div className="sticky top-24 z-10 min-w-0 self-start space-y-8">
              
              {/* Office / HQ Card */}
              <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-5 sm:p-7 shadow-md transition-all hover:shadow-xl">
                <div className="flex items-start gap-3 pb-4 border-b border-violet-100 dark:border-slate-800 mb-5 sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700 font-bold shadow-md">
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
              <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-[#1b4397] via-[#153880] to-[#0e2764] p-5 sm:p-7 text-white shadow-xl">
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
      <section className="overflow-hidden py-16 lg:py-24 bg-cloud-100/70 border-t border-violet-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl min-w-0 text-center mb-12">
            <div className="mb-3 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] sm:px-3.5 sm:text-xs font-semibold uppercase tracking-widest text-violet-700">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-600" />
              <span className="break-words">{contactInfo.mapBadge || "Visit Our Headquarters"}</span>
            </div>
            <h2 className="font-display text-[1.65rem] leading-tight min-[400px]:text-2xl font-bold text-ink sm:text-4xl lg:text-5xl break-words">
              {contactInfo.mapTitle || "Locate Click Point Innovations"}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink/75 break-words">
              {contactInfo.mapSubtitle || `${contactInfo.address} — ${contactInfo.hours}`}
            </p>
          </div>

          {/* Landscape Embedded Google Map */}
          <div className="overflow-hidden rounded-3xl border border-violet-200 bg-white p-2.5 shadow-2xl shadow-violet-950/[0.06]">
            <iframe
              src={contactInfo.mapUrl || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapUrl}
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