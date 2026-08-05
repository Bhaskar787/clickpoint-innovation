"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Download, Eye, Trash2, RefreshCw, Search,
  ChevronDown, CheckCircle2, Clock, XCircle, Star,
  FileText, Mail, Phone, Linkedin, Globe, MessageSquare,
  Calendar, MapPin, ExternalLink, ArrowLeft, User, Filter,
  MoreVertical, ShieldAlert, SendHorizontal, X, Check, ZoomIn
} from "lucide-react";
import { toast } from "sonner";
import { EmailComposerModal, EmailTemplateType } from "@/components/admin/email-composer-modal";

interface JobApplication {
  id: string;
  jobVacancyId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  portfolio?: string;
  coverLetter?: string;
  resumeUrl: string;
  resumeOriginalName?: string;
  resumeProvider: string;
  status: "PENDING" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";
  isRead: boolean;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
  vacancyType?: string;
  vacancyLocation?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
  PENDING:    { label: "Pending",    color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50", icon: Clock },
  REVIEWING:  { label: "Reviewing",  color: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",       icon: Eye },
  SHORTLISTED:{ label: "Shortlisted",color: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800/50", icon: Star },
  REJECTED:   { label: "Rejected",   color: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50",          icon: XCircle },
  HIRED:      { label: "Hired",      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50", icon: CheckCircle2 },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getResumeViewUrl(appId?: string, resumeUrl?: string) {
  if (appId) return `/api/jobs/resume?id=${appId}&action=inline`;
  if (resumeUrl) return `/api/jobs/resume?url=${encodeURIComponent(resumeUrl)}&action=inline`;
  return "#";
}

function getResumeDownloadUrl(appId?: string, resumeUrl?: string) {
  if (appId) return `/api/jobs/resume?id=${appId}&action=download`;
  if (resumeUrl) return `/api/jobs/resume?url=${encodeURIComponent(resumeUrl)}&action=download`;
  return "#";
}

function isPdfResume(url: string, originalName?: string) {
  const filename = originalName || url;
  return /\.pdf$/i.test(filename);
}

function isImageResume(url: string, originalName?: string) {
  const filename = originalName || url;
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
}

function isPreviewableResume(url: string, originalName?: string) {
  return isPdfResume(url, originalName) || isImageResume(url, originalName);
}

export default function JobApplicationsView() {
  const [mounted, setMounted] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Email composer modal state
  const [emailModalApp, setEmailModalApp] = useState<JobApplication | null>(null);
  const [emailModalType, setEmailModalType] = useState<EmailTemplateType>("APPROVED");

  // Lightbox modal state for full-screen cover letter / resume image viewing
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const openEmailModal = (app: JobApplication, initialType: EmailTemplateType = "APPROVED") => {
    setEmailModalApp(app);
    setEmailModalType(initialType);
  };

  const parseCoverLetter = (app: any) => {
    let text = app?.coverLetter || "";
    let fileUrl = app?.coverLetterFileUrl || "";
    let originalName = app?.coverLetterOriginalName || "";

    if (!fileUrl && text.includes("[Attached Cover Letter File:")) {
      const match = text.match(/\[Attached Cover Letter File:\s*([^\]]+)\]\s*(?:\(([^)]*)\))?/);
      if (match) {
        fileUrl = match[1].trim();
        originalName = match[2] ? match[2].trim() : "cover_letter";
        text = text.replace(/\[Attached Cover Letter File:\s*([^\]]+)\]\s*(?:\(([^)]*)\))?/, "").trim();
      }
    }

    return { text, fileUrl, originalName };
  };

  const isInitialLoadRef = useRef(true);
  const prevAppIdsRef = useRef<Set<string>>(new Set());

  const playNewNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Ignore audio policy restrictions
    }
  };

  const fetchApplications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/jobs/applications");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const fetched: JobApplication[] = json.data;

        if (!isInitialLoadRef.current) {
          const newApps = fetched.filter((app) => !prevAppIdsRef.current.has(app.id));
          if (newApps.length > 0) {
            playNewNotificationSound();
            newApps.forEach((app) => {
              toast.info(`New Application Received: ${app.name} applied for ${app.jobTitle}`, {
                duration: 6000,
              });
            });
          }
        } else {
          isInitialLoadRef.current = false;
        }

        prevAppIdsRef.current = new Set(fetched.map((a) => a.id));
        setApplications(fetched);
      }
    } catch {
      if (!silent) toast.error("Failed to load applications");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications(false);

    // Real-time polling interval every 4 seconds
    const interval = setInterval(() => {
      fetchApplications(true);
    }, 4000);

    // Immediate sync on window focus
    const handleFocus = () => {
      fetchApplications(true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchApplications]);

  const markRead = async (id: string) => {
    await fetch("/api/jobs/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-read", id }),
    });
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, isRead: true } : a));
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/jobs/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-status", id, status }),
      });
      const json = await res.json();
      if (json.success) {
        setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: status as any } : a));
        if (selectedApp?.id === id) setSelectedApp((prev) => prev ? { ...prev, status: status as any } : null);
        toast.success(`Status updated to ${STATUS_CONFIG[status]?.label}`);
      }
    } catch { 
      toast.error("Failed to update status"); 
    } finally { 
      setUpdatingId(null); 
    }
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application permanently?")) return;
    try {
      const res = await fetch("/api/jobs/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const json = await res.json();
      if (json.success) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
        if (selectedApp?.id === id) setSelectedApp(null);
        toast.success("Application removed");
      }
    } catch { 
      toast.error("Failed to delete application"); 
    }
  };

  const openApp = async (app: JobApplication) => {
    setSelectedApp(app);
    if (!app.isRead) {
      markRead(app.id);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const unreadCount = applications.filter((a) => !a.isRead).length;

  const renderEmailModal = () => (
    <EmailComposerModal
      app={emailModalApp}
      initialType={emailModalType}
      onClose={() => setEmailModalApp(null)}
      onSuccess={(newStatus) => {
        if (newStatus && emailModalApp) {
          setApplications((prev) =>
            prev.map((a) => (a.id === emailModalApp.id ? { ...a, status: newStatus as any } : a))
          );
          if (selectedApp?.id === emailModalApp.id) {
            setSelectedApp((prev) => (prev ? { ...prev, status: newStatus as any } : null));
          }
        }
      }}
    />
  );

  const renderLightboxModal = () => {
    if (!lightboxImage || !mounted) return null;
    return createPortal(
      <AnimatePresence>
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md cursor-zoom-out animate-in fade-in duration-200"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-2xl flex flex-col items-center justify-center overflow-hidden cursor-default transition-colors"
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold">
              <span>{lightboxImage.title}</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[80vh] flex items-center justify-center w-full bg-slate-50/50 dark:bg-slate-950/50 rounded-xl mt-3">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[72vh] max-w-full rounded-lg shadow-xl object-contain border border-slate-200 dark:border-slate-800"
              />
            </div>
          </motion.div>
        </div>
      </AnimatePresence>,
      document.body
    );
  };

  // ─── Detail View ───────────────────────────────────────────────────────────
  if (selectedApp) {
    const sc = STATUS_CONFIG[selectedApp.status] || STATUS_CONFIG.PENDING;
    const StatusIcon = sc.icon;

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedApp(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </button>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedApp.name}</h2>
                {!selectedApp.isRead && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Applied for <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedApp.jobTitle}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openEmailModal(selectedApp)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
              >
                <Mail className="h-3.5 w-3.5" />
                Send Email to Candidate
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${sc.color}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {sc.label}
              </span>
              <button
                onClick={() => deleteApp(selectedApp.id)}
                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Delete Application"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Applicant Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Applicant Details
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "Email", value: selectedApp.email },
                    { icon: Phone, label: "Phone", value: selectedApp.phone || "N/A" },
                    { icon: Linkedin, label: "LinkedIn", value: selectedApp.linkedIn, isLink: true },
                    { icon: Globe, label: "Portfolio", value: selectedApp.portfolio, isLink: true },
                    { icon: Calendar, label: "Applied On", value: new Date(selectedApp.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" }) },
                    { icon: MapPin, label: "Location", value: selectedApp.vacancyLocation || "N/A" },
                  ].map(({ icon: Icon, label, value, isLink }) => (
                    <div key={label} className="flex items-start gap-3 text-xs">
                      <Icon className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">{label}</div>
                        {isLink && value ? (
                          <a
                            href={value.startsWith("http") ? value : `https://${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline inline-flex items-center gap-1 truncate font-medium"
                          >
                            {value} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <div className="text-slate-700 dark:text-slate-300 font-medium truncate">{value || "N/A"}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Manager */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    Application Status
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STATUS_CONFIG).map(([s, { label }]) => (
                      <button
                        key={s}
                        disabled={updatingId === selectedApp.id}
                        onClick={() => updateStatus(selectedApp.id, s)}
                        className={`text-xs font-medium px-3 py-2 rounded-lg border text-left transition-all ${
                          selectedApp.status === s
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Quick Email Actions
                  </h3>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => openEmailModal(selectedApp, "APPROVED")}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors flex items-center justify-between"
                    >
                      <span>Shortlist & Notify Candidate</span>
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => openEmailModal(selectedApp, "REJECTED")}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 transition-colors flex items-center justify-between"
                    >
                      <span>Send Rejection Email</span>
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => openEmailModal(selectedApp, "INTERVIEW")}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 transition-colors flex items-center justify-between"
                    >
                      <span>Send Interview Invitation</span>
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume & Cover Letter */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resume Card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Resume / Curriculum Vitae</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {selectedApp.resumeOriginalName || "Attached Resume"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPreviewableResume(selectedApp.resumeUrl, selectedApp.resumeOriginalName) && (
                      <a
                        href={getResumeViewUrl(selectedApp.id, selectedApp.resumeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Full Tab
                      </a>
                    )}
                    <a
                      href={getResumeDownloadUrl(selectedApp.id, selectedApp.resumeUrl)}
                      download={selectedApp.resumeOriginalName || "resume"}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </div>
                </div>

                {/* Document Preview Frame with Scroll & Zero Auto-Download */}
                {isPdfResume(selectedApp.resumeUrl, selectedApp.resumeOriginalName) ? (
                  <div className="w-full h-[650px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-inner">
                    <iframe
                      src={getResumeViewUrl(selectedApp.id, selectedApp.resumeUrl)}
                      className="w-full h-full border-0"
                      title="Resume PDF Preview"
                    />
                  </div>
                ) : isImageResume(selectedApp.resumeUrl, selectedApp.resumeOriginalName) ? (
                  <div
                    onClick={() =>
                      setLightboxImage({
                        url: getResumeViewUrl(selectedApp.id, selectedApp.resumeUrl),
                        title: `Resume Image Attachment - ${selectedApp.name}`,
                      })
                    }
                    className="relative group w-full max-h-[650px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 p-4 overflow-auto flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={getResumeViewUrl(selectedApp.id, selectedApp.resumeUrl)}
                      alt="Resume Image Preview"
                      className="max-w-full h-auto rounded shadow-md object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
                      <ZoomIn className="h-4 w-4" />
                      Click to Expand Full Screen Image
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 p-6 text-sm text-slate-600 dark:text-slate-300">
                    <p className="font-semibold mb-2">Resume preview not supported inline</p>
                    <p className="text-xs mb-3">
                      This document format cannot be rendered directly in the browser. Click the Download button to save and view it on your computer.
                    </p>
                    <a
                      href={getResumeDownloadUrl(selectedApp.id, selectedApp.resumeUrl)}
                      download={selectedApp.resumeOriginalName || "resume"}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Cover Letter Section (Text + Attached PDF / Image File + Lightbox Modal) */}
              {(() => {
                const { text, fileUrl, originalName } = parseCoverLetter(selectedApp);
                if (!text && !fileUrl) return null;

                const isPdf = isPdfResume(fileUrl, originalName);
                const isImg = isImageResume(fileUrl, originalName);
                const filePreviewUrl = `/api/jobs/resume?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(originalName || "cover_letter")}&action=inline`;
                const fileDownloadUrl = `/api/jobs/resume?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(originalName || "cover_letter")}&action=download`;

                return (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                        <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Candidate Cover Letter
                      </div>
                      {fileUrl && (
                        <div className="flex items-center gap-2">
                          <a
                            href={filePreviewUrl}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open Tab
                          </a>
                          <a
                            href={fileDownloadUrl}
                            download={originalName || "cover_letter"}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            Download Attachment
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Cover Letter Text */}
                    {text && (
                      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/60">
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                          {text}
                        </p>
                      </div>
                    )}

                    {/* Cover Letter Attachment Document / Image Viewer */}
                    {fileUrl && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Attached Cover Letter File ({originalName || "Document"})</span>
                          {isImg && <span className="text-emerald-600 font-semibold">Click image to expand full screen</span>}
                        </div>

                        {isPdf ? (
                          /* PDF Document Viewer with Scroll Support */
                          <div className="w-full h-[550px] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white shadow-inner">
                            <iframe
                              src={filePreviewUrl}
                              className="w-full h-full border-0"
                              title="Cover Letter PDF Preview"
                            />
                          </div>
                        ) : isImg ? (
                          /* Image Preview with Lightbox Zoom Popup */
                          <div
                            onClick={() => setLightboxImage({ url: filePreviewUrl, title: `Cover Letter Attachment - ${selectedApp.name}` })}
                            className="relative group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-4 text-center cursor-pointer overflow-hidden max-h-96 flex items-center justify-center"
                          >
                            <img
                              src={filePreviewUrl}
                              alt="Cover Letter Image Preview"
                              className="max-h-80 w-auto rounded shadow-md object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                            />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
                              <ZoomIn className="h-4 w-4" />
                              Click to Expand Full Screen Image
                            </div>
                          </div>
                        ) : (
                          /* Generic File Link */
                          <a
                            href={filePreviewUrl}
                            target="_blank"
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              <span>{originalName || "Cover Letter File"}</span>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {renderEmailModal()}
        {renderLightboxModal()}
      </div>
    );
  }

  // ─── Table View ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Job Applications</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review and manage candidate applications for active positions
          </p>
        </div>

        <button
          onClick={() => fetchApplications(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by applicant name, email, or title..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([s, { label }]) => (
              <option key={s} value={s}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Structured Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3 px-4 w-12 text-center">Status</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Applied Position</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto" /></td>
                    <td className="p-4"><div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="p-4"><div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="p-4"><div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="p-4"><div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
                    <td className="p-4"><div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-600 dark:text-slate-400">No applications found</p>
                    <p className="text-[11px] mt-0.5">Try adjusting your filters or search terms</p>
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = sc.icon;

                  return (
                    <tr
                      key={app.id}
                      onClick={() => openApp(app)}
                      className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        !app.isRead ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""
                      }`}
                    >
                      {/* Unread indicator */}
                      <td className="py-3.5 px-4 text-center">
                        {!app.isRead ? (
                          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" title="Unread" />
                        ) : (
                          <span className="inline-block h-2 w-2 rounded-full bg-transparent" />
                        )}
                      </td>

                      {/* Applicant */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{app.name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">{app.email}</div>
                      </td>

                      {/* Position */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{app.jobTitle}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">{app.vacancyType || "Full-Time"}</div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {timeAgo(app.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sc.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {sc.label}
                        </span>
                      </td>

                      {/* Explicit View Controls */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openApp(app);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEmailModal(app, "APPROVED");
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                            title="Send Email to Applicant"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          {isPreviewableResume(app.resumeUrl, app.resumeOriginalName) ? (
                            <a
                              href={getResumeViewUrl(app.id, app.resumeUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                              title="Open Resume in New Tab"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          ) : (
                            <a
                              href={getResumeDownloadUrl(app.id, app.resumeUrl)}
                              download={app.resumeOriginalName || "resume"}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                              title="Download Resume"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteApp(app.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete Application"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Admin Email Composer & Lightbox Modals ──────────────────────── */}
      {renderEmailModal()}
      {renderLightboxModal()}
    </div>
  );
}