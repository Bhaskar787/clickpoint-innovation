"use client";

/**
 * Enterprise Dynamic FAQ & Service Assistant Chatbot.
 *
 * - Dynamic backend data fetched from `/api/chatbot` (PostgreSQL Prisma).
 * - Emojis strictly removed — icons rendered via Lucide React components.
 * - Dynamic card widgets for Services, Testimonials, Pricing Packages, and FAQs.
 * - Session storage persistence for multi-page retention.
 */

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  X,
  Sparkles,
  ExternalLink,
  Wrench,
  Building2,
  Tag,
  Quote,
  HelpCircle,
  Briefcase,
  Calendar,
  Send,
  ArrowLeft,
  FolderGit2,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHAT_NODES,
  START_NODE,
  BOT_TITLE,
  BOT_SUBTITLE,
  WELCOME_DELAY_MS,
  type ChatReply,
  type ChatNode,
} from "@/data/chatbot-data";

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
  widgetType?: "services" | "testimonials" | "pricing" | "faqs";
};

const STORAGE_KEY = "clickpoint_chatbot_state_v3";
const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_PRICING_PACKAGES = [
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
];

interface PersistedState {
  messages: Message[];
  currentNode: string;
  open: boolean;
}

export function RenderIcon({ name, className = "h-3.5 w-3.5" }: { name?: string; className?: string }) {
  if (!name) return <ChevronRight className={className} />;
  switch (name) {
    case "Wrench":
      return <Wrench className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "Tag":
      return <Tag className={className} />;
    case "Quote":
      return <Quote className={className} />;
    case "HelpCircle":
      return <HelpCircle className={className} />;
    case "Briefcase":
      return <Briefcase className={className} />;
    case "Calendar":
      return <Calendar className={className} />;
    case "Send":
      return <Send className={className} />;
    case "ArrowLeft":
      return <ArrowLeft className={className} />;
    case "ExternalLink":
      return <ExternalLink className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "FolderGit2":
      return <FolderGit2 className={className} />;
    case "Star":
      return <Star className={className} />;
    default:
      return <ChevronRight className={className} />;
  }
}

