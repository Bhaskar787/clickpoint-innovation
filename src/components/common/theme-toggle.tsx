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
          "rounded-full shrink-0 flex items-center justify-center border border-transparent opacity-0 pointer-events-none",
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
        { scale: 0.88 },
        { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" }
      );
    }

    // 3. GSAP icon rotation & scale pop animation
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: isDark ? -180 : 180, scale: 0.4, opacity: 0 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 0.65,
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
        "relative flex items-center justify-center rounded-full shrink-0 cursor-pointer overflow-hidden",
        "bg-violet-50 dark:bg-slate-800 text-ink dark:text-amber-400",
        "hover:bg-violet-100 dark:hover:bg-slate-700",
        "border border-violet-100 dark:border-slate-700",
        "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40",
        sizeClasses,
        className
      )}
    >
      <span
        ref={iconRef}
        className="inline-flex items-center justify-center pointer-events-none select-none"
      >
        {isDark ? (
          <Sun className={cn(iconSizes, "text-[#f58220]", iconClassName)} />
        ) : (
          <Moon className={cn(iconSizes, "text-violet-700", iconClassName)} />
        )}
      </span>
    </button>
  );
}

export default ThemeToggle;
