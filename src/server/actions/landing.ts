"use server";

import { prisma } from "@/lib/prisma";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";
import { unstable_cache } from "next/cache";

const getLandingPageDataCached = unstable_cache(
  async () => {
    let landingRecord = await prisma.landingPage.findFirst();
    if (!landingRecord || !landingRecord.content) {
      return DEFAULT_LANDING_DATA;
    }
    const content = (landingRecord.content || {}) as any;
    return {
      ...DEFAULT_LANDING_DATA,
      ...content,
      hero: { ...DEFAULT_LANDING_DATA.hero, ...(content.hero || {}) },
      statsHeader: { ...DEFAULT_LANDING_DATA.statsHeader, ...(content.statsHeader || {}) },
      stats: content.stats?.length ? content.stats : DEFAULT_LANDING_DATA.stats,
      servicesHeader: { ...DEFAULT_LANDING_DATA.servicesHeader, ...(content.servicesHeader || {}) },
      techStackHeader: { ...DEFAULT_LANDING_DATA.techStackHeader, ...(content.techStackHeader || {}) },
      techCategories: content.techCategories?.length ? content.techCategories : DEFAULT_LANDING_DATA.techCategories,
      techItems: content.techItems?.length ? content.techItems : DEFAULT_LANDING_DATA.techItems,
      industriesHeader: { ...DEFAULT_LANDING_DATA.industriesHeader, ...(content.industriesHeader || {}) },
      journeyHeader: { ...DEFAULT_LANDING_DATA.journeyHeader, ...(content.journeyHeader || {}) },
      timelineHeader: { ...DEFAULT_LANDING_DATA.timelineHeader, ...(content.timelineHeader || content.journeyHeader || {}) },
      blogHeader: { ...DEFAULT_LANDING_DATA.blogHeader, ...(content.blogHeader || {}) },
      testimonialsHeader: { ...DEFAULT_LANDING_DATA.testimonialsHeader, ...(content.testimonialsHeader || {}) },
      faqHeader: { ...DEFAULT_LANDING_DATA.faqHeader, ...(content.faqHeader || content.faqsHeader || {}) },
      faqsHeader: { ...DEFAULT_LANDING_DATA.faqsHeader, ...(content.faqsHeader || content.faqHeader || {}) },
      faqPageHeader: { ...DEFAULT_LANDING_DATA.faqPageHeader, ...(content.faqPageHeader || {}) },
      footer: { ...DEFAULT_LANDING_DATA.footer, ...(content.footer || content.footerData || {}) },
      footerData: { ...DEFAULT_LANDING_DATA.footerData, ...(content.footerData || content.footer || {}) },
      ctaBanner: { ...DEFAULT_LANDING_DATA.ctaBanner, ...(content.ctaBanner || {}) },
    };
  },
  ["landing-page-public-data"],
  { revalidate: 60, tags: ["landing-page"] }
);

export async function getLandingPageData() {
  try {
    return await getLandingPageDataCached();
  } catch (error) {
    console.error("Failed to fetch landing page content:", error);
    return DEFAULT_LANDING_DATA;
  }
}
