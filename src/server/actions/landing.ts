"use server";

import { prisma } from "@/lib/prisma";
import { DEFAULT_LANDING_DATA } from "@/data/default-landing-data";
import { DEFAULT_NAVBAR_DATA, DEFAULT_SYSTEM_SETTINGS } from "@/data/default-navbar-data";
import {
  CHAT_NODES,
  BOT_TITLE,
  BOT_SUBTITLE,
  WELCOME_DELAY_MS,
  START_NODE,
} from "@/data/chatbot-data";
import { unstable_cache } from "next/cache";

export async function getLandingPageData() {
  try {
    let landingRecord = await prisma.landingPage.findFirst();
    if (!landingRecord || !landingRecord.content) {
      return {
        ...DEFAULT_LANDING_DATA,
        navbar: DEFAULT_NAVBAR_DATA,
        systemSettings: DEFAULT_SYSTEM_SETTINGS,
      };
    }
    const content = (landingRecord.content || {}) as any;
    return {
      ...DEFAULT_LANDING_DATA,
      ...content,
      navbar: content.navbar || DEFAULT_NAVBAR_DATA,
      systemSettings: { ...DEFAULT_SYSTEM_SETTINGS, ...(content.systemSettings || {}) },
      hero: { ...DEFAULT_LANDING_DATA.hero, ...(content.hero || {}) },
      statsHeader: { ...DEFAULT_LANDING_DATA.statsHeader, ...(content.statsHeader || {}) },
      stats: content.stats?.length ? content.stats : DEFAULT_LANDING_DATA.stats,
      servicesHeader: { ...DEFAULT_LANDING_DATA.servicesHeader, ...(content.servicesHeader || {}) },
      techStackHeader: { ...DEFAULT_LANDING_DATA.techStackHeader, ...(content.techStackHeader || {}) },
      techCategories: content.techCategories?.length ? content.techCategories : DEFAULT_LANDING_DATA.techCategories,
      techItems: content.techItems?.length ? content.techItems : DEFAULT_LANDING_DATA.techItems,
      industriesHeader: { ...DEFAULT_LANDING_DATA.industriesHeader, ...(content.industriesHeader || {}) },
      journeyHeader: { ...DEFAULT_LANDING_DATA.journeyHeader, ...(content.journeyHeader || {}) },
      timelineHeader: { ...DEFAULT_LANDING_DATA.timelineHeader, ...(content.timelineHeader || content.journeyHeader || {}) },
      blogHeader: { ...DEFAULT_LANDING_DATA.blogHeader, ...(content.blogHeader || {}) },
      testimonialsHeader: { ...DEFAULT_LANDING_DATA.testimonialsHeader, ...(content.testimonialsHeader || {}) },
      faqHeader: { ...DEFAULT_LANDING_DATA.faqHeader, ...(content.faqHeader || content.faqsHeader || {}) },
      faqsHeader: { ...DEFAULT_LANDING_DATA.faqsHeader, ...(content.faqsHeader || content.faqHeader || {}) },
      faqPageHeader: { ...DEFAULT_LANDING_DATA.faqPageHeader, ...(content.faqPageHeader || {}) },
      footer: { ...DEFAULT_LANDING_DATA.footer, ...(content.footer || content.footerData || {}) },
      footerData: { ...DEFAULT_LANDING_DATA.footerData, ...(content.footerData || content.footer || {}) },
      ctaBanner: { ...DEFAULT_LANDING_DATA.ctaBanner, ...(content.ctaBanner || {}) },
    };
  } catch (error) {
    console.error("Failed to fetch landing page content:", error);
    return {
      ...DEFAULT_LANDING_DATA,
      navbar: DEFAULT_NAVBAR_DATA,
      systemSettings: DEFAULT_SYSTEM_SETTINGS,
    };
  }
}

const DEFAULT_CHATBOT_CONFIG = {
  settings: {
    botName: "Click",
    botTitle: BOT_TITLE || "Clickpoint Assistant",
    botSubtitle: BOT_SUBTITLE || "assist you",
    botAvatarUrl: "https://res.cloudinary.com/dapi1jlc/image/upload/v1786113473/clickpoint_innovation/llsuw37ktbanuqed8pwl.png",
    launcherIconUrl: "https://res.cloudinary.com/dapi1jlc/image/upload/v1786113473/clickpoint_innovation/llsuw37ktbanuqed8pwl.png",
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

export async function getChatbotServerData() {
  try {
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

    const defaultNodes = DEFAULT_CHATBOT_CONFIG.nodes;
    const savedNodes = savedContent.nodes || {};
    const mergedNodes: Record<string, any> = {};

    const allNodeKeys = Array.from(
      new Set([...Object.keys(defaultNodes), ...Object.keys(savedNodes)])
    );

    for (const key of allNodeKeys) {
      const defNode = defaultNodes[key] || {};
      const savNode = savedNodes[key] || {};
      mergedNodes[key] = {
        ...defNode,
        ...savNode,
        showPricingCards:
          savNode.showPricingCards !== undefined
            ? savNode.showPricingCards
            : (defNode as any).showPricingCards,
        showRealServices:
          savNode.showRealServices !== undefined
            ? savNode.showRealServices
            : (defNode as any).showRealServices,
        showRealTestimonials:
          savNode.showRealTestimonials !== undefined
            ? savNode.showRealTestimonials
            : (defNode as any).showRealTestimonials,
        showRealFaqs:
          savNode.showRealFaqs !== undefined
            ? savNode.showRealFaqs
            : (defNode as any).showRealFaqs,
      };
    }

    const savedPackages = savedContent.customPricingInfo?.packages;
    const pricingPackages =
      Array.isArray(savedPackages) && savedPackages.length > 0
        ? savedPackages
        : DEFAULT_CHATBOT_CONFIG.customPricingInfo.packages;

    return {
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
  } catch (error) {
    console.warn("getChatbotServerData fallback:", error);
    return DEFAULT_CHATBOT_CONFIG;
  }
}
