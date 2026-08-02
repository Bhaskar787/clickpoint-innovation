import {
  Bot,
  Code2,
  Palette,
  LineChart,
  Boxes,
  Cpu,
  Rocket,
  Users,
  Globe2,
  Award,
  TrendingUp,
  Wallet,
  HeartPulse,
  ShoppingBag,
  Layers,
  Truck,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  BookOpen,
  Star,
  HelpCircle,
  Milestone,
} from "lucide-react";
import {
  ServiceItem,
  IndustryItem,
  CompanyLink,
  StatItem,
  MilestoneItem,
  ClientLogo,
  TeamMember,
  BlogPost,
} from "@/types";

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "ai-eng",
    title: "AI Product Engineering",
    subtitle: "Copilots, Autonomous Agents & LLM-Native Platforms",
    desc: "Transform enterprise workflows with custom LLMs, autonomous AI agents, and RAG architectures integrated directly into your data pipeline.",
    fullOverview:
      "Clickpoint Innovation specializes in building LLM-native applications that go far beyond standard API integrations. We design production-grade autonomous agent pods, vector database knowledge bases, and fine-tuned domain models that automate complex knowledge worker tasks while enforcing strict enterprise data privacy and SOC2 compliance.",
    heroBadge: "AI & Autonomous Systems",
    iconName: "Bot",
    icon: Bot,
    keyMetrics: [
      { label: "Execution Latency", value: "< 250ms" },
      { label: "Accuracy Rate", value: "99.4%" },
      { label: "Efficiency Gain", value: "4.5x" },
    ],
    features: [
      {
        title: "Autonomous AI Agent Pods",
        desc: "Multi-agent orchestration frameworks capable of complex tool execution, reasoning loops, and automated workflow completion.",
      },
      {
        title: "Retrieval-Augmented Generation (RAG)",
        desc: "Enterprise vector storage indexing your proprietary documents for accurate, hallucination-free AI answers with source citations.",
      },
      {
        title: "Fine-Tuned Domain LLMs",
        desc: "Custom model fine-tuning on domain dataset benchmarks for specific verticals like Fintech, Legal, and Healthcare compliance.",
      },
      {
        title: "Copilot & Assistant Interfaces",
        desc: "Context-aware conversational UI components seamlessly embedded into your existing SaaS web & mobile applications.",
      },
    ],
    workflow: [
      { step: "01", title: "AI Readiness & Data Audit", desc: "Evaluating existing data pipelines, security boundaries, and high-ROI AI opportunities." },
      { step: "02", title: "Architecture & Vector Indexing", desc: "Designing vector database schemas, embedding pipelines, and model evaluation harnesses." },
      { step: "03", title: "Agent Pod Development", desc: "Building & prompt-engineering autonomous agent loops with fallback deterministic logic." },
      { step: "04", title: "Production Deployment & Guardrails", desc: "Deploying model monitoring, latency guards, cost governance, and security audits." },
    ],
    techStack: ["Python", "LangChain", "LlamaIndex", "Pinecone", "OpenAI API", "Anthropic Claude", "vLLM", "Next.js"],
    useCases: ["Automated Financial Audit Agents", "Customer Support Copilots", "Legal Document Intelligence", "Healthcare Claims Assistant"],
  },
  {
    id: "web-dev",
    title: "Web & App Development",
    subtitle: "Full-Stack React, Next.js & Mobile Engineering",
    desc: "Engineered for speed, scale, and sub-second load times. We build resilient Web & Mobile applications that convert and compound.",
    fullOverview:
      "Our full-stack engineering pods build mission-critical web applications, enterprise portals, and mobile apps using Next.js App Router, React Native, and serverless edge computing architectures. We prioritize high performance, lighthouse 100 scores, and modular codebases designed to scale seamlessly.",
    heroBadge: "Full-Stack Web & Mobile",
    iconName: "Code2",
    icon: Code2,
    keyMetrics: [
      { label: "Lighthouse Performance", value: "98/100" },
      { label: "Core Web Vitals", value: "Passed" },
      { label: "Uptime SLA", value: "99.99%" },
    ],
    features: [
      {
        title: "Next.js App Router & SSR Architecture",
        desc: "Server-side rendering, streaming SSR, and edge caching for ultra-fast global load speed.",
      },
      {
        title: "Cross-Platform Mobile Apps",
        desc: "Native-quality iOS and Android applications built on React Native and Expo with offline-first state sync.",
      },
      {
        title: "API & Microservice Design",
        desc: "Type-safe GraphQL & REST APIs with automated OpenAPI documentation and rate-limited gateway endpoints.",
      },
      {
        title: "Design System Implementation",
        desc: "Reusable, accessible component libraries powered by Tailwind CSS, Radix UI, and Framer Motion.",
      },
    ],
    workflow: [
      { step: "01", title: "Discovery & System Design", desc: "Defining user flows, state management paradigms, and cloud database models." },
      { step: "02", title: "Component Architecture", desc: "Building type-safe React components and atomic design tokens." },
      { step: "03", title: "API Integration & Testing", desc: "Connecting backend microservices with comprehensive unit & end-to-end test suites." },
      { step: "04", title: "Edge Deployment & CI/CD", desc: "Deploying to Vercel/AWS with global CDN distribution and monitoring." },
    ],
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "TailwindCSS", "PostgreSQL", "Prisma", "AWS", "Vercel"],
    useCases: ["Enterprise SaaS Dashboards", "High-Scale E-Commerce Portals", "Fintech Mobile Banking Apps", "Marketplace Platforms"],
  },
  {
    id: "ui-ux",
    title: "UI/UX & Brand Design",
    subtitle: "Human-Centric Digital Interfaces & Design Systems",
    desc: "Interfaces that captivate users and convert visits into compounding revenue. Backed by user research, prototyping, and design systems.",
    fullOverview:
      "Great software requires an extraordinary user experience. Our product design squad combines usability research, interaction design, and brand identity to craft modern, intuitive interfaces. We build complete Figma design systems that bridge the gap between design and front-end engineering.",
    heroBadge: "Product Design & Research",
    iconName: "Palette",
    icon: Palette,
    keyMetrics: [
      { label: "Conversion Lift", value: "+38%" },
      { label: "User Retention", value: "89%" },
      { label: "Design System Components", value: "200+" },
    ],
    features: [
      {
        title: "Comprehensive Design Systems",
        desc: "Tokenized design component libraries in Figma and code matching your brand identity and accessibility guidelines.",
      },
      {
        title: "High-Fidelity Interactive Prototypes",
        desc: "Clickable prototypes simulating real product interactions for usability testing before writing code.",
      },
      {
        title: "User Research & Heuristic Audits",
        desc: "In-depth user interviews, heatmap analysis, and friction audit maps to maximize funnel conversion.",
      },
      {
        title: "Motion & Micro-Interaction Design",
        desc: "Subtle fluid animations and feedback transitions that make digital products feel alive and premium.",
      },
    ],
    workflow: [
      { step: "01", title: "Empathize & Research", desc: "User interviews, competitor benchmarking, and friction mapping." },
      { step: "02", title: "Wireframing & Information Architecture", desc: "Structuring user journeys, sitemaps, and core task flows." },
      { step: "03", title: "UI Design & Motion Prototyping", desc: "Crafting visual styles, glassmorphic themes, and interactive prototypes." },
      { step: "04", title: "Developer Handoff & QA", desc: "Figma token export, component documentation, and pixel-perfect design QA." },
    ],
    techStack: ["Figma", "Framer", "Adobe CC", "Rive", "Storybook", "Tailwind CSS"],
    useCases: ["SaaS Product Redesigns", "Brand Identity Overhauls", "Complex Data Dashboard UX", "Mobile App Onboarding Flows"],
  },
  {
    id: "growth",
    title: "Growth & Performance",
    subtitle: "Data-Driven Growth Marketing & Funnel Optimization",
    desc: "Compound your customer acquisition with scientific CRO experiments, technical SEO, and automated lifecycle retention campaigns.",
    fullOverview:
      "Engineering the product is only half the battle — scaling user growth is where revenue compounds. Our growth practice combines technical SEO, conversion rate optimization (CRO), product-led growth (PLG) mechanics, and analytics instrumentation to drive measurable ROI.",
    heroBadge: "Performance & CRO",
    iconName: "LineChart",
    icon: LineChart,
    keyMetrics: [
      { label: "Avg Revenue Lift", value: "+142%" },
      { label: "CAC Reduction", value: "34%" },
      { label: "Experiments Run", value: "500+" },
    ],
    features: [
      {
        title: "Funnel & Conversion Rate Optimization",
        desc: "A/B testing user onboarding, landing pages, and checkout flows to eliminate conversion drop-off points.",
      },
      {
        title: "Technical SEO & Organic Authority",
        desc: "Schema markup, site speed optimization, programatic content engine builds, and backlink authority strategies.",
      },
      {
        title: "Lifecycle & Retention Automation",
        desc: "Behavior-triggered email sequences, push notifications, and in-app messaging to boost LTV and lower churn.",
      },
      {
        title: "Analytics Instrumentation",
        desc: "Setting up unified attribution tracking across Mixpanel, PostHog, Google Analytics 4, and Segment.",
      },
    ],
    workflow: [
      { step: "01", title: "Growth Audit & Baseline Setup", desc: "Instrumenting tracking and diagnosing current conversion bottlenecks." },
      { step: "02", title: "Hypothesis & Test Backlog", desc: "Prioritizing high-impact A/B tests based on ICE framework scoring." },
      { step: "03", title: "Execution & Variant Build", desc: "Building high-converting landing pages and personalized onboarding variants." },
      { step: "04", title: "Analyze, Scale & Repeat", desc: "Doubling down on winning experiments and automating retention loops." },
    ],
    techStack: ["Mixpanel", "PostHog", "Google Analytics 4", "VWO", "Customer.io", "Segment", "HubSpot"],
    useCases: ["PLG Self-Serve Onboarding", "B2B Lead Generation Engines", "E-Commerce Checkout CRO", "SEO Programmatic Content"],
  },
  {
    id: "platform-mod",
    title: "Platform Modernization",
    subtitle: "Legacy Code Migration & Cloud-Native Architectures",
    desc: "Upgrade legacy monoliths to zero-downtime, distributed serverless cloud platforms built for auto-scaling.",
    fullOverview:
      "Technical debt holds back fast-growing companies. We help enterprise teams decouple monolithic legacy codebases into modern cloud-native microservices, containerized Kubernetes pods, and automated infrastructure as code (IaC) without interrupting live operations.",
    heroBadge: "Cloud & Infrastructure",
    iconName: "Boxes",
    icon: Boxes,
    keyMetrics: [
      { label: "Infra Cost Reduction", value: "40%" },
      { label: "Deploy Frequency", value: "20x/day" },
      { label: "Migration Downtime", value: "0 mins" },
    ],
    features: [
      {
        title: "Monolith-to-Microservices Migration",
        desc: "Strangler fig pattern migration strategy to incrementally replace legacy monolith modules into scalable microservices.",
      },
      {
        title: "Database Refactoring & Sharding",
        desc: "Migrating legacy relational databases to distributed PostgreSQL, Redis caching layers, and high-throughput NoSQL.",
      },
      {
        title: "Serverless & Container Infrastructure",
        desc: "Containerizing workloads with Docker and Kubernetes on AWS EKS or GCP GKE with auto-scaling rules.",
      },
      {
        title: "Infrastructure as Code (Terraform)",
        desc: "Automating cloud infrastructure provisioning with repeatable, audited Terraform & AWS CloudFormation templates.",
      },
    ],
    workflow: [
      { step: "01", title: "Architecture Assessment", desc: "Mapping dependencies, bottleneck points, and compliance constraints." },
      { step: "02", title: "Target Cloud Blueprint", desc: "Designing multi-region, resilient cloud infrastructure topology." },
      { step: "03", title: "Incremental Migration", desc: "Migrating services and data stores step-by-step with shadow traffic validation." },
      { step: "04", title: "Final Cutover & Decommission", desc: "Achieving zero-downtime switch to the modernized cloud platform." },
    ],
    techStack: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform", "PostgreSQL", "Redis", "Kafka"],
    useCases: ["Monolith Breakdown", "Multi-Cloud Migration", "Database Optimization", "SOC2 Compliance Infra Setup"],
  },
  {
    id: "mlops",
    title: "MLOps & Automation",
    subtitle: "Production ML Pipelines, Model Monitoring & CI/CD",
    desc: "Bridge the gap between data science models and production software. Automate model training, deployment, and monitoring at scale.",
    fullOverview:
      "Shipping machine learning models to production is only 10% of the challenge; keeping them reliable, drift-free, and cost-effective is the rest. Our MLOps practice builds automated feature stores, automated retraining pipelines, model registry controls, and real-time inference monitoring.",
    heroBadge: "ML Infra & Pipelines",
    iconName: "Cpu",
    icon: Cpu,
    keyMetrics: [
      { label: "Deployment Time", value: "10 mins" },
      { label: "Drift Detection", value: "Real-time" },
      { label: "Pipeline Reliability", value: "99.9%" },
    ],
    features: [
      {
        title: "Automated ML CI/CD Pipelines",
        desc: "Continuous integration and continuous deployment pipelines for automated model testing, validation, and rollouts.",
      },
      {
        title: "Feature Store & Data Lineage",
        desc: "Centralized feature management with Feast/Hopsworks to ensure consistency between training and real-time inference.",
      },
      {
        title: "Real-Time Model & Data Drift Monitoring",
        desc: "Automated alert harnesses tracking feature drift, prediction accuracy decay, and anomalous latency spikes.",
      },
      {
        title: "Model Quantization & Inference Speedup",
        desc: "Optimizing model weights via TensorRT, ONNX, and quantization to cut cloud GPU hosting costs by up to 60%.",
      },
    ],
    workflow: [
      { step: "01", title: "Pipeline & Data Audit", desc: "Evaluating current ML artifacts, training datasets, and inference latency requirements." },
      { step: "02", title: "Feature Store & CI Architecture", desc: "Setting up automated data pipelines and model registries." },
      { step: "03", title: "Automated Training & Evaluation", desc: "Building reproducible training harnesses with MLflow/W&B." },
      { step: "04", title: "Inference Monitoring & Drift Alerts", desc: "Deploying real-time monitoring and automated retraining triggers." },
    ],
    techStack: ["PyTorch", "TensorFlow", "MLflow", "Kubeflow", "Feast", "ONNX", "Docker", "AWS SageMaker", "Weights & Biases"],
    useCases: ["Real-Time Recommendation Systems", "Fraud Detection Pipelines", "Computer Vision Inspection", "Automated Retraining Engines"],
  },
];

