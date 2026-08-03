/**
 * Clickpoint Innovation — Domain Model Types & Interfaces
 * Standardized MVC Application Models
 */

// -----------------------------------------------------------------------------
// 1. SERVICES DOMAIN MODELS
// -----------------------------------------------------------------------------

export interface ServiceMetric {
  label: string;
  value: string;
}

export interface ServiceFeature {
  title: string;
  desc: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
  deliverable?: string;
}

export interface ServiceItem {
  id: string; // Unique URL slug (e.g. "ai-eng", "web-dev")
  title: string;
  subtitle: string;
  desc: string;
  icon?: any;
  iconName?: string;
  buttonText?: string;
  fullOverview?: string;
  heroBadge?: string;
  imageUrl?: string;
  keyMetrics?: ServiceMetric[];
  features?: ServiceFeature[];
  workflow?: WorkflowStep[];
  useCases?: string[];
  techStack?: string[];
  ctaPrimaryText?: string;
  ctaPrimaryRoute?: string;
  ctaSecondaryText?: string;
  ctaSecondaryRoute?: string;
  overviewTag?: string;
  overviewHeading?: string;
  capabilitiesTag?: string;
  capabilitiesHeading?: string;
  blueprintTag?: string;
  blueprintHeading?: string;
  useCasesHeading?: string;
}

export interface ServicesPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  catalogSection: {
    tag: string;
    title: string;
  };
  processSection?: {
    tag: string;
    title: string;
    subtitle: string;
    steps: WorkflowStep[];
  };
  services: ServiceItem[];
}

// -----------------------------------------------------------------------------
// 2. ABOUT & TEAM DOMAIN MODELS
// -----------------------------------------------------------------------------

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  initials?: string;
  avatarGradient?: string;
  expertise?: string[];
  linkedinUrl?: string;
}

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  badge?: string;
  description?: string;
}

export interface AboutPageContent {
  hero: {
    badge: string;
    title: string;
    highlightTitle: string;
    subtitle: string;
    videoUrl?: string;
  };
  mission: {
    tag: string;
    title: string;
    subtitle: string;
    bullets: string[];
    values: CoreValue[];
  };
  stats: {
    tag: string;
    title: string;
    subtitle: string;
    metrics: StatMetric[];
  };
  leadership: {
    tag: string;
    title: string;
    highlightTitle: string;
    subtitle: string;
    team: TeamMember[];
  };
}

// -----------------------------------------------------------------------------
// 3. LANDING PAGE & GENERAL ENTITY MODELS
// -----------------------------------------------------------------------------

export interface IndustryItem {
  id: string;
  title: string;
  subtitle?: string;
  heroBadge?: string;
  fullOverview?: string;
  imageUrl?: string;
  href?: string;
  tag?: string;
  desc: string;
  icon?: any;
  overviewTag?: string;
  overviewHeading?: string;
  complianceTag?: string;
  complianceHeading?: string;
  projectsTag?: string;
  projectsHeading?: string;
  solutionsTag?: string;
  solutionsHeading?: string;
  complianceBadges?: string[];
  metrics?: { label: string; value: string }[];
  keyMetrics?: { label: string; value: string }[];
  projects: {
    id?: string;
    title: string;
    desc: string;
    metrics?: string;
    impact?: string;
    client?: string;
    imageGradient?: string;
    liveUrl?: string;
    techStack?: string[];
    tags?: string[];
  }[];
  solutions: (string | { title: string; desc: string })[];
}

export interface IndustriesPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  industries: IndustryItem[];
}

export interface CompanyLink {
  id?: string;
  name?: string;
  title?: string;
  href: string;
  icon?: any;
  badge?: string;
  desc?: string;
}

export interface StatItem {
  id?: string;
  value: number;
  suffix?: string;
  label: string;
  change?: string;
  description?: string;
  badge?: string;
}

export interface MilestoneItem {
  year: string;
  quarter?: string;
  title: string;
  subtitle?: string;
  desc: string;
  metric?: string;
  highlight?: string;
  tags: string[];
  icon?: any;
  iconName?: string;
  image?: string;
}

export interface ClientLogo {
  name: string;
  badge?: string;
  impact?: string;
  category?: string;
}

// -----------------------------------------------------------------------------
// 4. CASE STUDY & PORTFOLIO DOMAIN MODELS
// -----------------------------------------------------------------------------

export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  description: string;
  challenge?: string;
  solution?: string;
  results?: string;
  metrics?: ServiceMetric[];
  techStack?: string[];
  imageUrl?: string;
  featured?: boolean;
  order?: number;
}

// -----------------------------------------------------------------------------
// 5. BLOG & CONTENT DOMAIN MODELS
// -----------------------------------------------------------------------------

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: any;
  authorRole?: string;
  category: string;
  readTime: string;
  publishedAt: string;
  imageUrl?: string;
  image?: string;
  tags?: string[];
  featured?: boolean;
}

export type BlogPost = BlogPostItem;

// -----------------------------------------------------------------------------
// 6. TESTIMONIAL & SOCIAL PROOF DOMAIN MODELS
// -----------------------------------------------------------------------------

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  featured?: boolean;
  isApproved?: boolean;
  isRead?: boolean;
  ipAddress?: string;
  userEmail?: string;
  order?: number;
  createdAt?: string;
}

export interface TestimonialsPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButtonText?: string;
    reviewModalButtonText?: string;
  };
  metrics?: { label: string; value: string }[];
  testimonials?: TestimonialItem[];
}

// -----------------------------------------------------------------------------
// 7. FAQ DOMAIN MODELS
// -----------------------------------------------------------------------------

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
}

// -----------------------------------------------------------------------------
// 8. INQUIRY / LEAD FORM DOMAIN MODELS
// -----------------------------------------------------------------------------

export type InquiryStatus = "PENDING" | "IN_PROGRESS" | "CONTACTED" | "COMPLETED" | "ARCHIVED";

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface ContactInquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  ipAddress?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    formSubtitle: string;
    submitButtonText: string;
  };
  contactInfo: {
    address: string;
    addressSubtext: string;
    email: string;
    emailSubtext: string;
    phone: string;
    phoneSubtext: string;
    hours: string;
    hoursSubtext: string;
    mapUrl?: string;
  };
  formFields: {
    serviceOptions: string[];
    budgetOptions: string[];
  };
}
