-- Migration: Add FaqCategory model, convert faqs.category (free text) -> faqs.categoryId (FK)

-- CreateTable: faq_categories (topics admin can create/edit/delete, same pattern as job_categories)
CREATE TABLE "faq_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "faq_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique category name
CREATE UNIQUE INDEX "faq_categories_name_key" ON "faq_categories"("name");

-- Backfill: create one faq_categories row per distinct category string
-- currently used on the faqs table (assigning simple order by first appearance).
INSERT INTO "faq_categories" ("id", "name", "order", "createdAt", "updatedAt")
SELECT
    'faqcat_' || substr(md5(random()::text || clock_timestamp()::text), 1, 20),
    t."category",
    t."rn" - 1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT "category", ROW_NUMBER() OVER (ORDER BY MIN("order"), MIN("createdAt")) AS rn
    FROM "faqs"
    GROUP BY "category"
) t;

-- AddColumn: faqs.categoryId (nullable for now, backfilled below)
ALTER TABLE "faqs" ADD COLUMN "categoryId" TEXT;

-- Backfill: point every existing FAQ row at the category row matching its old text value
UPDATE "faqs" f
SET "categoryId" = fc."id"
FROM "faq_categories" fc
WHERE fc."name" = f."category";

-- Enforce NOT NULL now that every row has been backfilled
ALTER TABLE "faqs" ALTER COLUMN "categoryId" SET NOT NULL;

-- Drop the old free-text column
ALTER TABLE "faqs" DROP COLUMN "category";

-- AddForeignKey: faqs -> faq_categories
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "faq_categories"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
