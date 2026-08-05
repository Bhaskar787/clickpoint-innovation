import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/jobs/applications — admin: list all job applications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Single application detail
      const apps = await prisma.$queryRaw<any[]>`
        SELECT ja.*, jv.title as "vacancyTitle", jv.type, jv.location, jv.experience
        FROM "job_applications" ja
        LEFT JOIN "job_vacancies" jv ON jv.id = ja."jobVacancyId"
        WHERE ja.id = ${id}
        LIMIT 1
      `;
      if (!apps.length) {
        return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: apps[0] });
    }

    // List all applications
    const applications = await prisma.$queryRaw<any[]>`
      SELECT ja.*, jv.type as "vacancyType", jv.location as "vacancyLocation"
      FROM "job_applications" ja
      LEFT JOIN "job_vacancies" jv ON jv.id = ja."jobVacancyId"
      ORDER BY ja."createdAt" DESC
    `;

    const unreadCount = applications.filter((a) => !a.isRead).length;

    return NextResponse.json({
      success: true,
      data: applications,
      unreadCount,
      total: applications.length,
    });
  } catch (error: any) {
    console.error("GET /api/jobs/applications Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/jobs/applications — admin: mark read, update status, delete
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, id, status } = body;

    if (action === "mark-read" && id) {
      await prisma.$executeRaw`
        UPDATE "job_applications" SET "isRead" = true, "updatedAt" = NOW() WHERE id = ${id}
      `;
      return NextResponse.json({ success: true });
    }

    if (action === "update-status" && id && status) {
      await prisma.$executeRaw`
        UPDATE "job_applications" SET status = ${status}::"ApplicationStatus", "updatedAt" = NOW() WHERE id = ${id}
      `;
      return NextResponse.json({ success: true });
    }

    if (action === "delete" && id) {
      await prisma.$executeRaw`DELETE FROM "job_applications" WHERE id = ${id}`;
      return NextResponse.json({ success: true });
    }

    if (action === "mark-all-read") {
      await prisma.$executeRaw`
        UPDATE "job_applications" SET "isRead" = true, "updatedAt" = NOW() WHERE "isRead" = false
      `;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("PUT /api/jobs/applications Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
