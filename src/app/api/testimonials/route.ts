import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TESTIMONIALS_PAGE_DATA } from "@/data/default-testimonials-data";
import { TestimonialItem, TestimonialsPageContent } from "@/types";
import { NotificationService } from "@/services/notification.service";

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
    const { clientName, clientRole, company, content, rating, avatarUrl, userEmail, phone } = body;

    // Validate required fields (Name, Role, Company, Work Email, Contact Phone, Review)
    if (!clientName || !clientRole || !company || !content || !userEmail || !phone) {
      return NextResponse.json(
        { success: false, error: "Please fill out your Full Name, Role, Company, Work Email, Contact Phone Number, and Feedback statement." },
        { status: 400 }
      );
    }

    const numericRating = Math.max(1, Math.min(5, parseInt(rating || "5", 10)));

    const normalizedEmail = userEmail.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Extract client IP address for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 1-hour rate limit check per unique email / unique phone / IP
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const oneHourAgo = new Date(Date.now() - ONE_HOUR_MS);

    const existingRecentSubmission = await prisma.testimonial.findFirst({
      where: {
        createdAt: { gte: oneHourAgo },
        OR: [
          { ipAddress: clientIp },
          { userEmail: normalizedEmail },
          { phone: normalizedPhone },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingRecentSubmission) {
      const minutesLeft = Math.ceil(
        (existingRecentSubmission.createdAt.getTime() + ONE_HOUR_MS - Date.now()) / (60 * 1000)
      );

      return NextResponse.json(
        {
          success: false,
          error: `Rate limit active: A review has already been submitted using this email (${normalizedEmail}) or phone number (${normalizedPhone}). Please wait ${minutesLeft} minute(s) before submitting another review.`,
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    // Save new review submission to PostgreSQL database
    let newTestimonial;
    try {
      newTestimonial = await prisma.testimonial.create({
        data: {
          clientName: clientName.trim(),
          clientRole: clientRole.trim(),
          company: company.trim(),
          content: content.trim(),
          rating: numericRating,
          avatarUrl: avatarUrl ? avatarUrl.trim() : null,
          userEmail: normalizedEmail,
          phone: normalizedPhone,
          ipAddress: clientIp,
          isApproved: false,
          isRead: false,
          featured: true,
        },
      });
    } catch (createErr) {
      // Fallback for DB tables where phone column isn't migrated yet
      newTestimonial = await prisma.testimonial.create({
        data: {
          clientName: clientName.trim(),
          clientRole: clientRole.trim(),
          company: company.trim(),
          content: content.trim(),
          rating: numericRating,
          avatarUrl: avatarUrl ? avatarUrl.trim() : null,
          userEmail: `${normalizedEmail} | Phone: ${normalizedPhone}`,
          ipAddress: clientIp,
          isApproved: false,
          isRead: false,
          featured: true,
        },
      });
    }

    revalidateTag("testimonials-page");
    revalidatePath("/");
    revalidatePath("/testimonials");
    revalidatePath("/admin/dashboard");

    // Broadcast real-time notification to Admin via NotificationService
    NotificationService.notifyRealtime({
      id: newTestimonial.id,
      category: "REVIEW",
      title: "Client Feedback Review",
      clientName: newTestimonial.clientName,
      email: newTestimonial.userEmail || undefined,
      subtext: `${newTestimonial.clientRole}, ${newTestimonial.company}`,
      content: newTestimonial.content,
      rating: newTestimonial.rating,
      isRead: false,
      createdAt: newTestimonial.createdAt.toISOString(),
      targetTab: "testimonials-page",
    });

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
