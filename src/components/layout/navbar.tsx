"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Zap,
  Building2,
  Milestone,
  Briefcase,
  FileText,
  Star,
  BookOpen,
  HelpCircle,
  Mail,
  ChevronDown,
  Compass,
  Layers,
  CheckCircle2,
  Bot,
  Code2,
  Palette,
  LineChart,
  Boxes,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SERVICES_DATA, INDUSTRIES_DATA } from "@/data/landing-data";
import {
  DEFAULT_NAVBAR_DATA,
  DEFAULT_NAVBAR_SERVICES_CONFIG,
  DEFAULT_NAVBAR_INDUSTRIES_CONFIG,
  CompanyNavItem,
} from "@/data/default-navbar-data";
import { IndustryIcon, ServiceIcon } from "@/components/ui/industry-icon";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import Link from "next/link";
import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useSiteData } from "@/components/common/theme-provider";

// Helper maps for tags and icons
const SERVICE_TAG_MAP: Record<string, string> = {
  "ai-eng": "AI & AGENTS",
  "web-dev": "WEB & MOBILE",
  "ui-ux": "DESIGN SYSTEM",
  growth: "GROWTH & SEO",
  "platform-mod": "CLOUD & DEVOPS",
  mlops: "MLOPS & DATA",
};

const INDUSTRY_TAG_MAP: Record<string, string> = {
  fintech: "FINANCE",
  healthcare: "HEALTHCARE",
  ecommerce: "COMMERCE",
  saas: "ENTERPRISE",
  logistics: "SUPPLY CHAIN",
  edtech: "EDUCATION",
};

const COMPANY_TAG_MAP: Record<string, string> = {
  about: "ABOUT US",
  careers: "WE'RE HIRING",
  "case-studies": "PORTFOLIO",
  testimonials: "REVIEWS",
  blog: "INSIGHTS",
  faqs: "SUPPORT",
  events: "EVENTS",
  journey: "JOURNEY",
  contact: "CONNECT",
};

// Helper map to assign icons to company dropdown items based on id
const COMPANY_ICON_MAP: Record<string, any> = {
  about: Building2,
  journey: Milestone,
  events: Milestone,
  careers: Briefcase,
  "case-studies": FileText,
  testimonials: Star,
  blog: BookOpen,
  faqs: HelpCircle,
  contact: Mail,
};

const NAVBAR_CACHE_KEY = "clickpoint_navbar_cache_v2";

