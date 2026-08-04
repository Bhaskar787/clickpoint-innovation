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
  AlertTriangle,
  Tag,
  Type,
  Link2,
  MousePointerClick,
  Hash,
  Palette,
} from "lucide-react";
import { NotFoundPageContent, NotFoundActionLink } from "@/types";
import { DEFAULT_NOT_FOUND_DATA } from "@/data/default-not-found-data";

const ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "arrow-left", label: "Arrow Left" },
  { value: "arrow-right", label: "Arrow Right" },
  { value: "home", label: "Home" },
  { value: "compass", label: "Compass" },
  { value: "search", label: "Search" },
  { value: "phone", label: "Phone" },
  { value: "mail", label: "Mail" },
  { value: "file-question", label: "File Question" },
  { value: "sparkles", label: "Sparkles" },
  { value: "help-circle", label: "Help Circle" },
  { value: "briefcase", label: "Briefcase" },
  { value: "grid", label: "Grid" },
];

const STYLE_OPTIONS: { value: NotFoundActionLink["style"]; label: string }[] = [
  { value: "primary", label: "Primary (Solid)" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost (Text)" },
];

function makeActionId() {
  return `action-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface NotFoundPageEditorProps {
  sectionId?: string | null;
  onCloseSection?: () => void;
}

export default function NotFoundPageEditor({ sectionId, onCloseSection }: NotFoundPageEditorProps) {
  const [formData, setFormData] = useState<NotFoundPageContent>(DEFAULT_NOT_FOUND_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data from DB
  useEffect(() => {
    async function loadNotFoundData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/not-found");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData({
            hero: { ...DEFAULT_NOT_FOUND_DATA.hero, ...json.data.hero },
            actions: json.data.actions?.length ? json.data.actions : DEFAULT_NOT_FOUND_DATA.actions,
          });
        }
      } catch (error) {
        console.error("Failed to load 404 page content:", error);
        toast.error("Failed to load 404 page content from database.");
      } finally {
        setIsLoading(false);
      }
    }
    loadNotFoundData();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    const toastId = toast.loading("Saving 404 page content to database...");
    try {
      const res = await fetch("/api/not-found", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("404 page saved to database successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save changes to database", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Save failed: " + (err?.message || "Server error"), { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("Are you sure you want to reset all 404 page content to defaults?")) return;

    setFormData(DEFAULT_NOT_FOUND_DATA);
    const toastId = toast.loading("Resetting content in database...");
    try {
      const res = await fetch("/api/not-found", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_NOT_FOUND_DATA),
      });
      const json = await res.json();
      if (json.success) {
        toast.info("Reset to default 404 page content!", { id: toastId });
      }
    } catch {
      toast.error("Failed to reset content", { id: toastId });
    }
  }

  function handleAddAction() {
    const newAction: NotFoundActionLink = {
      id: makeActionId(),
      label: "New Quick Link",
      href: "/",
      icon: "arrow-right",
      style: "outline",
      order: formData.actions.length + 1,
    };
    setFormData({ ...formData, actions: [...formData.actions, newAction] });
    toast.success("Added new navigation link!");
  }

  function handleUpdateAction(index: number, patch: Partial<NotFoundActionLink>) {
    const updated = [...formData.actions];
    updated[index] = { ...updated[index], ...patch };
    setFormData({ ...formData, actions: updated });
  }

  function handleRemoveAction(index: number) {
    const removed = formData.actions[index];
    const updated = formData.actions.filter((_, i) => i !== index);
    setFormData({ ...formData, actions: updated });
    toast.info(`Removed link "${removed.label}".`);
  }

  function handleMoveAction(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.actions.length) return;
    const updated = [...formData.actions];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    updated.forEach((a, i) => (a.order = i + 1));
    setFormData({ ...formData, actions: updated });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] gap-3 bg-white dark:bg-[#131927] rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center">Loading 404 Page data from database...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6 text-slate-900 dark:text-white">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131927] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            Editing 404 Error Page Content
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure the badge tag, error code, headline, subtitle, and every recovery navigation link dynamically.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: 404 HERO & BLUEPRINT GRID */}
      {(!sectionId || sectionId === "404-hero") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-xs sm:text-sm font-bold">
              404 Error Hero Badge, Error Code, Titles & Subtitle
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Eyebrow Badge Tag
              </label>
              <input
                type="text"
                value={formData.hero.eyebrowBadge}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero, eyebrowBadge: e.target.value } })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Hash className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Error Code (e.g. 404)
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.hero.errorCode}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero, errorCode: e.target.value } })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Main Headline Title
              </label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={3}
                value={formData.hero.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: QUICK ACTION NAVIGATION LINKS */}
      {(!sectionId || sectionId === "404-links") && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-xs sm:text-sm font-bold">
                Quick Action Navigation Links ({formData.actions.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={handleAddAction}
              className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Link
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {formData.actions.map((action, index) => (
              <div
                key={action.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Link #{index + 1}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveAction(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveAction(index, "down")}
                      disabled={index === formData.actions.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveAction(index)}
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Remove link"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <MousePointerClick className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={action.label}
                      onChange={(e) => handleUpdateAction(index, { label: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <Link2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      Link URL (href)
                    </label>
                    <input
                      type="text"
                      value={action.href}
                      onChange={(e) => handleUpdateAction(index, { href: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Icon
                    </label>
                    <select
                      value={action.icon}
                      onChange={(e) => handleUpdateAction(index, { icon: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <Palette className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      Button Style
                    </label>
                    <select
                      value={action.style}
                      onChange={(e) =>
                        handleUpdateAction(index, { style: e.target.value as NotFoundActionLink["style"] })
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      {STYLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {formData.actions.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                No navigation links yet — click &quot;Add Link&quot; to create one.
              </p>
            )}
          </div>
        </div>
      )}

      {onCloseSection && sectionId && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCloseSection}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to all section boxes
          </button>
        </div>
      )}
    </div>
  );
}