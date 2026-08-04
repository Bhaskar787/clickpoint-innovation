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

function serializeFaq(row: { id: string; question: string; answer: string; categoryId: string; order: number; category: { name: string } }) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    categoryId: row.categoryId,
    category: row.category.name,
    order: row.order,
  };
}

// Ensures a FaqCategory row exists for every default category name and
// returns a name -> id lookup map. Used only for first-run seeding.
async function ensureDefaultCategories() {
  const uniqueNames = Array.from(new Set(DEFAULT_FAQS.map((f) => f.category)));

  for (let i = 0; i < uniqueNames.length; i++) {
    await prisma.faqCategory.upsert({
      where: { name: uniqueNames[i] },
      update: {},
      create: { name: uniqueNames[i], order: i },
    });
  }

  const rows = await prisma.faqCategory.findMany({ where: { name: { in: uniqueNames } } });
  return new Map(rows.map((r) => [r.name, r.id]));
}

// GET /api/faqs — Admin listing of every FAQ row (ordered), auto-seeds defaults on first load
export async function GET() {
  try {
    let rows = await prisma.faq.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: { category: { select: { id: true, name: true } } },
    });

    // First-run convenience: seed the table (and its categories) from the
    // built-in defaults so the admin has real rows to edit instead of an empty list.
    if (rows.length === 0) {
      const nameToId = await ensureDefaultCategories();
      await prisma.faq.createMany({
        data: DEFAULT_FAQS.map((f, i) => ({
          question: f.question,
          answer: f.answer,
          categoryId: nameToId.get(f.category)!,
          order: f.order ?? i,
        })),
      });
      rows = await prisma.faq.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: { category: { select: { id: true, name: true } } },
      });
    }

    return NextResponse.json({ success: true, data: rows.map(serializeFaq) });
  } catch (error: any) {
    console.error("GET /api/faqs Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST /api/faqs — Create a new FAQ
export async function POST(request: Request) {
  try {
    await requirePermission(ALL_PERMISSIONS.CMS_FAQ_UPDATE);

    const body = await request.json();
    const { question, answer, categoryId, order } = body;

    if (!question?.trim() || !answer?.trim() || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Question, answer, and category are required." },
        { status: 400 }
      );
    }

    const category = await prisma.faqCategory.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Selected category does not exist." },
        { status: 400 }
      );
    }

    let nextOrder = order;
    if (nextOrder === undefined || nextOrder === null) {
      const last = await prisma.faq.findFirst({ orderBy: { order: "desc" } });
      nextOrder = (last?.order ?? -1) + 1;
    }

    const created = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        categoryId,
        order: nextOrder,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    invalidateFaqCaches();

    return NextResponse.json({
      success: true,
      message: "FAQ created successfully",
      data: serializeFaq(created),
    });
  } catch (error: any) {
    console.error("POST /api/faqs Error:", error);
    const status = error.message?.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create FAQ" },
      { status }
    );
  }
}

// PUT /api/faqs — Update a single FAQ, or bulk-persist a new display order
export async function PUT(request: Request) {
  try {
    await requirePermission(ALL_PERMISSIONS.CMS_FAQ_UPDATE);

    const body = await request.json();

    // Bulk reorder after drag-and-drop: { action: "reorder", items: [{ id, order }] }
    if (body.action === "reorder" && Array.isArray(body.items)) {
      await prisma.$transaction(
        body.items.map((item: { id: string; order: number }) =>
          prisma.faq.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );

      invalidateFaqCaches();
      return NextResponse.json({ success: true, message: "FAQ order updated" });
    }

    // Single FAQ update
    const { id, question, answer, categoryId, order } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "FAQ id is required." }, { status: 400 });
    }
    if (!question?.trim() || !answer?.trim() || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Question, answer, and category are required." },
        { status: 400 }
      );
    }

    const category = await prisma.faqCategory.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Selected category does not exist." },
        { status: 400 }
      );
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        categoryId,
        ...(order !== undefined ? { order } : {}),
      },
      include: { category: { select: { id: true, name: true } } },
    });

    invalidateFaqCaches();

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully",
      data: serializeFaq(updated),
    });
  } catch (error: any) {
    console.error("PUT /api/faqs Error:", error);
    const status = error.message?.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update FAQ" },
      { status }
    );
  }
}

// DELETE /api/faqs?id=... — Delete a single FAQ
export async function DELETE(request: Request) {
  try {
    await requirePermission(ALL_PERMISSIONS.CMS_FAQ_UPDATE);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "FAQ id is required." }, { status: 400 });
    }

    await prisma.faq.delete({ where: { id } });

    invalidateFaqCaches();

    return NextResponse.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/faqs Error:", error);
    const status = error.message?.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete FAQ" },
      { status }
    );
  }
}
