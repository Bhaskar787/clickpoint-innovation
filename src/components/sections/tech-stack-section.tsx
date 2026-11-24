"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Code2, Cpu } from "lucide-react";
import {
  JavaScriptIcon,
  NodeJSIcon,
  PythonIcon,
  DjangoIcon,
  HTMLIcon,
  CSSIcon,
  NextJSIcon,
  ReactJSIcon,
  PHPIcon,
  LaravelIcon,
  FigmaIcon,
  WordpressIcon,
  FlutterIcon,
  IOSIcon,
  DartIcon,
  SwiftIcon,
  KotlinIcon,
  ReactNativeIcon,
  MongoDBIcon,
  MySQLIcon,
  PostgresIcon,
  SQLiteIcon,
  RedisIcon,
  AWSIcon,
  GoogleCloudIcon,
  DockerIcon,
  KubernetesIcon,
  CloudflareIcon,
  DigitalOceanIcon,
} from "@/components/common/icons/tech-icons";
import { DEFAULT_LANDING_DATA, DEFAULT_TECH_CATEGORIES, DEFAULT_TECH_ITEMS } from "@/data/default-landing-data";

// Fallback Built-in Icon Map by ID
const BUILTIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  js: JavaScriptIcon,
  nodejs: NodeJSIcon,
  python: PythonIcon,
  django: DjangoIcon,
  html5: HTMLIcon,
  css3: CSSIcon,
  nextjs: NextJSIcon,
  reactjs: ReactJSIcon,
  php: PHPIcon,
  laravel: LaravelIcon,
  figma: FigmaIcon,
  wordpress: WordpressIcon,
  flutter: FlutterIcon,
  ios: IOSIcon,
  dart: DartIcon,
  swift: SwiftIcon,
  kotlin: KotlinIcon,
  "react-native": ReactNativeIcon,
  mongodb: MongoDBIcon,
  mysql: MySQLIcon,
  postgres: PostgresIcon,
  sqlite: SQLiteIcon,
  redis: RedisIcon,
  aws: AWSIcon,
  gcp: GoogleCloudIcon,
  docker: DockerIcon,
  k8s: KubernetesIcon,
  cloudflare: CloudflareIcon,
  digitalocean: DigitalOceanIcon,
};

interface TechStackSectionProps {
  initialHeader?: any;
  initialCategories?: any[];
  initialItems?: any[];
}

export default function TechStackSection({
  initialHeader,
  initialCategories,
  initialItems,
}: TechStackSectionProps = {}) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [techHeader, setTechHeader] = useState<any>(initialHeader || DEFAULT_LANDING_DATA.techStackHeader);
  const [categories, setCategories] = useState<any[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : DEFAULT_TECH_CATEGORIES
  );
  const [techItems, setTechItems] = useState<any[]>(
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_TECH_ITEMS
  );

  useEffect(() => {
    if (!initialHeader || !initialCategories || !initialItems) {
      async function loadTechStackData() {
        try {
          const res = await fetch("/api/landing");
          const json = await res.json();
          if (json.success && json.data) {
            if (json.data.techStackHeader && !initialHeader) {
              setTechHeader({
                ...DEFAULT_LANDING_DATA.techStackHeader,
                ...json.data.techStackHeader,
              });
            }
            if (json.data.techCategories && json.data.techCategories.length > 0 && !initialCategories) {
              setCategories(json.data.techCategories);
            }
            if (json.data.techItems && json.data.techItems.length > 0 && !initialItems) {
              setTechItems(json.data.techItems);
            }
          }
        } catch (err) {
          console.warn("Using default tech stack data:", err);
        }
      }

      loadTechStackData();
    }
  }, [initialHeader, initialCategories, initialItems]);

  const filteredTech =
    activeCategory === "ALL" || activeCategory === "all"
      ? techItems
      : techItems.filter((item) => item.category === activeCategory || item.category === activeCategory.toLowerCase());

  if (!techItems || techItems.length < 8) return null;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-[#070814] text-slate-900 dark:text-slate-100 transition-colors duration-300 border-b border-slate-200/60 dark:border-white/[0.08]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* LEFT-ALIGNED SECTION HEADER */}
        <div className="text-left max-w-3xl space-y-3">
          <span className="section-badge text-violet-600 dark:text-violet-400">
            {techHeader.badge || "Tech Stack & Architecture"}
          </span>

          <h2 className="section-title text-ink dark:text-white">
            {techHeader.title || "Built with Modern"}{" "}
            <span className="text-violet-600 dark:text-[#f58220]">
              {techHeader.titleHighlight || "Battle-Tested Technologies"}
            </span>
          </h2>

          <p className="section-subtitle">
            {techHeader.subtitle || "We leverage cutting-edge frameworks, cloud platforms, and AI SDKs to build enterprise-grade software."}
          </p>
        </div>

        {/* LEFT-ALIGNED CATEGORY TABS SELECTOR (6px radius) */}
        <div className="mt-8 flex flex-wrap items-center justify-start gap-2 max-w-5xl">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-[13px] font-medium transition-all cursor-pointer ${
              activeCategory === "ALL" || activeCategory === "all"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.1] hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/[0.08]"
            }`}
          >
            <Layers className="h-3.5 w-3.5 shrink-0" />
            <span>All Technologies</span>
          </button>

          {categories.filter((cat) => cat.id !== "all" && cat.name !== "All Technologies").map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-[13px] font-medium transition-all cursor-pointer ${
                activeCategory === cat.name
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.1] hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/[0.08]"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* DYNAMIC TECH STACK TILES (112px square, 6px radius, 16px gap, 32px logo, 14px name) */}
        <motion.div layout className="mt-10 flex flex-wrap gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTech.map((item) => {
              const BuiltinIcon = BUILTIN_ICONS[item.id] || BUILTIN_ICONS[item.name.toLowerCase().replace(/[^a-z0-9]+/g, "")];

              return (
                <motion.div
                  key={item.id || item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-[112px] h-[112px] shrink-0"
                >
                  <div
                    title={`${item.name} (${item.category})`}
                    className="group relative flex h-[112px] w-[112px] flex-col items-center justify-center rounded-sm border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c0e22] p-2 text-center shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/[0.16]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center shrink-0">
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt={item.name} className="h-8 w-8 object-contain" />
                      ) : BuiltinIcon ? (
                        <BuiltinIcon className="h-8 w-8 text-slate-700 dark:text-slate-300 transition-transform group-hover:scale-105" />
                      ) : (
                        <Code2 className="h-6 w-6 text-violet-600" />
                      )}
                    </div>

                    <h3 className="mt-2 text-[14px] font-semibold text-slate-900 dark:text-white truncate max-w-full px-1">
                      {item.name}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}