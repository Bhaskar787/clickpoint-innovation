"use client";

import { useState } from "react";
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
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { BLOG_POSTS_DATA } from "@/data/landing-data";

const CATEGORIES = [
  "ALL",
  "AI & Machine Learning",
  "App Development",
  "Web Development",
  "Growth & SEO",
  "E-Commerce",
  "Cloud & Security",
];

export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  // Filter posts based on category and search query
  const filteredPosts = BLOG_POSTS_DATA.filter((post) => {
    const matchesCategory =
      activeCategory === "ALL" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Header Banner Section */}
      <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-20 bg-cloud-100/70 border-b border-violet-100">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-violet-400/30 via-indigo-300/20 to-transparent blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Blogs & Insights</span>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <BookOpen className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              Our Blogs
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              Our Latest &{" "}
              <span className="text-violet-600 dark:text-[#f58220]">
                Popular Blogs
              </span>
            </h1>

            <p className="mt-4 text-base text-ink/75 sm:text-lg">
              Explore in-depth technical guides, AI integration blueprints, framework comparisons, and modern software growth strategies.
            </p>

            {/* Search Input Box */}
            <div className="relative mt-8 mx-auto max-w-md">
              <input
                type="text"
                placeholder="Search blogs by title, topic, or technology..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-2xl border border-violet-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 py-3.5 pl-11 pr-4 text-sm font-medium text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 shadow-sm transition-all focus:border-violet-600 focus:outline-hidden focus:ring-2 focus:ring-violet-600/20"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs & Main Listing Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Tabs */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                      : "bg-cloud-100 text-ink/70 hover:bg-violet-50 hover:text-violet-700 border border-violet-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                  }`}
                >
                  {cat === "ALL" ? "All Blogs" : cat}
                </button>
              );
            })}
          </div>

          {/* Posts 3-Column Grid */}
          {currentPosts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-5 shadow-sm transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1.5"
                >
                  <div>
                    {/* Image Preview Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 rounded-full bg-violet-600/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow-xs">
                        {post.category}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2.5">
                      <div className="flex items-center gap-3 text-xs text-ink/50 dark:text-slate-400 font-medium">
                        <span>{post.publishedAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-xs leading-relaxed text-ink/70 dark:text-slate-300 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-violet-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 dark:bg-slate-800 text-xs font-bold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700">
                        {post.author.avatar}
                      </div>
                      <span className="text-xs font-semibold text-ink/80 dark:text-slate-200">{post.author.name}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-white group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read More</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-ink/60 dark:text-slate-300">No blogs found matching your query.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="mt-4 text-xs font-bold text-violet-700 dark:text-violet-300 underline"
              >
                Clear filters & search
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-white disabled:opacity-40 hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    currentPage === page
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "border border-violet-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink/70 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-700 hover:text-violet-700 dark:hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-white disabled:opacity-40 hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* CTA Banner */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
