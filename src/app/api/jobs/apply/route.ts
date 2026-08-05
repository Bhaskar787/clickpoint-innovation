import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { NotificationService } from "@/services/notification.service";
import { sendApplicationReceivedNotification } from "@/lib/email";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// POST /api/jobs/apply — public endpoint for candidates to submit job applications
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = (formData.get("name") as string | null)?.trim();
    const email = (formData.get("email") as string | null)?.trim().toLowerCase();
    const phone = (formData.get("phone") as string | null)?.trim() || null;
    const linkedIn = (formData.get("linkedIn") as string | null)?.trim() || null;
    const portfolio = (formData.get("portfolio") as string | null)?.trim() || null;
    const coverLetter = (formData.get("coverLetter") as string | null)?.trim() || null;
    const coverLetterFile = formData.get("coverLetterFile") as File | null;
    const jobVacancyId = (formData.get("jobVacancyId") as string | null)?.trim();
    const jobTitle = (formData.get("jobTitle") as string | null)?.trim();
    const resumeFile = formData.get("resume") as File | null;

    // Validate required fields
    if (!name || !email || !jobVacancyId || !jobTitle) {
      return NextResponse.json(
        { success: false, error: "Name, email, job position, and resume are required." },
        { status: 400 }
      );
    }
    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json(
        { success: false, error: "Please attach your resume or CV before submitting." },
        { status: 400 }
      );
    }

    // Validate file type — allow PDF, Word, and images
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const isAllowedType = allowedTypes.includes(resumeFile.type) || resumeFile.name.endsWith(".pdf");
    if (!isAllowedType) {
      return NextResponse.json(
        { success: false, error: "Resume must be a PDF, Word document, or image file." },
        { status: 400 }
      );
    }

    // 10-second rate limit per IP and email
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);

    const recentByIp = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint as count FROM "job_applications"
      WHERE "ipAddress" = ${clientIp} AND "createdAt" >= ${tenSecondsAgo}
    `;
    if (recentByIp[0]?.count > BigInt(0)) {
      return NextResponse.json(
        { success: false, error: "Please wait 10 seconds before submitting another application.", rateLimited: true },
        { status: 429 }
      );
    }

    // Check if same email already applied for this job
    const alreadyApplied = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint as count FROM "job_applications"
      WHERE "email" = ${email} AND "jobVacancyId" = ${jobVacancyId}
    `;
    if (alreadyApplied[0]?.count > BigInt(0)) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this position. Our team will review your application." },
        { status: 409 }
      );
    }

    // Upload resume to Cloudinary (with local fallback)
    let resumeUrl = "";
    let resumeProvider = "local";

    const bytes = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type for Cloudinary
    const isImage = resumeFile.type.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";
    const dataUri = `data:${resumeFile.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;

    try {
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "clickpoint_innovation/resumes",
        resource_type: resourceType,
        public_id: `resume_${Date.now()}_${randomUUID().slice(0, 8)}`,
        overwrite: false,
        invalidate: true,
      });
      if (uploadResult?.secure_url) {
        resumeUrl = uploadResult.secure_url;
        resumeProvider = "cloudinary";
      }
    } catch (cloudErr: any) {
      // Fallback to local storage
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
      await fs.mkdir(uploadsDir, { recursive: true });
      const safeName = resumeFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const uniqueFileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;
      await fs.writeFile(path.join(uploadsDir, uniqueFileName), buffer);
      resumeUrl = `/uploads/resumes/${uniqueFileName}`;
      resumeProvider = "local";
    }

    // Process cover letter file attachment if uploaded — Upload to Cloudinary
    let coverLetterFileUrl: string | null = null;
    let coverLetterOriginalName: string | null = null;

    if (coverLetterFile && coverLetterFile.size > 0) {
      coverLetterOriginalName = coverLetterFile.name;
      const clBytes = await coverLetterFile.arrayBuffer();
      const clBuffer = Buffer.from(clBytes);
      const isClImage = coverLetterFile.type.startsWith("image/");
      const clResourceType = isClImage ? "image" : "raw";
      const clDataUri = `data:${coverLetterFile.type || "application/octet-stream"};base64,${clBuffer.toString("base64")}`;

      try {
        const clUploadResult = await cloudinary.uploader.upload(clDataUri, {
          folder: "clickpoint_innovation/coverletters",
          resource_type: clResourceType,
          public_id: `coverletter_${Date.now()}_${randomUUID().slice(0, 8)}`,
          overwrite: false,
          invalidate: true,
        });

        if (clUploadResult?.secure_url) {
          coverLetterFileUrl = clUploadResult.secure_url;
        }
      } catch (clCloudErr: any) {
        console.warn("Cloudinary upload for cover letter file returned error (using local fallback):", clCloudErr?.message || clCloudErr);
        try {
          const clUploadsDir = path.join(process.cwd(), "public", "uploads", "coverletters");
          await fs.mkdir(clUploadsDir, { recursive: true });
          const safeClName = coverLetterFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
          const uniqueClName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeClName}`;
          await fs.writeFile(path.join(clUploadsDir, uniqueClName), clBuffer);
          coverLetterFileUrl = `/uploads/coverletters/${uniqueClName}`;
        } catch (clErr) {
          console.error("Error saving cover letter file attachment locally:", clErr);
        }
      }
    }

    // Create job application record using raw SQL
    const id = randomUUID();
    const now = new Date();

    // Combine cover letter text + attachment link if cover letter file was uploaded
    let finalCoverLetterText = coverLetter;
    if (coverLetterFileUrl) {
      const fileInfoText = `[Attached Cover Letter File: ${coverLetterFileUrl}] (${coverLetterOriginalName})`;
      finalCoverLetterText = coverLetter
        ? `${coverLetter}\n\n${fileInfoText}`
        : fileInfoText;
    }

    try {
      await prisma.$executeRaw`
        INSERT INTO "job_applications" (
          "id","jobVacancyId","jobTitle","name","email","phone","linkedIn","portfolio",
          "coverLetter","coverLetterFileUrl","coverLetterOriginalName","resumeUrl","resumeOriginalName","resumeProvider",
          "status","isRead","ipAddress","createdAt","updatedAt"
        ) VALUES (
          ${id}, ${jobVacancyId}, ${jobTitle}, ${name}, ${email}, ${phone}, ${linkedIn}, ${portfolio},
          ${finalCoverLetterText}, ${coverLetterFileUrl}, ${coverLetterOriginalName}, ${resumeUrl}, ${resumeFile.name}, ${resumeProvider},
          'PENDING', false, ${clientIp}, ${now}, ${now}
        )
      `;
    } catch (insertErr) {
      // Fallback for existing DB tables without coverLetterFileUrl columns
      await prisma.$executeRaw`
        INSERT INTO "job_applications" (
          "id","jobVacancyId","jobTitle","name","email","phone","linkedIn","portfolio",
          "coverLetter","resumeUrl","resumeOriginalName","resumeProvider",
          "status","isRead","ipAddress","createdAt","updatedAt"
        ) VALUES (
          ${id}, ${jobVacancyId}, ${jobTitle}, ${name}, ${email}, ${phone}, ${linkedIn}, ${portfolio},
          ${finalCoverLetterText}, ${resumeUrl}, ${resumeFile.name}, ${resumeProvider},
          'PENDING', false, ${clientIp}, ${now}, ${now}
        )
      `;
    }

    // Revalidate admin dashboard
    revalidatePath("/admin/dashboard");

    // Fire real-time notification to admin
    const notification = {
      id,
      category: "JOB_APPLICATION" as const,
      title: "New Job Application",
      clientName: name,
      email,
      subtext: `Applied for: ${jobTitle}`,
      content: coverLetter || `${name} applied for ${jobTitle}`,
      isRead: false,
      createdAt: now.toISOString(),
      targetTab: "job-applied",
    };
    NotificationService.notifyRealtime(notification);

    // Trigger email notification to company HR (budhabhaskar2@gmail.com)
    sendApplicationReceivedNotification({
      id,
      jobTitle,
      name,
      email,
      phone: phone || undefined,
      linkedIn: linkedIn || undefined,
      portfolio: portfolio || undefined,
      coverLetter: coverLetter || undefined,
      resumeUrl,
      resumeOriginalName: resumeFile.name,
      createdAt: now.toISOString(),
    }).catch((emailErr) => {
      console.error("Failed to send HR notification email:", emailErr);
    });

    return NextResponse.json({
      success: true,
      message: `Application submitted successfully! We'll review your application for ${jobTitle} and get back to you within 48 hours.`,
      applicationId: id,
      data: { id, jobTitle, name, email },
    });
  } catch (error: any) {
    console.error("POST /api/jobs/apply Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
