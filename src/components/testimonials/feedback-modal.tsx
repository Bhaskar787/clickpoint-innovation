"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, UploadCloud, Loader2, MessageSquarePlus, CheckCircle2, User } from "lucide-react";
import { toast } from "sonner";
import { broadcastNotification } from "@/lib/realtime-notifications";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function getInitials(name: string): string {
  if (!name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export default function FeedbackModal({ isOpen, onClose, onSuccess }: FeedbackModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [company, setCompany] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading profile image to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        setAvatarUrl(data.url);
        toast.success("Profile photo uploaded!", { id: toastId });
      } else {
        toast.error(data.error || "Failed to upload photo", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!clientName.trim() || !clientRole.trim() || !company.trim() || !content.trim()) {
      toast.error("Please fill out all required fields before submitting.");
      return;
    }

    // 1. Check LocalStorage Rate Limit (1 submission per 10 seconds = 10,000 ms) for testing
    const TEN_SECONDS_MS = 10 * 1000;
    const lastSubmission = localStorage.getItem("clickpoint_last_review_time");

    if (lastSubmission) {
      const elapsed = Date.now() - parseInt(lastSubmission, 10);
      if (elapsed < TEN_SECONDS_MS) {
        const secondsRemaining = Math.ceil((TEN_SECONDS_MS - elapsed) / 1000);
        toast.error(`Rate limit reached: You can submit another review in ${secondsRemaining} second(s).`);
        return;
      }
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your review for admin approval...");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientRole,
          company,
          userEmail,
          content,
          rating,
          avatarUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Save rate limit timestamp to local storage
        localStorage.setItem("clickpoint_last_review_time", Date.now().toString());

        toast.success("Review submitted successfully! Pending admin approval.", { id: toastId });

        // Broadcast real-time event to Admin Dashboard
        broadcastNotification({
          id: data.data?.id || `review-${Date.now()}`,
          type: "REVIEW",
          category: "REVIEW",
          title: "Client Feedback Review",
          clientName: clientName.trim(),
          email: userEmail.trim() || undefined,
          subtext: `${clientRole.trim()}, ${company.trim()}`,
          content: content.trim(),
          rating,
          createdAt: new Date().toISOString(),
          targetTab: "testimonials-page",
        });

        // Reset Form
        setClientName("");
        setClientRole("");
        setCompany("");
        setUserEmail("");
        setContent("");
        setRating(5);
        setAvatarUrl("");

        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to submit review", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const initials = getInitials(clientName);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
                <MessageSquarePlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Give Review / Feedback
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Share your experience with Clickpoint Innovation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive 5-Star Rating */}
            <div className="text-center space-y-1.5 p-3 rounded-2xl bg-violet-50/50 dark:bg-slate-900/60 border border-violet-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Overall Experience Rating
              </label>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">
                {rating === 5
                  ? "⭐⭐⭐⭐⭐ 5.0 - Exceptional Product & Service!"
                  : rating === 4
                  ? "⭐⭐⭐⭐ 4.0 - Great Experience"
                  : rating === 3
                  ? "⭐⭐⭐ 3.0 - Good"
                  : "⭐⭐ 2.0 - Needs Improvement"}
              </span>
            </div>

            {/* Avatar Upload / Initial Preview */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0 h-14 w-14 rounded-full overflow-hidden border-2 border-violet-500 bg-gradient-to-tr from-violet-600 to-indigo-800 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={clientName || "Avatar"} fill className="object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-slate-800 hover:bg-violet-200 dark:hover:bg-slate-700 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all"
                  >
                    {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                    <span>{isUploading ? "Uploading..." : avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  If omitted, initials avatar (<span className="font-mono font-bold text-violet-600">{initials}</span>) will be shown.
                </p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Ashok Khanal"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientRole}
                  onChange={(e) => setClientRole(e.target.value)}
                  placeholder="e.g. Founder & CEO"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Product <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Khataflow Inc."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email (Optional)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="ashok@company.com"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Review / Feedback Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your engineering experience, ROI results, and collaboration with Clickpoint Innovation..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-md shadow-violet-600/25 transition-all"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
