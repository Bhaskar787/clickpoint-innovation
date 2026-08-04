"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  Upload,
  Image as ImageIcon,
  Milestone,
  Calendar,
  Camera,
  Quote,
  Sparkles,
  Tag,
  CheckCircle2,
  Award,
} from "lucide-react";
import { DEFAULT_JOURNEY_PAGE_DATA } from "@/data/default-journey-data";
import { JourneyPageContent, TimelineEra, EventItem } from "@/types";

interface JourneyEditorProps {
  sectionId?: string;
}

export default function JourneyEditor({ sectionId }: JourneyEditorProps) {
  const [formData, setFormData] = useState<JourneyPageContent>(DEFAULT_JOURNEY_PAGE_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [newCategoryInput, setNewCategoryInput] = useState<string>("");

  function handleAddCategory() {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    const current = formData.eventCategories?.length
      ? formData.eventCategories
      : DEFAULT_JOURNEY_PAGE_DATA.eventCategories || [];

    if (current.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`Category "${trimmed}" already exists!`);
      return;
    }
    setFormData({ ...formData, eventCategories: [...current, trimmed] });
    setNewCategoryInput("");
    toast.success(`Category tag "${trimmed}" created!`);
  }

  function handleUpdateCategory(index: number, newName: string) {
    const current = [...(formData.eventCategories?.length ? formData.eventCategories : DEFAULT_JOURNEY_PAGE_DATA.eventCategories || [])];
    current[index] = newName;
    setFormData({ ...formData, eventCategories: current });
  }

  function handleRemoveCategory(index: number) {
    const current = [...(formData.eventCategories?.length ? formData.eventCategories : DEFAULT_JOURNEY_PAGE_DATA.eventCategories || [])];
    const removedName = current[index];
    const updated = current.filter((_, i) => i !== index);
    setFormData({ ...formData, eventCategories: updated });
    toast.info(`Category tag "${removedName}" deleted.`);
  }

  useEffect(() => {
    async function loadJourneyData() {
      try {
        const res = await fetch("/api/journey");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData({
            hero: { ...DEFAULT_JOURNEY_PAGE_DATA.hero, ...json.data.hero },
            landingTimelineHeader: { ...DEFAULT_JOURNEY_PAGE_DATA.landingTimelineHeader, ...json.data.landingTimelineHeader },
            metricsBar: json.data.metricsBar?.length ? json.data.metricsBar : DEFAULT_JOURNEY_PAGE_DATA.metricsBar,
            eras: json.data.eras?.length ? json.data.eras : DEFAULT_JOURNEY_PAGE_DATA.eras,
            eventCategories: json.data.eventCategories?.length ? json.data.eventCategories : DEFAULT_JOURNEY_PAGE_DATA.eventCategories,
            events: json.data.events?.length ? json.data.events : DEFAULT_JOURNEY_PAGE_DATA.events,
            eventsSection: { ...DEFAULT_JOURNEY_PAGE_DATA.eventsSection, ...json.data.eventsSection },
            ethosSection: { ...DEFAULT_JOURNEY_PAGE_DATA.ethosSection, ...json.data.ethosSection },
            ctaSection: { ...DEFAULT_JOURNEY_PAGE_DATA.ctaSection, ...json.data.ctaSection },
          });
        }
      } catch (err) {
        toast.error("Failed to load journey page data");
      } finally {
        setIsLoading(false);
      }
    }
    loadJourneyData();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    const toastId = toast.loading("Saving Journey Page content to database...");

    try {
      const res = await fetch("/api/journey", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Journey Page updated successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save Journey Page data", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving Journey Page data", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  function handleResetToDefaults() {
    if (confirm("Are you sure you want to reset all Journey Page content to defaults?")) {
      setFormData(DEFAULT_JOURNEY_PAGE_DATA);
      toast.info("Reset to default journey data. Click Save to persist changes.");
    }
  }

  // Helper to trigger background deletion of Cloudinary media
  async function triggerCloudinaryDelete(url: string) {
    if (!url || typeof url !== "string") return;
    if (url.includes("res.cloudinary.com") || url.startsWith("/uploads/")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      } catch (err) {
        console.warn("Background deletion request failed:", err);
      }
    }
  }

  // Cloudinary image uploader handler with auto-deletion of previous photo
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, previousUrl?: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    const toastId = toast.loading("Uploading photo to Cloudinary...");

    try {
      const fd = new FormData();
      fd.append("file", file);
      if (previousUrl) {
        fd.append("previousUrl", previousUrl);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (json.success && json.url) {
        if (fieldKey.startsWith("era-")) {
          const eraIdx = parseInt(fieldKey.replace("era-", ""), 10);
          handleUpdateEra(eraIdx, "imageUrl", json.url);
        } else if (fieldKey.startsWith("event-")) {
          const eventIdx = parseInt(fieldKey.replace("event-", ""), 10);
          handleUpdateEvent(eventIdx, "imageUrl", json.url);
        }
        toast.success("Photo uploaded successfully! (Previous media cleaned from Cloudinary)", { id: toastId });
      } else {
        toast.error(json.error || "Failed to upload image", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Error uploading image", { id: toastId });
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  }

  // Helper functions for Eras (Timeline Node Sequence)
  function handleUpdateEra(index: number, field: keyof TimelineEra, value: any) {
    const updated = [...(formData.eras || DEFAULT_JOURNEY_PAGE_DATA.eras)];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, eras: updated });
  }

  function handleAddEra() {
    const newEra: TimelineEra = {
      id: `era-${Date.now()}`,
      yearRange: "2027",
      displayYear: "2027",
      title: "Future Expansion Era",
      subtitle: "Autonomous Cloud Pods",
      narrativeParagraphs: ["Enter story description for this new milestone..."],
      quoteText: "Innovation accelerates every day.",
      quoteAuthor: "Engineering Leadership",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      stats: [{ label: "Team Members", value: "200+" }],
      achievements: ["Achieved new tech milestone"],
    };
    setFormData({ ...formData, eras: [...formData.eras, newEra] });
  }

  function handleRemoveEra(index: number) {
    const targetEra = formData.eras[index];
    if (targetEra?.imageUrl) {
      triggerCloudinaryDelete(targetEra.imageUrl);
    }
    const updated = formData.eras.filter((_, i) => i !== index);
    setFormData({ ...formData, eras: updated });
  }

  function handleMoveEra(index: number, direction: "UP" | "DOWN") {
    const list = [...formData.eras];
    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({ ...formData, eras: list });
  }

  // Helper functions for Events (Gallery Cards Sequence)
  function handleUpdateEvent(index: number, field: keyof EventItem, value: any) {
    const updated = [...(formData.events || DEFAULT_JOURNEY_PAGE_DATA.events)];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, events: updated });
  }

  function handleAddEvent() {
    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title: "New Tech Event 2026",
      subtitle: "Global AI Keynote",
      category: "Tech Summits",
      date: "October 12, 2026",
      location: "Kathmandu & Virtual Stream",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      colSpanDesktop: "lg:col-span-1",
      heightClass: "h-[360px]",
      attendees: "500+ Attendees",
      keyMetric: "5 Demos",
      highlights: ["Keynote talk on Next.js & AI", "Live sandbox workshops"],
      fullStory: "Description of the event narrative...",
    };
    setFormData({ ...formData, events: [...formData.events, newEvent] });
  }

  function handleRemoveEvent(index: number) {
    const targetEvent = formData.events[index];
    if (targetEvent?.imageUrl) {
      triggerCloudinaryDelete(targetEvent.imageUrl);
    }
    const updated = formData.events.filter((_, i) => i !== index);
    setFormData({ ...formData, events: updated });
  }

  function handleMoveEvent(index: number, direction: "UP" | "DOWN") {
    const list = [...formData.events];
    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({ ...formData, events: list });
  }

  const isLandingTimeline = sectionId === "timeline" || sectionId === "landing-timeline";
  const showHeroSection = (!sectionId || sectionId === "journey-hero" || sectionId === "01" || sectionId === "journey-page") && !isLandingTimeline;
  const showErasSection = !sectionId || sectionId === "journey-eras" || sectionId === "02" || sectionId === "journey-page" || isLandingTimeline;
  const showEventsSection = (!sectionId || sectionId === "journey-modal" || sectionId === "events" || sectionId === "03" || sectionId === "journey-page") && !isLandingTimeline;
  const showEthosSection = (!sectionId || sectionId === "journey-ethos" || sectionId === "04" || sectionId === "journey-page") && !isLandingTimeline;
  const showLandingHeader = isLandingTimeline;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-3">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Journey Page content records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Milestone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Company Journey & Events Configurator (/journey)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage milestone eras, historical timeline story nodes, Cloudinary photo gallery, and event summits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO & METRICS BAR */}
      {showHeroSection && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Journey Page Hero Banner & Counter Metrics Bar
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Hero Badge Tag
              </label>
              <input
                type="text"
                value={formData.hero?.badge || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, badge: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={formData.hero?.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Hero Subtitle / Description Narrative
              </label>
              <textarea
                rows={2}
                value={formData.hero?.subtitle || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Hero Counter Metrics Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Top Stats Counter Metrics Bar (4 Counter Cards)
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {formData.metricsBar.map((mb, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <input
                    type="text"
                    value={mb.value}
                    placeholder="Value (e.g. 150+)"
                    onChange={(e) => {
                      const updated = [...formData.metricsBar];
                      updated[idx].value = e.target.value;
                      setFormData({ ...formData, metricsBar: updated });
                    }}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-violet-600 font-extrabold"
                  />
                  <input
                    type="text"
                    value={mb.label}
                    placeholder="Label (e.g. Active Team)"
                    onChange={(e) => {
                      const updated = [...formData.metricsBar];
                      updated[idx].label = e.target.value;
                      setFormData({ ...formData, metricsBar: updated });
                    }}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                  <input
                    type="text"
                    value={mb.sublabel || ""}
                    placeholder="Sublabel (e.g. 100% Shipped)"
                    onChange={(e) => {
                      const updated = [...formData.metricsBar];
                      updated[idx].sublabel = e.target.value;
                      setFormData({ ...formData, metricsBar: updated });
                    }}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-[11px] text-slate-500 font-medium"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION LANDING TIMELINE HEADER (BOX #06) */}
      {showLandingHeader && (
        <div className="rounded-2xl border border-blue-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #06
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Home Page (#06 Timeline & Journey Section Header & CTA)
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Landing Page Badge Tag (e.g. Our Journey)
              </label>
              <input
                type="text"
                value={formData.landingTimelineHeader?.badge || "Our Journey"}
                onChange={(e) => {
                  const currentHeader = formData.landingTimelineHeader || {
                    badge: "Our Journey",
                    title: "From a 4-person studio to an AI-first partner",
                    subtitle: "A decade of engineering excellence, technical milestones, and continuous growth.",
                    ctaText: "Explore Complete Company Journey & Events Gallery",
                  };
                  setFormData({
                    ...formData,
                    landingTimelineHeader: { ...currentHeader, badge: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Landing Page Main Headline
              </label>
              <input
                type="text"
                value={formData.landingTimelineHeader?.title || "From a 4-person studio to an AI-first partner"}
                onChange={(e) => {
                  const currentHeader = formData.landingTimelineHeader || {
                    badge: "Our Journey",
                    title: "From a 4-person studio to an AI-first partner",
                    subtitle: "A decade of engineering excellence, technical milestones, and continuous growth.",
                    ctaText: "Explore Complete Company Journey & Events Gallery",
                  };
                  setFormData({
                    ...formData,
                    landingTimelineHeader: { ...currentHeader, title: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Landing Page Subtitle / Narrative
              </label>
              <textarea
                rows={2}
                value={
                  formData.landingTimelineHeader?.subtitle ||
                  "A decade of engineering excellence, technical milestones, and continuous growth."
                }
                onChange={(e) => {
                  const currentHeader = formData.landingTimelineHeader || {
                    badge: "Our Journey",
                    title: "From a 4-person studio to an AI-first partner",
                    subtitle: "A decade of engineering excellence, technical milestones, and continuous growth.",
                    ctaText: "Explore Complete Company Journey & Events Gallery",
                  };
                  setFormData({
                    ...formData,
                    landingTimelineHeader: { ...currentHeader, subtitle: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                CTA Button Text (e.g. Explore Complete Company Journey & Events Gallery)
              </label>
              <input
                type="text"
                value={
                  formData.landingTimelineHeader?.ctaText ||
                  "Explore Complete Company Journey & Events Gallery"
                }
                onChange={(e) => {
                  const currentHeader = formData.landingTimelineHeader || {
                    badge: "Our Journey",
                    title: "From a 4-person studio to an AI-first partner",
                    subtitle: "A decade of engineering excellence, technical milestones, and continuous growth.",
                    ctaText: "Explore Complete Company Journey & Events Gallery",
                  };
                  setFormData({
                    ...formData,
                    landingTimelineHeader: { ...currentHeader, ctaText: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: HISTORICAL ERA NODES MANAGER */}
      {showErasSection && (
        <div className="rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-violet-50/20 to-white dark:from-[#131927] dark:to-[#131927] p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-violet-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Historical Timeline Milestone Era Nodes ({formData.eras?.length || 0} Total Eras)
              </h3>
            </div>

            <button
              type="button"
              onClick={handleAddEra}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Era Milestone</span>
            </button>
          </div>

          <div className="space-y-6">
            {formData.eras.map((era, idx) => (
              <div
                key={era.id || idx}
                className="p-5 rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#0b0f19] space-y-4 shadow-xs relative group"
              >
                {/* Era Control Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-100 dark:bg-violet-950 px-2.5 py-1 rounded-lg">
                      Era #{idx + 1} ({era.displayYear})
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
                      {era.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveEra(idx, "UP")}
                      title="Move Era Up"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === formData.eras.length - 1}
                      onClick={() => handleMoveEra(idx, "DOWN")}
                      title="Move Era Down"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveEra(idx)}
                      title="Delete Era Node"
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Year Range (e.g. 2016 - 2017)
                    </label>
                    <input
                      type="text"
                      value={era.yearRange}
                      onChange={(e) => handleUpdateEra(idx, "yearRange", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Display Year Button Label (e.g. 2016s)
                    </label>
                    <input
                      type="text"
                      value={era.displayYear}
                      onChange={(e) => handleUpdateEra(idx, "displayYear", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Era Title
                    </label>
                    <input
                      type="text"
                      value={era.title}
                      onChange={(e) => handleUpdateEra(idx, "title", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={era.subtitle}
                      onChange={(e) => handleUpdateEra(idx, "subtitle", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Quote Author
                    </label>
                    <input
                      type="text"
                      value={era.quoteAuthor || ""}
                      placeholder="e.g. Founding Engineering Team"
                      onChange={(e) => handleUpdateEra(idx, "quoteAuthor", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Quote Text
                  </label>
                  <input
                    type="text"
                    value={era.quoteText || ""}
                    placeholder="Key quote for this era..."
                    onChange={(e) => handleUpdateEra(idx, "quoteText", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Story Narrative Paragraphs (Separate paragraphs with new line)
                  </label>
                  <textarea
                    rows={3}
                    value={era.narrativeParagraphs?.join("\n\n") || ""}
                    onChange={(e) =>
                      handleUpdateEra(
                        idx,
                        "narrativeParagraphs",
                        e.target.value.split("\n\n").filter((p) => p.trim())
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* Cloudinary Image Uploader Widget */}
                <div className="p-3.5 rounded-xl border border-violet-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-violet-600" />
                    Era Photo Image (Cloudinary Upload)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={era.imageUrl}
                      onChange={(e) => handleUpdateEra(idx, "imageUrl", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                    />
                    <label className="shrink-0 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                      {uploadingField === `era-${idx}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="h-3.5 w-3.5" />
                      )}
                      <span>Upload Cloudinary Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, `era-${idx}`, era.imageUrl)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: COMPANY CULTURE & EVENTS GALLERY MANAGER */}
      {showEventsSection && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #03
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Company Culture & Events Gallery ({formData.events?.length || 0} Total Events)
              </h3>
            </div>

            <button
              type="button"
              onClick={handleAddEvent}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Event Card</span>
            </button>
          </div>

          {/* GALLERY SECTION HEADING (Badge, Title, Subtitle) */}
          <div className="p-4 rounded-xl border border-violet-100 dark:border-slate-800 bg-violet-50/40 dark:bg-[#0b0f19] space-y-3">
            <h4 className="text-xs font-extrabold text-violet-700 dark:text-violet-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Camera className="h-3.5 w-3.5 text-violet-600" />
              Gallery Section Heading
            </h4>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Badge Text
              </label>
              <input
                type="text"
                value={formData.eventsSection?.badge ?? DEFAULT_JOURNEY_PAGE_DATA.eventsSection!.badge}
                onChange={(e) => {
                  const current = formData.eventsSection || DEFAULT_JOURNEY_PAGE_DATA.eventsSection!;
                  setFormData({
                    ...formData,
                    eventsSection: { ...current, badge: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Title
              </label>
              <input
                type="text"
                value={formData.eventsSection?.title ?? DEFAULT_JOURNEY_PAGE_DATA.eventsSection!.title}
                onChange={(e) => {
                  const current = formData.eventsSection || DEFAULT_JOURNEY_PAGE_DATA.eventsSection!;
                  setFormData({
                    ...formData,
                    eventsSection: { ...current, title: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.eventsSection?.subtitle ?? DEFAULT_JOURNEY_PAGE_DATA.eventsSection!.subtitle}
                onChange={(e) => {
                  const current = formData.eventsSection || DEFAULT_JOURNEY_PAGE_DATA.eventsSection!;
                  setFormData({
                    ...formData,
                    eventsSection: { ...current, subtitle: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* DYNAMIC CATEGORY TAGS MANAGER */}
          <div className="p-4 rounded-xl border border-violet-100 dark:border-slate-800 bg-violet-50/40 dark:bg-[#0b0f19] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-violet-700 dark:text-violet-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Tag className="h-3.5 w-3.5 text-violet-600" />
                  Dynamic Event Category Tags ({formData.eventCategories?.length || 0} Total Tags)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Manage categories. New tags automatically populate the event dropdown select options in real time.
                </p>
              </div>

              {/* Add New Category Form */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  placeholder="New Tag Name (e.g. AI Expo)"
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1 text-xs text-slate-900 dark:text-white font-semibold"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>

            {/* List of Category Tags */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-violet-200/60 dark:border-slate-800">
              {(formData.eventCategories?.length
                ? formData.eventCategories
                : DEFAULT_JOURNEY_PAGE_DATA.eventCategories || []
              ).map((catName, cIdx) => (
                <div
                  key={cIdx}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 shadow-xs"
                >
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => handleUpdateCategory(cIdx, e.target.value)}
                    className="bg-transparent border-none p-0 text-xs font-extrabold focus:ring-0 text-violet-700 dark:text-violet-300 w-24 sm:w-32"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cIdx)}
                    className="p-0.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete Category Tag"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {formData.events.map((evt, idx) => (
              <div
                key={evt.id || idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19] space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-100 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                      Event #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
                      {evt.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveEvent(idx, "UP")}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.events.length - 1}
                      onClick={() => handleMoveEvent(idx, "DOWN")}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(idx)}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={evt.title}
                      onChange={(e) => handleUpdateEvent(idx, "title", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={evt.subtitle}
                      onChange={(e) => handleUpdateEvent(idx, "subtitle", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Category Tag
                    </label>
                    <select
                      value={evt.category}
                      onChange={(e) => handleUpdateEvent(idx, "category", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    >
                      {(formData.eventCategories?.length
                        ? formData.eventCategories
                        : DEFAULT_JOURNEY_PAGE_DATA.eventCategories || []
                      ).map((catOpt) => (
                        <option key={catOpt} value={catOpt}>
                          {catOpt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Event Date (e.g. November 14, 2025)
                    </label>
                    <input
                      type="text"
                      value={evt.date}
                      onChange={(e) => handleUpdateEvent(idx, "date", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Event Location
                    </label>
                    <input
                      type="text"
                      value={evt.location}
                      onChange={(e) => handleUpdateEvent(idx, "location", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Key Metric Badge (e.g. 4 Keynote Demos)
                    </label>
                    <input
                      type="text"
                      value={evt.keyMetric || ""}
                      onChange={(e) => handleUpdateEvent(idx, "keyMetric", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Full Story Description
                  </label>
                  <textarea
                    rows={2}
                    value={evt.fullStory}
                    onChange={(e) => handleUpdateEvent(idx, "fullStory", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* Cloudinary Image Uploader Widget */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                    Event Cover Image (Cloudinary Upload)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={evt.imageUrl}
                      onChange={(e) => handleUpdateEvent(idx, "imageUrl", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                    />
                    <label className="shrink-0 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                      {uploadingField === `event-${idx}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="h-3.5 w-3.5" />
                      )}
                      <span>Upload Cloudinary Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, `event-${idx}`, evt.imageUrl)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION ENGINEERING ETHOS (4 PILLARS) */}
      {showEthosSection && (
        <div className="rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
              #04
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              Engineering Ethos & 4 Operating Pillars (Journey Page Only)
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Ethos Badge Tag (e.g. Engineering Ethos)
              </label>
              <input
                type="text"
                value={formData.ethosSection?.badge || "Engineering Ethos"}
                onChange={(e) => {
                  const current = formData.ethosSection || DEFAULT_JOURNEY_PAGE_DATA.ethosSection!;
                  setFormData({
                    ...formData,
                    ethosSection: { ...current, badge: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Section Main Title
              </label>
              <input
                type="text"
                value={formData.ethosSection?.title || "The 4 Pillars That Guide"}
                onChange={(e) => {
                  const current = formData.ethosSection || DEFAULT_JOURNEY_PAGE_DATA.ethosSection!;
                  setFormData({
                    ...formData,
                    ethosSection: { ...current, title: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Title Highlighted Text
              </label>
              <input
                type="text"
                value={formData.ethosSection?.highlightText || "Our Work"}
                onChange={(e) => {
                  const current = formData.ethosSection || DEFAULT_JOURNEY_PAGE_DATA.ethosSection!;
                  setFormData({
                    ...formData,
                    ethosSection: { ...current, highlightText: e.target.value },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold text-violet-600"
              />
            </div>
          </div>

          {/* 4 Pillars Manager */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              The 4 Operating Pillars Cards
            </h4>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {(formData.ethosSection?.pillars || DEFAULT_JOURNEY_PAGE_DATA.ethosSection?.pillars || []).map((pillar, idx) => (
                <div key={pillar.id || idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-mono text-[10px] font-extrabold text-violet-600 bg-violet-100 dark:bg-violet-950 px-2 py-0.5 rounded">
                    Pillar #{idx + 1}
                  </span>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pillar Title</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const currentEthos = formData.ethosSection || DEFAULT_JOURNEY_PAGE_DATA.ethosSection!;
                        const updatedPillars = [...(currentEthos.pillars || [])];
                        updatedPillars[idx] = { ...updatedPillars[idx], title: e.target.value };
                        setFormData({
                          ...formData,
                          ethosSection: { ...currentEthos, pillars: updatedPillars },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Description Narrative</label>
                    <textarea
                      rows={3}
                      value={pillar.description}
                      onChange={(e) => {
                        const currentEthos = formData.ethosSection || DEFAULT_JOURNEY_PAGE_DATA.ethosSection!;
                        const updatedPillars = [...(currentEthos.pillars || [])];
                        updatedPillars[idx] = { ...updatedPillars[idx], description: e.target.value };
                        setFormData({
                          ...formData,
                          ethosSection: { ...currentEthos, pillars: updatedPillars },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CALL TO ACTION */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Journey Bottom Call-To-Action (CTA) Section
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
              CTA Header Title
            </label>
            <input
              type="text"
              value={formData.ctaSection?.title || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ctaSection: { ...formData.ctaSection, title: e.target.value } as any,
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
              CTA Button Text
            </label>
            <input
              type="text"
              value={formData.ctaSection?.buttonText || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ctaSection: { ...formData.ctaSection, buttonText: e.target.value } as any,
                })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}