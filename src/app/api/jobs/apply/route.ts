import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { NotificationService } from "@/services/notification.service";
import { sendApplicationReceivedNotification } from "@/lib/email";
import { getAppBaseUrl } from "@/lib/url";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// GET /api/jobs/apply?email=...&jobVacancyId=... — check if an application exists for this email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const jobVacancyId = searchParams.get("jobVacancyId")?.trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: true, hasExisting: false, existingApplication: null });
    }

    const existingApps = await prisma.$queryRaw<any[]>`
      SELECT 
        id, "jobVacancyId", "jobTitle", name, email, phone, "linkedIn", portfolio,
        "coverLetter", "coverLetterFileUrl", "coverLetterOriginalName",
        "resumeUrl", "resumeOriginalName", "resumeProvider", status, "attemptCount", "createdAt"
      FROM "job_applications"
      WHERE LOWER("email") = ${email}
      ORDER BY "createdAt" DESC
      LIMIT 1
    `;

    if (!existingApps || existingApps.length === 0) {
      return NextResponse.json({ success: true, hasExisting: false, existingApplication: null });
    }

    const app = existingApps[0];
    const isSameJob = Boolean(jobVacancyId && app.jobVacancyId === jobVacancyId);
    const attemptCount = Number(app.attemptCount || 1);
    const isRejected = app.status === "REJECTED";
    const canResubmit = isSameJob && isRejected && attemptCount < 3;
    const maxAttemptsReached = isSameJob && isRejected && attemptCount >= 3;

    // Extract address from coverLetter text if prefixed with "Current Address: "
    let extractedAddress = "";
    let cleanCoverLetter = app.coverLetter || "";
    if (cleanCoverLetter.startsWith("Current Address: ")) {
      const parts = cleanCoverLetter.split("\n\n");
      extractedAddress = parts[0].replace("Current Address: ", "").trim();
      cleanCoverLetter = parts.slice(1).join("\n\n");
    }
    // Remove attached cover letter info string from cleanCoverLetter text
    if (cleanCoverLetter.includes("[Attached Cover Letter File:")) {
      cleanCoverLetter = cleanCoverLetter.split("[Attached Cover Letter File:")[0].trim();
    }

    const isHired = app.status === "HIRED";

    return NextResponse.json({
      success: true,
      hasExisting: true,
      isSameJob,
      isHired,
      isRejected,
      canResubmit,
      maxAttemptsReached,
      attemptCount,
      canSwitch: !isHired,
      existingApplication: {
        id: app.id,
        jobVacancyId: app.jobVacancyId,
        jobTitle: app.jobTitle,
        name: app.name,
        email: app.email,
        phone: app.phone,
        address: extractedAddress,
        linkedIn: app.linkedIn,
        portfolio: app.portfolio,
        coverLetter: cleanCoverLetter,
        coverLetterFileUrl: app.coverLetterFileUrl,
        coverLetterOriginalName: app.coverLetterOriginalName,
        resumeUrl: app.resumeUrl,
        resumeOriginalName: app.resumeOriginalName,
        status: app.status,
        attemptCount,
        createdAt: app.createdAt,
      },
    });
  } catch (error: any) {
    console.error("GET /api/jobs/apply Error:", error);
    return NextResponse.json({ success: false, error: "Failed to check existing application" }, { status: 500 });
  }
}

