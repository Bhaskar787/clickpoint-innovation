-- Migration: add_job_applications
-- Adds the ApplicationStatus enum and job_applications table,
-- and links it back to job_vacancies via a foreign key.
-- Safe to run on a database that already has all other tables.

-- 1. Create the ApplicationStatus enum type
CREATE TYPE "ApplicationStatus" AS ENUM (
  'PENDING',
  'REVIEWING',
  'SHORTLISTED',
  'REJECTED',
  'HIRED'
);

-- 2. Create the job_applications table
CREATE TABLE "job_applications" (
  "id"                 TEXT         NOT NULL,
  "jobVacancyId"       TEXT         NOT NULL,
  "jobTitle"           TEXT         NOT NULL,
  "name"               TEXT         NOT NULL,
  "email"              TEXT         NOT NULL,
  "phone"              TEXT,
  "linkedIn"           TEXT,
  "portfolio"          TEXT,
  "coverLetter"        TEXT,
  "resumeUrl"          TEXT         NOT NULL,
  "resumeOriginalName" TEXT,
  "resumeProvider"     TEXT         NOT NULL DEFAULT 'local',
  "status"             "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
  "isRead"             BOOLEAN      NOT NULL DEFAULT false,
  "ipAddress"          TEXT,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL,

  CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- 3. Foreign key → job_vacancies (cascade delete)
ALTER TABLE "job_applications"
  ADD CONSTRAINT "job_applications_jobVacancyId_fkey"
  FOREIGN KEY ("jobVacancyId")
  REFERENCES "job_vacancies"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- 4. Helpful indexes
CREATE INDEX "job_applications_jobVacancyId_idx" ON "job_applications"("jobVacancyId");
CREATE INDEX "job_applications_email_idx"        ON "job_applications"("email");
CREATE INDEX "job_applications_status_idx"       ON "job_applications"("status");
CREATE INDEX "job_applications_isRead_idx"       ON "job_applications"("isRead");
CREATE INDEX "job_applications_createdAt_idx"    ON "job_applications"("createdAt" DESC);
