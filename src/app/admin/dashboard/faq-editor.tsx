"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  Save,
  Plus,
  Trash2,
  Pencil,
  X,
  Loader2,
  HelpCircle,
  Tag,
  ArrowUp,
  ArrowDown,
  Search,
  FolderPlus,
  Check,
} from "lucide-react";
import { FaqItem } from "@/types";

interface FaqEditorProps {
  sectionId: string | null;
  onCloseSection?: () => void;
}

interface FaqCategory {
  id: string;
  name: string;
  description: string | null;
  order: number;
  _count?: { faqs: number };
}

const EMPTY_FORM = { id: "", question: "", answer: "", categoryId: "" };

export default function FaqEditor({ sectionId, onCloseSection }: FaqEditorProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Category manager state
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [editingCategory, setEditingCategory] = useState<FaqCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // FAQ Page / Section Hero Header State
  const [headerContent, setHeaderContent] = useState<any>({
    badge: "Interactive Knowledgebase",
    title: "Frequently Asked",
    titleHighlight: "Questions",
    subtitle: "Everything you need to know about our engineering pods, security, billing, and AI capabilities.",
  });
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  async function loadHeader() {
    try {
      const res = await fetch("/api/landing");
      const json = await res.json();
      if (json.success && json.data) {
        const h = json.data.faqPageHeader;
        if (h) {
          setHeaderContent({
            badge: h.badge || "Interactive Knowledgebase",
            title: h.title || "Frequently Asked",
            titleHighlight: h.titleHighlight || "Questions",
            subtitle: h.subtitle || "Everything you need to know about our engineering pods, security, billing, and AI capabilities.",
          });
        }
      }
    } catch (err) {
      console.warn("Failed to load FAQ header in editor:", err);
    }
  }

  async function handleSaveHeader() {
    try {
      setIsSavingHeader(true);
      const res = await fetch("/api/landing");
      const json = await res.json();
      const existing = json.data || {};

      const updated = {
        ...existing,
        faqPageHeader: { ...existing.faqPageHeader, ...headerContent },
      };

      const saveRes = await fetch("/api/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const saveJson = await saveRes.json();
      if (saveJson.success) {
        toast.success("Full FAQ Page (/faqs) Hero Header saved successfully!");
      } else {
        toast.error(saveJson.error || "Failed to save FAQ page header configuration.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save FAQ page header configuration.");
    } finally {
      setIsSavingHeader(false);
    }
  }

  async function loadFaqs() {
    try {
      const res = await fetch("/api/faqs");
      const json = await res.json();
      if (json.success) {
        setFaqs(json.data || []);
      } else {
        toast.error(json.error || "Failed to load FAQs.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load FAQs.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategories() {
    setIsLoadingCategories(true);
    try {
      const res = await fetch("/api/faq-categories");
      const json = await res.json();
      if (json.success) setCategories(json.data || []);
      else toast.error(json.error || "Failed to load FAQ categories.");
    } catch (err: any) {
      toast.error(err.message || "Failed to load FAQ categories.");
    } finally {
      setIsLoadingCategories(false);
    }
  }

  useEffect(() => {
    loadFaqs();
    loadCategories();
    loadHeader();
  }, []);

  const categoryFilterOptions = useMemo(() => {
    const names = categories.map((c) => c.name);
    return ["ALL", ...names];
  }, [categories]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCategory = categoryFilter === "ALL" || f.category === categoryFilter;
      const matchesSearch =
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, categoryFilter, searchQuery]);

  function openCreateForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id || "" });
    setIsFormOpen(true);
  }

  function openEditForm(faq: FaqItem) {
    setEditingId(faq.id);
    setForm({ id: faq.id, question: faq.question, answer: faq.answer, categoryId: faq.categoryId });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.question.trim() || !form.answer.trim() || !form.categoryId) {
      toast.error("Question, answer, and category are all required.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading(editingId ? "Updating FAQ..." : "Creating FAQ...");

    try {
      const res = await fetch("/api/faqs", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId
            ? { id: editingId, question: form.question, answer: form.answer, categoryId: form.categoryId }
            : { question: form.question, answer: form.answer, categoryId: form.categoryId }
        ),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(editingId ? "FAQ updated successfully!" : "FAQ created successfully!", { id: toastId });
        closeForm();
        loadFaqs();
      } else {
        toast.error(json.error || "Failed to save FAQ.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save FAQ.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(faq: FaqItem) {
    if (!confirm(`Delete "${faq.question}"? This cannot be undone.`)) return;

    const toastId = toast.loading("Deleting FAQ...");
    try {
      const res = await fetch(`/api/faqs?id=${faq.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("FAQ deleted.", { id: toastId });
        loadFaqs();
      } else {
        toast.error(json.error || "Failed to delete FAQ.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete FAQ.", { id: toastId });
    }
  }

  async function handleMove(faq: FaqItem, direction: "up" | "down") {
    const sorted = [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const index = sorted.findIndex((f) => f.id === faq.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) return;

    const current = sorted[index];
    const swapWith = sorted[swapIndex];

    const reordered = [...sorted];
    reordered[index] = { ...swapWith, order: current.order };
    reordered[swapIndex] = { ...current, order: swapWith.order };
    setFaqs(reordered);

    try {
      const res = await fetch("/api/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          items: [
            { id: current.id, order: swapWith.order },
            { id: swapWith.id, order: current.order },
          ],
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error || "Failed to reorder FAQs.");
        loadFaqs();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder FAQs.");
      loadFaqs();
    }
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    setIsSavingCategory(true);
    const toastId = toast.loading("Creating category...");
    try {
      const res = await fetch("/api/faq-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, description: newCategoryDesc, order: categories.length }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Category "${newCategoryName}" created!`, { id: toastId });
        setNewCategoryName("");
        setNewCategoryDesc("");
        await loadCategories();
      } else {
        toast.error(json.error || "Failed to create category", { id: toastId });
      }
    } catch {
      toast.error("Failed to create category", { id: toastId });
    } finally {
      setIsSavingCategory(false);
    }
  }

  async function handleUpdateCategory() {
    if (!editingCategory) return;
    setIsSavingCategory(true);
    const toastId = toast.loading("Updating category...");
    try {
      const res = await fetch("/api/faq-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editingCategory.name,
          description: editingCategory.description,
          order: editingCategory.order,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Category updated!", { id: toastId });
        setEditingCategory(null);
        await loadCategories();
        await loadFaqs();
      } else {
        toast.error(json.error || "Failed to update category", { id: toastId });
      }
    } catch {
      toast.error("Failed to update category", { id: toastId });
    } finally {
      setIsSavingCategory(false);
    }
  }

  async function handleDeleteCategory(cat: FaqCategory) {
    const count = cat._count?.faqs ?? 0;
    if (count > 0) {
      toast.error(`Cannot delete — ${count} FAQ${count > 1 ? "s" : ""} still use this category. Reassign or delete them first.`);
      return;
    }
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    const toastId = toast.loading("Deleting category...");
    try {
      const res = await fetch(`/api/faq-categories?id=${cat.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Category deleted!", { id: toastId });
        await loadCategories();
      } else {
        toast.error(json.error || "Failed to delete category", { id: toastId });
      }
    } catch {
      toast.error("Failed to delete category", { id: toastId });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[250px] py-12 sm:py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const showCategories = !sectionId || sectionId === "faq-categories";
  const showFaqs = !sectionId || sectionId === "faq-editor";

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-6 sm:space-y-8 text-slate-900 dark:text-white">
      {/* FAQ HERO & SECTION HEADER CONFIGURATION */}
      <div className="p-4 sm:p-5 rounded-2xl border border-violet-200 dark:border-violet-800/60 bg-violet-50/50 dark:bg-violet-950/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-violet-900 dark:text-violet-200">
              <HelpCircle className="h-5 w-5 text-violet-600 shrink-0" />
              Full FAQ Page (/faqs) Hero Header Copy
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Configure the badge tag, title, and subtitle shown specifically on the main <span className="font-bold text-violet-600 dark:text-violet-300">/faqs</span> page hero banner. (The landing page FAQ section copy is configured separately in the Landing Page Editor).
            </p>
          </div>

          <button
            onClick={handleSaveHeader}
            disabled={isSavingHeader}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/25 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isSavingHeader ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Header Copy</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Section Pill Badge Text
            </label>
            <input
              type="text"
              value={headerContent.badge}
              onChange={(e) => setHeaderContent({ ...headerContent, badge: e.target.value })}
              placeholder="e.g. Interactive Knowledgebase"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Section Title Prefix
            </label>
            <input
              type="text"
              value={headerContent.title}
              onChange={(e) => setHeaderContent({ ...headerContent, title: e.target.value })}
              placeholder="e.g. Frequently Asked"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Section Title Highlight (Orange/Gradient Accent)
            </label>
            <input
              type="text"
              value={headerContent.titleHighlight}
              onChange={(e) => setHeaderContent({ ...headerContent, titleHighlight: e.target.value })}
              placeholder="e.g. Questions"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-amber-500 font-extrabold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Section Subtitle / Description Paragraph
            </label>
            <textarea
              rows={2}
              value={headerContent.subtitle}
              onChange={(e) => setHeaderContent({ ...headerContent, subtitle: e.target.value })}
              placeholder="e.g. Everything you need to know about our engineering pods..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] p-3 text-xs text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>
      </div>

      {/* FAQ CATEGORY MANAGER */}
      {showCategories && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-blue-600 shrink-0" />
              FAQ Categories ({categories.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create, rename, or remove the topics shown as tabs on <span className="font-semibold">/faqs</span>. New categories appear instantly in the "Add FAQ" form below and on the public page.
            </p>
          </div>

          {/* Create new category */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20 space-y-3">
            <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <FolderPlus className="h-4 w-4 shrink-0" /> Create New Category
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Engineering & Stack"
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateCategory(); }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Internal note, not shown publicly..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={handleCreateCategory}
              disabled={isSavingCategory}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {isSavingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Category
            </button>
          </div>

          {/* Existing categories list */}
          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-8 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              <span className="text-xs text-slate-400">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">No categories yet. Create one above to start adding FAQs.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60"
                >
                  {editingCategory?.id === cat.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={editingCategory.description || ""}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        placeholder="Description..."
                        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{cat.name}</span>
                        <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                          {cat._count?.faqs ?? 0} FAQs
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{cat.description}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {editingCategory?.id === cat.id ? (
                      <>
                        <button
                          onClick={handleUpdateCategory}
                          disabled={isSavingCategory}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isSavingCategory ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQ LIST */}
      {showFaqs && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                FAQs Manager ({faqs.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Live on <span className="font-semibold text-slate-700 dark:text-slate-300">/faqs</span>. Manage categories above, then assign one to each question below.
              </p>
            </div>
            <button
              onClick={openCreateForm}
              disabled={categories.length === 0}
              title={categories.length === 0 ? "Create a category first" : undefined}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Add FAQ
            </button>
          </div>

          {/* Filters Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question or answer..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0b0f19] py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-48 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {categoryFilterOptions.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Tabular FAQ List */}
          <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1524] shadow-xs">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 p-4">
                <HelpCircle className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No FAQs match your search or filter.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th scope="col" className="py-3 px-3 text-center w-12">Order</th>
                    <th scope="col" className="py-3 px-4 w-36 sm:w-40">Category</th>
                    <th scope="col" className="py-3 px-4 min-w-[180px]">Question</th>
                    <th scope="col" className="py-3 px-4 min-w-[220px]">Answer</th>
                    <th scope="col" className="py-3 px-4 text-right w-20 sm:w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredFaqs
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((faq, i) => (
                      <tr
                        key={faq.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Reordering Controls */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMove(faq, "up")}
                              disabled={i === 0}
                              className="p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 font-semibold">{i + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleMove(faq, "down")}
                              disabled={i === filteredFaqs.length - 1}
                              className="p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="py-3 px-4 align-top">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 whitespace-nowrap">
                            <Tag className="h-3 w-3 shrink-0" />
                            {faq.category}
                          </span>
                        </td>

                        {/* Question */}
                        <td className="py-3 px-4 align-top">
                          <p className="font-bold text-slate-900 dark:text-white leading-snug">
                            {faq.question}
                          </p>
                        </td>

                        {/* Answer */}
                        <td className="py-3 px-4 align-top">
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2" title={faq.answer}>
                            {faq.answer}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditForm(faq)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                              title="Edit FAQ"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(faq)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                              title="Delete FAQ"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Add / Edit Modal */}
          {isFormOpen && typeof window !== "undefined" && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
              <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl sm:rounded-2xl bg-white dark:bg-[#0f1524] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-3.5 sm:p-4 px-4 sm:px-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                    {editingId ? "Edit FAQ" : "Add New FAQ"}
                  </h3>
                  <button
                    onClick={closeForm}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Category
                    </label>
                    {categories.length === 0 ? (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        ⚠ Create at least one category first
                      </p>
                    ) : (
                      <select
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                      >
                        <option value="">— Select category —</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Question
                    </label>
                    <input
                      type="text"
                      value={form.question}
                      onChange={(e) => setForm({ ...form, question: e.target.value })}
                      placeholder="How fast can you..."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Answer
                    </label>
                    <textarea
                      value={form.answer}
                      onChange={(e) => setForm({ ...form, answer: e.target.value })}
                      rows={4}
                      placeholder="We can..."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                    >
                      {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      {editingId ? "Update FAQ" : "Create FAQ"}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )}
        </div>
      )}
    </div>
  );
}