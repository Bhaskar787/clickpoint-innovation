"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Milestone,
  Calendar,
  MapPin,
  Users,
  Award,
  Zap,
  Sparkles,
  ChevronRight,
  ArrowRight,
  X,
  Camera,
  CheckCircle2,
  Trophy,
  Rocket,
  Globe2,
  Code2,
  Building2,
  Bot,
  Layers,
  Quote,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import QuickEnquiryModal from "@/components/common/quick-enquiry-modal";

// Era Story Node Interface
interface TimelineEra {
  id: string;
  yearRange: string;
  displayYear: string;
  title: string;
  subtitle: string;
  narrativeParagraphs: string[];
  quoteText?: string;
  quoteAuthor?: string;
  imageUrl: string;
  stats: { label: string; value: string }[];
  achievements: string[];
}

// Company Events & Gallery Data
interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Tech Summits" | "Hackathons" | "Global Expansion" | "Team Culture" | "Product Launches";
  date: string;
  location: string;
  imageUrl: string;
  colSpanDesktop?: string;
  heightClass?: string;
  highlights: string[];
  fullStory: string;
  attendees?: string;
  keyMetric?: string;
}

// Timeline Era Data (Matching the reference layout)
const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: "era-2016",
    yearRange: "2016 - 2017",
    displayYear: "2016s",
    title: "Founding Clickpoint Innovation",
    subtitle: "The Inception of High-Concurrency Engineering",
    narrativeParagraphs: [
      "Clickpoint Innovation was founded in Kathmandu, Nepal by a small team of 4 dedicated engineers with a bold vision: to build reliable, high-speed software architectures that compound business value for ambitious startups.",
      "Working out of a lean dev studio, our founders prioritized 100% test-driven code, sub-second API execution, and zero-compromise product engineering. In our very first year, we delivered 12 production MVPs across North America and Europe.",
    ],
    quoteText: "Software engineering shouldn't just meet specifications—it must compound in speed and value every single week.",
    quoteAuthor: "Founding Engineering Team",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    stats: [
      { label: "Founding Team", value: "4 Engineers" },
      { label: "First Year MVPs", value: "12 Shipped" },
      { label: "Core Protocol", value: "100% TDD" },
    ],
    achievements: [
      "Inaugurated first engineering office in Kathmandu",
      "Delivered 12 enterprise MVPs for US & European startups",
      "Established 100% test-driven development protocol",
    ],
  },
  {
    id: "era-2018",
    yearRange: "2018 - 2020",
    displayYear: "2018-2020",
    title: "FinTech & Cloud Microservices",
    subtitle: "Scaling Enterprise Banking & Transaction Systems",
    narrativeParagraphs: [
      "As demand for resilient cloud architecture grew, Clickpoint expanded its engineering pods to support banking platforms, high-frequency transaction microservices, and large-scale SaaS engines processing millions of daily API calls.",
      "We established specialized UI/UX design system squads and achieved strict SOC2 and ISO 27001 data compliance benchmarks, solidifying our reputation as a trusted enterprise technology partner.",
    ],
    quoteText: "Handling 15 Million daily transaction calls required zero-downtime microservice architecture and SOC2 security guarantees.",
    quoteAuthor: "Head of Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
    stats: [
      { label: "Engineers Count", value: "28 Pods" },
      { label: "Daily API Calls", value: "15M+" },
      { label: "Uptime Rating", value: "99.99%" },
    ],
    achievements: [
      "Partnered with top tier South Asian FinTech & Payment gateways",
      "Expanded engineering stack to Go, AWS Kubernetes & Cloud Infra",
      "Achieved SOC2 & ISO 27001 data compliance benchmarks",
    ],
  },
  {
    id: "era-2021",
    yearRange: "2021 - 2022",
    displayYear: "2021-2022",
    title: "Global Hubs & International Pods",
    subtitle: "Embedding Senior Engineering Talent Worldwide",
    narrativeParagraphs: [
      "Clickpoint scaled its footprint internationally, establishing engagement hubs in the United Kingdom and North America. Our dedicated engineering pods embedded directly with client product leadership, operating as seamless extensions of their internal teams.",
      "Through our Clickpoint Accelerator program, we helped fast-growth tech companies launch category-defining platforms while maintaining a 98% long-term client retention rate.",
    ],
    quoteText: "Connecting global talent with enterprise ambition allowed us to ship complex cloud software across 8 active countries.",
    quoteAuthor: "VP of Global Delivery",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    stats: [
      { label: "Global Team", value: "65+ Members" },
      { label: "Active Countries", value: "8 Nations" },
      { label: "Client Retention", value: "98%" },
    ],
    achievements: [
      "Established UK & US client engagement hubs",
      "Launched Clickpoint Accelerator program for fast-growth ventures",
      "Engineered automated CI/CD deployment pipelines for enterprise scale",
    ],
  },
  {
    id: "era-2023",
    yearRange: "2023 - 2024",
    displayYear: "2023-2024",
    title: "The AI Pivot & Autonomous LLMs",
    subtitle: "Pioneering Copilots & Vector Knowledge Bases",
    narrativeParagraphs: [
      "Recognizing the transformative shift in artificial intelligence, Clickpoint launched the Clickpoint AI Studio. We pioneered custom LLM integration, RAG vector database indexing, and autonomous agent workflows.",
      "Our AI engineers built production-grade copilot interfaces for Legal, Healthcare, and Financial verticals, cutting execution latency to under 250ms with 99.4% execution accuracy.",
    ],
    quoteText: "AI shouldn't just answer questions—it should operate autonomously as an intelligent knowledge worker for your business.",
    quoteAuthor: "Chief AI Architect",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    stats: [
      { label: "AI Specialists", value: "35 Engineers" },
      { label: "Vector Indexes", value: "50+ Active" },
      { label: "Efficiency Gain", value: "4.5x" },
    ],
    achievements: [
      "Launched Clickpoint Autonomous Agent Framework",
      "Built multi-modal domain LLM pipelines for Legal & Healthcare",
      "Formed AI R&D lab testing fine-tuned open-source models",
    ],
  },
  {
    id: "era-2025",
    yearRange: "2025",
    displayYear: "2025",
    title: "150+ Engineers & State-of-the-Art HQ",
    subtitle: "500-Seat High-Tech Campus Inauguration",
    narrativeParagraphs: [
      "In 2025, Clickpoint inaugurated its multi-story 45,000 sq ft eco-friendly engineering campus in Kathmandu, Nepal, accommodating over 150+ full-time engineers, designers, and AI specialists.",
      "We celebrated completing over 250+ enterprise systems, hosted South Asia's largest 72-Hour Autonomous AI Hackathon, and earned top recognition among global AI engineering consultancies.",
    ],
    quoteText: "Our new state-of-the-art campus represents our long-term commitment to nurturing world-class engineering talent.",
    quoteAuthor: "Chief Operating Officer",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    stats: [
      { label: "Engineers", value: "150+ Staff" },
      { label: "Projects Completed", value: "250+ Shipped" },
      { label: "Campus Size", value: "45k Sq Ft" },
    ],
    achievements: [
      "Opened state-of-the-art 500-seat Nepal Engineering HQ",
      "Named Top AI & Full-Stack Consultancy by Global Tech Review",
      "Hosted South Asia's largest 72-Hour Autonomous AI Agent Hackathon",
    ],
  },
  {
    id: "era-present",
    yearRange: "2026 - Present",
    displayYear: "Present",
    title: "Next-Gen Agentic Intelligence",
    subtitle: "Building Self-Healing Cloud Platforms & Edge AI",
    narrativeParagraphs: [
      "Today, Clickpoint Innovation continues to lead the evolution of AI-first software engineering. Our teams are deploying self-healing cloud microservices, zero-latency edge AI nodes, and autonomous agentic workflows.",
      "Under the leadership of our engineering directors and senior AI architects, we remain relentlessly focused on helping global enterprises scale faster and smarter.",
    ],
    quoteText: "Our mission remains unchanged: delivering world-class AI and digital solutions that compound business velocity every day.",
    quoteAuthor: "Clickpoint Executive Board",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    stats: [
      { label: "Target Engineers", value: "250+ Staff" },
      { label: "Global Reach", value: "12+ Nations" },
      { label: "Client Retention", value: "99.2%" },
    ],
    achievements: [
      "Deploying self-learning agentic pods for fortune 500 enterprises",
      "Expanding research into zero-shot multi-modal agents",
      "Scaling international pod footprint across APAC, EMEA, and Americas",
    ],
  },
];

