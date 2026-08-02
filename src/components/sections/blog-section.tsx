"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, ChevronRight } from "lucide-react";
import { BLOG_POSTS_DATA } from "@/data/landing-data";

export default function BlogSection() {
  const featuredBlogs = BLOG_POSTS_DATA.slice(0, 3);

  return (
    <section id="blog" className="relative py-20 lg:py-28 bg-white border-t border-violet-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <BookOpen className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              Insights & Engineering Blog
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink">
              Our Latest &{" "}
              <span className="text-violet-600 dark:text-[#f58220]">
                Popular Blogs
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-base text-ink/70">
              Technical guides, AI integration blueprints, and full-stack software insights from our engineering leads.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-5 py-2.5 text-sm font-bold text-violet-600 dark:text-[#5340d6] transition-all hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25 shrink-0"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="h-4 w-4 text-violet-600 dark:text-[#5340d6] group-hover:text-white" />
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBlogs.map((post, idx) => (
            <motion.div
              key={post.id}
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
                      <Clock className="h-3 w-3 text-violet-600 dark:text-[#5340d6]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-[#5340d6] transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs leading-relaxed text-ink/70 dark:text-slate-300 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-violet-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 dark:bg-slate-800 text-xs font-bold text-violet-600 dark:text-[#5340d6] border border-violet-200 dark:border-slate-700">
                    {post.author.avatar}
                  </div>
                  <span className="text-xs font-semibold text-ink/80 dark:text-slate-200">{post.author.name}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-[#5340d6] hover:text-violet-800 dark:hover:text-violet-200 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Article</span>
                  <ChevronRight className="h-3.5 w-3.5 text-violet-600 dark:text-[#5340d6]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
