import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const GREETING_REGEX = /^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|namaste)\b/i;
const IDENTITY_REGEX = /^(who\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|help)\b/i;

function getStaticGreetingResponse(message: string): string | null {
  const clean = message.trim().toLowerCase();
  if (!clean) {
    return "Hello! I am **Clix**, your Clickpoint Innovation AI Assistant. How can I assist you today?";
  }

  if (IDENTITY_REGEX.test(clean)) {
    return `Hello! I am **Clix**, your Clickpoint Innovation AI Assistant.

I'm here to help answer questions about our digital product engineering services, custom AI solutions, pricing packages, client case studies, team, and career opportunities.

How can I assist you today?`;
  }

  if (GREETING_REGEX.test(clean) || clean === "hi" || clean === "hello" || clean === "hey") {
    return `Hello! Welcome to **Clickpoint Innovation**.

I'm **Clix**, your AI assistant. How can I help you today?

* **Engineering & AI Services** — Full-stack web, mobile, and custom AI systems
* **Case Studies & Portfolio** — Real client projects and results
* **Pricing & Timelines** — Transparent packages for your project
* **Careers & Culture** — Remote-first openings and team opportunities

Feel free to ask any question or tap one of the quick options below!`;
  }

  return null;
}

function sanitizeReply(text: string): string {
  return text
    .replace(/\]\(\/{2,}/g, "](")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .trim();
}