export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: "fintech",
    title: "Fintech & Financial Systems",
    subtitle: "AI-Powered Payments, Banking & Automated Ledger Intelligence",
    desc: "Digital banking, automated audit pipelines, high-frequency transaction processing, and SOC2 compliant fintech infrastructure.",
    fullOverview:
      "Financial engineering demands zero downtime, sub-millisecond execution, and strict compliance. Clickpoint builds modern fintech software ranging from automated ledger engines to AI-powered fraud prevention and wealth management copilots.",
    heroBadge: "Fintech & Banking Technology",
    href: "/industries/fintech",
    icon: Wallet,
    keyMetrics: [
      { label: "Daily Transaction Volume", value: "$50M+" },
      { label: "PCI-DSS & SOC2 Compliance", value: "100%" },
      { label: "Fraud Reduction Rate", value: "88%" },
    ],
    projects: [
      {
        id: "khataflow",
        title: "Khataflow AI Ledger Engine",
        client: "Khataflow Inc.",
        desc: "Real-time automated ledger reconciliation app with AI transaction categorizer and instant payout capabilities.",
        impact: "$42M+ Daily Volume Processed",
        liveUrl: "https://khataflow.com",
        techStack: ["Next.js", "TypeScript", "Python", "PostgreSQL", "Plaid API"],
        imageGradient: "from-violet-600 to-indigo-800",
      },
      {
        id: "finedge",
        title: "FinEdge Wealth Agent",
        client: "FinEdge Global",
        desc: "Autonomous financial advisor platform providing personalized portfolio balancing and automated tax harvest alerts.",
        impact: "120,000+ Active Investors | 4.9 / 5.0 Rating",
        liveUrl: "https://finedge.io",
        techStack: ["React Native", "FastAPI", "OpenAI", "Pinecone", "AWS"],
        imageGradient: "from-blue-600 to-cyan-800",
      },
    ],
    solutions: [
      { title: "Real-Time Payment Gateways", desc: "Sub-second ledger settlement with automated fraud checks and multi-currency exchange." },
      { title: "AI Compliance Auditing", desc: "Automated Anti-Money Laundering (AML) and Know-Your-Customer (KYC) verification pods." },
      { title: "Open Banking API Portals", desc: "Type-safe developer API portals with OAuth2 security and rate-limiting gateways." },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare & MedTech",
    subtitle: "HIPAA-Compliant Portals, AI Telehealth & Clinical Automation",
    desc: "HIPAA-compliant patient portals, FHIR interoperability, clinical decision AI support, and automated claims processing.",
    fullOverview:
      "We design and build secure, patient-centric healthcare systems that streamline clinical workflows and optimize patient outcomes while strictly adhering to HIPAA, HITECH, and FDA medical software standards.",
    heroBadge: "Healthcare & Digital Health",
    href: "/industries/healthcare",
    icon: HeartPulse,
    keyMetrics: [
      { label: "HIPAA & HITECH Compliant", value: "Verified" },
      { label: "Patient Encounters", value: "1.2M+" },
      { label: "Claims Processing Speed", value: "3.5x" },
    ],
    projects: [
      {
        id: "medipulse",
        title: "MediPulse AI Claims Assistant",
        client: "MediPulse Health",
        desc: "Automated medical code validation and health insurance claim auto-adjudication pipeline powered by NLP.",
        impact: "99.8% Claim Compliance Accuracy",
        liveUrl: "https://medipulse.health",
        techStack: ["Next.js", "Python", "FHIR API", "AWS HealthLake", "Tailwind"],
        imageGradient: "from-emerald-600 to-teal-800",
      },
      {
        id: "caresync",
        title: "CareSync Telehealth Suite",
        client: "CareSync Pods",
        desc: "HD encrypted video consultation platform integrated with electronic health records (EHR) and digital prescriptions.",
        impact: "450,000+ Consultations Hosted",
        liveUrl: "https://caresync.org",
        techStack: ["React", "WebRTC", "Node.js", "PostgreSQL", "Docker"],
        imageGradient: "from-teal-600 to-cyan-800",
      },
    ],
    solutions: [
      { title: "EHR / EMR System Integration", desc: "Bi-directional HL7 / FHIR data sync connecting electronic medical record providers." },
      { title: "AI Diagnostics Support", desc: "Clinical decision support models assisting triage nurses and medical practitioners." },
      { title: "Remote Patient Monitoring (RPM)", desc: "Real-time IoT device telemetry streaming vital signs to doctor dashboards." },
    ],
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Retail AI",
    subtitle: "AI Visual Search, Headless Commerce & Dynamic Personalization",
    desc: "Sub-second headless storefronts, AI visual search, dynamic pricing engines, and omnichannel checkout experiences.",
    fullOverview:
      "Modern e-commerce requires lightning-fast store performance and deeply personalized shopping experiences. We engineer headless commerce platforms, custom Shopify Plus apps, and AI recommendation engines.",
    heroBadge: "Headless E-Commerce & Retail",
    href: "/industries/ecommerce",
    icon: ShoppingBag,
    keyMetrics: [
      { label: "Checkout Conversion Lift", value: "+34%" },
      { label: "Page Load Speed", value: "0.4s" },
      { label: "GMV Handled", value: "$120M+" },
    ],
    projects: [
      {
        id: "caratlane",
        title: "Caratlane AI Visual Search & Try-On",
        client: "Caratlane",
        desc: "Computer vision product recommendation and AR try-on feature integrated into mobile & web checkout.",
        impact: "+34% Conversion Rate Lift",
        liveUrl: "https://caratlane.com",
        techStack: ["Next.js", "PyTorch", "Algolia", "Shopify Plus", "Tailwind"],
        imageGradient: "from-amber-600 to-rose-700",
      },
      {
        id: "omnicart",
        title: "OmniCart Dynamic Pricing Engine",
        client: "OmniCart Global",
        desc: "Automated competitor price monitoring and margin-maximizing dynamic repricing engine for multi-channel merchants.",
        impact: "3.8x ROI Compound in Year 1",
        liveUrl: "https://omnicart.shop",
        techStack: ["Python", "Redis", "Node.js", "TailwindCSS", "AWS"],
        imageGradient: "from-purple-600 to-amber-600",
      },
    ],
    solutions: [
      { title: "Headless Storefront Engineering", desc: "Next.js & Shopify Storefront API builds delivering 100/100 performance scores." },
      { title: "Personalized AI Search", desc: "Semantic visual and text product search understanding buyer intent." },
      { title: "Omnichannel Cart & Checkout", desc: "Unified mobile, web, and point-of-sale checkout with one-click payment options." },
    ],
  },
  {
    id: "saas",
    title: "SaaS & Enterprise Platforms",
    subtitle: "B2B Software Platforms, Multi-Tenant Cloud & Analytics",
    desc: "Scalable B2B SaaS web applications, multi-tenant database schemas, subscription billing, and real-time analytics.",
    fullOverview:
      "We help B2B software companies turn ideas into category-defining SaaS platforms. From multi-tenant data isolation to usage-based billing and automated onboarding flows, we build software designed to scale MRR.",
    heroBadge: "B2B SaaS & Cloud Software",
    href: "/industries/saas",
    icon: Layers,
    keyMetrics: [
      { label: "Active Enterprise Users", value: "250k+" },
      { label: "Tenant Isolation Security", value: "SOC2 Type II" },
      { label: "MRR Growth Boost", value: "+210%" },
    ],
    projects: [
      {
        id: "synthworks",
        title: "Synthworks AI Studio Platform",
        client: "Synthworks Inc.",
        desc: "Generative AI studio platform enabling enterprise creators to generate marketing copy and visual assets in seconds.",
        impact: "50,000+ Active Monthly Subscribers",
        liveUrl: "https://synthworks.ai",
        techStack: ["Next.js", "TypeScript", "TailwindCSS", "Stripe", "FastAPI"],
        imageGradient: "from-violet-600 to-indigo-900",
      },
      {
        id: "siachi",
        title: "Siachi Enterprise Workflow Engine",
        client: "Siachi Tech",
        desc: "No-code enterprise workflow orchestration platform with custom connector integrations and compliance logging.",
        impact: "99.99% Enterprise Uptime SLA",
        liveUrl: "https://siachi.io",
        techStack: ["TypeScript", "GraphQL", "Docker", "PostgreSQL", "AWS"],
        imageGradient: "from-indigo-600 to-blue-800",
      },
    ],
    solutions: [
      { title: "Multi-Tenant Architecture", desc: "Isolated schema topologies with tenant data encryption at rest and in transit." },
      { title: "Billing & Subscription Engine", desc: "Stripe & Chargebee integrations for tier plans, usage meters, and seats." },
      { title: "Embeddable Analytics Dashboards", desc: "Interactive chart components enabling your users to visualize their key data." },
    ],
  },
  {
    id: "logistics",
    title: "Logistics & Supply Chain",
    subtitle: "Fleet Telematics, AI Route Optimization & Warehouse Automation",
    desc: "IoT fleet tracking, route optimization algorithms, warehouse inventory robotics, and automated freight dispatch.",
    fullOverview:
      "Logistics operations demand real-time visibility and route efficiency. Clickpoint builds IoT-enabled logistics platforms, AI dispatch algorithms, and supply chain control towers that cut fuel costs and speed up fulfillment times.",
    heroBadge: "Logistics & Supply Chain AI",
    href: "/industries/logistics",
    icon: Truck,
    keyMetrics: [
      { label: "Fleet Mileage Monitored", value: "5M+ Miles" },
      { label: "Fuel Cost Reduction", value: "32%" },
      { label: "Dispatch Latency", value: "Real-time" },
    ],
    projects: [
      {
        id: "airblock",
        title: "Airblock Smart Dispatch Platform",
        client: "Airblock Cargo",
        desc: "Autonomous cargo routing and driver dispatch management system powered by real-time traffic and weather AI models.",
        impact: "32% Fleet Fuel Cost Reduction",
        liveUrl: "https://airblock.cargo",
        techStack: ["React Native", "Go", "Google Maps API", "Kafka", "PostgreSQL"],
        imageGradient: "from-blue-600 to-slate-800",
      },
      {
        id: "fleettrack",
        title: "FleetTrack Real-Time Telematics",
        client: "FleetTrack Global",
        desc: "IoT telemetry dashboard capturing vehicle diagnostic metrics, driver safety alerts, and predictive maintenance logs.",
        impact: "1,200,000+ Miles Monitored Daily",
        liveUrl: "https://fleettrack.net",
        techStack: ["Python", "IoT Gateways", "React", "PostgreSQL", "TimescaleDB"],
        imageGradient: "from-amber-600 to-orange-800",
      },
    ],
    solutions: [
      { title: "AI Route Optimization", desc: "Dynamic route calculation algorithms minimizing delivery times and driver fatigue." },
      { title: "IoT Sensor Telemetry", desc: "Real-time temperature, location, and speed streaming from truck sensors." },
      { title: "Warehouse Inventory Tracking", desc: "Barcode scanning and automated stock replenishment prediction models." },
    ],
  },
  {
    id: "edtech",
    title: "EdTech & Learning AI",
    subtitle: "Adaptive Learning Systems, AI Tutors & Virtual Campuses",
    desc: "AI tutoring assistants, interactive course platforms, gamified student portals, and university LMS integrations.",
    fullOverview:
      "We partner with educational institutions and EdTech startups to build engaging, personalized learning software powered by AI feedback loops, interactive video streaming, and real-time student analytics.",
    heroBadge: "EdTech & Education Technology",
    href: "/industries/edtech",
    icon: GraduationCap,
    keyMetrics: [
      { label: "Active Student Users", value: "350k+" },
      { label: "Course Completion Rate", value: "+45%" },
      { label: "AI Tutor Sessions", value: "2M+" },
    ],
    projects: [
      {
        id: "edulearn",
        title: "EduLearn AI Tutor Pod",
        client: "EduLearn Systems",
        desc: "24/7 interactive Socratic AI tutor providing personalized math & science homework assistance with step-by-step hints.",
        impact: "88% Student Test Score Improvement",
        liveUrl: "https://edulearn.ai",
        techStack: ["Next.js", "OpenAI API", "WebSockets", "TailwindCSS", "Vercel"],
        imageGradient: "from-violet-600 to-purple-800",
      },
      {
        id: "skillforge",
        title: "SkillForge Campus LMS",
        client: "SkillForge Platform",
        desc: "Modern higher-education learning management system featuring interactive video quizzes, gradebooks, and peer forums.",
        impact: "250,000+ Enrolled University Students",
        liveUrl: "https://skillforge.edu",
        techStack: ["React", "Node.js", "GraphQL", "PostgreSQL", "AWS S3"],
        imageGradient: "from-indigo-600 to-violet-800",
      },
    ],
    solutions: [
      { title: "Adaptive Learning Paths", desc: "AI algorithms matching content difficulty dynamically to individual student progress." },
      { title: "LTI / Canvas / Moodle Integration", desc: "Seamless single sign-on (SSO) and grade synchronization with existing LMS platforms." },
      { title: "Gamified Engagement Modules", desc: "Streak counters, badges, and leaderboard mechanics that boost completion." },
    ],
  },
];

