import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CHAT_NODES, BOT_TITLE, BOT_SUBTITLE, WELCOME_DELAY_MS, START_NODE } from "@/data/chatbot-data";
import { DEFAULT_TESTIMONIALS_PAGE_DATA } from "@/data/default-testimonials-data";
import { DEFAULT_FAQS } from "@/data/default-faq-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_CHATBOT_CONFIG = {
  settings: {
    botName: "Clix",
    botTitle: BOT_TITLE || "Clickpoint Assistant",
    botSubtitle: BOT_SUBTITLE || "Usually replies instantly",
    botAvatarUrl: "",
    launcherIconUrl: "",
    welcomeDelayMs: WELCOME_DELAY_MS || 500,
    startNode: START_NODE || "root",
    enabled: true,
  },
  nodes: CHAT_NODES,
  selectedServiceIds: [] as string[],
  selectedTestimonialIds: [] as string[],
  selectedFaqIds: [] as string[],
  customPricingInfo: {
    title: "Website & Application Dynamic Pricing",
    description: "Transparent pricing & timelines based on website type, stack, and scope",
    packages: [
      {
        id: "corporate-website",
        name: "Corporate & Business Website",
        websiteType: "Marketing & Business Site",
        timeline: "1–2 Weeks",
        priceRange: "$2,500 – $5,000",
        description: "High-converting corporate website with Next.js 15, animated UI sections, SEO optimization, and CMS content editor.",
        features: ["Next.js 15 & Tailwind CSS", "Sub-second Load Speed", "SEO & Metadata Ready", "Admin CMS Dashboard Integration"],
      },
      {
        id: "ecommerce-store",
        name: "E-Commerce Web Platform",
        websiteType: "Headless Online Store",
        timeline: "3–5 Weeks",
        priceRange: "$6,000 – $15,000",
        description: "Full-featured e-commerce platform with product catalog, cart checkout, Stripe payment gateways, and inventory management.",
        features: ["Headless Shopping Cart", "Payment Gateway Integration", "Product Analytics & Filters", "Customer Account Portal"],
      },
      {
        id: "saas-web-app",
        name: "Next.js Custom SaaS Web App",
        websiteType: "Full-Stack SaaS Platform",
        timeline: "4–8 Weeks",
        priceRange: "$12,000 – $30,000",
        description: "Enterprise SaaS application with user authentication, subscription billing, multi-tenant database, and admin analytics.",
        features: ["User Auth & RBAC Permissions", "Subscription Stripe Billing", "PostgreSQL / Prisma Database", "Admin Control Dashboard"],
      },
      {
        id: "ai-copilot-app",
        name: "AI-Powered Web App & Copilot",
        websiteType: "AI & Autonomous Agents",
        timeline: "2–4 Weeks",
        priceRange: "$10,000 – $25,000",
        description: "Custom AI web application featuring RAG document knowledge base, autonomous copilot agents, and fine-tuned LLM models.",
        features: ["LLM RAG Vector Storage", "Autonomous Agent Workflows", "Real-Time Streaming Response", "Custom Model Guardrails"],
      },
      {
        id: "mobile-native-app",
        name: "Cross-Platform Mobile App",
        websiteType: "iOS & Android Mobile App",
        timeline: "4–8 Weeks",
        priceRange: "$10,000 – $25,000",
        description: "Native-performing iOS and Android mobile app built with React Native, offline storage, push notifications, and API backend.",
        features: ["React Native & Expo", "iOS & Android Store Release", "Push Notifications Engine", "Offline Sync & Secure Storage"],
      },
    ],
  },
};

