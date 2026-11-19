import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { triggerReindexBackground } from "@/lib/reindex-trigger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET all active vacancies (with category info) — public
// GET all vacancies including inactive — pass ?admin=true
// GET single vacancy by id or slug — pass ?id=... or ?slug=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const identifier = (slug || id || "").trim();

    if (identifier) {
      // 1. Direct query by exact ID or exact slug
      let vacancy = await prisma.jobVacancy.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
        include: { category: { select: { id: true, name: true } } },
      });

      // 2. If not found by exact match, match slugified title
      if (!vacancy) {
        const all = await prisma.jobVacancy.findMany({
          include: { category: { select: { id: true, name: true } } },
        });
        const cleanTarget = identifier.toLowerCase();
        vacancy =
          all.find((v) => {
            const vSlug = v.slug || slugify(v.title);
            return (
              vSlug.toLowerCase() === cleanTarget ||
              v.id.toLowerCase() === cleanTarget ||
              slugify(v.title) === cleanTarget
            );
          }) || null;

        // Auto-heal: If found and slug is missing in DB, persist it
        if (vacancy && !vacancy.slug) {
          const autoSlug = slugify(vacancy.title) || vacancy.id;
          await prisma.jobVacancy
            .update({
              where: { id: vacancy.id },
              data: { slug: autoSlug },
            })
            .catch(() => {});
          vacancy.slug = autoSlug;
        }
      }

      if (!vacancy) {
        return NextResponse.json({ success: false, error: "Vacancy not found" }, { status: 404 });
      }

      return NextResponse.json(
        { success: true, data: vacancy },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    const isAdmin = searchParams.get("admin") === "true";

    const vacancies = await prisma.jobVacancy.findMany({
      where: isAdmin ? undefined : { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { category: { select: { id: true, name: true } } },
    });

    // Auto-heal empty slugs in background if any are missing
    for (const v of vacancies) {
      if (!v.slug && v.title) {
        const generated = slugify(v.title) || v.id;
        prisma.jobVacancy
          .update({
            where: { id: v.id },
            data: { slug: generated },
          })
          .catch(() => {});
        v.slug = generated;
      }
    }

    return NextResponse.json(
      { success: true, data: vacancies },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/careers/vacancies error:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST — create a new vacancy
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      categoryId,
      type,
      location,
      experience,
      salary,
      deadline,
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

    // Compute unique clean slug
    const rawSlug = customSlug?.trim() ? slugify(customSlug) : slugify(title);
    let finalSlug = rawSlug || `job-${Date.now()}`;
    const slugConflict = await prisma.jobVacancy.findFirst({ where: { slug: finalSlug } });
    if (slugConflict) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const vacancy = await prisma.jobVacancy.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        categoryId,
        type: type || "Full-Time",
        location: location || "Remote (Global)",
        experience: experience || "Senior",
        salary: salary?.trim() || "",
        deadline: deadline?.trim() || "",
        summary: summary?.trim() || "",
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        featured: !!featured,
        isActive: isActive !== false,
        order: typeof order === "number" ? order : 0,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    try {
      revalidatePath("/careers");
      revalidatePath(`/careers/${finalSlug}`);
      revalidatePath("/api/careers/vacancies");
    } catch {
      // safe fallback
    }

    triggerReindexBackground();
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
    if (fields.deadline !== undefined) updateData.deadline = fields.deadline?.trim() ?? "";
    if (fields.summary !== undefined) updateData.summary = fields.summary?.trim() ?? "";
    if (fields.responsibilities !== undefined) {
      updateData.responsibilities = Array.isArray(fields.responsibilities) ? fields.responsibilities : [];
    }
    if (fields.requirements !== undefined) {
      updateData.requirements = Array.isArray(fields.requirements) ? fields.requirements : [];
    }
    if (fields.featured !== undefined) updateData.featured = !!fields.featured;
    if (fields.isActive !== undefined) updateData.isActive = !!fields.isActive;
    if (fields.order !== undefined) updateData.order = fields.order;

    // Handle slug update if provided or title changed
    if (fields.slug !== undefined || fields.title !== undefined) {
      const source = fields.slug?.trim() || fields.title?.trim();
      if (source) {
        let cleanSlug = slugify(source);
        const conflict = await prisma.jobVacancy.findFirst({
          where: { slug: cleanSlug, NOT: { id } },
        });
        if (conflict) {
          cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
        }
        updateData.slug = cleanSlug;
      }
    }

    const updated = await prisma.jobVacancy.update({
      where: { id },
      data: updateData,
      include: { category: { select: { id: true, name: true } } },
    });

    try {
      revalidatePath("/careers");
      if (updated.slug) revalidatePath(`/careers/${updated.slug}`);
      revalidatePath(`/careers/${updated.id}`);
      revalidatePath("/api/careers/vacancies");
    } catch {
      // safe fallback
    }

    triggerReindexBackground();
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

    const target = await prisma.jobVacancy.findUnique({ where: { id } });
    await prisma.jobVacancy.delete({ where: { id } });

    try {
      revalidatePath("/careers");
      if (target?.slug) revalidatePath(`/careers/${target.slug}`);
      revalidatePath(`/careers/${id}`);
      revalidatePath("/api/careers/vacancies");
    } catch {
      // safe fallback
    }

    triggerReindexBackground();
    return NextResponse.json({ success: true, message: "Vacancy deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/careers/vacancies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job vacancy" },
      { status: 500 }
    );
  }
}
