import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotFoundPageContent } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { DEFAULT_NOT_FOUND_DATA } from "@/data/default-not-found-data";

export async function GET() {
  try {
    const record = await prisma.notFoundPage.findFirst();
    if (record && record.content) {
      return NextResponse.json({ success: true, data: record.content });
    }
  } catch (err) {
    console.error("Failed to query 404 page from DB:", err);
  }

  return NextResponse.json({ success: true, data: DEFAULT_NOT_FOUND_DATA });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as NotFoundPageContent;
    const existing = await prisma.notFoundPage.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.notFoundPage.update({
        where: { id: existing.id },
        data: { content: body as any },
      });
    } else {
      updated = await prisma.notFoundPage.create({
        data: { id: "default", content: body as any },
      });
    }

    revalidateTag("not-found-page");
    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true, data: updated.content });
  } catch (err: any) {
    console.error("PUT /api/not-found error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update 404 page" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return PUT(request);
}