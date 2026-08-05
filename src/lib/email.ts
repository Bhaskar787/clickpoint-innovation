import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import {
  getHRNotificationEmailHTML,
  HRNotificationTemplateData,
} from "./email-templates/hr-notification.template";
import {
  getApplicantStatusEmailHTML,
  ApplicantStatusTemplateData,
} from "./email-templates/applicant-status.template";

export type ApplicationEmailData = Omit<HRNotificationTemplateData, "appUrl">;
export type StatusEmailData = ApplicantStatusTemplateData;

function getTransporter() {
  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || "";
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return null;
}

// Get inline logo attachment so image renders 100% reliably in Gmail, Outlook & Apple Mail
function getLogoAttachment() {
  const logoPath = path.join(process.cwd(), "public", "images", "clickpointfinal.png");
  if (fs.existsSync(logoPath)) {
    return [
      {
        filename: "clickpointfinal.png",
        path: logoPath,
        cid: "clickpoint-logo", // matches src="cid:clickpoint-logo" in HTML template
      },
    ];
  }
  return [];
}

// Sanitize string to prevent email header injection
function sanitizeHeader(input: string): string {
  return input.replace(/[\r\n]/g, " ").trim();
}

/**
 * Send email notification to company HR when a candidate submits a job application
 */
export async function sendApplicationReceivedNotification(data: ApplicationEmailData) {
  const companyHrEmail = process.env.COMPANY_HR_EMAIL || "budhabhaskar2@gmail.com";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const smtpFrom = process.env.SMTP_FROM || `"Clickpoint Innovations Careers" <${process.env.SMTP_USER || companyHrEmail}>`;

  const hrEmail = sanitizeHeader(companyHrEmail);
  const subject = sanitizeHeader(`[New Job Application] ${data.name} applied for ${data.jobTitle}`);

  const htmlContent = getHRNotificationEmailHTML({
    ...data,
    appUrl,
    useCidLogo: true,
  });

  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: smtpFrom,
        to: hrEmail,
        replyTo: sanitizeHeader(data.email),
        subject,
        html: htmlContent,
        attachments: getLogoAttachment(),
      });
      console.log(`✅ [Email Service] Sent application alert to ${hrEmail} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error(`❌ [Email Service] Failed to send email to ${hrEmail}:`, err);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`ℹ️ [Email Service Mock Log] Target: ${hrEmail} | Subject: ${subject}`);
    return { success: true, mocked: true };
  }
}

/**
 * Send email to candidate from Admin Dashboard (Status update or custom email)
 */
export async function sendApplicantStatusEmail(data: StatusEmailData) {
  const recipientEmail = sanitizeHeader(data.applicantEmail);
  const { subject, html } = getApplicantStatusEmailHTML({
    ...data,
    useCidLogo: true,
  });

  const companyHrEmail = process.env.COMPANY_HR_EMAIL || "budhabhaskar2@gmail.com";
  const smtpFrom = process.env.SMTP_FROM || `"Clickpoint Innovations Careers" <${process.env.SMTP_USER || companyHrEmail}>`;

  const transporter = getTransporter();
  if (transporter) {
    try {
      const adminReplyTo = process.env.ADMIN_EMAIL || companyHrEmail;
      const info = await transporter.sendMail({
        from: smtpFrom,
        to: recipientEmail,
        replyTo: sanitizeHeader(adminReplyTo),
        subject: sanitizeHeader(subject),
        html,
        attachments: getLogoAttachment(),
      });
      console.log(`✅ [Email Service] Sent email to candidate ${recipientEmail} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error(`❌ [Email Service] Failed to send email to ${recipientEmail}:`, err);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`ℹ️ [Email Service Mock Log] Target Candidate: ${recipientEmail} | Subject: ${subject}`);
    return { success: true, mocked: true };
  }
}
