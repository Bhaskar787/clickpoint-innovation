import { INDUSTRIES_DATA } from "@/data/landing-data";

export const DEFAULT_INDUSTRIES_PAGE_DATA = {
  hero: {
    badge: "Industry Domain Solutions",
    title: "Tailored Engineering for High-Growth Enterprise Sectors",
    subtitle:
      "Deep domain expertise, SOC2 & HIPAA compliant security models, and specialized AI infrastructure built for mission-critical industries.",
  },
  industries: INDUSTRIES_DATA.map((ind) => {
    const { icon, ...rest } = ind;
    return {
      ...rest,
      overviewTag: "Sector Perspective",
      overviewHeading: `Architecting software for ${ind.title}`,
      complianceTag: "Compliance & Security Standards",
      complianceHeading: "Audited architecture protocols",
      complianceBadges: ind.complianceBadges || ["HIPAA Compliant", "PCI-DSS Level 1", "SOC2 Type II", "FDA Approved Software"],
      projectsTag: "Live Case Studies",
      projectsHeading: `Featured projects built for ${ind.title}`,
      solutionsTag: "Target Solutions",
      solutionsHeading: `Specialized engineering for ${ind.title}`,
    };
  }),
};
