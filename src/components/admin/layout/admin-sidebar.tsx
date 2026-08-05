"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getNavItems } from "../dashboard/nav-config";

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedSectionId: (id: string | null) => void;
  unreadTestimonialsCount: number;
  unreadContactCount: number;
  unreadJobAppsCount: number;
}

export function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  activeTab,
  setActiveTab,
  setSelectedSectionId,
  unreadTestimonialsCount,
  unreadContactCount,
  unreadJobAppsCount,
}: AdminSidebarProps) {
  const navItems = getNavItems(
    unreadTestimonialsCount,
    unreadContactCount,
    unreadJobAppsCount
  );

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 dark:bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-[#131927] border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Sidebar Header & Brand Logo */}
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
            className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items List */}
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
                          <div className="flex-1 flex items-center justify-between overflow-hidden text-left">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`ml-2 rounded-full px-2 py-0.5 text-[9px] font-extrabold shrink-0 ${
                                  item.id === "testimonials-page"
                                    ? "bg-amber-500 text-white animate-pulse shadow-sm"
                                    : item.id === "job-applied"
                                    ? "bg-emerald-500 text-white animate-pulse shadow-sm"
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

        {/* Desktop Collapsed Toggle */}
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
    </>
  );
}
