"use client";

import { useState, useEffect, useMemo } from "react";
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
  Tag,
  CheckCircle2,
  Award,
  Folder,
  FolderPlus,
  FolderOpen,
  ArrowLeft,
  Edit3,
  X,
  Eye,
  ExternalLink,
  ChevronRight,
  Layers,
  LayoutGrid,
  Check,
  MapPin,
} from "lucide-react";
import { DEFAULT_JOURNEY_PAGE_DATA } from "@/data/default-journey-data";
import { JourneyPageContent, TimelineEra, EventItem } from "@/types";
import {
  SectionNavSidebar,
  SectionNavItem,
} from "@/components/admin/dashboard/section-nav-sidebar";

export const JOURNEY_SECTIONS_CATALOG: SectionNavItem[] = [
  {
    id: "journey-hero",
    number: "01",
    title: "Journey Hero & Stats Bar",
    subtitle: "Badge, title, subtitle & key historical metrics bar",
    icon: Milestone,
    badge: "Hero & Stats",
  },
  {
    id: "journey-eras",
    number: "02",
    title: "Timeline Eras Manager",
    subtitle: "Era date ranges, milestones, story copy & preview images",
    icon: Calendar,
    badge: "Eras",
  },
  {
    id: "journey-events",
    number: "03",
    title: "Culture & Events Gallery",
    subtitle: "Event summits, dynamic category filters & photo media",
    icon: Tag,
    badge: "Events",
  },
  {
    id: "journey-ethos",
    number: "04",
    title: "Engineering Ethos & Pillars",
    subtitle: "Core guiding philosophy, badge & 4 pillars breakdown",
    icon: Award,
    badge: "Ethos",
  },
  {
    id: "journey-cta",
    number: "05",
    title: "Call To Action Banner",
    subtitle: "Bottom conversion headline, badge & primary button link",
    icon: CheckCircle2,
    badge: "Banner CTA",
  },
  {
    id: "landing-timeline",
    number: "06",
    title: "Home Timeline Header & CTA",
    subtitle: "Landing page #07 timeline section header copy & sync",
    icon: Milestone,
    badge: "Home Sync",
  },
];

interface JourneyEditorProps {
  sectionId?: string | null;
  onCloseSection?: () => void;
}