export const TEAM_MEMBERS_DATA: TeamMember[] = [
  {
    id: "ashok-khanal",
    name: "Ashok Khanal",
    role: "Founder & Chief Executive Officer (CEO)",
    bio: "Pioneering AI-first digital product engineering and enterprise technology transformation across global markets.",
    avatarGradient: "from-violet-600 via-indigo-600 to-ember-500",
    initials: "AS",
    expertise: ["Product Strategy", "AI Leadership", "Enterprise Growth"],
  },
  {
    id: "rabin-shrestha",
    name: "Rabin Shrestha",
    role: "Chief Technology Officer (CTO & AI Architect)",
    bio: "Ex-BigTech AI lead architecting LLM copilot pods, vector indexing pipelines, and distributed multi-cloud systems.",
    avatarGradient: "from-indigo-600 to-blue-700",
    initials: "RS",
    expertise: ["LLM Architectures", "Distributed Systems", "Vector Databases"],
  },
  {
    id: "nisha-khanal",
    name: "Nisha Khanal",
    role: "Head of Digital Marketing & SEO",
    bio: "Performance growth strategist scaling B2B SaaS ARR through scientific CRO, technical SEO, and automated lifecycle engines.",
    avatarGradient: "from-ember-500 to-amber-600",
    initials: "NK",
    expertise: ["Digital Marketing", "Technical SEO", "Growth CRO"],
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Head of Product & UI/UX Design",
    bio: "Award-winning product designer creating human-centric design systems, micro-animations, and conversion-optimized interfaces.",
    avatarGradient: "from-purple-600 to-pink-600",
    initials: "MV",
    expertise: ["Design Systems", "Usability Research", "Figma & Motion"],
  },
  {
    id: "priya-patel",
    name: "Priya Patel",
    role: "VP of Engineering & MLOps",
    bio: "MLOps engineering lead automating production ML pipelines, real-time drift monitoring, and zero-downtime microservices.",
    avatarGradient: "from-emerald-600 to-teal-700",
    initials: "PP",
    expertise: ["MLOps Pipelines", "Kubernetes", "PyTorch & Retraining"],
  },
  {
    id: "david-chen",
    name: "David Chen",
    role: "Head of Enterprise Solutions & Cloud Security",
    bio: "Cloud security specialist enforcing SOC2 Type II compliance, multi-tenant database isolation, and zero-trust infrastructure.",
    avatarGradient: "from-cyan-600 to-blue-800",
    initials: "DC",
    expertise: ["Cloud Security", "SOC2 Compliance", "Terraform & AWS"],
  },
];

