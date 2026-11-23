"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  Paperclip,
  PenTool,
  Linkedin,
  Globe,
  ArrowRightLeft,
  FileText,
  Info,
  Check,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  XCircle,
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

  // Switch position & storage management states
  const [existingApplication, setExistingApplication] = useState<any | null>(null);
  const [isSameJob, setIsSameJob] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSwitchMode, setIsSwitchMode] = useState(false);
  const [showSwitchConfirmModal, setShowSwitchConfirmModal] = useState(false);
  const [existingResumeOnDb, setExistingResumeOnDb] = useState<{ url: string; name: string } | null>(null);
  const [existingCoverLetterOnDb, setExistingCoverLetterOnDb] = useState<{ url: string; name: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resubmitAttempt, setResubmitAttempt] = useState<number | null>(null);
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
      setResubmitAttempt(null);
      setExistingApplication(null);
      setIsSameJob(false);
      setIsCheckingEmail(false);
      setIsSwitchMode(false);
      setShowSwitchConfirmModal(false);
      setExistingResumeOnDb(null);
      setExistingCoverLetterOnDb(null);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      if (coverLetterInputRef.current) coverLetterInputRef.current.value = "";
    }
  }, [isOpen, job?.id]);

  // Lookup existing application by email
  const checkExistingEmail = useCallback(async (checkEmail: string) => {
    if (!checkEmail || !checkEmail.includes("@") || !job) {
      setExistingApplication(null);
      setIsSameJob(false);
      return;
    }
    try {
      setIsCheckingEmail(true);
      const res = await fetch(
        `/api/jobs/apply?email=${encodeURIComponent(checkEmail.trim())}&jobVacancyId=${encodeURIComponent(job.id)}`
      );
      const json = await res.json();
      if (json.success && json.hasExisting && json.existingApplication) {
        setExistingApplication(json.existingApplication);
        setIsSameJob(Boolean(json.isSameJob));
        if (json.existingApplication.resumeUrl) {
          setExistingResumeOnDb({
            url: json.existingApplication.resumeUrl,
            name: json.existingApplication.resumeOriginalName || "Resume.pdf",
          });
        }
        if (json.existingApplication.coverLetterFileUrl) {
          setExistingCoverLetterOnDb({
            url: json.existingApplication.coverLetterFileUrl,
            name: json.existingApplication.coverLetterOriginalName || "CoverLetter.pdf",
          });
        }
        // Autofill previous info if eligible to resubmit so applicant can easily update & resubmit
        if (json.canResubmit) {
          setName((prev) => prev || json.existingApplication.name || "");
          setPhone((prev) => prev || json.existingApplication.phone || "");
          setAddress((prev) => prev || json.existingApplication.address || "");
          setLinkedIn((prev) => prev || json.existingApplication.linkedIn || "");
          setPortfolio((prev) => prev || json.existingApplication.portfolio || "");
          if (json.existingApplication.coverLetter) {
            setCoverLetterText((prev) => prev || json.existingApplication.coverLetter || "");
          }
        }
      } else {
        setExistingApplication(null);
        setIsSameJob(false);
      }
    } catch (err) {
      console.warn("Failed to check existing application:", err);
    } finally {
      setIsCheckingEmail(false);
    }
  }, [job]);

  // Handle autofilling data from DB and enabling switch mode
  function handleAutofillAndEnableSwitch() {
    if (!existingApplication || existingApplication.status === "HIRED") return;
    if (existingApplication.name) setName(existingApplication.name);
    if (existingApplication.phone) setPhone(existingApplication.phone);
    if (existingApplication.address) setAddress(existingApplication.address);
    if (existingApplication.linkedIn) setLinkedIn(existingApplication.linkedIn);
    if (existingApplication.portfolio) setPortfolio(existingApplication.portfolio);
    if (existingApplication.coverLetter) {
      setCoverLetterText(existingApplication.coverLetter);
      setCoverLetterMode("write");
    }
    if (existingApplication.resumeUrl) {
      setExistingResumeOnDb({
        url: existingApplication.resumeUrl,
        name: existingApplication.resumeOriginalName || "Resume.pdf",
      });
    }
    setIsSwitchMode(true);
    toast.success("Loaded your existing profile from the database! You can review and edit any details before submitting.");
  }

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

  async function handleSubmit(e?: React.FormEvent, forceSwitch = false) {
    if (e) e.preventDefault();
    if (!job) return;

    const willSwitch = forceSwitch || isSwitchMode;

    // Rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < 4000) {
      toast.error("Please wait a moment before submitting again.");
      return;
    }

    if (existingApplication?.status === "HIRED") {
      toast.error(`You have already been hired as "${existingApplication.jobTitle}" at Clickpoint Innovations. Applications through this portal are locked for active employees.`);
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
    const hasExistingCoverLetter = Boolean(existingCoverLetterOnDb || existingApplication?.coverLetter);

    if (coverLetterMode === "write" && !hasCoverLetterText && !hasExistingCoverLetter) {
      toast.error("Please write your cover letter before submitting.");
      return;
    }
    if (coverLetterMode === "upload" && !hasCoverLetterFile && !existingCoverLetterOnDb) {
      toast.error("Please attach a cover letter file or switch to 'Write Text'.");
      return;
    }

    if (!resumeFile && !existingResumeOnDb) {
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
    if (resumeFile) {
      fd.append("resume", resumeFile);
    }

    if (coverLetterMode === "write" && hasCoverLetterText) {
      fd.append("coverLetter", coverLetterText.trim());
    }
    if (coverLetterMode === "upload" && coverLetterFile) {
      fd.append("coverLetterFile", coverLetterFile);
    }

    if (willSwitch) {
      fd.append("switchApplication", "true");
    }

    try {
      const res = await fetch("/api/jobs/apply", { method: "POST", body: fd });
      const json = await res.json();

      if (json.success) {
        setShowSwitchConfirmModal(false);
        setSubmitted(true);
        if (json.isResubmission) {
          setResubmitAttempt(json.attemptCount || 2);
        }
        const successMsg = json.isResubmission
          ? `Application successfully resubmitted for ${job.title} (Attempt ${json.attemptCount || 2} of 3)! Our hiring team will review your updated submission.`
          : json.switched
          ? `Application successfully switched to ${job.title}! We'll review your application soon.`
          : `Application submitted for ${job.title}! We'll be in touch soon.`;
        toast.success(successMsg, {
          duration: 6000,
          position: "top-right",
        });

        // Broadcast to Admin Dashboard live notifications
        broadcastNotification({
          id: json.data?.id || `jobapp-${Date.now()}`,
          type: "JOB_APPLICATION",
          category: "JOB_APPLICATION",
          title: json.switched ? "Job Application Transferred" : "New Job Application",
          clientName: name.trim(),
          email: email.trim().toLowerCase(),
          subtext: json.switched
            ? `Transferred from "${json.previousJobTitle}" to "${job.title}"`
            : `Applied for: ${job.title}`,
          content: `Address: ${address.trim()}\n${coverLetterText.trim() || "Cover letter attached as file"}`,
          createdAt: new Date().toISOString(),
          targetTab: "job-applied",
        });
      } else if (json.canSwitch && json.existingApplication) {
        // Can switch! Open confirmation modal
        setExistingApplication(json.existingApplication);
        if (json.existingApplication.resumeUrl) {
          setExistingResumeOnDb({
            url: json.existingApplication.resumeUrl,
            name: json.existingApplication.resumeOriginalName || "Resume.pdf",
          });
        }
        setShowSwitchConfirmModal(true);
      } else {
        toast.error(json.error || "Failed to submit application. Please check your details.", {
          duration: 6000,
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
        {/* BRANDED HEADER BANNER */}
        <div className="relative bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 p-4 sm:p-5 text-white shrink-0 overflow-hidden border-b border-violet-800/40">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
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
                <p className="text-xs sm:text-sm font-bold tracking-tight text-white drop-shadow-xs">
                  Drop your CV today and blast off into a bright future with us!
                </p>
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
        <div className="overflow-y-auto p-5 sm:p-7 space-y-5 flex-1 [scrollbar-width:thin] relative">
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

                {/* Email Address & Dynamic Existing Application Detection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    {isCheckingEmail && (
                      <span className="text-[10px] text-violet-500 flex items-center gap-1 font-semibold">
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        Checking application status...
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (e.target.value.includes("@") && e.target.value.includes(".")) {
                        checkExistingEmail(e.target.value);
                      } else {
                        setExistingApplication(null);
                        setIsSameJob(false);
                      }
                    }}
                    onBlur={(e) => checkExistingEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
                  />

                  {/* Inline Existing Application Banner */}
                  {existingApplication && (
                    <AnimatePresence>
                      {existingApplication.status === "HIRED" ? (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/40 space-y-2 shadow-xs"
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                                  Hired Employee &mdash; Applications Locked
                                </span>
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                  HIRED
                                </span>
                              </div>
                              <p className="text-[11px] text-emerald-900 dark:text-emerald-200 mt-1 leading-relaxed">
                                Congratulations! Our records show that you have already been hired as <strong>{existingApplication.jobTitle}</strong> at <strong>Clickpoint Innovations</strong>.
                              </p>
                              <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 mt-1">
                                As an active team member, new applications and position switches cannot be submitted through this public careers portal. For internal transfers or role changes, please contact HR directly.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ) : isSameJob ? (
                        existingApplication.status === "REJECTED" ? (
                          (existingApplication.attemptCount || 1) < 3 ? (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200"
                            >
                              <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <RefreshCw className="h-3.5 w-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-slate-900 dark:text-white">
                                    Resubmission Available (Attempt {(existingApplication.attemptCount || 1) + 1} of 3)
                                  </p>
                                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                                    Previous: REJECTED
                                  </span>
                                </div>
                                <p className="text-[11px] mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                                  Your previous application for <strong>{existingApplication.jobTitle}</strong> was not selected (Attempt {existingApplication.attemptCount || 1} of 3). You have <strong>{3 - (existingApplication.attemptCount || 1)} remaining submission attempt{3 - (existingApplication.attemptCount || 1) > 1 ? "s" : ""}</strong>. You can update your cover letter, resume, or contact details below and resubmit for fresh consideration.
                                </p>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200"
                            >
                              <div className="h-7 w-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <XCircle className="h-3.5 w-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-rose-950 dark:text-rose-100">
                                    Maximum Submission Attempts Reached (3 of 3)
                                  </p>
                                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                                    REJECTED (3/3)
                                  </span>
                                </div>
                                <p className="text-[11px] mt-1 text-rose-800/90 dark:text-rose-300/90 leading-relaxed">
                                  You have completed all 3 application attempts for <strong>{existingApplication.jobTitle}</strong>. Your application remains marked as REJECTED and further submissions for this specific position are closed.
                                </p>
                              </div>
                            </motion.div>
                          )
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200"
                          >
                            <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                            <div className="min-w-0">
                              <p className="font-bold">
                                You already applied for this position ({existingApplication.jobTitle})
                              </p>
                              <p className="text-[11px] mt-0.5 opacity-90">
                                Your application is currently <strong>{existingApplication.status}</strong>. Our team is actively reviewing submissions and will reach out to you directly.
                              </p>
                            </div>
                          </motion.div>
                        )
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-violet-50/70 dark:bg-violet-950/30 space-y-2"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              <ArrowRightLeft className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  Existing Application Detected
                                </span>
                                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-violet-200 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                                  {existingApplication.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                                You currently have an application in our database for <strong>{existingApplication.jobTitle}</strong>. To manage storage, you can switch your application to <strong>{job.title}</strong> and edit your details.
                              </p>

                              {!isSwitchMode ? (
                                <button
                                  type="button"
                                  onClick={handleAutofillAndEnableSwitch}
                                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                                >
                                  <ArrowRightLeft className="h-3 w-3" />
                                  <span>Autofill My Details &amp; Switch to {job.title}</span>
                                </button>
                              ) : (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                                  <Check className="h-3 w-3" />
                                  <span>Switch Mode Active &mdash; Application will transfer upon submit</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
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

                {/* Cover Letter */}
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
                    <div className="rounded-xl border border-dashed border-violet-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3 text-center space-y-2">
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
                            : existingCoverLetterOnDb
                            ? `Keep: ${existingCoverLetterOnDb.name}`
                            : "Select Cover Letter File (PDF/DOC/Image)"}
                        </span>
                      </button>
                      {existingCoverLetterOnDb && !coverLetterFile && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Using cover letter file from your existing application. Click to replace.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Resume (Below 2MB - pdf only) */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Resume <span className="text-red-500">*</span>{" "}
                    <span className="font-normal text-[11px] text-slate-500 dark:text-slate-400">
                      (Below 2MB - pdf only)
                    </span>
                  </label>

                  {/* If candidate already has a resume on DB in switch mode */}
                  {existingResumeOnDb && !resumeFile ? (
                    <div className="p-2.5 rounded-xl border border-violet-200 dark:border-slate-700 bg-violet-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-violet-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                            {existingResumeOnDb.name}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                            Reusing existing CV file from database (no re-upload needed)
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => resumeInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer shrink-0"
                      >
                        Replace CV
                      </button>
                    </div>
                  ) : null}

                  <div className={`flex items-center gap-2 rounded-xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-1.5 ${existingResumeOnDb && !resumeFile ? "hidden" : ""}`}>
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
                    {resumeFile && existingResumeOnDb && (
                      <button
                        type="button"
                        onClick={() => {
                          setResumeFile(null);
                          if (resumeInputRef.current) resumeInputRef.current.value = "";
                        }}
                        className="text-[10px] font-bold text-violet-600 hover:underline px-1.5"
                      >
                        Keep Previous CV
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit Application Button */}
                <div className="pt-3">
                  {(() => {
                    const attempts = Number(existingApplication?.attemptCount || 1);
                    const isRejected = existingApplication?.status === "REJECTED";
                    const isHired = existingApplication?.status === "HIRED";
                    const isMaxAttempts = isSameJob && isRejected && attempts >= 3;
                    const canResubmitApplication = isSameJob && isRejected && attempts < 3;
                    const isDuplicatePending = isSameJob && !isRejected;

                    const isSubmitDisabled =
                      submitting ||
                      isHired ||
                      isMaxAttempts ||
                      isDuplicatePending;

                    return (
                      <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={`w-full py-3 px-4 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                          isHired
                            ? "bg-emerald-700/80 cursor-not-allowed shadow-none"
                            : isMaxAttempts
                            ? "bg-rose-700/80 cursor-not-allowed shadow-none"
                            : isDuplicatePending
                            ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none"
                            : canResubmitApplication
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30"
                            : isSwitchMode
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-violet-600/30"
                            : "bg-violet-600 hover:bg-violet-700 shadow-violet-600/20"
                        }`}
                      >
                        {isHired ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>POSITION LOCKED &mdash; CANDIDATE ALREADY HIRED</span>
                          </>
                        ) : isMaxAttempts ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>MAXIMUM ATTEMPTS REACHED (3/3) &mdash; SUBMISSION LOCKED</span>
                          </>
                        ) : isDuplicatePending ? (
                          <>
                            <Info className="h-4 w-4" />
                            <span>APPLICATION ALREADY SUBMITTED ({existingApplication?.status})</span>
                          </>
                        ) : submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>
                              {canResubmitApplication
                                ? `Resubmitting Application (Attempt ${attempts + 1} of 3)...`
                                : isSwitchMode
                                ? "Switching Position..."
                                : "Submitting Application..."}
                            </span>
                          </>
                        ) : canResubmitApplication ? (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            <span>RESUBMIT APPLICATION (ATTEMPT {attempts + 1} OF 3)</span>
                          </>
                        ) : isSwitchMode ? (
                          <>
                            <ArrowRightLeft className="h-4 w-4" />
                            <span>CONFIRM &amp; SWITCH APPLICATION TO {job.title}</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>SUBMIT APPLICATION</span>
                          </>
                        )}
                      </button>
                    );
                  })()}
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
                  {resubmitAttempt
                    ? `Application Resubmitted Successfully! (Attempt ${resubmitAttempt} of 3)`
                    : isSwitchMode
                    ? "Application Switched Successfully!"
                    : "Application Submitted Successfully!"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {resubmitAttempt ? (
                    <>
                      Thank you for resubmitting your application for <strong>{job.title}</strong> (Attempt {resubmitAttempt} of 3). Your updated CV and profile details have been received and queued for review.
                    </>
                  ) : isSwitchMode ? (
                    <>
                      Your application has been successfully transferred to <strong>{job.title}</strong> and is now pending review. Your profile data has been updated in our database.
                    </>
                  ) : (
                    <>
                      Thank you for applying for <strong>{job.title}</strong> at Clickpoint Innovation. Our team has received your CV and will reach out via email or phone.
                    </>
                  )}
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

          {/* Interactive Switch Confirmation Modal Dialog */}
          <AnimatePresence>
            {showSwitchConfirmModal && existingApplication && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  className="w-full max-w-md rounded-2xl bg-white dark:bg-[#131c31] border border-violet-200 dark:border-slate-700 shadow-2xl p-5 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-600/30">
                      <ArrowRightLeft className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                        Switch Job Application Position?
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        1 active job application per candidate policy
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-violet-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Current Position:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {existingApplication.jobTitle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Current Status:</span>
                      <span className="font-extrabold uppercase px-1.5 py-0.5 rounded text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {existingApplication.status}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-violet-600 dark:text-violet-400 font-bold">New Position:</span>
                      <span className="font-extrabold text-violet-700 dark:text-violet-300 truncate max-w-[200px]">
                        {job.title}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    You already have an application under this email. To optimize database storage and keep reviews streamlined, you can switch your application to <strong>{job.title}</strong>. Your status will be reset to <strong>PENDING</strong> for fresh review.
                  </p>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSubmit(undefined, true)}
                      className="w-full py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                      )}
                      <span>Confirm &amp; Switch to {job.title}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowSwitchConfirmModal(false);
                        handleAutofillAndEnableSwitch();
                      }}
                      className="w-full py-2 px-3 rounded-xl border border-violet-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      Review &amp; Edit Details in Form First
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSwitchConfirmModal(false)}
                      className="w-full py-1.5 text-center text-[11px] font-medium text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Cancel &amp; Keep Current Position
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
