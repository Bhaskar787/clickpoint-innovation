import { ComponentType } from "react";

export interface ServiceDetailFeature {
  title: string;
  desc: string;
}

export interface ServiceWorkflowStep {
  step: string;
  title: string;
  desc: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  fullOverview: string;
  heroBadge: string;
  iconName: string;
  icon?: ComponentType<{ className?: string }>;
  image?: string;
  imageUrl?: string;
  buttonText?: string;
  keyMetrics: { label: string; value: string }[];
  features: ServiceDetailFeature[];
  workflow: ServiceWorkflowStep[];
  techStack: string[];
  useCases: string[];
}

export interface IndustryProject {
  id: string;
  title: string;
  client: string;
  desc: string;
  impact: string;
  liveUrl: string;
  techStack: string[];
  imageGradient: string;
}

export interface IndustryItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  fullOverview: string;
  heroBadge: string;
  href: string;
  iconName?: string;
  icon?: ComponentType<{ className?: string }>;
  keyMetrics: { label: string; value: string }[];
  projects: IndustryProject[];
  solutions: { title: string; desc: string }[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarGradient: string;
  initials: string;
  linkedIn?: string;
  twitter?: string;
  expertise: string[];
}

export interface CompanyLink {
  id: string;
  title: string;
  desc?: string;
  badge?: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface MilestoneItem {
  year: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  iconName: string;
  icon?: ComponentType<{ className?: string }>;
  image?: string;
}

export interface ClientLogo {
  name: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  image: string;
  featured?: boolean;
  tags: string[];
}