// Company Events & Gallery Data
const COMPANY_EVENTS: EventItem[] = [
  {
    id: "ai-summit-2025",
    title: "Clickpoint AI Summit 2025",
    subtitle: "Unveiling Autonomous Enterprise AI Pods",
    category: "Tech Summits",
    date: "November 14, 2025",
    location: "Grand Ballroom, Kathmandu & Virtual Live Stream",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    colSpanDesktop: "lg:col-span-2",
    heightClass: "h-[380px] sm:h-[420px]",
    attendees: "800+ Delegates & Tech Leaders",
    keyMetric: "4 Keynote Demos",
    highlights: [
      "Live demonstration of multi-agent reasoning loop executing financial reconciliation in < 3 seconds",
      "Keynote talks by Clickpoint Chief AI Officer and guest cloud architects",
      "Interactive hands-on sandbox workshops for 200+ enterprise CTOs",
    ],
    fullStory:
      "The Clickpoint AI Summit 2025 brought together engineering leaders, startup founders, and AI researchers from across 12 countries. Our lead AI architects showcased production benchmarks of autonomous LLM agent pods operating on complex multi-database schemas with 99.4% execution precision.",
  },
  {
    id: "hackathon-2025",
    title: "Annual 72-Hour AI Hackathon",
    subtitle: "Building Zero-Latency Edge Agents",
    category: "Hackathons",
    date: "August 22-24, 2025",
    location: "Clickpoint R&D Lab Campus",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    colSpanDesktop: "lg:col-span-1",
    heightClass: "h-[380px] sm:h-[420px]",
    attendees: "120+ Internal Developers",
    keyMetric: "18 Projects Shipped",
    highlights: [
      "18 working prototypes built in 72 non-stop hours",
      "Winning team built a self-healing Next.js code reviewer agent",
      "Judged by international venture partners & senior engineering leads",
    ],
    fullStory:
      "Our annual internal hackathon tests the limits of raw engineering creativity. 24 teams competed around the clock to push the boundaries of LLM latency, vector cache optimization, and real-time streaming interfaces.",
  },
  {
    id: "hq-opening-2025",
    title: "Inauguration of Nepal Tech HQ",
    subtitle: "500-Seat High-Tech Campus Launch",
    category: "Global Expansion",
    date: "May 10, 2025",
    location: "New Baneshwor, Kathmandu, Nepal",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    colSpanDesktop: "lg:col-span-1",
    heightClass: "h-[380px] sm:h-[400px]",
    attendees: "300+ Guests & VIPs",
    keyMetric: "45,000 Sq Ft Facility",
    highlights: [
      "State-of-the-art facility with dedicated AI inference pods & acoustic dev spaces",
      "Solar-powered microgrid reducing campus carbon footprint by 75%",
      "Inaugurated by industry leaders and university tech department heads",
    ],
    fullStory:
      "Marking a huge milestone in Clickpoint's growth, we opened our brand new 5-story engineering campus equipped with dedicated innovation labs, hardware test suites, and collaborative open-plan design zones.",
  },
  {
    id: "team-retreat-2025",
    title: "Global Team Retreat & Offsite",
    subtitle: "Fostering Deep Culture & Alignment",
    category: "Team Culture",
    date: "October 05, 2025",
    location: "Pokhara Lakeside & Annapurna Range",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    colSpanDesktop: "lg:col-span-2",
    heightClass: "h-[380px] sm:h-[400px]",
    attendees: "150+ Team Members",
    keyMetric: "3 Days Bonding",
    highlights: [
      "3-day immersive retreat featuring team hackathons, mountain treks, and strategy sessions",
      "Celebrated 10 years of compounding company achievements and award recognitions",
      "Cross-functional team building between Nepal, UK, and remote international engineers",
    ],
    fullStory:
      "Culture is the engine behind Clickpoint's technical excellence. Our annual offsite brought together team members from across 5 timezones for high-energy strategy workshops, outdoor adventures, and team celebrations.",
  },
  {
    id: "london-expo-2024",
    title: "London Tech Week & AI Expo",
    subtitle: "Showcasing Enterprise Copilots to EMEA Leaders",
    category: "Product Launches",
    date: "June 18, 2024",
    location: "ExCeL London, United Kingdom",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    colSpanDesktop: "lg:col-span-1",
    heightClass: "h-[360px]",
    attendees: "1,500+ Booth Visitors",
    keyMetric: "25+ Enterprise Leads",
    highlights: [
      "Demonstrated custom LLM data privacy pipelines to European banking executives",
      "Keynote panel on 'Accelerating Enterprise Velocity with AI'",
      "Signed major partnership agreements with UK FinTech leaders",
    ],
    fullStory:
      "Clickpoint represented South Asia's leading AI engineering talent at London Tech Week, demonstrating live production copilot architectures operating with sub-200ms latency.",
  },
  {
    id: "ai-lab-workshop",
    title: "AI R&D Lab Open Day",
    subtitle: "Experimenting with Open-Source Reasoning Models",
    category: "Tech Summits",
    date: "February 15, 2026",
    location: "Clickpoint AI R&D Center",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    colSpanDesktop: "lg:col-span-1",
    heightClass: "h-[360px]",
    attendees: "60+ AI Specialists",
    keyMetric: "5 Model Benchmarks",
    highlights: [
      "Deep dive into vLLM inference quantization and memory optimization",
      "Benchmarking open-source Llama & DeepSeek models against proprietary APIs",
      "Hands-on demonstration of local vector indexing architectures",
    ],
    fullStory:
      "Our AI R&D team hosts regular internal knowledge exchanges where developers present benchmark results, novel prompting frameworks, and model fine-tuning experiments.",
  },
];

