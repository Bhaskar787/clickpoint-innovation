import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_INDUSTRIES_PAGE_DATA } from "@/data/default-industries-data";
import { triggerReindexBackground } from "@/lib/reindex-trigger";
import { syncProjectCategoryUniqueness, isProjectMatchingCaseStudy } from "@/lib/catalog-sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Strips non-serializable objects while preserving valid icon string IDs
 */
function sanitizeIndustriesData(data: any) {
  if (!data) return data;
  const clone = JSON.parse(JSON.stringify(data));
  if (clone.industries && Array.isArray(clone.industries)) {
    clone.industries = clone.industries.map((ind: any) => {
      const iconString = typeof ind.icon === "string" ? ind.icon : (typeof ind.iconName === "string" ? ind.iconName : undefined);
      const { icon, ...rest } = ind;
      return {
        ...rest,
        ...(iconString ? { icon: iconString, iconName: iconString } : {}),
      };
    });
  }
  return clone;
}

// GET /api/industries — Fetch Industries Page Content from DB (or seed defaults)
export async function GET() {
  try {
    let pageRecord = await prisma.industriesPage.findFirst();

    if (!pageRecord) {
      console.log("No industries page found in DB. Seeding default content...");
      pageRecord = await prisma.industriesPage.create({
        data: {
          id: "default",
          content: DEFAULT_INDUSTRIES_PAGE_DATA as any,
        },
      });
    }

    const pageStudies = await prisma.caseStudy.findMany().catch(() => []);
    let sanitizedContent = sanitizeIndustriesData(pageRecord.content);

    if (sanitizedContent && Array.isArray(sanitizedContent.industries) && pageStudies.length > 0) {
      const { industries: syncedInds, hasChanges } = syncProjectCategoryUniqueness(pageStudies, sanitizedContent.industries);
      sanitizedContent.industries = syncedInds;
      if (hasChanges && pageRecord.id) {
        await prisma.industriesPage.update({
          where: { id: pageRecord.id },
          data: { content: sanitizedContent as any },
        }).catch(() => {});
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: sanitizedContent,
        updatedAt: pageRecord.updatedAt,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/industries error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch industries page content",
        fallback: sanitizeIndustriesData(DEFAULT_INDUSTRIES_PAGE_DATA),
      },
      { status: 500 }
    );
  }
}

