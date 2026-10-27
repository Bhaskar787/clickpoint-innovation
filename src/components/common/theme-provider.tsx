"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

export interface ThemeToggleCoord {
  clientX?: number;
  clientY?: number;
}

interface ThemeContextType {
  theme: Theme;
  mounted: boolean;
  toggleTheme: (event?: React.MouseEvent | ThemeToggleCoord) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem("clickpoint_theme") as Theme | null;
      const isDark =
        savedTheme === "dark" ||
        document.documentElement.classList.contains("dark");
      if (isDark) {
        setThemeState("dark");
        document.documentElement.classList.add("dark");
      } else {
        setThemeState("light");
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("clickpoint_theme", newTheme);
    } catch {
      // localStorage unavailable
    }
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | ThemeToggleCoord) => {
      if (isTransitioningRef.current) return;
      const nextTheme: Theme = theme === "light" ? "dark" : "light";

      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      };

      // Check if browser supports View Transitions API and not prefers-reduced-motion
      const canUseViewTransition =
        typeof document !== "undefined" &&
        typeof doc.startViewTransition === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (canUseViewTransition && doc.startViewTransition) {
        isTransitioningRef.current = true;
        window.setTimeout(() => {
          isTransitioningRef.current = false;
        }, 950);

        // Determine origin coordinates from the click/tap or default to the top-right button corner
        const x =
          event?.clientX ??
          (typeof window !== "undefined" ? window.innerWidth - 60 : 0);
        const y = event?.clientY ?? 40;

        // Calculate distance to the furthest corner of viewport
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        document.documentElement.classList.add("view-transitioning");

        const transition = doc.startViewTransition(() => {
          flushSync(() => {
            applyTheme(nextTheme);
          });
        });

        transition.ready.then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

          document.documentElement.animate(
            {
              clipPath,
            },
            {
              duration: 950,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        });

        transition.finished.finally(() => {
          document.documentElement.classList.remove("view-transitioning");
        });
        return;
      }

      // Fallback for browsers without View Transitions
      applyTheme(nextTheme);
    },
    [theme, applyTheme]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme: mounted ? theme : "light",
        mounted,
        toggleTheme,
        setTheme: applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
