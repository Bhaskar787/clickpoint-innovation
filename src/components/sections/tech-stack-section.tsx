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

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-[#070814] text-slate-900 dark:text-slate-100 transition-colors duration-300 border-b border-slate-100 dark:border-slate-800/80">
      
      {/* Ambient Grid Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_0%_0%,rgba(124,58,237,0.08),transparent)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* LEFT-ALIGNED SECTION HEADER */}
        <div className="text-left max-w-3xl space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {techHeader.badge || "Tech Stack & Architecture"}
          </span>

       <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
  {techHeader.title || "Built with Modern"}{" "}
  <span className="text-violet-600 dark:text-orange-500">
    {techHeader.titleHighlight || "Battle-Tested Technologies"}
  </span>
</h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-medium pt-1">
            {techHeader.subtitle || "We leverage cutting-edge frameworks, cloud platforms, and AI SDKs to build enterprise-grade software."}
          </p>
        </div>

        {/* LEFT-ALIGNED CATEGORY TABS SELECTOR */}
        <div className="mt-8 flex flex-wrap items-center justify-start gap-2 max-w-5xl">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === "ALL" || activeCategory === "all"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20 scale-105"
                : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800"
            }`}
          >
            <Layers className="h-4 w-4 shrink-0" />
            <span>All Technologies</span>
          </button>

          {categories.filter((cat) => cat.id !== "all" && cat.name !== "All Technologies").map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat.name
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20 scale-105"
                  : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* DYNAMIC TECH STACK CARDS GRID */}
        <motion.div layout className="mt-10 grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredTech.map((item) => {
              const BuiltinIcon = BUILTIN_ICONS[item.id] || BUILTIN_ICONS[item.name.toLowerCase().replace(/[^a-z0-9]+/g, "")];

              return (
                <motion.div
                  key={item.id || item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex flex-col items-center justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0c0e22] p-4 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900/90 group-hover:bg-violet-50 dark:group-hover:bg-violet-950/50 transition-colors p-2 shrink-0">
                    {item.iconUrl ? (
                      <img src={item.iconUrl} alt={item.name} className="h-8 w-8 object-contain" />
                    ) : BuiltinIcon ? (
                      <BuiltinIcon className="h-8 w-8 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
                    ) : (
                      <Code2 className="h-6 w-6 text-violet-600" />
                    )}
                  </div>

                  <div className="mt-3 w-full">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-tight">
                      {item.tagline || item.description || item.category}
                    </p>
                  </div>

                  <div className="mt-3 w-full border-t border-slate-100 dark:border-slate-800/60 pt-2 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-full border border-violet-100 dark:border-violet-800/50 truncate max-w-full">
                      {item.category}
                    </span>
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