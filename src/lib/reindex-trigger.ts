export function triggerReindexBackground() {
  if (process.env.VERCEL && (!process.env.INGESTION_SERVICE_URL || process.env.INGESTION_SERVICE_URL.includes("localhost"))) {
    return;
  }
  const ingestionUrl = process.env.INGESTION_SERVICE_URL || "http://localhost:8001";
  const apiKey = process.env.INTERNAL_API_KEY || "clickpoint-secret-internal-key-2026";

  // Fire-and-forget fetch so server actions don't block
  fetch(`${ingestionUrl}/reindex`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Key": apiKey,
    },
  }).catch((err) => {
    console.error("Background reindex trigger error:", err);
  });
}
