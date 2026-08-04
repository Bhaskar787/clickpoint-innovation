"use client";

import { useState, useEffect, useMemo } from "react";
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
  }, []);

  // Filter tabs use whatever categories currently exist, so an empty
  // freshly-created category still shows up for filtering/assignment.
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

    // Optimistic UI update
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

  // ---------------------------------------------------------------------
  // Category CRUD
  // ---------------------------------------------------------------------
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
        await loadFaqs(); // refresh so renamed category reflects immediately in the list/badges
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const showCategories = !sectionId || sectionId === "faq-categories";
  const showFaqs = !sectionId || sectionId === "faq-editor";

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* FAQ CATEGORY MANAGER                                               */}
      {/* ------------------------------------------------------------------ */}
      {showCategories && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-blue-600" />
              FAQ Categories ({categories.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create, rename, or remove the topics shown as tabs on <span className="font-semibold">/faqs</span>. New categories appear instantly in the "Add FAQ" form below and on the public page.
            </p>
          </div>

          {/* Create new category */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20 space-y-3">
            <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <FolderPlus className="h-4 w-4" /> Create New Category
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
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
            <div className="text-center py-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</span>
                        <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                          {cat._count?.faqs ?? 0} FAQs
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0">
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

      {/* ------------------------------------------------------------------ */}
      {/* FAQ LIST                                                           */}
      {/* ------------------------------------------------------------------ */}
      {showFaqs && (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              FAQs ({faqs.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Live on <span className="font-semibold">/faqs</span>. Manage categories above, then assign one to each question below.
            </p>
          </div>
          <button
            onClick={openCreateForm}
            disabled={categories.length === 0}
            title={categories.length === 0 ? "Create a category first" : undefined}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Add FAQ
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question or answer..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
          >
            {categoryFilterOptions.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">No FAQs match your filters.</p>
            </div>
          ) : (
            filteredFaqs
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((faq, i) => (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1524] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 pt-0.5">
                      <button
                        onClick={() => handleMove(faq, "up")}
                        disabled={i === 0}
                        className="text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400"
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(faq, "down")}
                        disabled={i === filteredFaqs.length - 1}
                        className="text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400"
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-slate-700">
                          <Tag className="h-2.5 w-2.5" />
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{faq.question}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditForm(faq)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Add / Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0f1524] border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit FAQ" : "Add New FAQ"}
                </h3>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="">— Select category —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
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
                    placeholder="How fast can you...?"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
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
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
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
          </div>
        )}
      </div>
      )}
    </div>
  );
}
