/**
 * Helper to dynamically determine the absolute base URL of the application.
 * Priority:
 * 1. Incoming Request headers (x-forwarded-host / host + x-forwarded-proto) for live production requests
 * 2. NEXT_PUBLIC_APP_URL, APP_URL, or BETTER_AUTH_URL environment variables
 * 3. VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL environment variables (automatic on Vercel deployment)
 * 4. Fallback to http://localhost:3000 for local development
 */
export function getAppBaseUrl(req?: Request): string {
  // 1. Check incoming HTTP Request headers first for live server requests
  if (req) {
    try {
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
      if (host) {
        const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");
        return `${proto}://${host}`.replace(/\/$/, "");
      }
    } catch (err) {
      // Ignore header parsing errors fallback to env
    }
  }

  // 2. Check explicitly configured environment variables
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || process.env.BETTER_AUTH_URL;
  if (envUrl && envUrl.trim() !== "" && !envUrl.includes("localhost")) {
    return envUrl.trim().replace(/\/$/, "");
  }

  // 3. Check Vercel production deployment environment variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim().replace(/\/$/, "")}`;
  }

  // 4. Fallback to configured envUrl or default localhost
  return (envUrl || "http://localhost:3000").trim().replace(/\/$/, "");
}

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  mimeType?: string; // "image/webp" | "image/png" | "image/jpeg"
}

/**
 * Client-Side Smart Image Compressor & Optimizer
 * Scales and compresses raster images before network transmission using HTML5 Canvas.
 * Reduces 3MB-10MB uploads down to lean 20KB-80KB assets to minimize local drive storage.
 */
export async function optimizeImageBeforeUpload(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<File> {
  // If not running in browser, or file is SVG or ICO, return as-is
  if (
    typeof window === "undefined" ||
    file.type === "image/svg+xml" ||
    file.type === "image/x-icon" ||
    file.name.endsWith(".ico") ||
    file.name.endsWith(".svg")
  ) {
    return file;
  }

  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    mimeType = file.type === "image/png" ? "image/png" : "image/webp",
  } = options;

  return new Promise<File>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proportional scale down
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const ext = mimeType === "image/webp" ? ".webp" : mimeType === "image/png" ? ".png" : ".jpg";
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const optimizedFile = new File([blob], `${baseName}${ext}`, {
              type: mimeType,
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

