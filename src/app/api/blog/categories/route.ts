import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_BLOG_CATEGORIES } from "@/data/default-blog-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/blog/categories — Fetch all categories ordered by rank
export async function GET() {
  try {
    let categories = await prisma.blogCategory.findMany({
      orderBy: { order: "asc" },
    });

    if (categories.length === 0) {
      const seeded = await Promise.all(
        DEFAULT_BLOG_CATEGORIES.map((catName, idx) =>
          prisma.blogCategory.create({
            data: { name: catName, order: idx },
          })
        )
      );
      categories = seeded;
    }

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("GET /api/blog/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/blog/categories — Create a new category
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const trimmed = name.trim();
    const existing = await prisma.blogCategory.findFirst({
      where: { name: { equals: trimmed, mode: "insensitive" } },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Category "${trimmed}" already exists!` },
        { status: 400 }
      );
    }

    const count = await prisma.blogCategory.count();
    const category = await prisma.blogCategory.create({
      data: {
        name: trimmed,
        description: description ? description.trim() : null,
        order: count,
      },
    });

    revalidateTag("blog-posts");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, category, message: "Category created successfully!" });
  } catch (error: any) {
    console.error("POST /api/blog/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/categories — Update an existing category name or order
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await prisma.blogCategory.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(order !== undefined ? { order } : {}),
      },
    });

    revalidateTag("blog-posts");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, category, message: "Category updated successfully!" });
  } catch (error: any) {
    console.error("PUT /api/blog/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/categories — Delete a category by ID
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    await prisma.blogCategory.delete({
      where: { id },
    });

    revalidateTag("blog-posts");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, message: "Category deleted successfully!" });
  } catch (error: any) {
    console.error("DELETE /api/blog/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
