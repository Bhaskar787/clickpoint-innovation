"use client";

import { useEffect, useState } from "react";
import { List, ChevronDown, Share2, Copy, Check, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/blog-toc";

interface TableOfContentsProps {
  headings: TocHeading[];
  className?: string;
  title?: string;
}

export function BlogTableOfContents({
  headings,
  className,
  title = "Contents",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    // Set initial active heading
    setActiveId(headings[0].id);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerOffset = 120; // 72px navbar + buffer

      // If user is at the very top of page
      if (scrollY < 180) {
        setActiveId(headings[0].id);
        return;
      }

      // Check which heading is currently in viewport
      let currentActive = headings[0].id;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollY + headerOffset >= top) {
            currentActive = heading.id;
          }
        }
      }

      setActiveId(currentActive);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -96; // 72px fixed navbar + 24px breathing space
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (!headings || headings.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-[#f8fafc]/90 dark:bg-[#131c31]/90 backdrop-blur-md p-5 shadow-xs",
        className
      )}
    >
      {/* Contents Header */}
      <h3 className="font-poppins text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
        {title}
      </h3>

      {/* Stepper / Timeline Container */}
      <nav className="relative" aria-label="Table of contents">
        {/* Continuous vertical line spanning through all dots from first to last */}
        <div
          className="absolute left-[4.5px] top-[14px] bottom-[14px] w-[1.5px] bg-slate-900 dark:bg-slate-600 pointer-events-none"
          aria-hidden="true"
        />

        <ul className="space-y-3.5 relative">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;

            return (
              <li
                key={heading.id}
                className={cn(
                  "relative flex items-start gap-3 group",
                  heading.level === 3 && "pl-3.5"
                )}
              >
                {/* Dot placed directly on the 1.5px vertical line */}
                <div className="relative z-10 mt-1 shrink-0">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all duration-200",
                      isActive
                        ? "bg-violet-600 dark:bg-[#f58220] ring-4 ring-violet-500/20 dark:ring-[#f58220]/25 scale-110"
                        : "bg-slate-900 dark:bg-slate-300 group-hover:scale-110 group-hover:bg-violet-600 dark:group-hover:bg-[#f58220]"
                    )}
                  />
                </div>

                {/* Heading Text Link */}
                <button
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "text-left text-[13px] leading-snug transition-colors cursor-pointer select-none",
                    isActive
                      ? "font-bold text-violet-700 dark:text-[#f58220]"
                      : "font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                  )}
                >
                  {heading.text}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/**
 * Mobile Collapsible Table of Contents for viewports under lg
 */
export function MobileTableOfContents({
  headings,
  title = "Contents",
}: {
  headings: TocHeading[];
  title?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="lg:hidden mb-8 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-[#f8fafc]/90 dark:bg-[#131c31]/90 p-4 shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4 text-violet-600 dark:text-[#f58220]" />
          <span>{title} ({headings.length})</span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <BlogTableOfContents headings={headings} className="border-0 bg-transparent p-0 shadow-none" />
        </div>
      )}
    </div>
  );
}

/**
 * Clean Sidebar Share Widget to complement Table of Contents
 */
export function ArticleSidebarShare({ postTitle }: { postTitle: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(postTitle);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-[#f8fafc]/70 dark:bg-[#131c31]/70 backdrop-blur-xs p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Share2 className="h-3.5 w-3.5" />
          Share Story
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>

        <button
          type="button"
          onClick={handleShareTwitter}
          aria-label="Share on X"
          className="p-2 rounded-sm border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Twitter className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={handleShareLinkedIn}
          aria-label="Share on LinkedIn"
          className="p-2 rounded-sm border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Linkedin className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
