/**
 * Catalog Synchronization & Taxonomy Bridge
 * Clickpoint Innovation Enterprise Platform
 *
 * Provides shared normalization, category matching, and data conversion
 * between Case Study Categories/Items and Industry Sector Cards/Detail Pages.
 */

export interface IndustryProjectItem {
  id: string;
  title: string;
  client: string;
  desc: string;
  impact: string;
  liveUrl: string;
  techStack: string[];
  imageGradient?: string;
  caseStudyId?: string; // Optional cross-reference tracking
  featured?: boolean;
  isDraft?: boolean;
  status?: string;
}

/**
 * Normalizes any category or sector identifier/title into a canonical slug key.
 * Handles prefix stripping (e.g. "cat-fintech" -> "fintech"), punctuation, and stop words.
 */
export function normalizeCategoryKey(key: string | undefined | null): string {
  if (!key) return "";
  let clean = key.trim().toLowerCase();
  
  // Remove "cat-" prefix if present
  if (clean.startsWith("cat-")) {
    clean = clean.replace(/^cat-/, "");
  }

  // Remove common generic suffix / prefix terms
  clean = clean
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // Map known catalog alias variations to canonical slugs
  const aliasMap: Record<string, string> = {
    "fintech-and-financial-systems": "fintech",
    "fintech-and-banking": "fintech",
    "banking": "fintech",
    "financial-systems": "fintech",

    "healthcare-and-medtech": "healthcare",
    "medtech": "healthcare",
    "digital-health": "healthcare",

    "e-commerce-and-retail-ai": "ecommerce",
    "e-commerce-and-retail": "ecommerce",
    "ecommerce-and-retail": "ecommerce",
    "retail": "ecommerce",

    "saas-and-enterprise-platforms": "saas",
    "saas-and-enterprise": "saas",
    "enterprise": "saas",
    "enterprise-platforms": "saas",

    "logistics-and-supply-chain": "logistics",
    "supply-chain": "logistics",

    "edtech-and-learning-ai": "edtech",
    "edtech-and-learning": "edtech",
    "learning-ai": "edtech",
  };

  return aliasMap[clean] || clean;
}

/**
 * Determines whether a Case Study category matches an Industry sector.
 * Performs multi-layer checks:
 * 1. Normalized slug equality
 * 2. ID / categoryId equality
 * 3. Substring containment between titles
 */
export function matchCategoryToIndustry(
  category: { id?: string; name?: string; slug?: string } | string | null | undefined,
  industry: { id?: string; title?: string; href?: string } | string | null | undefined
): boolean {
  if (!category || !industry) return false;

  const catId = typeof category === "string" ? category : category.id || "";
  const catName = typeof category === "string" ? category : category.name || category.slug || "";

  const indId = typeof industry === "string" ? industry : industry.id || "";
  const indTitle = typeof industry === "string" ? industry : industry.title || "";

  // 1. Direct slug or ID comparison
  const catNormId = normalizeCategoryKey(catId);
  const indNormId = normalizeCategoryKey(indId);

  if (catNormId && indNormId && catNormId === indNormId) {
    return true;
  }

  // 2. Name vs Title normalization
  const catNormName = normalizeCategoryKey(catName);
  const indNormTitle = normalizeCategoryKey(indTitle);

  if (catNormName && indNormTitle) {
    if (catNormName === indNormTitle) return true;
    if (catNormName === indNormId) return true;
    if (catNormId === indNormTitle) return true;
  }

  // 3. Fallback: Contains match on alphanumeric characters
  const catAlpha = (catName || catId).toLowerCase().replace(/[^a-z0-9]/g, "");
  const indAlpha = (indTitle || indId).toLowerCase().replace(/[^a-z0-9]/g, "");

  if (catAlpha.length >= 3 && indAlpha.length >= 3) {
    if (indAlpha.includes(catAlpha) || catAlpha.includes(indAlpha)) {
      return true;
    }
  }

  return false;
}

/**
 * Finds all Case Studies that belong to a given Industry Sector.
 */
export function getCaseStudiesForIndustry(
  caseStudies: any[],
  industry: { id?: string; title?: string } | null | undefined
): any[] {
  if (!Array.isArray(caseStudies) || !industry) return [];

  return caseStudies.filter((cs) => {
    // Check cs.categoryId
    if (cs.categoryId && matchCategoryToIndustry(cs.categoryId, industry)) {
      return true;
    }
    // Check cs.category (category name)
    if (cs.category && matchCategoryToIndustry(cs.category, industry)) {
      return true;
    }
    return false;
  });
}

