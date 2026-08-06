-- CreateTable: landing_page
CREATE TABLE IF NOT EXISTS "landing_page" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_page_pkey" PRIMARY KEY ("id")
);

-- AlterTable: blog_posts
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
