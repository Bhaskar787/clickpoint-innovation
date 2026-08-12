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