/**
 * Converts a CaseStudy DB/API record into an Industry Featured Project shape.
 */
export function caseStudyToIndustryProject(caseStudy: any): IndustryProjectItem {
  if (!caseStudy) {
    return {
      id: "proj-" + Date.now().toString().slice(-4),
      title: "",
      client: "",
      desc: "",
      impact: "",
      liveUrl: "",
      techStack: [],
      imageGradient: "from-violet-600 to-indigo-800",
      featured: false,
      isDraft: false,
      status: "published",
    };
  }

  const isDraft = Boolean(
    caseStudy.isDraft ||
    (caseStudy.metrics as any)?.isDraft ||
    (caseStudy.metrics as any)?.status === "draft" ||
    caseStudy.status === "draft"
  );
  const isFeatured = Boolean(caseStudy.featured);

  return {
    id: caseStudy.id ? "proj-" + caseStudy.id : "proj-" + Date.now().toString().slice(-4),
    title: caseStudy.title || "",
    client: caseStudy.client || "",
    desc: caseStudy.description || caseStudy.desc || "",
    impact: caseStudy.impact || "",
    liveUrl: caseStudy.liveUrl || caseStudy.buttonLink || "",
    techStack: Array.isArray(caseStudy.techStack) ? [...caseStudy.techStack] : [],
    imageGradient: caseStudy.imageGradient || "from-violet-600 to-indigo-800",
    caseStudyId: caseStudy.id || caseStudy.slug,
    featured: isFeatured,
    isDraft: isDraft,
    status: isDraft ? "draft" : "published",
  };
}

/**
 * Converts an Industry Featured Project (added manually in Industry Step 4)
 * into a draft Case Study record to appear in the Case Studies Items Manager.
 */
export function industryProjectToCaseStudyDraft(
  project: any,
  industry: { id?: string; title?: string } | null | undefined
) {
  const catTitle = industry?.title || "General";
  const slug = (project.title || "project")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-4);

  const csId = project.id?.startsWith("cs-") ? project.id : `cs-${project.id || Date.now()}`;
  const isDraft = project.isDraft !== undefined ? Boolean(project.isDraft || project.status === "draft") : true;
  const isFeatured = Boolean(project.featured);

  return {
    id: csId,
    slug,
    title: project.title || "",
    client: project.client || "",
    category: catTitle,
    categoryId: industry?.id ? (industry.id.startsWith("cat-") ? industry.id : `cat-${industry.id}`) : null,
    description: project.desc || project.description || "",
    challenge: null,
    solution: null,
    results: null,
    impact: project.impact || "",
    liveUrl: project.liveUrl || "",
    buttonText: project.buttonText || "",
    buttonLink: project.liveUrl || "",
    techStack: Array.isArray(project.techStack) ? project.techStack : [],
    imageGradient: project.imageGradient || "from-violet-600 to-indigo-800",
    featured: isFeatured,
    isDraft: isDraft,
    status: isDraft ? "draft" : "published",
    metrics: {
      isDraft,
      status: isDraft ? "draft" : "published",
      source: "industry_manual",
      createdFromIndustry: industry?.id || "",
      createdAt: new Date().toISOString(),
    },
    order: 999,
  };
}

/**
 * Determines whether an industry sector project matches a case study record.
 */
export function isProjectMatchingCaseStudy(project: any, caseStudy: any): boolean {
  if (!project || !caseStudy) return false;

  // 1. Direct caseStudyId match
  if (project.caseStudyId && (project.caseStudyId === caseStudy.id || project.caseStudyId === caseStudy.slug)) {
    return true;
  }

  // 2. ID match (with or without 'proj-' / 'cs-' prefixes)
  const pId = String(project.id || "").toLowerCase().replace(/^(proj-|cs-)/, "");
  const csId = String(caseStudy.id || "").toLowerCase().replace(/^(proj-|cs-)/, "");
  const csSlug = String(caseStudy.slug || "").toLowerCase().replace(/^(proj-|cs-)/, "");
  if (pId && (pId === csId || pId === csSlug)) {
    return true;
  }

  // 3. Exact or trimmed title match (case-insensitive)
  if (project.title && caseStudy.title) {
    const pTitle = project.title.trim().toLowerCase();
    const csTitle = caseStudy.title.trim().toLowerCase();
    if (pTitle === csTitle) {
      return true;
    }
  }

  return false;
}