export const COMPANY_DATA: CompanyLink[] = [
  { id: "about", title: "About Us", desc: "Our story, vision & leadership team", href: "/about", icon: Building2 },
  { id: "journey", title: "Our Journey & Events", desc: "Milestones, events & culture gallery", href: "/journey", icon: Milestone },
  { id: "careers", title: "Careers", desc: "Join our global engineering team", badge: "Hiring", href: "/careers", icon: Briefcase },
  { id: "case-studies", title: "Case Studies", desc: "Client success metrics & launches", href: "/case-studies", icon: FileText },
  { id: "testimonials", title: "Testimonials", desc: "Verified client reviews & impact", href: "/testimonials", icon: Star },
  { id: "blog", title: "Blog & Insights", desc: "Technical guides & AI insights", href: "/blog", icon: BookOpen },
  { id: "faqs", title: "Help & FAQs", desc: "Knowledgebase & common questions", href: "/faqs", icon: HelpCircle },
];

export const STATS_DATA: StatItem[] = [
  { id: "growth-rate", value: 89, suffix: "%", label: "Growth in driving business value" },
  { id: "projects-delivered", value: 350, suffix: "+", label: "Successful projects delivered" },
  { id: "team-size", value: 150, suffix: "+", label: "Skilled engineering professionals" },
  { id: "tech-experts", value: 50, suffix: "+", label: "Cutting-edge tech stack experts" },
  { id: "active-clients", value: 200, suffix: "+", label: "Global clients trusting our solutions" },
  { id: "years-exp", value: 8, suffix: "+", label: "Years pioneering AI-driven products" },
];

