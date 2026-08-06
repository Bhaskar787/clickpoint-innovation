import { DEFAULT_NAVBAR_DATA } from "./default-navbar-data";

export const DEFAULT_TECH_CATEGORIES = [
  { id: "all", name: "All Technologies" },
  { id: "web", name: "Web Development" },
  { id: "mobile", name: "App Development" },
  { id: "database", name: "Database" },
  { id: "cloud", name: "Cloud Platform" },
];

export const DEFAULT_TECH_ITEMS = [
  // Web Development
  { id: "js", name: "JavaScript", category: "Web Development", tagline: "ES6+ & Asynchronous Engines", iconUrl: "" },
  { id: "nodejs", name: "Node.js", category: "Web Development", tagline: "High-Throughput Microservices", iconUrl: "" },
  { id: "python", name: "Python", category: "Web Development", tagline: "AI Models & Data Pipelines", iconUrl: "" },
  { id: "django", name: "Django", category: "Web Development", tagline: "Secure Python Web Framework", iconUrl: "" },
  { id: "html5", name: "HTML5", category: "Web Development", tagline: "Semantic & Accessible Web", iconUrl: "" },
  { id: "css3", name: "CSS3", category: "Web Development", tagline: "Modern Flexbox & Grid Styling", iconUrl: "" },
  { id: "nextjs", name: "Next.js", category: "Web Development", tagline: "App Router & Full-Stack SSR", iconUrl: "" },
  { id: "reactjs", name: "React.js", category: "Web Development", tagline: "Declarative Component UI", iconUrl: "" },
  { id: "php", name: "PHP", category: "Web Development", tagline: "Server-Side Scripting Engine", iconUrl: "" },
  { id: "laravel", name: "Laravel", category: "Web Development", tagline: "Elegant MVC PHP Framework", iconUrl: "" },
  { id: "figma", name: "Figma", category: "Web Development", tagline: "UI/UX & Interactive Design", iconUrl: "" },
  { id: "wordpress", name: "WordPress", category: "Web Development", tagline: "Headless CMS Solutions", iconUrl: "" },

  // App Development
  { id: "flutter", name: "Flutter", category: "App Development", tagline: "Cross-Platform Mobile Apps", iconUrl: "" },
  { id: "ios", name: "iOS Native", category: "App Development", tagline: "Apple Ecosystem Apps", iconUrl: "" },
  { id: "dart", name: "Dart", category: "App Development", tagline: "Client-Optimized Language", iconUrl: "" },
  { id: "swift", name: "Swift", category: "App Development", tagline: "Native iOS Performance", iconUrl: "" },
  { id: "kotlin", name: "Kotlin", category: "App Development", tagline: "Modern Android Development", iconUrl: "" },
  { id: "react-native", name: "React Native", category: "App Development", tagline: "Native iOS & Android Builds", iconUrl: "" },

  // Database
  { id: "mongodb", name: "MongoDB", category: "Database", tagline: "NoSQL Document Storage", iconUrl: "" },
  { id: "mysql", name: "MySQL", category: "Database", tagline: "Relational Database Engine", iconUrl: "" },
  { id: "postgres", name: "PostgreSQL", category: "Database", tagline: "Enterprise SQL & Vector DB", iconUrl: "" },
  { id: "sqlite", name: "SQLite", category: "Database", tagline: "Embedded Lightweight DB", iconUrl: "" },
  { id: "redis", name: "Redis", category: "Database", tagline: "In-Memory Cache & Key-Value", iconUrl: "" },

  // Cloud Platform
  { id: "aws", name: "AWS", category: "Cloud Platform", tagline: "Enterprise Cloud Infra & AI", iconUrl: "" },
  { id: "gcp", name: "Google Cloud", category: "Cloud Platform", tagline: "Scalable GCP Kubernetes & AI", iconUrl: "" },
  { id: "docker", name: "Docker", category: "Cloud Platform", tagline: "Containerized Workloads", iconUrl: "" },
  { id: "k8s", name: "Kubernetes", category: "Cloud Platform", tagline: "Container Orchestration", iconUrl: "" },
  { id: "cloudflare", name: "Cloudflare", category: "Cloud Platform", tagline: "Edge CDN & DDoS Protection", iconUrl: "" },
  { id: "digitalocean", name: "DigitalOcean", category: "Cloud Platform", tagline: "Developer Cloud Droplets", iconUrl: "" },
];

export const DEFAULT_LANDING_DATA = {
  navbar: DEFAULT_NAVBAR_DATA,
  hero: {
    badge: "Next-Gen Engineering Studio",
    badgeSubtext: "AI & Cloud Architecture",
    title: "Empowering Business with",
    titleHighlight: "Clickpoint Precision",
    subtitle: "From Autonomous AI Agents to enterprise-grade web applications, we design and scale custom software built to outpace your competition.",
    pillars: [
      "Custom AI & LLM Systems",
      "High-Performance Backend",
      "Enterprise SOC2 Security",
    ],
    primaryCtaText: "Start Your Project",
    primaryCtaLink: "/contact",
    secondaryCtaText: "Explore Case Studies",
    secondaryCtaLink: "/case-studies",
    estimatorTitle: "Instant Development Estimator",
    estimatorMvpTitle: "AI MVP / Prototype",
    estimatorMvpSubtext: "Fast 2-4 week launch",
    estimatorMvpWeeks: 3,
    estimatorScaleTitle: "Full Enterprise Product",
    estimatorScaleSubtext: "Scalable Architecture",
    estimatorScaleWeeks: 8,
    socialProofText: "Engineered 50+ successful web & AI applications",
    imageUrl: "",
    showcaseTitle: "clickpoint-studio-v2.ts",
    showcaseBadgeTopLeft: "99.9% Uptime SLA",
    showcaseBadgeBottomRight: "Autonomous AI RAG Engine",
  },
  servicesHeader: {
    badge: "Core Engineering Capabilities",
    title: "Software Solutions Built for",
    titleHighlight: "Scale & Speed",
    subtitle: "From custom web platforms to autonomous AI agents, we deliver end-to-end engineering excellence.",
  },
  techStackHeader: {
    badge: "Tech Stack & Architecture",
    title: "Built with Modern",
    titleHighlight: "Battle-Tested Technologies",
    subtitle: "We leverage cutting-edge frameworks, cloud platforms, and AI SDKs to build enterprise-grade software.",
  },
  techCategories: DEFAULT_TECH_CATEGORIES,
  techItems: DEFAULT_TECH_ITEMS,
  industriesHeader: {
    badge: "Domain Expertise",
    title: "Tailored Tech for Every",
    titleHighlight: "Industry Sector",
    subtitle: "We build specialized software architectures compliant with strict industry regulations and security standards.",
  },
  journeyHeader: {
    badge: "Our Growth Story",
    title: "A Decade of Technical",
    titleHighlight: "Excellence",
    subtitle: "From a 4-person studio to an AI-first digital partner.",
  },
  ctaBanner: {
    badge: "Ready to Scale?",
    title: "Let's Build Your Next",
    titleHighlight: "Breakthrough Product",
    subtitle: "Partner with our engineering team to design, build, and launch software systems that outperform.",
    buttonText: "Schedule Technical Consultation",
    buttonLink: "/contact",
    secondaryButtonText: "Explore Case Studies",
    secondaryButtonLink: "/case-studies",
  },
};
