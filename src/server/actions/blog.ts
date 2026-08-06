"use server";

import { requirePermission } from "@/lib/permissions";
import { ALL_PERMISSIONS } from "@/lib/permissions/constants";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { BlogPostItem } from "@/types";

/**
 * Public Cached Blog Posts Getter
 */
const getBlogPostsCached = unstable_cache(
  async () => {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return posts.map((p) => ({
      ...p,
      publishedAt: p.publishedAt
        ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Recent",
      createdAt: p.createdAt ? p.createdAt.toISOString() : undefined,
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : undefined,
    }));
  },
  ["blog-posts-public"],
  { revalidate: 300, tags: ["blog-posts"] }
);

/**
 * Get Public Blog Posts List (Cached)
 */
export async function getBlogPosts() {
  try {
    return await getBlogPostsCached();
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

/**
 * Get Blog Post by Slug (Cached)
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug: slug.toLowerCase() },
    });
  } catch (error) {
    console.error(`Failed to fetch blog post with slug '${slug}':`, error);
    return null;
  }
}

/**
 * Save / Update Blog Post (Requires CMS_BLOG_UPDATE)
 */
export async function saveBlogPost(payload: Partial<BlogPostItem> & { title: string; excerpt: string; content: string; author: string; category: string }) {
  await requirePermission(ALL_PERMISSIONS.CMS_BLOG_UPDATE);

  const slug = payload.slug
    ? payload.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    : payload.title.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const existing = await prisma.blogPost.findUnique({
    where: { slug },
  });

  const authorName = typeof payload.author === "string" ? payload.author : payload.author.name || "Clickpoint Team";

  const blogPostData = {
    slug,
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    author: authorName,
    authorRole: payload.authorRole || null,
    category: payload.category,
    readTime: payload.readTime || "5 min read",
    imageUrl: payload.imageUrl || payload.image || null,
    tags: payload.tags ? (payload.tags as any) : null,
    featured: payload.featured ?? false,
  };

  let result;
  if (existing) {
    result = await prisma.blogPost.update({
      where: { slug },
      data: blogPostData,
    });
  } else {
    result = await prisma.blogPost.create({
      data: blogPostData,
    });
  }

  revalidateTag("blog-posts");

  return {
    success: true,
    id: result.id,
    slug: result.slug,
    message: existing ? "Blog post updated successfully" : "Blog post published successfully",
  };
}

/**
 * Delete Blog Post (Requires CMS_BLOG_UPDATE)
 */
export async function deleteBlogPost(id: string) {
  await requirePermission(ALL_PERMISSIONS.CMS_BLOG_UPDATE);

  await prisma.blogPost.delete({
    where: { id },
  });

  revalidateTag("blog-posts");

  return {
    success: true,
    message: "Blog post deleted successfully",
  };
}
