import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Parses a Cloudinary URL to extract the public_id and resource_type.
 * Handles both images, videos, and raw files under any folder structure.
 * 
 * Example URL:
 * https://res.cloudinary.com/demo/image/upload/v172000000/clickpoint_innovation/photo_123.jpg
 * Returns: { public_id: "clickpoint_innovation/photo_123", resource_type: "image" }
 */
export function extractCloudinaryPublicId(url: string): {
  public_id: string;
  resource_type: "image" | "video" | "raw";
} | null {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    const isVideo = url.includes("/video/upload/") || /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
    const isRaw = url.includes("/raw/upload/");
    const resource_type: "image" | "video" | "raw" = isVideo ? "video" : isRaw ? "raw" : "image";

    // Split at /upload/
    const uploadSplit = url.split(/\/upload\/(?:v\d+\/)?/);
    if (uploadSplit.length < 2) return null;

    let pathWithExtension = uploadSplit[1];

    // Remove query params if present
    pathWithExtension = pathWithExtension.split("?")[0];

    // Strip out file extension (.jpg, .png, .webp, .mp4, etc.)
    const lastDotIdx = pathWithExtension.lastIndexOf(".");
    const public_id = lastDotIdx > -1 ? pathWithExtension.substring(0, lastDotIdx) : pathWithExtension;

    return { public_id, resource_type };
  } catch (err) {
    console.error("Error parsing Cloudinary URL:", err);
    return null;
  }
}

/**
 * Deletes a file from Cloudinary given its URL or public_id.
 * Invalidates CDN cache automatically.
 */
export async function deleteCloudinaryMedia(urlOrPublicId: string): Promise<{
  success: boolean;
  result?: string;
  error?: string;
}> {
  if (!urlOrPublicId || typeof urlOrPublicId !== "string") {
    return { success: false, error: "Invalid URL or public_id" };
  }

  // If local upload (/uploads/...), delete from public/uploads folder on disk
  if (urlOrPublicId.startsWith("/uploads/")) {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const filename = path.basename(urlOrPublicId);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await fs.unlink(filePath);
      return { success: true, result: "deleted_local_file" };
    } catch (err: any) {
      console.warn("Failed to delete local file:", err?.message);
      return { success: true, result: "local_file_not_found" };
    }
  }

  let public_id = urlOrPublicId;
  let resource_type: "image" | "video" | "raw" = "image";

  if (urlOrPublicId.includes("res.cloudinary.com")) {
    const extracted = extractCloudinaryPublicId(urlOrPublicId);
    if (extracted) {
      public_id = extracted.public_id;
      resource_type = extracted.resource_type;
    }
  }

  try {
    console.log(`[Cloudinary Cleanup] Attempting to destroy public_id: "${public_id}" (type: ${resource_type})`);
    const res = await cloudinary.uploader.destroy(public_id, {
      resource_type,
      invalidate: true,
    });

    console.log(`[Cloudinary Cleanup] Destroy response for [${public_id}]:`, res);
    const isOk = res.result === "ok" || res.result === "not found";
    return { success: isOk, result: res.result };
  } catch (err: any) {
    console.error(`[Cloudinary Cleanup] Error destroying media [${public_id}]:`, err?.message || err);
    return { success: false, error: err?.message || "Cloudinary deletion failed" };
  }
}
