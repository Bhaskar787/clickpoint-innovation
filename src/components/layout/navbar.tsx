"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ArrowRight, Zap, Phone, Sun, Moon } from "lucide-react";
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
import { SERVICES_DATA, INDUSTRIES_DATA, COMPANY_DATA } from "@/data/landing-data";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import Image from "next/image";
import Link from "next/link";
import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";
import { useTheme } from "@/components/common/theme-provider";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const scrolled = useScrollHeader(16);
  const { isOpen: mobileOpen, toggle: toggleMobile, close: closeMobile } = useMobileMenu();
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isSolidHeader = !isHomePage || scrolled;

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
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/clickpointfinal.png"
              alt="Click Point Innovations"
              width={1236}
              height={317}
              priority
              className="h-9 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                
                {/* 1. Services Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[660px] grid-cols-[1.45fr_1fr] gap-4 p-4">
                      {/* Left: Services Grid */}
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

                      {/* Right: Featured Callout Banner */}
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
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-violet-200 transition-colors group text-left"
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
                  <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
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
                  <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex w-[320px] flex-col gap-1 p-3">
                      {COMPANY_DATA.map((c) => {
                        const Icon = c.icon;
                        return (
                          <li key={c.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={c.href}
                                className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-violet-50/90 dark:hover:bg-slate-800/90"
                              >
                                {Icon && (
                                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100/70 dark:bg-slate-800 text-violet-700 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white transition-colors">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                )}
                                <div>
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
                                    <span className="text-[11px] text-ink/60 dark:text-slate-400 leading-tight block">
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

                {/* 4. Journey Link */}
                <NavigationMenuItem>
                  <Link
                    href="/journey"
                    className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                  >
                    Our Journey
                  </Link>
                </NavigationMenuItem>

                {/* 5. Contact Link */}
                <NavigationMenuItem>
                  <Link
                    href="/contact"
                    className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-ink/80 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                  >
                    Contact
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Theme Toggle & Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={(e) => toggleTheme(e)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 dark:bg-slate-800 text-ink dark:text-amber-400 hover:bg-violet-100 dark:hover:bg-slate-700 transition-colors border border-violet-100 dark:border-slate-700 shadow-xs"
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
              onClick={() => setQuickEnquiryOpen(true)}
              className="shadow-md shadow-violet-600/25 font-bold"
            >
              Quick Enquiry
            </Button>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 dark:bg-slate-800 text-ink dark:text-amber-400 hover:bg-violet-100 dark:hover:bg-slate-700 border border-violet-100 dark:border-slate-700 transition-colors"
            onClick={toggleMobile}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 text-violet-700 dark:text-amber-400" /> : <Menu className="h-5 w-5 text-violet-700 dark:text-amber-400" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Left Side-Drawer Overlay & Box */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Backdrop Overlay (Click outside to close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMobile}
              className="fixed inset-0 z-[150] bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm lg:hidden"
            />

            {/* Left Sliding Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[160] w-[310px] max-w-[85vw] bg-white dark:bg-[#131c31] border-r border-violet-100 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between lg:hidden"
            >
              <div>
                {/* Drawer Header: Logo + Close Button */}
                <div className="flex items-center justify-between pb-6 border-b border-violet-100 dark:border-slate-800">
                  <Link href="/" onClick={closeMobile} className="flex items-center">
                    <Image
                      src="/images/clickpointfinal.png"
                      alt="Click Point Innovations"
                      width={1236}
                      height={317}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <button
                    onClick={closeMobile}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 dark:bg-slate-800 text-ink dark:text-white hover:bg-violet-100 dark:hover:bg-slate-700 transition-colors border border-violet-100 dark:border-slate-700"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5 text-violet-700 dark:text-violet-300" />
                  </button>
                </div>

                {/* Drawer Navigation Links */}
                <div className="py-4 space-y-2">
                  <MobileGroup
                    title="Services"
                    onItemClick={closeMobile}
                    items={SERVICES_DATA.map((s) => ({ title: s.title, desc: s.desc, href: `/services/${s.id}`, icon: s.icon }))}
                  />
                  <MobileGroup
                    title="Industries"
                    onItemClick={closeMobile}
                    items={INDUSTRIES_DATA.map((i) => ({ title: i.title, desc: i.subtitle || "", href: i.href || "#", icon: i.icon }))}
                  />
                  <MobileGroup
                    title="Company"
                    onItemClick={closeMobile}
                    items={COMPANY_DATA.map((c) => ({ title: c.title || c.name || "", desc: c.desc || "", badge: c.badge, href: c.href, icon: c.icon }))}
                  />

                  <div className="pt-3 pb-1 border-b border-violet-100 dark:border-slate-800 space-y-1">
                    <Link
                      href="/about"
                      onClick={closeMobile}
                      className="flex items-center justify-between py-2 text-xs font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      <span>About Us</span>
                      <ArrowRight className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                    </Link>
                    <Link
                      href="/testimonials"
                      onClick={closeMobile}
                      className="flex items-center justify-between py-2 text-xs font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      <span>Testimonials</span>
                      <ArrowRight className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                    </Link>
                    <Link
                      href="/faqs"
                      onClick={closeMobile}
                      className="flex items-center justify-between py-2 text-xs font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      <span>FAQs</span>
                      <ArrowRight className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeMobile}
                      className="flex items-center justify-between py-2 text-xs font-bold text-ink dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      <span>Contact Us</span>
                      <ArrowRight className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Controls */}
              <div className="pt-4 border-t border-violet-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink dark:text-white">Appearance Mode</span>
                  <button
                    onClick={(e) => toggleTheme(e)}
                    className="flex items-center gap-2 rounded-full bg-violet-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-ink dark:text-violet-300 border border-violet-100 dark:border-slate-700"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-3.5 w-3.5 text-[#f58220]" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5 text-violet-700" />
                        <span>Night Mode</span>
                      </>
                    )}
                  </button>
                </div>

                <Button
                  variant="primary"
                  className="w-full font-bold shadow-md shadow-violet-600/25"
                  onClick={() => {
                    closeMobile();
                    setQuickEnquiryOpen(true);
                  }}
                >
                  Quick Enquiry
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Interactive Quick Enquiry Modal Popup */}
      <QuickEnquiryModal
        isOpen={quickEnquiryOpen}
        onClose={() => setQuickEnquiryOpen(false)}
      />
    </>
  );
}

interface MobileItem {
  title: string;
  desc?: string;
  badge?: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function MobileGroup({ title, items, onItemClick }: { title: string; items: MobileItem[]; onItemClick?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-violet-100 dark:border-slate-800 py-2 last:border-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-2 text-xs font-bold text-ink dark:text-white"
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          ⌄
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-2 pt-1 space-y-2"
          >
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.title}>
                  <Link
                    href={it.href || "#"}
                    onClick={onItemClick}
                    className="flex items-center gap-2.5 py-1 text-xs text-ink/75 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300 shrink-0" />}
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium text-xs text-ink dark:text-white">{it.title}</span>
                      {it.badge && (
                        <span className="rounded-full bg-violet-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-slate-700">
                          {it.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
