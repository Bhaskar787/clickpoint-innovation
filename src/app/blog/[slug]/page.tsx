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
  ArrowRight,
  Sparkles,
  Newspaper,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { BLOG_POSTS_DATA } from "@/data/landing-data";
import { DEFAULT_BLOG_PAGE_DATA } from "@/data/default-blog-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const dbPost = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  const post = dbPost || BLOG_POSTS_DATA.find((p) => p.slug === params.slug);

  if (!post) return { title: "Article Not Found | Clickpoint Innovation" };
  return {
    title: `${post.title} | Clickpoint Publication`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  let dbPost = null;
  let allDbPosts: any[] = [];

  try {
    dbPost = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });
    allDbPosts = await prisma.blogPost.findMany({
      where: { slug: { not: params.slug } },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Database fallback in blog detail page:", err);
  }

  const postFallback = BLOG_POSTS_DATA.find((p) => p.slug === params.slug);

  if (!dbPost && !postFallback) {
    notFound();
  }

  const post = dbPost
    ? {
        id: dbPost.id,
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        author: {
          name: dbPost.author,
          role: dbPost.authorRole || "Senior Editorial Contributor",
          avatar: dbPost.authorAvatar || dbPost.author.slice(0, 2).toUpperCase(),
        },
        publishedAt: dbPost.publishedAt
          ? new Date(dbPost.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          : "August 2026",
        readTime: dbPost.readTime || "5 min read",
        image: dbPost.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
        category: dbPost.category,
        tags: Array.isArray(dbPost.tags) ? (dbPost.tags as string[]) : ["Technology", "Engineering"],
      }
    : {
        id: postFallback!.id,
        slug: postFallback!.slug,
        title: postFallback!.title,
        excerpt: postFallback!.excerpt,
        content: postFallback!.content,
        author: postFallback!.author,
        publishedAt: postFallback!.publishedAt,
        readTime: postFallback!.readTime,
        image: postFallback!.image,
        category: postFallback!.category,
        tags: postFallback!.tags,
      };

  // Fetch latest related posts for the bottom "MORE STORIES" newspaper grid
  const moreStories =
    allDbPosts.length > 0
      ? allDbPosts
      : BLOG_POSTS_DATA.filter((p) => p.slug !== params.slug).slice(0, 6);

  return (
    <main className="relative bg-background text-ink selection:bg-[#f58220] selection:text-white">
      <Navbar />

      {/* ARTICLE NEWSPAPER CONTAINER */}
      <article className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Top Breadcrumb & Publication Tag */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
              <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
              <Link href="/blog" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
                Publication
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
              <span className="text-violet-600 dark:text-violet-300 font-bold truncate max-w-xs">{post.category}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-slate-800 text-violet-700 dark:text-violet-300 text-xs font-extrabold uppercase tracking-wider border border-violet-200 dark:border-slate-700">
              <Newspaper className="h-3.5 w-3.5" />
              <span>{post.category}</span>
            </div>
          </div>

          {/* NEWSPAPER MAIN HEADLINE */}
          <h1 className="font-poppins text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl leading-[1.2] mb-6">
            {post.title}
          </h1>

          {/* AUTHOR META BAR */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-xs text-ink/70 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-slate-800 font-bold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700 overflow-hidden shrink-0">
                {typeof post.author.avatar === "string" && post.author.avatar.startsWith("http") ? (
                  <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{post.author.avatar || post.author.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-ink dark:text-white text-sm">{post.author.name}</p>
                <p className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-ink/60 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span>{post.publishedAt}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* NEWSPAPER HERO IMAGE + CAPTION */}
          {post.image && (
            <figure className="mb-10 overflow-hidden border-0 bg-transparent p-0 shadow-none">
              <img
                src={post.image}
                alt={post.title}
                className="h-auto max-h-[480px] w-full rounded-xs object-cover"
              />
              <figcaption className="mt-2.5 text-center text-xs italic font-medium text-slate-500 dark:text-slate-400">
                Photo: {post.title}
              </figcaption>
            </figure>
          )}

          {/* EXCERPT LEAD PARAGRAPH */}
          {post.excerpt && (
            <div className="mb-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 p-6 border-l-4 border-[#f58220]">
              <p className="font-sans text-lg sm:text-xl font-bold leading-relaxed text-ink dark:text-white italic">
                "{post.excerpt}"
              </p>
            </div>
          )}

          {/* MAIN ARTICLE BODY CONTENT (NEWSPAPER HTML RENDERING) */}
          <div
            className="prose prose-violet dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-ink/85 dark:text-slate-200 font-normal [&_p]:mb-6 [&_figcaption]:text-xs [&_figcaption]:italic [&_figcaption]:text-center [&_figcaption]:text-slate-500 [&_blockquote]:font-sans [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-[#f58220] [&_blockquote]:bg-amber-500/10 [&_blockquote]:p-6 [&_blockquote]:rounded-r-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ARTICLE TAGS & SHARE FOOTER */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-ink/60 dark:text-slate-400 mr-1">Tags:</span>
                {post.tags.map((t: string) => (
                  <span
                    key={t}
                    className="rounded-full bg-violet-50 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-ink dark:text-white hover:border-violet-600 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Link>
          </div>
        </div>
      </article>

      {/* NEWSPAPER "MORE STORIES" 3-COLUMN PUBLICATION GRID SECTION */}
      <section className="py-16 bg-cloud-100/60 dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="mb-10 flex items-center justify-between border-b-2 border-ink dark:border-slate-700 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#f58220]">
                Related Articles
              </span>
              <h2 className="font-sans text-2xl font-extrabold tracking-tight text-ink dark:text-white sm:text-3xl">
                More Stories & Latest Reports
              </h2>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:gap-2 transition-all"
            >
              <span>View All Stories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 3-Column Publication Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moreStories.map((story: any) => {
              const image = story.imageUrl || story.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
              const authorName = typeof story.author === "object" ? story.author.name : story.author;

              return (
                <article
                  key={story.id || story.slug}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={image}
                        alt={story.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-extrabold uppercase text-white backdrop-blur-md border border-white/10">
                          {story.category}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <div className="mb-2.5 flex items-center gap-2 text-xs text-ink/60 dark:text-slate-400 font-semibold">
                        <Clock className="h-3.5 w-3.5 text-[#f58220]" />
                        <span>{story.readTime || "5 min read"}</span>
                        <span>•</span>
                        <span>{authorName}</span>
                      </div>

                      <h3 className="font-sans text-lg font-bold leading-snug text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors line-clamp-2">
                        <Link href={`/blog/${story.slug}`}>{story.title}</Link>
                      </h3>

                      <p className="mt-2.5 text-xs text-ink/75 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {story.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="px-6 pb-6 pt-1">
                    <Link
                      href={`/blog/${story.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:gap-2.5 transition-all"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#f58220]" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
