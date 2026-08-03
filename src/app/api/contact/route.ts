import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CONTACT_PAGE_DATA } from "@/data/default-contact-data";
import { ContactInquiryItem, ContactPageContent } from "@/types";

// GET /api/contact — Fetch contact page headers & list of inquiries for admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";

    // 1. Fetch Contact Page Header Content from DB
    let pageRecord = await prisma.contactPage.findFirst();
    if (!pageRecord) {
      pageRecord = await prisma.contactPage.create({
        data: {
          id: "default",
          content: DEFAULT_CONTACT_PAGE_DATA as any,
        },
      });
    }

    const pageContent = (pageRecord?.content || DEFAULT_CONTACT_PAGE_DATA) as unknown as ContactPageContent;

    // 2. Fetch Contact Inquiries from DB
    const dbInquiries = await prisma.contactInquiry.findMany({
      where: includeAll ? {} : { isRead: false },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = await prisma.contactInquiry.count({
      where: { isRead: false },
    });

    const items: ContactInquiryItem[] = dbInquiries.map((i) => ({
      id: i.id,
      name: i.name,
      email: i.email,
      phone: i.phone || undefined,
      company: i.company || undefined,
      service: i.service || undefined,
      budget: i.budget || undefined,
      message: i.message,
      ipAddress: i.ipAddress || undefined,
      isRead: i.isRead,
      createdAt: i.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...pageContent,
        inquiries: items,
        unreadCount,
      },
    });
  } catch (error: any) {
    console.error("GET /api/contact Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch contact page data" },
      { status: 500 }
    );
  }
}

// POST /api/contact — Public endpoint for visitors to submit contact form inquiries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill out your Name, Email, and Message before submitting." },
        { status: 400 }
      );
    }

    // Extract client IP address for 10-second rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 10-second rate limit check (10,000 ms)
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const existingRecentSubmission = await prisma.contactInquiry.findFirst({
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
          error: `Rate limit active. Please wait ${secondsLeft} second(s) before sending another inquiry.`,
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    // Save contact inquiry to PostgreSQL DB
    const newInquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
        service: service ? service.trim() : null,
        budget: budget ? budget.trim() : null,
        message: message.trim(),
        ipAddress: clientIp,
        isRead: false, // Triggers unread badge notification in admin
      },
    });

    revalidateTag("contact-page");
    revalidatePath("/contact");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Message Sent Successfully! Our engineering team will contact you shortly.",
      data: newInquiry,
    });
  } catch (error: any) {
    console.error("POST /api/contact Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit contact message" },
      { status: 500 }
    );
  }
}

// PUT /api/contact — Admin endpoint to update contact page content or mark inquiries as read
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "update-inquiry") {
      const { id, isRead } = body;
      const updated = await prisma.contactInquiry.update({
        where: { id },
        data: { isRead },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.action === "delete-inquiry") {
      const { id } = body;
      await prisma.contactInquiry.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Inquiry deleted successfully." });
    }

    // Save Contact Page Content Config
    const existing = await prisma.contactPage.findFirst();
    let pageRecord;
    if (existing) {
      pageRecord = await prisma.contactPage.update({
        where: { id: existing.id },
        data: { content: body },
      });
    } else {
      pageRecord = await prisma.contactPage.create({
        data: { id: "default", content: body },
      });
    }

    revalidateTag("contact-page");
    revalidatePath("/contact");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Contact Page Content updated successfully!",
      data: pageRecord.content,
    });
  } catch (error: any) {
    console.error("PUT /api/contact Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update contact page" },
      { status: 500 }
    );
  }
}
