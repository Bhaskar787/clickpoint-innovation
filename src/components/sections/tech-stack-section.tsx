"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Code2, Smartphone, Database, Cloud } from "lucide-react";
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

export interface TechItem {
  id: string;
  name: string;
  category: "Web Development" | "App Development" | "Database" | "Cloud Platform";
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TECH_STACK_DATA: TechItem[] = [
  // Web Development
  { id: "js", name: "JavaScript", category: "Web Development", tagline: "ES6+ & Asynchronous Engines", icon: JavaScriptIcon },
  { id: "nodejs", name: "Node.js", category: "Web Development", tagline: "High-Throughput Microservices", icon: NodeJSIcon },
  { id: "python", name: "Python", category: "Web Development", tagline: "AI Models & Data Pipelines", icon: PythonIcon },
  { id: "django", name: "Django", category: "Web Development", tagline: "Secure Python Web Framework", icon: DjangoIcon },
  { id: "html5", name: "HTML5", category: "Web Development", tagline: "Semantic & Accessible Web", icon: HTMLIcon },
  { id: "css3", name: "CSS3", category: "Web Development", tagline: "Modern Flexbox & Grid Styling", icon: CSSIcon },
  { id: "nextjs", name: "Next.js", category: "Web Development", tagline: "App Router & Full-Stack SSR", icon: NextJSIcon },
  { id: "reactjs", name: "React.js", category: "Web Development", tagline: "Declarative Component UI", icon: ReactJSIcon },
  { id: "php", name: "PHP", category: "Web Development", tagline: "Server-Side Scripting Engine", icon: PHPIcon },
  { id: "laravel", name: "Laravel", category: "Web Development", tagline: "Elegant MVC PHP Framework", icon: LaravelIcon },
  { id: "figma", name: "Figma", category: "Web Development", tagline: "UI/UX & Interactive Design", icon: FigmaIcon },
  { id: "wordpress", name: "WordPress", category: "Web Development", tagline: "Headless CMS Solutions", icon: WordpressIcon },

  // App Development
  { id: "flutter", name: "Flutter", category: "App Development", tagline: "Cross-Platform Mobile Apps", icon: FlutterIcon },
  { id: "ios", name: "iOS Native", category: "App Development", tagline: "Apple Ecosystem Apps", icon: IOSIcon },
  { id: "dart", name: "Dart", category: "App Development", tagline: "Client-Optimized Language", icon: DartIcon },
  { id: "swift", name: "Swift", category: "App Development", tagline: "Native iOS Performance", icon: SwiftIcon },
  { id: "kotlin", name: "Kotlin", category: "App Development", tagline: "Modern Android Development", icon: KotlinIcon },
  { id: "react-native", name: "React Native", category: "App Development", tagline: "Native iOS & Android Builds", icon: ReactNativeIcon },

  // Database
  { id: "mongodb", name: "MongoDB", category: "Database", tagline: "NoSQL Document Storage", icon: MongoDBIcon },
  { id: "mysql", name: "MySQL", category: "Database", tagline: "Relational Database Engine", icon: MySQLIcon },
  { id: "postgres", name: "PostgreSQL", category: "Database", tagline: "Enterprise SQL & Vector DB", icon: PostgresIcon },
  { id: "sqlite", name: "SQLite", category: "Database", tagline: "Embedded Lightweight DB", icon: SQLiteIcon },
  { id: "redis", name: "Redis", category: "Database", tagline: "In-Memory Cache & Key-Value", icon: RedisIcon },

  // Cloud Platform
  { id: "aws", name: "AWS", category: "Cloud Platform", tagline: "Enterprise Cloud Infra & AI", icon: AWSIcon },
  { id: "gcp", name: "Google Cloud", category: "Cloud Platform", tagline: "Scalable GCP Kubernetes & AI", icon: GoogleCloudIcon },
  { id: "docker", name: "Docker", category: "Cloud Platform", tagline: "Containerized Workloads", icon: DockerIcon },
  { id: "k8s", name: "Kubernetes", category: "Cloud Platform", tagline: "Container Orchestration", icon: KubernetesIcon },
  { id: "cloudflare", name: "Cloudflare", category: "Cloud Platform", tagline: "Edge CDN & DDoS Protection", icon: CloudflareIcon },
  { id: "digitalocean", name: "DigitalOcean", category: "Cloud Platform", tagline: "Developer Cloud Droplets", icon: DigitalOceanIcon },
];

const CATEGORIES = [
  { label: "All Technologies", value: "ALL", icon: Layers },
  { label: "Web Development", value: "Web Development", icon: Code2 },
  { label: "App Development", value: "App Development", icon: Smartphone },
  { label: "Database", value: "Database", icon: Database },
  { label: "Cloud Platform", value: "Cloud Platform", icon: Cloud },
];

export default function TechStackSection() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredTech =
    activeCategory === "ALL"
      ? TECH_STACK_DATA
      : TECH_STACK_DATA.filter((item) => item.category === activeCategory);

  return (
    <section id="tech-stack" className="relative py-20 lg:py-28 bg-white border-t border-violet-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-12">
          <div className="section-badge mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-violet-600 dark:text-violet-300">
            <Layers className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
            Our Technology Stack
          </div>

          <h2 className="section-title text-ink dark:text-white">
            Technologies We Rely On to{" "}
            <span className="text-violet-600 dark:text-[#f58220]">
              Achieve Success
            </span>
          </h2>

          <p className="mt-4 section-subtitle text-ink/70 dark:text-slate-300">
            Battle-tested frameworks, cloud infrastructure, and modern languages powering scalable enterprise applications.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-fluid-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                    : "bg-cloud-100/90 text-ink/75 hover:bg-violet-50 hover:text-violet-700 border border-violet-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white dark:border-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
                {cat.value === "ALL" && (
                  <span className="rounded-full bg-violet-100 text-violet-700 dark:bg-slate-700 dark:text-violet-300 px-1.5 py-0.2 text-fluid-2xs font-bold">
                    {TECH_STACK_DATA.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tech Grid */}
        <motion.div layout className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <AnimatePresence>
            {filteredTech.map((tech) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={tech.id}
                  className="group relative flex flex-col items-center justify-between rounded-2xl border border-violet-100/90 dark:border-slate-800 bg-white dark:bg-[#131c31] p-5 text-center shadow-xs transition-all duration-300 hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1.5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-50/80 dark:bg-slate-800 p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-violet-100/80 dark:group-hover:bg-slate-700">
                    <Icon className="h-9 w-9" />
                  </div>

                  <div className="mt-3.5">
                    <h4 className="font-display text-fluid-sm font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                      {tech.name}
                    </h4>
                    <p className="mt-1 text-fluid-2xs leading-tight text-ink/55 dark:text-slate-400 font-medium line-clamp-2">
                      {tech.tagline}
                    </p>
                  </div>

                  <span className="mt-3 rounded-md bg-cloud-100 dark:bg-slate-800 px-2 py-0.5 text-fluid-2xs font-semibold text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                    {tech.category}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
