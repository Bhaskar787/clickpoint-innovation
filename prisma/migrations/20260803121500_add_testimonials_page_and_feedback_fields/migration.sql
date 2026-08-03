-- CreateTable for TestimonialsPage
CREATE TABLE IF NOT EXISTS "testimonials_page" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_page_pkey" PRIMARY KEY ("id")
);

-- AlterTable Testimonials to add feedback moderation and rate limiting fields
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "ipAddress" TEXT;
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "userEmail" TEXT;