// PUT /api/industries — Update Industries Page Content in DB
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid payload structure" },
        { status: 400 }
      );
    }

    const existing = await prisma.industriesPage.findFirst();
    const sanitizedToSave = sanitizeIndustriesData(body);

    // Bi-directional Project Status & Featured Sync: propagate project status & featured back to prisma.caseStudy
    const allStudies = await prisma.caseStudy.findMany().catch(() => []);
    if (sanitizedToSave && Array.isArray(sanitizedToSave.industries) && allStudies.length > 0) {
      for (const ind of sanitizedToSave.industries) {
        for (const proj of ind.projects || []) {
          const matchingCS = allStudies.find((cs: any) => isProjectMatchingCaseStudy(proj, cs));
          if (matchingCS) {
            let csUpdated = false;
            const updateData: any = {};

            const projFeatured = Boolean(proj.featured);
            if (proj.featured !== undefined && projFeatured !== Boolean(matchingCS.featured)) {
              updateData.featured = projFeatured;
              matchingCS.featured = projFeatured;
              csUpdated = true;
            }

            const projIsDraft = Boolean(proj.isDraft || proj.status === "draft");
            const csMetrics = matchingCS.metrics && typeof matchingCS.metrics === "object" && !Array.isArray(matchingCS.metrics)
              ? (matchingCS.metrics as any)
              : {};
            const csIsDraft = Boolean(csMetrics.isDraft || csMetrics.status === "draft");

            if ((proj.isDraft !== undefined || proj.status !== undefined) && projIsDraft !== csIsDraft) {
              const finalMetrics = {
                ...csMetrics,
                isDraft: projIsDraft,
                status: projIsDraft ? "draft" : "published",
              };
              updateData.metrics = finalMetrics;
              (matchingCS as any).metrics = finalMetrics;
              csUpdated = true;
            }

            if (csUpdated) {
              await prisma.caseStudy.update({
                where: { id: matchingCS.id },
                data: updateData,
              }).catch((e) => console.error("Failed to sync project status to case study:", e));
            }
          }
        }
      }

      // Enforce 1-to-1 Project Category Uniqueness before writing to DB
      const { industries: syncedInds } = syncProjectCategoryUniqueness(allStudies, sanitizedToSave.industries);
      sanitizedToSave.industries = syncedInds;
    }

    let updatedRecord;
    if (existing) {
      updatedRecord = await prisma.industriesPage.update({
        where: { id: existing.id },
        data: {
          content: sanitizedToSave as any,
        },
      });
    } else {
      updatedRecord = await prisma.industriesPage.create({
        data: {
          id: "default",
          content: sanitizedToSave as any,
        },
      });
    }

    // Bi-directional Category Taxonomy Sync & Deletion Cascade Protection
    if (sanitizedToSave && Array.isArray(sanitizedToSave.industries)) {
      try {
        const previousIndustries = ((existing?.content as any)?.industries || []) as any[];
        const incomingSectorIds = new Set(sanitizedToSave.industries.map((i: any) => i.id).filter(Boolean));
        const deletedSectors = previousIndustries.filter((prev: any) => prev?.id && !incomingSectorIds.has(prev.id));

        // 1. If industry sectors were deleted, safely clean up categories and reassign linked case studies to "General"
        for (const deletedSec of deletedSectors) {
          const catId = deletedSec.id.startsWith("cat-") ? deletedSec.id : `cat-${deletedSec.id}`;
          const matchingCat = await prisma.caseStudyCategory.findFirst({
            where: {
              OR: [
                { id: catId },
                { id: deletedSec.id },
                { name: { equals: deletedSec.title, mode: "insensitive" } },
              ],
            },
          });

          // Reassign linked case studies to "General" to prevent broken data/orphaning
          await prisma.caseStudy.updateMany({
            where: {
              OR: [
                { categoryId: matchingCat?.id || catId },
                { category: { equals: deletedSec.title, mode: "insensitive" } },
              ],
            },
            data: {
              category: "General",
              categoryId: null,
            },
          });

          // Delete the category record
          if (matchingCat) {
            await prisma.caseStudyCategory.delete({ where: { id: matchingCat.id } }).catch(() => {});
          }
        }

        // 2. Ensure each remaining/new Industry Sector has a matching CaseStudyCategory
        const existingCats = await prisma.caseStudyCategory.findMany();
        for (let idx = 0; idx < sanitizedToSave.industries.length; idx++) {
          const ind = sanitizedToSave.industries[idx];
          if (!ind || !ind.id || !ind.title) continue;

          const catId = ind.id.startsWith("cat-") ? ind.id : `cat-${ind.id}`;
          const existing = existingCats.find(
            (c) => c.id === catId || c.id === ind.id || c.name.toLowerCase() === ind.title.toLowerCase()
          );

          if (!existing) {
            await prisma.caseStudyCategory.create({
              data: {
                id: catId,
                name: ind.title,
                description: ind.desc || ind.subtitle || `Case studies and solutions for ${ind.title}`,
                order: idx + 1,
              },
            }).catch(() => {});
          }
        }

        // 3. Auto-Sync Manual Industry Projects into Case Studies Items Manager as Incomplete Drafts
        for (const ind of sanitizedToSave.industries) {
          if (!ind || !Array.isArray(ind.projects)) continue;

          const catRecord = await prisma.caseStudyCategory.findFirst({
            where: {
              OR: [
                { name: { equals: ind.title, mode: "insensitive" } },
                { id: ind.id },
                { id: `cat-${ind.id}` },
              ],
            },
          });

          const DUMMY_PROJECT_IDS = new Set([
            "airblock",
            "fleettrack",
            "edulearn",
            "skillforge",
            "caresync",
            "omnicart",
            "synthworks",
            "siachi",
          ]);

          for (const proj of ind.projects) {
            if (!proj || !proj.title || !proj.title.trim()) continue;
            const rawId = (proj.id || "").toLowerCase().replace(/^(cs-|proj-)/, "");
            if (DUMMY_PROJECT_IDS.has(rawId)) continue;

            const existingStudy = await prisma.caseStudy.findFirst({
              where: {
                OR: [
                  { id: proj.id },
                  { id: `cs-${proj.id}` },
                  { title: { equals: proj.title, mode: "insensitive" } },
                ],
              },
            });

            // If it doesn't exist yet, admin created it manually in Step 4: Add as draft case study
            if (!existingStudy) {
              const slug = (proj.title || "project")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-4);

              await prisma.caseStudy.create({
                data: {
                  id: proj.id.startsWith("cs-") ? proj.id : `cs-${proj.id}`,
                  slug,
                  title: proj.title,
                  client: proj.client || "",
                  category: catRecord?.name || ind.title,
                  categoryId: catRecord?.id || null,
                  description: proj.desc || proj.description || "",
                  impact: proj.impact || "",
                  liveUrl: proj.liveUrl || "",
                  buttonText: proj.buttonText || "",
                  buttonLink: proj.liveUrl || "",
                  techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
                  imageGradient: proj.imageGradient || "from-violet-600 to-indigo-800",
                  featured: false, // Cannot be featured while in incomplete draft status
                  order: 999,
                  metrics: {
                    isDraft: true,
                    status: "draft",
                    source: "industry_manual",
                    createdFromIndustry: ind.id,
                    createdAt: new Date().toISOString(),
                  },
                },
              }).catch((e) => console.warn("Failed creating draft case study:", e));
            }
          }
        }
      } catch (catSyncErr) {
        console.warn("Non-blocking category/project sync warning in /api/industries:", catSyncErr);
      }
    }

    revalidateTag("industries-page");
    revalidatePath("/industries");
    revalidatePath("/portfolio");
    revalidatePath("/case-studies");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    triggerReindexBackground();

    return NextResponse.json({
      success: true,
      message: "Industries content saved successfully to database",
      data: sanitizeIndustriesData(updatedRecord.content),
    });
  } catch (error: any) {
    console.error("PUT /api/industries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save industries content" },
      { status: 500 }
    );
  }
}

// POST /api/industries — Alias for PUT to handle both POST and PUT methods and avoid 405 Method Not Allowed errors
export async function POST(req: Request) {
  return PUT(req);
}