/**
 * Enforces strict 1-to-1 uniqueness: One project belongs to ONLY ONE category / industry sector.
 *
 * When a case study changes its category (e.g. FleetX moved from Logistics to EdTech):
 * 1. Finds the matching industry sector for the case study's new category.
 * 2. Removes the project from ANY other industry sector where it doesn't belong (e.g. removes FleetX from Logistics).
 * 3. Ensures the project is present and updated in the matching industry sector (e.g. in EdTech).
 * 4. Deduplicates any projects across all industry sectors.
 */
export function syncProjectCategoryUniqueness(
  caseStudies: any[],
  industries: any[]
): { industries: any[]; hasChanges: boolean } {
  if (!Array.isArray(industries)) {
    return { industries: [], hasChanges: false };
  }

  let hasChanges = false;
  const updatedIndustries = industries.map((ind) => ({
    ...ind,
    projects: Array.isArray(ind.projects) ? [...ind.projects] : [],
  }));

  // Step 1: For each CaseStudy, find its target sector and purge it from all other sectors
  for (const cs of caseStudies || []) {
    // Target industry sector matching this case study
    const targetSector = updatedIndustries.find((ind) =>
      matchCategoryToIndustry(cs.categoryId || cs.category, ind)
    );

    for (const ind of updatedIndustries) {
      const isTarget = Boolean(targetSector && ind.id === targetSector.id);

      if (!isTarget) {
        // REMOVE cs from non-target sector!
        const initialLen = ind.projects.length;
        ind.projects = ind.projects.filter(
          (proj: any) => !isProjectMatchingCaseStudy(proj, cs)
        );
        if (ind.projects.length !== initialLen) {
          hasChanges = true;
        }
      } else {
        // In the target sector: ensure the project is present and synced
        const existingIdx = ind.projects.findIndex((proj: any) =>
          isProjectMatchingCaseStudy(proj, cs)
        );
        const converted = caseStudyToIndustryProject(cs);

        if (existingIdx !== -1) {
          // Update project details if any fields changed
          const existing = ind.projects[existingIdx];
          const csIsDraft = converted.isDraft;
          const csFeatured = converted.featured;

          if (
            existing.title !== converted.title ||
            existing.client !== converted.client ||
            existing.impact !== converted.impact ||
            existing.desc !== converted.desc ||
            existing.caseStudyId !== cs.id ||
            existing.featured !== csFeatured ||
            existing.isDraft !== csIsDraft ||
            existing.status !== converted.status
          ) {
            ind.projects[existingIdx] = {
              ...existing,
              title: converted.title,
              client: converted.client,
              desc: converted.desc,
              impact: converted.impact,
              liveUrl: converted.liveUrl,
              techStack: converted.techStack,
              imageGradient: converted.imageGradient,
              caseStudyId: cs.id,
              featured: csFeatured,
              isDraft: csIsDraft,
              status: converted.status,
            };
            hasChanges = true;
          }
        } else {
          // If target sector currently doesn't have it, add it!
          ind.projects.push(converted);
          hasChanges = true;
        }
      }
    }
  }

  // Step 2: Global deduplication across all sectors (guarantee 1 project = 1 category)
  const seenProjectKeys = new Set<string>();

  for (const ind of updatedIndustries) {
    const initialLen = ind.projects.length;
    const filteredProjects: any[] = [];

    for (const proj of ind.projects) {
      const canonicalKey = (
        proj.caseStudyId ||
        proj.title ||
        proj.id ||
        ""
      ).toLowerCase().trim().replace(/^(proj-|cs-)/, "");

      if (!canonicalKey || !seenProjectKeys.has(canonicalKey)) {
        if (canonicalKey) seenProjectKeys.add(canonicalKey);
        filteredProjects.push(proj);
      } else {
        hasChanges = true; // Dropped duplicate from another sector!
      }
    }

    ind.projects = filteredProjects;
    if (ind.projects.length !== initialLen) {
      hasChanges = true;
    }
  }

  return { industries: updatedIndustries, hasChanges };
}
