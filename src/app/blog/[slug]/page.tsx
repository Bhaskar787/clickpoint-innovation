import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  ArrowLeft,
  Share2,
  Linkedin,
  Twitter,
  Copy,
  BookOpen,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS_DATA } from "@/data/landing-data";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return BLOG_POSTS_DATA.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: BlogDetailPageProps) {
  const post = BLOG_POSTS_DATA.find((p) => p.slug === params.slug);
  if (!post) return { title: "Blog Not Found" };
  return {
    title: `${post.title} | Clickpoint Innovation Blog`,
    description: post.excerpt,
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = BLOG_POSTS_DATA.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const latestPosts = BLOG_POSTS_DATA.filter((p) => p.id !== post.id).slice(0, 5);

  return (
    <main className="relative bg-background text-ink">
      <Navbar />

      {/* Article Hero Banner */}
      <section className="relative pt-36 pb-12 lg:pt-44 lg:pb-16 bg-cloud-100/70 border-b border-violet-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <Link href="/blog" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold truncate max-w-xs">{post.title}</span>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">
              <BookOpen className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>{post.category}</span>
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              {post.title}
            </h1>

            {/* Author Meta Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-4 pt-6 border-t border-violet-100 dark:border-slate-800 text-xs text-ink/65 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 dark:bg-slate-800 font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700 shadow-xs">
                  {post.author.avatar}
                </div>
                <div>
                  <p className="font-bold text-ink dark:text-white">{post.author.name}</p>
                  <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-300">{post.author.role}</p>
                </div>
              </div>

              <span className="hidden sm:inline text-ink/30 dark:text-slate-600">•</span>

              <div className="flex items-center gap-1.5 font-medium">
                <span>Published on {post.publishedAt}</span>
              </div>

              <span className="hidden sm:inline text-ink/30 dark:text-slate-600">•</span>

              <div className="flex items-center gap-1 font-bold text-violet-600 dark:text-violet-300">
                <Clock className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout with Sticky Right Sidebar (Matching Image 2) */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
            
            {/* Left Column: Full Main Article Content */}
            <article className="min-w-0">
              {/* Feature Image */}
              <div className="relative overflow-hidden rounded-3xl border border-violet-100 shadow-xl shadow-violet-950/[0.04]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-[380px] sm:h-[460px] w-full object-cover"
                />
              </div>

              {/* Excerpt Lead */}
              <p className="mt-8 text-lg leading-relaxed text-ink/80 font-medium italic border-l-4 border-violet-600 pl-4 py-1 bg-violet-50/50 rounded-r-xl">
                "{post.excerpt}"
              </p>

              {/* Article Markdown Body */}
              <div className="mt-8 space-y-6 text-base leading-relaxed text-ink/80 font-normal">
                {post.content.split("\n\n").map((paragraph: string, index: number) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith("## ")) {
                    return (
                      <h2
                        key={index}
                        className="mt-10 font-display text-2xl font-bold text-ink sm:text-3xl border-b border-violet-100 pb-3"
                      >
                        {trimmed.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith("### ")) {
                    return (
                      <h3
                        key={index}
                        className="mt-8 font-display text-xl font-bold text-violet-700"
                      >
                        {trimmed.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith("```")) {
                    const codeContent = trimmed
                      .replace(/```[a-z]*/, "")
                      .replace(/```$/, "")
                      .trim();
                    return (
                      <div
                        key={index}
                        className="my-6 overflow-x-auto rounded-2xl bg-ink p-5 font-mono text-xs text-violet-200 shadow-lg"
                      >
                        <pre>
                          <code>{codeContent}</code>
                        </pre>
                      </div>
                    );
                  }
                  return <p key={index}>{trimmed}</p>;
                })}
              </div>

              {/* Tags Footer */}
              <div className="mt-10 pt-6 border-t border-violet-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/50 mr-2">
                  Topics:
                </span>
                {post.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 border border-violet-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author Bio Box */}
              <div className="mt-10 rounded-3xl border border-violet-100 bg-cloud-100/70 p-6 flex flex-col sm:flex-row items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-xl font-black text-white shrink-0 shadow-md">
                  {post.author.avatar}
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-ink">
                    Written by {post.author.name}
                  </h4>
                  <p className="text-xs font-semibold text-violet-600 mb-1">
                    {post.author.role} at Clickpoint Innovation
                  </p>
                  <p className="text-xs leading-relaxed text-ink/70">
                    Pioneering production-grade AI platforms, LLM copilots, and cloud architecture for global enterprise clients.
                  </p>
                </div>
              </div>
            </article>

            {/* Right Column: Sticky Hanging Sidebar */}
            <aside className="sticky top-24 self-start space-y-8">
              
              {/* Search Widget */}
              <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink/50 dark:text-slate-400 mb-3">
                  Search Articles
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search topics..."
                    className="w-full rounded-xl border border-violet-200 dark:border-slate-700 bg-cloud-100/60 dark:bg-slate-800/80 py-2.5 pl-9 pr-3 text-xs text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-slate-400 focus:border-violet-600 focus:outline-hidden"
                  />
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40 dark:text-slate-400" />
                </div>
              </div>

              {/* Latest Blogs & Articles Hanging Widget */}
              <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-violet-100 dark:border-slate-800 mb-4">
                  <h3 className="font-display text-base font-bold text-ink dark:text-white">
                    Latest Blogs & Articles
                  </h3>
                  <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700">
                    Popular
                  </span>
                </div>

                <div className="space-y-4">
                  {latestPosts.map((latest) => (
                    <Link
                      key={latest.id}
                      href={`/blog/${latest.slug}`}
                      className="group flex gap-3 items-center transition-colors hover:text-violet-700 dark:hover:text-violet-300"
                    >
                      <img
                        src={latest.image}
                        alt={latest.title}
                        className="h-14 w-14 rounded-xl object-cover shrink-0 border border-violet-100 dark:border-slate-700 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <h4 className="font-display text-xs font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                          {latest.title}
                        </h4>
                        <span className="text-[10px] text-ink/50 dark:text-slate-400 font-medium mt-1 block">
                          {latest.publishedAt}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category Filter Widget */}
              <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm">
                <h3 className="font-display text-base font-bold text-ink dark:text-white pb-3 border-b border-violet-100 dark:border-slate-800 mb-4">
                  Categories
                </h3>
                <ul className="space-y-2 text-xs">
                  {["AI & Machine Learning", "App Development", "Web Development", "Growth & SEO", "E-Commerce", "Cloud & Security"].map((cat) => (
                    <li key={cat}>
                      <Link
                        href="/blog"
                        className="flex items-center justify-between py-1.5 text-ink/75 dark:text-slate-300 hover:text-violet-700 dark:hover:text-white transition-colors font-medium"
                      >
                        <span>{cat}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Banner Card */}
              <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-[#1b4397] via-[#153880] to-[#0e2764] p-6 text-white shadow-xl">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/30 blur-2xl" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-violet-200 border border-violet-400/30">
                  <Sparkles className="h-3 w-3 text-violet-300" />
                  Engineering Studio
                </span>
                <h4 className="mt-3 font-display text-lg font-bold text-white">
                  Have an AI or Web Idea?
                </h4>
                <p className="mt-1.5 text-xs text-violet-200/80 leading-relaxed">
                  Partner with Clickpoint Innovation to launch custom LLM copilots & enterprise apps.
                </p>
                <Link href="/contact">
                  <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                    Schedule Discovery Call
                  </Button>
                  </Link>
              </div>

            </aside>

          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
