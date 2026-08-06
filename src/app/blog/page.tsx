"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  ChevronRight,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Loader2,
  Newspaper,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { DEFAULT_BLOG_PAGE_DATA } from "@/data/default-blog-data";

export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  const [pageConfig, setPageConfig] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>(["ALL"]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlogData() {
      try {
        const res = await fetch("/api/blog");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.hero) {
            setPageConfig(json.data);
          }
          if (json.data.categories && json.data.categories.length > 0) {
            const catNames = json.data.categories.map((c: any) => c.name);
            setCategories(["ALL", ...catNames]);
          }
          if (json.data.posts) {
            setPosts(json.data.posts);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic blog listing:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBlogData();
  }, []);

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "ALL" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  // Calculate pagination
  const totalPages = Math.ceil(gridPosts.length / postsPerPage) || 1;
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentGridPosts = gridPosts.slice(startIndex, startIndex + postsPerPage);

  const hero = pageConfig?.hero || {
    badge: "Publication Articles",
    title: "Our Latest &",
    titleHighlight: "Engineering Insights",
    subtitle: "In-depth technical guides, engineering blueprints, framework comparisons, and modern software growth strategies.",
    searchPlaceholder: "Search news by title, topic, or technology...",
  };

  return (
    <main className="relative overflow-x-hidden bg-background text-ink selection:bg-[#f58220] selection:text-white">
      <Navbar />

      {/* Header Banner Section */}
      <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-20 bg-cloud-100/70 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Publication & Articles</span>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            {isLoading && !pageConfig ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-7 w-7 text-violet-600 animate-spin" />
                <p className="text-xs font-bold text-slate-400">Loading publication details...</p>
              </div>
            ) : (
              <>
                {hero.badge && (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                    <Newspaper className="h-3.5 w-3.5 text-[#f58220]" />
                    {hero.badge}
                  </div>
                )}

                <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl sm:leading-[1.12]">
                  {hero.title}{" "}
                  <span className="text-[#f58220]">
                    {hero.titleHighlight}
                  </span>
                </h1>

                <p className="mt-4 text-base text-ink/75 sm:text-lg font-medium">
                  {hero.subtitle}
                </p>

                {/* Search Input Box */}
                <div className="relative mt-8 mx-auto max-w-md">
                  <input
                    type="text"
                    placeholder={hero.searchPlaceholder || "Search news by title, topic, or technology..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-2xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 py-3.5 pl-11 pr-4 text-sm font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 shadow-sm transition-all focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
                  />
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-slate-400" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Newspaper Listing Content */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Dynamic Filter Tabs */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                      : "bg-cloud-100 dark:bg-slate-800 text-ink/70 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat === "ALL" ? "All Stories" : cat}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Loading publication articles...</p>
            </div>
          ) : (
            <>
              {/* FEATURED HEADLINE LEAD ARTICLE */}
              {featuredPost && currentPage === 1 && (
                <div className="mb-16 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[340px] bg-slate-900 overflow-hidden">
                    <img
                      src={featuredPost.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-[#f58220] px-3.5 py-1 text-xs font-extrabold text-white uppercase tracking-wider shadow-md">
                        Featured Lead Story
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-center gap-3 text-xs text-ink/60 dark:text-slate-400 font-semibold">
                        <Clock className="h-3.5 w-3.5 text-[#f58220]" />
                        <span>{featuredPost.readTime || "5 min read"}</span>
                        <span>•</span>
                        <span className="text-violet-600 dark:text-violet-400 font-bold">{featuredPost.category}</span>
                      </div>

                      <h2 className="font-sans text-2xl lg:text-3xl font-extrabold leading-snug text-ink dark:text-white hover:text-violet-600 transition-colors">
                        <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                      </h2>

                      <p className="mt-4 text-sm text-ink/75 dark:text-slate-300 leading-relaxed line-clamp-4">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-ink/60 dark:text-slate-400">
                        By {featuredPost.author}
                      </span>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-extrabold text-violet-600 dark:text-violet-400 hover:gap-3 transition-all"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="h-4 w-4 text-[#f58220]" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* NEWSPAPER 3-COLUMN ARTICLE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentGridPosts.map((post, idx) => (
                  <motion.article
                    key={post.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] overflow-hidden shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                        <img
                          src={post.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/10 uppercase">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-6">
                        <div className="mb-3 flex items-center gap-3 text-xs text-ink/60 dark:text-slate-400 font-medium">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#f58220]" />
                            <span>{post.readTime || "5 min read"}</span>
                          </div>
                          <span>•</span>
                          <span>{post.author}</span>
                        </div>

                        <h3 className="font-sans text-xl font-bold leading-snug text-ink dark:text-white group-hover:text-violet-600 transition-colors line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="mt-3 text-xs sm:text-sm text-ink/75 dark:text-slate-300 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Link */}
                    <div className="px-6 pb-6 pt-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:gap-3 transition-all"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#f58220]" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-lg font-semibold text-ink/60 dark:text-slate-300">
                    No publication articles found matching your search.
                  </p>
                </div>
              )}

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-ink dark:text-white disabled:opacity-30 hover:border-violet-600 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="text-xs font-bold text-ink/80 dark:text-slate-300 px-3">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-ink dark:text-white disabled:opacity-30 hover:border-violet-600 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
