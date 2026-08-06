"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Zap,
  Phone,
  Sun,
  Moon,
  Building2,
  Milestone,
  Briefcase,
  FileText,
  Star,
  BookOpen,
  HelpCircle,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { SERVICES_DATA, INDUSTRIES_DATA } from "@/data/landing-data";
import { DEFAULT_NAVBAR_DATA, CompanyNavItem } from "@/data/default-navbar-data";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import Image from "next/image";
import Link from "next/link";
import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";
import { useTheme } from "@/components/common/theme-provider";

// Helper map to assign icons to company dropdown items based on id
const COMPANY_ICON_MAP: Record<string, any> = {
  about: Building2,
  journey: Milestone,
  careers: Briefcase,
  "case-studies": FileText,
  testimonials: Star,
  blog: BookOpen,
  faqs: HelpCircle,
  contact: Mail,
};

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const scrolled = useScrollHeader(16);
  const { isOpen: mobileOpen, toggle: toggleMobile, close: closeMobile } = useMobileMenu();
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Mobile Accordion Open States
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);

  const [navData, setNavData] = useState<any>(DEFAULT_NAVBAR_DATA);

  useEffect(() => {
    async function loadNavbarData() {
      try {
        const res = await fetch("/api/navbar");
        const json = await res.json();
        if (json.success && json.navbar) {
          setNavData(json.navbar);
        }
      } catch (err) {
        console.warn("Failed to load dynamic navbar data:", err);
      }
    }
    loadNavbarData();
  }, []);

  const isSolidHeader = !isHomePage || scrolled;

  const logo = navData.logo || DEFAULT_NAVBAR_DATA.logo;
  const titles = navData.menuTitles || DEFAULT_NAVBAR_DATA.menuTitles;
  const companyLinks: CompanyNavItem[] = navData.companyLinks || DEFAULT_NAVBAR_DATA.companyLinks;
  const cta = navData.cta || DEFAULT_NAVBAR_DATA.cta;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] w-full transition-colors duration-150",
          isSolidHeader
            ? "bg-white/90 backdrop-blur-xl border-b border-violet-100 shadow-sm shadow-violet-950/[0.04] py-3.5"
            : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {logo.logoUrl ? (
              <img
                src={logo.logoUrl}
                alt={logo.brandName || "Click Point Innovations"}
                className="h-9 w-auto group-hover:scale-105 transition-transform"
              />
            ) : (
              <span className="font-poppins text-xl font-extrabold text-ink dark:text-white">
                {logo.brandName || "Click Point Innovations"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                
                {/* 1. Services Mega Menu Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{titles.services || "Services"}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[660px] grid-cols-[1.45fr_1fr] gap-4 p-4">
                      <ul className="grid grid-cols-2 gap-2">
                        {SERVICES_DATA.map((service) => {
                          const Icon = service.icon;
                          return (
                            <li key={service.id}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/services/${service.id}`}
                                  className="group flex flex-col gap-1 rounded-xl p-2.5 transition-colors hover:bg-violet-50/90 dark:hover:bg-slate-800/90"
                                >
                                  <div className="flex items-center gap-2">
                                    {Icon && (
                                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white transition-colors">
                                        <Icon className="h-3.5 w-3.5" />
                                      </span>
                                    )}
                                    <span className="text-xs font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                                      {service.title}
                                    </span>
                                  </div>
                                  <span className="line-clamp-2 text-[11px] leading-tight text-ink/60 dark:text-slate-400">
                                    {service.subtitle}
                                  </span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-violet-100 dark:border-slate-800 bg-gradient-to-br from-[#1b4397] via-[#153880] to-[#0e2764] p-4 text-white shadow-md">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/30 blur-2xl" />
                        <div>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-violet-200 border border-violet-400/30">
                            <Zap className="h-3 w-3 text-violet-300" />
                            AI Accelerator
                          </span>
                          <h4 className="mt-2.5 font-display text-sm font-bold text-white">
                            Clickpoint AI Studio
                          </h4>
                          <p className="mt-1 text-[11px] leading-relaxed text-violet-200/80">
                            Launch your custom enterprise AI copilot or autonomous agent in 2 weeks.
                          </p>
                        </div>
                        <button
                          onClick={() => setQuickEnquiryOpen(true)}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-violet-200 transition-colors group text-left cursor-pointer"
                        >
                          Quick Enquiry Now
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 2. Industries Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{titles.industries || "Industries"}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] grid-cols-2 gap-1.5 p-3">
                      {INDUSTRIES_DATA.map((i) => {
                        const Icon = i.icon;
                        return (
                          <li key={i.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={i.href || "#"}
                                className="group flex items-start gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-violet-50/90 dark:hover:bg-slate-800/90"
                              >
                                {Icon && (
                                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100/70 dark:bg-slate-800 text-violet-700 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white transition-colors">
                                    <Icon className="h-3.5 w-3.5" />
                                  </span>
                                )}
                                <div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                                      {i.title}
                                    </span>
                                  </div>
                                  <span className="line-clamp-1 text-[10px] text-ink/60 dark:text-slate-400">
                                    {i.subtitle}
                                  </span>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. Company Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{titles.company || "Company"}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex w-[340px] flex-col gap-1 p-3">
                      {companyLinks.map((c) => {
                        const Icon = COMPANY_ICON_MAP[c.id] || Building2;
                        return (
                          <li key={c.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={c.href || "#"}
                                className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-violet-50/90 dark:hover:bg-slate-800/90"
                              >
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100/70 dark:bg-slate-800 text-violet-700 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white transition-colors">
                                  <Icon className="h-4 w-4" />
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                                      {c.title}
                                    </span>
                                    {c.badge && (
                                      <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700">
                                        {c.badge}
                                      </span>
                                    )}
                                  </div>
                                  {c.desc && (
                                    <span className="text-[11px] text-ink/60 dark:text-slate-400 leading-tight block truncate">
                                      {c.desc}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. Standalone Journey Link */}
                <NavigationMenuItem>
                  <Link
                    href={companyLinks.find((c) => c.id === "journey")?.href || "/journey"}
                    className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                  >
                    {titles.journey || "Our Journey"}
                  </Link>
                </NavigationMenuItem>

                {/* 5. Standalone Contact Link */}
                <NavigationMenuItem>
                  <Link
                    href={companyLinks.find((c) => c.id === "contact")?.href || "/contact"}
                    className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                  >
                    {titles.contact || "Contact"}
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Theme Toggle & Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={(e) => toggleTheme(e)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 dark:bg-slate-800 text-ink dark:text-amber-400 hover:bg-violet-100 dark:hover:bg-slate-700 transition-colors border border-violet-100 dark:border-slate-700 shadow-xs cursor-pointer"
              aria-label="Toggle theme mode"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Night Mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-[#f58220]" />
              ) : (
                <Moon className="h-4 w-4 text-violet-700" />
              )}
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (cta.openModalOnClick !== false) {
                  setQuickEnquiryOpen(true);
                } else if (cta.buttonLink) {
                  window.location.href = cta.buttonLink;
                } else {
                  setQuickEnquiryOpen(true);
                }
              }}
              className="shadow-md shadow-violet-600/25 font-bold cursor-pointer"
            >
              {cta.buttonText || "Quick Enquiry"}
            </Button>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 dark:bg-slate-800 text-ink dark:text-amber-400 hover:bg-violet-100 dark:hover:bg-slate-700 border border-violet-100 dark:border-slate-700 transition-colors cursor-pointer"
            onClick={toggleMobile}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 text-violet-700 dark:text-amber-400" /> : <Menu className="h-5 w-5 text-violet-700 dark:text-amber-400" />}
          </button>
        </div>
      </motion.header>

      {/* ORIGINAL MOBILE RESPONSIVE SIDEBAR DRAWER WITH EXPANDABLE ACCORDIONS */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMobile}
              className="fixed inset-0 z-[150] bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[160] w-[320px] max-w-[85vw] bg-white dark:bg-[#131c31] border-r border-violet-100 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between lg:hidden text-slate-900 dark:text-white"
            >
              <div className="space-y-6">
                {/* Header: Logo + Theme Toggle + Close */}
                <div className="flex items-center justify-between pb-5 border-b border-violet-100 dark:border-slate-800">
                  <Link href="/" onClick={closeMobile} className="flex items-center gap-2">
                    {logo.logoUrl ? (
                      <img src={logo.logoUrl} alt={logo.brandName} className="h-8 w-auto" />
                    ) : (
                      <span className="font-poppins text-lg font-bold text-ink dark:text-white">
                        {logo.brandName}
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleTheme(e)}
                      className="p-2 rounded-full bg-violet-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border border-violet-100 dark:border-slate-700"
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4 text-[#f58220]" /> : <Moon className="h-4 w-4 text-violet-700" />}
                    </button>
                    <button
                      onClick={closeMobile}
                      className="p-1.5 rounded-xl bg-violet-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation List with Original Expandable Accordions */}
                <div className="space-y-2 text-sm font-bold">
                  {/* 1. Services Accordion */}
                  <div>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-violet-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      <span>{titles.services || "Services"}</span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-400", mobileServicesOpen && "rotate-180")} />
                    </button>

                    {mobileServicesOpen && (
                      <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50 dark:bg-slate-900/60 rounded-xl my-1 border border-slate-100 dark:border-slate-800">
                        {SERVICES_DATA.map((s) => (
                          <Link
                            key={s.id}
                            href={`/services/${s.id}`}
                            onClick={closeMobile}
                            className="block py-1.5 px-2.5 text-xs text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-300 font-semibold"
                          >
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Industries Accordion */}
                  <div>
                    <button
                      onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-violet-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      <span>{titles.industries || "Industries"}</span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-400", mobileIndustriesOpen && "rotate-180")} />
                    </button>

                    {mobileIndustriesOpen && (
                      <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50 dark:bg-slate-900/60 rounded-xl my-1 border border-slate-100 dark:border-slate-800">
                        {INDUSTRIES_DATA.map((ind) => (
                          <Link
                            key={ind.id}
                            href={ind.href || "#"}
                            onClick={closeMobile}
                            className="block py-1.5 px-2.5 text-xs text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-300 font-semibold"
                          >
                            {ind.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Company Accordion (Includes all dynamic company links: About, Journey, Careers, Case Studies, Testimonials, Blog, FAQs, Contact) */}
                  <div>
                    <button
                      onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-violet-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-violet-600 dark:text-violet-400"
                    >
                      <span>{titles.company || "Company"}</span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-400", mobileCompanyOpen && "rotate-180")} />
                    </button>

                    {mobileCompanyOpen && (
                      <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50 dark:bg-slate-900/60 rounded-xl my-1 border border-slate-100 dark:border-slate-800">
                        {companyLinks.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href || "#"}
                            onClick={closeMobile}
                            className="flex items-center justify-between py-1.5 px-2.5 text-xs text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-300 font-bold"
                          >
                            <span>{item.title}</span>
                            {item.badge && (
                              <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-violet-700 dark:text-violet-300">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Standalone Our Journey Link */}
                  <Link
                    href={companyLinks.find((c) => c.id === "journey")?.href || "/journey"}
                    onClick={closeMobile}
                    className="block py-2.5 px-3 rounded-xl hover:bg-violet-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {titles.journey || "Our Journey"}
                  </Link>

                  {/* 5. Standalone Contact Link */}
                  <Link
                    href={companyLinks.find((c) => c.id === "contact")?.href || "/contact"}
                    onClick={closeMobile}
                    className="block py-2.5 px-3 rounded-xl hover:bg-violet-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {titles.contact || "Contact"}
                  </Link>
                </div>
              </div>

              {/* Mobile Drawer Footer CTA */}
              <div className="pt-6 border-t border-violet-100 dark:border-slate-800 space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-center font-bold shadow-md shadow-violet-600/20"
                  onClick={() => {
                    closeMobile();
                    setQuickEnquiryOpen(true);
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
