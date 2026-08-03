import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TESTIMONIALS_PAGE_DATA } from "@/data/default-testimonials-data";
import { TestimonialItem, TestimonialsPageContent } from "@/types";

// GET /api/testimonials — Fetch dynamic page config & approved/all testimonials
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includePending = searchParams.get("includePending") === "true";

    // 1. Fetch Page Header Config from DB (or seed defaults)
    let pageRecord = await prisma.testimonialsPage.findFirst();
    if (!pageRecord) {
      pageRecord = await prisma.testimonialsPage.create({
        data: {
          id: "default",
          content: DEFAULT_TESTIMONIALS_PAGE_DATA as any,
        },
      });
    }

    const pageContent = (pageRecord?.content || DEFAULT_TESTIMONIALS_PAGE_DATA) as unknown as TestimonialsPageContent;

    // 2. Fetch Testimonials from DB
    const dbTestimonials = await prisma.testimonial.findMany({
      where: includePending ? {} : { isApproved: true },
      orderBy: { createdAt: "desc" },
    });

    // Count unread & pending reviews for admin
    const unreadCount = await prisma.testimonial.count({
      where: { isRead: false },
    });

    const pendingCount = await prisma.testimonial.count({
      where: { isApproved: false },
    });

    // Fallback seeding if database has no testimonials
    let items: TestimonialItem[] = dbTestimonials.map((t) => ({
      id: t.id,
      clientName: t.clientName,
      clientRole: t.clientRole,
      company: t.company,
      content: t.content,
      rating: t.rating,
      avatarUrl: t.avatarUrl || undefined,
      featured: t.featured,
      isApproved: t.isApproved,
      isRead: t.isRead,
      ipAddress: t.ipAddress || undefined,
      userEmail: t.userEmail || undefined,
      createdAt: t.createdAt.toISOString(),
    }));

    if (items.length === 0 && !includePending) {
      items = DEFAULT_TESTIMONIALS_PAGE_DATA.testimonials || [];
    }

    return NextResponse.json({
      success: true,
      data: {
        ...pageContent,
        testimonials: items,
        unreadCount,
        pendingCount,
      },
    });
  } catch (error: any) {
    console.error("GET /api/testimonials Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials — Public endpoint for user review submissions with 7-day rate limiting
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientRole, company, content, rating, avatarUrl, userEmail } = body;

    // Validate required fields
    if (!clientName || !clientRole || !company || !content) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required feedback fields." },
        { status: 400 }
      );
    }

    const numericRating = Math.max(1, Math.min(5, parseInt(rating || "5", 10)));

    // Extract client IP address for 7-day rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 10-second rate limit check (10,000 ms) for testing
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const existingRecentSubmission = await prisma.testimonial.findFirst({
      where: {
        ipAddress: clientIp,
        createdAt: { gte: tenSecondsAgo },
      },
    });

    if (existingRecentSubmission) {
      const secondsLeft = Math.ceil(
        (existingRecentSubmission.createdAt.getTime() + 10 * 1000 - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          success: false,
          error: `Rate limit reached. You can submit another review in ${secondsLeft} second(s).`,
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    // Save new review submission to PostgreSQL database
    const newTestimonial = await prisma.testimonial.create({
      data: {
        clientName: clientName.trim(),
        clientRole: clientRole.trim(),
        company: company.trim(),
        content: content.trim(),
        rating: numericRating,
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
        userEmail: userEmail ? userEmail.trim() : null,
        ipAddress: clientIp,
        isApproved: false, // Requires admin approval before going live
        isRead: false, // Triggers unread badge notification for admin
        featured: true,
      },
    });

    revalidateTag("testimonials-page");
    revalidatePath("/");
    revalidatePath("/testimonials");

    return NextResponse.json({
      success: true,
      message: "Thank you! Your feedback has been submitted successfully and is pending admin approval.",
      data: newTestimonial,
    });
  } catch (error: any) {
    console.error("POST /api/testimonials Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials — Admin endpoint to update page headers or toggle review moderation status
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Case 1: Update single testimonial moderation status (approve / mark as read / delete)
    if (body.action === "update-testimonial") {
      const { id, isApproved, isRead } = body;
      const updated = await prisma.testimonial.update({
        where: { id },
        data: {
          ...(isApproved !== undefined ? { isApproved } : {}),
          ...(isRead !== undefined ? { isRead } : {}),
        },
      });

      revalidateTag("testimonials-page");
      revalidatePath("/");
      revalidatePath("/testimonials");

      return NextResponse.json({ success: true, data: updated });
    }

    if (body.action === "delete-testimonial") {
      const { id } = body;
      await prisma.testimonial.delete({ where: { id } });

      revalidateTag("testimonials-page");
      revalidatePath("/");
      revalidatePath("/testimonials");

      return NextResponse.json({ success: true, message: "Testimonial deleted successfully." });
    }

    // Case 2: Save entire Testimonials Page Configuration (100% dynamic headers, badges, titles)
    const existing = await prisma.testimonialsPage.findFirst();
    let pageRecord;
    if (existing) {
      pageRecord = await prisma.testimonialsPage.update({
        where: { id: existing.id },
        data: { content: body },
      });
    } else {
      pageRecord = await prisma.testimonialsPage.create({
        data: { id: "default", content: body },
      });
    }

    revalidateTag("testimonials-page");
    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Testimonials page content updated successfully!",
      data: pageRecord.content,
    });
  } catch (error: any) {
    console.error("PUT /api/testimonials Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update testimonials content" },
      { status: 500 }
    );
  }
}
