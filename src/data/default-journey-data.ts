import { JourneyPageContent } from "@/types";

export const DEFAULT_JOURNEY_PAGE_DATA: JourneyPageContent = {
  hero: {
    badge: "10+ Years of Engineering Excellence",
    title: "Our Journey: From Kathmandu Studio to Global AI & Cloud Powerhouse",
    subtitle:
      "Explore the milestone timeline, breakthroughs, and company events that defined Clickpoint Innovation’s journey over the past decade.",
    ctaPrimaryText: "Explore Milestones",
    ctaSecondaryText: "View Event Gallery",
  },
  landingTimelineHeader: {
    badge: "Our Journey",
    title: "From a 4-person studio to an AI-first partner",
    subtitle: "A decade of engineering excellence, technical milestones, and continuous growth.",
    ctaText: "Explore Complete Company Journey & Events Gallery",
  },
  metricsBar: [
    { label: "Founded in Kathmandu", value: "2016", sublabel: "Est. Dev Studio" },
    { label: "Active Team Members", value: "150+", sublabel: "Engineers & AI Leads" },
    { label: "Enterprise Projects", value: "250+", sublabel: "100% Shipped" },
    { label: "Global Presence", value: "12+", sublabel: "Countries Served" },
  ],
  eras: [
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
  ],
  eventCategories: [
    "Tech Summits",
    "Hackathons",
    "Global Expansion",
    "Team Culture",
    "Product Launches",
    "AI Workshop",
  ],
  events: [
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
  ],
  eventsSection: {
    badge: "Company Culture & Events",
    title: "Moments That Define Our Engineering Spirit",
    subtitle:
      "Explore photos, hackathons, global tech expos, and team celebrations across our engineering hubs.",
  },
  ethosSection: {
    badge: "Engineering Ethos",
    title: "The 4 Pillars That Guide Our Work",
    highlightText: "Our Work",
    pillars: [
      {
        id: "ethos-1",
        title: "Compounding Velocity",
        description:
          "We design modular software components and AI workflows that make every future deployment exponentially faster.",
      },
      {
        id: "ethos-2",
        title: "Technical Rigor",
        description:
          "Zero guesswork or dummy placeholders. 100% type-safe TypeScript, strict unit coverage, and validated microservices.",
      },
      {
        id: "ethos-3",
        title: "Radical Ownership",
        description:
          "Our senior pod engineers embed directly with your team as co-builders, treating your product goals as our own.",
      },
      {
        id: "ethos-4",
        title: "AI-First Native",
        description:
          "We integrate autonomous agents and LLMs directly into core business pipelines for maximum operational impact.",
      },
    ],
  },
  ctaSection: {
    badge: "Join Us On Our Journey",
    title: "Ready to Build Your Next High-Impact Product With Us?",
    subtitle:
      "Partner with Clickpoint Innovation to design, engineer, and deploy resilient cloud architecture and AI copilots.",
    buttonText: "Schedule Technical Consultation",
  },
};