// POST /api/jobs/apply — public endpoint for candidates to submit or switch job applications
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const switchApplication = (formData.get("switchApplication") as string | null) === "true";
    const name = (formData.get("name") as string | null)?.trim();
    const email = (formData.get("email") as string | null)?.trim().toLowerCase();
    const phone = (formData.get("phone") as string | null)?.trim() || null;
    const linkedIn = (formData.get("linkedIn") as string | null)?.trim() || null;
    const portfolio = (formData.get("portfolio") as string | null)?.trim() || null;
    const address = (formData.get("address") as string | null)?.trim() || null;
    const coverLetter = (formData.get("coverLetter") as string | null)?.trim() || null;
    const coverLetterFile = formData.get("coverLetterFile") as File | null;
    const jobVacancyId = (formData.get("jobVacancyId") as string | null)?.trim();
    const jobTitle = (formData.get("jobTitle") as string | null)?.trim();
    const resumeFile = formData.get("resume") as File | null;

    if (!name || !email || !phone || !jobVacancyId || !jobTitle) {
      return NextResponse.json(
        { success: false, error: "Full name, email address, contact phone number, and job position are required." },
        { status: 400 }
      );
    }

    // Extract client IP address
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Check for existing application by email
    const existingApps = await prisma.$queryRaw<any[]>`
      SELECT 
        id, "jobVacancyId", "jobTitle", name, email, phone, "linkedIn", portfolio,
        "coverLetter", "coverLetterFileUrl", "coverLetterOriginalName",
        "resumeUrl", "resumeOriginalName", "resumeProvider", status, "attemptCount", "createdAt"
      FROM "job_applications"
      WHERE LOWER("email") = ${email}
      ORDER BY "createdAt" DESC
      LIMIT 1
    `;
    const existingApp = existingApps && existingApps.length > 0 ? existingApps[0] : null;

    if (existingApp) {
      // 0. If candidate is already HIRED: strictly lock all new applications and position switches
      if (existingApp.status === "HIRED") {
        return NextResponse.json(
          {
            success: false,
            isHired: true,
            canSwitch: false,
            error: `Congratulations! You have already been hired as "${existingApp.jobTitle}" at Clickpoint Innovations. As an active team member, internal position changes cannot be submitted through this public careers portal. Please contact HR directly.`,
          },
          { status: 403 }
        );
      }

      const isSameJob = Boolean(
        (jobVacancyId && existingApp.jobVacancyId === jobVacancyId) ||
        (jobTitle && existingApp.jobTitle.toLowerCase() === jobTitle.toLowerCase())
      );

      // 1. If applying to the exact SAME position:
      if (isSameJob) {
        if (existingApp.status === "REJECTED") {
          const currentAttempts = Number(existingApp.attemptCount || 1);
          if (currentAttempts >= 3) {
            return NextResponse.json(
              {
                success: false,
                isSameJob: true,
                maxAttemptsReached: true,
                error: `You have reached the maximum limit of 3 application attempts for "${existingApp.jobTitle}". Your application remains REJECTED. Further submissions for this position are closed.`,
              },
              { status: 403 }
            );
          }
          // Candidate is REJECTED and currentAttempts < 3: ALLOW RESUBMISSION!
          // We let execution continue to the UPDATE block below.
        } else {
          return NextResponse.json(
            {
              success: false,
              isSameJob: true,
              error: `You have already submitted an application for "${existingApp.jobTitle}". Your application status is currently: ${existingApp.status}. Our team is actively reviewing submissions.`,
            },
            { status: 409 }
          );
        }
      }

      // 2. If applying to a DIFFERENT position and NOT confirmed switch:
      if (!isSameJob && !switchApplication) {
        let extractedAddress = "";
        let cleanCoverLetter = existingApp.coverLetter || "";
        if (cleanCoverLetter.startsWith("Current Address: ")) {
          const parts = cleanCoverLetter.split("\n\n");
          extractedAddress = parts[0].replace("Current Address: ", "").trim();
          cleanCoverLetter = parts.slice(1).join("\n\n");
        }
        if (cleanCoverLetter.includes("[Attached Cover Letter File:")) {
          cleanCoverLetter = cleanCoverLetter.split("[Attached Cover Letter File:")[0].trim();
        }

        return NextResponse.json(
          {
            success: false,
            canSwitch: true,
            existingApplication: {
              id: existingApp.id,
              jobVacancyId: existingApp.jobVacancyId,
              jobTitle: existingApp.jobTitle,
              name: existingApp.name,
              email: existingApp.email,
              phone: existingApp.phone,
              address: extractedAddress,
              linkedIn: existingApp.linkedIn,
              portfolio: existingApp.portfolio,
              coverLetter: cleanCoverLetter,
              coverLetterFileUrl: existingApp.coverLetterFileUrl,
              coverLetterOriginalName: existingApp.coverLetterOriginalName,
              resumeUrl: existingApp.resumeUrl,
              resumeOriginalName: existingApp.resumeOriginalName,
              status: existingApp.status,
              createdAt: existingApp.createdAt,
            },
            error: `An application has already been submitted using this email address (${email}) for position "${existingApp.jobTitle}" (Status: ${existingApp.status}). Would you like to switch your application to "${jobTitle}"?`,
          },
          { status: 409 }
        );
      }
    }

    // 3. Strict Contact Number Uniqueness Check (excluding candidate's own existing application if switching)
    const digitsOnlyPhone = phone.replace(/\D/g, "");
    if (digitsOnlyPhone.length >= 6) {
      const phoneExists = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint as count FROM "job_applications"
        WHERE ("phone" = ${phone}
           OR (regexp_replace("phone", '\D', '', 'g') = ${digitsOnlyPhone}))
          AND "id" != ${existingApp ? existingApp.id : ""}
      `;
      if (phoneExists[0]?.count > BigInt(0)) {
        return NextResponse.json(
          {
            success: false,
            error: `An application has already been submitted using this contact phone number (${phone}) by another applicant. Only one active job application per unique contact number is allowed.`,
          },
          { status: 409 }
        );
      }
    }

    // Validate Cover Letter
    const hasCoverLetterText = Boolean(coverLetter && coverLetter.trim().length > 0) || Boolean(address && address.length > 0);
    const hasCoverLetterFile = Boolean(coverLetterFile && coverLetterFile.size > 0);
    const hasExistingCoverLetter = Boolean(existingApp && (existingApp.coverLetter || existingApp.coverLetterFileUrl));

    if (!hasCoverLetterText && !hasCoverLetterFile && !hasExistingCoverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter is compulsory. Please write your cover letter or upload a cover letter file before submitting." },
        { status: 400 }
      );
    }

    // Validate Resume file or existing resume
    const hasNewResume = Boolean(resumeFile && resumeFile.size > 0);
    const hasExistingResume = Boolean(existingApp && existingApp.resumeUrl);

    if (!hasNewResume && !hasExistingResume) {
      return NextResponse.json(
        { success: false, error: "Please attach your resume or CV before submitting." },
        { status: 400 }
      );
    }

    // If new resume uploaded, validate type
    if (hasNewResume && resumeFile) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const isAllowedType = allowedTypes.includes(resumeFile.type) || resumeFile.name.toLowerCase().endsWith(".pdf");
      if (!isAllowedType) {
        return NextResponse.json(
          { success: false, error: "Resume must be a PDF document, Word document, or image file." },
          { status: 400 }
        );
      }
    }

    // Resume Storage Processing:
    // If new resume provided -> upload to Cloudinary/local.
    // If switching and NO new resume provided -> preserve existing resumeUrl & resumeOriginalName!
    let resumeUrl = existingApp?.resumeUrl || "";
    let resumeOriginalName = existingApp?.resumeOriginalName || "";
    let resumeProvider = existingApp?.resumeProvider || "local";

    if (hasNewResume && resumeFile) {
      resumeOriginalName = resumeFile.name;
      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

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
        console.warn("Cloudinary upload for resume failed:", cloudErr?.message || cloudErr);
        const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production");
        if (!isServerless) {
          try {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
            await fs.mkdir(uploadsDir, { recursive: true });
            const safeName = resumeFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
            const uniqueFileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;
            await fs.writeFile(path.join(uploadsDir, uniqueFileName), buffer);
            resumeUrl = `/uploads/resumes/${uniqueFileName}`;
            resumeProvider = "local";
          } catch (localErr) {
            console.error("Local resume storage fallback failed:", localErr);
          }
        }
      }
    }

    // Cover Letter File Processing:
    // If new cover letter file uploaded -> upload to Cloudinary/local.
    // If switching and NO new file provided -> keep existing cover letter file URL.
    let coverLetterFileUrl: string | null = existingApp?.coverLetterFileUrl || null;
    let coverLetterOriginalName: string | null = existingApp?.coverLetterOriginalName || null;

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

    // Format final cover letter text
    let finalCoverLetterText = coverLetter || existingApp?.coverLetter || "";
    // Clean out previous address if updating
    if (finalCoverLetterText.startsWith("Current Address: ")) {
      const parts = finalCoverLetterText.split("\n\n");
      finalCoverLetterText = parts.slice(1).join("\n\n");
    }
    // Clean out previous attachment link text
    if (finalCoverLetterText.includes("[Attached Cover Letter File:")) {
      finalCoverLetterText = finalCoverLetterText.split("[Attached Cover Letter File:")[0].trim();
    }

    if (coverLetterFileUrl) {
      const fileInfoText = `[Attached Cover Letter File: ${coverLetterFileUrl}] (${coverLetterOriginalName || "Cover Letter File"})`;
      finalCoverLetterText = finalCoverLetterText
        ? `${finalCoverLetterText}\n\n${fileInfoText}`
        : fileInfoText;
    }
    if (address) {
      finalCoverLetterText = finalCoverLetterText
        ? `Current Address: ${address}\n\n${finalCoverLetterText}`
        : `Current Address: ${address}`;
    }

    const now = new Date();
    const isSameJob = existingApp
      ? Boolean(
          (jobVacancyId && existingApp.jobVacancyId === jobVacancyId) ||
          (jobTitle && existingApp.jobTitle.toLowerCase() === jobTitle.toLowerCase())
        )
      : false;
    const isSwitching = Boolean(switchApplication && existingApp && !isSameJob);
    const isResubmission = Boolean(existingApp && isSameJob && existingApp.status === "REJECTED");
    const isUpdatingExisting = isSwitching || isResubmission;
    const applicationId = isUpdatingExisting ? existingApp.id : randomUUID();

    const currentAttempts = Number(existingApp?.attemptCount || 1);
    const nextAttemptCount = isResubmission
      ? currentAttempts + 1
      : isSwitching
      ? 1
      : 1;

    if (isUpdatingExisting) {
      // Execute UPDATE on existing application (transferring to new role or resubmitting attempt)
      try {
        await prisma.$executeRaw`
          UPDATE "job_applications"
          SET
            "jobVacancyId" = ${jobVacancyId},
            "jobTitle" = ${jobTitle},
            "name" = ${name},
            "email" = ${email},
            "phone" = ${phone},
            "linkedIn" = ${linkedIn},
            "portfolio" = ${portfolio},
            "coverLetter" = ${finalCoverLetterText},
            "coverLetterFileUrl" = ${coverLetterFileUrl},
            "coverLetterOriginalName" = ${coverLetterOriginalName},
            "resumeUrl" = ${resumeUrl},
            "resumeOriginalName" = ${resumeOriginalName},
            "resumeProvider" = ${resumeProvider},
            "status" = 'PENDING'::"ApplicationStatus",
            "isRead" = false,
            "ipAddress" = ${clientIp},
            "sentEmailTypes" = '[]'::jsonb,
            "attemptCount" = ${nextAttemptCount},
            "createdAt" = ${now},
            "updatedAt" = ${now}
          WHERE "id" = ${applicationId}
        `;
      } catch (updateErr) {
        // Fallback for schemas without coverLetterFileUrl
        await prisma.$executeRaw`
          UPDATE "job_applications"
          SET
            "jobVacancyId" = ${jobVacancyId},
            "jobTitle" = ${jobTitle},
            "name" = ${name},
            "email" = ${email},
            "phone" = ${phone},
            "linkedIn" = ${linkedIn},
            "portfolio" = ${portfolio},
            "coverLetter" = ${finalCoverLetterText},
            "resumeUrl" = ${resumeUrl},
            "resumeOriginalName" = ${resumeOriginalName},
            "resumeProvider" = ${resumeProvider},
            "status" = 'PENDING'::"ApplicationStatus",
            "isRead" = false,
            "ipAddress" = ${clientIp},
            "sentEmailTypes" = '[]'::jsonb,
            "attemptCount" = ${nextAttemptCount},
            "createdAt" = ${now},
            "updatedAt" = ${now}
          WHERE "id" = ${applicationId}
        `;
      }
    } else {
      // Execute INSERT for brand new application
      try {
        await prisma.$executeRaw`
          INSERT INTO "job_applications" (
            "id","jobVacancyId","jobTitle","name","email","phone","linkedIn","portfolio",
            "coverLetter","coverLetterFileUrl","coverLetterOriginalName","resumeUrl","resumeOriginalName","resumeProvider",
            "status","isRead","ipAddress","attemptCount","createdAt","updatedAt"
          ) VALUES (
            ${applicationId}, ${jobVacancyId}, ${jobTitle}, ${name}, ${email}, ${phone}, ${linkedIn}, ${portfolio},
            ${finalCoverLetterText}, ${coverLetterFileUrl}, ${coverLetterOriginalName}, ${resumeUrl}, ${resumeOriginalName}, ${resumeProvider},
            'PENDING'::"ApplicationStatus", false, ${clientIp}, 1, ${now}, ${now}
          )
        `;
      } catch (insertErr) {
        await prisma.$executeRaw`
          INSERT INTO "job_applications" (
            "id","jobVacancyId","jobTitle","name","email","phone","linkedIn","portfolio",
            "coverLetter","resumeUrl","resumeOriginalName","resumeProvider",
            "status","isRead","ipAddress","attemptCount","createdAt","updatedAt"
          ) VALUES (
            ${applicationId}, ${jobVacancyId}, ${jobTitle}, ${name}, ${email}, ${phone}, ${linkedIn}, ${portfolio},
            ${finalCoverLetterText}, ${resumeUrl}, ${resumeOriginalName}, ${resumeProvider},
            'PENDING'::"ApplicationStatus", false, ${clientIp}, 1, ${now}, ${now}
          )
        `;
      }
    }

    // Revalidate admin dashboard and careers pages safely
    try {
      revalidatePath("/admin/dashboard");
      revalidatePath("/careers");
    } catch (revalErr) {
      console.warn("revalidatePath warning:", revalErr);
    }

    // Real-time broadcast notification to Admin Dashboard
    const notification = {
      id: applicationId,
      category: "JOB_APPLICATION" as const,
      title: isResubmission
        ? `Application Resubmitted (Attempt ${nextAttemptCount} of 3)`
        : isSwitching
        ? "Job Application Transferred"
        : "New Job Application",
      clientName: name,
      email,
      subtext: isResubmission
        ? `Resubmitted for "${jobTitle}" (Attempt ${nextAttemptCount} of 3)`
        : isSwitching
        ? `Transferred from "${existingApp.jobTitle}" to "${jobTitle}"`
        : `Applied for: ${jobTitle}`,
      content: coverLetter || `${name} ${isResubmission ? `resubmitted application for ${jobTitle} (Attempt ${nextAttemptCount} of 3)` : isSwitching ? "switched application to" : "applied for"} ${jobTitle}`,
      isRead: false,
      createdAt: now.toISOString(),
      targetTab: "job-applied",
    };
    NotificationService.notifyRealtime(notification);

    // Trigger email notification to company HR (budhabhaskar2@gmail.com)
    sendApplicationReceivedNotification({
      id: applicationId,
      jobTitle,
      name,
      email,
      phone: phone || undefined,
      linkedIn: linkedIn || undefined,
      portfolio: portfolio || undefined,
      coverLetter: finalCoverLetterText || undefined,
      resumeUrl,
      resumeOriginalName,
      createdAt: now.toISOString(),
      appUrl: getAppBaseUrl(request),
    }).catch((emailErr) => {
      console.error("Failed to send HR notification email:", emailErr);
    });

    return NextResponse.json({
      success: true,
      switched: isSwitching,
      isResubmission,
      attemptCount: nextAttemptCount,
      previousJobTitle: isSwitching ? existingApp.jobTitle : null,
      message: isResubmission
        ? `Application successfully resubmitted for ${jobTitle} (Attempt ${nextAttemptCount} of 3)! Your updated application is now pending review.`
        : isSwitching
        ? `Application successfully switched to ${jobTitle}! Your updated application is now pending review.`
        : `Application submitted successfully! We'll review your application for ${jobTitle} and get back to you within 48 hours.`,
      applicationId,
      data: { id: applicationId, jobTitle, name, email },
    });
  } catch (error: any) {
    console.error("POST /api/jobs/apply Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