export default function JourneyEditor({ sectionId, onCloseSection }: JourneyEditorProps) {
  const [formData, setFormData] = useState<JourneyPageContent>(DEFAULT_JOURNEY_PAGE_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [editingCoverEvent, setEditingCoverEvent] = useState<{
    event: EventItem;
    isNew: boolean;
    index?: number;
  } | null>(null);
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState<string>("");

  function autoSaveToDatabase(dataToSave: JourneyPageContent) {
    fetch("/api/journey", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    })
      .then((res) => res.json())
      .catch((err) => console.error("Auto-save error:", err));
  }

  async function handleUploadCoverImage(file: File) {
    if (!file || !editingCoverEvent) return;
    setUploadingField("cover-image");
    const toastId = toast.loading("Uploading cover image to Cloudinary...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        const curImages =
          editingCoverEvent.event.images && editingCoverEvent.event.images.length > 0
            ? [...editingCoverEvent.event.images]
            : [];
        if (!curImages.includes(json.url)) {
          curImages.unshift(json.url);
        }
        setEditingCoverEvent({
          ...editingCoverEvent,
          event: {
            ...editingCoverEvent.event,
            imageUrl: json.url,
            images: curImages,
          },
        });
        toast.success("Cover image uploaded!", { id: toastId });
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed", { id: toastId });
    } finally {
      setUploadingField(null);
    }
  }

  function handleOpenCreateFolder() {
    setEditingCoverEvent({
      isNew: true,
      event: {
        id: `folder-${Date.now()}`,
        title: "",
        subtitle: "",
        category: "Events",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        location: "Kathmandu & Virtual Stream",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"],
        colSpanDesktop: "lg:col-span-1",
        heightClass: "h-[360px]",
        attendees: "",
        keyMetric: "",
        highlights: [],
        fullStory: "",
      },
    });
  }

  function handleOpenEditCover(evt: EventItem, index: number) {
    setEditingCoverEvent({
      isNew: false,
      index,
      event: { ...evt },
    });
  }

  function handleSaveCoverEvent() {
    if (!editingCoverEvent) return;
    const { event, isNew, index } = editingCoverEvent;
    if (!event.title.trim()) {
      toast.error("Please enter a Gallery Folder title");
      return;
    }

    const images = event.images && event.images.length > 0 ? event.images : [event.imageUrl];
    const finalEvent: EventItem = {
      ...event,
      imageUrl: event.imageUrl || images[0] || "",
      images,
    };

    let nextEvents = [...formData.events];
    if (isNew) {
      nextEvents.push(finalEvent);
      toast.success(`Gallery Folder "${finalEvent.title}" created!`);
    } else if (typeof index === "number") {
      nextEvents[index] = finalEvent;
      toast.success(`Gallery Folder "${finalEvent.title}" updated!`);
    }

    const nextFormData = { ...formData, events: nextEvents };
    setFormData(nextFormData);
    setEditingCoverEvent(null);
    autoSaveToDatabase(nextFormData);

    if (isNew) {
      setSelectedFolderId(finalEvent.id);
    }
  }

  function handleDeleteFolderById(folderId: string) {
    const target = formData.events.find((e) => e.id === folderId);
    if (!confirm(`Delete Gallery Folder "${target?.title || "this folder"}" and all its photos?`)) return;

    if (target?.imageUrl) {
      triggerCloudinaryDelete(target.imageUrl);
    }
    const nextEvents = formData.events.filter((e) => e.id !== folderId);
    const nextFormData = { ...formData, events: nextEvents };
    setFormData(nextFormData);
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
    toast.info("Gallery folder deleted.");
    autoSaveToDatabase(nextFormData);
  }

  async function handleUploadPhotosToFolder(files: File[], folderId: string) {
    if (files.length === 0) return;
    setUploadingField("studio-photo");
    const total = files.length;
    const toastId = toast.loading(`Uploading ${total} ${total === 1 ? "photo" : "photos"} to Cloudinary...`);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < total; i++) {
        const file = files[i];
        if (total > 1) {
          toast.loading(`Uploading photo ${i + 1} of ${total}...`, { id: toastId });
        }
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.success && json.url) {
          uploadedUrls.push(json.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const updatedEvents = formData.events.map((evt) => {
          if (evt.id !== folderId) return evt;
          const curImages = evt.images && evt.images.length > 0 ? [...evt.images] : [evt.imageUrl];
          for (const u of uploadedUrls) {
            if (!curImages.includes(u)) curImages.push(u);
          }
          return {
            ...evt,
            imageUrl: evt.imageUrl || curImages[0] || "",
            images: curImages,
          };
        });

        const nextFormData = { ...formData, events: updatedEvents };
        setFormData(nextFormData);
        toast.success(`Added ${uploadedUrls.length} ${uploadedUrls.length === 1 ? "photo" : "photos"} to gallery!`, { id: toastId });
        autoSaveToDatabase(nextFormData);
      } else {
        toast.error("Failed to upload photos", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photos", { id: toastId });
    } finally {
      setUploadingField(null);
    }
  }

  function handleAddPhotoUrlsToFolder(rawUrls: string, folderId: string) {
    const urls = rawUrls
      .split(/[\n,\s]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/"));

    if (urls.length === 0) {
      toast.error("Please enter a valid image URL (e.g. https://...)");
      return;
    }

    const updatedEvents = formData.events.map((evt) => {
      if (evt.id !== folderId) return evt;
      const curImages = evt.images && evt.images.length > 0 ? [...evt.images] : [evt.imageUrl];
      for (const u of urls) {
        if (!curImages.includes(u)) curImages.push(u);
      }
      return {
        ...evt,
        imageUrl: evt.imageUrl || curImages[0] || "",
        images: curImages,
      };
    });

    const nextFormData = { ...formData, events: updatedEvents };
    setFormData(nextFormData);
    setNewPhotoUrlInput("");
    toast.success(`Added ${urls.length} photo(s) to gallery!`);
    autoSaveToDatabase(nextFormData);
  }

  function handleAddSamplePhotosToFolder(folderId: string) {
    const samplePhotos = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
    ];

    const updatedEvents = formData.events.map((evt) => {
      if (evt.id !== folderId) return evt;
      const curImages = evt.images && evt.images.length > 0 ? [...evt.images] : [evt.imageUrl];
      for (const p of samplePhotos) {
        if (!curImages.includes(p)) curImages.push(p);
      }
      return {
        ...evt,
        imageUrl: evt.imageUrl || curImages[0] || "",
        images: curImages,
      };
    });

    const nextFormData = { ...formData, events: updatedEvents };
    setFormData(nextFormData);
    toast.success("Added sample photos to gallery!");
    autoSaveToDatabase(nextFormData);
  }

  function handleSetFolderCoverPhoto(photoUrl: string, folderId: string) {
    const updatedEvents = formData.events.map((evt) => {
      if (evt.id !== folderId) return evt;
      return {
        ...evt,
        imageUrl: photoUrl,
      };
    });
    const nextFormData = { ...formData, events: updatedEvents };
    setFormData(nextFormData);
    toast.info("Cover photo set!");
    autoSaveToDatabase(nextFormData);
  }

  function handleRemovePhotoFromFolder(photoUrl: string, folderId: string) {
    const updatedEvents = formData.events.map((evt) => {
      if (evt.id !== folderId) return evt;
      const curImages = (evt.images || []).filter((p) => p !== photoUrl);
      let nextCover = evt.imageUrl;
      if (nextCover === photoUrl) {
        nextCover = curImages[0] || "";
      }
      return {
        ...evt,
        imageUrl: nextCover,
        images: curImages,
      };
    });
    const nextFormData = { ...formData, events: updatedEvents };
    setFormData(nextFormData);
    toast.info("Photo removed from gallery.");
    autoSaveToDatabase(nextFormData);
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
          if (formData.events[eventIdx]) {
            const nextEvents = [...formData.events];
            nextEvents[eventIdx] = {
              ...nextEvents[eventIdx],
              imageUrl: json.url,
            };
            const nextData = { ...formData, events: nextEvents };
            setFormData(nextData);
            autoSaveToDatabase(nextData);
          }
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

  const resolveSectionId = (secId: string | null | undefined): string => {
    if (!secId) return "journey-hero";
    if (secId === "timeline" || secId === "landing-timeline" || secId === "06") return "landing-timeline";
    if (secId === "01" || secId === "journey-hero" || secId === "journey-page") return "journey-hero";
    if (secId === "02" || secId === "journey-eras" || secId === "eras") return "journey-eras";
    if (secId === "03" || secId === "journey-modal" || secId === "events" || secId === "journey-events") return "journey-events";
    if (secId === "04" || secId === "journey-ethos" || secId === "ethos") return "journey-ethos";
    if (secId === "05" || secId === "journey-cta" || secId === "cta") return "journey-cta";
    return "journey-hero";
  };

  const [activeSectionId, setActiveSectionId] = useState<string>(() => resolveSectionId(sectionId));

  useEffect(() => {
    if (sectionId) {
      setActiveSectionId(resolveSectionId(sectionId));
    }
  }, [sectionId]);

  const sectionsWithCounts: SectionNavItem[] = useMemo(() => {
    return JOURNEY_SECTIONS_CATALOG.map((sec) => {
      if (sec.id === "journey-eras") {
        return { ...sec, badge: `${formData.eras?.length || 0} Eras` };
      }
      if (sec.id === "journey-events") {
        if (selectedFolderId !== null) {
          const cur = formData.events?.find((e) => e.id === selectedFolderId);
          return {
            ...sec,
            badge: cur ? `${cur.images?.length || 1} Photos` : `${formData.events?.length || 0} Folders`,
          };
        }
        return { ...sec, badge: `${formData.events?.length || 0} Folders` };
      }
      return sec;
    });
  }, [formData.eras?.length, formData.events, selectedFolderId]);

  const currentSectionMeta =
    sectionsWithCounts.find((s) => s.id === activeSectionId) || sectionsWithCounts[0];
  const SectionIcon = currentSectionMeta.icon || Milestone;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-4 sm:p-8 space-y-3">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center">
          Loading Journey Page content records...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 text-slate-900 dark:text-white">
      {/* 2-Column Master-Detail Selection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Selector */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-4">
          <SectionNavSidebar
            title="Journey Sections"
            sections={sectionsWithCounts}
            activeSectionId={activeSectionId}
            onSelectSection={(id) => {
              if (id !== "journey-events") {
                setSelectedFolderId(null);
              }
              setActiveSectionId(id);
            }}
            accentColor="violet"
          />
        </div>

        {/* Right Column: Active Section Editor Workspace */}
        <div className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-5">
          {/* Active Section Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {activeSectionId === "journey-events" && selectedFolderId !== null ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedFolderId(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer mr-2 shadow-xs border border-slate-200 dark:border-slate-700"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Folders</span>
                    </button>
                    <span className="font-mono text-xs font-black text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20 shrink-0">
                      #03 Studio
                    </span>
                    <FolderOpen className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                      {formData.events.find((e) => e.id === selectedFolderId)?.title || "Photos Studio"}
                    </h3>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-xs font-black text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20 shrink-0">
                      #{currentSectionMeta.number}
                    </span>
                    <SectionIcon className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                      {currentSectionMeta.title}
                    </h3>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {activeSectionId === "journey-events" && selectedFolderId !== null
                  ? `Dedicated Photos Studio • ${formData.events.find((e) => e.id === selectedFolderId)?.images?.length || 1} photos in this album`
                  : currentSectionMeta.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {activeSectionId === "journey-events" && selectedFolderId !== null ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = formData.events.find((e) => e.id === selectedFolderId);
                      const idx = formData.events.findIndex((e) => e.id === selectedFolderId);
                      if (cur) handleOpenEditCover(cur, idx);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-violet-600" />
                    <span>Edit Cover & Story</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFolderById(selectedFolderId)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Delete this entire folder"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Folder</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Defaults</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 sm:px-5 sm:py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: HERO & METRICS BAR */}
          {activeSectionId === "journey-hero" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-xs sm:text-sm font-bold">
              Journey Page Hero Banner & Counter Metrics Bar
            </h3>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
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
            <h4 className="text-[10px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Top Stats Counter Metrics Bar (4 Counter Cards)
            </h4>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      {activeSectionId === "landing-timeline" && (
        <div className="rounded-xl sm:rounded-2xl border border-blue-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #06
            </span>
            <h3 className="text-xs sm:text-sm font-bold">
              Home Page (#06 Timeline & Journey Section Header & CTA)
            </h3>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
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
      {activeSectionId === "journey-eras" && (
        <div className="rounded-xl sm:rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-violet-50/20 to-white dark:from-[#131927] dark:to-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-violet-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                Historical Timeline Milestone Era Nodes ({formData.eras?.length || 0} Total Eras)
              </h3>
            </div>

            <button
              type="button"
              onClick={handleAddEra}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Era Milestone</span>
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {formData.eras.map((era, idx) => (
              <div
                key={era.id || idx}
                className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#0b0f19] space-y-3 sm:space-y-4 shadow-xs relative group"
              >
                {/* Era Control Bar */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-100 dark:bg-violet-950 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shrink-0">
                      Era #{idx + 1} ({era.displayYear})
                    </span>
                    <span className="text-xs font-bold truncate">
                      {era.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
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
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors ml-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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

                  <div className="sm:col-span-2 md:col-span-1">
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

                <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
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

                {/* Dynamic Era Metric Badges (3 Badges) */}
                <div className="p-3 sm:p-3.5 rounded-xl border border-violet-100 dark:border-slate-800 bg-violet-50/40 dark:bg-slate-900/50 space-y-2">
                  <label className="text-[11px] font-bold text-violet-700 dark:text-violet-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Award className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                    Era Key Stats / Badges (e.g. "4 Engineers", "12 Shipped", "100% TDD")
                  </label>
                  <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3">
                    {(era.stats?.length ? era.stats : [
                      { value: "4 Engineers", label: "Engineers", sublabel: "Founding Team" },
                      { value: "12 Shipped", label: "Shipped", sublabel: "First Year MVPs" },
                      { value: "100% TDD", label: "TDD", sublabel: "Core Protocol" }
                    ]).map((st, stIdx) => (
                      <div key={stIdx} className="p-2.5 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
                        <span className="text-[10px] font-extrabold text-violet-600 dark:text-violet-400 uppercase">Stat #{stIdx + 1}</span>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase block">Big Value (e.g. 4 Engineers)</label>
                          <input
                            type="text"
                            value={st.value || ""}
                            placeholder="e.g. 4 Engineers"
                            onChange={(e) => {
                              const currentEras = [...formData.eras];
                              const currentStats = [...(currentEras[idx].stats || [])];
                              if (!currentStats[stIdx]) currentStats[stIdx] = { value: "", label: "", sublabel: "" };
                              currentStats[stIdx] = { ...currentStats[stIdx], value: e.target.value };
                              currentEras[idx].stats = currentStats;
                              setFormData({ ...formData, eras: currentEras });
                            }}
                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-violet-600 dark:text-violet-300 font-extrabold"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block">Sublabel / Tag (e.g. Founding Team)</label>
                          <input
                            type="text"
                            value={st.sublabel || st.label || ""}
                            placeholder="e.g. Founding Team"
                            onChange={(e) => {
                              const currentEras = [...formData.eras];
                              const currentStats = [...(currentEras[idx].stats || [])];
                              if (!currentStats[stIdx]) currentStats[stIdx] = { value: "", label: "", sublabel: "" };
                              currentStats[stIdx] = { ...currentStats[stIdx], sublabel: e.target.value, label: e.target.value };
                              currentEras[idx].stats = currentStats;
                              setFormData({ ...formData, eras: currentEras });
                            }}
                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 font-semibold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
                <div className="p-3 sm:p-3.5 rounded-xl border border-violet-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                    Era Photo Image (Cloudinary Upload)
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={era.imageUrl}
                      onChange={(e) => handleUpdateEra(idx, "imageUrl", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full sm:flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                    />
                    <label className="shrink-0 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
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

            {/* SECTION 3: COMPANY CULTURE & EVENTS GALLERY */}
      {activeSectionId === "journey-events" && (
        <>
{/* SECTION 3: COMPANY CULTURE & EVENTS GALLERY */}
      {activeSectionId === "journey-events" && (
        selectedFolderId === null ? (
          /* ================= VIEW 1: ALL GALLERY FOLDERS OVERVIEW PAGE ================= */
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-xs">
            {/* Header & Quick Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                  #03
                </span>
                <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                  <Folder className="h-4 w-4 text-amber-500 fill-amber-500/20 shrink-0" />
                  <span>Company Culture & Events Gallery Folders</span>
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[11px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                  <Folder className="h-3.5 w-3.5 text-amber-500 fill-current" />
                  <span>{formData.events?.length || 0} Gallery Folders</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-[11px] font-bold text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/60">
                  <Camera className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  <span>
                    {formData.events?.reduce((acc, evt) => acc + (evt.images?.length || 1), 0)} Photos Total
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenCreateFolder}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer ml-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Folder</span>
                </button>
              </div>
            </div>

            {/* Public Gallery Section Header Settings (Badge, Title, Subtitle) */}
            <div className="p-4 rounded-xl border border-violet-100 dark:border-slate-800 bg-violet-50/30 dark:bg-[#0b0f19] space-y-3">
              <h4 className="text-[10px] sm:text-xs font-extrabold text-violet-700 dark:text-violet-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Camera className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                Public Gallery Section Header Settings
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

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Title Prefix Text
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
                    Title Highlighted Text (Orange Accent)
                  </label>
                  <input
                    type="text"
                    value={formData.eventsSection?.highlightText ?? DEFAULT_JOURNEY_PAGE_DATA.eventsSection!.highlightText}
                    onChange={(e) => {
                      const current = formData.eventsSection || DEFAULT_JOURNEY_PAGE_DATA.eventsSection!;
                      setFormData({
                        ...formData,
                        eventsSection: { ...current, highlightText: e.target.value },
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-amber-600 dark:text-amber-400 font-extrabold"
                  />
                </div>
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

            {/* Grid of All Gallery Folders */}
            <div className="space-y-4">
              {formData.events.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[4px] bg-slate-50/50 dark:bg-slate-900/20">
                  <Folder className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Gallery Folders Found</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Create your first folder to add an event album with cover details and multiple photos for the client-side events page.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenCreateFolder}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <FolderPlus className="h-4 w-4" />
                    <span>Create Your First Folder</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.events.map((evt, idx) => {
                    const photosCount = evt.images && evt.images.length > 0 ? evt.images.length : (evt.imageUrl ? 1 : 0);
                    return (
                      <div
                        key={evt.id || idx}
                        className="rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/70 overflow-hidden shadow-xs hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-md transition-all group flex flex-col"
                      >
                        {/* Cover Image & Count Badge */}
                        <div
                          onClick={() => setSelectedFolderId(evt.id)}
                          className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                          title="Click to open photos studio"
                        >
                          <img
                            src={evt.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                          {/* Top Tag & Photos Counter */}
                          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                            <span className="px-2 py-0.5 rounded-[4px] bg-violet-600/95 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1 shadow-xs">
                              <Folder className="h-3 w-3" />
                              Folder
                            </span>
                            <span className="px-2 py-0.5 rounded-[4px] bg-black/80 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5 shadow-xs border border-white/10">
                              <Camera className="h-3 w-3 text-cyan-400" />
                              {photosCount} {photosCount === 1 ? "Photo" : "Photos"}
                            </span>
                          </div>

                          {/* Hover Overlay Hint */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white text-slate-900 text-xs font-bold shadow-lg">
                              <FolderOpen className="h-3.5 w-3.5 text-violet-600" />
                              Open Photos Studio
                            </span>
                          </div>
                        </div>

                        {/* Folder Info */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                          <div>
                            <h4
                              onClick={() => setSelectedFolderId(evt.id)}
                              className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 cursor-pointer transition-colors"
                              title={evt.title}
                            >
                              {evt.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {evt.subtitle || "No subtitle"}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5 truncate">
                              <Calendar className="h-3 w-3 text-violet-500 shrink-0" />
                              <span className="truncate">{evt.date || "Ongoing"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="h-3 w-3 text-amber-500 shrink-0" />
                              <span className="truncate">{evt.location || "Kathmandu"}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedFolderId(evt.id)}
                              className="flex-1 py-1.5 px-2 rounded-[4px] bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                            >
                              <FolderOpen className="h-3.5 w-3.5" />
                              <span>Photos ({photosCount})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditCover(evt, idx)}
                              title="Edit Cover Details & Story"
                              className="p-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteFolderById(evt.id)}
                              title="Delete Folder"
                              className="p-1.5 rounded-[4px] border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= VIEW 2: DEDICATED INDIVIDUAL PHOTOS STUDIO PAGE ================= */
          (() => {
            const currentFolder = formData.events.find((e) => e.id === selectedFolderId);
            if (!currentFolder) {
              return (
                <div className="p-8 text-center bg-white dark:bg-[#131927] rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Folder not found.</p>
                  <button
                    type="button"
                    onClick={() => setSelectedFolderId(null)}
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Return to All Folders
                  </button>
                </div>
              );
            }

            const folderIdx = formData.events.findIndex((e) => e.id === currentFolder.id);
            const photos = currentFolder.images && currentFolder.images.length > 0
              ? currentFolder.images
              : (currentFolder.imageUrl ? [currentFolder.imageUrl] : []);

            return (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* 1. Studio Top Navigation Bar */}
                <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedFolderId(null)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-xs border border-slate-200 dark:border-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to All Folders</span>
                    </button>

                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                        <FolderOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                            {currentFolder.title}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[11px] font-bold">
                            {photos.length} {photos.length === 1 ? "Photo" : "Photos"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Individual Photos Studio & Album Manager
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCover(currentFolder, folderIdx)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-violet-600" />
                      <span>Edit Cover & Story</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFolderById(currentFolder.id)}
                      className="p-2 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      title="Delete entire folder"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Cover Photo & Story Details Banner Card */}
                <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center gap-5 shadow-xs">
                  <div className="relative w-full sm:w-56 h-36 rounded-[4px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    <img
                      src={currentFolder.imageUrl || photos[0] || ""}
                      alt={currentFolder.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[4px] bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-emerald-400 shadow-xs flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Cover Photo
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {currentFolder.title}
                      </h5>
                      {currentFolder.keyMetric && (
                        <span className="px-2.5 py-0.5 rounded-[4px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                          {currentFolder.keyMetric}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {currentFolder.subtitle || "No subtitle provided"}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="inline-flex items-center gap-1.5 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-violet-500" />
                        {currentFolder.date || "Date not set"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        {currentFolder.location || "Location not set"}
                      </span>
                    </div>

                    {currentFolder.fullStory && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        {currentFolder.fullStory}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1 italic">
                      Tip: This cover card and story are displayed on the public /events page. Click any photo below to set it as the cover.
                    </p>
                  </div>
                </div>

                {/* 3. DEDICATED SEPARATE ADD IMAGE SECTION CARD */}
                <div className="rounded-xl sm:rounded-2xl border border-violet-200/90 dark:border-violet-900/60 bg-white dark:bg-[#131927] p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <Upload className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        <span>Add Pictures to this Gallery Folder</span>
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Upload batch files, enter image URLs, or load sample pictures. Newly added photos are automatically saved to database and live immediately on /events.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSamplePhotosToFolder(currentFolder.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Sample Photos</span>
                    </button>
                  </div>

                  {/* Batch File Upload Area */}
                  <div className="relative border-2 border-dashed border-violet-300 dark:border-violet-700/80 rounded-xl p-6 text-center hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-colors bg-slate-50/50 dark:bg-slate-900/40">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleUploadPhotosToFolder(Array.from(e.target.files), currentFolder.id);
                          e.target.value = "";
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {uploadingField === "studio-photo" ? (
                        <>
                          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
                          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">
                            Uploading photos to Cloudinary...
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                            <Camera className="h-6 w-6" />
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                            Click or drag & drop multiple photos to upload
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Supports JPG, PNG, WEBP, GIF. Uploads directly to Cloudinary and saves to folder.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Direct Image URL Input */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Or paste image URL (e.g. https://images.unsplash.com/...)"
                        value={newPhotoUrlInput}
                        onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddPhotoUrlsToFolder(newPhotoUrlInput, currentFolder.id);
                          }
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-medium focus:border-violet-500 outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddPhotoUrlsToFolder(newPhotoUrlInput, currentFolder.id)}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* 4. GALLERY PHOTOS ROSTER CARD */}
                <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-violet-600" />
                      <span>All Photos in this Album ({photos.length})</span>
                    </h5>
                    <span className="text-[11px] text-slate-500">
                      Click "Set Cover" on any photo to make it the album cover card.
                    </span>
                  </div>

                  {photos.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                      <Camera className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">No photos added to this folder yet.</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Use the upload box above or click "Add Sample Photos" to get started.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {photos.map((photoUrl, pIdx) => {
                        const isCover = photoUrl === currentFolder.imageUrl;
                        return (
                          <div
                            key={pIdx}
                            className={`relative group rounded-[4px] overflow-hidden border transition-all flex flex-col bg-slate-100 dark:bg-slate-800 ${
                              isCover
                                ? "border-emerald-500 ring-2 ring-emerald-500/30"
                                : "border-slate-200 dark:border-slate-700 hover:border-violet-400"
                            }`}
                          >
                            <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                              <img
                                src={photoUrl}
                                alt={`Photo ${pIdx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Cover Badge */}
                              {isCover ? (
                                <div className="absolute top-1.5 left-1.5">
                                  <span className="px-1.5 py-0.5 rounded-[4px] bg-emerald-600 text-[10px] font-black uppercase text-white shadow-xs flex items-center gap-1">
                                    <Check className="h-2.5 w-2.5" />
                                    Cover
                                  </span>
                                </div>
                              ) : (
                                <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => handleSetFolderCoverPhoto(photoUrl, currentFolder.id)}
                                    className="px-2 py-0.5 rounded-[4px] bg-black/80 hover:bg-emerald-600 text-[10px] font-bold text-white shadow-xs transition-colors cursor-pointer"
                                  >
                                    Set Cover
                                  </button>
                                </div>
                              )}

                              {/* Delete Photo Button */}
                              <button
                                type="button"
                                onClick={() => handleRemovePhotoFromFolder(photoUrl, currentFolder.id)}
                                title="Delete photo from album"
                                className="absolute top-1.5 right-1.5 p-1 rounded-[4px] bg-red-600/90 hover:bg-red-700 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="p-1.5 bg-white dark:bg-slate-900 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                              <span className="font-mono">#{pIdx + 1}</span>
                              {isCover ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Album Cover</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetFolderCoverPhoto(photoUrl, currentFolder.id)}
                                  className="text-violet-600 dark:text-violet-400 hover:underline font-semibold cursor-pointer"
                                >
                                  Set as cover
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )
      )}

          {/* MODAL: CREATE FOLDER OR EDIT COVER & STORY */}
          {editingCoverEvent && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <div className="bg-white dark:bg-[#131927] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full my-8 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-[4px] bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {editingCoverEvent.isNew ? "Create New Gallery Folder" : "Edit Cover & Story Details"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {editingCoverEvent.isNew
                          ? "Set folder cover details. Inside the folder you can add multiple photos."
                          : "Update the cover photo, title, date, location, and story for the events page."}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingCoverEvent(null)}
                    className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                  {/* Folder / Event Title */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Folder / Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Annual Tech Summit 2026, Clickpoint Hackathon"
                      value={editingCoverEvent.event.title}
                      onChange={(e) =>
                        setEditingCoverEvent({
                          ...editingCoverEvent,
                          event: { ...editingCoverEvent.event, title: e.target.value },
                        })
                      }
                      className="w-full rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Celebrating Innovation, Excellence & Team Spirit"
                      value={editingCoverEvent.event.subtitle}
                      onChange={(e) =>
                        setEditingCoverEvent({
                          ...editingCoverEvent,
                          event: { ...editingCoverEvent.event, subtitle: e.target.value },
                        })
                      }
                      className="w-full rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Oct 15, 2026 or Spring 2026"
                        value={editingCoverEvent.event.date}
                        onChange={(e) =>
                          setEditingCoverEvent({
                            ...editingCoverEvent,
                            event: { ...editingCoverEvent.event, date: e.target.value },
                          })
                        }
                        className="w-full rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Kathmandu & Virtual Stream"
                        value={editingCoverEvent.event.location}
                        onChange={(e) =>
                          setEditingCoverEvent({
                            ...editingCoverEvent,
                            event: { ...editingCoverEvent.event, location: e.target.value },
                          })
                        }
                        className="w-full rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Key Metric Badge */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Key Metric Badge (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500+ Attendees, 12 Finalist Teams"
                      value={editingCoverEvent.event.keyMetric || ""}
                      onChange={(e) =>
                        setEditingCoverEvent({
                          ...editingCoverEvent,
                          event: { ...editingCoverEvent.event, keyMetric: e.target.value },
                        })
                      }
                      className="w-full rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>

                  {/* Full Story / Description */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Full Story / Event Narrative
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write a short paragraph about this event. Displayed when visitors expand the card on /events."
                      value={editingCoverEvent.event.fullStory}
                      onChange={(e) =>
                        setEditingCoverEvent({
                          ...editingCoverEvent,
                          event: { ...editingCoverEvent.event, fullStory: e.target.value },
                        })
                      }
                      className="w-full rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>

                  {/* Cover Photo Setup */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Cover Image</span>
                      <span className="text-[11px] text-slate-400 font-normal">Primary card image on /events</span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="relative w-36 h-24 rounded-[4px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                        <img
                          src={editingCoverEvent.event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded-[4px] bg-black/80 text-[9px] font-bold text-white">
                          Cover Preview
                        </span>
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        {/* Upload Cover */}
                        <div className="flex items-center gap-2">
                          <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-colors border border-slate-300 dark:border-slate-700">
                            <Upload className="h-3.5 w-3.5 text-violet-600" />
                            <span>
                              {uploadingField === "cover-image" ? "Uploading to Cloudinary..." : "Upload Cover Image"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingField === "cover-image"}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUploadCoverImage(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* URL input */}
                        <input
                          type="text"
                          placeholder="Or paste cover image URL (https://...)"
                          value={editingCoverEvent.event.imageUrl}
                          onChange={(e) => {
                            const newUrl = e.target.value;
                            const curImages = editingCoverEvent.event.images && editingCoverEvent.event.images.length > 0
                              ? [...editingCoverEvent.event.images]
                              : [];
                            if (newUrl && !curImages.includes(newUrl)) {
                              curImages.unshift(newUrl);
                            }
                            setEditingCoverEvent({
                              ...editingCoverEvent,
                              event: {
                                ...editingCoverEvent.event,
                                imageUrl: newUrl,
                                images: curImages,
                              },
                            });
                          }}
                          className="w-full rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50">
                  <button
                    type="button"
                    onClick={() => setEditingCoverEvent(null)}
                    className="px-4 py-2 rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCoverEvent}
                    className="px-5 py-2 rounded-[4px] bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {editingCoverEvent.isNew ? "Create Folder & Open Studio" : "Save Cover Details"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SECTION ENGINEERING ETHOS (4 PILLARS) */}
      {activeSectionId === "journey-ethos" && (
        <div className="rounded-xl sm:rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
              #04
            </span>
            <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2">
              <Award className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
              Engineering Ethos & 4 Operating Pillars (Journey Page Only)
            </h3>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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

            <div className="sm:col-span-2 md:col-span-1">
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
            <h4 className="text-[10px] sm:text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              The 4 Operating Pillars Cards
            </h4>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {(formData.ethosSection?.pillars || DEFAULT_JOURNEY_PAGE_DATA.ethosSection?.pillars || []).map((pillar, idx) => (
                <div key={pillar.id || idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-mono text-[10px] font-extrabold text-violet-600 bg-violet-100 dark:bg-violet-950 px-2 py-0.5 rounded inline-block">
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

      {/* SECTION 5: CALL TO ACTION */}
      {activeSectionId === "journey-cta" && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #05
            </span>
            <h3 className="text-xs sm:text-sm font-bold">
              Journey Bottom Call-To-Action (CTA) Section
            </h3>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
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
      )}
        </div>
      </div>
    </div>
  );
}