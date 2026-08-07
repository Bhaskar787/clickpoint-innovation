"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, SendHorizontal, RefreshCw, Eye, Edit3, CheckCircle2, Star, Calendar, Search, XCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export interface EmailModalApplication {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  status: string;
}

export type EmailTemplateType = "APPROVED" | "REJECTED" | "REVIEWING" | "INTERVIEW" | "CUSTOM";

interface EmailComposerModalProps {
  app: EmailModalApplication | null;
  initialType?: EmailTemplateType;
  onClose: () => void;
  onSuccess?: (newStatus?: string) => void;
}

const TEMPLATE_OPTIONS: { type: EmailTemplateType; label: string; icon: any; color: string }[] = [
  { type: "APPROVED", label: "Shortlist Candidate", icon: Star, color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 dark:hover:bg-emerald-900/60" },
  { type: "INTERVIEW", label: "Invite for Interview", icon: Calendar, color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80 dark:hover:bg-purple-900/60" },
  { type: "REVIEWING", label: "Under Active Review", icon: Search, color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80 dark:hover:bg-blue-900/60" },
  { type: "REJECTED", label: "Rejection Notice", icon: XCircle, color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 dark:hover:bg-rose-900/60" },
  { type: "CUSTOM", label: "Custom Message", icon: MessageSquare, color: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800" },
];

/**
 * Standalone Admin Email Composer Modal Component
 * Styled in Clickpoint Innovations Executive Theme with full dark mode support.
 */
export function EmailComposerModal({
  app,
  initialType = "APPROVED",
  onClose,
  onSuccess,
}: EmailComposerModalProps) {
  const [emailType, setEmailType] = useState<EmailTemplateType>(initialType);
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [updateStatusWithEmail, setUpdateStatusWithEmail] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Default auto-fill when modal opens or template changes
  useEffect(() => {
    if (app) {
      updateDefaultTemplateFields(emailType, app);
    }
  }, [app, emailType]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (app) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [app]);

  const updateDefaultTemplateFields = (type: EmailTemplateType, application: EmailModalApplication) => {
    if (type === "APPROVED") {
      setCustomSubject(`Application Shortlisted: ${application.jobTitle} at Clickpoint Innovations`);
      setCustomMessage(`Dear ${application.name},\n\nThank you for applying for the position of ${application.jobTitle} at Clickpoint Innovations.\n\nWe are pleased to inform you that after reviewing your application and resume, your profile has been shortlisted for the next round of our selection process.\n\nOur talent acquisition team will be in touch with you shortly regarding the schedule for your initial interview.\n\nBest regards,\nClickpoint Innovations Hiring Team`);
    } else if (type === "REJECTED") {
      setCustomSubject(`Update on your application for ${application.jobTitle} at Clickpoint Innovations`);
      setCustomMessage(`Dear ${application.name},\n\nThank you for taking the time to apply for the position of ${application.jobTitle} at Clickpoint Innovations.\n\nWe received many applications from talented candidates. While your experience is impressive, we have decided to move forward with other candidates whose qualifications more closely match our current requirements for this role.\n\nWe sincerely appreciate your interest in joining Clickpoint Innovations and wish you success in your job search.\n\nBest regards,\nClickpoint Innovations HR Team`);
    } else if (type === "INTERVIEW") {
      setCustomSubject(`Interview Invitation: ${application.jobTitle} at Clickpoint Innovations`);
      setCustomMessage(`Dear ${application.name},\n\nWe would like to invite you for an interview for the position of ${application.jobTitle} at Clickpoint Innovations.\n\nPlease reply to this email with your available dates and times for a virtual discussion.\n\nBest regards,\nClickpoint Innovations Hiring Team`);
    } else if (type === "REVIEWING") {
      setCustomSubject(`Application Status Update: ${application.jobTitle} - Under Review`);
      setCustomMessage(`Dear ${application.name},\n\nYour application for ${application.jobTitle} at Clickpoint Innovations is currently being evaluated by our engineering leadership.\n\nWe will contact you with further updates shortly.\n\nBest regards,\nClickpoint Innovations Recruitment Team`);
    } else {
      setCustomSubject(`Regarding your application for ${application.jobTitle} at Clickpoint Innovations`);
      setCustomMessage(`Dear ${application.name},\n\n\n\nBest regards,\nClickpoint Innovations Team`);
    }
  };

  const handleSendEmail = async () => {
    if (!app) return;
    setSendingEmail(true);
    try {
      let statusToUpdate: string | undefined = undefined;
      if (updateStatusWithEmail) {
        if (emailType === "APPROVED") statusToUpdate = "SHORTLISTED";
        if (emailType === "REJECTED") statusToUpdate = "REJECTED";
        if (emailType === "REVIEWING") statusToUpdate = "REVIEWING";
      }

      const res = await fetch("/api/jobs/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: app.id,
          applicantEmail: app.email,
          applicantName: app.name,
          jobTitle: app.jobTitle,
          emailType,
          customSubject,
          customMessage,
          updateStatus: statusToUpdate,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Email successfully delivered to ${app.email}!`);
        if (onSuccess) onSuccess(statusToUpdate);
        onClose();
      } else {
        toast.error(json.error || "Failed to send email");
      }
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!app || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Executive Header with Official Clickpoint Logo */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#131927] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/clickpointfinal.png"
                alt="Clickpoint Innovations"
                className="h-8 w-auto object-contain"
              />
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Candidate Email Dispatcher
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Recipient: <span className="font-semibold text-slate-900 dark:text-slate-100">{app.name}</span> ({app.email})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Subheader Tabs: Edit vs Preview */}
          <div className="px-6 py-2.5 bg-slate-50 dark:bg-[#0b0f19] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800/90 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("edit")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "edit"
                    ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                Compose Message
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "preview"
                    ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Live Email Preview
              </button>
            </div>

            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {app.jobTitle}
            </span>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
            {activeTab === "edit" ? (
              <>
                {/* Template Selector Pills */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Select Candidate Email Template
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TEMPLATE_OPTIONS.map(({ type, label, icon: Icon, color }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setEmailType(type);
                          updateDefaultTemplateFields(type, app);
                        }}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition-all flex items-center gap-2 ${color} ${
                          emailType === type ? "ring-2 ring-emerald-500 shadow-sm opacity-100" : "opacity-80"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Subject Line
                  </label>
                  <input
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter email subject line..."
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Body Content
                  </label>
                  <textarea
                    rows={8}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Type your official message to the applicant..."
                    className="w-full px-3.5 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans shadow-sm"
                  />
                </div>

                {/* Status Sync Checkbox */}
                {emailType !== "CUSTOM" && emailType !== "INTERVIEW" && (
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={updateStatusWithEmail}
                      onChange={(e) => setUpdateStatusWithEmail(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>
                      Sync dashboard application status to{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {emailType === "APPROVED"
                          ? "Shortlisted"
                          : emailType === "REJECTED"
                          ? "Rejected"
                          : "Reviewing"}
                      </strong>
                    </span>
                  </label>
                )}
              </>
            ) : (
              /* Live Email Preview Box (Matching Candidate Inbox View) */
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080b11] p-5 sm:p-6 space-y-4 shadow-inner">
                <div className="bg-white dark:bg-[#131c31] rounded-xl border border-slate-200 dark:border-slate-700/80 p-5 sm:p-6 space-y-4 shadow-sm">
                  {/* Email Header in Preview */}
                  <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 flex items-center justify-between">
                    <img
                      src="/images/clickpointfinal.png"
                      alt="Clickpoint Innovations"
                      className="h-8 w-auto object-contain"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Official Email Preview
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-400 font-medium">Subject: </span>
                      <span className="font-bold text-slate-900 dark:text-white">{customSubject}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-400 font-medium">From: </span>
                      <span className="text-slate-700 dark:text-slate-200 font-semibold">
                        Clickpoint Innovations Careers &lt;budhabhaskar2@gmail.com&gt;
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap font-sans">
                    {customMessage}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-[11px] text-slate-400 dark:text-slate-500 text-center">
                    © {new Date().getFullYear()} Clickpoint Innovations • All rights reserved
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-between">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified Gmail SMTP Dispatch
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={sendingEmail}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail || !customSubject.trim() || !customMessage.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors shadow-md"
              >
                {sendingEmail ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <SendHorizontal className="h-3.5 w-3.5" />
                    Send Email Now
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
