"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, ChevronRight } from "lucide-react";
import { BLOG_POSTS_DATA } from "@/data/landing-data";
import { DEFAULT_LANDING_DATA, DEFAULT_BLOG_HEADER } from "@/data/default-landing-data";

interface BlogSectionProps {
  initialHeader?: any;
  initialBlogs?: any[];
}

export default function BlogSection({ initialHeader, initialBlogs }: BlogSectionProps = {}) {
  const [blogHeader, setBlogHeader] = useState(
    initialHeader || DEFAULT_LANDING_DATA.blogHeader || DEFAULT_BLOG_HEADER
  );
  const [blogs, setBlogs] = useState<any[]>(
    initialBlogs && initialBlogs.length > 0 ? initialBlogs : BLOG_POSTS_DATA
  );

  useEffect(() => {
    async function loadDynamicBlogHeader() {
      try {
        const res = await fetch("/api/landing");
        const json = await res.json();
        if (json.success && json.data && json.data.blogHeader) {
          setBlogHeader({ ...DEFAULT_BLOG_HEADER, ...json.data.blogHeader });
        }
      } catch (err) {
        console.warn("Using default blog header content:", err);
      }
    }

    async function loadDynamicBlogs() {
      try {
        const res = await fetch("/api/blog");
        const json = await res.json();
        if (json.success && json.data && Array.isArray(json.data.posts) && json.data.posts.length > 0) {
          setBlogs(json.data.posts);
        }
      } catch (err) {
        console.warn("Using fallback static blog posts:", err);
      }
    }

    if (!initialHeader) loadDynamicBlogHeader();
    if (!initialBlogs || initialBlogs.length === 0) loadDynamicBlogs();
  }, [initialHeader, initialBlogs]);

  const featuredBlogs = blogs.slice(0, 3);

  return (
    <section id="blog" className="relative py-20 lg:py-28 bg-white dark:bg-[#0b0f19] border-t border-violet-100 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="section-badge mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-violet-600 dark:text-violet-300">
              <BookOpen className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              {blogHeader.badge}
            </div>
            <h2 className="section-title text-ink dark:text-white">
              {blogHeader.title}{" "}
              <span className="text-violet-600 dark:text-[#f58220]">
                {blogHeader.titleHighlight}
              </span>
            </h2>
            {blogHeader.subtitle && (
              <p className="mt-3 section-subtitle text-ink/70 dark:text-slate-300">
                {blogHeader.subtitle}
              </p>
            )}
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-5 py-2.5 text-fluid-sm font-bold text-violet-600 dark:text-[#5340d6] transition-all hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25 shrink-0"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="h-4 w-4 text-violet-600 dark:text-[#5340d6] group-hover:text-white" />
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBlogs.map((post, idx) => {
            const postImage = post.imageUrl || post.image || post.coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";
            const rawDate = post.publishedAt || post.date || post.createdAt;
            let postDate = "Recent";
            if (rawDate) {
              if (typeof rawDate === "string") {
                postDate = rawDate;
              } else if (rawDate instanceof Date || typeof (rawDate as any)?.getMonth === "function") {
                postDate = (rawDate as Date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              } else {
                postDate = String(rawDate);
              }
            }
            const postReadTime = post.readTime || "5 min read";
            const postCategory = typeof post.category === "string" ? post.category : "Engineering";
            const authorName = typeof post.author === "object" ? post.author?.name || "ClickPoint Team" : String(post.author || "ClickPoint Team");
            const authorAvatar = typeof post.author === "object" ? post.author?.avatar || authorName.slice(0, 2).toUpperCase() : (authorName.slice(0, 2).toUpperCase() || "CP");

            return (
              <motion.div
                key={post.id || post.slug || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-5 shadow-sm transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1.5"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900">
                    <img
                      src={postImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-violet-600/90 px-3 py-1 text-fluid-2xs font-bold text-white backdrop-blur-md shadow-xs">
                      {postCategory}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center gap-3 text-fluid-xs text-ink/50 dark:text-slate-400 font-medium">
                      <span>{postDate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-violet-600 dark:text-[#5340d6]" />
                        {postReadTime}
                      </span>
                    </div>

                    <h3 className="font-display text-fluid-lg font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-[#5340d6] transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="card-body text-ink/70 dark:text-slate-300 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-violet-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 dark:bg-slate-800 text-fluid-2xs font-bold text-violet-600 dark:text-[#5340d6] border border-violet-200 dark:border-slate-700">
                      {authorAvatar}
                    </div>
                    <span className="text-fluid-xs font-semibold text-ink/80 dark:text-slate-200">{authorName}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-fluid-xs font-bold text-violet-600 dark:text-[#5340d6] hover:text-violet-800 dark:hover:text-violet-200 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Article</span>
                    <ChevronRight className="h-3.5 w-3.5 text-violet-600 dark:text-[#5340d6]" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
