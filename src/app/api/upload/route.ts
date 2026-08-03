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

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Extract existing public_id if replacing an image/video
    let existingPublicId: string | undefined = undefined;
    if (customPublicId) {
      existingPublicId = customPublicId;
    } else if (previousUrl) {
      const extracted = extractCloudinaryPublicId(previousUrl);
      if (extracted) {
        existingPublicId = extracted.public_id;
      } else {
        // Delete previous non-matching url in background
        deleteCloudinaryMedia(previousUrl).catch((err) => {
          console.warn("Background deletion of previous media failed:", err);
        });
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // 1. Cloudinary Direct Native Overwrite & Auto-Delete Logic
    try {
      const resourceType = mimeType.startsWith("video/") ? "video" : "image";
      
      const uploadOptions: any = {
        folder: "clickpoint_innovation",
        resource_type: resourceType,
        overwrite: true,   // Direct Cloudinary instruction to replace old asset
        invalidate: true,  // Immediately purge global CDN cache
      };

      // If we have an existing public_id to overwrite, tell Cloudinary to replace it directly!
      if (existingPublicId) {
        // Strip out folder prefix if already included
        const cleanPublicId = existingPublicId.startsWith("clickpoint_innovation/")
          ? existingPublicId.replace("clickpoint_innovation/", "")
          : existingPublicId;
        uploadOptions.public_id = cleanPublicId;
      }

      const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

      if (result && result.secure_url) {
        return NextResponse.json({
          success: true,
          url: result.secure_url,
          provider: "cloudinary",
          public_id: result.public_id,
          overwritten: Boolean(existingPublicId),
        });
      }
    } catch (cloudinaryErr: any) {
      console.warn("Cloudinary API Upload returned error (falling back to local storage):", cloudinaryErr?.message || cloudinaryErr);
    }

    // 2. Fallback to Local Storage inside public/uploads
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
