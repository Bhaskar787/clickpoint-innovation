export interface CompanyNavItem {
  id: string;
  title: string;
  desc?: string;
  href: string;
  badge?: string;
  iconName?: string;
  order: number;
}

export const DEFAULT_COMPANY_NAV_LINKS: CompanyNavItem[] = [
  { id: "about", title: "About Us", desc: "Our story, vision & leadership team", href: "/about", order: 1 },
  { id: "journey", title: "Our Journey & Events", desc: "Milestones, events & culture gallery", href: "/journey", order: 2 },
  { id: "careers", title: "Careers", desc: "Join our global engineering team", badge: "Hiring", href: "/careers", order: 3 },
  { id: "case-studies", title: "Case Studies", desc: "Client success metrics & launches", href: "/case-studies", order: 4 },
  { id: "testimonials", title: "Testimonials", desc: "Verified client reviews & impact", href: "/testimonials", order: 5 },
  { id: "blog", title: "Blog & Insights", desc: "Technical guides & AI insights", href: "/blog", order: 6 },
  { id: "faqs", title: "Help & FAQs", desc: "Knowledgebase & common questions", href: "/faqs", order: 7 },
  { id: "contact", title: "Contact Us", desc: "Get in touch with our engineering team", href: "/contact", order: 8 },
];

export const DEFAULT_NAVBAR_DATA = {
  logo: {
    brandName: "Click Point Innovations",
    logoUrl: "/images/clickpointfinal.png",
    tagline: "AI-First Digital Product Studio",
  },
  menuTitles: {
    services: "Services",
    industries: "Industries",
    company: "Company",
    journey: "Our Journey",
    contact: "Contact",
  },
  companyLinks: DEFAULT_COMPANY_NAV_LINKS,
  cta: {
    buttonText: "Quick Enquiry",
    buttonLink: "/contact",
    openModalOnClick: true,
  },
};
