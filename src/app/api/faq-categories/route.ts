import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { ALL_PERMISSIONS } from "@/lib/permissions/constants";
import { prisma } from "@/lib/prisma";
import { DEFAULT_FAQS } from "@/data/default-faq-data";

function invalidateFaqCaches() {
  revalidateTag("faqs");
  revalidateTag("faq-categories");
  revalidatePath("/faqs");
  revalidatePath("/admin/dashboard");
}

// GET /api/faq-categories — list all categories (with FAQ count), auto-seeds
// the default categories on first load so the admin always has something to work with.
export async function GET() {
  try {
    let categories = await prisma.faqCategory.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { faqs: true } } },
    });

    if (categories.length === 0) {
      const uniqueNames = Array.from(new Set(DEFAULT_FAQS.map((f) => f.category)));
      await prisma.faqCategory.createMany({
        data: uniqueNames.map((name, i) => ({ name, order: i })),
      });
      categories = await prisma.faqCategory.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { faqs: true } } },
      });
    }

    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("GET /api/faq-categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch FAQ categories" },
      { status: 500 }
    );
  }
}

// POST /api/faq-categories — create a new category
export async function POST(req: Request) {
  try {
    await requirePermission(ALL_PERMISSIONS.CMS_FAQ_UPDATE);

    const body = await req.json();
    const { name, description, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.faqCategory.findUnique({ where: { name: name.trim() } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    const category = await prisma.faqCategory.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        order: typeof order === "number" ? order : 0,
      },
    });

    invalidateFaqCaches();

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/faq-categories error:", error);
    const status = error.message?.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create FAQ category" },
      { status }
    );
  }
}

// PUT /api/faq-categories — update an existing category by id (passed in body)
export async function PUT(req: Request) {
  try {
    await requirePermission(ALL_PERMISSIONS.CMS_FAQ_UPDATE);

    const body = await req.json();
    const { id, name, description, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Category id is required" }, { status: 400 });
    }

    if (name) {
      const dupe = await prisma.faqCategory.findFirst({
        where: { name: name.trim(), NOT: { id } },
      });
      if (dupe) {
        return NextResponse.json(
          { success: false, error: "A category with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.faqCategory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(order !== undefined && { order }),
      },
    });

    invalidateFaqCaches();

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT /api/faq-categories error:", error);
    const status = error.message?.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update FAQ category" },
      { status }
    );
  }
}

// DELETE /api/faq-categories?id=... — delete a category by id
export async function DELETE(req: Request) {
  try {
    await requirePermission(ALL_PERMISSIONS.CMS_FAQ_UPDATE);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Category id is required" }, { status: 400 });
    }

    const faqCount = await prisma.faq.count({ where: { categoryId: id } });
    if (faqCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete — ${faqCount} FAQ${faqCount > 1 ? "s" : ""} still use this category. Reassign or delete them first.`,
        },
        { status: 409 }
      );
    }

    await prisma.faqCategory.delete({ where: { id } });

    invalidateFaqCaches();

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/faq-categories error:", error);
    const status = error.message?.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete FAQ category" },
      { status }
    );
  }
}
