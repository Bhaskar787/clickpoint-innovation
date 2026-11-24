"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  LayoutDashboard,
  BarChart2,
  FolderGit2,
  Users,
  Crown,
  TrendingUp,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroTabletMockupProps {
  imageUrl?: string;
  className?: string;
}

export function HeroTabletMockup({ imageUrl, className }: HeroTabletMockupProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative mx-auto w-full max-w-[580px] py-6 select-none", className)}
      style={{ perspective: 1200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Ambient Floor Glow Underneath (Luminous in Light Mode, Radiant Neon in Dark Mode) */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.7 : 0.45,
          scale: isHovered ? 1.06 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 w-[88%] h-16 bg-gradient-to-r from-violet-500/20 via-indigo-500/25 to-purple-500/15 dark:from-violet-600/50 dark:via-indigo-500/60 dark:to-purple-600/40 blur-2xl dark:blur-3xl rounded-[100%]"
        aria-hidden="true"
      />

      {/* 2. Soft Floor Contact Shadow (Grounds the 3D tablet cleanly without muddy dark blotches) */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.45 : 0.65,
          scaleX: isHovered ? 0.94 : 1,
          scaleY: isHovered ? 0.9 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 w-[82%] h-6 bg-slate-900/15 dark:bg-black/75 blur-md dark:blur-xl rounded-[100%]"
        aria-hidden="true"
      />

      {/* 3. Tilted 3D Tablet Shell with Physical Unibody Thickness & Tactile Buttons */}
      <motion.div
        animate={{
          rotateX: isHovered ? 0 : 12,
          rotateY: isHovered ? 0 : -16,
          rotateZ: isHovered ? 0 : 2.5,
          scale: isHovered ? 1.03 : 1,
          y: isHovered ? -10 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
          mass: 0.8,
        }}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className={cn(
          "relative w-full rounded-[28px] sm:rounded-[36px] p-2 sm:p-2.5 transition-shadow duration-500 ease-out cursor-pointer",
          // Outer Unibody Aluminum / Titanium Frame (Silver in Light Mode, Space Gray in Dark Mode)
          "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-[#2e374d] dark:via-[#1c2235] dark:to-[#0f1424]",
          "border border-slate-300/80 dark:border-white/15",
          "ring-1 ring-white/90 dark:ring-white/10",
          isHovered ? "tablet-3d-straight" : "tablet-3d-tilted"
        )}
      >
        {/* Physical Hardware Power Button on Top Rim */}
        <div className="absolute -top-[5px] right-14 w-12 h-[5px] rounded-t-[3px] bg-gradient-to-r from-slate-300 via-slate-200 to-slate-400 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 border-t border-x border-slate-400/60 dark:border-white/20 shadow-xs pointer-events-none" />

        {/* Physical Hardware Volume Rockers on Right Rim */}
        <div className="absolute -right-[5px] top-16 w-[5px] h-10 rounded-r-[3px] bg-gradient-to-b from-slate-300 via-slate-200 to-slate-400 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 border-r border-y border-slate-400/60 dark:border-white/20 shadow-xs pointer-events-none" />
        <div className="absolute -right-[5px] top-28 w-[5px] h-10 rounded-r-[3px] bg-gradient-to-b from-slate-300 via-slate-200 to-slate-400 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 border-r border-y border-slate-400/60 dark:border-white/20 shadow-xs pointer-events-none" />

        {/* Subtle Antenna Seam Insets */}
        <div className="absolute top-0 left-16 w-[1.5px] h-2 bg-slate-400/40 dark:bg-slate-600/50 pointer-events-none" />
        <div className="absolute bottom-0 right-16 w-[1.5px] h-2 bg-slate-400/40 dark:bg-slate-600/50 pointer-events-none" />

        {/* Inner Screen Display Glass Housing & Bezel */}
        <div className="relative aspect-[16/11] w-full rounded-[20px] sm:rounded-[28px] overflow-hidden bg-slate-100 dark:bg-[#070913] border border-slate-200 dark:border-white/[0.08] shadow-[inset_0_0_12px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.35)]">
          {/* Precision Front Camera & TrueDepth Sensor Array */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-none">
            {/* Ambient sensor dot */}
            <div className="w-1 h-1 rounded-full bg-slate-400/80 dark:bg-white/10" />
            {/* Main Camera lens with optical blue/cyan coating glare */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-400/60 dark:border-white/15 flex items-center justify-center shadow-xs">
              <div className="w-1 h-1 rounded-full bg-indigo-400/60 blur-[0.2px]" />
            </div>
          </div>

          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Studio Showcase"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent dark:from-slate-950/40 pointer-events-none" />
            </>
          ) : (
            /* High-End Analytics Dashboard UI (Gracefully supports Light & Dark Mode) */
            <div className="h-full w-full flex bg-slate-50 dark:bg-[#0c1022] text-slate-800 dark:text-white font-sans text-xs select-none overflow-hidden pt-4 sm:pt-5">
              {/* Left Mini Sidebar */}
              <div className="w-[24%] border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#090d1c] p-2.5 flex flex-col justify-between">
                <div>
                  {/* Brand App Icon */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-600 via-indigo-600 to-amber-500 flex items-center justify-center p-1 shadow-xs">
                      <Activity className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-bold tracking-tight text-[11px] text-slate-900 dark:text-white hidden sm:inline">
                      Clickpoint
                    </span>
                  </div>

                  {/* Nav items */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-violet-50 text-violet-700 dark:bg-violet-600/20 dark:text-violet-300 font-semibold text-[10px]">
                      <LayoutDashboard className="h-3 w-3" />
                      <span className="hidden sm:inline">Overview</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[10px] transition-colors">
                      <BarChart2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Analytics</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[10px] transition-colors">
                      <FolderGit2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Projects</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[10px] transition-colors">
                      <Users className="h-3 w-3" />
                      <span className="hidden sm:inline">Clients</span>
                    </div>
                  </div>
                </div>

                {/* Pro Pill badge */}
                <div className="rounded-md bg-gradient-to-r from-violet-500/10 to-amber-500/10 dark:from-violet-500/15 dark:to-amber-500/15 border border-violet-200 dark:border-white/[0.08] p-1.5 text-center">
                  <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-violet-700 dark:text-amber-400">
                    <Crown className="h-2.5 w-2.5" />
                    <span className="hidden sm:inline">Enterprise</span>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Panel */}
              <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-slate-50/50 dark:bg-transparent">
                {/* Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 bg-white dark:bg-[#11172e] px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/[0.08] text-[10px] text-slate-400 w-36">
                    <Search className="h-2.5 w-2.5 text-slate-400" />
                    <span className="truncate">Search stats...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-white dark:bg-[#11172e] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-500 dark:text-slate-400 relative">
                      <Bell className="h-3 w-3" />
                      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-violet-600" />
                    </div>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-bold flex items-center justify-center text-[9px]">
                      CP
                    </div>
                  </div>
                </div>

                {/* Metric Cards Row */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="p-2 rounded-md bg-white dark:bg-[#11172e]/80 border border-slate-200 dark:border-white/[0.06] shadow-2xs">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 block">Projects</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">124</span>
                      <span className="text-[8px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">+12%</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-md bg-white dark:bg-[#11172e]/80 border border-slate-200 dark:border-white/[0.06] shadow-2xs">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 block">Clients</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">98</span>
                      <span className="text-[8px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">+8%</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-md bg-white dark:bg-[#11172e]/80 border border-slate-200 dark:border-white/[0.06] shadow-2xs">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 block">Growth</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">+34.2%</span>
                      <TrendingUp className="h-2.5 w-2.5 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                </div>

                {/* Interactive Wave Chart */}
                <div className="relative mt-2 p-2 rounded-md bg-white dark:bg-[#11172e]/60 border border-slate-200 dark:border-white/[0.06] flex-1 flex flex-col justify-end shadow-2xs">
                  <div className="absolute top-2 right-4 px-2 py-0.5 rounded-sm bg-violet-600 text-white font-bold text-[9px] shadow-xs flex items-center gap-1 z-10 animate-bounce duration-1000">
                    <span>+24.8%</span>
                  </div>

                  <div className="relative w-full h-16">
                    <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 10,85 C 40,85 55,75 75,75 C 95,75 115,62 135,62 C 155,62 175,70 195,70 C 220,70 235,45 255,45 C 275,45 285,25 295,25 L 295,100 L 10,100 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M 10,85 C 40,85 55,75 75,75 C 95,75 115,62 135,62 C 155,62 175,70 195,70 C 220,70 235,45 255,45 C 275,45 285,25 295,25"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="10" cy="85" r="3" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" />
                      <circle cx="75" cy="75" r="3" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" />
                      <circle cx="135" cy="62" r="3" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" />
                      <circle cx="195" cy="70" r="3" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" />
                      <circle cx="255" cy="45" r="3" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" />
                      <circle cx="295" cy="25" r="3.5" fill="#ffffff" stroke="#7c3aed" strokeWidth="2.5" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[8px] text-slate-400 dark:text-slate-500 font-mono mt-1 px-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Screen Glass Diagonal Specular Sheen (Real Glass Reflection) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.14] dark:via-white/[0.02] dark:to-white/[0.07]" />
        </div>
      </motion.div>
    </div>
  );
}
