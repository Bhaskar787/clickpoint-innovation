"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  HelpCircle,
  FolderGit2,
  LayoutTemplate,
  GripVertical,
  Edit3,
  Eye,
  Check,
  Globe,
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
  Settings,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import AboutPageEditor from "./about-page-editor";
import ServicesPageEditor from "./services-page-editor";
import IndustriesPageEditor from "./industries-page-editor";
import ContactEditor from "./contact-editor";
import TestimonialsEditor from "./testimonials-editor";
import JourneyEditor from "./journey-editor";
import NotFoundPageEditor from "./not-found-page-editor";
import CareersPageEditor from "./careers-page-editor";
import FaqEditor from "./faq-editor";
import JobApplicationsView from "./job-applications-view";
import CaseStudiesEditor from "./case-studies-editor";
import SettingsEditor from "./settings-editor";

import { subscribeRealtimeNotifications, playNotificationSound } from "@/lib/realtime-notifications";
import { ALL_PAGE_CONFIGS } from "@/components/admin/dashboard/nav-config";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { OverviewTab } from "@/components/admin/dashboard/overview-tab";

interface AdminDashboardClientProps {
  userEmail: string;
}

export default function AdminDashboardClient({ userEmail }: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [unreadTestimonialsCount, setUnreadTestimonialsCount] = useState<number>(0);
  const [unreadContactCount, setUnreadContactCount] = useState<number>(0);
  const [unreadJobAppsCount, setUnreadJobAppsCount] = useState<number>(0);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState<boolean>(false);
  const [selectedNotificationItemId, setSelectedNotificationItemId] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const prevUnreadCountRef = useRef<number>(0);
  const prevContactCountRef = useRef<number>(0);
  const prevJobAppsCountRef = useRef<number>(0);
  const optimisticallyReadIds = useRef<Set<string>>(new Set());

  const handleItemMarkedRead = (id: string, category: string) => {
    if (!id) return;
    if (optimisticallyReadIds.current.has(id)) return;

    optimisticallyReadIds.current.add(id);

    const isReview = category === "REVIEW";
    const isJobApp = category === "JOB_APPLICATION";

    if (isReview) {
      setUnreadTestimonialsCount((prev) => Math.max(0, prev - 1));
    } else if (isJobApp) {
      setUnreadJobAppsCount((prev) => Math.max(0, prev - 1));
    } else {
      setUnreadContactCount((prev) => Math.max(0, prev - 1));
    }

    setNotificationsList((prev) => prev.filter((n) => n.id !== id));
  };

  const processedNotificationIds = useRef<Set<string>>(new Set());

  const triggerRealtimeNotification = (data: any) => {
    if (!data || !data.id) return;
    if (optimisticallyReadIds.current.has(data.id)) return;
    if (processedNotificationIds.current.has(data.id)) return; // Prevent duplicate toast popups

    processedNotificationIds.current.add(data.id);

    const isJobApp = data.type === "JOB_APPLICATION" || data.category === "JOB_APPLICATION";
    const isReview = data.type === "REVIEW" || data.category === "REVIEW";
    const isContact =
      data.type === "CONTACT" ||
      data.type === "QUICK_INQUIRY" ||
      data.type === "INQUIRY" ||
      data.category === "CONTACT" ||
      data.category === "QUICK_INQUIRY" ||
      data.category === "INQUIRY";

    if (isReview) {
      setUnreadTestimonialsCount((prev) => prev + 1);
    } else if (isContact) {
      setUnreadContactCount((prev) => prev + 1);
    } else if (isJobApp) {
      setUnreadJobAppsCount((prev) => prev + 1);
    }

    const newItem = {
      id: data.id,
      type: isJobApp ? "JOB_APPLICATION" : isReview ? "REVIEW" : "INQUIRY",
      category: isJobApp ? "JOB_APPLICATION" : isReview ? "REVIEW" : "INQUIRY",
      clientName: data.clientName || "New Submission",
      content: data.content || data.subtext || "New notification received",
      rating: data.rating,
      createdAt: data.createdAt || new Date().toISOString(),
      read: false,
    };

    setNotificationsList((prev) => {
      if (prev.some((n) => n.id === data.id)) return prev;
      return [newItem, ...prev];
    });

    // Play Web Audio notification chime sound (uses user's selected ringtone sound)
    playNotificationSound();

    // Display Category-Specific Color-Themed Toast UI
    if (isReview) {
      toast.custom(
        (t) => (
          <div className="w-full max-w-md bg-white dark:bg-[#131927] border-2 border-amber-400 dark:border-amber-500/70 rounded-2xl p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
              <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Client Feedback Review
                </span>
                <button onClick={() => toast.dismiss(t)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1">
                  ✕
                </button>
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1 truncate">
                {data.clientName || "Client"} {data.rating ? `(${data.rating}★)` : ""}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                {data.content || data.subtext || "Submitted new review"}
              </p>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  setActiveTab("testimonials-page");
                  setSelectedNotificationItemId(newItem.id);
                }}
                className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 text-[11px] font-extrabold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-xs transition-all cursor-pointer"
              >
                <span>View Review →</span>
              </button>
            </div>
          </div>
        ),
        { duration: 8000 }
      );
    } else if (isJobApp) {
      toast.custom(
        (t) => (
          <div className="w-full max-w-md bg-white dark:bg-[#131927] border-2 border-emerald-500 dark:border-emerald-500/70 rounded-2xl p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600" />
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
              <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Candidate Applied
                </span>
                <button onClick={() => toast.dismiss(t)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1">
                  ✕
                </button>
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1 truncate">
                {data.clientName || "Candidate"}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                {data.subtext || data.content || "Applied for engineering position"}
              </p>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  setActiveTab("job-applied");
                  setSelectedNotificationItemId(newItem.id);
                }}
                className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 text-[11px] font-extrabold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <span>View Application →</span>
              </button>
            </div>
          </div>
        ),
        { duration: 8000 }
      );
    } else {
      toast.custom(
        (t) => (
          <div className="w-full max-w-md bg-white dark:bg-[#131927] border-2 border-blue-500 dark:border-blue-500/70 rounded-2xl p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400" />
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {data.type === "QUICK_INQUIRY" || data.category === "QUICK_INQUIRY" ? "Quick Lead Inquiry" : "Contact Lead Inquiry"}
                </span>
                <button onClick={() => toast.dismiss(t)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1">
                  ✕
                </button>
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1 truncate">
                {data.clientName || "Visitor"}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                {data.content || data.subtext || "Submitted contact inquiry"}
              </p>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  setActiveTab("contact-inquiries");
                  setSelectedNotificationItemId(newItem.id);
                }}
                className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 text-[11px] font-extrabold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <span>View Inquiry →</span>
              </button>
            </div>
          </div>
        ),
        { duration: 8000 }
      );
    }
  };

  // Poll unread counts for testimonials, contact inquiries, and job applications via unified Notification API
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const res = await fetch("/api/notifications").then((r) => r.json()).catch(() => ({}));

        if (res?.success) {
          const rawNotifications = res.notifications || [];
          
          // Filter out any notifications optimistically marked read by admin
          const validNotifications = rawNotifications.filter(
            (n: any) => !optimisticallyReadIds.current.has(n.id)
          );

          if (isInitialMount.current) {
            isInitialMount.current = false;
            // Record existing unread IDs so initial page load doesn't trigger toast popups for old unread items
            validNotifications.forEach((n: any) => {
              if (n.id) processedNotificationIds.current.add(n.id);
            });
          } else {
            // Trigger toast + sound alert for any new unread item detected in DB poll
            validNotifications.forEach((n: any) => {
              if (n.id && !processedNotificationIds.current.has(n.id)) {
                triggerRealtimeNotification(n);
              }
            });
          }

          const testUnread = validNotifications.filter((n: any) => n.category === "REVIEW").length;
          const contactUnread = validNotifications.filter((n: any) => n.category === "CONTACT" || n.category === "QUICK_INQUIRY").length;
          const appsUnread = validNotifications.filter((n: any) => n.category === "JOB_APPLICATION").length;

          setUnreadTestimonialsCount(testUnread);
          setUnreadContactCount(contactUnread);
          setUnreadJobAppsCount(appsUnread);

          const items = validNotifications.map((n: any) => ({
            id: n.id,
            type: n.category === "CONTACT" || n.category === "QUICK_INQUIRY" ? "INQUIRY" : n.category,
            category: n.category,
            clientName: n.clientName || "System Alert",
            content: n.content || n.subtext || n.title,
            rating: n.rating,
            createdAt: n.createdAt,
            read: n.isRead,
            targetTab: n.targetTab,
          }));

          setNotificationsList(items);

          prevUnreadCountRef.current = testUnread;
          prevContactCountRef.current = contactUnread;
          prevJobAppsCountRef.current = appsUnread;
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 4000);
    return () => clearInterval(interval);
  }, []);

  // Realtime Notifications Subscription (BroadcastChannel + SSE Stream)
  useEffect(() => {
    const unsubscribe = subscribeRealtimeNotifications((data: any) => {
      triggerRealtimeNotification(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/admin/login");
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedSectionId(null);
    setMobileOpen(false);
  };

  const handleMarkSingleRead = (item: any) => {
    // 1. INSTANT UI UPDATE (0ms) - Immediate state updates for bell icon and sidebar badges
    const category = item.category || item.type;
    handleItemMarkedRead(item.id, category);

    setSelectedNotificationItemId(item.id);
    setShowNotificationsDropdown(false);

    if (category === "REVIEW") {
      setActiveTab("testimonials-page");
    } else if (category === "JOB_APPLICATION") {
      setActiveTab("job-applied");
    } else {
      setActiveTab("contact-inquiries");
    }

    toast.success("Notification marked as read");

    // 2. Async background DB persistence (fire & forget)
    fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-read", id: item.id, category }),
    }).catch((err) => console.error("Error updating notification status", err));
  };

  const handleArchiveAllNotifications = () => {
    // 1. INSTANT UI UPDATE (0ms)
    setNotificationsList([]);
    setUnreadTestimonialsCount(0);
    setUnreadContactCount(0);
    setUnreadJobAppsCount(0);
    setShowNotificationsDropdown(false);
    toast.success("Archived all notifications");

    // 2. Async background DB persistence
    fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive-all" }),
    }).catch((err) => console.error("Error archiving notifications", err));
  };

  const currentPageConfig = ALL_PAGE_CONFIGS[activeTab] || ALL_PAGE_CONFIGS["landing-management"];
  const selectedSection = currentPageConfig?.sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f8f9fa] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      
      {/* 1. SIDEBAR COMPONENT */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        setSelectedSectionId={setSelectedSectionId}
        unreadTestimonialsCount={unreadTestimonialsCount}
        unreadContactCount={unreadContactCount}
        unreadJobAppsCount={unreadJobAppsCount}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col h-screen min-w-0 w-full overflow-hidden transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        
        {/* Top Fixed Navbar Header */}
        <AdminHeader
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userEmail={userEmail}
          unreadTestimonialsCount={unreadTestimonialsCount}
          unreadContactCount={unreadContactCount}
          unreadJobAppsCount={unreadJobAppsCount}
          notificationsList={notificationsList}
          showNotificationsDropdown={showNotificationsDropdown}
          setShowNotificationsDropdown={setShowNotificationsDropdown}
          handleArchiveAllNotifications={handleArchiveAllNotifications}
          handleMarkSingleRead={handleMarkSingleRead}
          handleLogout={handleLogout}
        />

        {/* Dashboard Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-6 space-y-4 sm:space-y-6 min-w-0 w-full [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.3)_transparent]">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <OverviewTab
              unreadContactCount={unreadContactCount}
              unreadJobAppsCount={unreadJobAppsCount}
              unreadTestimonialsCount={unreadTestimonialsCount}
              setActiveTab={handleSelectTab}
            />
          )}

          {/* Job Applied Applications */}
          {activeTab === "job-applied" && (
            <div className="mt-2">
              <JobApplicationsView
                selectedItemId={selectedNotificationItemId}
                onClearSelectedItem={() => setSelectedNotificationItemId(null)}
                onMarkItemRead={handleItemMarkedRead}
              />
            </div>
          )}

          {/* System Settings & Notification Audio Preferences Tab */}
          {activeTab === "system-settings" && (
            <div className="mt-2">
              <SettingsEditor />
            </div>
          )}

          {/* DYNAMIC PAGE CONTENT MANAGEMENT VIEW */}
          {currentPageConfig && activeTab !== "dashboard" && activeTab !== "job-applied" && activeTab !== "system-settings" && (
            <div className="space-y-6">
              {/* Page Title Header */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                      Live Section Editor
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {currentPageConfig.sections.length} Sections Configured
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {currentPageConfig.title}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
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
                        : activeTab === "contact-page" || activeTab === "contact-inquiries"
                        ? "/contact"
                        : "/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-blue-500" />
                    <span>Preview Live Page</span>
                  </a>
                </div>
              </div>

              {/* Sub-Editors rendering */}
              {activeTab === "about-page" ? (
                <AboutPageEditor sectionId={selectedSectionId} onCloseSection={() => setSelectedSectionId(null)} />
              ) : activeTab === "services-page" ? (
                <ServicesPageEditor sectionId={selectedSectionId} onCloseSection={() => setSelectedSectionId(null)} />
              ) : activeTab === "industries-page" ? (
                <IndustriesPageEditor sectionId={selectedSectionId} onCloseSection={() => setSelectedSectionId(null)} />
              ) : activeTab === "case-studies-page" ? (
                <CaseStudiesEditor />
              ) : activeTab === "journey-page" ? (
                <JourneyEditor />
              ) : activeTab === "careers-page" ? (
                <CareersPageEditor sectionId={selectedSectionId} onCloseSection={() => setSelectedSectionId(null)} />
              ) : activeTab === "faqs-page" ? (
                <FaqEditor sectionId={selectedSectionId} onCloseSection={() => setSelectedSectionId(null)} />
              ) : activeTab === "testimonials-page" ? (
                <TestimonialsEditor
                  sectionId={selectedSectionId}
                  selectedItemId={selectedNotificationItemId}
                  onCloseSection={() => setSelectedSectionId(null)}
                  onClearSelectedItem={() => setSelectedNotificationItemId(null)}
                  onMarkItemRead={handleItemMarkedRead}
                />
              ) : activeTab === "contact-page" || activeTab === "contact-inquiries" || activeTab === "contact-inquiries-leads" ? (
                <ContactEditor
                  sectionId={selectedSectionId}
                  selectedItemId={selectedNotificationItemId}
                  onCloseSection={() => setSelectedSectionId(null)}
                  onClearSelectedItem={() => setSelectedNotificationItemId(null)}
                  onMarkItemRead={handleItemMarkedRead}
                />
              ) : activeTab === "not-found-page" ? (
                <NotFoundPageEditor />
              ) : (
                /* Landing Page or Default Section Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentPageConfig.sections.map((section) => {
                    const Icon = section.icon;
                    const isSelected = selectedSectionId === section.id;
                    return (
                      <div
                        key={section.id}
                        onClick={() => setSelectedSectionId(isSelected ? null : section.id)}
                        className={`rounded-2xl border bg-white dark:bg-[#131927] p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between ${
                          isSelected
                            ? "border-blue-500 ring-2 ring-blue-500/20"
                            : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-slate-400">
                              {section.order}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {section.category}
                            </span>
                          </div>

                          <div className="mt-3 flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {section.name}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                {section.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-400">{section.fieldsCount} Fields</span>
                          <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Configure <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
