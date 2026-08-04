-- Migration: Add CareersPage, JobCategory, and JobVacancy models
-- CreateTable: careers_page (page-level content: hero, perks section headings, stats bar)
CREATE TABLE "careers_page" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "careers_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable: job_categories (departments admin can create/edit/delete)
CREATE TABLE "job_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "job_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable: job_vacancies (individual job postings linked to a category)
CREATE TABLE "job_vacancies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Full-Time',
    "location" TEXT NOT NULL DEFAULT 'Remote (Global)',
    "experience" TEXT NOT NULL DEFAULT 'Senior',
    "salary" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL DEFAULT '',
    "responsibilities" JSONB NOT NULL DEFAULT '[]',
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "job_vacancies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique category name
CREATE UNIQUE INDEX "job_categories_name_key" ON "job_categories"("name");

-- AddForeignKey: job_vacancies -> job_categories
ALTER TABLE "job_vacancies" ADD CONSTRAINT "job_vacancies_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "job_categories"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
