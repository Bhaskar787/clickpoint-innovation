import { getAppBaseUrl } from "@/lib/url";

export interface ApplicantStatusTemplateData {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  emailType: "APPROVED" | "REJECTED" | "REVIEWING" | "INTERVIEW" | "CUSTOM";
  customSubject?: string;
  customMessage?: string;
  appUrl?: string;
  useCidLogo?: boolean;
}

/**
 * Generate HTML email template sent to candidates from Admin Dashboard.
 * White Clickpoint Executive Theme featuring official company logo via CID attachment or URL.
 */
export function getApplicantStatusEmailHTML(data: ApplicantStatusTemplateData): {
  subject: string;
  html: string;
} {
  const { applicantName, jobTitle, emailType, customSubject, customMessage, useCidLogo = true } = data;
  const baseUrl = data.appUrl || getAppBaseUrl();
  
  // Use CID inline attachment for real emails so Gmail renders logo reliably on localhost & production
  const logoSrc = useCidLogo ? "cid:clickpoint-logo" : `${baseUrl}/images/clickpointfinal.png`;

  let defaultSubject = "";
  let badgeLabel = "";
  let badgeStyle = "";
  let bodyContent = "";

  if (emailType === "APPROVED") {
    defaultSubject = `Application Shortlisted: ${jobTitle} at Clickpoint Innovations`;
    badgeLabel = "Application Shortlisted";
    badgeStyle = "background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;";
    bodyContent = customMessage
      ? customMessage.replace(/\n/g, "<br/>")
      : `
      <p>Dear <strong>${applicantName}</strong>,</p>
      <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at <strong>Clickpoint Innovations</strong>.</p>
      <p>We are pleased to inform you that after reviewing your application and resume, your profile has been <strong>shortlisted</strong> for the next round of our technical evaluation.</p>
      <p>Our talent acquisition team will reach out to you shortly to coordinate the schedule for your initial interview session.</p>
      <p>Best regards,<br/><strong>Clickpoint Innovations Hiring Team</strong></p>
    `;
  } else if (emailType === "REJECTED") {
    defaultSubject = `Update on your application for ${jobTitle} at Clickpoint Innovations`;
    badgeLabel = "Application Update";
    badgeStyle = "background-color: #f8fafc; color: #475569; border: 1px solid #cbd5e1;";
    bodyContent = customMessage
      ? customMessage.replace(/\n/g, "<br/>")
      : `
      <p>Dear <strong>${applicantName}</strong>,</p>
      <p>Thank you for taking the time to apply for the position of <strong>${jobTitle}</strong> at <strong>Clickpoint Innovations</strong>.</p>
      <p>We received many applications from highly qualified candidates. While your background is impressive, we have chosen to move forward with candidates whose experience more closely matches our immediate project needs for this position.</p>
      <p>We sincerely appreciate your time and interest in Clickpoint Innovations, and we wish you all the best in your career pursuits.</p>
      <p>Best regards,<br/><strong>Clickpoint Innovations HR Team</strong></p>
    `;
  } else if (emailType === "REVIEWING") {
    defaultSubject = `Application Status Update: ${jobTitle} - Under Review`;
    badgeLabel = "Under Active Review";
    badgeStyle = "background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;";
    bodyContent = customMessage
      ? customMessage.replace(/\n/g, "<br/>")
      : `
      <p>Dear <strong>${applicantName}</strong>,</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>Clickpoint Innovations</strong> is currently under active review by our engineering leadership team.</p>
      <p>We will contact you with further updates as soon as the review phase concludes.</p>
      <p>Best regards,<br/><strong>Clickpoint Innovations Recruitment Team</strong></p>
    `;
  } else if (emailType === "INTERVIEW") {
    defaultSubject = `Interview Invitation: ${jobTitle} at Clickpoint Innovations`;
    badgeLabel = "Interview Invitation";
    badgeStyle = "background-color: #faf5ff; color: #6b21a8; border: 1px solid #e9d5ff;";
    bodyContent = customMessage
      ? customMessage.replace(/\n/g, "<br/>")
      : `
      <p>Dear <strong>${applicantName}</strong>,</p>
      <p>We are excited to invite you for an interview for the <strong>${jobTitle}</strong> position at <strong>Clickpoint Innovations</strong>!</p>
      <p>Please reply to this email with your preferred available dates and time slots for a 30-minute virtual discussion.</p>
      <p>Best regards,<br/><strong>Clickpoint Innovations Hiring Team</strong></p>
    `;
  } else {
    // CUSTOM
    defaultSubject = `Regarding your application for ${jobTitle} at Clickpoint Innovations`;
    badgeLabel = "Official Communication";
    badgeStyle = "background-color: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0;";
    bodyContent = (customMessage || "").replace(/\n/g, "<br/>");
  }

  const subject = customSubject || defaultSubject;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f6f9;
            color: #334155;
            margin: 0;
            padding: 30px 12px;
            -webkit-font-smoothing: antialiased;
          }
          .email-wrapper {
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
          }
          .email-header {
            padding: 32px 36px 24px 36px;
            background-color: #ffffff;
            border-bottom: 1px solid #f1f5f9;
          }
          .logo-img {
            height: 48px;
            width: auto;
            max-width: 240px;
            display: block;
            border: 0;
          }
          .badge {
            display: inline-block;
            padding: 5px 14px;
            font-size: 11px;
            font-weight: 700;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
          }
          .email-body {
            padding: 36px;
            font-size: 14px;
            line-height: 1.8;
            color: #1e293b;
          }
          .email-body p {
            margin: 0 0 16px 0;
          }
          .email-body p:last-child {
            margin-bottom: 0;
          }
          .email-divider {
            height: 1px;
            background-color: #f1f5f9;
            margin: 28px 0;
          }
          .company-card {
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            padding: 16px 20px;
            font-size: 12px;
            color: #64748b;
          }
          .email-footer {
            background-color: #ffffff;
            border-top: 1px solid #f1f5f9;
            padding: 24px 36px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.6;
          }
          .email-footer a {
            color: #0052cc;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- White Executive Header with Official Clickpoint Logo -->
          <div class="email-header">
            <a href="${baseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
              <img src="${logoSrc}" alt="Clickpoint Innovations" class="logo-img" />
            </a>
            <div style="margin-top: 18px;">
              <span class="badge" style="${badgeStyle}">${badgeLabel}</span>
            </div>
          </div>

          <!-- Main Body Content -->
          <div class="email-body">
            ${bodyContent}

            <div class="email-divider"></div>

            <div class="company-card">
              <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Clickpoint Innovations</strong>
              Position Applied: <span style="color: #0f172a; font-weight: 600;">${jobTitle}</span><br/>
              Applicant Reference: <span style="color: #0f172a;">${data.applicantEmail}</span>
            </div>

            <!-- Automated No-Reply Notice Banner -->
            <div style="margin-top: 16px; background-color: #fffbe6; border: 1px solid #ffe58f; border-radius: 10px; padding: 12px 16px; font-size: 11px; color: #8c6b00; line-height: 1.5;">
              <strong>⚠️ Automated No-Reply Email:</strong> This message was sent from an unmonitored notification system. Direct replies to this email address will not be received or monitored by our team.
            </div>
          </div>

          <!-- Executive White Footer -->
          <div class="email-footer">
            <p style="margin: 0 0 6px 0;">
              © ${new Date().getFullYear()} <strong>Clickpoint Innovations</strong>. All rights reserved.
            </p>
            <p style="margin: 0;">
              Technology & Engineering Division • <a href="${baseUrl}" target="_blank">visit website</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}
