"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  Paperclip,
  PenTool,
  Sparkles,
  Linkedin,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { broadcastNotification } from "@/lib/realtime-notifications";
import { DEFAULT_NAVBAR_DATA } from "@/data/default-navbar-data";

export interface JobVacancyModalTarget {
  id: string;
  title: string;
  category?: { name?: string };
  summary?: string;
  location?: string;
  type?: string;
}

interface JobApplyModalProps {
  job: JobVacancyModalTarget | null;
  isOpen: boolean;
  onClose: () => void;
}

let lastSubmitTime = 0;

export default function JobApplyModal({ job, isOpen, onClose }: JobApplyModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [coverLetterMode, setCoverLetterMode] = useState<"write" | "upload">("write");
  const [coverLetterText, setCoverLetterText] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [navbarLogo, setNavbarLogo] = useState(DEFAULT_NAVBAR_DATA.logo);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  // Fetch dynamic logo configured in navbar
  useEffect(() => {
    async function loadNavbarLogo() {
      try {
        const res = await fetch("/api/navbar");
        const json = await res.json();
        if (json.success && json.navbar?.logo) {
          setNavbarLogo(json.navbar.logo);
        }
      } catch (err) {
        console.warn("Failed to load navbar logo for modal:", err);
      }
    }
    loadNavbarLogo();
  }, []);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setLinkedIn("");
      setPortfolio("");
      setCoverLetterText("");
      setCoverLetterFile(null);
      setResumeFile(null);
      setCoverLetterMode("write");
      setSubmitted(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      if (coverLetterInputRef.current) coverLetterInputRef.current.value = "";
    }
  }, [isOpen, job?.id]);

  if (!isOpen || !job) return null;

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Please upload a PDF document for your resume.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Resume file size must be below 2 MB.");
      return;
    }
    setResumeFile(file);
  }

  function handleCoverLetterFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover letter file size must be below 5 MB.");
      return;
    }
    setCoverLetterFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;

    // Rate limiting (10 seconds)
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      const wait = Math.ceil((10000 - (now - lastSubmitTime)) / 1000);
      toast.error(`Please wait ${wait}s before submitting again.`);
      return;
    }

    if (!name.trim()) {
      toast.error("Applicant's Name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("A valid Email Address is required.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Contact Number is required.");
      return;
    }
    if (!address.trim()) {
      toast.error("Current Address is required.");
      return;
    }

    const hasCoverLetterText = Boolean(coverLetterText.trim());
    const hasCoverLetterFile = Boolean(coverLetterFile && coverLetterFile.size > 0);

    if (coverLetterMode === "write" && !hasCoverLetterText) {
      toast.error("Please write your cover letter before submitting.");
      return;
    }
    if (coverLetterMode === "upload" && !hasCoverLetterFile) {
      toast.error("Please attach a cover letter file or switch to 'Write Text'.");
      return;
    }

    if (!resumeFile) {
      toast.error("Please attach your resume (PDF only, below 2MB).");
      return;
    }

    setSubmitting(true);
    lastSubmitTime = now;

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("email", email.trim().toLowerCase());
    fd.append("phone", phone.trim());
    fd.append("address", address.trim());
    if (linkedIn.trim()) {
      fd.append("linkedIn", linkedIn.trim());
    }
    if (portfolio.trim()) {
      fd.append("portfolio", portfolio.trim());
    }
    fd.append("jobVacancyId", job.id);
    fd.append("jobTitle", job.title);
    fd.append("resume", resumeFile);

    if (coverLetterMode === "write" && hasCoverLetterText) {
      fd.append("coverLetter", coverLetterText.trim());
    }
    if (coverLetterMode === "upload" && coverLetterFile) {
      fd.append("coverLetterFile", coverLetterFile);
    }

    try {
      const res = await fetch("/api/jobs/apply", { method: "POST", body: fd });
      const json = await res.json();

      if (json.success) {
        setSubmitted(true);
        toast.success(`Application submitted for ${job.title}! We'll be in touch soon.`, {
          duration: 6000,
          position: "top-right",
        });

        // Broadcast to Admin Dashboard live notifications
        broadcastNotification({
          id: json.data?.id || `jobapp-${Date.now()}`,
          type: "JOB_APPLICATION",
          category: "JOB_APPLICATION",
          title: "New Job Application",
          clientName: name.trim(),
          email: email.trim().toLowerCase(),
          subtext: `Applied for: ${job.title}`,
          content: `Address: ${address.trim()}\n${coverLetterText.trim() || "Cover letter attached as file"}`,
          createdAt: new Date().toISOString(),
          targetTab: "job-applied",
        });
      } else {
        toast.error(json.error || "Failed to submit application. Please check your details.", {
          duration: 5000,
          position: "top-right",
        });
        if (json.rateLimited) lastSubmitTime = 0;
      }
    } catch {
      toast.error("Network error while submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl my-auto rounded-3xl bg-white dark:bg-[#131c31] shadow-2xl border border-violet-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* BRANDED HEADER BANNER (ORIGINAL VIOLET / SLATE THEME) */}
        <div className="relative bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 p-4 sm:p-5 text-white shrink-0 overflow-hidden border-b border-violet-800/40">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Clickpoint Brand Logo fetched from Navbar */}
              {navbarLogo?.logoUrl ? (
                <div className="bg-white px-2.5 py-1.5 rounded-xl border border-white/40 shadow-sm flex items-center justify-center shrink-0">
                  <img
                    src={navbarLogo.logoUrl}
                    alt={navbarLogo.brandName || "Click Point Innovations"}
                    className="h-7 sm:h-8 w-auto max-w-[130px] object-contain"
                  />
                </div>
              ) : (
                <div className="bg-white/10 text-white px-2.5 py-1.5 rounded-xl border border-white/20 backdrop-blur-md flex flex-col items-center leading-none shrink-0">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-violet-300">
                    {navbarLogo?.brandName || "CLICKPOINT"}
                  </span>
                  <span className="text-xs font-black tracking-tight text-white mt-0.5">
                    IS HIRING
                  </span>
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  
                  <p className="text-xs sm:text-sm font-bold tracking-tight text-white drop-shadow-xs">
                    Drop your CV today and blast off into a bright future with us!
                  </p>
                </div>
                <p className="text-[10px] text-violet-200/80 font-medium truncate mt-0.5">
                  Fast-track review by our executive engineering &amp; leadership pod
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE MODAL BODY */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-5 flex-1 [scrollbar-width:thin]">
          {!submitted ? (
            <>
              {/* Job Info Heading */}
              <div className="border-b border-violet-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  {job.category?.name || "Clickpoint Innovation Opportunity"}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {job.title}
                </h2>
                {job.summary && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {job.summary}
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Applicant's Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Applicant&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>

                {/* Current Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Current Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Pulchowk, Lalitpur or Kathmandu, Nepal"
                    className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn Profile <span className="font-normal text-[11px] text-slate-500 dark:text-slate-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={linkedIn}
                      onChange={(e) => setLinkedIn(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                    />
                    <Linkedin className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Portfolio / Website Link */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Portfolio / Website Link <span className="font-normal text-[11px] text-slate-500 dark:text-slate-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://yourportfolio.com or GitHub profile"
                      className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                    />
                    <Globe className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Cover Letter (Preserved with Write Text / Attach File Mode) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Cover Letter <span className="text-red-500">*</span>
                    </label>

                    {/* Mode Switcher */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setCoverLetterMode("write")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          coverLetterMode === "write"
                            ? "bg-white dark:bg-[#131c31] text-violet-600 dark:text-violet-300 shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      >
                        <PenTool className="h-3 w-3" />
                        <span>Write Text</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCoverLetterMode("upload")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          coverLetterMode === "upload"
                            ? "bg-white dark:bg-[#131c31] text-violet-600 dark:text-violet-300 shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      >
                        <Paperclip className="h-3 w-3" />
                        <span>Attach Image / File</span>
                      </button>
                    </div>
                  </div>

                  {coverLetterMode === "write" ? (
                    <textarea
                      rows={3}
                      value={coverLetterText}
                      onChange={(e) => setCoverLetterText(e.target.value)}
                      placeholder="Write or paste your cover letter, technical background, and why you're excited about this role..."
                      className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 leading-relaxed"
                    />
                  ) : (
                    <div className="rounded-xl border border-dashed border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3 text-center">
                      <input
                        type="file"
                        ref={coverLetterInputRef}
                        onChange={handleCoverLetterFileChange}
                        accept=".pdf,.doc,.docx,image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => coverLetterInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-violet-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                      >
                        <Paperclip className="h-3.5 w-3.5 text-violet-600" />
                        <span>
                          {coverLetterFile
                            ? coverLetterFile.name
                            : "Select Cover Letter File (PDF/DOC/Image)"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Resume (Below 2MB - pdf only) */}
                <div className="space-y-1 pt-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Resume <span className="text-red-500">*</span>{" "}
                    <span className="font-normal text-[11px] text-slate-500 dark:text-slate-400">
                      (Below 2MB - pdf only)
                    </span>
                  </label>

                  <div className="flex items-center gap-2 rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-1.5">
                    <input
                      type="file"
                      ref={resumeInputRef}
                      onChange={handleResumeChange}
                      accept=".pdf,application/pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
                    >
                      Choose file
                    </button>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1 px-1">
                      {resumeFile ? resumeFile.name : "No file chosen"}
                    </span>
                  </div>
                </div>

                {/* Submit Application Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>SUBMIT APPLICATION</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Application Success State */
            <div className="text-center py-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for applying for <strong>{job.title}</strong> at Clickpoint Innovation. Our team has received your CV and will reach out via email or phone.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
