/**
 * Rule-based FAQ Chatbot — conversation data
 * -------------------------------------------
 * Pure content/config, no logic. Clean text with Lucide React Icon mapping.
 * No emojis used — icons are dynamically rendered via React components.
 */

export interface ChatReply {
  label: string;
  goTo?: string;
  href?: string;
  external?: boolean;
  icon?: string; // Name of Lucide React icon e.g. "Wrench", "Building2", "Tag", "Calendar", "Briefcase", "HelpCircle", "ArrowLeft", "Quote"
}

export interface ChatNode {
  id: string;
  bot: string[];
  replies: ChatReply[];
  showRealServices?: boolean;
  showRealTestimonials?: boolean;
  showRealFaqs?: boolean;
  showPricingCards?: boolean;
}

export const BOT_NAME = "Clix";
export const BOT_TITLE = "Clickpoint Assistant";
export const BOT_SUBTITLE = "Usually replies instantly";
export const WELCOME_DELAY_MS = 500;

export const START_NODE = "root";

export const CHAT_NODES: Record<string, ChatNode> = {
  root: {
    id: "root",
    bot: [
      "Hi there! I'm Clix, Clickpoint Innovation's assistant.",
      "I can answer questions about our services, pricing, client reviews, industries, careers, or FAQs. What would you like to explore?",
    ],
    replies: [
      { label: "Our Engineering Services", goTo: "services", icon: "Wrench" },
      { label: "Industries We Serve", goTo: "industries", icon: "Building2" },
      { label: "Pricing & Timelines", goTo: "pricing", icon: "Tag" },
      { label: "Client Testimonials", goTo: "testimonials", icon: "Quote" },
      { label: "Book a Consultation", goTo: "consultation", icon: "Calendar" },
      { label: "Careers & Open Roles", goTo: "careers", icon: "Briefcase" },
      { label: "Frequently Asked Questions", goTo: "faq_menu", icon: "HelpCircle" },
    ],
  },

  // ---------------------------------------------------------------- services
  services: {
    id: "services",
    bot: [
      "We deliver high-impact software engineering tailored to your product goals:",
      "• AI Product Engineering — Autonomous Copilots & RAG\n• Modern Web Platforms — Next.js 15 & React\n• Cross-Platform Mobile — iOS & Android\n• Cloud Infra & Microservices — AWS / Kubernetes",
    ],
    showRealServices: true,
    replies: [
      { label: "View Full Services Page", href: "/services", icon: "ExternalLink" },
      { label: "Pricing & Packages", goTo: "pricing", icon: "Tag" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },

  // -------------------------------------------------------------- industries
  industries: {
    id: "industries",
    bot: [
      "We engineer compliant, enterprise-grade software for specialized sectors:",
      "• Fintech & Financial Systems\n• Healthcare & MedTech (HIPAA compliant)\n• E-Commerce & Retail AI\n• SaaS & Scaleup Platforms\n• Logistics & Supply Chain Automation",
    ],
    replies: [
      { label: "View Industries Page", href: "/industries", icon: "ExternalLink" },
      { label: "Explore Case Studies", href: "/case-studies", icon: "FolderGit2" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },

  // ----------------------------------------------------------------- pricing
  pricing: {
    id: "pricing",
    bot: [
      "Here are our transparent engagement starting points (tailored to project scope):",
    ],
    showPricingCards: true,
    replies: [
      { label: "Request Custom Proposal", href: "/contact", icon: "Send" },
      { label: "Explore Engineering Services", goTo: "services", icon: "Wrench" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },

  // ------------------------------------------------------------ testimonials
  testimonials: {
    id: "testimonials",
    bot: [
      "Here is what technology leaders say about partnering with Clickpoint Innovation:",
    ],
    showRealTestimonials: true,
    replies: [
      { label: "Read All Reviews", href: "/testimonials", icon: "ExternalLink" },
      { label: "Schedule Consultation", goTo: "consultation", icon: "Calendar" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },

  // ------------------------------------------------------------ consultation
  consultation: {
    id: "consultation",
    bot: [
      "We would love to discuss your project! Head to our Contact page and submit your requirements.",
      "Our senior engineering leads respond within 24 hours.",
    ],
    replies: [
      { label: "Go to Contact Page", href: "/contact", icon: "Send" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },

  // ---------------------------------------------------------------- careers
  careers: {
    id: "careers",
    bot: [
      "We're actively hiring! We offer remote-first flexibility, top-tier compensation, and high-impact engineering projects.",
    ],
    replies: [
      { label: "View Open Positions", href: "/careers", icon: "Briefcase" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },

  // --------------------------------------------------------------- FAQ menu
  faq_menu: {
    id: "faq_menu",
    bot: ["Select a common question below or browse our full FAQ center."],
    showRealFaqs: true,
    replies: [
      { label: "How fast can you onboard?", goTo: "faq_speed", icon: "HelpCircle" },
      { label: "Do you sign NDAs?", goTo: "faq_nda", icon: "HelpCircle" },
      { label: "Who owns the source code IP?", goTo: "faq_ip", icon: "HelpCircle" },
      { label: "Do you offer post-launch SLA?", goTo: "faq_support", icon: "HelpCircle" },
      { label: "View All FAQs Page", href: "/faqs", icon: "ExternalLink" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },
  faq_speed: {
    id: "faq_speed",
    bot: [
      "We can onboard and deploy a dedicated engineering pod within 3–5 business days following scope alignment.",
    ],
    replies: [
      { label: "Ask Another Question", goTo: "faq_menu", icon: "HelpCircle" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },
  faq_nda: {
    id: "faq_nda",
    bot: [
      "Yes. We execute a standard mutual NDA before reviewing proprietary codebases, data models, or product specs.",
    ],
    replies: [
      { label: "Ask Another Question", goTo: "faq_menu", icon: "HelpCircle" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },
  faq_ip: {
    id: "faq_ip",
    bot: [
      "You retain 100% full intellectual property, source code, and repository ownership upon project delivery.",
    ],
    replies: [
      { label: "Ask Another Question", goTo: "faq_menu", icon: "HelpCircle" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },
  faq_support: {
    id: "faq_support",
    bot: [
      "Yes — 24/7 SLA monitoring, zero-downtime maintenance, and ongoing pod retainers are available.",
    ],
    replies: [
      { label: "Ask Another Question", goTo: "faq_menu", icon: "HelpCircle" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },

  human: {
    id: "human",
    bot: [
      "The fastest way to reach a human specialist is via our Contact page or emailing info@clickpoint.com.np.",
    ],
    replies: [
      { label: "Open Contact Page", href: "/contact", icon: "Send" },
      { label: "Main Menu", goTo: "root", icon: "ArrowLeft" },
    ],
  },
};