export async function GET() {
  try {
    // 1. Fetch or initialize chatbot DB configuration
    let chatbotRecord = await prisma.chatbotPage.findFirst();
    if (!chatbotRecord) {
      chatbotRecord = await prisma.chatbotPage.create({
        data: {
          id: "default",
          content: DEFAULT_CHATBOT_CONFIG as any,
        },
      });
    }

    const savedContent = (chatbotRecord?.content || {}) as any;

    // Smart merge nodes ensuring showPricingCards, showRealServices, etc. exist
    const defaultNodes = DEFAULT_CHATBOT_CONFIG.nodes;
    const savedNodes = savedContent.nodes || {};
    const mergedNodes: Record<string, any> = {};

    const allNodeKeys = Array.from(new Set([...Object.keys(defaultNodes), ...Object.keys(savedNodes)]));
    for (const key of allNodeKeys) {
      const defNode = defaultNodes[key] || {};
      const savNode = savedNodes[key] || {};
      mergedNodes[key] = {
        ...defNode,
        ...savNode,
        showPricingCards: savNode.showPricingCards !== undefined ? savNode.showPricingCards : (defNode as any).showPricingCards,
        showRealServices: savNode.showRealServices !== undefined ? savNode.showRealServices : (defNode as any).showRealServices,
        showRealTestimonials: savNode.showRealTestimonials !== undefined ? savNode.showRealTestimonials : (defNode as any).showRealTestimonials,
        showRealFaqs: savNode.showRealFaqs !== undefined ? savNode.showRealFaqs : (defNode as any).showRealFaqs,
      };
    }

    // Ensure packages exist
    const savedPackages = savedContent.customPricingInfo?.packages;
    const pricingPackages = Array.isArray(savedPackages) && savedPackages.length > 0
      ? savedPackages
      : DEFAULT_CHATBOT_CONFIG.customPricingInfo.packages;

    const mergedData = {
      settings: {
        ...DEFAULT_CHATBOT_CONFIG.settings,
        ...(savedContent.settings || {}),
      },
      nodes: mergedNodes,
      selectedServiceIds: savedContent.selectedServiceIds || [],
      selectedTestimonialIds: savedContent.selectedTestimonialIds || [],
      selectedFaqIds: savedContent.selectedFaqIds || [],
      customPricingInfo: {
        ...DEFAULT_CHATBOT_CONFIG.customPricingInfo,
        ...(savedContent.customPricingInfo || {}),
        packages: pricingPackages,
      },
    };

    // 2. Fetch real entity data from database so admin & bot can use live site content
    const [servicesRecord, testimonialsRecord, faqsRecord, vacancies, caseStudies] = await Promise.all([
      prisma.servicesPage.findFirst().catch(() => null),
      prisma.testimonial.findMany({
        where: { isApproved: true },
        orderBy: { order: "asc" },
        take: 20,
      }).catch(() => []),
      prisma.faq.findMany({
        include: { category: true },
        orderBy: { order: "asc" },
        take: 30,
      }).catch(() => []),
      prisma.jobVacancy.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 10,
      }).catch(() => []),
      prisma.caseStudy.findMany({
        where: { featured: true },
        orderBy: { order: "asc" },
        take: 8,
      }).catch(() => []),
    ]);

    // Extract core services from ServicesPage JSON or fallback defaults
    const servicesPageContent = (servicesRecord?.content || {}) as any;
    const rawServicesList = servicesPageContent?.services || servicesPageContent?.servicesList?.items || [];
    
    const realServices = rawServicesList.length > 0
      ? rawServicesList.map((s: any) => ({
          id: s.id || s.title,
          title: s.title,
          description: s.desc || s.description || s.subtitle || "",
          tags: s.techStack || s.tags || [],
        }))
      : [
          {
            id: "ai-eng",
            title: "AI Product Engineering",
            description: "Autonomous AI agents, LLM copilot fine-tuning, and RAG pipelines.",
            tags: ["Python", "LangChain", "Gemini", "PyTorch"],
          },
          {
            id: "web-dev",
            title: "Next.js Web Applications",
            description: "High-performance web apps built with Next.js App Router & Tailwind.",
            tags: ["Next.js 15", "TypeScript", "React", "Node.js"],
          },
          {
            id: "ui-ux",
            title: "UI/UX & Product Design",
            description: "Design systems, motion micro-animations, and conversion rate optimization.",
            tags: ["Figma", "Framer Motion", "TailwindCSS", "Storybook"],
          },
          {
            id: "growth",
            title: "Growth Marketing & CRO",
            description: "Technical SEO, funnel conversion optimization, and lifecycle engines.",
            tags: ["Google Analytics 4", "Semrush", "Mixpanel", "HubSpot"],
          },
        ];

    // Extract testimonials or fallback
    const realTestimonials = testimonialsRecord.length > 0
      ? testimonialsRecord.map((t) => ({
          id: t.id,
          clientName: t.clientName,
          clientRole: t.clientRole,
          company: t.company,
          content: t.content,
          rating: t.rating,
          avatarUrl: t.avatarUrl,
        }))
      : (DEFAULT_TESTIMONIALS_PAGE_DATA.testimonials || []).map((t) => ({
          id: t.id,
          clientName: t.clientName,
          clientRole: t.clientRole,
          company: t.company,
          content: t.content,
          rating: t.rating,
          avatarUrl: t.avatarUrl,
        }));

    // Extract FAQs or fallback
    const realFaqs = faqsRecord.length > 0
      ? faqsRecord.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          categoryName: f.category?.name || "General",
        }))
      : (DEFAULT_FAQS || []).map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          categoryName: f.category || "General",
        }));

    return NextResponse.json(
      {
        success: true,
        data: {
          ...mergedData,
          realEntities: {
            services: realServices,
            testimonials: realTestimonials,
            faqs: realFaqs,
            jobs: vacancies.map((j) => ({
              id: j.id,
              title: j.title,
              type: j.type,
              location: j.location,
              salary: j.salary,
            })),
            caseStudies: caseStudies.map((c) => ({
              id: c.id,
              title: c.title,
              client: c.client,
              category: c.category,
              description: c.description,
              imageUrl: c.imageUrl,
            })),
          },
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/chatbot error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch chatbot config" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const existing = await prisma.chatbotPage.findFirst();
    let updatedRecord;

    if (existing) {
      const mergedContent = {
        ...((existing.content as any) || {}),
        ...body,
      };
      updatedRecord = await prisma.chatbotPage.update({
        where: { id: existing.id },
        data: { content: mergedContent },
      });
    } else {
      updatedRecord = await prisma.chatbotPage.create({
        data: { id: "default", content: body },
      });
    }

    revalidateTag("chatbot-page");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: updatedRecord.content,
      message: "Dynamic Chatbot configuration saved successfully!",
    });
  } catch (error: any) {
    console.error("PUT /api/chatbot error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save chatbot config" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return PUT(req);
}
