import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// GET /api/jobs/resume?id=...&action=inline|download
// Serves resume files securely with proper Content-Disposition and Content-Type headers.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action") || "inline"; // "inline" for browser viewing/preview, "download" for forced file download
    let directUrl = searchParams.get("url");

    let resumeUrl = "";
    let originalName = "resume.pdf";

    if (id) {
      const apps = await prisma.$queryRaw<any[]>`
        SELECT "resumeUrl", "resumeOriginalName"
        FROM "job_applications"
        WHERE id = ${id}
        LIMIT 1
      `;
      if (apps && apps.length > 0) {
        resumeUrl = apps[0].resumeUrl || "";
        originalName = apps[0].resumeOriginalName || "resume.pdf";
      }
    }

    if (!resumeUrl && directUrl) {
      resumeUrl = decodeURIComponent(directUrl);
      const urlParts = resumeUrl.split("/");
      originalName = searchParams.get("filename") || urlParts[urlParts.length - 1] || "resume.pdf";
    }

    if (!resumeUrl) {
      return NextResponse.json({ success: false, error: "Resume file not found" }, { status: 404 });
    }

    let fileBuffer: Buffer;
    let contentType = "application/pdf";

    if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
      // Remote file fetch (Cloudinary, AWS S3, external storage)
      const fetchRes = await fetch(resumeUrl);
      if (!fetchRes.ok) {
        return NextResponse.json(
          { success: false, error: `Failed to fetch remote resume file (HTTP ${fetchRes.status})` },
          { status: fetchRes.status }
        );
      }
      const arrayBuf = await fetchRes.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuf);
      const remoteType = fetchRes.headers.get("content-type");
      if (remoteType && !remoteType.includes("octet-stream") && !remoteType.includes("text/plain")) {
        contentType = remoteType;
      }
    } else {
      // Local static file fetch (/uploads/resumes/...)
      const cleanPath = resumeUrl.startsWith("/") ? resumeUrl.slice(1) : resumeUrl;
      const localFilePath = path.join(process.cwd(), "public", cleanPath);
      try {
        fileBuffer = await fs.readFile(localFilePath);
      } catch (fileErr) {
        return NextResponse.json({ success: false, error: "Local resume file does not exist" }, { status: 404 });
      }
    }

    // Determine precise content-type based on file extension
    const lowerName = (originalName || resumeUrl).toLowerCase();
    if (lowerName.endsWith(".pdf")) {
      contentType = "application/pdf";
    } else if (lowerName.endsWith(".png")) {
      contentType = "image/png";
    } else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (lowerName.endsWith(".webp")) {
      contentType = "image/webp";
    } else if (lowerName.endsWith(".docx")) {
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (lowerName.endsWith(".doc")) {
      contentType = "application/msword";
    }

    const dispositionType = action === "download" ? "attachment" : "inline";
    const safeFilename = encodeURIComponent(originalName);

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      `${dispositionType}; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`
    );
    headers.set("Cache-Control", "public, max-age=3600");

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("GET /api/jobs/resume error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
