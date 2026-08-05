"use client";

import React from "react";
import Image from "next/image";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  X,
  Archive,
  Star,
  LogOut,
  Mail,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "@/components/common/theme-provider";
import { getTimeAgo } from "../dashboard/nav-config";

interface AdminHeaderProps {
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  userEmail: string;
  unreadTestimonialsCount: number;
  unreadContactCount: number;
  unreadJobAppsCount: number;
  notificationsList: any[];
  showNotificationsDropdown: boolean;
  setShowNotificationsDropdown: (val: boolean) => void;
  handleArchiveAllNotifications: () => void;
  handleMarkSingleRead: (item: any) => void;
  handleLogout: () => void;
}

export function AdminHeader({
  mobileOpen,
  setMobileOpen,
  searchQuery,
  setSearchQuery,
  userEmail,
  unreadTestimonialsCount,
  unreadContactCount,
  unreadJobAppsCount,
  notificationsList,
  showNotificationsDropdown,
  setShowNotificationsDropdown,
  handleArchiveAllNotifications,
  handleMarkSingleRead,
  handleLogout,
}: AdminHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const totalUnreadCount = unreadTestimonialsCount + unreadContactCount + unreadJobAppsCount;

  return (
    <header className="h-16 shrink-0 bg-white dark:bg-[#131927] border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Search Input & Mobile Drawer Button */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0 transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-[200px] sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search page content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] pl-8 sm:pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Notifications, User Profile & Sign Out */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Theme Toggle Button */}
        <button
          onClick={(e) => toggleTheme(e)}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>

        {/* Notifications Button & Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none"
            aria-label="Notifications"
            title={totalUnreadCount > 0 ? `${totalUnreadCount} Unread Notifications` : "Notifications"}
          >
            <Bell className="h-4 w-4" />
            {totalUnreadCount > 0 ? (
              <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] sm:text-[11px] font-black text-white shadow-md border-2 border-white dark:border-[#131927]">
                {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            )}
          </button>

          {showNotificationsDropdown && (
            <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Notifications
                    </h4>
                    <p className="text-[10px] text-slate-400">Real-time client reviews & lead alerts</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {notificationsList.length > 0 && (
                    <button
                      onClick={handleArchiveAllNotifications}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Archive className="h-3 w-3" />
                      <span>Archive All</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 [scrollbar-width:thin]">
                {notificationsList.length === 0 ? (
                  <div className="text-center py-10 px-4 space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <Archive className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      No unread notifications
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                      All reviews, client inquiries, and job applications have been read.
                    </p>
                  </div>
                ) : (
                  notificationsList.map((item) => {
                    const isReview = (item.category || item.type) === "REVIEW";
                    const isJobApp = (item.category || item.type) === "JOB_APPLICATION";

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleMarkSingleRead(item)}
                        className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group flex items-start gap-3"
                      >
                        {/* Type Icon Pill */}
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${
                            isReview
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : isJobApp
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {isReview ? (
                            <Star className="h-4 w-4 fill-amber-400" />
                          ) : isJobApp ? (
                            <Briefcase className="h-4 w-4" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </div>

                        {/* Content Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {item.clientName}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                              {getTimeAgo(item.createdAt)}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.content}
                          </p>

                          <div className="mt-1.5 flex items-center justify-between text-[10px]">
                            <span
                              className={`font-bold px-2 py-0.5 rounded-full ${
                                isReview
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                                  : isJobApp
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                              }`}
                            >
                              {isReview
                                ? "Client Review"
                                : isJobApp
                                ? "Candidate Applied"
                                : "Lead Inquiry"}
                            </span>

                            <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-0.5">
                              Read & Review →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Sign Out */}
        <div className="flex items-center gap-1.5 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Image
              src="/images/fav3.png"
              alt="Clickpoint Innovation"
              width={100}
              height={100}
              priority
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform hover:scale-110"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[110px] sm:max-w-[130px]">
                {userEmail}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">Super Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
