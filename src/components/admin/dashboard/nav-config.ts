import {
  Home,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Users,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  ShieldCheck,
  Globe,
  Cpu,
  Milestone,
  Building2,
  Quote,
  Send,
  PanelBottom,
  Info,
  BookOpen,
  Mail,
  UserCheck,
  Award,
  AlertTriangle,
  HelpCircle,
  FolderGit2,
  Grid,
  Edit3,
  Star,
  FileText,
  Settings,
} from "lucide-react";
import React from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export interface SectionBox {
  id: string;
  order: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fieldsCount: number;
  status: string;
  category: string;
}

export interface PageConfig {
  id: string;
  title: string;
  subtitle: string;
  sections: SectionBox[];
}

export const RECENT_INQUIRIES = [
  {
    id: "INQ-9041",
    client: "Acme Fintech Corp",
    email: "cto@acmefintech.com",
    service: "AI Copilot & LLM RAG",
    budget: "$45,000",
    rating: "5.0 ★★★★★",
    status: "Active",
    statusColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    id: "INQ-9042",
    client: "MedPulse Health",
    email: "dev@medpulse.io",
    service: "Next.js 15 Web Platform",
    budget: "$28,000",
    rating: "4.9 ★★★★★",
    status: "Pending",
    statusColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    id: "INQ-9043",
    client: "Global Logistics Ltd",
    email: "operations@globallog.com",
    service: "Cloud Microservices",
    budget: "$60,000",
    rating: "5.0 ★★★★★",
    status: "In Progress",
    statusColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    id: "INQ-9044",
    client: "E-Com ScaleX",
    email: "founder@ecomscalex.com",
    service: "Mobile iOS & Android App",
    budget: "$32,000",
    rating: "4.8 ★★★★☆",
    status: "Active",
    statusColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
];

export function StarIcon(props: { className?: string }) {
  return React.createElement(Award, props);
}

export const ALL_PAGE_CONFIGS: Record<string, PageConfig> = {
  "landing-management": {
    id: "landing-management",
    title: "Landing Page Content",
    subtitle: "Configure and manage all 12 sections on the main landing page in real time",
    sections: [
      { id: "navbar", order: "#01", name: "Navbar & Navigation Header", description: "Manage top bar brand logo, navigation links, quick enquiry CTA button, and announcement banner.", icon: Globe, fieldsCount: 8, status: "Active", category: "Header" },
      { id: "hero", order: "#02", name: "Hero Section", description: "Configure main hero title, animated subheadings, CTA buttons, background blueprint grid, and visual badges.", icon: Sparkles, fieldsCount: 12, status: "Active", category: "Main Banner" },
      { id: "services", order: "#03", name: "Services Catalog Section", description: "Edit service cards (AI Engineering, Web Apps, Mobile Apps, Growth), features, icons, and service details.", icon: Layers, fieldsCount: 16, status: "Active", category: "Services" },
      { id: "tech-stack", order: "#04", name: "Tech Stack & Tools Section", description: "Customize technology categories (Frontend, Backend, AI/ML, Cloud), framework icons, and tool badges.", icon: Cpu, fieldsCount: 14, status: "Active", category: "Technologies" },
      { id: "growth", order: "#05", name: "Growth & Impact Metrics Section", description: "Manage key counter statistics (Project Count, Satisfaction %, Speed Multiplier) and achievement statements.", icon: TrendingUp, fieldsCount: 9, status: "Active", category: "Metrics" },
      { id: "timeline", order: "#06", name: "Timeline & Journey Section", description: "Configure company milestone eras, milestone titles, detailed stories, and historical photos.", icon: Milestone, fieldsCount: 15, status: "Active", category: "Company Story" },
      { id: "industries", order: "#07", name: "Industries Served Section", description: "Edit target industries (Fintech, Healthcare, E-Commerce, Logistics, EdTech) and domain-specific capabilities.", icon: Building2, fieldsCount: 10, status: "Active", category: "Sectors" },
      { id: "case-studies", order: "#08", name: "Case Studies & Portfolio Section", description: "Manage client case studies, result metrics (+250% Growth), tech stack tags, and case study links.", icon: FolderGit2, fieldsCount: 18, status: "Active", category: "Portfolio" },
      { id: "testimonials", order: "#09", name: "Testimonials & Reviews Section", description: "Customize client reviews, star ratings, reviewer titles, company names, and avatar profile images.", icon: Quote, fieldsCount: 12, status: "Active", category: "Social Proof" },
      { id: "faq", order: "#10", name: "FAQ Section", description: "Configure question & answer categories (Engineering, Security, Pod Speed) and expandable accordions.", icon: HelpCircle, fieldsCount: 14, status: "Active", category: "Help & FAQ" },
      { id: "cta", order: "#11", name: "Call To Action (CTA) Section", description: "Manage final CTA headline, consultation booking trigger, contact buttons, and background glow effects.", icon: Send, fieldsCount: 7, status: "Active", category: "Conversion" },
      { id: "footer", order: "#12", name: "Footer Content & Links Section", description: "Configure footer logo, company bio, quick links columns, social media URLs, and copyright text.", icon: PanelBottom, fieldsCount: 11, status: "Active", category: "Footer" },
    ],
  },

  "about-page": {
    id: "about-page",
    title: "About Us Page (/about)",
    subtitle: "Manage company mission, values, leadership team, and corporate statistics",
    sections: [
      { id: "about-hero", order: "#01", name: "About Hero Banner", description: "Configure heading, vision subtext, background blueprint styling, and hero CTA buttons.", icon: Info, fieldsCount: 6, status: "Active", category: "Banner" },
      { id: "about-mission", order: "#02", name: "Our Mission & Core Values", description: "Manage core philosophy, engineering standards, speed metrics, and trust commitments.", icon: ShieldCheck, fieldsCount: 10, status: "Active", category: "Philosophy" },
      { id: "about-team", order: "#03", name: "Leadership & Engineering Team", description: "Customize team member profiles, bios, designations, photos, and LinkedIn social links.", icon: Users, fieldsCount: 16, status: "Active", category: "Team" },
      { id: "about-stats", order: "#04", name: "Company Stats & Milestones", description: "Edit client count, years in business, total deployments, and active developer count.", icon: Award, fieldsCount: 8, status: "Active", category: "Stats" },
    ],
  },

  "services-page": {
    id: "services-page",
    title: "Services Pages (/services & /services/[id])",
    subtitle: "Configure services catalog index page and individual service detail pages (/services/[id])",
    sections: [
      { id: "services-hero", order: "#01", name: "Services Page Hero Banner", description: "Header title, overview text, and service category filters.", icon: Layers, fieldsCount: 7, status: "Active", category: "Banner" },
      { id: "services-list", order: "#02", name: "Core Services Cards Catalog", description: "Edit service titles, detailed descriptions, technology pills, and feature bullet points.", icon: Cpu, fieldsCount: 20, status: "Active", category: "Catalog" },
      { id: "services-details", order: "#03", name: "Individual Service Detail Pages", description: "Configure template settings for AI Eng, Web Dev, Mobile Apps, UI/UX, and Cloud Ops.", icon: Edit3, fieldsCount: 15, status: "Active", category: "Detail Pages" },
    ],
  },

  "industries-page": {
    id: "industries-page",
    title: "Industries Pages (/industries & /industries/[id])",
    subtitle: "Manage industry sectors page (/industries) and industry detail templates (/industries/[id])",
    sections: [
      { id: "ind-hero", order: "#01", name: "Industries Hero Banner", description: "Configure main page heading, industry sector overview, and quick jump navigation.", icon: Building2, fieldsCount: 6, status: "Active", category: "Banner" },
      { id: "ind-grid", order: "#02", name: "Industry Sector Cards Grid", description: "Manage Fintech, Healthcare, E-Commerce, Logistics, and EdTech domain solutions.", icon: Grid, fieldsCount: 15, status: "Active", category: "Sectors" },
      { id: "ind-details", order: "#03", name: "Industry Detail Page Templates", description: "Configure specialized compliance badges (HIPAA, PCI-DSS), security models, and case links.", icon: ShieldCheck, fieldsCount: 12, status: "Active", category: "Detail Pages" },
    ],
  },

  "case-studies-page": {
    id: "case-studies-page",
    title: "Case Studies Page (/case-studies)",
    subtitle: "Manage client portfolio projects, success stories, and metric result showcases",
    sections: [
      { id: "case-hero", order: "#01", name: "Case Studies Hero Banner", description: "Header title, client success narrative, and portfolio category filters.", icon: FolderGit2, fieldsCount: 6, status: "Active", category: "Banner" },
      { id: "case-grid", order: "#02", name: "Featured Case Study Projects", description: "Manage project titles, client names, growth metric tags (+300% ROI), and live links.", icon: TrendingUp, fieldsCount: 18, status: "Active", category: "Portfolio" },
      { id: "case-cta", order: "#03", name: "Portfolio Project Inquiry Trigger", description: "Configure 'Build Similar Architecture' CTA card and inquiry form.", icon: Send, fieldsCount: 5, status: "Active", category: "Conversion" },
    ],
  },

  "journey-page": {
    id: "journey-page",
    title: "Company Journey Page (/journey)",
    subtitle: "Manage company milestone timeline eras, historical achievements, and story nodes",
    sections: [
      { id: "journey-hero", order: "#01", name: "Journey Page Hero Banner", description: "Configure timeline heading, story introduction, and interactive era selector.", icon: Milestone, fieldsCount: 7, status: "Active", category: "Banner" },
      { id: "journey-eras", order: "#02", name: "Historical Era Story Nodes", description: "Edit timeline years, milestone titles, detailed narratives, and photo galleries.", icon: Calendar, fieldsCount: 16, status: "Active", category: "Timeline" },
      { id: "journey-modal", order: "#03", name: "Quick Enquiry Modal Trigger", description: "Customize timeline consultation modal fields and booking options.", icon: MessageSquare, fieldsCount: 6, status: "Active", category: "Modal" },
    ],
  },

  "blog-page": {
    id: "blog-page",
    title: "Blog & Insights Pages (/blog & /blog/[slug])",
    subtitle: "Manage blog list index page (/blog) and individual blog post articles (/blog/[slug])",
    sections: [
      { id: "blog-hero", order: "#01", name: "Blog Hero & Search Bar", description: "Header title, search placeholder, and topic categories (AI, Web, Growth).", icon: BookOpen, fieldsCount: 8, status: "Active", category: "Banner" },
      { id: "blog-posts", order: "#02", name: "Article Posts Catalog", description: "Manage blog titles, slugs, author info, published dates, read times, and thumbnails.", icon: FileText, fieldsCount: 22, status: "Active", category: "Articles" },
      { id: "blog-newsletter", order: "#03", name: "Newsletter Subscription Box", description: "Configure email capture form, subscription promise, and privacy text.", icon: Mail, fieldsCount: 5, status: "Active", category: "Newsletter" },
    ],
  },

  "careers-page": {
    id: "careers-page",
    title: "Careers Page (/careers)",
    subtitle: "Manage company culture, open job positions, and applicant application forms",
    sections: [
      { id: "careers-hero", order: "#01", name: "Careers Hero & Perks Section", description: "Configure hiring tagline, culture benefits (Remote, Equity, Learning), and photos.", icon: UserCheck, fieldsCount: 10, status: "Active", category: "Banner" },
      { id: "careers-jobs", order: "#02", name: "Open Engineering Positions", description: "Edit job titles, locations (Kathmandu / Remote), experience level, and salary ranges.", icon: Briefcase, fieldsCount: 14, status: "Active", category: "Jobs" },
      { id: "careers-apply", order: "#03", name: "Job Application Form Config", description: "Customize resume upload settings, screening questions, and HR notification email.", icon: Send, fieldsCount: 8, status: "Active", category: "Form" },
    ],
  },

  "testimonials-page": {
    id: "testimonials-page",
    title: "Testimonials Page (/testimonials)",
    subtitle: "Manage client reviews, star ratings, video testimonials, and social proof",
    sections: [
      { id: "test-hero", order: "#01", name: "Testimonials Hero Banner", description: "Header title, overall rating badge (4.9/5.0), and client trust metrics.", icon: Quote, fieldsCount: 6, status: "Active", category: "Banner" },
      { id: "test-list", order: "#02", name: "Client Reviews Grid", description: "Edit review text, star ratings, reviewer names, designations, and company logos.", icon: StarIcon, fieldsCount: 15, status: "Active", category: "Reviews" },
    ],
  },

  "faqs-page": {
    id: "faqs-page",
    title: "FAQs Page (/faqs)",
    subtitle: "Manage question categories, search filters, and collapsible Q&A accordions",
    sections: [
      { id: "faq-categories", order: "#01", name: "FAQ Category Manager", description: "Create, rename, or delete the topics used as filter tabs (Engineering, Billing, Security).", icon: HelpCircle, fieldsCount: 4, status: "Active", category: "Categories" },
      { id: "faq-editor", order: "#02", name: "Question & Answer Items", description: "Edit questions, detailed answers, category assignment, and reorder accordion items.", icon: MessageSquare, fieldsCount: 18, status: "Active", category: "Accordions" },
    ],
  },

  "contact-page": {
    id: "contact-page",
    title: "Contact Us Page & Client Lead Inquiries",
    subtitle: "Manage lead capture forms, office address, contact emails, and incoming client inquiries",
    sections: [
      { id: "contact-hero", order: "#01", name: "Contact Hero & Office Details", description: "Configure contact headline, physical address, email addresses, and form choice options.", icon: Mail, fieldsCount: 15, status: "Active", category: "Contact Info" },
      { id: "quick-enquiry", order: "#02", name: "Quick Enquiry Modal Customization", description: "Customize Quick Enquiry Modal titles, badges, country code, and right panel info.", icon: MessageSquare, fieldsCount: 11, status: "Active", category: "Modal" },
      { id: "contact-form", order: "#03", name: "Client Lead Inquiries Moderation", description: "Manage incoming client lead inquiries, view messages, and mark read status.", icon: Send, fieldsCount: 10, status: "Active", category: "Moderation" },
    ],
  },
  "contact-inquiries": {
    id: "contact-inquiries",
    title: "Contact Us Page & Client Lead Inquiries",
    subtitle: "Manage lead capture forms, office address, contact emails, and incoming client inquiries",
    sections: [
      { id: "contact-hero", order: "#01", name: "Contact Hero & Office Details", description: "Configure contact headline, physical address, email addresses, and form choice options.", icon: Mail, fieldsCount: 15, status: "Active", category: "Contact Info" },
      { id: "quick-enquiry", order: "#02", name: "Quick Enquiry Modal Customization", description: "Customize Quick Enquiry Modal titles, badges, country code, and right panel info.", icon: MessageSquare, fieldsCount: 11, status: "Active", category: "Modal" },
      { id: "contact-form", order: "#03", name: "Client Lead Inquiries Moderation", description: "Manage incoming client lead inquiries, view messages, and mark read status.", icon: Send, fieldsCount: 10, status: "Active", category: "Moderation" },
    ],
  },
  "contact-inquiries-leads": {
    id: "contact-inquiries-leads",
    title: "Contact Us Page & Client Lead Inquiries",
    subtitle: "Manage lead capture forms, office address, contact emails, and incoming client inquiries",
    sections: [
      { id: "contact-hero", order: "#01", name: "Contact Hero & Office Details", description: "Configure contact headline, physical address, email addresses, and form choice options.", icon: Mail, fieldsCount: 15, status: "Active", category: "Contact Info" },
      { id: "quick-enquiry", order: "#02", name: "Quick Enquiry Modal Customization", description: "Customize Quick Enquiry Modal titles, badges, country code, and right panel info.", icon: MessageSquare, fieldsCount: 11, status: "Active", category: "Modal" },
      { id: "contact-form", order: "#03", name: "Client Lead Inquiries Moderation", description: "Manage incoming client lead inquiries, view messages, and mark read status.", icon: Send, fieldsCount: 10, status: "Active", category: "Moderation" },
    ],
  },

  "not-found-page": {
    id: "not-found-page",
    title: "404 Error Page (not-found)",
    subtitle: "Manage 404 page error title, graph paper blueprint grid overlay, subtext, and navigation buttons",
    sections: [
      { id: "404-hero", order: "#01", name: "404 Error Hero & Blueprint Grid", description: "Configure 404 title, subtitle, graph paper grid styling, and ambient background glow.", icon: AlertTriangle, fieldsCount: 6, status: "Active", category: "Error Page" },
      { id: "404-links", order: "#02", name: "Quick Action Navigation Links", description: "Edit recommended recovery links (Home, Services, Contact, FAQs) displayed on 404 error page.", icon: Globe, fieldsCount: 8, status: "Active", category: "Navigation" },
    ],
  },
  "system-settings": {
    id: "system-settings",
    title: "System Settings & Preferences",
    subtitle: "Configure notification sound chimes, color themes, platform defaults, and security policies",
    sections: [],
  },
};

export function getNavItems(
  unreadTestimonialsCount: number,
  unreadContactCount: number,
  unreadJobAppsCount: number
): NavGroup[] {
  return [
    {
      group: "DASHBOARD & ANALYTICS",
      items: [
        { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
        { id: "realtime-analytics", label: "Real-time Analytics", icon: TrendingUp },
      ],
    },
    {
      group: "WEBSITE PAGES (DYNAMIC CONTENT)",
      items: [
        { id: "landing-management", label: "Landing Page (12 Sec)", icon: Home, badge: "12" },
        { id: "about-page", label: "About Us Page", icon: Info },
        { id: "services-page", label: "Services Pages", icon: Layers },
        { id: "industries-page", label: "Industries Pages", icon: Building2 },
        { id: "case-studies-page", label: "Case Studies Page", icon: FolderGit2 },
        { id: "journey-page", label: "Company Journey Page", icon: Milestone },
        { id: "blog-page", label: "Blog Pages", icon: BookOpen },
        { id: "careers-page", label: "Careers Page", icon: Briefcase },
        {
          id: "testimonials-page",
          label: "Testimonials Page",
          icon: Quote,
          badge: unreadTestimonialsCount > 0 ? `${unreadTestimonialsCount} New` : undefined,
        },
        { id: "faqs-page", label: "FAQs Page", icon: HelpCircle },
        {
          id: "contact-inquiries",
          label: "Contact Us Page",
          icon: Mail,
          badge: unreadContactCount > 0 ? `${unreadContactCount} Unread` : undefined,
        },
        { id: "not-found-page", label: "404 Error Page", icon: AlertTriangle },
      ],
    },
    {
      group: "LEADS & INQUIRIES",
      items: [
        {
          id: "contact-inquiries-leads",
          label: "Client Inquiries",
          icon: MessageSquare,
          badge: unreadContactCount > 0 ? `${unreadContactCount}` : undefined,
        },
        {
          id: "job-applied",
          label: "Job Applied",
          icon: Briefcase,
          badge: unreadJobAppsCount > 0 ? `${unreadJobAppsCount}` : undefined,
        },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { id: "security-logs", label: "Security Logs", icon: ShieldCheck },
        { id: "system-settings", label: "System Settings", icon: Settings },
      ],
    },
  ];
}

export function getTimeAgo(dateString?: string): string {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Just now";
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return "Just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  return `${Math.floor(diffInMonths / 12)}y ago`;
}
