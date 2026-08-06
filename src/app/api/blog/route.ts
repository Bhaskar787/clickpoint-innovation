import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_BLOG_PAGE_DATA, DEFAULT_BLOG_CATEGORIES } from "@/data/default-blog-data";
import { BLOG_POSTS_DATA } from "@/data/landing-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/blog — Fetch blog page header, dynamic categories, and published blog posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // 1. Fetch Page Header & Config from DB (or seed defaults)
    let pageRecord = await prisma.blogPage.findFirst();
    if (!pageRecord) {
      pageRecord = await prisma.blogPage.create({
        data: {
          id: "default",
          content: DEFAULT_BLOG_PAGE_DATA as any,
        },
      });
    }

    const pageContent = (pageRecord?.content || DEFAULT_BLOG_PAGE_DATA) as any;

    // 2. Fetch Categories from DB (or seed defaults)
    let dbCategories = await prisma.blogCategory.findMany({
      orderBy: { order: "asc" },
    });

    if (dbCategories.length === 0) {
      console.log("No blog categories found in DB. Seeding default categories...");
      const seededCats = await Promise.all(
        DEFAULT_BLOG_CATEGORIES.map((catName, idx) =>
          prisma.blogCategory.create({
            data: {
              name: catName,
              order: idx,
            },
          })
        )
      );
      dbCategories = seededCats;
    }

    // 3. Fetch Blog Posts from DB (or seed/sync defaults)
    let dbPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Ensure default posts (such as Uganda Newspaper lead story) exist in DB
    for (let idx = 0; idx < BLOG_POSTS_DATA.length; idx++) {
      const p = BLOG_POSTS_DATA[idx];
      const existing = dbPosts.find((dbP) => dbP.slug === p.slug);
      if (!existing) {
        try {
          const created = await prisma.blogPost.create({
            data: {
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              content: p.content,
              author: p.author.name,
              authorRole: p.author.role,
              authorAvatar: p.author.avatar,
              category: p.category,
              readTime: p.readTime || "5 min read",
              imageUrl: p.image,
              tags: p.tags as any,
              featured: p.featured ?? (idx === 0),
            },
          });
          dbPosts.push(created);
        } catch (e) {
          console.warn("Could not auto-seed post:", p.slug, e);
        }
      }
    }

    // If a specific slug is requested, return single post details
    if (slug) {
      const singlePost = dbPosts.find((p) => p.slug === slug);
      if (!singlePost) {
        return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          post: singlePost,
          pageContent,
          categories: dbCategories,
          latestPosts: dbPosts.filter((p) => p.slug !== slug).slice(0, 5),
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...pageContent,
          categories: dbCategories,
          posts: dbPosts,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blog content" },
      { status: 500 }
    );
  }
}

// PUT /api/blog — Update Blog Page Headers & Configuration in DB
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const existing = await prisma.blogPage.findFirst();
    let updatedRecord;

    if (existing) {
      updatedRecord = await prisma.blogPage.update({
        where: { id: existing.id },
        data: { content: body },
      });
    } else {
      updatedRecord = await prisma.blogPage.create({
        data: { id: "default", content: body },
      });
    }

    revalidateTag("blog-posts");
    revalidatePath("/blog");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      data: updatedRecord.content,
      message: "Blog page configuration saved to database successfully!",
    });
  } catch (error: any) {
    console.error("PUT /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save blog page content" },
      { status: 500 }
    );
  }
}

// POST /api/blog — Alias for PUT to handle both POST and PUT methods
export async function POST(req: Request) {
  return PUT(req);
}
