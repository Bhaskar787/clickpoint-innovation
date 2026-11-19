"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronRight, CheckCircle2, Layers } from "lucide-react";

export interface SectionNavItem {
  id: string;
  number: string; // e.g. "01" or "#01"
  title: string;
  desc?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  fieldsCount?: number;
  status?: string;
}

export type SectionNavSidebarItem = SectionNavItem;

interface SectionNavSidebarProps {
  sections: SectionNavItem[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  title?: string;
  accentColor?: "violet" | "blue" | "emerald";
  className?: string;
}

export function SectionNavSidebar({
  sections,
  activeSectionId,
  onSelectSection,
  title = "Page Sections",
  accentColor = "violet",
  className = "",
}: SectionNavSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const mobileTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const btn = mobileTabRefs.current[activeSectionId];
    if (btn) {
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeSectionId]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase().trim();
    return sections.filter(
      (s) =>
        s.number.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        (s.desc && s.desc.toLowerCase().includes(q)) ||
        (s.badge && s.badge.toLowerCase().includes(q))
    );
  }, [sections, searchQuery]);

  // Color theme palettes
  const colorMap = {
    violet: {
      activeBorder: "border-violet-400 dark:border-violet-600",
      activeBg: "bg-violet-50/90 dark:bg-violet-950/50",
      activeText: "text-violet-700 dark:text-violet-300",
      badgeBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
      iconActive: "text-violet-600 dark:text-violet-400",
      pillActive: "bg-violet-600 text-white shadow-sm shadow-violet-600/30",
    },
    blue: {
      activeBorder: "border-blue-400 dark:border-blue-600",
      activeBg: "bg-blue-50/90 dark:bg-blue-950/50",
      activeText: "text-blue-700 dark:text-blue-300",
      badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      iconActive: "text-blue-600 dark:text-blue-400",
      pillActive: "bg-blue-600 text-white shadow-sm shadow-blue-600/30",
    },
    emerald: {
      activeBorder: "border-emerald-400 dark:border-emerald-600",
      activeBg: "bg-emerald-50/90 dark:bg-emerald-950/50",
      activeText: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      iconActive: "text-emerald-600 dark:text-emerald-400",
      pillActive: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30",
    },
  };

  const theme = colorMap[accentColor] || colorMap.violet;

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-3.5 sm:p-4 shadow-xs space-y-3 ${className}`}
    >
      {/* Header with Title and Section Counter */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-slate-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {title}
          </h4>
        </div>
        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {sections.length} Sections
        </span>
      </div>

      {/* Quick Search Filter (shown if > 4 sections) */}
      {sections.length > 4 && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search S.N. or section..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      )}

      {/* Mobile Horizontal Pill Scrollbar (< lg screens) */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scroll-smooth touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none]">
        {filteredSections.map((sec) => {
          const isSelected = activeSectionId === sec.id;
          const formattedNumber = sec.number.startsWith("#") ? sec.number : `#${sec.number}`;
          return (
            <button
              key={sec.id}
              ref={(el) => {
                mobileTabRefs.current[sec.id] = el;
              }}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? theme.pillActive
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span className="font-mono text-[11px] font-black">{formattedNumber}</span>
              <span className="truncate max-w-[120px]">{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical List (hidden on mobile, shown on lg screens) */}
      <div className="hidden lg:block space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.25)_transparent]">
        {filteredSections.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No sections match &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredSections.map((sec) => {
            const isSelected = activeSectionId === sec.id;
            const Icon = sec.icon;
            const formattedNumber = sec.number.startsWith("#") ? sec.number : `#${sec.number}`;

            return (
              <div
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`w-full group flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer text-xs transition-all border ${
                  isSelected
                    ? `${theme.activeBorder} ${theme.activeBg} ${theme.activeText} shadow-xs font-bold`
                    : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* S.N. Badge */}
                  <span
                    className={`font-mono text-[10px] font-black px-1.5 py-0.5 rounded-md border shrink-0 transition-colors ${
                      isSelected
                        ? theme.badgeBg
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60 group-hover:border-slate-300"
                    }`}
                  >
                    {formattedNumber}
                  </span>

                  {/* Section Icon */}
                  {Icon && (
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isSelected
                          ? theme.iconActive
                          : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                      }`}
                    />
                  )}

                  {/* Section Title & Desc */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs leading-snug">{sec.title}</p>
                    {sec.badge && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate mt-0.5">
                        {sec.badge}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: chevron indicator */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {isSelected ? (
                    <ChevronRight className={`h-4 w-4 shrink-0 ${theme.iconActive}`} />
                  ) : (
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
