"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Tag,
  Type,
  Search,
  Loader2,
  UploadCloud,
  X,
  ImageIcon,
  CheckCircle2,
  Star,
  FileText,
  Calendar,
  User,
  Clock,
  ExternalLink,
  ArrowLeft,
  Mail,
  ChevronRight,
  Eye,
  Globe,
  Check,
  Layers,
  FileCode,
  Maximize2,
} from "lucide-react";
import { DEFAULT_BLOG_PAGE_DATA, DEFAULT_BLOG_CATEGORIES } from "@/data/default-blog-data";
import RichTextEditor from "@/components/admin/rich-text-editor";

interface BlogCategoryItem {
  id: string;
  name: string;
  description?: string;
  order: number;
}

interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  readTime: string;
  publishedAt?: string;
  imageUrl?: string;
  tags?: string[];
  featured: boolean;
  createdAt?: string;
}

interface FileUploadControlProps {
  label: string;
  value: string;
  accept?: string;
  mediaType?: "image" | "video";
  placeholder?: string;
  helperText?: string;
  onChange: (val: string) => void;
}

function FileUploadControl({
  label,
  value,
  accept = "image/*",
  mediaType = "image",
  placeholder,
  helperText,
  onChange,
}: FileUploadControlProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${mediaType} to Cloudinary...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (value) {
        formData.append("previousUrl", value);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        onChange(data.url);
        toast.success(`Successfully uploaded ${mediaType}!`, { id: toastId });
      } else {
        toast.error(data.error || "Failed to upload file", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {helperText && (
          <span className="text-[10px] text-slate-400 font-normal">{helperText}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder={placeholder || "File path or Cloudinary URL..."}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ImageIcon className="h-3.5 w-3.5" />
          </span>

          {value && (
            <button
              type="button"
              onClick={async () => {
                const oldUrl = value;
                onChange("");
                if (oldUrl.includes("cloudinary.com")) {
                  try {
                    await fetch("/api/upload", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ url: oldUrl }),
                    });
                    toast.info("Deleted image from Cloudinary!");
                  } catch (err) {
                    console.warn(err);
                  }
                }
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 cursor-pointer"
              title="Clear and Delete Cloudinary image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-violet-200 dark:border-violet-800/60 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload Cloudinary</span>
            </>
          )}
        </button>
      </div>

      {value && value.trim() !== "" && (
        <div className="mt-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3">
          <div className="relative h-12 w-16 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 shrink-0">
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden text-[11px]">
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {value.includes("cloudinary.com") ? "Cloudinary Media Image" : value}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Ready for publication & live rendering
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface BlogPageEditorProps {
  sectionId: string | null;
  onCloseSection?: () => void;
}

export default function BlogPageEditor({ sectionId, onCloseSection }: BlogPageEditorProps) {
  const [formData, setFormData] = useState<any>(DEFAULT_BLOG_PAGE_DATA);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [posts, setPosts] = useState<BlogPostItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // View Mode: "catalog" (Main Dashboard) or "editor" (Dedicated Full Article Editor Page)
  const [viewMode, setViewMode] = useState<"catalog" | "editor">("catalog");
  const [focusFullBodyEditor, setFocusFullBodyEditor] = useState(false);

  // Category Tag Input State
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  // Dedicated Post Editor Form State
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [postFormData, setPostFormData] = useState<Partial<BlogPostItem>>({
    title: "",
    slug: "",
    category: "AI & Machine Learning",
    author: "Clickpoint Engineering Lead",
    authorRole: "Senior Pod Lead",
    authorAvatar: "",
    readTime: "5 min read",
    featured: false,
    imageUrl: "",
    excerpt: "",
    content: "",
    tags: ["AI", "Engineering", "Next.js"],
  });

  const [tagInput, setTagInput] = useState("");

  const [postSearchFilter, setPostSearchFilter] = useState("");
  const [postCategoryFilter, setPostCategoryFilter] = useState("ALL");

  async function loadBlogData() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/blog");
      const json = await res.json();
      if (json.success && json.data) {
        setFormData({
          hero: { ...DEFAULT_BLOG_PAGE_DATA.hero, ...json.data.hero },
          ctaSection: { ...DEFAULT_BLOG_PAGE_DATA.ctaSection, ...json.data.ctaSection },
          postDetailConfig: { ...DEFAULT_BLOG_PAGE_DATA.postDetailConfig, ...json.data.postDetailConfig },
        });

        if (json.data.categories && json.data.categories.length > 0) {
          setCategories(json.data.categories);
        }
        if (json.data.posts && json.data.posts.length > 0) {
          setPosts(json.data.posts);
        }
      }
    } catch (err) {
      toast.error("Failed to load blog page configuration");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBlogData();
  }, []);

  async function handleSaveHeaderConfig() {
    setIsSaving(true);
    const toastId = toast.loading("Saving Blog page headers & configuration...");

    try {
      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Blog page headers updated successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save configuration", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save configuration", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  // --- CATEGORY CRUD HANDLERS ---
  async function handleAddCategory() {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;

    const toastId = toast.loading(`Creating category "${trimmed}"...`);
    try {
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const json = await res.json();
      if (json.success && json.category) {
        setCategories([...categories, json.category]);
        setNewCategoryInput("");
        toast.success(`Category "${trimmed}" created!`, { id: toastId });
      } else {
        toast.error(json.error || "Failed to create category", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create category", { id: toastId });
    }
  }

  async function handleUpdateCategory(cat: BlogCategoryItem, newName: string) {
    if (!newName.trim()) return;
    const toastId = toast.loading(`Updating category name...`);
    try {
      const res = await fetch("/api/blog/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, name: newName.trim() }),
      });

      const json = await res.json();
      if (json.success) {
        setCategories(categories.map((c) => (c.id === cat.id ? { ...c, name: newName.trim() } : c)));
        setEditingCategoryIndex(null);
        toast.success("Category updated!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to update category", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update category", { id: toastId });
    }
  }

  async function handleDeleteCategory(cat: BlogCategoryItem) {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    const toastId = toast.loading(`Deleting category "${cat.name}"...`);
    try {
      const res = await fetch("/api/blog/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id }),
      });

      const json = await res.json();
      if (json.success) {
        setCategories(categories.filter((c) => c.id !== cat.id));
        toast.success(`Deleted category "${cat.name}"`, { id: toastId });
      } else {
        toast.error(json.error || "Failed to delete category", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category", { id: toastId });
    }
  }

  // --- BLOG POST NAVIGATION TO DEDICATED EDITOR SECTION ---
  function handleOpenCreatePostPage() {
    setEditingPost(null);
    const firstCatName = categories.length > 0 ? categories[0].name : "AI & Machine Learning";
    setPostFormData({
      title: "",
      slug: "",
      category: firstCatName,
      author: "Clickpoint Engineering Lead",
      authorRole: "Senior Pod Lead",
      authorAvatar: "",
      readTime: "5 min read",
      featured: false,
      imageUrl: "",
      excerpt: "",
      content: "",
      tags: ["AI", "Next.js", "Engineering"],
    });
    setViewMode("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenEditPostPage(post: BlogPostItem) {
    setEditingPost(post);
    setPostFormData({
      title: post.title,
      slug: post.slug,
      category: post.category,
      author: post.author,
      authorRole: post.authorRole || "",
      authorAvatar: post.authorAvatar || "",
      readTime: post.readTime,
      featured: post.featured,
      imageUrl: post.imageUrl || "",
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags || [],
    });
    setViewMode("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAddTag() {
    if (!tagInput || !tagInput.trim()) return;
    const trimmed = tagInput.trim().replace(/^#/, "");
    const currentTags = postFormData.tags || [];
    if (!currentTags.includes(trimmed)) {
      setPostFormData({ ...postFormData, tags: [...currentTags, trimmed] });
    }
    setTagInput("");
  }

  function handleRemoveTag(tagToRemove: string) {
    const currentTags = postFormData.tags || [];
    setPostFormData({ ...postFormData, tags: currentTags.filter((t) => t !== tagToRemove) });
  }

  async function handleSavePost() {
    if (!postFormData.title || !postFormData.title.trim()) {
      toast.error("Please enter a blog post title");
      return;
    }

    const toastId = toast.loading(editingPost ? "Saving post changes..." : "Creating new blog post...");
    try {
      const isEdit = Boolean(editingPost);
      const url = "/api/blog/posts";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...(isEdit ? { id: editingPost!.id } : {}),
        ...postFormData,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.post) {
        if (isEdit) {
          setPosts(posts.map((p) => (p.id === editingPost!.id ? json.post : p)));
          toast.success("Blog post updated successfully!", { id: toastId });
        } else {
          setPosts([json.post, ...posts]);
          toast.success("New blog post created successfully!", { id: toastId });
        }
        setViewMode("catalog");
      } else {
        toast.error(json.error || "Failed to save blog post", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog post", { id: toastId });
    }
  }

  async function handleDeletePost(post: BlogPostItem) {
    if (!confirm(`Are you sure you want to delete post "${post.title}"? Image assets on Cloudinary will be cleaned.`)) return;

    const toastId = toast.loading(`Deleting post and cleaning Cloudinary images...`);
    try {
      const res = await fetch("/api/blog/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id }),
      });

      const json = await res.json();
      if (json.success) {
        setPosts(posts.filter((p) => p.id !== post.id));
        toast.success("Blog post and Cloudinary assets deleted!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to delete blog post", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete blog post", { id: toastId });
    }
  }

  // Filtered Posts Catalog
  const filteredPosts = posts.filter((p) => {
    const matchesCat = postCategoryFilter === "ALL" || p.category === postCategoryFilter;
    const matchesSearch =
      !postSearchFilter ||
      p.title.toLowerCase().includes(postSearchFilter.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(postSearchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] p-8 space-y-3">
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading Blog Page database records...</p>
      </div>
    );
  }

  // =========================================================================
  // DEDICATED FULL ARTICLE EDITOR PAGE VIEW (REPLACES POPUP MODAL)
  // =========================================================================
  if (viewMode === "editor") {
    if (focusFullBodyEditor) {
      return (
        <div className="w-full min-w-0 max-w-full space-y-6 text-slate-900 dark:text-white">
          {/* TOP EDITOR NAVIGATION BAR (RESPONSIVE FLEX LAYOUT) */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs w-full min-w-0">
            <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setFocusFullBodyEditor(false)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span>Back to Split Article Workspace</span>
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCode className="h-4 w-4 text-violet-600 shrink-0" />
                  <h2 className="text-xs sm:text-sm font-extrabold truncate max-w-full">
                    Full Article Body Story Focus Workspace
                  </h2>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-full">
                  Editing: {postFormData.title || "Untitled Post"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setFocusFullBodyEditor(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                Exit Focus
              </button>

              <button
                type="button"
                onClick={handleSavePost}
                className="px-4 sm:px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Save className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{editingPost ? "Update Live Article" : "Publish Article"}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-violet-500/40 dark:border-violet-600/50 bg-white dark:bg-[#131927] p-6 space-y-5 shadow-xl">
            <RichTextEditor
              content={postFormData.content || ""}
              onChange={(html) => setPostFormData({ ...postFormData, content: html })}
              placeholder="Write your article story here... Use H1/H2/H3 for big headlines, add photo captions, floated images, pullquotes, or video embeds!"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full min-w-0 max-w-full space-y-6 text-slate-900 dark:text-white">
        {/* TOP EDITOR NAVIGATION BAR (RESPONSIVE FLEX LAYOUT) */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs w-full min-w-0">
          <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setViewMode("catalog")}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span>Back to Articles Catalog</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-violet-600 shrink-0" />
                <h2 className="text-xs sm:text-sm font-extrabold truncate max-w-full">
                  {editingPost ? `Edit Article: ${editingPost.title}` : "Write & Publish New Article"}
                </h2>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-full">
                {editingPost ? `Slug: /blog/${editingPost.slug}` : "Drafting new technical post"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("catalog")}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSavePost}
              className="px-4 sm:px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Save className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{editingPost ? "Update Live Article" : "Publish Article"}</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN PROFESSIONAL EDITOR WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: ARTICLE BODY & CONTENT (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Type className="h-4 w-4 text-violet-600" />
                <h3 className="text-sm font-bold">Article Title, Slug & Excerpt Narrative</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={postFormData.title || ""}
                    placeholder="e.g. Navigating the Mobile Stack Landscape in 2026: Flutter vs React Native"
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setPostFormData({
                        ...postFormData,
                        title: newTitle,
                        slug: postFormData.slug || autoSlug,
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-4 py-2.5 text-sm text-slate-900 dark:text-white font-extrabold placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL Slug Path (e.g. mobile-dev-platforms-2026)
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] overflow-hidden">
                    <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 border-r border-slate-300 dark:border-slate-700">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={postFormData.slug || ""}
                      onChange={(e) => setPostFormData({ ...postFormData, slug: e.target.value })}
                      className="w-full bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Excerpt / Short Lead Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a concise 2-3 sentence overview highlighting the key insights..."
                    value={postFormData.excerpt || ""}
                    onChange={(e) => setPostFormData({ ...postFormData, excerpt: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* DEDICATED SYSTEMATIC SECTION: FULL ARTICLE BODY STORY EDITOR */}
            <div className="rounded-2xl border-2 border-violet-500/40 dark:border-violet-600/50 bg-gradient-to-b from-white to-violet-50/20 dark:from-[#131927] dark:to-[#0b0f19] p-6 space-y-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-violet-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-violet-600 text-white shadow-xs">
                      <FileCode className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Full Article Body Story (Rich Newspaper Builder)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Systematic article workspace. Use <strong>H1 / H2 / H3</strong> for big headline titles, <strong>Photo + Caption</strong> for newspaper photos, and <strong>Pullquote</strong> for callouts.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFocusFullBodyEditor(true)}
                    className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Focus Full Editor</span>
                  </button>

                  <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-mono font-bold border border-violet-200 dark:border-violet-800">
                    {postFormData.content?.length || 0} chars
                  </span>
                </div>
              </div>

              <div className="w-full">
                <RichTextEditor
                  content={postFormData.content || ""}
                  onChange={(html) => setPostFormData({ ...postFormData, content: html })}
                  placeholder="Write your article story here... Use H1/H2/H3 for big headlines, add photo captions, floated images, pullquotes, or video embeds!"
                />
              </div>
            </div>

            {/* ARTICLE TAGS & KEYWORDS MANAGER */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Tag className="h-4 w-4 text-violet-600" />
                <h3 className="text-sm font-bold">Article Topic Badges & SEO Tags</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {(postFormData.tags || []).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-violet-400 hover:text-red-500 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="Type new tag & press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PUBLISHING & METADATA OPTIONS (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            {/* PUBLISHING & CATEGORY PANEL */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                Publishing Settings
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category (Synced Real-Time) *
                </label>
                <select
                  value={postFormData.category || ""}
                  onChange={(e) => setPostFormData({ ...postFormData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={postFormData.readTime || "5 min read"}
                  onChange={(e) => setPostFormData({ ...postFormData, readTime: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Featured Article</p>
                  <p className="text-[10px] text-slate-400">Promote on main Blog Hero card</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(postFormData.featured)}
                    onChange={(e) => setPostFormData({ ...postFormData, featured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>

            {/* AUTHOR DETAILS */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                Author Profile
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={postFormData.author || ""}
                  onChange={(e) => setPostFormData({ ...postFormData, author: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Author Role / Designation
                </label>
                <input
                  type="text"
                  value={postFormData.authorRole || ""}
                  onChange={(e) => setPostFormData({ ...postFormData, authorRole: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <FileUploadControl
                label="Author Avatar Image (Cloudinary)"
                value={postFormData.authorAvatar || ""}
                accept="image/*"
                mediaType="image"
                placeholder="Cloudinary avatar URL..."
                onChange={(val) => setPostFormData({ ...postFormData, authorAvatar: val })}
              />
            </div>

            {/* COVER IMAGE ASSET WITH CLOUDINARY AUTO-DELETE */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                Article Cover Thumbnail
              </h3>

              <FileUploadControl
                label="Cover Thumbnail Image (Cloudinary Supported)"
                value={postFormData.imageUrl || ""}
                accept="image/*"
                mediaType="image"
                placeholder="Upload cover image to Cloudinary or paste URL..."
                helperText="Deleting image will automatically remove asset from Cloudinary"
                onChange={(val) => setPostFormData({ ...postFormData, imageUrl: val })}
              />
            </div>

            {/* CARD PREVIEW BOX */}
            <div className="rounded-2xl border border-violet-200 dark:border-slate-800 bg-gradient-to-b from-violet-50/50 to-white dark:from-[#131927] dark:to-[#131927] p-5 space-y-3">
              <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>Live Card Preview on /blog</span>
              </h4>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] space-y-2">
                <div className="h-28 w-full rounded-xl overflow-hidden bg-slate-900 relative">
                  {postFormData.imageUrl ? (
                    <img src={postFormData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-violet-600 flex items-center justify-center text-white font-extrabold text-xs">
                      {postFormData.category}
                    </div>
                  )}
                  <span className="absolute top-2 left-2 rounded-full bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-white">
                    {postFormData.category}
                  </span>
                </div>

                <h5 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2">
                  {postFormData.title || "Untitled Article"}
                </h5>
                <p className="text-[10px] text-slate-500 line-clamp-2">{postFormData.excerpt || "Excerpt preview..."}</p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{postFormData.author}</span>
                  <span>{postFormData.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN CATALOG & PAGE OVERVIEW SECTION VIEW
  // =========================================================================
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-6 text-slate-900 dark:text-white">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h2 className="text-base font-extrabold tracking-tight">
              Blog & Articles Configurator (/blog & /blog/[slug])
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage blog hero banners, search bar placeholders, dynamic categories, articles catalog, and Cloudinary image assets.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_BLOG_PAGE_DATA)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveHeaderConfig}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Page Config"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO & SEARCH BAR CONFIGURATOR */}
      {(!sectionId || sectionId === "blog-hero" || sectionId === "01") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
              #01
            </span>
            <h3 className="text-sm font-bold">Blog Hero Banner, Titles & Search Bar Placeholder</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                Badge Tag (e.g. Our Blogs)
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
                Main Title Prefix (e.g. Our Latest &)
              </label>
              <input
                type="text"
                value={formData.hero?.title || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                Title Highlighted Text (Orange Accent, e.g. Popular Blogs)
              </label>
              <input
                type="text"
                value={formData.hero?.titleHighlight || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, titleHighlight: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-amber-600 dark:text-amber-400 font-extrabold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Search className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                Search Bar Input Placeholder
              </label>
              <input
                type="text"
                value={formData.hero?.searchPlaceholder || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, searchPlaceholder: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle Description Narrative
              </label>
              <textarea
                rows={2}
                value={formData.hero?.subtitle || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DYNAMIC BLOG CATEGORY TAGS MANAGER */}
      {(!sectionId || sectionId === "blog-categories" || sectionId === "02") && (
        <div className="rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-violet-50/20 to-white dark:from-[#131927] dark:to-[#131927] p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-violet-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                  #02
                </span>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-violet-600 shrink-0" />
                  Dynamic Blog Categories Manager ({categories.length} Active Categories)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Create, edit, or delete categories. Category options automatically populate the Post creation dropdown in real-time.
              </p>
            </div>

            {/* Add Category Input Box */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="New Category Name..."
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0b0f19] border border-violet-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
              >
                {editingCategoryIndex === idx ? (
                  <input
                    type="text"
                    autoFocus
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    onBlur={() => handleUpdateCategory(cat, editingCategoryName)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateCategory(cat, editingCategoryName)}
                    className="rounded-lg border border-violet-500 bg-violet-50 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-violet-700 dark:text-violet-300"
                  />
                ) : (
                  <span>{cat.name}</span>
                )}

                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategoryIndex(idx);
                      setEditingCategoryName(cat.name);
                    }}
                    className="p-1 text-slate-400 hover:text-violet-600 transition-colors cursor-pointer"
                    title="Edit category"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: BLOG POSTS CATALOG & ARTICLE MANAGER */}
      {(!sectionId || sectionId === "blog-posts" || sectionId === "03") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #03
              </span>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-600 shrink-0" />
                Blog Posts Articles Catalog ({posts.length} Total Published)
              </h3>
            </div>

            <button
              type="button"
              onClick={handleOpenCreatePostPage}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Blog Article</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200/60 dark:border-slate-800">
            <div className="relative flex-1 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Filter articles by title or keyword..."
                value={postSearchFilter}
                onChange={(e) => setPostSearchFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-500 shrink-0">Category:</label>
              <select
                value={postCategoryFilter}
                onChange={(e) => setPostCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#0b0f19] space-y-3 relative group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Featured
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <User className="h-3 w-3 text-violet-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                      {post.author}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditPostPage(post)}
                      className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 hover:bg-violet-100 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                      title="Edit article in dedicated page"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post)}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete article & clean Cloudinary"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-400 text-xs font-semibold">
                No blog posts found matching filter criteria. Click "Create New Blog Article" to write one!
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: DETAIL PAGE & NEWSLETTER CTA CONFIGURATOR */}
      {(!sectionId || sectionId === "blog-newsletter" || sectionId === "04") && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-mono text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
              #04
            </span>
            <h3 className="text-sm font-bold">Blog Article Detail Page & Newsletter CTA Configurator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Back to Blog Button Label
              </label>
              <input
                type="text"
                value={formData.postDetailConfig?.backToBlogText || "Back to All Blogs"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postDetailConfig: { ...formData.postDetailConfig, backToBlogText: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Related Articles Title
              </label>
              <input
                type="text"
                value={formData.postDetailConfig?.relatedPostsTitle || "Related Technical Articles"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postDetailConfig: { ...formData.postDetailConfig, relatedPostsTitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Newsletter CTA Badge
              </label>
              <input
                type="text"
                value={formData.ctaSection?.badge || "Stay Updated"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ctaSection: { ...formData.ctaSection, badge: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Newsletter CTA Button Label
              </label>
              <input
                type="text"
                value={formData.ctaSection?.buttonText || "Subscribe Now"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ctaSection: { ...formData.ctaSection, buttonText: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Newsletter CTA Title
              </label>
              <input
                type="text"
                value={formData.ctaSection?.title || "Subscribe to Our Engineering Newsletter"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ctaSection: { ...formData.ctaSection, title: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-extrabold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