export function ChatbotWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNode, setCurrentNode] = useState(START_NODE);
  const [typing, setTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Dynamic state from API
  const [botConfig, setBotConfig] = useState({
    title: BOT_TITLE || "Clickpoint Assistant",
    subtitle: BOT_SUBTITLE || "Usually replies instantly",
    welcomeDelay: WELCOME_DELAY_MS || 500,
    startNode: START_NODE || "root",
    enabled: true,
  });

  const [nodes, setNodes] = useState<Record<string, ChatNode>>(CHAT_NODES);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedTestimonialIds, setSelectedTestimonialIds] = useState<string[]>([]);
  const [selectedFaqIds, setSelectedFaqIds] = useState<string[]>([]);
  const [customPricingInfo, setCustomPricingInfo] = useState<any>(null);

  const [realEntities, setRealEntities] = useState<{
    services: any[];
    testimonials: any[];
    faqs: any[];
    jobs: any[];
    caseStudies: any[];
  }>({
    services: [],
    testimonials: [],
    faqs: [],
    jobs: [],
    caseStudies: [],
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const initFired = useRef(false);

  // 1. Fetch dynamic chatbot config from database
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/chatbot", {
          cache: "no-store",
          headers: { Pragma: "no-cache", "Cache-Control": "no-cache" },
        }).then((r) => r.json());
        if (res?.success && res?.data) {
          const d = res.data;
          if (d.settings) {
            setBotConfig({
              title: d.settings.botTitle || BOT_TITLE,
              subtitle: d.settings.botSubtitle || BOT_SUBTITLE,
              welcomeDelay: d.settings.welcomeDelayMs || WELCOME_DELAY_MS,
              startNode: d.settings.startNode || START_NODE,
              enabled: d.settings.enabled !== false,
            });
          }
          if (d.nodes) setNodes(d.nodes);
          if (d.selectedServiceIds) setSelectedServiceIds(d.selectedServiceIds);
          if (d.selectedTestimonialIds) setSelectedTestimonialIds(d.selectedTestimonialIds);
          if (d.selectedFaqIds) setSelectedFaqIds(d.selectedFaqIds);
          if (d.customPricingInfo) setCustomPricingInfo(d.customPricingInfo);
          if (d.realEntities) setRealEntities(d.realEntities);
        }
      } catch (err) {
        /* fallback to default CHAT_NODES */
      }
    }

    fetchConfig();
  }, [open]);

  // 2. SessionStorage Restore
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: PersistedState = JSON.parse(raw);
        setMessages(parsed.messages ?? []);
        setCurrentNode(parsed.currentNode ?? (botConfig.startNode || START_NODE));
        setOpen(parsed.open ?? false);
        setHydrated(true);
        initFired.current = (parsed.messages?.length ?? 0) > 0;
        return;
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [botConfig.startNode]);

  // 3. Persist State
  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = {
      messages,
      currentNode,
      open,
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage limit */
    }
  }, [messages, currentNode, open, hydrated]);

  // 4. Initial welcome trigger
  useEffect(() => {
    if (!hydrated || initFired.current || !botConfig.enabled) return;
    initFired.current = true;
    const startKey = botConfig.startNode || START_NODE;
    const t = setTimeout(() => {
      pushBotNode(startKey);
      if (!open) setHasUnread(true);
    }, botConfig.welcomeDelay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, botConfig.enabled]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function pushBotNode(nodeId: string) {
    const node = nodes[nodeId] || CHAT_NODES[nodeId];
    if (!node) return;
    setTyping(true);
    const lines = node.bot || [];

    lines.forEach((line, i) => {
      setTimeout(() => {
        const isLast = i === lines.length - 1;
        let widget: "services" | "testimonials" | "pricing" | "faqs" | undefined;
        if (isLast) {
          if (node.showRealServices || nodeId === "services") widget = "services";
          else if (node.showRealTestimonials || nodeId === "testimonials") widget = "testimonials";
          else if (node.showPricingCards || nodeId === "pricing") widget = "pricing";
          else if (node.showRealFaqs || nodeId === "faq_menu") widget = "faqs";
        }

        setMessages((prev) => [...prev, { id: uid(), from: "bot", text: line, widgetType: widget }]);
        if (isLast) setTyping(false);
      }, 300 + i * 400);
    });
    setCurrentNode(nodeId);
  }

  function handleReply(reply: ChatReply) {
    setMessages((prev) => [...prev, { id: uid(), from: "user", text: reply.label }]);
    if (reply.goTo) {
      setTimeout(() => pushBotNode(reply.goTo!), 250);
    }
  }

  function toggleOpen() {
    setOpen((v) => {
      if (!v) setHasUnread(false);
      return !v;
    });
  }

  function resetConversation() {
    setMessages([]);
    initFired.current = false;
    pushBotNode(botConfig.startNode || START_NODE);
  }

  if (pathname?.startsWith("/admin") || !botConfig.enabled) return null;

  const node = nodes[currentNode] || CHAT_NODES[currentNode];

  // Filter selected real entities
  const displayServices = realEntities.services.filter((s) => {
    const sId = s.id || s.title;
    return selectedServiceIds.length > 0
      ? selectedServiceIds.includes(sId) || selectedServiceIds.includes(s.id) || selectedServiceIds.includes(s.title)
      : true;
  }).slice(0, 6);

  const displayTestimonials = realEntities.testimonials.filter((t) =>
    selectedTestimonialIds.length > 0 ? selectedTestimonialIds.includes(t.id) : true
  ).slice(0, 5);

  const displayFaqs = realEntities.faqs.filter((f) =>
    selectedFaqIds.length > 0 ? selectedFaqIds.includes(f.id) : true
  ).slice(0, 6);

  const activePricingPackages =
    customPricingInfo?.packages && customPricingInfo.packages.length > 0
      ? customPricingInfo.packages
      : DEFAULT_PRICING_PACKAGES;

  return (
    <>
      {/* ---------------- Floating launcher button ---------------- */}
      <button
        onClick={toggleOpen}
        aria-label={open ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full",
          "bg-violet-600 text-white shadow-xl shadow-violet-600/30",
          "hover:bg-violet-700 active:scale-95 transition-all duration-300",
          "dark:bg-violet-600 dark:hover:bg-violet-500",
          "sm:h-16 sm:w-16"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {hasUnread && !open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#f58220] ring-2 ring-white dark:ring-slate-900" />
          </span>
        )}
      </button>

      {/* ---------------- Chat panel ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "fixed z-[70] flex flex-col overflow-hidden",
              "bottom-24 right-5 w-[calc(100vw-2.5rem)] max-w-[390px] h-[min(620px,calc(100vh-130px))]",
              "rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10",
              "dark:border-slate-800 dark:bg-[#131927] dark:shadow-black/60"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 px-4 py-3.5 text-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 shadow-xs">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black leading-tight">{botConfig.title}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-violet-100 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {botConfig.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="shrink-0 rounded-full p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Messages Body */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3.5 overflow-y-auto bg-slate-50/80 px-4 py-4 dark:bg-[#0b0f19]/60 [scrollbar-width:thin]"
            >
              {messages.map((m) => (
                <React.Fragment key={m.id}>
                  <MessageBubble from={m.from} text={m.text} />

                  {/* Render Dynamic Cards Widgets */}
                  {m.widgetType === "services" && displayServices.length > 0 && (
                    <div className="space-y-2 my-2">
                      {displayServices.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-900 shadow-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{s.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {s.description}
                          </p>
                          {s.tags && s.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {s.tags.slice(0, 3).map((t: string) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {m.widgetType === "testimonials" && displayTestimonials.length > 0 && (
                    <div className="space-y-2 my-2">
                      {displayTestimonials.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-white dark:bg-slate-900 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Quote className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.clientName}</h4>
                            </div>
                            <span className="text-[10px] text-amber-500 font-extrabold flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                              {t.rating}.0
                            </span>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                            {t.clientRole} {t.company ? `· ${t.company}` : ""}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 italic leading-relaxed">
                            "{t.content}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {m.widgetType === "pricing" && (
                    <div className="space-y-2.5 my-2">
                      {activePricingPackages.map((pkg: any, idx: number) => (
                        <div
                          key={pkg.id || idx}
                          className="p-3.5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-white dark:bg-slate-900 shadow-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {pkg.websiteType || "Website Package"}
                              </span>
                              <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1">{pkg.name}</h4>
                            </div>
                            <span className="px-2 py-1 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                              {pkg.timeline}
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t border-b border-slate-100 dark:border-slate-800/80 py-1.5">
                            <span className="text-[10px] font-bold text-slate-400">Est. Price:</span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              {pkg.priceRange}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            {pkg.description}
                          </p>

                          {pkg.features && pkg.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {pkg.features.map((feat: string, fIdx: number) => (
                                <span
                                  key={fIdx}
                                  className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                  ✓ {feat}
                                </span>
                              ))}
                            </div>
                          )}

                          <Link
                            href={`/contact?service=${encodeURIComponent(pkg.name)}`}
                            className="mt-2 w-full inline-flex items-center justify-center gap-1 py-1.5 px-3 text-[11px] font-extrabold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs transition-all"
                            onClick={() =>
                              setMessages((prev) => [...prev, { id: uid(), from: "user", text: `Get quote for ${pkg.name}` }])
                            }
                          >
                            <span>Get Quote for {pkg.name}</span>
                            <ExternalLink className="h-3 w-3 opacity-80" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}

                  {m.widgetType === "faqs" && displayFaqs.length > 0 && (
                    <div className="space-y-2 my-2">
                      {displayFaqs.map((f) => (
                        <FaqAccordionItem key={f.id} question={f.question} answer={f.answer} />
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}

              {typing && (
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-xs bg-white px-4 py-3 w-fit border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  <TypingDot delay={0} />
                  <TypingDot delay={0.15} />
                  <TypingDot delay={0.3} />
                </div>
              )}
            </div>

            {/* Quick replies & Footer */}
            <div className="border-t border-slate-200 bg-white px-3.5 py-3 dark:border-slate-800 dark:bg-[#131927]">
              {!typing && node && (
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {node.replies?.map((r) =>
                    r.href ? (
                      <Link
                        key={r.label}
                        href={r.href}
                        target={r.external ? "_blank" : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-2 text-xs font-bold text-violet-700 hover:bg-violet-100 transition-colors dark:border-violet-800/60 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-900/50 shadow-2xs"
                        onClick={() =>
                          setMessages((prev) => [...prev, { id: uid(), from: "user", text: r.label }])
                        }
                      >
                        <RenderIcon name={r.icon} className="h-3.5 w-3.5" />
                        <span>{r.label}</span>
                        <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
                      </Link>
                    ) : (
                      <button
                        key={r.label}
                        onClick={() => handleReply(r)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 shadow-2xs"
                      >
                        <RenderIcon name={r.icon} className="h-3.5 w-3.5 text-violet-500" />
                        <span>{r.label}</span>
                      </button>
                    )
                  )}
                </div>
              )}
              <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  Automated Assistant &middot; Powered by Clickpoint
                </p>
                <button
                  onClick={resetConversation}
                  className="text-[10.5px] font-extrabold text-violet-600 hover:underline dark:text-violet-400"
                >
                  Restart Chat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ from, text }: { from: "bot" | "user"; text: string }) {
  const isBot = from === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("flex", isBot ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[12.5px] leading-relaxed shadow-2xs font-medium",
          isBot
            ? "rounded-bl-xs border border-slate-200/80 bg-white text-slate-800 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100"
            : "rounded-br-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold"
        )}
      >
        {text}
      </div>
    </motion.div>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-slate-900 dark:text-white"
      >
        <span className="flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-violet-500 shrink-0" />
          {question}
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 mt-1">
          {answer}
        </div>
      )}
    </div>
  );
}

function TypingDot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, delay }}
    />
  );
}

export default ChatbotWidget;
