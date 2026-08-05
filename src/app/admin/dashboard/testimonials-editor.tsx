"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { createPortal } from "react-dom";
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
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  User,
  Calendar,
} from "lucide-react";
import { DEFAULT_TESTIMONIALS_PAGE_DATA } from "@/data/default-testimonials-data";
import { TestimonialItem, TestimonialsPageContent } from "@/types";

function getInitials(name: string): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

interface TestimonialsEditorProps {
  sectionId: string | null;
  onCloseSection?: () => void;
  selectedItemId?: string | null;
  onClearSelectedItem?: () => void;
}

export default function TestimonialsEditor({ sectionId, onCloseSection, selectedItemId, onClearSelectedItem }: TestimonialsEditorProps) {
  const [formData, setFormData] = useState<TestimonialsPageContent>(DEFAULT_TESTIMONIALS_PAGE_DATA);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [filterTab, setFilterTab] = useState<"ALL" | "UNREAD" | "APPROVED">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialItem | null>(null);

  async function loadTestimonialsData(isInitial = false) {
    try {
      const res = await fetch("/api/testimonials?includePending=true");
      const json = await res.json();
      if (json.success && json.data) {
        if (isInitial) {
          const loadedHero = json.data.hero || {};
          const loadedMetrics: any = json.data.metrics || {};

          setFormData({
            hero: {
              badge: loadedHero.badge || DEFAULT_TESTIMONIALS_PAGE_DATA.hero.badge,
              title: loadedHero.title || DEFAULT_TESTIMONIALS_PAGE_DATA.hero.title,
              subtitle: loadedHero.subtitle || DEFAULT_TESTIMONIALS_PAGE_DATA.hero.subtitle,
            },
            metrics: {
              averageRating: loadedMetrics.averageRating || "4.9 / 5.0",
              totalReviews: loadedMetrics.totalReviews || "350+",
              satisfactionRate: loadedMetrics.satisfactionRate || "99.4%",
              recommendationRate: loadedMetrics.recommendationRate || "98%",
            },
          });
        }

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
    loadTestimonialsData(true);

    const interval = setInterval(() => {
      loadTestimonialsData(false);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedItemId) return;
    const found = testimonials.find((t) => t.id === selectedItemId);
    if (found) {
      setSelectedTestimonial(found);
      if (!found.isRead) handleMarkRead(found.id);
    }
    onClearSelectedItem?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId, testimonials]);

  async function handleSaveHeader(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Saving Testimonials page content & metrics to database...");

    const payloadToSave: TestimonialsPageContent = {
      hero: {
        badge: formData.hero?.badge || DEFAULT_TESTIMONIALS_PAGE_DATA.hero.badge,
        title: formData.hero?.title || DEFAULT_TESTIMONIALS_PAGE_DATA.hero.title,
        subtitle: formData.hero?.subtitle || DEFAULT_TESTIMONIALS_PAGE_DATA.hero.subtitle,
      },
      metrics: {
        averageRating: (formData.metrics as any)?.averageRating || "4.9 / 5.0",
        totalReviews: (formData.metrics as any)?.totalReviews || "350+",
        satisfactionRate: (formData.metrics as any)?.satisfactionRate || "99.4%",
        recommendationRate: (formData.metrics as any)?.recommendationRate || "98%",
      },
    };

    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSave),
      });

      const json = await res.json();
      if (json.success) {
        setFormData(payloadToSave);
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
        if (selectedTestimonial?.id === item.id) {
          setSelectedTestimonial({ ...selectedTestimonial, isApproved: newApprovedState, isRead: true });
        }
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
      if (item.avatarUrl) {
        fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: item.avatarUrl }),
        }).catch((err) => console.warn("Failed to delete testimonial avatar from Cloudinary:", err));
      }

      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-testimonial", id: item.id }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Deleted review from ${item.clientName}`, { id: toastId });
        if (selectedTestimonial?.id === item.id) setSelectedTestimonial(null);
        loadTestimonialsData();
      } else {
        toast.error(json.error || "Failed to delete review", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting review", { id: toastId });
    }
  }

  function handleMetricChange(index: number, field: "label" | "value", val: string) {
    const list = Array.isArray(formData.metrics) ? formData.metrics : [];
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, metrics: updated });
  }

  function handleAddMetric() {
    const list = Array.isArray(formData.metrics) ? formData.metrics : [];
    const updated = [...list, { label: "New Metric", value: "100%" }];
    setFormData({ ...formData, metrics: updated });
  }

  function handleRemoveMetric(index: number) {
    const list = Array.isArray(formData.metrics) ? formData.metrics : [];
    const updated = list.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, metrics: updated });
  }

  const filteredItems = testimonials.filter((item) => {
    if (filterTab === "UNREAD") return !item.isRead || !item.isApproved;
    if (filterTab === "APPROVED") return item.isApproved;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filteredItems.slice(startIndex, startIndex + pageSize);

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
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-4 sm:p-8 space-y-3">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-violet-600 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center">Loading Testimonials database records...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-4 sm:space-y-6 text-slate-900 dark:text-white">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 overflow-hidden p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
              Testimonials & Reviews Configurator (/testimonials)
            </h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <BellRing className="h-3 w-3" />
                {unreadCount} Unread Review(s)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure dynamic page titles, badges, rating statistics, and moderate client reviews in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_TESTIMONIALS_PAGE_DATA)}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveHeader}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-1.5"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Content"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO & METRICS CONFIGURATOR */}
      {showHeroSection && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #01
              </span>
              <h3 className="text-xs sm:text-sm font-bold">
                Testimonials Hero Banner, Badges & Overall Rating Metrics
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-violet-500 shrink-0" />
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
                <Type className="h-3.5 w-3.5 text-violet-500 shrink-0" />
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

            <div className="md:col-span-2">
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

          {/* RATING METRICS BAR CONFIGURATOR */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <h4 className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
                  Rating Stats & Trust Metrics Bar
                </h4>
              </div>

              <button
                type="button"
                onClick={handleAddMetric}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 text-xs font-bold transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Metric Stat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {(Array.isArray(formData.metrics) ? formData.metrics : []).map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19] space-y-2.5 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
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

      {/* SECTION 2: TABULAR TESTIMONIALS MODERATION PANEL */}
      {showReviewsSection && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-xs">
          {/* Section Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-xs sm:text-sm font-bold">
                Client Reviews Moderation ({testimonials.length} Submissions)
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setFilterTab("ALL");
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterTab === "ALL"
                      ? "bg-violet-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All ({testimonials.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilterTab("UNREAD");
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterTab === "UNREAD"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <span>Pending</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilterTab("APPROVED");
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterTab === "APPROVED"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Live ({testimonials.filter((t) => t.isApproved).length})
                </button>
              </div>

              {/* Page Size Selector */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 shrink-0"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* TABULAR REVIEWS LIST */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 p-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl sm:rounded-2xl">
              <MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                No review submissions found in this category.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4">Client Details</th>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {pageItems.map((item) => {
                    const initials = getInitials(item.clientName);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (!item.isRead) handleMarkRead(item.id);
                          setSelectedTestimonial(item);
                        }}
                        className={`group transition-colors cursor-pointer ${
                          !item.isRead
                            ? "bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/70 dark:hover:bg-amber-950/40 font-semibold"
                            : item.isApproved
                            ? "bg-white dark:bg-[#131927] hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                            : "bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        {/* Avatar & Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-800 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs">
                              {item.avatarUrl ? (
                                <Image src={item.avatarUrl} alt={item.clientName} fill className="object-cover" />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold truncate max-w-[120px] sm:max-w-none">
                                  {item.clientName}
                                </span>
                                {!item.isRead && (
                                  <span className="shrink-0 px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-amber-500 text-white rounded">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-none">
                                {item.userEmail || "No email provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Company & Role */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          <div>
                            <span className="text-violet-600 dark:text-violet-400 font-bold block truncate max-w-[120px] sm:max-w-none">
                              {item.clientRole || "Client"}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[120px] sm:max-w-none block">
                              {item.company || "Independent"}
                            </span>
                          </div>
                        </td>

                        {/* Star Rating */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <div className="flex text-amber-400">
                              {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 ml-1">
                              {item.rating}.0
                            </span>
                          </div>
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {item.isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" />
                              Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (!item.isRead) handleMarkRead(item.id);
                                setSelectedTestimonial(item);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800 transition-colors"
                              title="View Feedback"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleApprove(item)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                item.isApproved
                                  ? "text-emerald-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                              }`}
                              title={item.isApproved ? "Unpublish Review" : "Approve & Publish"}
                            >
                              {item.isApproved ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION & SEE MORE CONTROLS */}
          {filteredItems.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
                Showing <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-slate-900 dark:text-white">{Math.min(startIndex + pageSize, filteredItems.length)}</span>{" "}
                of <span className="font-bold text-slate-900 dark:text-white">{filteredItems.length}</span> reviews
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-xs font-bold px-2 text-slate-700 dark:text-slate-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* "See More" Button */}
                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setPageSize((prev) => prev + 10)}
                    className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>See More</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED TESTIMONIAL (portal) */}
      {selectedTestimonial &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-xs">
                    {selectedTestimonial.avatarUrl ? (
                      <Image
                        src={selectedTestimonial.avatarUrl}
                        alt={selectedTestimonial.clientName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span>{getInitials(selectedTestimonial.clientName)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold truncate">
                      {selectedTestimonial.clientName}
                    </h3>
                    <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold truncate">
                      {selectedTestimonial.clientRole}, {selectedTestimonial.company}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTestimonial(null);
                    onClearSelectedItem?.();
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-[#0b0f19] p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Rating</span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold mt-0.5">
                    {Array.from({ length: selectedTestimonial.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                    <span className="text-slate-700 dark:text-slate-300 font-extrabold ml-1">
                      {selectedTestimonial.rating}.0
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Live Status</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedTestimonial.isApproved ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Published Live</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold">Pending Approval</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">User Email</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 break-all">
                    {selectedTestimonial.userEmail || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Submitted On</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedTestimonial.createdAt
                      ? new Date(selectedTestimonial.createdAt).toLocaleString()
                      : "Recently"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Client Review Feedback:
                </span>
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic max-h-48 sm:max-h-60 overflow-y-auto font-medium">
                  "{selectedTestimonial.content}"
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <span className="text-[10px] font-mono text-slate-400 text-center sm:text-left">
                  IP: {selectedTestimonial.ipAddress || "127.0.0.1"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleApprove(selectedTestimonial)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedTestimonial.isApproved
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {selectedTestimonial.isApproved ? "Unpublish Review" : "Approve & Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleDelete(selectedTestimonial);
                      onClearSelectedItem?.();
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}