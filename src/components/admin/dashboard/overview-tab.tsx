"use client";

import React, { useState } from "react";
import {
  Briefcase,
  MessageSquare,
  FileText,
  Star,
  BarChart3,
  TrendingUp,
  Grid,
  Clock,
  Eye,
  LayoutTemplate,
  Layers,
  Quote,
  ArrowUpRight,
  Cpu,
} from "lucide-react";
import { RECENT_INQUIRIES } from "./nav-config";

interface OverviewTabProps {
  unreadContactCount: number;
  unreadJobAppsCount: number;
  unreadTestimonialsCount: number;
  setActiveTab: (tab: string) => void;
}

export function OverviewTab({
  unreadContactCount,
  unreadJobAppsCount,
  unreadTestimonialsCount,
  setActiveTab,
}: OverviewTabProps) {
  const [dashboardTimeRange, setDashboardTimeRange] = useState<"7d" | "30d" | "year">("7d");
  const [overviewMetricTab, setOverviewMetricTab] = useState<"inquiries" | "applications" | "pipeline">("inquiries");

  return (
    <div className="space-y-6">
      {/* Top Operational Welcome Banner & Controls */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                System Live & Synchronized
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Admin Workspace
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Admin</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Real-time overview of incoming candidate applications, client inquiries, active project pipelines, and content engine status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Time Range Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setDashboardTimeRange("7d")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dashboardTimeRange === "7d"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDashboardTimeRange("30d")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dashboardTimeRange === "30d"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setDashboardTimeRange("year")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dashboardTimeRange === "year"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                This Year
              </button>
            </div>

            <button
              onClick={() => setActiveTab("job-applied")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Briefcase className="h-4 w-4" />
              <span>Manage Applications</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Dynamic Glassmorphic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Client Inquiries */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Client Inquiries
            </span>
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {unreadContactCount > 0 ? unreadContactCount : 57}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
              <TrendingUp className="h-3 w-3" />
              +18.4%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Awaiting lead response & follow-up
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Response Rate</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">98.2% (Under 2h)</span>
          </div>
        </div>

        {/* Card 2: Candidate Applications */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Candidate Resumes
            </span>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {unreadJobAppsCount > 0 ? unreadJobAppsCount : 24}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
              <TrendingUp className="h-3 w-3" />
              +24.1%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Live candidate applications pool
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Open Vacancies</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">8 Positions Active</span>
          </div>
        </div>

        {/* Card 3: Testimonials & Feedback */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Client Reviews
            </span>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {unreadTestimonialsCount > 0 ? unreadTestimonialsCount : 18}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/40">
              4.9 ★ Rating
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified client satisfaction score
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Five Star Ratio</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">96% Positive</span>
          </div>
        </div>

        {/* Card 4: Estimated Pipeline Value */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Pipeline
            </span>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              $64,800
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/40">
              <TrendingUp className="h-3 w-3" />
              +31.2%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Qualified enterprise project pipeline
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Deal Win Rate</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">78.5% Conversion</span>
          </div>
        </div>
      </div>

      {/* Analytics & Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): Main Performance Growth Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Inquiries & Growth Trajectory
              </h3>
              <p className="text-xs text-slate-400">Visual breakdown of incoming inquiries and client conversion</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setOverviewMetricTab("inquiries")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  overviewMetricTab === "inquiries"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Inquiries
              </button>
              <button
                onClick={() => setOverviewMetricTab("applications")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  overviewMetricTab === "applications"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setOverviewMetricTab("pipeline")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  overviewMetricTab === "pipeline"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Revenue
              </button>
            </div>
          </div>

          {/* SVG Chart Container */}
          <div className="w-full h-56 sm:h-64 my-2 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeWidth="1" />

              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d="M 0,140 Q 80,60 160,90 T 320,40 T 500,80 L 500,190 L 0,190 Z"
                fill="url(#primaryGradient)"
              />

              {/* Line 1 */}
              <path
                d="M 0,140 Q 80,60 160,90 T 320,40 T 500,80"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Line 2 (Dashed comparison) */}
              <path
                d="M 0,160 Q 80,110 160,120 T 320,80 T 500,110"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5 5"
              />

              {/* Highlight Points */}
              <circle cx="320" cy="40" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="3" className="shadow-lg" />
              <circle cx="160" cy="90" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="font-semibold">Mon</span>
            <span className="font-semibold">Tue</span>
            <span className="font-semibold">Wed</span>
            <span className="font-semibold">Thu</span>
            <span className="font-semibold">Fri</span>
            <span className="font-semibold">Sat</span>
            <span className="font-semibold">Sun</span>
          </div>

          {/* Summary Metric Footer */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Avg Response</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">1.4 Hours</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Conversion</p>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">36.8%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Active Deals</p>
              <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">42 Closed</p>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): Services Demand Breakdown & System Health */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Service Category Demand Breakdown */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Service Category Demand</h4>
                <p className="text-[11px] text-slate-400">Breakdown of incoming client requests</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                Live Metrics
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Web Applications & Next.js</span>
                  <span className="text-blue-600 dark:text-blue-400">42%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-[42%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Mobile Apps (iOS / Android)</span>
                  <span className="text-emerald-600 dark:text-emerald-400">28%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[28%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Cloud DevOps & Infrastructure</span>
                  <span className="text-violet-600 dark:text-violet-400">18%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-violet-500 h-full rounded-full w-[18%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">AI Logic & Automation</span>
                  <span className="text-amber-600 dark:text-amber-400">12%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[12%]" />
                </div>
              </div>
            </div>
          </div>

          {/* System Infrastructure Health Card */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Infrastructure Health
                </h4>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                All Systems Operational
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold">UPTIME</p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mt-1">99.98%</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold">LATENCY</p>
                <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-1">38ms</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold">STORAGE</p>
                <p className="text-xs font-extrabold text-violet-600 dark:text-violet-400 mt-1">Cloudinary</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Grid className="h-4 w-4 text-blue-600" />
          Quick Management Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab("job-applied")}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Job Applications</p>
                <p className="text-[10px] text-slate-400">Review candidate resumes</p>
              </div>
            </div>
            {unreadJobAppsCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500 text-white rounded-full">
                {unreadJobAppsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("landing-management")}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LayoutTemplate className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Landing Page</p>
                <p className="text-[10px] text-slate-400">Dynamic 12 sec hero</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={() => setActiveTab("services-page")}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Services Pages</p>
                <p className="text-[10px] text-slate-400">Service offerings editor</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
          </button>

          <button
            onClick={() => setActiveTab("testimonials-page")}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Quote className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Client Reviews</p>
                <p className="text-[10px] text-slate-400">Testimonials & ratings</p>
              </div>
            </div>
            {unreadTestimonialsCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-white rounded-full animate-pulse">
                {unreadTestimonialsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Latest Inquiries & Candidate Submissions Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Recent Inquiries & Deals Pipeline
            </h3>
            <p className="text-xs text-slate-400">Real-time prospective client contacts and inquiry submissions</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("contact-inquiries")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View All Inquiries</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                <th className="py-3 px-4">INQUIRY ID</th>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">SERVICE CATEGORY</th>
                <th className="py-3 px-4">ESTIMATED BUDGET</th>
                <th className="py-3 px-4">RATING</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {RECENT_INQUIRIES.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{item.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {item.client.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">{item.client}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">{item.service}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white whitespace-nowrap">{item.budget}</td>
                  <td className="py-3.5 px-4 text-amber-500 font-bold whitespace-nowrap">{item.rating}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveTab("contact-inquiries")}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      Review →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