export const MILESTONES_DATA: MilestoneItem[] = [
  {
    year: "2016",
    title: "Clickpoint is Founded",
    subtitle: "Seed Stage & MVP Factory",
    desc: "Started as a 4-person dev shop shipping lean architectures for high-growth tech startups.",
    tags: ["MVP Development", "Full Stack", "Cloud Native"],
    iconName: "Rocket",
    icon: Rocket,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2018",
    title: "First 20-Person Core Team",
    subtitle: "UI/UX & Product Design Practice",
    desc: "Established our dedicated design system squad and crossed 50+ enterprise product launches.",
    tags: ["Design Systems", "Product Strategy", "Scale"],
    iconName: "Users",
    icon: Users,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2020",
    title: "Global Delivery Pods",
    subtitle: "24/7 Distributed Engineering",
    desc: "Expanded remote engineering hubs across 3 timezones to provide seamless 24/7 product delivery.",
    tags: ["Global Pods", "DevOps", "24/7 Delivery"],
    iconName: "Globe2",
    icon: Globe2,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2022",
    title: "Applied AI Practice Launch",
    subtitle: "Intelligent Systems Integration",
    desc: "Stood up our specialized AI division delivering LLM copilots, autonomous agents, and production ML pipelines.",
    tags: ["LLMs", "AI Agents", "MLOps"],
    iconName: "Cpu",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2024",
    title: "150+ Engineers & 350+ Launches",
    subtitle: "Market Recognition & Scale",
    desc: "Recognized as a top-tier digital transformation partner across FinTech, Healthcare, and SaaS verticals.",
    tags: ["Enterprise Grade", "SOC2 Compliant", "Multi-Cloud"],
    iconName: "Award",
    icon: Award,
    image: "https://images.unsplash.com/photo-1542744801-30d009c25f46?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2026",
    title: "Enterprise AI Scale",
    subtitle: "Category Transformation",
    desc: "Architecting end-to-end enterprise AI transformation frameworks for Fortune 500 category leaders.",
    tags: ["Enterprise AI", "Custom Models", "Governance"],
    iconName: "TrendingUp",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  },
];