// ---------------------------------------------------------------------------
// Tier 2: Try Python FastAPI Chat Microservice (pgvector + Redis + LLM)
// ---------------------------------------------------------------------------
async function tryPythonChatService(body: any): Promise<any | null> {
  const isVercel = !!process.env.VERCEL;
  const chatServiceUrl = process.env.CHAT_SERVICE_URL || (isVercel ? null : "http://localhost:8002");

  // Skip immediately on Vercel if URL is missing or points to localhost
  if (!chatServiceUrl || (isVercel && chatServiceUrl.includes("localhost"))) {
    return null;
  }

  const apiKey = process.env.INTERNAL_API_KEY || "clickpoint-secret-internal-key-2026";
  const endpoints = [`${chatServiceUrl}/api/chat`, `${chatServiceUrl}/chat`];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Key": apiKey,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.reply && !data.reply.includes("trouble connecting to our AI server")) {
          return data;
        }
      }
    } catch {
      // Endpoint failed or timed out, try next or fall back
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Tier 3: 100% Dynamic Supabase Database Context Extraction (Zero Static Mock Text)
// ---------------------------------------------------------------------------
async function fetchDirectDatabaseContext(): Promise<string> {
  try {
    const [
      about,
      landing,
      servicesRecord,
      careers,
      contact,
      journey,
      industriesRecord,
      vacancies,
      testimonials,
      caseStudies,
      blogPosts,
      faqs,
      chatbotPage,
    ] = await Promise.all([
      prisma.aboutPage.findFirst().catch(() => null),
      prisma.landingPage.findFirst().catch(() => null),
      prisma.servicesPage.findFirst().catch(() => null),
      prisma.careersPage.findFirst().catch(() => null),
      prisma.contactPage.findFirst().catch(() => null),
      prisma.journeyPage.findFirst().catch(() => null),
      prisma.industriesPage.findFirst().catch(() => null),
      prisma.jobVacancy.findMany({ where: { isActive: true }, take: 25 }).catch(() => []),
      prisma.testimonial.findMany({ where: { isApproved: true }, take: 25 }).catch(() => []),
      prisma.caseStudy.findMany({ take: 25 }).catch(() => []),
      prisma.blogPost.findMany({ take: 25 }).catch(() => []),
      prisma.faqCategory.findMany({ include: { faqs: true }, take: 20 }).catch(() => []),
      prisma.chatbotPage.findFirst().catch(() => null),
    ]);

    const sections: string[] = [];

    // 1. Dynamic About Page Content (Mission, Story, Team Bios & Roles from DB)
    if (about?.content) {
      const aData = about.content as any;
      const hero = aData.hero || {};
      const mission = aData.mission || {};
      const leadership = aData.leadership || {};
      const team = leadership.team || aData.team || aData.members || [];
      const values = mission.values || aData.values?.items || aData.values || [];
      const stats = aData.stats?.metrics || aData.stats || [];

      const aboutParts: string[] = [];
      if (hero.title || hero.subtitle) {
        aboutParts.push(`ABOUT US OVERVIEW:\nHeadline: ${hero.badge ? `[${hero.badge}] ` : ""}${hero.title || ""} ${hero.highlightTitle || ""}\nStory: ${hero.subtitle || ""}`);
      }
      if (mission.title || mission.subtitle || mission.paragraph1 || mission.heading) {
        const mLines = [
          mission.heading || mission.title ? `Heading: ${mission.heading || mission.title}` : "",
          mission.subtitle ? `Subtitle: ${mission.subtitle}` : "",
          mission.paragraph1 ? `Narrative: ${mission.paragraph1}` : "",
          mission.paragraph2 ? `Scale & Impact: ${mission.paragraph2}` : "",
          Array.isArray(mission.bullets) ? `Highlights:\n${mission.bullets.map((b: string) => `• ${b}`).join("\n")}` : "",
        ].filter(Boolean).join("\n");
        aboutParts.push(`MISSION & COMPANY STORY:\n${mLines}`);
      }
      if (Array.isArray(team) && team.length > 0) {
        const tLines = team.map((m: any) => {
          const exp = Array.isArray(m.expertise) ? ` (Expertise: ${m.expertise.join(", ")})` : "";
          return `• **${m.name}** — Role: ${m.role || "Executive"}. Bio: ${m.bio || ""}${exp}`;
        }).join("\n");
        aboutParts.push(`EXECUTIVE LEADERSHIP TEAM:\n${tLines}\nLearn more at: /about#team`);
      }
      if (Array.isArray(values) && values.length > 0) {
        const vLines = values.map((v: any) => `• ${v.title || v.name}: ${v.description || v.desc || ""}`).join("\n");
        aboutParts.push(`CORE COMPANY VALUES:\n${vLines}`);
      }
      if (Array.isArray(stats) && stats.length > 0) {
        const statLines = stats.map((s: any) => `• ${s.label}: ${s.value}${s.description ? ` (${s.description})` : ""}`).join("\n");
        aboutParts.push(`ENGINEERING IMPACT & STATS:\n${statLines}`);
      }

      if (aboutParts.length > 0) {
        sections.push(aboutParts.join("\n\n"));
      }
    }

    // 2. Dynamic Landing Page Content (Hero & Metrics from DB)
    if (landing?.content) {
      const lData = landing.content as any;
      const hero = lData.hero || {};
      const stats = lData.stats || lData.metricsBar || [];
      const landingParts: string[] = [];

      if (hero.title || hero.subtitle) {
        const pillars = Array.isArray(hero.pillars) ? ` (Pillars: ${hero.pillars.join(", ")})` : "";
        landingParts.push(`CLICKPOINT POSITIONING:\n${hero.badge ? `[${hero.badge}] ` : ""}${hero.title || ""} — ${hero.subtitle || ""}${pillars}`);
      }
      if (Array.isArray(stats) && stats.length > 0) {
        const sLines = stats.map((s: any) => `• ${s.label || s.name}: ${s.value || s.stat || ""}`).join("\n");
        landingParts.push(`COMPANY MILESTONE STATS:\n${sLines}`);
      }
      if (landingParts.length > 0) {
        sections.push(landingParts.join("\n\n"));
      }
    }

    // 3. Dynamic Services Catalog (from DB)
    if (servicesRecord?.content) {
      const sData = servicesRecord.content as any;
      const services = sData.services || sData.servicesList?.items || [];
      if (services.length > 0) {
        const sLines = services.map((s: any) => {
          const tech = Array.isArray(s.techStack || s.tags) ? ` [Tech: ${(s.techStack || s.tags).join(", ")}]` : "";
          return `• **${s.title}**: ${s.desc || s.description || s.subtitle || s.fullOverview || ""}${tech} (URL: /services#${s.id || ""})`;
        }).join("\n");
        sections.push(`CORE ENGINEERING SERVICES:\n${sLines}\nExplore full services catalog at: /services`);
      }
    }

    // 4. Dynamic Pricing Packages (from DB)
    const chatbotContent = (chatbotPage?.content as any) || {};
    const pricingPackages = chatbotContent.customPricingInfo?.packages || [];
    if (pricingPackages.length > 0) {
      const pLines = pricingPackages.map((p: any) => `• **${p.name}** (${p.websiteType || "Package"}): ${p.priceRange} — Delivery Timeline: ${p.timeline}. ${p.description}`).join("\n");
      sections.push(`ENGAGEMENT PRICING PACKAGES:\n${pLines}\nExplore customized scopes at: /contact`);
    }

    // 5. Dynamic Journey & Timeline Milestones (from DB)
    if (journey?.content) {
      const jData = journey.content as any;
      const events = jData.events || [];
      const eras = jData.eras || jData.timeline || [];
      const jParts: string[] = [];

      if (Array.isArray(events) && events.length > 0) {
        const eLines = events.slice(0, 8).map((e: any) => `• ${e.date || ""}: ${e.title || ""} (${e.category || ""}) — ${e.subtitle || e.fullStory || ""}`).join("\n");
        jParts.push(`KEY MILESTONE EVENTS:\n${eLines}`);
      }
      if (Array.isArray(eras) && eras.length > 0) {
        const eraLines = eras.map((er: any) => `• Era ${er.era || er.year || ""}: ${er.title || ""} — ${er.description || er.desc || ""}`).join("\n");
        jParts.push(`HISTORICAL ERAS:\n${eraLines}`);
      }
      if (jParts.length > 0) {
        sections.push(`COMPANY JOURNEY & MILESTONES:\n${jParts.join("\n\n")}\nFull story at: /journey`);
      }
    }

    // 6. Dynamic Industry Solutions (from DB)
    if (industriesRecord?.content) {
      const indData = industriesRecord.content as any;
      const industries = indData.industries || [];
      if (Array.isArray(industries) && industries.length > 0) {
        const indLines = industries.map((ind: any) => `• **${ind.title || ind.name}**: ${ind.desc || ind.description || ""} (URL: /industries#${ind.id || ""})`).join("\n");
        sections.push(`INDUSTRY SOLUTIONS:\n${indLines}`);
      }
    }

    // 7. Dynamic Careers Culture & Perks (from DB)
    if (careers?.content) {
      const cData = careers.content as any;
      const perks = cData.perksSection?.perks || cData.perks || [];
      if (Array.isArray(perks) && perks.length > 0) {
        const pLines = perks.map((p: any) => `• ${p.title}: ${p.desc || p.description || ""}`).join("\n");
        sections.push(`COMPANY CULTURE & PERKS:\n${pLines}`);
      }
    }

    // 8. Dynamic Active Job Vacancies (from DB)
    if (vacancies.length > 0) {
      const vLines = vacancies.map((v: any) => {
        const salary = v.salary ? ` | Salary: ${v.salary}` : "";
        return `• **${v.title}** (${v.type}, ${v.location}${salary}): ${v.summary}`;
      }).join("\n");
      sections.push(`ACTIVE JOB VACANCIES:\n${vLines}\nApply online at: /careers`);
    }

    // 9. Dynamic Case Studies & Client Work (from DB)
    if (caseStudies.length > 0) {
      const csLines = caseStudies.map((c: any) => {
        const res = c.results ? ` — Results: ${c.results}` : "";
        return `• **${c.title}** (Client: ${c.client}, Category: ${c.category}): ${c.description}${res} (URL: /case-studies/${c.slug})`;
      }).join("\n");
      sections.push(`CLIENT CASE STUDIES & PORTFOLIO:\n${csLines}`);
    }

    // 10. Dynamic Blog Posts (from DB)
    if (blogPosts.length > 0) {
      const bLines = blogPosts.map((b: any) => `• **${b.title}** (${b.category}, by ${b.author}): ${b.excerpt} (URL: /blog/${b.slug})`).join("\n");
      sections.push(`BLOG ARTICLES & TECH INSIGHTS:\n${bLines}`);
    }

    // 11. Dynamic Approved Testimonials (from DB)
    if (testimonials.length > 0) {
      const tLines = testimonials.slice(0, 10).map((t: any) => `• "${t.content}" — ${t.clientName}, ${t.clientRole} at ${t.company} (${t.rating}/5 Stars)`).join("\n");
      sections.push(`CLIENT TESTIMONIALS:\n${tLines}\nRead reviews at: /testimonials`);
    }

    // 12. Dynamic FAQs (from DB)
    if (faqs.length > 0) {
      const fLines = faqs.flatMap((cat: any) => (cat.faqs || []).map((f: any) => `Q: ${f.question}\nA: ${f.answer}`)).slice(0, 15).join("\n\n");
      sections.push(`FREQUENTLY ASKED QUESTIONS:\n${fLines}`);
    }

    // 13. Dynamic Contact Page Info (from DB)
    if (contact?.content) {
      const cData = contact.content as any;
      const info = cData.contactInfo || cData.info || cData;
      const cLines = [
        info.email ? `• Technical & General Email: ${info.email}` : "• Technical & General Email: info@clickpoint.com.np",
        "• Careers & HR Email: budhabhaskar2@gmail.com",
        info.phone ? `• Phone: ${info.phone}` : "• Phone: +977-9825630080",
        info.address ? `• Physical Address: ${info.address}` : "• Physical Address: New Baneshwor, Kathmandu, Nepal",
        info.hours ? `• Office Hours: ${info.hours}` : "",
        "• Contact Page: /contact",
      ].filter(Boolean).join("\n");
      sections.push(`OFFICIAL CONTACT INFO:\n${cLines}`);
    }

    return sections.join("\n\n----------------------------------------\n\n");
  } catch (err) {
    console.warn("Direct DB context fetch warning:", err);
    return "";
  }
}

// ---------------------------------------------------------------------------
// Tier 3: Call Google Gemini API (Dual-Mode Direct Synthesizer)
// ---------------------------------------------------------------------------
async function callGeminiDirect(query: string, dbContext: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const modelsToTry = [
    process.env.GEMINI_MODEL_NAME,
    "gemini-flash-lite-latest",
    "gemini-3.5-flash",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ].filter(Boolean) as string[];
  const uniqueModels = Array.from(new Set(modelsToTry));

  const systemInstruction = `You are "Clix", the friendly and expert AI Assistant for Clickpoint Innovation — a leading global AI-first digital product engineering consultancy.

CORE BEHAVIOR:
- Answer the user's question accurately, concisely, and dynamically using the provided live website database knowledge base.
- When referencing services, case studies, blogs, careers, leadership, or contact, include helpful clickable Markdown links (e.g., [Services](/services), [About Us](/about), [Contact Page](/contact), [Careers](/careers), [Case Studies](/case-studies), [Blog](/blog)).
- When explaining leadership profiles, state their exact roles, bios, and expertise as registered in the live About page database.
- Provide structured answers using clean Markdown with bold headers and bullet points (* **Title**: Description) when listing multiple items.
- NEVER use emojis or waving hand icons under any circumstances.
- If the knowledge base does not contain the answer, politely invite them to contact the team at info@clickpoint.com.np or through the [Contact Page](/contact).

LIVE WEBSITE KNOWLEDGE BASE:
${dbContext}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\nUser Question: ${query}` }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
    },
  };

  for (const model of uniqueModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      }
    } catch {
      // Model attempt failed, try next in chain
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = body.message || body.prompt || body.text || "";

    // 1. Instant friendly static greeting check for "hi", "hello", "who are you", etc. (strictly without emojis)
    const greeting = getStaticGreetingResponse(userMessage);
    if (greeting) {
      return NextResponse.json({
        reply: greeting,
        sessionId: body.sessionId || "default",
        sources: [],
        cached: false,
        provider_used: "greeting",
      });
    }

    // 2. Try Python AI Microservice (Docker / VPS Container Stack)
    const microserviceResult = await tryPythonChatService(body);
    if (microserviceResult) {
      return NextResponse.json(microserviceResult);
    }

    // 3. Fallback: Direct Live Supabase Database Context + Google Gemini LLM (Vercel Serverless Production)
    const dbContext = await fetchDirectDatabaseContext();
    const directAiReply = await callGeminiDirect(userMessage, dbContext);
    if (directAiReply) {
      return NextResponse.json({
        reply: sanitizeReply(directAiReply),
        sessionId: body.sessionId || "default",
        sources: [],
        cached: false,
        provider_used: "gemini_direct",
      });
    }

    // 4. Graceful Fallback if neither service nor LLM is reachable
    return NextResponse.json({
      reply: "Clickpoint Innovation specializes in full-stack web development, cross-platform mobile apps, custom AI copilots, and cloud architecture. To discuss your project or get in touch with our team, please visit our [Contact Page](/contact) or email info@clickpoint.com.np.",
      sessionId: body.sessionId || "default",
      sources: [{ title: "Contact Clickpoint", url: "/contact", sourceType: "contact" }],
      cached: false,
      provider_used: "safety_fallback",
    });
  } catch (error: any) {
    console.error("Chat API route error:", error);
    return NextResponse.json({
      reply: "Clickpoint Innovation specializes in full-stack web development, cross-platform mobile apps, custom AI copilots, and cloud architecture. To discuss your project, please visit our [Contact Page](/contact) or email info@clickpoint.com.np.",
      sessionId: "default",
      sources: [{ title: "Contact Clickpoint", url: "/contact", sourceType: "contact" }],
      cached: false,
      provider_used: "error_fallback",
    });
  }
}
