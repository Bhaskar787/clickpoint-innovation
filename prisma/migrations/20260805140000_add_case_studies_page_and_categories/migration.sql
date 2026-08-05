-- CreateTable
CREATE TABLE "case_studies_page" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_studies_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_study_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_study_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "case_study_categories_name_key" ON "case_study_categories"("name");

-- AlterTable
ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "impact" TEXT;
ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "liveUrl" TEXT;
ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "buttonText" TEXT DEFAULT 'Explore Live Platform';
ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "buttonLink" TEXT;
ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "imageGradient" TEXT DEFAULT 'from-violet-600 to-indigo-800';

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "case_study_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
