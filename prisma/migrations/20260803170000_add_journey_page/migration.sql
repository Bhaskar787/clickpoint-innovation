-- CreateTable JourneyPage
CREATE TABLE IF NOT EXISTS "journey_page" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_page_pkey" PRIMARY KEY ("id")
);
