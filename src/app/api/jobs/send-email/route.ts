import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendApplicantStatusEmail } from "@/lib/email";

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

    // Send email via email service
    const emailResult = await sendApplicantStatusEmail({
      applicantEmail: applicantEmail.trim(),
      applicantName: applicantName.trim(),
      jobTitle: jobTitle.trim(),
      emailType,
      customSubject: customSubject?.trim(),
      customMessage: customMessage?.trim(),
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || "Failed to dispatch email." },
        { status: 500 }
      );
    }

    // Optionally update application status in DB if requested
    if (updateStatus && applicantId) {
      await prisma.$executeRaw`
        UPDATE "job_applications"
        SET status = ${updateStatus}::"ApplicationStatus", "updatedAt" = NOW()
        WHERE id = ${applicantId}
      `;
    }

    return NextResponse.json({
      success: true,
      message: `Email successfully sent to ${applicantEmail}`,
      mocked: emailResult.mocked || false,
    });
  } catch (error: any) {
    console.error("POST /api/jobs/send-email error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
