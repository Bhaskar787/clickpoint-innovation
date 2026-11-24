"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabletFrameProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  showCamera?: boolean;
  showButtons?: boolean;
  showGlare?: boolean;
  aspectRatio?: string;
  outerBorderRadius?: string;
  innerBorderRadius?: string;
}

export function TabletFrame({
  children,
  className,
  innerClassName,
  showCamera = true,
  showButtons = true,
  showGlare = true,
  aspectRatio = "aspect-[16/10]",
  outerBorderRadius = "rounded-[28px] sm:rounded-[36px]",
  innerBorderRadius = "rounded-[20px] sm:rounded-[28px]",
}: TabletFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full p-2 sm:p-2.5 transition-all duration-300",
        // Outer Unibody Aluminum / Titanium Frame (Satin Silver in Light Mode, Space Gray in Dark Mode)
        "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-[#2e374d] dark:via-[#1c2235] dark:to-[#0f1424]",
        "border border-slate-300/80 dark:border-white/15",
        "ring-1 ring-white/90 dark:ring-white/10",
        outerBorderRadius,
        className
      )}
    >
      {/* Physical Hardware Buttons */}
      {showButtons && (
        <>
          {/* Power Button on Top Rim */}
          <div className="absolute -top-[5px] right-14 w-12 h-[5px] rounded-t-[3px] bg-gradient-to-r from-slate-300 via-slate-200 to-slate-400 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 border-t border-x border-slate-400/60 dark:border-white/20 shadow-xs pointer-events-none z-30" />

          {/* Volume Rockers on Right Rim */}
          <div className="absolute -right-[5px] top-16 w-[5px] h-10 rounded-r-[3px] bg-gradient-to-b from-slate-300 via-slate-200 to-slate-400 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 border-r border-y border-slate-400/60 dark:border-white/20 shadow-xs pointer-events-none z-30" />
          <div className="absolute -right-[5px] top-28 w-[5px] h-10 rounded-r-[3px] bg-gradient-to-b from-slate-300 via-slate-200 to-slate-400 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 border-r border-y border-slate-400/60 dark:border-white/20 shadow-xs pointer-events-none z-30" />

          {/* Subtle Antenna Seam Insets */}
          <div className="absolute top-0 left-16 w-[1.5px] h-2 bg-slate-400/40 dark:bg-slate-600/50 pointer-events-none z-30" />
          <div className="absolute bottom-0 right-16 w-[1.5px] h-2 bg-slate-400/40 dark:bg-slate-600/50 pointer-events-none z-30" />
        </>
      )}

      {/* Inner Screen Display Glass Housing & Bezel */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[#0c1020] dark:bg-[#070913] border border-slate-800/80 dark:border-white/[0.08] shadow-[inset_0_0_12px_rgba(0,0,0,0.35)]",
          aspectRatio,
          innerBorderRadius,
          innerClassName
        )}
      >
        {/* Precision Front Camera & TrueDepth Sensor Array */}
        {showCamera && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 pointer-events-none">
            {/* Ambient sensor dot */}
            <div className="w-1 h-1 rounded-full bg-slate-800/90 dark:bg-white/10" />
            {/* Main Camera lens with optical blue/cyan coating glare */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700/80 dark:border-white/15 flex items-center justify-center shadow-xs">
              <div className="w-1 h-1 rounded-full bg-indigo-400/60 blur-[0.2px]" />
            </div>
          </div>
        )}

        {/* Screen Content (Image, Whiteboard, or Dashboard) */}
        <div className="relative w-full h-full">{children}</div>

        {/* Screen Glass Diagonal Specular Sheen (Real Glass Reflection) */}
        {showGlare && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.14] dark:via-white/[0.02] dark:to-white/[0.07] z-20" />
        )}
      </div>
    </div>
  );
}
