import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { syncProjectCategoryUniqueness } from "@/lib/catalog-sync";
import { DEFAULT_TESTIMONIALS_PAGE_DATA } from "@/data/default-testimonials-data";
import {
  DEFAULT_CASE_STUDIES_PAGE_DATA,
  DEFAULT_CASE_STUDY_CATEGORIES,
  DEFAULT_CASE_STUDIES_ITEMS,
} from "@/data/default-case-studies-data";

export async function GET() {
  try {
    let pageRecord = await prisma.caseStudiesPage.findUnique({
      where: { id: "default" },
    });

    if (!pageRecord) {
      pageRecord = await prisma.caseStudiesPage.create({
        data: {
          id: "default",
          content: DEFAULT_CASE_STUDIES_PAGE_DATA as any,
        },
      });
    }

    let categories = await prisma.caseStudyCategory.findMany({
      orderBy: { order: "asc" },
    });

    if (categories.length === 0) {
      for (const cat of DEFAULT_CASE_STUDY_CATEGORIES) {
        await prisma.caseStudyCategory.create({
          data: {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            order: cat.order,
          },
        });
      }
      categories = await prisma.caseStudyCategory.findMany({
        orderBy: { order: "asc" },
      });
    }

    let caseStudies = await prisma.caseStudy.findMany({
      orderBy: { order: "asc" },
    });

    if (caseStudies.length === 0) {
      for (const cs of DEFAULT_CASE_STUDIES_ITEMS) {
        await prisma.caseStudy.create({
          data: {
            id: cs.id,
            slug: cs.slug,
            title: cs.title,
            client: cs.client,
            category: cs.category,
            description: cs.description,
            impact: cs.impact,
            liveUrl: cs.liveUrl,
            buttonText: cs.buttonText,
            buttonLink: cs.buttonLink,
            techStack: cs.techStack as any,
            imageGradient: cs.imageGradient,
            featured: cs.featured,
            order: cs.order,
          },
        });
      }
      caseStudies = await prisma.caseStudy.findMany({
        orderBy: { order: "asc" },
      });
    }

    let testimonials: any[] = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });

    if (testimonials.length === 0) {
      testimonials = (DEFAULT_TESTIMONIALS_PAGE_DATA.testimonials || []) as any[];
    }

    const mappedCaseStudies = caseStudies.map((cs) => {
      const m = cs.metrics && typeof cs.metrics === "object" && !Array.isArray(cs.metrics) ? (cs.metrics as any) : {};
      const isDraft = Boolean(m.isDraft || m.status === "draft");
      return {
        ...cs,
        isDraft,
        status: isDraft ? "draft" : "published",
        featured: Boolean(cs.featured),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        pageContent: pageRecord.content,
        categories,
        caseStudies: mappedCaseStudies,
        testimonials,
      },
    });
  } catch (error: any) {
    console.error("GET /api/case-studies error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch case studies data",
        fallback: {
          pageContent: DEFAULT_CASE_STUDIES_PAGE_DATA,
          categories: DEFAULT_CASE_STUDY_CATEGORIES,
          caseStudies: DEFAULT_CASE_STUDIES_ITEMS,
          testimonials: [],
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { pageContent, categories, caseStudies } = body;

    // 1. Update Page Content
    if (pageContent) {
      await prisma.caseStudiesPage.upsert({
        where: { id: "default" },
        update: { content: pageContent },
        create: { id: "default", content: pageContent },
      });
    }

    // 2. Sync Categories
    if (Array.isArray(categories)) {
      const existingCats = await prisma.caseStudyCategory.findMany();
      const existingCatIds = new Set(existingCats.map((c) => c.id));
      const incomingCatIds = new Set(categories.map((c: any) => c.id).filter(Boolean));

      // Handle deleted categories: reassign linked case studies to "General" and sync deletion to Industries page
      for (const cat of existingCats) {
        if (!incomingCatIds.has(cat.id)) {
          // Reassign linked case studies to "General" so work is not lost
          await prisma.caseStudy.updateMany({
            where: {
              OR: [
                { categoryId: cat.id },
                { category: cat.name },
              ],
            },
            data: {
              category: "General",
              categoryId: null,
            },
          });

          // Delete category from Case Studies catalog
          await prisma.caseStudyCategory.delete({ where: { id: cat.id } }).catch(() => {});

          // Cross-Catalog Sync: Remove matching Industry Sector from Industries Page
          try {
            const indPage = await prisma.industriesPage.findFirst();
            if (indPage && indPage.content && Array.isArray((indPage.content as any).industries)) {
              const cleanSlug = cat.id.replace(/^cat-/, "").toLowerCase();
              const filteredIndustries = (indPage.content as any).industries.filter((ind: any) => {
                const matchId = ind.id === cat.id || ind.id === cleanSlug;
                const matchTitle = ind.title?.toLowerCase() === cat.name?.toLowerCase();
                return !(matchId || matchTitle);
              });

              if (filteredIndustries.length !== (indPage.content as any).industries.length) {
                await prisma.industriesPage.update({
                  where: { id: indPage.id },
                  data: {
                    content: {
                      ...(indPage.content as any),
                      industries: filteredIndustries,
                    },
                  },
                });
              }
            }
          } catch (indDelErr) {
            console.warn("Non-blocking cross-catalog industry sector removal warning:", indDelErr);
          }
        }
      }

      // Upsert incoming categories
      for (let idx = 0; idx < categories.length; idx++) {
        const cat = categories[idx];
        const id = cat.id || `cat-${Date.now()}-${idx}`;
        await prisma.caseStudyCategory.upsert({
          where: { id },
          update: {
            name: cat.name,
            description: cat.description || "",
            order: idx + 1,
          },
          create: {
            id,
            name: cat.name,
            description: cat.description || "",
            order: idx + 1,
          },
        });
      }

      // Ensure industry page sectors reflect the updated categories
      try {
        const indPage = await prisma.industriesPage.findFirst();
        if (indPage && indPage.content && Array.isArray((indPage.content as any).industries)) {
          const currentIndustries = [...(indPage.content as any).industries];
          let updated = false;

          for (const cat of categories) {
            const cleanSlug = (cat.id || "").replace(/^cat-/, "").toLowerCase();
            const exists = currentIndustries.some(
              (ind: any) => ind.id === cleanSlug || ind.id === cat.id || ind.title?.toLowerCase() === cat.name?.toLowerCase()
            );

            if (!exists && cat.name) {
              currentIndustries.push({
                id: cleanSlug,
                title: cat.name,
                subtitle: cat.description || "",
                desc: cat.description || "",
                fullOverview: "",
                heroBadge: "",
                href: `/industries/${cleanSlug}`,
                keyMetrics: [],
                complianceBadges: [],
                projects: [],
                solutions: [],
                overviewTag: "",
                overviewHeading: "",
                complianceTag: "",
                complianceHeading: "",
                projectsTag: "",
                projectsHeading: "",
                solutionsTag: "",
                solutionsHeading: "",
              });
              updated = true;
            }
          }

          if (updated) {
            await prisma.industriesPage.update({
              where: { id: indPage.id },
              data: {
                content: {
                  ...(indPage.content as any),
                  industries: currentIndustries,
                },
              },
            });
          }
        }
      } catch (indSyncErr) {
        console.warn("Non-blocking industry sync in /api/case-studies:", indSyncErr);
      }
    }

    // 3. Sync Case Studies
    if (Array.isArray(caseStudies)) {
      const existingStudies = await prisma.caseStudy.findMany();
      const existingStudyIds = new Set(existingStudies.map((s) => s.id));
      const incomingStudyIds = new Set(caseStudies.map((s: any) => s.id).filter(Boolean));

      // Delete removed case studies
      for (const cs of existingStudies) {
        if (!incomingStudyIds.has(cs.id)) {
          await prisma.caseStudy.delete({ where: { id: cs.id } }).catch(() => {});
        }
      }

      // Upsert incoming case studies
      for (let idx = 0; idx < caseStudies.length; idx++) {
        const cs = caseStudies[idx];
        const id = cs.id || `cs-${Date.now()}-${idx}`;
        const slug = cs.slug || cs.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `cs-${idx}`;

        const isDraft = Boolean(cs.isDraft || cs.status === "draft");
        const finalFeatured = Boolean(cs.featured);
        const currentMetrics = cs.metrics && typeof cs.metrics === "object" && !Array.isArray(cs.metrics) ? cs.metrics : {};
        const finalMetrics = {
          ...currentMetrics,
          isDraft,
          status: isDraft ? "draft" : "published",
        };

        await prisma.caseStudy.upsert({
          where: { id },
          update: {
            slug,
            title: cs.title,
            client: cs.client || "",
            category: cs.category || "General",
            categoryId: cs.categoryId || null,
            description: cs.description || "",
            challenge: cs.challenge || null,
            solution: cs.solution || null,
            results: cs.results || null,
            impact: cs.impact || "",
            imageUrl: cs.imageUrl || null,
            liveUrl: cs.liveUrl || "",
            buttonText: cs.buttonText || "Explore Live Platform",
            buttonLink: cs.buttonLink || cs.liveUrl || "",
            techStack: Array.isArray(cs.techStack) ? cs.techStack : [],
            imageGradient: cs.imageGradient || "from-violet-600 to-indigo-800",
            featured: finalFeatured,
            metrics: finalMetrics,
            order: idx + 1,
          },
          create: {
            id,
            slug,
            title: cs.title,
            client: cs.client || "",
            category: cs.category || "General",
            categoryId: cs.categoryId || null,
            description: cs.description || "",
            challenge: cs.challenge || null,
            solution: cs.solution || null,
            results: cs.results || null,
            impact: cs.impact || "",
            imageUrl: cs.imageUrl || null,
            liveUrl: cs.liveUrl || "",
            buttonText: cs.buttonText || "Explore Live Platform",
            buttonLink: cs.buttonLink || cs.liveUrl || "",
            techStack: Array.isArray(cs.techStack) ? cs.techStack : [],
            imageGradient: cs.imageGradient || "from-violet-600 to-indigo-800",
            featured: finalFeatured,
            metrics: finalMetrics,
            order: idx + 1,
          },
        });
      }
    }

    // Refetch latest data to return
    const updatedPage = await prisma.caseStudiesPage.findUnique({ where: { id: "default" } });
    const updatedCats = await prisma.caseStudyCategory.findMany({ orderBy: { order: "asc" } });
    const rawUpdatedStudies = await prisma.caseStudy.findMany({ orderBy: { order: "asc" } });

    // 4. Cross-Catalog Project Category Uniqueness Sync
    // Guarantees one project belongs strictly to ONE category/industry sector
    try {
      const indPage = await prisma.industriesPage.findFirst();
      if (indPage && indPage.content && Array.isArray((indPage.content as any).industries)) {
        const currentInds = (indPage.content as any).industries;
        const { industries: syncedInds, hasChanges } = syncProjectCategoryUniqueness(rawUpdatedStudies, currentInds);

        if (hasChanges) {
          await prisma.industriesPage.update({
            where: { id: indPage.id },
            data: {
              content: {
                ...(indPage.content as any),
                industries: syncedInds,
              },
            },
          });
          try {
            revalidatePath("/industries");
            revalidatePath("/portfolio");
          } catch {}
        }
      }
    } catch (indProjSyncErr) {
      console.warn("Non-blocking cross-catalog industry project sync error in PUT /api/case-studies:", indProjSyncErr);
    }

    const mappedUpdatedStudies = rawUpdatedStudies.map((cs) => {
      const m = cs.metrics && typeof cs.metrics === "object" && !Array.isArray(cs.metrics) ? (cs.metrics as any) : {};
      const isDraft = Boolean(m.isDraft || m.status === "draft");
      return {
        ...cs,
        isDraft,
        status: isDraft ? "draft" : "published",
        featured: Boolean(cs.featured),
      };
    });

    return NextResponse.json({
      success: true,
      message: "Case studies content saved successfully to database!",
      data: {
        pageContent: updatedPage?.content,
        categories: updatedCats,
        caseStudies: mappedUpdatedStudies,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/case-studies error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save case studies content" },
      { status: 500 }
    );
  }
}

// PATCH /api/case-studies — Instantly toggle featured status or update individual case study
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, featured, isDraft, status, study } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Case study ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.caseStudy.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Case study not found" },
        { status: 404 }
      );
    }

    const curMetrics =
      existing.metrics && typeof existing.metrics === "object" && !Array.isArray(existing.metrics)
        ? (existing.metrics as any)
        : {};

    const nextDraft = isDraft !== undefined ? Boolean(isDraft) : (featured ? false : Boolean(curMetrics.isDraft));
    const nextStatus = status || (nextDraft ? "draft" : "published");
    const nextFeatured = featured !== undefined ? Boolean(featured) : Boolean(existing.featured);

    const updatePayload: any = {
      featured: nextFeatured,
      metrics: {
        ...curMetrics,
        isDraft: nextDraft,
        status: nextStatus,
      },
    };

    if (study) {
      if (study.title !== undefined) updatePayload.title = study.title.trim();
      if (study.client !== undefined) updatePayload.client = study.client.trim();
      if (study.category !== undefined) updatePayload.category = study.category;
      if (study.categoryId !== undefined) updatePayload.categoryId = study.categoryId;
      if (study.slug !== undefined) updatePayload.slug = study.slug;
      if (study.description !== undefined) updatePayload.description = study.description;
      if (study.challenge !== undefined) updatePayload.challenge = study.challenge;
      if (study.solution !== undefined) updatePayload.solution = study.solution;
      if (study.results !== undefined) updatePayload.results = study.results;
      if (study.impact !== undefined) updatePayload.impact = study.impact;
      if (study.imageUrl !== undefined) updatePayload.imageUrl = study.imageUrl;
      if (study.liveUrl !== undefined) updatePayload.liveUrl = study.liveUrl;
      if (study.buttonText !== undefined) updatePayload.buttonText = study.buttonText;
      if (study.buttonLink !== undefined) updatePayload.buttonLink = study.buttonLink;
      if (study.techStack !== undefined) {
        updatePayload.techStack = Array.isArray(study.techStack) ? study.techStack : [];
      }
      if (study.imageGradient !== undefined) updatePayload.imageGradient = study.imageGradient;
    }

    const updated = await prisma.caseStudy.update({
      where: { id },
      data: updatePayload,
    });

    // Cross-Catalog Project Category Uniqueness Sync
    // Guarantees one project belongs strictly to ONE category/industry sector
    try {
      const allStudies = await prisma.caseStudy.findMany();
      const indPage = await prisma.industriesPage.findFirst();
      if (indPage && indPage.content && Array.isArray((indPage.content as any).industries)) {
        const currentInds = (indPage.content as any).industries;
        const { industries: syncedInds, hasChanges } = syncProjectCategoryUniqueness(allStudies, currentInds);

        if (hasChanges) {
          await prisma.industriesPage.update({
            where: { id: indPage.id },
            data: {
              content: {
                ...(indPage.content as any),
                industries: syncedInds,
              },
            },
          });
        }
      }
    } catch (indProjSyncErr) {
      console.warn("Non-blocking cross-catalog industry project sync error in PATCH /api/case-studies:", indProjSyncErr);
    }

    try {
      revalidatePath("/case-studies");
      revalidatePath("/industries");
      revalidatePath("/portfolio");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidate error in /api/case-studies PATCH:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Case study "${updated.title}" updated successfully!`,
      data: {
        ...updated,
        isDraft: nextDraft,
        status: nextStatus,
        featured: nextFeatured,
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/case-studies error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update case study" },
      { status: 500 }
    );
  }
}
