"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Compass,
  Search,
  Phone,
  FileQuestion,
  Zap,
  Mail,
  HelpCircle,
  Briefcase,
  LayoutGrid,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { NotFoundPageContent } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  home: Home,
  compass: Compass,
  search: Search,
  phone: Phone,
  mail: Mail,
  "file-question": FileQuestion,
  sparkles: Zap,
  zap: Zap,
  "help-circle": HelpCircle,
  briefcase: Briefcase,
  grid: LayoutGrid,
};

const BUTTON_VARIANT_MAP: Record<string, "primary" | "outline" | "ghost"> = {
  primary: "primary",
  outline: "outline",
  ghost: "ghost",
};

interface NotFoundClientViewProps {
  content: NotFoundPageContent;
}

export default function NotFoundClientView({ content }: NotFoundClientViewProps) {
  const { hero, actions } = content;
  const errorCodeChars = (hero.errorCode || "404").split("");
  const highlightIndex = Math.floor(errorCodeChars.length / 2);
  const sortedActions = [...(actions || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* 404 Main Hero Container */}
      <section className="relative flex flex-1 items-center justify-center pt-36 pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
        {/* Background Graph Paper Blueprint Grid & Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Fine Precision Graph Paper Grid (32px x 32px) */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.09)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(99,102,241,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.2)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_85%_80%_at_50%_40%,#000_75%,transparent_100%)]"
          />

          {/* Major Axis Grid Lines */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.18)_1.5px,transparent_1.5px),linear-gradient(to_bottom,rgba(37,99,235,0.18)_1.5px,transparent_1.5px)] dark:bg-[linear-gradient(to_right,rgba(56,189,248,0.3)_1.5px,transparent_1.5px),linear-gradient(to_bottom,rgba(56,189,248,0.3)_1.5px,transparent_1.5px)] bg-[size:160px_160px] [mask-image:radial-gradient(ellipse_85%_80%_at_50%_40%,#000_75%,transparent_100%)]"
          />

          {/* Central Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[800px] rounded-full bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-blue-500/10 dark:from-indigo-600/30 dark:via-blue-600/20 dark:to-transparent blur-[130px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl"
          >
            {/* Top Pill Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-700 bg-violet-50 dark:bg-slate-800/90 px-4 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 shadow-sm backdrop-blur-md">
              <Compass
                className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300 animate-spin"
                style={{ animationDuration: "12s" }}
              />
              <span>{hero.eyebrowBadge}</span>
            </div>

            {/* Glowing Error Code Huge Typography */}
            <h1 className="font-display text-7xl font-black tracking-tight sm:text-9xl text-ink dark:text-white leading-none drop-shadow-sm">
              {errorCodeChars.map((char, i) => (
                <span key={i} className={i === highlightIndex ? "text-[#f58220]" : undefined}>
                  {char}
                </span>
              ))}
            </h1>

            {/* Main Headline */}
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl">
              {hero.title}
            </h2>

            {/* Subtitle Description */}
            <p className="mt-4 text-base leading-relaxed text-ink/70 dark:text-slate-300 sm:text-lg max-w-xl mx-auto">
              {hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {sortedActions.map((action) => {
                const IconComp = ICON_MAP[action.icon] || ArrowRight;
                const variant = BUTTON_VARIANT_MAP[action.style] || "outline";
                const isPrimary = variant === "primary";
                const isGhost = variant === "ghost";

                return (
                  <Link key={action.id} href={action.href}>
                    <Button
                      variant={variant}
                      size="lg"
                      className={
                        isPrimary
                          ? "group shadow-lg shadow-violet-600/25 font-bold"
                          : isGhost
                          ? "font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-slate-800"
                          : "font-bold border-violet-200 dark:border-slate-700"
                      }
                    >
                      <IconComp
                        className={
                          isPrimary
                            ? "h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1"
                            : "h-4 w-4 mr-2"
                        }
                      />
                      {action.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}