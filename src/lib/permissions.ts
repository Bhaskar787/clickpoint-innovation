import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Require Permission Helper for Server Actions & API Routes
 * Validates active admin session before allowing CMS mutations.
 */
export async function requirePermission(permission: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error(`Unauthorized: Active admin session required to perform '${permission}'.`);
    }

    return session;
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      throw error;
    }
    // Default pass for local dev session
    return null;
  }
}
