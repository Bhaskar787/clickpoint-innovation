import { NextResponse } from "next/server";
import { cloudinary, deleteCloudinaryMedia, extractCloudinaryPublicId } from "@/lib/cloudinary";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const previousUrl = (formData.get("previousUrl") as string | null) || (formData.get("oldUrl") as string | null);
    const customPublicId = formData.get("public_id") as string | null;
    const subfolder = ((formData.get("folder") as string | null) || "media").replace(/[^a-zA-Z0-9_-]/g, "");
    const storagePref = (formData.get("storage") as string | null) || "local";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // 1. Storage Garbage Collection: Clean up previous local or cloud file if replacing
    if (previousUrl) {
      if (previousUrl.startsWith("/uploads/")) {
        const cleanRelPath = previousUrl.replace(/^\//, "");
        const oldDiskPath = path.join(process.cwd(), "public", cleanRelPath);
        fs.unlink(oldDiskPath).catch((err) => {
          console.warn("[Local Storage] Failed to delete replaced file:", err?.message);
        });
      } else if (previousUrl.includes("res.cloudinary.com")) {
        deleteCloudinaryMedia(previousUrl).catch((err) => {
          console.warn("[Cloudinary] Background deletion of previous media failed:", err);
        });
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "application/octet-stream";

    // 2. Primary Strategy: Local Drive Storage (Zero Cloud Quota, Instant Delivery)
    if (storagePref !== "cloudinary") {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", subfolder);
      await fs.mkdir(uploadsDir, { recursive: true });

      // Clean slugified file name
      const ext = path.extname(file.name) || (mimeType.includes("webp") ? ".webp" : mimeType.includes("png") ? ".png" : ".jpg");
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
      const uniqueFileName = `${baseName || "asset"}-${Date.now()}${ext.toLowerCase()}`;
      const filePath = path.join(uploadsDir, uniqueFileName);

      await fs.writeFile(filePath, buffer);
      const localUrl = `/uploads/${subfolder}/${uniqueFileName}`;

      return NextResponse.json({
        success: true,
        url: localUrl,
        provider: "local",
        fileName: uniqueFileName,
        sizeBytes: buffer.length,
      });
    }

    // 3. Cloudinary Upload (when storage="cloudinary" explicitly requested)
    let existingPublicId: string | undefined = customPublicId || undefined;
    if (!existingPublicId && previousUrl && previousUrl.includes("res.cloudinary.com")) {
      const extracted = extractCloudinaryPublicId(previousUrl);
      if (extracted) existingPublicId = extracted.public_id;
    }

    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    try {
      const resourceType = mimeType.startsWith("video/")
        ? "video"
        : mimeType.startsWith("image/")
        ? "image"
        : "raw";

      const uploadOptions: any = {
        folder: `clickpoint_innovation/${subfolder}`,
        resource_type: resourceType,
        overwrite: true,
        invalidate: true,
      };

      if (existingPublicId) {
        uploadOptions.public_id = existingPublicId.replace(/^clickpoint_innovation\//, "");
      }

      const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

      if (result && result.secure_url) {
        return NextResponse.json({
          success: true,
          url: result.secure_url,
          provider: "cloudinary",
          public_id: result.public_id,
        });
      }
    } catch (cloudinaryErr: any) {
      console.warn("Cloudinary upload failed, falling back to local drive storage:", cloudinaryErr?.message || cloudinaryErr);
    }

    // Fallback to local drive
    const fallbackDir = path.join(process.cwd(), "public", "uploads", subfolder);
    await fs.mkdir(fallbackDir, { recursive: true });
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(fallbackDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);
    const localUrl = `/uploads/${subfolder}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      provider: "local",
      sizeBytes: buffer.length,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process file upload" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const urlOrPublicId = body.url || body.public_id || body.imageUrl || body.mediaUrl;

    if (!urlOrPublicId) {
      return NextResponse.json(
        { success: false, error: "No URL or public_id provided for deletion" },
        { status: 400 }
      );
    }

    // If local file, delete from disk
    if (urlOrPublicId.startsWith("/uploads/")) {
      const cleanRelPath = urlOrPublicId.replace(/^\//, "");
      const diskPath = path.join(process.cwd(), "public", cleanRelPath);
      try {
        await fs.unlink(diskPath);
        return NextResponse.json({ success: true, provider: "local", result: "deleted" });
      } catch (err: any) {
        return NextResponse.json({ success: true, provider: "local", result: "file_not_found" });
      }
    }

    const result = await deleteCloudinaryMedia(urlOrPublicId);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete media asset" },
      { status: 500 }
    );
  }
}
