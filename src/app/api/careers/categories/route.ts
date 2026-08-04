import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all categories (with vacancy count)
export async function GET() {
  try {
    const categories = await prisma.jobCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { vacancies: true } },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET /api/careers/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job categories" },
      { status: 500 }
    );
  }
}

// POST — create a new category
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.jobCategory.findUnique({ where: { name: name.trim() } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    const category = await prisma.jobCategory.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/careers/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create job category" },
      { status: 500 }
    );
  }
}

// PUT — update an existing category by id (passed in body)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Category id is required" }, { status: 400 });
    }

    // Check for name uniqueness (exclude self)
    if (name) {
      const dupe = await prisma.jobCategory.findFirst({
        where: { name: name.trim(), NOT: { id } },
      });
      if (dupe) {
        return NextResponse.json(
          { success: false, error: "A category with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.jobCategory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/careers/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update job category" },
      { status: 500 }
    );
  }
}

// DELETE — delete a category by id (passed as query param ?id=...)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Category id is required" }, { status: 400 });
    }

    // Check if any vacancies use this category
    const vacancyCount = await prisma.jobVacancy.count({ where: { categoryId: id } });
    if (vacancyCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete — ${vacancyCount} vacancy${vacancyCount > 1 ? "ies" : ""} still use this category. Reassign or delete them first.`,
        },
        { status: 409 }
      );
    }

    await prisma.jobCategory.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/careers/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job category" },
      { status: 500 }
    );
  }
}
