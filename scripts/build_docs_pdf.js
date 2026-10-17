const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function renderMarkdownToHtml(mdFilePath) {
  const content = fs.readFileSync(mdFilePath, "utf-8");
  // Use npx marked to convert markdown to HTML
  const htmlBody = execSync(`npx -y marked`, { input: content, encoding: "utf-8" });
  return htmlBody;
}

function generateFullHtml(title, subtitle, htmlBody) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-center {
      content: "Clickpoint Innovation Platform Documentation — Page " counter(page);
      font-size: 8pt;
      color: #94a3b8;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    font-size: 10.5pt;
    margin: 0;
    padding: 0;
  }

  /* Document Header Cover Banner */
  .doc-header {
    background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%);
    color: #ffffff;
    padding: 32px 28px;
    border-radius: 12px;
    margin-bottom: 28px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .doc-header h1 {
    color: #ffffff;
    font-size: 22pt;
    margin: 0 0 10px 0;
    border-bottom: none;
    padding-bottom: 0;
    line-height: 1.25;
  }
  .doc-header .doc-subtitle {
    color: #93c5fd;
    font-size: 12pt;
    margin: 0 0 16px 0;
  }
  .doc-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }
  .badge {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #e2e8f0;
    font-size: 8.5pt;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 500;
  }
  .badge-highlight {
    background: #3b82f6;
    border-color: #60a5fa;
    color: #ffffff;
    font-weight: 600;
  }

  /* Typography */
  h1 {
    color: #0f172a;
    font-size: 18pt;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6px;
    margin-top: 28px;
    margin-bottom: 14px;
    page-break-after: avoid;
  }
  h2 {
    color: #1e293b;
    font-size: 14pt;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 5px;
    margin-top: 22px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }
  h3 {
    color: #334155;
    font-size: 12pt;
    margin-top: 18px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }
  h4 {
    color: #475569;
    font-size: 11pt;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 10px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 12px 0;
    padding-left: 24px;
  }
  li {
    margin-bottom: 4px;
  }

  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 14px 0 18px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    font-weight: 600;
  }
  td {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
  }
  tr:nth-child(even) {
    background-color: #f8fafc;
  }

  /* Code Blocks */
  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 12px 14px;
    border-radius: 8px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: auto;
    page-break-inside: avoid;
    margin: 10px 0 14px 0;
  }
  code {
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 85%;
    font-family: "SFMono-Regular", Consolas, Menlo, monospace;
  }
  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    font-size: inherit;
  }

  /* Blockquotes / Callouts */
  blockquote {
    border-left: 4px solid #3b82f6;
    background: #eff6ff;
    padding: 10px 14px;
    margin: 12px 0;
    border-radius: 0 6px 6px 0;
    color: #1e3a8a;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  blockquote p {
    margin: 0;
  }

  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 22px 0;
  }

  a {
    color: #2563eb;
    text-decoration: none;
  }

  /* Page Break Hygiene */
  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>
  <div class="doc-header">
    <h1>${title}</h1>
    <div class="doc-subtitle">${subtitle}</div>
    <div class="doc-badges">
      <span class="badge badge-highlight">Production Grade</span>
      <span class="badge">Next.js 14 App Router</span>
      <span class="badge">Supabase PostgreSQL</span>
      <span class="badge">Prisma ORM 7.9</span>
      <span class="badge">pgvector 384-dim</span>
      <span class="badge">FastAPI Python Microservices</span>
      <span class="badge">Better Auth</span>
      <span class="badge">Cloudinary CDN</span>
      <span class="badge">Version 2.0 (Oct 2026)</span>
    </div>
  </div>

  ${htmlBody}
</body>
</html>`;
}

function compileToPdf(inputHtmlPath, outputPdfPath) {
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const cmd = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPath}" "${inputHtmlPath}"`;
  console.log(`Compiling: ${inputHtmlPath} -> ${outputPdfPath}`);
  execSync(cmd, { stdio: "inherit" });
  console.log(`Successfully generated: ${outputPdfPath} (${fs.statSync(outputPdfPath).size} bytes)`);
}

function main() {
  const rootDir = path.resolve(__dirname, "..");

  // 1. Build Full Website Developer Documentation PDF
  const fullWebMd = path.join(rootDir, "docs", "FULL_WEBSITE_DEVELOPER_DOCUMENTATION.md");
  const fullWebHtml = path.join(rootDir, "scratch", "full_website_doc.html");
  const fullWebPdfPublic = path.join(rootDir, "public", "docs", "clickpoint_full_website_developer_documentation.pdf");
  const fullWebPdfDocs = path.join(rootDir, "docs", "clickpoint_full_website_developer_documentation.pdf");

  const fullWebBody = renderMarkdownToHtml(fullWebMd);
  const fullWebCompleteHtml = generateFullHtml(
    "Clickpoint Innovation — Full Platform Architecture & Developer Guide",
    "Complete Reference Manual: Database Schema, Dynamic CMS, Workflows, APIs, and Operations Runbook",
    fullWebBody
  );
  fs.writeFileSync(fullWebHtml, fullWebCompleteHtml, "utf-8");
  compileToPdf(fullWebHtml, fullWebPdfPublic);
  fs.copyFileSync(fullWebPdfPublic, fullWebPdfDocs);

  // 2. Build AI Chatbot Guide PDF as well
  const chatMd = path.join(rootDir, "docs", "CHATBOT_DEVELOPER_GUIDE.md");
  const chatHtml = path.join(rootDir, "scratch", "chatbot_doc.html");
  const chatPdfPublic = path.join(rootDir, "public", "docs", "clickpoint_ai_chatbot_architecture.pdf");
  const chatPdfDocs = path.join(rootDir, "docs", "clickpoint_ai_chatbot_architecture.pdf");

  const chatBody = renderMarkdownToHtml(chatMd);
  const chatCompleteHtml = generateFullHtml(
    "Clickpoint AI Chatbot — Production Developer Architecture Guide",
    "RAG Intelligence, PostgreSQL pgvector, Automatic Admin Reindexing, and Resilient Dual-Mode Vercel Fallback",
    chatBody
  );
  fs.writeFileSync(chatHtml, chatCompleteHtml, "utf-8");
  compileToPdf(chatHtml, chatPdfPublic);
  fs.copyFileSync(chatPdfPublic, chatPdfDocs);

  console.log("ALL PDF DOCUMENTATION COMPILED SUCCESSFULLY!");
}

main();
