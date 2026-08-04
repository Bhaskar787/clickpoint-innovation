import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all active vacancies (with category info) — public
// GET all vacancies including inactive — pass ?admin=true
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    const vacancies = await prisma.jobVacancy.findMany({
      where: isAdmin ? undefined : { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: vacancies });
  } catch (error) {
    console.error("GET /api/careers/vacancies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job vacancies" },
      { status: 500 }
    );
  }
}

// POST — create a new vacancy
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      categoryId,
      type,
      location,
      experience,
      salary,
      summary,
      responsibilities,
      requirements,
      featured,
      isActive,
      order,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ success: false, error: "Job title is required" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
    }

    // Verify category exists
    const category = await prisma.jobCategory.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ success: false, error: "Selected category does not exist" }, { status: 404 });
    }

    const vacancy = await prisma.jobVacancy.create({
      data: {
        title: title.trim(),
        categoryId,
        type: type || "Full-Time",
        location: location || "Remote (Global)",
        experience: experience || "Senior",
        salary: salary?.trim() || "",
        summary: summary?.trim() || "",
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        featured: !!featured,
        isActive: isActive !== false,
        order: typeof order === "number" ? order : 0,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: vacancy }, { status: 201 });
  } catch (error) {
    console.error("POST /api/careers/vacancies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create job vacancy" },
      { status: 500 }
    );
  }
}

// PUT — update an existing vacancy (id in body)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Vacancy id is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (fields.title !== undefined) updateData.title = fields.title.trim();
    if (fields.categoryId !== undefined) updateData.categoryId = fields.categoryId;
    if (fields.type !== undefined) updateData.type = fields.type;
    if (fields.location !== undefined) updateData.location = fields.location;
    if (fields.experience !== undefined) updateData.experience = fields.experience;
    if (fields.salary !== undefined) updateData.salary = fields.salary?.trim() ?? "";
    if (fields.summary !== undefined) updateData.summary = fields.summary?.trim() ?? "";
    if (fields.responsibilities !== undefined) updateData.responsibilities = Array.isArray(fields.responsibilities) ? fields.responsibilities : [];
    if (fields.requirements !== undefined) updateData.requirements = Array.isArray(fields.requirements) ? fields.requirements : [];
    if (fields.featured !== undefined) updateData.featured = !!fields.featured;
    if (fields.isActive !== undefined) updateData.isActive = !!fields.isActive;
    if (fields.order !== undefined) updateData.order = fields.order;

    const updated = await prisma.jobVacancy.update({
      where: { id },
      data: updateData,
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/careers/vacancies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update job vacancy" },
      { status: 500 }
    );
  }
}

// DELETE — delete a vacancy by id (?id=...)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Vacancy id is required" }, { status: 400 });
    }

    await prisma.jobVacancy.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Vacancy deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/careers/vacancies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job vacancy" },
      { status: 500 }
    );
  }
}