function getCachedNavbarData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(NAVBAR_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface NavbarProps {
  initialData?: any;
}

export default function Navbar({ initialData }: NavbarProps = {}) {
  const { navbar: contextNavbar } = useSiteData();
  const effectiveInitial = initialData || contextNavbar;

  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const scrolled = useScrollHeader(16);
  const { isOpen: mobileOpen, toggle: toggleMobile, close: closeMobile } = useMobileMenu();
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState(false);

  // Mobile Accordion Open States
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);

  const [navData, setNavData] = useState<any>(() => effectiveInitial || getCachedNavbarData() || DEFAULT_NAVBAR_DATA);

  useEffect(() => {
    if (effectiveInitial) {
      setNavData(effectiveInitial);
      try {
        localStorage.setItem(NAVBAR_CACHE_KEY, JSON.stringify(effectiveInitial));
      } catch {}
    }
  }, [effectiveInitial]);

  useEffect(() => {
    async function loadNavbarData() {
      try {
        const res = await fetch("/api/navbar");
        const json = await res.json();
        if (json.success && json.navbar) {
          setNavData(json.navbar);
          try {
            localStorage.setItem(NAVBAR_CACHE_KEY, JSON.stringify(json.navbar));
          } catch {}
        }
      } catch (err) {
        console.warn("Failed to load dynamic navbar data:", err);
      }
    }
    loadNavbarData();

    // Listen for real-time updates from Admin Dashboard across tabs
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("clickpoint-navbar-sync");
      channel.onmessage = (event) => {
        if (event.data) {
          setNavData(event.data);
          try {
            localStorage.setItem(NAVBAR_CACHE_KEY, JSON.stringify(event.data));
          } catch {}
        }
      };
    } catch {}

    const handleCustomEvent = (e: any) => {
      if (e.detail) {
        setNavData(e.detail);
        try {
          localStorage.setItem(NAVBAR_CACHE_KEY, JSON.stringify(e.detail));
        } catch {}
      }
    };
    window.addEventListener("clickpoint-navbar-sync", handleCustomEvent);

    return () => {
      try {
        channel?.close();
      } catch {}
      window.removeEventListener("clickpoint-navbar-sync", handleCustomEvent);
    };
  }, []);

  const [activeMegaMenu, setActiveMegaMenu] = useState<"services" | "industries" | "company" | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = (menu: "services" | "industries" | "company") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMegaMenu(menu);
  };

  const closeMenuWithDelay = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 220);
  };

  const cancelClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Close mega menu on route change
  useEffect(() => {
    setActiveMegaMenu(null);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveMegaMenu(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isMegaMenuOpen = activeMegaMenu !== null;
  const isSolidHeader = !isHomePage || scrolled || isMegaMenuOpen;

  const logo = navData.logo || DEFAULT_NAVBAR_DATA.logo;
  const titles = navData.menuTitles || DEFAULT_NAVBAR_DATA.menuTitles;
  const companyLinks: CompanyNavItem[] = navData.companyLinks || DEFAULT_NAVBAR_DATA.companyLinks;
  const cta = navData.cta || DEFAULT_NAVBAR_DATA.cta;

  const journeyHref = navData.journeyLink || companyLinks.find((c) => c.id === "journey" || c.id === "events")?.href || "/events";
  const contactHref = navData.contactLink || companyLinks.find((c) => c.id === "contact")?.href || "/contact";

  // Dynamic Services Selection
  const allServicesList = navData.allServices && navData.allServices.length > 0 ? navData.allServices : SERVICES_DATA;
  const selectedServiceIds: string[] = navData.services?.selectedServiceIds || [];
  const displayedServices = useMemo(() => {
    if (selectedServiceIds.length > 0) {
      const filtered = allServicesList.filter((s: any) => selectedServiceIds.includes(s.id));
      if (filtered.length > 0) return filtered.slice(0, 6);
    }
    return allServicesList.slice(0, 6);
  }, [allServicesList, selectedServiceIds]);

  // Dynamic AI Sprint Featured Card
  const featuredCard = {
    ...DEFAULT_NAVBAR_SERVICES_CONFIG.featuredCard,
    ...(navData.services?.featuredCard || {}),
  };

  // Dynamic Portfolio / Industries Selection
  const allIndustriesList = navData.allIndustries && navData.allIndustries.length > 0 ? navData.allIndustries : INDUSTRIES_DATA;
  const selectedIndustryIds: string[] = navData.industries?.selectedIndustryIds || [];
  const displayedIndustries = useMemo(() => {
    if (selectedIndustryIds.length > 0) {
      const filtered = allIndustriesList.filter((ind: any) => selectedIndustryIds.includes(ind.id));
      if (filtered.length > 0) return filtered.slice(0, 6);
    }
    return allIndustriesList.slice(0, 6);
  }, [allIndustriesList, selectedIndustryIds]);

  const industriesSubheaderTitle = navData.industries?.subheaderTitle || "PROVEN INDUSTRY PORTFOLIO & SECTOR EXPERTISE";
  const industriesSubheaderLinkText = navData.industries?.subheaderLinkText || "View All Case Studies";
  const industriesSubheaderLinkHref = navData.industries?.subheaderLinkHref || "/case-studies";

  const handleCtaClick = () => {
    if (cta.openModalOnClick !== false) {
      setQuickEnquiryOpen(true);
    } else if (cta.buttonLink && cta.buttonLink.trim()) {
      const link = cta.buttonLink.trim();
      if (cta.openInNewTab) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else if (link.startsWith("http://") || link.startsWith("https://")) {
        window.location.href = link;
      } else {
        window.location.href = link;
      }
    } else {
      setQuickEnquiryOpen(true);
    }
  };

  return (
    <>
      <header
        onMouseEnter={() => {
          if (activeMegaMenu) cancelClose();
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] w-full py-3.5 backdrop-blur-xl",
          isMegaMenuOpen
            ? "bg-white dark:bg-[#0c1120] border-b-0 shadow-md"
            : isSolidHeader
            ? isHomePage
              ? "bg-white/95 dark:bg-[#0c1120]/95 border-b-0 shadow-md transition-colors duration-200"
              : "bg-white/95 dark:bg-[#0c1120]/95 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-200"
            : "bg-transparent border-b-0 transition-colors duration-200"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" prefetch={true} className="flex items-center gap-2 group">
            {logo.logoUrl ? (
              <img
                src={logo.logoUrl}
                alt={logo.brandName || "Click Point Innovations"}
                className="h-8 sm:h-9 w-auto group-hover:scale-105 transition-transform"
              />
            ) : (
              <span className="font-poppins text-lg sm:text-xl font-extrabold text-ink dark:text-white">
                {logo.brandName || "Click Point Innovations"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {/* 1. Services Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("services")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button
                type="button"
                onClick={() => {
                  cancelClose();
                  setActiveMegaMenu((prev) => (prev === "services" ? null : "services"));
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer",
                  activeMegaMenu === "services"
                    ? "bg-violet-50 text-violet-700 dark:bg-[#1a2035] dark:text-[#a093f7] shadow-2xs"
                    : "text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-[#1a2035] hover:text-violet-700 dark:hover:text-[#a093f7]"
                )}
              >
                <span>{titles.services || "Services"}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 text-ink/70 dark:text-slate-400",
                    activeMegaMenu === "services" && "rotate-180 text-violet-700 dark:text-[#a093f7]"
                  )}
                />
              </button>
            </div>

            {/* 2. Portfolio / Industries Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("industries")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button
                type="button"
                onClick={() => {
                  cancelClose();
                  setActiveMegaMenu((prev) => (prev === "industries" ? null : "industries"));
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer",
                  activeMegaMenu === "industries"
                    ? "bg-violet-50 text-violet-700 dark:bg-[#1a2035] dark:text-[#a093f7] shadow-2xs"
                    : "text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-[#1a2035] hover:text-violet-700 dark:hover:text-[#a093f7]"
                )}
              >
                <span>{titles.industries || "Portfolio"}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 text-ink/70 dark:text-slate-400",
                    activeMegaMenu === "industries" && "rotate-180 text-violet-700 dark:text-[#a093f7]"
                  )}
                />
              </button>
            </div>

            {/* 3. Company Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("company")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button
                type="button"
                onClick={() => {
                  cancelClose();
                  setActiveMegaMenu((prev) => (prev === "company" ? null : "company"));
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer",
                  activeMegaMenu === "company"
                    ? "bg-violet-50 text-violet-700 dark:bg-[#1a2035] dark:text-[#a093f7] shadow-2xs"
                    : "text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-[#1a2035] hover:text-violet-700 dark:hover:text-[#a093f7]"
                )}
              >
                <span>{titles.company || "Company"}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 text-ink/70 dark:text-slate-400",
                    activeMegaMenu === "company" && "rotate-180 text-violet-700 dark:text-[#a093f7]"
                  )}
                />
              </button>
            </div>

            {/* 4. Standalone Events Link */}
            <Link
              href={journeyHref}
              prefetch={true}
              onMouseEnter={closeMenuWithDelay}
              className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-[#1a2035] hover:text-violet-700 dark:hover:text-[#a093f7] transition-colors"
            >
              {titles.journey || "Events"}
            </Link>

            {/* 5. Standalone Contact Link */}
            <Link
              href={contactHref}
              prefetch={true}
              onMouseEnter={closeMenuWithDelay}
              className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-[#1a2035] hover:text-violet-700 dark:hover:text-[#a093f7] transition-colors"
            >
              {titles.contact || "Contact"}
            </Link>
          </nav>

          {/* Theme Toggle & Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            <Button
              variant="primary"
              size="sm"
              onClick={handleCtaClick}
              className="shadow-md shadow-violet-600/25 font-bold cursor-pointer"
            >
              {cta.buttonText || "Quick Enquiry"}
            </Button>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50/80 dark:bg-slate-800/80 text-ink dark:text-amber-400 hover:bg-violet-100 dark:hover:bg-slate-700 border border-violet-100 dark:border-slate-700 transition-colors cursor-pointer"
            onClick={toggleMobile}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-violet-700 dark:text-amber-400" />
            ) : (
              <Menu className="h-5 w-5 text-violet-700 dark:text-amber-400" />
            )}
          </button>
        </div>

        {/* Full-Width Solid Desktop Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white dark:bg-[#0c1120] border-b border-slate-200 dark:border-slate-800/80 shadow-2xl z-[95]"
              onMouseEnter={cancelClose}
              onMouseLeave={closeMenuWithDelay}
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
                {/* 1. SERVICES MEGA MENU CONTENT */}
                {activeMegaMenu === "services" && (
                  <div>
                    {/* Header Sub-bar */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        CORE ENGINEERING DISCIPLINES & AI CAPABILITIES
                      </span>
                      <Link
                        href="/services"
                        prefetch={true}
                        onClick={() => setActiveMegaMenu(null)}
                        className="text-xs font-bold text-violet-600 dark:text-[#a093f7] hover:underline inline-flex items-center gap-1 group"
                      >
                        <span>View All Services & Solutions</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {/* Main Content Grid: 2 columns x 3 rows of services + Featured Right Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] xl:grid-cols-[1fr_360px] gap-5 items-stretch">
                      {/* Left: dynamically selected services arranged in 2 columns x 3 rows with compact height & gap */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
                        {displayedServices.map((service: any) => {
                          const tag = service.badge || service.heroBadge || service.subtitle || SERVICE_TAG_MAP[service.id] || "DEVELOPMENT";

                          return (
                            <Link
                              key={service.id}
                              href={`/services/${service.id}`}
                              prefetch={true}
                              onClick={() => setActiveMegaMenu(null)}
                              className="group flex items-start gap-3 p-2 rounded-xl transition-all duration-150 hover:bg-violet-50/70 dark:hover:bg-[#1a2035] border border-transparent dark:border-transparent hover:border-violet-200/50 dark:hover:border-slate-800/80"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-[#171f38] text-violet-600 dark:text-[#a093f7] group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white transition-all shadow-2xs">
                                <ServiceIcon
                                  icon={service.icon}
                                  iconName={service.iconName}
                                  serviceId={service.id}
                                  className="h-4 w-4"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="inline-block px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase tracking-wider bg-violet-50 dark:bg-[#1a203a] text-violet-600 dark:text-[#a093f7] mb-0.5 truncate max-w-full">
                                  {tag}
                                </span>
                                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-[#a093f7] transition-colors leading-snug truncate">
                                  {service.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 line-clamp-1 leading-relaxed mt-0.5">
                                  {service.desc || service.description || service.subtitle}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Right: Featured AI Acceleration Sprint Card (Fully Dynamic & Admin Configurable) */}
                      <div className="rounded-xl bg-[#090d18] dark:bg-[#080c16] p-4 text-white border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-600/20 blur-3xl" />
                        <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-[#a093f7]/15 blur-3xl" />

                        <div className="space-y-2 relative z-10">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                            {featuredCard.badge || "AI ACCELERATION SPRINT"}
                          </span>
                          <div>
                            <h3 className="text-sm sm:text-[15px] font-bold text-white tracking-tight leading-snug">
                              {featuredCard.title || "Enterprise AI Copilot & Autonomous Pods"}
                            </h3>
                            <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                              {featuredCard.description || featuredCard.subtitle || "Dedicated senior engineering pods building production LLM apps, custom agents, and high-scale cloud platforms with 3x velocity."}
                            </p>
                          </div>

                          {(((featuredCard.highlights && featuredCard.highlights.length > 0) ? featuredCard.highlights : featuredCard.bullets) || []).length > 0 && (
                            <ul className="space-y-1.5 pt-0.5 text-[11px] text-slate-200">
                              {(((featuredCard.highlights && featuredCard.highlights.length > 0) ? featuredCard.highlights : featuredCard.bullets) || []).map((b: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span className="leading-snug">{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 pt-2.5 mt-2 border-t border-slate-800/80 relative z-10">
                          {featuredCard.primaryBtnAction === "link" ? (
                            <Link
                              href={featuredCard.primaryBtnLink || "/contact"}
                              onClick={() => setActiveMegaMenu(null)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold transition-all shadow-md shadow-violet-600/25 cursor-pointer whitespace-nowrap"
                            >
                              <span>{featuredCard.primaryBtnText || "Schedule Consultation"}</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMegaMenu(null);
                                setQuickEnquiryOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold transition-all shadow-md shadow-violet-600/25 cursor-pointer whitespace-nowrap"
                            >
                              <span>{featuredCard.primaryBtnText || "Schedule Consultation"}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                          <Link
                            href={featuredCard.secondaryLinkHref || featuredCard.secondaryBtnLink || "/services"}
                            prefetch={true}
                            onClick={() => setActiveMegaMenu(null)}
                            className="text-[11px] font-semibold text-slate-300 hover:text-[#a093f7] transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                          >
                            <span>{featuredCard.secondaryLinkText || featuredCard.secondaryBtnText || "Explore All Services →"}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PORTFOLIO / INDUSTRIES MEGA MENU CONTENT (Dynamically Configurable) */}
                {activeMegaMenu === "industries" && (
                  <div>
                    {/* Header Sub-bar */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {industriesSubheaderTitle}
                      </span>
                      <Link
                        href={industriesSubheaderLinkHref}
                        prefetch={true}
                        onClick={() => setActiveMegaMenu(null)}
                        className="text-xs font-bold text-violet-600 dark:text-[#a093f7] hover:underline inline-flex items-center gap-1 group"
                      >
                        <span>{industriesSubheaderLinkText}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {/* Main Content Grid: 3 columns x 2 rows (dynamically selected industries) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2">
                      {displayedIndustries.map((ind: any) => {
                        const tag = ind.badge || INDUSTRY_TAG_MAP[ind.id] || "PORTFOLIO";

                        return (
                          <Link
                            key={ind.id}
                            href={ind.href || `/portfolio/${ind.id}` || "#"}
                            prefetch={true}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group flex items-start gap-3 p-2 rounded-xl transition-all duration-150 hover:bg-violet-50/70 dark:hover:bg-[#1a2035] border border-transparent dark:border-transparent hover:border-violet-200/50 dark:hover:border-slate-800/80"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-[#171f38] text-violet-600 dark:text-[#a093f7] group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white transition-all shadow-2xs">
                              <IndustryIcon
                                icon={ind.icon}
                                iconName={ind.iconName}
                                industryId={ind.id}
                                className="h-4 w-4"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="inline-block px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase tracking-wider bg-violet-50 dark:bg-[#1a203a] text-violet-600 dark:text-[#a093f7] mb-0.5 truncate max-w-full">
                                {tag}
                              </span>
                              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-[#a093f7] transition-colors leading-snug truncate">
                                {ind.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 line-clamp-1 leading-relaxed mt-0.5">
                                {ind.desc || ind.description || ind.subtitle}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. COMPANY MEGA MENU CONTENT (2 Rows, Full Width, Compact) */}
                {activeMegaMenu === "company" && (
                  <div>
                    {/* Header Sub-bar */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        CLICKPOINT INNOVATIONS ECOSYSTEM & HUBS
                      </span>
                      <Link
                        href="/about"
                        prefetch={true}
                        onClick={() => setActiveMegaMenu(null)}
                        className="text-xs font-bold text-violet-600 dark:text-[#a093f7] hover:underline inline-flex items-center gap-1 group"
                      >
                        <span>Read Our Full Story</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {/* Main Content Grid: 3 columns x 2 rows (6 items across full width) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2">
                      {companyLinks.slice(0, 6).map((item) => {
                        const Icon = COMPANY_ICON_MAP[item.id] || Building2;
                        const tag = COMPANY_TAG_MAP[item.id] || "COMPANY";

                        return (
                          <Link
                            key={item.id}
                            href={item.href || "#"}
                            prefetch={true}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group flex items-start gap-3 p-2 rounded-xl transition-all duration-150 hover:bg-violet-50/70 dark:hover:bg-[#1a2035] border border-transparent dark:border-transparent hover:border-violet-200/50 dark:hover:border-slate-800/80"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-[#171f38] text-violet-600 dark:text-[#a093f7] group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white transition-all shadow-2xs">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="inline-block px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase tracking-wider bg-violet-50 dark:bg-[#1a203a] text-violet-600 dark:text-[#a093f7]">
                                  {tag}
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-violet-100 dark:bg-[#1a2035] px-1.5 py-0.2 text-[8px] font-bold text-violet-700 dark:text-[#a093f7] border border-violet-200 dark:border-slate-700">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-[#a093f7] transition-colors leading-snug truncate">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 line-clamp-1 leading-relaxed mt-0.5">
                                {item.desc || "Learn more about Clickpoint Innovation"}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Background Dimming Backdrop when Desktop Mega Menu is open */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="hidden lg:block fixed inset-0 top-0 z-[90] bg-black/40"
            onClick={() => setActiveMegaMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* IMPROVED RESPONSIVE MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 z-[150] bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed inset-y-0 left-0 z-[160] w-[310px] max-w-[85vw] bg-white dark:bg-[#0c1120] border-r border-violet-100 dark:border-slate-800/80 shadow-2xl flex flex-col justify-between lg:hidden text-slate-900 dark:text-white"
            >
              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <Link href="/" onClick={closeMobile} className="flex items-center gap-2">
                    {logo.logoUrl ? (
                      <img src={logo.logoUrl} alt={logo.brandName} className="h-7 w-auto" />
                    ) : (
                      <span className="font-poppins text-base font-bold text-slate-900 dark:text-white">
                        {logo.brandName || "Click Point"}
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <ThemeToggle size="sm" className="rounded-lg h-8 w-8" />
                    <button
                      onClick={closeMobile}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-[#1a2035] text-slate-500 hover:text-slate-900 dark:hover:text-[#a093f7] transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation Accordion List */}
                <nav className="space-y-1.5 text-xs font-semibold">
                  {/* 1. Services Accordion */}
                  <div className="rounded-xl border border-transparent hover:border-violet-100 dark:hover:border-slate-800/60 transition-colors">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={cn(
                        "w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors cursor-pointer text-slate-800 dark:text-slate-200",
                        mobileServicesOpen ? "bg-violet-50/70 dark:bg-[#1a2035] text-violet-700 dark:text-[#a093f7] font-bold" : "hover:bg-slate-50 dark:hover:bg-[#1a2035]/50"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Layers className="h-4 w-4 text-violet-600 dark:text-[#a093f7]" />
                        <span>{titles.services || "Services"}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform text-slate-400 dark:text-slate-500",
                          mobileServicesOpen && "rotate-180 text-violet-600 dark:text-[#a093f7]"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 pl-3 my-1 py-1 space-y-1 border-l-2 border-violet-200 dark:border-slate-700">
                            {displayedServices.map((s: any) => (
                              <Link
                                key={s.id}
                                href={`/services/${s.id}`}
                                prefetch={true}
                                onClick={closeMobile}
                                className="block py-1.5 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-violet-700 dark:hover:text-[#a093f7] hover:bg-violet-50/50 dark:hover:bg-[#1a2035]/50 transition-colors truncate"
                              >
                                {s.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 2. Industries Accordion */}
                  <div className="rounded-xl border border-transparent hover:border-violet-100 dark:hover:border-slate-800/60 transition-colors">
                    <button
                      onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
                      className={cn(
                        "w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors cursor-pointer text-slate-800 dark:text-slate-200",
                        mobileIndustriesOpen ? "bg-violet-50/70 dark:bg-[#1a2035] text-violet-700 dark:text-[#a093f7] font-bold" : "hover:bg-slate-50 dark:hover:bg-[#1a2035]/50"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Compass className="h-4 w-4 text-violet-600 dark:text-[#a093f7]" />
                        <span>{titles.industries || "Portfolio"}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform text-slate-400 dark:text-slate-500",
                          mobileIndustriesOpen && "rotate-180 text-violet-600 dark:text-[#a093f7]"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileIndustriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 pl-3 my-1 py-1 space-y-1 border-l-2 border-violet-200 dark:border-slate-700">
                            {displayedIndustries.map((ind: any) => (
                              <Link
                                key={ind.id}
                                href={ind.href || `/portfolio/${ind.id}` || "#"}
                                prefetch={true}
                                onClick={closeMobile}
                                className="block py-1.5 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-violet-700 dark:hover:text-[#a093f7] hover:bg-violet-50/50 dark:hover:bg-[#1a2035]/50 transition-colors truncate"
                              >
                                {ind.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Company Accordion */}
                  <div className="rounded-xl border border-transparent hover:border-violet-100 dark:hover:border-slate-800/60 transition-colors">
                    <button
                      onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                      className={cn(
                        "w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors cursor-pointer text-slate-800 dark:text-slate-200",
                        mobileCompanyOpen ? "bg-violet-50/70 dark:bg-[#1a2035] text-violet-700 dark:text-[#a093f7] font-bold" : "hover:bg-slate-50 dark:hover:bg-[#1a2035]/50"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Building2 className="h-4 w-4 text-violet-600 dark:text-[#a093f7]" />
                        <span>{titles.company || "Company"}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform text-slate-400 dark:text-slate-500",
                          mobileCompanyOpen && "rotate-180 text-violet-600 dark:text-[#a093f7]"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileCompanyOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 pl-3 my-1 py-1 space-y-1 border-l-2 border-violet-200 dark:border-slate-700">
                            {companyLinks.map((item) => {
                              const Icon = COMPANY_ICON_MAP[item.id] || Building2;
                              return (
                                <Link
                                  key={item.id}
                                  href={item.href || "#"}
                                  prefetch={true}
                                  onClick={closeMobile}
                                  className="flex items-center justify-between py-1.5 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-violet-700 dark:hover:text-[#a093f7] hover:bg-violet-50/50 dark:hover:bg-[#1a2035]/50 transition-colors"
                                >
                                  <span className="flex items-center gap-2 truncate">
                                    <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                    <span className="truncate">{item.title}</span>
                                  </span>
                                  {item.badge && (
                                    <span className="rounded-full bg-violet-100 dark:bg-[#1a2035] px-1.5 py-0.5 text-[8px] font-bold text-violet-700 dark:text-[#a093f7] border border-violet-200 dark:border-slate-700">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-2 my-2 border-t border-slate-100 dark:border-slate-800/60" />

                  {/* 4. Standalone Events Link */}
                  <Link
                    href={journeyHref}
                    prefetch={true}
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-violet-50/70 dark:hover:bg-[#1a2035] hover:text-violet-700 dark:hover:text-[#a093f7] transition-colors"
                  >
                    <Milestone className="h-4 w-4 text-violet-600 dark:text-[#a093f7]" />
                    <span>{titles.journey || "Events"}</span>
                  </Link>

                  {/* 5. Standalone Contact Link */}
                  <Link
                    href={contactHref}
                    prefetch={true}
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-violet-50/70 dark:hover:bg-[#1a2035] hover:text-violet-700 dark:hover:text-[#a093f7] transition-colors"
                  >
                    <Mail className="h-4 w-4 text-violet-600 dark:text-[#a093f7]" />
                    <span>{titles.contact || "Contact"}</span>
                  </Link>
                </nav>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090d18] space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-[#a093f7] shrink-0" />
                  <span className="truncate">Ready to scale your next project?</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center font-bold text-xs py-2.5 shadow-md shadow-violet-600/20 cursor-pointer"
                  onClick={() => {
                    closeMobile();
                    handleCtaClick();
                  }}
                >
                  {cta.buttonText || "Quick Enquiry"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickEnquiryModal isOpen={quickEnquiryOpen} onClose={() => setQuickEnquiryOpen(false)} />
    </>
  );
}