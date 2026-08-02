"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES_LIST = [
  "AI & LLM Integration",
  "Web Application Development",
  "Mobile App Development (iOS & Android)",
  "Cloud & DevOps Architecture",
  "UI/UX Product Design",
  "Other Custom Software",
];

export default function QuickEnquiryModal({ isOpen, onClose }: QuickEnquiryModalProps) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setSelectedService("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-ink/65 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] shadow-2xl z-10 my-6"
          >
            {/* Close X Button */}
            <button
              onClick={handleResetAndClose}
              className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-cloud-100 dark:bg-slate-800 text-ink/70 dark:text-slate-200 hover:bg-violet-100 dark:hover:bg-slate-700 hover:text-violet-700 dark:hover:text-white transition-colors shadow-xs border border-violet-100 dark:border-slate-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <div className="grid lg:grid-cols-[1.25fr_0.95fr] items-stretch">
                
                {/* Left Side: Form Controls */}
                <div className="p-6 sm:p-8 lg:p-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                    Have a Project in Mind?
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">
                    Tell Us A Bit More
                  </h2>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Name *"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          placeholder="Email *"
                          className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      {/* Phone with Country Code Badge */}
                      <div className="flex items-center rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 overflow-hidden focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-600/20">
                        <span className="bg-violet-50 dark:bg-slate-700 px-2.5 py-3 text-xs font-bold text-violet-700 dark:text-violet-300 border-r border-violet-200 dark:border-slate-600 shrink-0">
                          +977
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number *"
                          className="w-full bg-transparent p-3 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:outline-hidden"
                        />
                      </div>

                      {/* Service Dropdown */}
                      <div className="relative">
                        <select
                          required
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3 pr-8 text-xs font-medium text-ink dark:text-white focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                        >
                          <option value="" disabled className="dark:bg-slate-800 dark:text-slate-400">
                            --- Select Service ---
                          </option>
                          {SERVICES_LIST.map((srv) => (
                            <option key={srv} value={srv} className="dark:bg-slate-800 dark:text-white">
                              {srv}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40 dark:text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write a Message *"
                        className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/50 dark:bg-slate-800/80 p-3 text-xs font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1b4397] via-[#2153b8] to-[#1b4397] px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#1b4397]/30 hover:shadow-xl hover:shadow-[#1b4397]/40 transition-all hover:scale-[1.01]"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Inquiry</span>
                    </button>
                  </form>
                </div>

                {/* Right Side: Direct Contact Info Panel (Clickpoint Logo Color Palette: Royal Blue & Amber Accent) */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1b4397] via-[#153880] to-[#0e2764] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f58220]/20 blur-2xl" />
                  <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#1b4397]/40 blur-2xl" />
                  
                  <div className="relative z-10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#f58220]">
                      We would love to hear from you
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white mt-1">
                      Get In Touch
                    </h3>

                    <div className="mt-8 space-y-6">
                      {/* Phone */}
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f58220]/20 text-[#f58220] border border-[#f58220]/30 backdrop-blur-md">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Our Phone Number</p>
                          <a href="tel:+977981846632" className="text-xs text-blue-100 hover:text-[#f58220] font-medium transition-colors">
                            +977-981846632
                          </a>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f58220]/20 text-[#f58220] border border-[#f58220]/30 backdrop-blur-md">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Email Address</p>
                          <a href="mailto:info@clickpoint.com.np" className="text-xs text-blue-100 hover:text-[#f58220] font-medium transition-colors">
                            info@clickpoint.com.np
                          </a>
                        </div>
                      </div>

                      {/* Office Address */}
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f58220]/20 text-[#f58220] border border-[#f58220]/30 backdrop-blur-md">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Our Location</p>
                          <p className="text-xs text-blue-100 font-medium">
                            New Baneshwor, Kathmandu, Nepal
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 pt-4 border-t border-white/15 text-[11px] text-blue-200 flex items-center gap-1.5 flex-wrap">
                    <Clock className="h-3.5 w-3.5 text-[#f58220] shrink-0" />
                    <span>Hours: Sun - Fri: 9:00 AM - 6:00 PM • Executive SLA: 2 Hours</span>
                  </div>
                </div>

              </div>
            ) : (
              /* Success State */
              <div className="p-10 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-ink">
                  Inquiry Submitted Successfully!
                </h3>
                <p className="text-xs text-ink/70 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Clickpoint Innovation. Our engineering team will review your project details and contact you at your phone/email within 2 hours.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleResetAndClose}
                  className="mt-2"
                >
                  Done
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