export default function JourneyPage() {
  const [activeEraIndex, setActiveEraIndex] = useState<number>(4); // Default to 2025
  const [selectedCategory, setSelectedCategory] = useState<string>("All Events");
  const [activeEventModal, setActiveEventModal] = useState<EventItem | null>(null);
  const [isQuickEnquiryOpen, setIsQuickEnquiryOpen] = useState(false);

  const activeEra = TIMELINE_ERAS[activeEraIndex];

  // Filter events by category
  const filteredEvents =
    selectedCategory === "All Events"
      ? COMPANY_EVENTS
      : COMPANY_EVENTS.filter((e) => e.category === selectedCategory);

  const categories = [
    "All Events",
    "Tech Summits",
    "Hackathons",
    "Global Expansion",
    "Team Culture",
    "Product Launches",
  ];

  return (
    <div className="min-h-screen bg-background text-ink dark:text-white transition-colors duration-200">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-gradient-to-b from-violet-50/70 via-background to-background dark:from-[#090b1c] dark:via-[#0b0e26] dark:to-background border-b border-violet-100 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-violet-400/30 via-indigo-300/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-amber-400/20 to-transparent blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">Our Journey & Events</span>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300 shadow-xs backdrop-blur-md">
              <Milestone className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              <span>Decade of Engineering Excellence & Events</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
              Tracing Our Evolution from Dev Studio to{" "}
              <span className="text-violet-600 dark:text-[#f58220]">Global AI Powerhouse</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-ink/75 dark:text-slate-300 sm:text-lg lg:text-xl max-w-3xl mx-auto">
              Explore the milestone timeline, breakthroughs, and company events that defined Clickpoint Innovation’s journey over the past decade.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: INTERACTIVE HORIZONTAL TIMELINE (EXACT REFERENCE DESIGN) ================= */}
      <section className="py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-b border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* TOP DISPLAY AREA: 2-COLUMN STORY & IMAGE (MATCHING SCREENSHOT) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEra.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center mb-16 sm:mb-24"
            >
              {/* LEFT COLUMN: STORY CONTENT */}
              <div className="lg:col-span-7 space-y-5">
                <span className="text-sm font-semibold tracking-wider text-ink/60 dark:text-slate-400 uppercase">
                  {activeEra.yearRange}
                </span>

                <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl">
                  Our Story
                </h2>

                <p className="text-xs font-bold uppercase tracking-wider text-[#f58220]">
                  {activeEra.subtitle}
                </p>

                <div className="space-y-4 text-base leading-relaxed text-ink/80 dark:text-slate-300 sm:text-lg">
                  {activeEra.narrativeParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Key Stats Bar */}
                <div className="pt-4 grid grid-cols-3 gap-3 border-t border-violet-200/80 dark:border-slate-800">
                  {activeEra.stats.map((st, i) => (
                    <div key={i}>
                      <p className="font-display text-lg font-extrabold text-violet-600 dark:text-violet-300 sm:text-xl">
                        {st.value}
                      </p>
                      <p className="text-[11px] font-semibold text-ink/60 dark:text-slate-400">{st.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: HIGH-RES ERA PHOTO CARD */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-3 shadow-2xl">
                  <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={activeEra.imageUrl}
                      alt={activeEra.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-violet-600/90 text-white px-3 py-1 text-xs font-bold backdrop-blur-md">
                        {activeEra.displayYear} Era
                      </span>
                    </div>

                    {/* Bottom Caption Overlay */}
                    {activeEra.quoteText && (
                      <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-slate-950/80 p-4 text-xs text-white backdrop-blur-md border border-white/10">
                        <Quote className="h-4 w-4 text-violet-400 mb-1" />
                        <p className="italic text-slate-200">{activeEra.quoteText}</p>
                        {activeEra.quoteAuthor && (
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                            — {activeEra.quoteAuthor}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* BOTTOM TIMELINE BAR WITH CLICKABLE CIRCLE BUTTONS & YEAR LABELS (EXACT MATCH TO REFERENCE IMAGE) */}
          <div className="relative mt-8 pt-8 border-t border-violet-100 dark:border-slate-800/80">
            {/* Horizontal Line Track */}
            <div className="relative w-full h-1 bg-violet-200/80 dark:bg-slate-800 rounded-full">
              {/* Active Progress Bar */}
              <motion.div
                className="absolute top-0 left-0 h-full bg-violet-600 dark:bg-violet-600 rounded-full"
                animate={{
                  width: `${(activeEraIndex / (TIMELINE_ERAS.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />

              {/* Circle Buttons Node Grid */}
              <div className="absolute inset-0 flex items-center justify-between -top-[14px]">
                {TIMELINE_ERAS.map((era, index) => {
                  const isActive = activeEraIndex === index;
                  return (
                    <div key={era.id} className="relative flex flex-col items-center">
                      {/* Circle Button */}
                      <button
                        onClick={() => setActiveEraIndex(index)}
                        aria-label={`Select ${era.displayYear}`}
                        className={`group flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-violet-600 dark:bg-violet-600 text-white ring-4 ring-violet-200 dark:ring-slate-700 shadow-lg scale-125 z-10"
                            : "bg-white dark:bg-[#131c31] border-2 border-violet-300 dark:border-slate-700 text-ink/50 hover:border-violet-600 dark:hover:border-violet-400 hover:scale-110"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full transition-colors ${
                            isActive
                              ? "bg-white"
                              : "bg-violet-300 dark:bg-slate-600 group-hover:bg-violet-600"
                          }`}
                        />
                      </button>

                      {/* Year Text Label Directly Below Circle Button */}
                      <button
                        onClick={() => setActiveEraIndex(index)}
                        className={`mt-4 text-xs sm:text-sm transition-all duration-300 ${
                          isActive
                            ? "font-extrabold text-violet-600 dark:text-violet-300 scale-105"
                            : "font-semibold text-ink/60 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300"
                        }`}
                      >
                        {era.displayYear}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 2: GALLERY OF EVENTS & CULTURE ================= */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                <Camera className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                Company Culture & Events
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl lg:text-5xl">
                Moments That Define Our <span className="text-[#f58220]">Engineering Spirit</span>
              </h2>
              <p className="mt-3 text-base text-ink/75 dark:text-slate-300">
                Explore photos, hackathons, global tech expos, and team celebrations across our engineering hubs.
              </p>
            </div>

            {/* Event Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-violet-600 dark:bg-violet-600 text-white shadow-md"
                      : "bg-cloud-100 dark:bg-slate-800 text-ink/70 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-700 border border-violet-100 dark:border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid Layout (Bento Grid) */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={event.id}
                  onClick={() => setActiveEventModal(event)}
                  className={`group relative overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-slate-900 shadow-xl cursor-pointer ${
                    event.colSpanDesktop || "lg:col-span-1"
                  } ${event.heightClass || "h-[360px]"}`}
                >
                  {/* Background Image */}
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-85 group-hover:opacity-100"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-violet-300 dark:text-violet-300 border border-violet-500/30">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      {event.category}
                    </span>
                    {event.keyMetric && (
                      <span className="rounded-full bg-amber-500/90 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide backdrop-blur-md">
                        {event.keyMetric}
                      </span>
                    )}
                  </div>

                  {/* Bottom Text Content & Action Button */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-10 flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 mb-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-violet-400" />
                          {event.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="h-3.5 w-3.5 text-violet-400" />
                          {event.location}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-extrabold text-white group-hover:text-violet-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-300 line-clamp-1">
                        {event.subtitle}
                      </p>
                    </div>

                    {/* Circular Action Button */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 dark:bg-slate-800/80 text-white backdrop-blur-md border border-white/20 group-hover:bg-violet-600 group-hover:border-violet-600 group-hover:scale-110 transition-all duration-300">
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= EVENT LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {activeEventModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 sm:p-8 shadow-2xl my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveEventModal(null)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-ink dark:text-white hover:bg-violet-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Image */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl">
                <Image
                  src={activeEventModal.imageUrl}
                  alt={activeEventModal.title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold">
                    {activeEventModal.category}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold">{activeEventModal.title}</h3>
                </div>
              </div>

              {/* Modal Content */}
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink/70 dark:text-slate-300 border-b border-violet-100 dark:border-slate-800 pb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    {activeEventModal.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    {activeEventModal.location}
                  </span>
                  {activeEventModal.attendees && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                      {activeEventModal.attendees}
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-ink/80 dark:text-slate-300">
                  {activeEventModal.fullStory}
                </p>

                {/* Highlights List */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-slate-400 mb-2">
                    Event Highlights & Takeaways
                  </h4>
                  <div className="space-y-2">
                    {activeEventModal.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-medium text-ink/80 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-300 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => setActiveEventModal(null)}
                    className="font-bold"
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= SECTION 3: CORE OPERATING VALUES ================= */}
      <section className="py-20 lg:py-28 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-t border-violet-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              <Award className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              Engineering Ethos
            </div>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl lg:text-5xl">
              The 4 Pillars That Guide <span className="text-violet-600 dark:text-violet-300">Our Work</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-5 border border-violet-100 dark:border-slate-700">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink dark:text-white">Compounding Velocity</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                We design modular software components and AI workflows that make every future deployment exponentially faster.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-5 border border-violet-100 dark:border-slate-700">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink dark:text-white">Technical Rigor</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                Zero guesswork or dummy placeholders. 100% type-safe TypeScript, strict unit coverage, and validated microservices.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-5 border border-violet-100 dark:border-slate-700">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink dark:text-white">Radical Ownership</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                Our senior pod engineers embed directly with your team as co-builders, treating your product goals as our own.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-7 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 mb-5 border border-violet-100 dark:border-slate-700">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink dark:text-white">AI-First Native</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70 dark:text-slate-300">
                We integrate autonomous agents and LLMs directly into core business pipelines for maximum operational impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="relative py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-center sm:px-16"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/40 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-ember-500/30 blur-[100px]" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Ready to build your next{" "}
                <span className="text-[#f58220]">
                  AI-first product?
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/60">
                Tell us about your project — we'll get back with a plan and
                timeline within 24 hours.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsQuickEnquiryOpen(true)}
                  className="group font-bold shadow-lg shadow-violet-600/30"
                >
                  <span>Start Project Inquiry</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link href="/careers">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-bold"
                  >
                    Explore Careers
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <QuickEnquiryModal
        isOpen={isQuickEnquiryOpen}
        onClose={() => setIsQuickEnquiryOpen(false)}
      />
    </div>
  );
}
