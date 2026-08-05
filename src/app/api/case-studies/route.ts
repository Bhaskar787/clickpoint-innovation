import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    return NextResponse.json({
      success: true,
      data: {
        pageContent: pageRecord.content,
        categories,
        caseStudies,
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

      // Delete removed categories
      for (const cat of existingCats) {
        if (!incomingCatIds.has(cat.id)) {
          await prisma.caseStudyCategory.delete({ where: { id: cat.id } }).catch(() => {});
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

        await prisma.caseStudy.upsert({
          where: { id },
          update: {
            slug,
            title: cs.title,
            client: cs.client || "",
            category: cs.category || "General",
            categoryId: cs.categoryId || null,
            description: cs.description || "",
            impact: cs.impact || "",
            imageUrl: cs.imageUrl || null,
            liveUrl: cs.liveUrl || "",
            buttonText: cs.buttonText || "Explore Live Platform",
            buttonLink: cs.buttonLink || cs.liveUrl || "",
            techStack: Array.isArray(cs.techStack) ? cs.techStack : [],
            imageGradient: cs.imageGradient || "from-violet-600 to-indigo-800",
            featured: cs.featured !== false,
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
            impact: cs.impact || "",
            imageUrl: cs.imageUrl || null,
            liveUrl: cs.liveUrl || "",
            buttonText: cs.buttonText || "Explore Live Platform",
            buttonLink: cs.buttonLink || cs.liveUrl || "",
            techStack: Array.isArray(cs.techStack) ? cs.techStack : [],
            imageGradient: cs.imageGradient || "from-violet-600 to-indigo-800",
            featured: cs.featured !== false,
            order: idx + 1,
          },
        });
      }
    }

    // Refetch latest data to return
    const updatedPage = await prisma.caseStudiesPage.findUnique({ where: { id: "default" } });
    const updatedCats = await prisma.caseStudyCategory.findMany({ orderBy: { order: "asc" } });
    const updatedStudies = await prisma.caseStudy.findMany({ orderBy: { order: "asc" } });

    return NextResponse.json({
      success: true,
      message: "Case studies content saved successfully to database!",
      data: {
        pageContent: updatedPage?.content,
        categories: updatedCats,
        caseStudies: updatedStudies,
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
