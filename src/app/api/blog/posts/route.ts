import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Helper to invoke Cloudinary deletion API when an image is replaced or post is deleted
 */
async function autoDeleteCloudinaryImage(url?: string | null, baseUrl = "http://localhost:3000") {
  if (!url || !url.includes("cloudinary.com")) return;
  try {
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const json = await res.json();
    if (json.success) {
      console.log(`Auto-deleted Cloudinary image: ${url}`);
    }
  } catch (err) {
    console.warn(`Failed to auto-delete Cloudinary image: ${url}`, err);
  }
}

// GET /api/blog/posts — Fetch all blog posts or single post by ID / slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (id) {
      const post = await prisma.blogPost.findUnique({ where: { id } });
      return NextResponse.json({ success: true, post });
    }

    if (slug) {
      const post = await prisma.blogPost.findUnique({ where: { slug } });
      return NextResponse.json({ success: true, post });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error("GET /api/blog/posts error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts — Create a new blog post
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      authorRole,
      authorAvatar,
      category,
      readTime,
      imageUrl,
      tags,
      featured,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    let finalSlug = slug ? slug.trim().toLowerCase() : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check slug collision
    const existingSlug = await prisma.blogPost.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt ? excerpt.trim() : title.trim(),
        content: content ? content.trim() : excerpt || title.trim(),
        author: author ? author.trim() : "Clickpoint Pod Lead",
        authorRole: authorRole ? authorRole.trim() : "Senior Engineer",
        authorAvatar: authorAvatar ? authorAvatar.trim() : null,
        category: category ? category.trim() : "AI & Machine Learning",
        readTime: readTime ? readTime.trim() : "5 min read",
        imageUrl: imageUrl ? imageUrl.trim() : null,
        tags: Array.isArray(tags) ? tags : tags ? [tags] : ["Technology", "Engineering"],
        featured: Boolean(featured),
      },
    });

    revalidateTag("blog-posts");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, post, message: "Blog post created successfully!" });
  } catch (error: any) {
    console.error("POST /api/blog/posts error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/posts — Update an existing blog post
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      excerpt,
      content,
      author,
      authorRole,
      authorAvatar,
      category,
      readTime,
      imageUrl,
      tags,
      featured,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog Post ID is required" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Auto-delete old cover image from Cloudinary if replaced
    if (existing.imageUrl && imageUrl !== undefined && imageUrl !== existing.imageUrl) {
      await autoDeleteCloudinaryImage(existing.imageUrl, origin);
    }

    // Auto-delete old author avatar from Cloudinary if replaced
    if (existing.authorAvatar && authorAvatar !== undefined && authorAvatar !== existing.authorAvatar) {
      await autoDeleteCloudinaryImage(existing.authorAvatar, origin);
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(slug ? { slug: slug.trim().toLowerCase() } : {}),
        ...(excerpt !== undefined ? { excerpt: excerpt.trim() } : {}),
        ...(content !== undefined ? { content: content.trim() } : {}),
        ...(author ? { author: author.trim() } : {}),
        ...(authorRole !== undefined ? { authorRole: authorRole?.trim() || null } : {}),
        ...(authorAvatar !== undefined ? { authorAvatar: authorAvatar?.trim() || null } : {}),
        ...(category ? { category: category.trim() } : {}),
        ...(readTime ? { readTime: readTime.trim() } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl?.trim() || null } : {}),
        ...(tags !== undefined ? { tags: Array.isArray(tags) ? tags : [tags] } : {}),
        ...(featured !== undefined ? { featured: Boolean(featured) } : {}),
      },
    });

    revalidateTag("blog-posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);

    return NextResponse.json({ success: true, post: updated, message: "Blog post updated successfully!" });
  } catch (error: any) {
    console.error("PUT /api/blog/posts error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts — Delete a blog post and auto-clean Cloudinary images
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog Post ID is required" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Auto-delete Cloudinary images on post deletion
    if (existing.imageUrl) {
      await autoDeleteCloudinaryImage(existing.imageUrl, origin);
    }
    if (existing.authorAvatar) {
      await autoDeleteCloudinaryImage(existing.authorAvatar, origin);
    }

    await prisma.blogPost.delete({ where: { id } });

    revalidateTag("blog-posts");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, message: "Blog post deleted and Cloudinary assets cleaned!" });
  } catch (error: any) {
    console.error("DELETE /api/blog/posts error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
