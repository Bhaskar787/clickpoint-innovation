-- CreateTable: blog_page
CREATE TABLE IF NOT EXISTS "blog_page" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable: blog_categories
CREATE TABLE IF NOT EXISTS "blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "blog_categories_name_key" ON "blog_categories"("name");

-- AlterTable: blog_posts
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "authorAvatar" TEXT;
