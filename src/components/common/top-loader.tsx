"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Programmatic triggers for manual navigation (e.g. router.push)
 */
export function startTopLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("clickpoint-navigation-start"));
  }
}

export function stopTopLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("clickpoint-navigation-stop"));
  }
}

function TopLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const trickleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  const clearAllTimers = () => {
    if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
  };

  const start = () => {
    clearAllTimers();
    isNavigatingRef.current = true;
    setIsVisible(true);
    setOpacity(1);
    setProgress(18);

    // Trickle simulation: starts rapid, gradually slows down before completion
    trickleTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        let increment = 0;
        if (prev < 40) {
          increment = 8 + Math.random() * 6;
        } else if (prev < 70) {
          increment = 3 + Math.random() * 4;
        } else if (prev < 85) {
          increment = 1.5 + Math.random() * 2;
        } else {
          increment = 0.5 + Math.random() * 0.5;
        }
        return Math.min(prev + increment, 92);
      });
    }, 180);

    // Safety timeout to avoid an indefinitely stuck bar if navigation is aborted
    safetyTimerRef.current = setTimeout(() => {
      done();
    }, 8000);
  };

  const done = () => {
    if (!isNavigatingRef.current) return;
    isNavigatingRef.current = false;
    clearAllTimers();

    // Rapidly complete to 100%
    setProgress(100);

    // Fade out after full width is achieved
    fadeTimerRef.current = setTimeout(() => {
      setOpacity(0);
      fadeTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 250);
    }, 200);
  };

  // When pathname or searchParams change, the navigation has completed
  useEffect(() => {
    if (isNavigatingRef.current) {
      done();
    }
  }, [pathname, searchParams]);

  // Global Link Click Listener & Popstate (back/forward)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }
      if (!target || target.tagName !== "A") return;

      const anchor = target as HTMLAnchorElement;
      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Ignore non-navigation schemes
      if (
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:") ||
        rawHref.startsWith("#")
      ) {
        return;
      }

      // Ignore user modifiers (new tab, new window, selection)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // Ignore target="_blank" and download attributes
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      try {
        const url = new URL(anchor.href, window.location.href);

        // Ignore cross-origin external links
        if (url.origin !== window.location.origin) return;

        // Ignore same page anchor navigation (e.g. /#faq on homepage)
        const current = new URL(window.location.href);
        if (url.pathname === current.pathname && url.search === current.search) {
          return;
        }

        // Start top loader immediately
        start();
      } catch {
        // Invalid URL, ignore
      }
    };

    const handlePopState = () => {
      start();
    };

    const handleCustomStart = () => start();
    const handleCustomStop = () => done();

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("clickpoint-navigation-start", handleCustomStart);
    window.addEventListener("clickpoint-navigation-stop", handleCustomStop);

    return () => {
      clearAllTimers();
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("clickpoint-navigation-start", handleCustomStart);
      window.removeEventListener("clickpoint-navigation-stop", handleCustomStop);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[999999] pointer-events-none transition-opacity duration-200"
      style={{ opacity }}
    >
      {/* 3px Top Progress Bar with Brand Blue/Indigo Gradient */}
      <div className="relative h-[3px] w-full bg-transparent overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 transition-all ease-out"
          style={{
            width: `${progress}%`,
            transitionDuration: progress === 100 ? "180ms" : "220ms",
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.8), 0 0 5px rgba(99, 102, 241, 0.6)",
          }}
        >
          {/* Glowing Head Peg at the Trailing Edge */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/40 blur-[0.5px]" />
        </div>
      </div>

    </div>
  );
}

export default function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderContent />
    </Suspense>
  );
}
