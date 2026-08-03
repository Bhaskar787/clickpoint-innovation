"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Tag,
  Type,
  Loader2,
  MessageSquare,
  BellRing,
  BarChart3,
} from "lucide-react";
import { DEFAULT_TESTIMONIALS_PAGE_DATA } from "@/data/default-testimonials-data";
import { TestimonialItem, TestimonialsPageContent } from "@/types";

function getInitials(name: string): string {
  if (!name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

interface TestimonialsEditorProps {
  sectionId: string | null;
  onCloseSection?: () => void;
}

export default function TestimonialsEditor({ sectionId, onCloseSection }: TestimonialsEditorProps) {
  const [formData, setFormData] = useState<TestimonialsPageContent>(DEFAULT_TESTIMONIALS_PAGE_DATA);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [filterTab, setFilterTab] = useState<"ALL" | "UNREAD" | "APPROVED">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadTestimonialsData() {
    try {
      const res = await fetch("/api/testimonials?includePending=true");
      const json = await res.json();
      if (json.success && json.data) {
        setFormData({
          hero: json.data.hero || DEFAULT_TESTIMONIALS_PAGE_DATA.hero,
          metrics: json.data.metrics || DEFAULT_TESTIMONIALS_PAGE_DATA.metrics,
        });

        const list = json.data.testimonials || [];
        setTestimonials(list);
        setUnreadCount(json.data.unreadCount || 0);
      }
    } catch (err: any) {
      toast.error("Failed to load testimonials content.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonialsData();

    const interval = setInterval(() => {
      loadTestimonialsData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  async function handleSaveHeader() {
    setIsSaving(true);
    const toastId = toast.loading("Saving Testimonials page content & metrics to database...");

    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Testimonials headers & rating metrics updated successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save content.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleApprove(item: TestimonialItem) {
    const newApprovedState = !item.isApproved;
    const toastId = toast.loading(`${newApprovedState ? "Approving" : "Unpublishing"} review...`);

    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-testimonial",
          id: item.id,
          isApproved: newApprovedState,
          isRead: true,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(
          newApprovedState
            ? `Approved review from ${item.clientName}! Published live on website.`
            : `Unpublished review from ${item.clientName}.`,
          { id: toastId }
        );
        loadTestimonialsData();
      } else {
        toast.error(json.error || "Failed to update review", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating review", { id: toastId });
    }
  }

  async function handleMarkRead(id: string) {
    try {
      await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-testimonial", id, isRead: true }),
      });
      loadTestimonialsData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(item: TestimonialItem) {
    if (!confirm(`Are you sure you want to delete review from "${item.clientName}"?`)) return;

    const toastId = toast.loading("Deleting review...");
    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-testimonial", id: item.id }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Deleted review from ${item.clientName}`, { id: toastId });
        loadTestimonialsData();
      } else {
        toast.error(json.error || "Failed to delete review", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting review", { id: toastId });
    }
  }

  function handleMetricChange(index: number, field: "label" | "value", val: string) {
    const updated = [...(formData.metrics || [])];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, metrics: updated });
  }

  function handleAddMetric() {
    const updated = [...(formData.metrics || []), { label: "New Metric", value: "100%" }];
    setFormData({ ...formData, metrics: updated });
  }

  function handleRemoveMetric(index: number) {
    const updated = (formData.metrics || []).filter((_, i) => i !== index);
    setFormData({ ...formData, metrics: updated });
  }

  const filteredItems = testimonials.filter((item) => {
    if (filterTab === "UNREAD") return !item.isRead || !item.isApproved;
    if (filterTab === "APPROVED") return item.isApproved;
    return true;
  });

  const showHeroSection =
    !sectionId ||
    sectionId === "test-hero" ||
    sectionId === "testi-hero" ||
    sectionId === "01" ||
    sectionId === "testimonials";

  const showReviewsSection =
    !sectionId ||
    sectionId === "test-list" ||
    sectionId === "testi-reviews" ||
    sectionId === "02" ||
    sectionId === "testimonials";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-3">
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Testimonials database records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Testimonials & Reviews Configurator (/testimonials)
            </h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <BellRing className="h-3 w-3" />
                {unreadCount} Unread Review(s)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure dynamic page titles, badges, rating statistics, and moderate client reviews in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_TESTIMONIALS_PAGE_DATA)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveHeader}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Content"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 100% DYNAMIC PAGE HEADER & RATING METRICS CONFIGURATOR */}
      {showHeroSection && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #01
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Testimonials Hero Banner, Badges & Overall Rating Metrics
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-violet-500" />
                Hero Badge Tag
              </label>
              <input
                type="text"
                value={formData.hero?.badge || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, badge: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-violet-500" />
                Main Header Title
              </label>
              <input
                type="text"
                value={formData.hero?.title || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={formData.hero?.subtitle || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Feedback Modal Button Label
              </label>
              <input
                type="text"
                value={formData.hero?.reviewModalButtonText || "Give Review / Feedback"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, reviewModalButtonText: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* DYNAMIC RATING METRICS BAR CONFIGURATOR */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Rating Stats & Trust Metrics Bar
                </h4>
              </div>

              <button
                type="button"
                onClick={handleAddMetric}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 text-xs font-bold transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Metric Stat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(formData.metrics || []).map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19] space-y-2.5 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove metric"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Stat Value (e.g. 4.9 / 5.0, 350+, 89%)
                    </label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-1.5 text-xs font-extrabold text-violet-600 dark:text-violet-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Stat Label Description
                    </label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131927] px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CLIENT REVIEWS GRID & MODERATION PANEL */}
      {showReviewsSection && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Client Reviews Grid & Moderation Panel ({testimonials.length} Submissions)
              </h3>
            </div>

            {/* Moderation Filter Tabs */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterTab("ALL")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterTab === "ALL"
                    ? "bg-violet-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                All ({testimonials.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("UNREAD")}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterTab === "UNREAD"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                }`}
              >
                <span>Pending / Unread</span>
                {unreadCount > 0 && <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px]">{unreadCount}</span>}
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("APPROVED")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterTab === "APPROVED"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                }`}
              >
                Approved Live ({testimonials.filter((t) => t.isApproved).length})
              </button>
            </div>
          </div>

          {/* Testimonial Submissions List */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                <MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No review submissions in this view.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const initials = getInitials(item.clientName);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.isRead) handleMarkRead(item.id);
                    }}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      !item.isRead
                        ? "border-amber-400 bg-amber-50/20 dark:bg-amber-950/20 ring-1 ring-amber-400/40"
                        : item.isApproved
                        ? "border-emerald-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-800 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                          {item.avatarUrl ? (
                            <Image src={item.avatarUrl} alt={item.clientName} fill className="object-cover" />
                          ) : (
                            <span>{initials}</span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {item.clientName}
                            </h4>
                            {!item.isRead && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-white animate-pulse">
                                New Feedback
                              </span>
                            )}
                            {item.isApproved && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                Live on Website
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold">
                            {item.clientRole}, {item.company}
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Rating & Controls */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-xs font-extrabold ml-1 text-amber-700 dark:text-amber-300">
                            {item.rating}.0
                          </span>
                        </div>

                        {/* Approve Toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleApprove(item);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-xs ${
                            item.isApproved
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-slate-200 dark:bg-slate-800 hover:bg-emerald-600 text-slate-700 dark:text-slate-300 hover:text-white"
                          }`}
                        >
                          {item.isApproved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          <span>{item.isApproved ? "Approved (Live)" : "Approve & Publish"}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          className="p-1.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Review Body Statement */}
                    <div className="p-3 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic">
                      "{item.content}"
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recently"}</span>
                      <span>IP: {item.ipAddress || "127.0.0.1"} {item.userEmail ? `| ${item.userEmail}` : ""}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}
