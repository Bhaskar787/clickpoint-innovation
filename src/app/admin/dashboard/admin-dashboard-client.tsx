"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Settings,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ShieldCheck,
  Archive,
  MoreVertical,
  SlidersHorizontal,
  Grid,
  Menu,
  X,
  FileText,
  HelpCircle,
  FolderGit2,
  LayoutTemplate,
  Edit3,
  Eye,
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
  Star,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/components/common/theme-provider";
import { toast } from "sonner";
import AboutPageEditor from "./about-page-editor";
import ServicesPageEditor from "./services-page-editor";
import IndustriesPageEditor from "./industries-page-editor";
import ContactEditor from "./contact-editor";
import TestimonialsEditor from "./testimonials-editor";
import JourneyEditor from "./journey-editor";
import NotFoundPageEditor from "./not-found-page-editor";
import { subscribeRealtimeNotifications } from "@/lib/realtime-notifications";
import CareersPageEditor from "./careers-page-editor";
import FaqEditor from "./faq-editor";

interface AdminDashboardClientProps {
  userEmail: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface SectionBox {
  id: string;
  order: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fieldsCount: number;
  status: string;
  category: string;
}

interface PageConfig {
  id: string;
  title: string;
  subtitle: string;
  sections: SectionBox[];
}

const RECENT_INQUIRIES = [
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

const ALL_PAGE_CONFIGS: Record<string, PageConfig> = {
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
      { id: "about-team", order: "#03", name: "Leadership & Engineering Team", description: "Customize team member profiles, bios, designations, photos, and LinkedIn social links.", icon: UserCheck, fieldsCount: 16, status: "Active", category: "Team" },
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
      { id: "test-list", order: "#02", name: "Client Reviews Grid", description: "Edit review text, star ratings, reviewer names, designations, and company logos.", icon: Award, fieldsCount: 15, status: "Active", category: "Reviews" },
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
    title: "Contact Us Page (/contact)",
    subtitle: "Manage lead capture forms, office address, contact emails, and phone channels",
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
};

function getTimeAgo(dateString?: string): string {
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

export default function AdminDashboardClient({ userEmail }: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [unreadTestimonialsCount, setUnreadTestimonialsCount] = useState<number>(0);
  const [unreadContactCount, setUnreadContactCount] = useState<number>(0);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState<boolean>(false);
  const [selectedNotificationItemId, setSelectedNotificationItemId] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const prevUnreadCountRef = useRef<number>(0);
  const prevContactCountRef = useRef<number>(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    async function checkNotifications() {
      try {
        const res = await fetch("/api/notifications");
        const json = await res.json();
        if (json.success) {
          const list = json.notifications || [];
          const newReviewCount = json.unreadReviewsCount || 0;
          const newContactCount = json.unreadContactsCount || 0;

          setNotificationsList(list);
          setUnreadTestimonialsCount(newReviewCount);
          setUnreadContactCount(newContactCount);

          if (!isInitialMount.current && newReviewCount > prevUnreadCountRef.current) {
            const latestReview = list.find((n: any) => n.category === "REVIEW" || n.type === "REVIEW");
            toast.custom(
              (tId) => (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-[#1f1912] border border-amber-200 dark:border-amber-900/60 shadow-xl max-w-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 shadow-xs">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-amber-950 dark:text-amber-100">
                        New Review Received
                      </h4>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Just now</span>
                    </div>
                    <p className="text-xs text-amber-900 dark:text-amber-200 mt-1 leading-snug font-medium line-clamp-2 italic">
                      {latestReview ? `"${latestReview.content}" — ${latestReview.clientName}` : "New feedback submitted."}
                    </p>
                    <button
                      onClick={() => {
                        toast.dismiss(tId);
                        setActiveTab("testimonials-page");
                        setSelectedSectionId(null);
                      }}
                      className="mt-2 text-xs font-extrabold text-amber-700 dark:text-amber-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Moderate Review</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ),
              { duration: 5000 }
            );
          }

          if (!isInitialMount.current && newContactCount > prevContactCountRef.current) {
            const latestContact = list.find((n: any) => n.category !== "REVIEW" && n.type !== "REVIEW");
            toast.custom(
              (tId) => (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-[#0f172a] border border-blue-200 dark:border-blue-900/60 shadow-xl max-w-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-blue-950 dark:text-blue-100">
                        New Lead Inquiry Received
                      </h4>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Just now</span>
                    </div>
                    <p className="text-xs text-blue-900 dark:text-blue-200 mt-1 leading-snug font-medium line-clamp-2 italic">
                      {latestContact ? `Inquiry from ${latestContact.clientName} (${latestContact.email || ""})` : "New contact message received."}
                    </p>
                    <button
                      onClick={() => {
                        toast.dismiss(tId);
                        setActiveTab("contact-page");
                        setSelectedSectionId(null);
                      }}
                      className="mt-2 text-xs font-extrabold text-blue-700 dark:text-blue-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Lead Inquiry</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ),
              { duration: 5000 }
            );
          }

          prevUnreadCountRef.current = newReviewCount;
          prevContactCountRef.current = newContactCount;
          isInitialMount.current = false;
        }
      } catch (err) {
        console.error("Error polling notifications:", err);
      }
    }

    checkNotifications();

    const handleFocus = () => checkNotifications();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkNotifications();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const unsubscribe = subscribeRealtimeNotifications(() => {
      checkNotifications();
    });

    let sse: EventSource | null = null;
    if (typeof window !== "undefined") {
      try {
        sse = new EventSource("/api/notifications/stream");
        sse.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.type !== "CONNECTED") {
              checkNotifications();
            }
          } catch (e) {}
        };
      } catch (e) {}
    }

    const interval = setInterval(checkNotifications, 3000);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribe();
      if (sse) sse.close();
      clearInterval(interval);
    };
  }, []);

  async function handleMarkSingleRead(item: any) {
    try {
      const category = item.category || item.type;
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-read", id: item.id, category }),
      });

      setNotificationsList((prev) => prev.filter((n) => n.id !== item.id));
      if (category === "REVIEW") {
        setUnreadTestimonialsCount((prev) => Math.max(0, prev - 1));
      } else {
        setUnreadContactCount((prev) => Math.max(0, prev - 1));
      }

      setSelectedNotificationItemId(item.id);
      setActiveTab(item.targetTab || "contact-page");
      setSelectedSectionId(null);
      setShowNotificationsDropdown(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleArchiveAllNotifications() {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive-all" }),
      });

      setNotificationsList([]);
      setUnreadTestimonialsCount(0);
      setUnreadContactCount(0);
      toast.success("All notifications archived & marked as read!");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleLogout() {
    toast.success("Signed Out Successfully", {
      description: "You have been logged out of your session.",
    });
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
    await authClient.signOut();
    router.push("/admin");
    router.refresh();
  }

  const navItems: NavGroup[] = [
    {
      group: "DASHBOARD & ANALYTICS",
      items: [
        { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
        { id: "analytics", label: "Real-time Analytics", icon: BarChart3 },
      ],
    },
    {
      group: "WEBSITE PAGES (DYNAMIC CONTENT)",
      items: [
        { id: "landing-management", label: "Landing Page (12 Sec)", icon: LayoutTemplate, badge: "12" },
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
          badge: unreadTestimonialsCount > 0 ? `${unreadTestimonialsCount} UNREAD` : undefined,
        },
        { id: "faqs-page", label: "FAQs Page", icon: HelpCircle },
        {
          id: "contact-page",
          label: "Contact Us Page",
          icon: Mail,
          badge: unreadContactCount > 0 ? `${unreadContactCount} UNREAD` : undefined,
        },
        { id: "not-found-page", label: "404 Error Page", icon: AlertTriangle },
      ],
    },
    {
      group: "LEADS & INQUIRIES",
      items: [
        {
          id: "inquiries",
          label: "Client Inquiries",
          icon: MessageSquare,
          badge: unreadContactCount > 0 ? `${unreadContactCount} NEW` : undefined,
        },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { id: "security", label: "Security Logs", icon: ShieldCheck },
        { id: "settings", label: "System Settings", icon: Settings },
      ],
    },
  ];

  const currentPageConfig = ALL_PAGE_CONFIGS[activeTab];
  const selectedSection = currentPageConfig?.sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-200 w-full overflow-x-hidden">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* ================= 1. SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-[#131927] border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            {!collapsed ? (
              <Image
                src="/images/clickpointfinal.png"
                alt="Clickpoint Innovation"
                width={1236}
                height={317}
                priority
                className="h-8 w-auto transition-transform hover:scale-105"
              />
            ) : (
              <Image
                src="/images/fav3.png"
                alt="Clickpoint Innovation"
                width={100}
                height={100}
                priority
                className="h-8 w-8 object-contain transition-transform hover:scale-110"
              />
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 py-4 px-3 space-y-6 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.3)_transparent]">
          {navItems.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 truncate">
                  {group.group}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          setSelectedSectionId(null);
                          setMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <div className="flex-1 flex items-center justify-between overflow-hidden text-left min-w-0">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`ml-2 rounded-full px-2 py-0.5 text-[9px] font-extrabold shrink-0 ${
                                  item.id === "testimonials-page"
                                    ? "bg-amber-500 text-white animate-pulse shadow-sm"
                                    : "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="shrink-0 p-3 border-t border-slate-100 dark:border-slate-800 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapsed View</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ================= 2. MAIN CONTENT AREA ================= */}
      <div className={`flex-1 flex flex-col min-w-0 w-full overflow-x-hidden transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        
        {/* Top FIXED Navbar Header - Stays pinned at top during scroll */}
        <header className={`h-16 bg-white dark:bg-[#131927] border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between fixed top-0 right-0 z-30 backdrop-blur-md transition-all duration-300 ${
          collapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"
        }`}>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-md">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative w-full max-w-[180px] sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search page content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] pl-8 sm:pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={(e) => toggleTheme(e)}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none"
                aria-label="Notifications"
                title={unreadTestimonialsCount + unreadContactCount > 0 ? `${unreadTestimonialsCount + unreadContactCount} Unread Notifications` : "Notifications"}
              >
                <Bell className="h-4 w-4" />
                {unreadTestimonialsCount + unreadContactCount > 0 ? (
                  <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] sm:text-[11px] font-black text-white shadow-md border-2 border-white dark:border-[#131927]">
                    {unreadTestimonialsCount + unreadContactCount > 9 ? "9+" : unreadTestimonialsCount + unreadContactCount}
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute right-0 top-12 z-50 w-72 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Notifications
                      </h4>
                      {notificationsList.length > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full">
                          {notificationsList.length}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {notificationsList.length > 0 && (
                        <button
                          onClick={handleArchiveAllNotifications}
                          className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                          Archive all
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotificationsDropdown(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md p-0.5 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notificationsList.length === 0 ? (
                      <div className="text-center py-8 px-4 space-y-1.5">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                          <Archive className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          No unread notifications
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          All reviews & messages have been archived.
                        </p>
                      </div>
                    ) : (
                      notificationsList.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleMarkSingleRead(item)}
                          className="flex items-center justify-between gap-2.5 px-3 sm:px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                            <span
                              className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                (item.category || item.type) === "REVIEW"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                              }`}
                            >
                              {(item.category || item.type) === "REVIEW" ? "Review" : "Inquiry"}
                            </span>

                            <div className="min-w-0 flex-1 flex items-center gap-1.5 sm:gap-2">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 truncate max-w-[80px] sm:max-w-none">
                                {item.clientName}
                              </span>
                              <span className="text-xs text-slate-400 dark:text-slate-500 truncate min-w-0">
                                — {item.content}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
                            {item.rating ? (
                              <div className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                  {item.rating}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                View →
                              </span>
                            )}
                            {item.createdAt && (
                              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded hidden sm:inline-block">
                                {getTimeAgo(item.createdAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <Image
                  src="/images/fav3.png"
                  alt="Clickpoint Innovation"
                  width={100}
                  height={100}
                  priority
                  className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform hover:scale-110 shrink-0"
                />
                <div className="hidden md:block text-left min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[100px] lg:max-w-[130px]">
                    {userEmail}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold truncate">Super Admin</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Scrollable Content (pt-20 offsets the fixed navbar header) */}
        <main className="pt-20 sm:pt-22 p-3 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Clickpoint Admin Dashboard
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Here&apos;s what&apos;s going on at your business right now
                  </p>
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    <span>Mar 1 - Mar 31, 2026</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xs">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm">
                    57
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">57 new inquiries</p>
                    <p className="text-[11px] text-slate-400 truncate">Awaiting processing</p>
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xs">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm">
                    5
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">5 proposals</p>
                    <p className="text-[11px] text-slate-400 truncate">On hold for review</p>
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xs sm:col-span-2 lg:col-span-1">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm">
                    15
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">15 active projects</p>
                    <p className="text-[11px] text-slate-400 truncate">Live & in production</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-w-0">
                <div className="lg:col-span-7 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 shadow-xs flex flex-col justify-between min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Total Sells & Conversion</h3>
                      <p className="text-xs text-slate-400">Payment received across all channels</p>
                    </div>
                    <span className="self-start sm:self-auto text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200/50 dark:border-blue-800/40">
                      Mar 1 - 31, 2026
                    </span>
                  </div>

                  <div className="w-full h-40 sm:h-56 my-2 relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                      <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />

                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      <path
                        d="M 0,150 Q 75,100 150,110 T 300,50 T 420,130 L 500,100 L 500,190 L 0,190 Z"
                        fill="url(#chartGradient)"
                      />

                      <path
                        d="M 0,150 Q 75,100 150,110 T 300,50 T 420,130 L 500,100"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />

                      <path
                        d="M 0,160 Q 75,120 150,130 T 300,80 T 420,110 L 500,120"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />

                      <circle cx="300" cy="50" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>01 May</span>
                    <span>15 May</span>
                    <span>30 May</span>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                  <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Total Orders</h4>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                          -6.8%
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2">16,247</p>
                      <p className="text-[10px] text-slate-400">Last 7 days</p>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-1 h-12">
                      {[40, 65, 30, 80, 50, 90, 70].map((h, idx) => (
                        <div key={idx} className="flex-1 bg-blue-500/20 rounded-t h-full flex items-end">
                          <div className="w-full bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">New Customers</h4>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          +26.5%
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2">356</p>
                      <p className="text-[10px] text-slate-400">Last 7 days</p>
                    </div>

                    <div className="mt-4 h-12 w-full">
                      <svg className="w-full h-full" viewBox="0 0 100 40">
                        <path
                          d="M0,35 Q25,30 50,15 T100,5"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Top Services</h4>
                      <p className="text-[10px] text-slate-400">Last 7 days</p>
                    </div>

                    <div className="my-3 flex items-center justify-center">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100 dark:text-slate-800"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-blue-600"
                            strokeDasharray="72, 100"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">72%</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Paying vs Non Paying</h4>
                      <p className="text-[10px] text-slate-400">Last 7 days</p>
                    </div>

                    <div className="my-3 flex items-center justify-center">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                          <path
                            className="text-blue-500"
                            strokeDasharray="40, 100"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 shadow-xs min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Latest Inquiries & Deals</h3>
                    <p className="text-xs text-slate-400">Real-time incoming inquiries submitted by prospective clients</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Filter Deals</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                        <th className="py-3 px-3">INQUIRY ID</th>
                        <th className="py-3 px-3">CLIENT / PRODUCT</th>
                        <th className="py-3 px-3">SERVICE CATEGORY</th>
                        <th className="py-3 px-3">ESTIMATED BUDGET</th>
                        <th className="py-3 px-3">RATING</th>
                        <th className="py-3 px-3">STATUS</th>
                        <th className="py-3 px-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {RECENT_INQUIRIES.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{item.id}</td>
                          <td className="py-3.5 px-3">
                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px] sm:max-w-none">{item.client}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[120px] sm:max-w-none">{item.email}</p>
                          </td>
                          <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">{item.service}</td>
                          <td className="py-3.5 px-3 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">{item.budget}</td>
                          <td className="py-3.5 px-3 text-amber-500 font-bold whitespace-nowrap">{item.rating}</td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* DYNAMIC PAGE CONTENT MANAGEMENT VIEW */}
          {currentPageConfig && activeTab !== "dashboard" && (
            <div className="space-y-4 sm:space-y-6 min-w-0">
              
              <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                      <LayoutTemplate className="h-3 w-3" />
                      Dynamic Content Engine
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      {currentPageConfig.sections.length} Configurable Sections
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                    {currentPageConfig.title} Management
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {currentPageConfig.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={
                      activeTab === "landing-management"
                        ? "/"
                        : activeTab === "about-page"
                        ? "/about"
                        : activeTab === "services-page"
                        ? "/services"
                        : activeTab === "industries-page"
                        ? "/industries"
                        : activeTab === "case-studies-page"
                        ? "/case-studies"
                        : activeTab === "journey-page"
                        ? "/journey"
                        : activeTab === "blog-page"
                        ? "/blog"
                        : activeTab === "careers-page"
                        ? "/careers"
                        : activeTab === "testimonials-page"
                        ? "/testimonials"
                        : activeTab === "faqs-page"
                        ? "/faqs"
                        : activeTab === "not-found-page"
                        ? "/404"
                        : "/contact"
                    }
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto"
                  >
                    <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Preview Page</span>
                  </a>
                </div>
              </div>

              {selectedSectionId && selectedSection && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50/70 dark:bg-[#131927] border border-blue-200 dark:border-slate-800 shadow-xs mb-4 sm:mb-6 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedSectionId(null)}
                      className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Back to All Section Boxes</span>
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md shrink-0">
                          {selectedSection.order}
                        </span>
                        <h3 className="text-xs font-extrabold truncate">
                          Editing: {selectedSection.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {selectedSection.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSectionId(null)}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors self-end sm:self-auto shrink-0"
                    title="Close Editor"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {!selectedSectionId && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 min-w-0">
                  {currentPageConfig.sections.map((section) => {
                    const Icon = section.icon;
                    const isSelected = selectedSectionId === section.id;

                    return (
                      <div
                        key={section.id}
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`group relative rounded-xl sm:rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between min-w-0 ${
                          isSelected
                            ? "border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/20 shadow-md"
                            : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md shrink-0">
                                {section.order}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                {section.category}
                              </span>
                            </div>

                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {section.status}
                            </span>
                          </div>

                          <div className="flex items-start gap-3.5 mb-2 min-w-0">
                            <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-blue-500 group-hover:text-white"
                            }`}>
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                {section.name}
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                {section.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {section.fieldsCount} Configurable Fields
                          </span>

                          <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                            <span>Configure</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "about-page" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <AboutPageEditor
                    sectionId={selectedSectionId}
                    onCloseSection={() => setSelectedSectionId(null)}
                  />
                </div>
              )}

              {activeTab === "services-page" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <ServicesPageEditor
                    sectionId={selectedSectionId}
                    onCloseSection={() => setSelectedSectionId(null)}
                  />
                </div>
              )}

              {activeTab === "industries-page" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <IndustriesPageEditor
                    sectionId={selectedSectionId}
                    onCloseSection={() => setSelectedSectionId(null)}
                  />
                </div>
              )}

              {activeTab === "testimonials-page" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <TestimonialsEditor
                      sectionId={selectedSectionId}
                      selectedItemId={selectedNotificationItemId}
                      onCloseSection={() => setSelectedSectionId(null)}
                      onClearSelectedItem={() => setSelectedNotificationItemId(null)}
                  />
                </div>
              )}

              {activeTab === "journey-page" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <JourneyEditor
                    sectionId={selectedSectionId || undefined}
                  />
                </div>
              )}

              {activeTab === "landing-management" && selectedSectionId === "timeline" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <JourneyEditor sectionId="timeline" />
                </div>
              )}

              {(activeTab === "contact-page" || activeTab === "inquiries") && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <ContactEditor
                    sectionId={selectedSectionId}
                    selectedItemId={selectedNotificationItemId}
                    onCloseSection={() => setSelectedSectionId(null)}
                    onClearSelectedItem={() => setSelectedNotificationItemId(null)}
                  />
                </div>
              )}

              {activeTab === "careers-page" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <CareersPageEditor
                    sectionId={selectedSectionId}
                    onCloseSection={() => setSelectedSectionId(null)}
                  />
                </div>
              )}

              {activeTab === "faqs-page" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <FaqEditor
                    sectionId={selectedSectionId}
                    onCloseSection={() => setSelectedSectionId(null)}
                  />
                </div>
              )}

              {activeTab === "not-found-page" && (
                <div className="mt-6 sm:mt-8 min-w-0">
                  <NotFoundPageEditor
                    sectionId={selectedSectionId}
                    onCloseSection={() => setSelectedSectionId(null)}
                  />
                </div>
              )}

              {activeTab !== "about-page" && activeTab !== "services-page" && activeTab !== "industries-page" && activeTab !== "testimonials-page" && activeTab !== "journey-page" && activeTab !== "contact-page" && activeTab !== "inquiries" && activeTab !== "careers-page" && activeTab !== "not-found-page" && selectedSection && selectedSection.id !== "timeline" && (
                <div className="mt-6 sm:mt-8 rounded-xl sm:rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 p-4 sm:p-6 shadow-sm min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-blue-500/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                        <Edit3 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                          Configure {selectedSection.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          Section box selected. Ready for step-by-step content field customization.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSectionId(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 self-end sm:self-auto shrink-0"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-white dark:bg-[#131927] rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <span className="truncate">
                      Box <strong className="text-blue-600 dark:text-blue-400">{selectedSection.order} ({selectedSection.name})</strong> ready for content field inputs.
                    </span>
                    <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-700 transition-colors shrink-0">
                      Edit Content Fields
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}