export const CLIENT_LOGOS_DATA: ClientLogo[] = [
  { name: "Khataflow", category: "Fintech" },
  { name: "Zaggle", category: "Enterprise" },
  { name: "Caratlane", category: "E-Commerce" },
  { name: "Synthworks", category: "AI & ML" },
  { name: "Airblock", category: "Cloud" },
  { name: "Siachi", category: "SaaS" },
  { name: "FinEdge", category: "Banking" },
  { name: "Datamind", category: "Analytics" },
];

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: "ai-integration-guide",
    slug: "ai-integration-guide",
    title: "How to Integrate AI into Your Application: A Guide for Tech Leaders",
    excerpt: "The digital landscape is shifting fast. Integrating AI isn't about hype — it's about automating core business workflows and delivering sub-second user value.",
    content: `
      ## The Strategic Shift to AI-Native Software Engineering

      In 2026, software applications without embedded intelligence are quickly falling behind. Integrating Artificial Intelligence (AI) and Large Language Models (LLMs) into your product infrastructure goes far beyond wrapping a basic API call around ChatGPT. It requires a fundamental shift in database design, API rate-limiting, vector search, and asynchronous background worker queues.

      ### 1. Identifying High-ROI Automation Opportunities
      Before writing a single line of code, technical leaders must perform an AI Audit across user journeys:
      - **Knowledge Retrieval**: Automating document search with Retrieval-Augmented Generation (RAG).
      - **Agentic Workflows**: Multi-agent pods executing complex multi-step data pipelines.
      - **Personalization**: Dynamic user recommendations based on real-time behavior embeddings.

      \`\`\`typescript
      // Example: Type-Safe Autonomous Agent Pod Configuration
      export interface AgentConfig {
        name: string;
        model: "gpt-4o" | "claude-3-5-sonnet";
        temperature: number;
        vectorDatabase: "pinecone" | "pgvector";
      }
      \`\`\`

      ### 2. Building a Production Vector Index Pipeline
      To eliminate model hallucinations, enterprise platforms connect domain datasets to vector databases like Pinecone, Weaviate, or PgVector. By storing chunked text embeddings, your app retrieves relevant contextual snippets before feeding them to the LLM context window.

      ### Key Takeaways for Tech Executives
      - **Data Privacy First**: Enforce strict tenant isolation so enterprise data is never leaked into public training runs.
      - **Sub-Second SLA**: Use streaming responses (Server-Sent Events) to maintain instant UI feedback.
      - **Fallback Deterministic Rules**: Always provide deterministic fallbacks when AI confidence scores drop below 92%.
    `,
    category: "AI & Machine Learning",
    author: {
      name: "Ashok Khanal",
      role: "Founder & CEO",
      avatar: "AK",
    },
    publishedAt: "July 28, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1000&q=80",
    featured: true,
    tags: ["Artificial Intelligence", "LLMs", "RAG", "Vector Search"],
  },
  {
    id: "mobile-dev-platforms-2026",
    slug: "mobile-dev-platforms-2026",
    title: "Best Mobile App Development Platforms for 2026: Flutter vs React Native",
    excerpt: "Comparing top cross-platform mobile frameworks including Flutter, React Native, and Swift Native. Which stack offers the highest performance for your startup?",
    content: `
      ## Navigating the Mobile Stack Landscape in 2026

      Choosing the right mobile technology stack directly impacts your time-to-market, app store rating, and long-term maintenance overhead. Both Flutter and React Native have reached peak maturity, powering Fortune 500 apps with near-native 120Hz rendering.

      ### Flutter: Uncompromising Performance & Custom Graphics
      Flutter's Impeller rendering engine compiles directly to native ARM machine code, bypassing bridge bottlenecks entirely. It is ideal for visual-heavy apps, fintech charting platforms, and IoT telemetry monitors.

      ### React Native: Web-to-Mobile Code Sharing
      React Native with Fabric architecture allows full-stack teams to reuse up to 80% of business logic across Next.js web applications and mobile clients using TypeScript.

      \`\`\`tsx
      // Unified Cross-Platform Component Pattern
      import { View, Text } from 'react-native';

      export const MetricBadge = ({ label, value }: { label: string; value: string }) => (
        <View className="p-4 bg-violet-600 rounded-2xl">
          <Text className="text-white font-bold">{value}</Text>
          <Text className="text-violet-200 text-xs">{label}</Text>
        </View>
      );
      \`\`\`
    `,
    category: "App Development",
    author: {
      name: "Rabin Shrestha",
      role: "CTO & AI Architect",
      avatar: "RS",
    },
    publishedAt: "July 24, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80",
    featured: true,
    tags: ["Mobile Dev", "React Native", "Flutter", "iOS & Android"],
  },
  {
    id: "responsive-website-growth",
    slug: "responsive-website-growth",
    title: "How a Responsive Website & SSR App Router Accelerate Business Growth",
    excerpt: "In 2026, web responsiveness isn't optional — it's the core driver of search engine authority, user conversion, and brand trust.",
    content: `
      ## High Performance is the Ultimate Growth Lever

      Google's Core Web Vitals algorithms aggressively penalize websites with slow First Contentful Paint (FCP) or cumulative layout shifts. Modern web engineering leverages Next.js App Router and edge caching to achieve sub-second global render speed.

      ### Modern Responsive Design Tokens
      Static breakpoints are a thing of the past. Modern responsive design relies on fluid typography, CSS container queries, and sub-second glassmorphism.
    `,
    category: "Web Development",
    author: {
      name: "Elena Rostova",
      role: "Head of Growth & SEO",
      avatar: "ER",
    },
    publishedAt: "July 20, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
    featured: true,
    tags: ["Web Dev", "Next.js", "Core Web Vitals", "SEO"],
  },
  {
    id: "digital-marketing-software-integration",
    slug: "digital-marketing-software-integration",
    title: "The Power of Digital Marketing and Full-Stack Software Integration",
    excerpt: "Discover how aligning your marketing funnels with custom backend analytics, programmatic content, and CRO automation drives exponential revenue scaling.",
    content: `
      ## Bridging Marketing Technology & Software Architecture

      Traditional growth marketing relies on disconnected third-party pixels that miss up to 40% of conversion events due to ad blockers and browser privacy restrictions. 

      By building server-side analytics pipelines connected to PostHog, Mixpanel, and custom CRM webhooks, engineering teams empower marketers with 100% accurate customer LTV data.
    `,
    category: "Growth & SEO",
    author: {
      name: "Elena Rostova",
      role: "Head of Growth & SEO",
      avatar: "ER",
    },
    publishedAt: "July 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1000&q=80",
    tags: ["Digital Marketing", "Analytics", "Growth", "CRO"],
  },
  {
    id: "fullstack-web-architecture-guide",
    slug: "fullstack-web-architecture-guide",
    title: "Beginner's & Enterprise Guide to Full-Stack Web Architecture",
    excerpt: "What is full-stack web engineering in 2026? Learn how React, TypeScript, PostgreSQL, and serverless edge functions fit together.",
    content: `
      ## The Evolution of Full-Stack Architecture

      Full-stack development has evolved from simple LAMP stacks to type-safe end-to-end architectures where database schemas automatically sync with front-end React components.
    `,
    category: "Web Development",
    author: {
      name: "Marcus Vance",
      role: "Head of Product Design",
      avatar: "MV",
    },
    publishedAt: "July 10, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
    tags: ["Full Stack", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    id: "rideshare-logistics-app-engineering",
    slug: "rideshare-logistics-app-engineering",
    title: "On-Demand Mobility & Logistics App Engineering: Architectural Blueprint",
    excerpt: "Building high-throughput real-time location streaming, driver dispatch algorithms, and WebSocket telemetry systems at enterprise scale.",
    content: `
      ## Real-Time Spatial Telemetry at Scale

      On-demand rideshare and logistics platforms require zero-latency GPS location streaming, geospatial indexing with H3 / S2 libraries, and automated driver dispatch engines.
    `,
    category: "App Development",
    author: {
      name: "Priya Patel",
      role: "VP of Engineering & MLOps",
      avatar: "PP",
    },
    publishedAt: "July 08, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80",
    tags: ["Logistics", "Mobile App", "WebSockets", "IoT"],
  },
  {
    id: "ecommerce-must-have-features-2026",
    slug: "ecommerce-must-have-features-2026",
    title: "Must-Have E-Commerce Features That Drive Conversion & Repeat Orders",
    excerpt: "Detailed guide on headless commerce storefronts, AI visual product search, one-click mobile checkout, and automated dynamic pricing.",
    content: `
      ## The Headless E-Commerce Advantage

      Monolithic e-commerce platforms often struggle with sluggish page loads and rigid checkout templates. Headless architecture decouples front-end Next.js stores from backend commerce engines, enabling 100/100 Lighthouse scores and seamless 1-click payments.
    `,
    category: "E-Commerce",
    author: {
      name: "Ashok Khanal",
      role: "Founder & CEO",
      avatar: "AK",
    },
    publishedAt: "July 04, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1556742049-0a670fc8a5d7?auto=format&fit=crop&w=1000&q=80",
    tags: ["E-Commerce", "Headless", "Conversion", "Shopify"],
  },
  {
    id: "custom-mobile-app-development-guide",
    slug: "custom-mobile-app-development-guide",
    title: "Custom Mobile App Development for Scalable Enterprise Apps",
    excerpt: "A complete step-by-step roadmap for enterprise product teams building high-security, offline-first iOS and Android mobile solutions.",
    content: `
      ## Custom Engineering vs Off-the-Shelf Mobile Templates

      Off-the-shelf mobile app builders quickly hit architectural walls when handling custom biometric authentication, offline data sync, and complex push notification triggers.
    `,
    category: "App Development",
    author: {
      name: "Aarav Sharma",
      role: "CTO & AI Architect",
      avatar: "AS",
    },
    publishedAt: "June 28, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1000&q=80",
    tags: ["Mobile Engineering", "iOS", "Android", "Enterprise"],
  },
  {
    id: "python-ai-backend-2026",
    slug: "python-ai-backend-2026",
    title: "Is Python Still the Gold Standard for AI & Backend Services in 2026?",
    excerpt: "How Python's ecosystem (FastAPI, PyTorch, LangChain, vLLM) continues to dominate machine learning engineering and high-speed API microservices.",
    content: `
      ## The Unstoppable Dominance of Python in AI

      Despite performance challenges in pure CPU compute loops, Python's C-extension bindings (NumPy, PyTorch, vLLM) make it the undisputed runtime choice for machine learning, AI model orchestration, and asynchronous FastAPI microservices.
    `,
    category: "AI & Machine Learning",
    author: {
      name: "Priya Patel",
      role: "VP of MLOps",
      avatar: "PP",
    },
    publishedAt: "June 22, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    tags: ["Python", "FastAPI", "AI", "PyTorch"],
  },
  {
    id: "native-vs-hybrid-mobile-apps",
    slug: "native-vs-hybrid-mobile-apps",
    title: "Native App vs Cross-Platform Hybrid: Which Is Right for Your Product?",
    excerpt: "Key architectural differences, cost trade-offs, and performance benchmarks between native Swift/Kotlin and React Native/Flutter builds.",
    content: `
      ## Deciding Between Native Swift/Kotlin & React Native

      When building digital products, choosing between native Swift/Kotlin development and cross-platform frameworks depends on device hardware integration needs and team speed goals.
    `,
    category: "App Development",
    author: {
      name: "Aarav Sharma",
      role: "CTO & AI Architect",
      avatar: "AS",
    },
    publishedAt: "June 16, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80",
    tags: ["Mobile", "Native", "Swift", "Kotlin"],
  },
  {
    id: "custom-software-vs-off-the-shelf",
    slug: "custom-software-vs-off-the-shelf",
    title: "Custom Software vs Off-the-Shelf: Choosing the Optimal Path for Growth",
    excerpt: "Evaluating scalability, long-term TCO, data sovereignty, and security when deciding between custom software builds and SaaS subscriptions.",
    content: `
      ## When Off-the-Shelf SaaS Reaches Its Limits

      Pre-packaged SaaS software is great for generic back-office tasks, but custom software builds create proprietary competitive moats that differentiate enterprise market leaders.
    `,
    category: "Enterprise Software",
    author: {
      name: "David Chen",
      role: "Head of Cloud Security",
      avatar: "DC",
    },
    publishedAt: "June 10, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    tags: ["Enterprise", "Custom Software", "Cloud"],
  },
  {
    id: "mobile-app-security-features",
    slug: "mobile-app-security-features",
    title: "12 Must-Have Security & Performance Features for Every Enterprise App",
    excerpt: "App security requires biometric encryption, certificate pinning, rate-limiting, and zero-trust token refresh standards.",
    content: `
      ## Hardening Enterprise Mobile Applications

      Protecting user data requires multi-layered security controls ranging from TLS certificate pinning to biometric Keychain storage and automated dependency auditing.
    `,
    category: "Cloud & Security",
    author: {
      name: "David Chen",
      role: "Head of Cloud Security",
      avatar: "DC",
    },
    publishedAt: "June 04, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
    tags: ["Security", "SOC2", "Mobile", "Cloud"],
  },
];

