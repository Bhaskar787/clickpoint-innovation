import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
  reindexTimeout: NodeJS.Timeout | undefined;
};

const CONTENT_MODELS_LOWER = new Set([
  "landingpage",
  "aboutpage",
  "servicespage",
  "journeypage",
  "industriespage",
  "careerspage",
  "contactpage",
  "casestudiespage",
  "testimonialspage",
  "blogpage",
  "chatbotpage",
  "jobvacancy",
  "jobcategory",
  "blogpost",
  "casestudy",
  "testimonial",
  "faq",
  "faqcategory",
  "blogcategory",
  "casestudycategory"
]);

const MUTATION_OPERATIONS = new Set([
  "create",
  "createMany",
  "update",
  "updateMany",
  "upsert",
  "delete",
  "deleteMany",
]);

function triggerDebouncedReindex() {
  if (globalForPrisma.reindexTimeout) {
    clearTimeout(globalForPrisma.reindexTimeout);
  }
  // If running in Vercel serverless environment without external ingestion service, skip localhost call
  if (process.env.VERCEL && (!process.env.INGESTION_SERVICE_URL || process.env.INGESTION_SERVICE_URL.includes("localhost"))) {
    return;
  }
  globalForPrisma.reindexTimeout = setTimeout(async () => {
    try {
      const ingestionUrl = process.env.INGESTION_SERVICE_URL || "http://localhost:8001";
      const internalKey = process.env.INTERNAL_API_KEY || "clickpoint-secret-internal-key-2026";
      console.log("[RAG Auto-Reindex] Content mutation detected, triggering /reindex with auth key...");
      const res = await fetch(`${ingestionUrl}/reindex`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-key": internalKey,
        },
      });
      const data = await res.json();
      console.log("[RAG Auto-Reindex] Re-index result:", data);
    } catch (err) {
      console.error("[RAG Auto-Reindex Error] Failed to trigger /reindex:", err);
    }
  }, 2000);
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || "";
  const needsSsl = connectionString.includes("supabase.com") || connectionString.includes("sslmode=require");
  
  const pool = new pg.Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });

  const adapter = new PrismaPg(pool);
  const baseClient = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return baseClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const result = await query(args);
          if (model) {
            const mLower = model.toLowerCase();
            const isMutation = MUTATION_OPERATIONS.has(operation);
            if (CONTENT_MODELS_LOWER.has(mLower) && isMutation) {
              console.log(`[Prisma Extension] Detected mutation '${operation}' on model '${model}'. Scheduling auto-reindex...`);
              triggerDebouncedReindex();
            }
          }
          return result;
        },
      },
    },
  });
};

const getPrisma = () => {
  if (process.env.NODE_ENV === "development") {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    return globalForPrisma.prisma;
  }
  return createPrismaClient();
};

export const prisma = getPrisma();
