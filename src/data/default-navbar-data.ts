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
  { id: "journey", title: "Events & Journey", desc: "Milestones, events & culture gallery", href: "/events", order: 2 },
  { id: "careers", title: "Careers", desc: "Join our global engineering team", badge: "Hiring", href: "/careers", order: 3 },
  { id: "case-studies", title: "Case Studies", desc: "Client success metrics & launches", href: "/case-studies", order: 4 },
  { id: "testimonials", title: "Testimonials", desc: "Verified client reviews & impact", href: "/testimonials", order: 5 },
  { id: "blog", title: "Blog & Insights", desc: "Technical guides & AI insights", href: "/blog", order: 6 },
  { id: "faqs", title: "Help & FAQs", desc: "Knowledgebase & common questions", href: "/faqs", order: 7 },
  { id: "contact", title: "Contact Us", desc: "Get in touch with our engineering team", href: "/contact", order: 8 },
];

export interface NavbarMenuTitles {
  services: string;
  industries: string;
  company: string;
  journey: string;
  contact: string;
}

export interface NavbarCtaConfig {
  buttonText: string;
  buttonLink: string;
  openModalOnClick: boolean;
  openInNewTab?: boolean;
}

export interface NavbarConfig {
  logo: {
    brandName: string;
    logoUrl: string;
    tagline?: string;
  };
  menuTitles: NavbarMenuTitles;
  journeyLink?: string;
  contactLink?: string;
  companyLinks: CompanyNavItem[];
  cta: NavbarCtaConfig;
}

export const DEFAULT_NAVBAR_DATA: NavbarConfig = {
  logo: {
    brandName: "Click Point Innovations",
    logoUrl: "https://res.cloudinary.com/dapi1jlc/image/upload/v1785998195/clickpoint_innovation/c9olq47p41iy7wbkmgxf.png",
    tagline: "AI-First Digital Product Studio",
  },
  menuTitles: {
    services: "Services",
    industries: "Portfolio",
    company: "Company",
    journey: "Events",
    contact: "Contact",
  },
  journeyLink: "/events",
  contactLink: "/contact",
  companyLinks: DEFAULT_COMPANY_NAV_LINKS,
  cta: {
    buttonText: "Quick Enquiry",
    buttonLink: "/contact",
    openModalOnClick: true,
    openInNewTab: false,
  },
};

export const DEFAULT_SYSTEM_SETTINGS = {
  siteName: "Clickpoint Innovation",
  supportEmail: "info@clickpointinnovation.com",
  timezone: "Asia/Kathmandu (UTC+5:45)",
  currency: "USD ($)",
  maintenanceMode: false,
  enforce2FA: true,
  sessionTimeoutMinutes: 60,
  faviconUrl: "/images/fav3.png",
  collapsedLogoUrl: "/images/fav3.png",
  emailLogoUrl: "https://res.cloudinary.com/dapi1jlc/image/upload/v1785998195/clickpoint_innovation/c9olq47p41iy7wbkmgxf.png",
};

