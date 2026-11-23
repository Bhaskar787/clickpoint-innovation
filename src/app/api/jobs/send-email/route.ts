import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendApplicantStatusEmail } from "@/lib/email";
import { getAppBaseUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

// POST /api/jobs/send-email — admin endpoint to send email to applicant
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      applicantId,
      applicantEmail,
      applicantName,
      jobTitle,
      emailType,
      customSubject,
      customMessage,
      updateStatus,
    } = body;

    if (!applicantEmail || !applicantName || !jobTitle || !emailType) {
      return NextResponse.json(
        { success: false, error: "Applicant email, name, job title, and email type are required." },
        { status: 400 }
      );
    }

    // 1. Fetch current application record to check sent email history and status
    let currentApp: any = null;
    let sentTypes: string[] = [];

    if (applicantId) {
      const rows = await prisma.$queryRaw<any[]>`
        SELECT id, status, "sentEmailTypes" FROM "job_applications" WHERE id = ${applicantId} LIMIT 1
      `;
      if (rows && rows.length > 0) {
        currentApp = rows[0];
      }
    } else {
      const rows = await prisma.$queryRaw<any[]>`
        SELECT id, status, "sentEmailTypes" FROM "job_applications" WHERE LOWER("email") = ${applicantEmail.toLowerCase().trim()} LIMIT 1
      `;
      if (rows && rows.length > 0) {
        currentApp = rows[0];
      }
    }

    if (currentApp && currentApp.sentEmailTypes) {
      try {
        sentTypes = Array.isArray(currentApp.sentEmailTypes)
          ? currentApp.sentEmailTypes
          : JSON.parse(currentApp.sentEmailTypes);
      } catch {
        sentTypes = [];
      }
    }

    const typeLabels: Record<string, string> = {
      APPROVED: "Shortlist",
      HIRED: "Job Offer / Hired",
      INTERVIEW: "Interview Invitation",
      REJECTED: "Rejection",
      REVIEWING: "Under Active Review",
    };

    // 2. Business Rule: Once a candidate is HIRED, status transition emails cannot be sent
    const isHiredCandidate = currentApp?.status === "HIRED" || sentTypes.includes("HIRED");
    if (
      isHiredCandidate &&
      (emailType === "APPROVED" || emailType === "INTERVIEW" || emailType === "REJECTED" || emailType === "REVIEWING")
    ) {
      return NextResponse.json(
        {
          success: false,
          isHired: true,
          error: `This candidate is already marked as HIRED. Status transition emails (${typeLabels[emailType] || emailType}) cannot be sent to an active hired team member. Only custom administrative messages can be sent.`,
        },
        { status: 400 }
      );
    }

    // 3. Business Rule: Cannot hire or send Job Offer email to an applicant who is currently REJECTED
    if (currentApp?.status === "REJECTED" && (emailType === "HIRED" || updateStatus === "HIRED")) {
      return NextResponse.json(
        {
          success: false,
          isRejected: true,
          error: "Cannot send Job Offer / Hired email to a candidate whose application has been rejected. A rejected applicant cannot be hired unless they resubmit a new application attempt.",
        },
        { status: 400 }
      );
    }

    // 3. Business Rule: Prevent duplicate status emails (1 email per stage)
    if (emailType !== "CUSTOM" && sentTypes.includes(emailType)) {
      const readableLabel = typeLabels[emailType] || emailType;
      return NextResponse.json(
        {
          success: false,
          alreadySent: true,
          error: `A ${readableLabel} email has already been sent to this candidate. Status emails can only be sent once per candidate to prevent duplicate emails.`,
        },
        { status: 400 }
      );
    }

    // 4. Send email via email service
    const emailResult = await sendApplicantStatusEmail({
      applicantEmail: applicantEmail.trim(),
      applicantName: applicantName.trim(),
      jobTitle: jobTitle.trim(),
      emailType,
      customSubject: customSubject?.trim(),
      customMessage: customMessage?.trim(),
      appUrl: getAppBaseUrl(request),
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || "Failed to dispatch email." },
        { status: 500 }
      );
    }

    // 5. Update sentEmailTypes and application status in DB
    const updatedSentTypes = Array.from(new Set([...sentTypes, emailType]));
    const targetId = currentApp?.id || applicantId;

    const finalStatusToUpdate = updateStatus || (emailType === "HIRED" ? "HIRED" : undefined);

    if (targetId) {
      if (finalStatusToUpdate) {
        await prisma.$executeRaw`
          UPDATE "job_applications"
          SET 
            status = ${finalStatusToUpdate}::"ApplicationStatus",
            "sentEmailTypes" = ${JSON.stringify(updatedSentTypes)}::jsonb,
            "updatedAt" = NOW()
          WHERE id = ${targetId}
        `;
      } else {
        await prisma.$executeRaw`
          UPDATE "job_applications"
          SET 
            "sentEmailTypes" = ${JSON.stringify(updatedSentTypes)}::jsonb,
            "updatedAt" = NOW()
          WHERE id = ${targetId}
        `;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Email successfully sent to ${applicantEmail}`,
      sentEmailTypes: updatedSentTypes,
      mocked: emailResult.mocked || false,
    });
  } catch (error: any) {
    console.error("POST /api/jobs/send-email error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
