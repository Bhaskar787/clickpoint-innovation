import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // 1. Attempt Cloudinary Upload first
    try {
      const resourceType = mimeType.startsWith("video/") ? "video" : "image";
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "clickpoint_innovation",
        resource_type: resourceType,
      });

      if (result && result.secure_url) {
        return NextResponse.json({
          success: true,
          url: result.secure_url,
          provider: "cloudinary",
          public_id: result.public_id,
        });
      }
    } catch (cloudinaryErr: any) {
      console.warn("Cloudinary API Upload returned error (falling back to local storage):", cloudinaryErr?.message || cloudinaryErr);
    }

    // 2. Fallback to Local Storage inside public/uploads if Cloudinary credentials fail (e.g. 403 Forbidden)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);
    const localUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      provider: "local",
      warning: "Cloudinary credentials returned HTTP 403 Forbidden. Saved to local storage. Update CLOUDINARY_API_SECRET in .env for Cloudinary hosting.",
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process file upload" },
      { status: 500 }
    );
  }
}
