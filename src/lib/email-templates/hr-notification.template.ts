export interface HRNotificationTemplateData {
  id: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  portfolio?: string;
  coverLetter?: string;
  resumeUrl: string;
  resumeOriginalName?: string;
  vacancyLocation?: string;
  createdAt?: string;
  appUrl: string;
  useCidLogo?: boolean;
}

/**
 * Generate HTML email template sent to Company HR (budhabhaskar2@gmail.com)
 * White Clickpoint Executive Theme featuring official company logo via CID attachment or URL.
 */
export function getHRNotificationEmailHTML(data: HRNotificationTemplateData): string {
  const baseUrl = data.appUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const logoSrc = data.useCidLogo !== false ? "cid:clickpoint-logo" : `${baseUrl}/images/clickpointfinal.png`;
  
  const inlineViewUrl = `${baseUrl}/api/jobs/resume?id=${data.id}&action=inline`;
  const downloadUrl = `${baseUrl}/api/jobs/resume?id=${data.id}&action=download`;
  const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleString()
    : new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Job Application Received - Clickpoint Innovations</title>
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
            background-color: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            margin-top: 14px;
          }
          .email-body {
            padding: 36px;
            font-size: 14px;
            line-height: 1.8;
            color: #1e293b;
          }
          .section-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748b;
            margin-bottom: 14px;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 28px;
          }
          .info-table td {
            padding: 10px 0;
            font-size: 13px;
            border-bottom: 1px solid #f1f5f9;
          }
          .info-table td.label {
            font-weight: 600;
            color: #64748b;
            width: 32%;
          }
          .info-table td.value {
            color: #0f172a;
            font-weight: 500;
          }
          .cover-letter {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            font-size: 13px;
            line-height: 1.7;
            white-space: pre-wrap;
            margin-bottom: 28px;
            color: #334155;
          }
          .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            flex-wrap: wrap;
          }
          .btn {
            display: inline-block;
            padding: 11px 20px;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
            border-radius: 8px;
            text-align: center;
          }
          .btn-primary {
            background-color: #10b981;
            color: #ffffff;
          }
          .btn-secondary {
            background-color: #f8fafc;
            color: #334155;
            border: 1px solid #cbd5e1;
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
          <!-- White Executive Header with Official Logo -->
          <div class="email-header">
            <a href="${baseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
              <img src="${logoSrc}" alt="Clickpoint Innovations" class="logo-img" />
            </a>
            <div>
              <span class="badge">New Application Received • ${data.jobTitle}</span>
            </div>
          </div>

          <!-- Main Body Content -->
          <div class="email-body">
            <div class="section-title">Candidate Profile Overview</div>
            <table class="info-table">
              <tr>
                <td class="label">Full Name</td>
                <td class="value"><strong>${data.name}</strong></td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="value"><a href="mailto:${data.email}" style="color: #0052cc; font-weight: 600;">${data.email}</a></td>
              </tr>
              <tr>
                <td class="label">Phone</td>
                <td class="value">${data.phone || "N/A"}</td>
              </tr>
              <tr>
                <td class="label">Applied Position</td>
                <td class="value"><strong>${data.jobTitle}</strong></td>
              </tr>
              <tr>
                <td class="label">Location</td>
                <td class="value">${data.vacancyLocation || "Remote (Global)"}</td>
              </tr>
              ${
                data.linkedIn
                  ? `<tr><td class="label">LinkedIn</td><td class="value"><a href="${data.linkedIn}" target="_blank" style="color: #0052cc;">${data.linkedIn}</a></td></tr>`
                  : ""
              }
              ${
                data.portfolio
                  ? `<tr><td class="label">Portfolio</td><td class="value"><a href="${data.portfolio}" target="_blank" style="color: #0052cc;">${data.portfolio}</a></td></tr>`
                  : ""
              }
              <tr>
                <td class="label">Submission Time</td>
                <td class="value">${formattedDate}</td>
              </tr>
            </table>

            ${
              data.coverLetter
                ? `
              <div class="section-title">Cover Letter</div>
              <div class="cover-letter">${data.coverLetter}</div>
            `
                : ""
            }

            <div class="section-title">Attached Resume & Actions</div>
            <p style="font-size: 13px; color: #475569; margin: 4px 0 16px 0;">
              Resume File: <strong>${data.resumeOriginalName || "Attached Resume"}</strong>
            </p>
            <div class="btn-group">
              <a href="${inlineViewUrl}" class="btn btn-primary" target="_blank">View Resume Online</a>
              <a href="${downloadUrl}" class="btn btn-secondary">Download Resume File</a>
              <a href="${baseUrl}/admin/dashboard" class="btn btn-secondary">Open Admin Dashboard</a>
            </div>
          </div>

          <!-- Executive White Footer -->
          <div class="email-footer">
            <p style="margin: 0 0 4px 0;">
              © ${new Date().getFullYear()} <strong>Clickpoint Innovations</strong>. All rights reserved.
            </p>
            <p style="margin: 0;">
              Automated HR Application System • <a href="${baseUrl}" target="_blank">visit website</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
