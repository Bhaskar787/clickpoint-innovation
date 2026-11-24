"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({
  className,
  iconClassName,
  size = "md",
}: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const btnRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const isTransitioningRef = useRef(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-10 w-10 text-base",
  }[size];

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-sm shrink-0 flex items-center justify-center border border-transparent opacity-0 pointer-events-none",
          sizeClasses,
          className
        )}
        aria-hidden="true"
      />
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    window.setTimeout(() => {
      isTransitioningRef.current = false;
    }, 950);

    // 1. Calculate exact center coordinates of the toggle button
    const rect = btnRef.current?.getBoundingClientRect();
    const x =
      e.clientX || (rect ? rect.left + rect.width / 2 : window.innerWidth - 60);
    const y = e.clientY || (rect ? rect.top + rect.height / 2 : 40);

    // 2. GSAP button bounce animation
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.5, ease: "back.out(2)" }
      );
    }

    // 3. GSAP icon rotation & scale pop animation
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: isDark ? -180 : 180, scale: 0.5, opacity: 0 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: "back.out(1.8)",
        }
      );
    }

    // 4. Trigger circular view transition originating from the button center
    toggleTheme({ clientX: x, clientY: y });
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to night mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
      className={cn(
        "relative flex items-center justify-center rounded-sm shrink-0 cursor-pointer overflow-hidden transition-all duration-200",
        "bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]",
        "border border-slate-200/80 dark:border-white/[0.10]",
        "text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white",
        "shadow-2xs focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/50",
        sizeClasses,
        className
      )}
    >
      <span
        ref={iconRef}
        className="inline-flex items-center justify-center pointer-events-none select-none transition-transform"
      >
        {isDark ? (
          <Sun className={cn(iconSizes, "text-amber-400 fill-amber-400/20", iconClassName)} />
        ) : (
          <Moon className={cn(iconSizes, "text-slate-700 dark:text-slate-200", iconClassName)} />
        )}
      </span>
    </button>
  );
}

export default ThemeToggle;
