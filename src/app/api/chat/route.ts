import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_SYSTEM_PROMPT = `You are "Clix", the friendly, expert AI Assistant for Clickpoint Innovation — a leading global AI-first digital product engineering consultancy.

STRICT INSTRUCTIONS:
- Answer ONLY the specific question asked by the user. Do not include unrequested, extra, or random company information.
- Format all lists using clean bullet points (• **Title**: Brief Summary).
- If the user asks to "list out blogs", list ONLY the titles and categories of the available blog posts.
- If the user asks to "list out case studies", list ONLY the titles and clients of the available case studies.
- If the user asks about a specific person (e.g., Ashok Khanal or Rabin Shrestha), state ONLY their role and key responsibilities concisely.
- If the user asks "tell me about Clickpoint", provide ONLY a clean, high-level 3-4 bullet point overview of the company.
- Do not output raw JSON data, code brackets, or technical object dumps under any circumstances.
- Do not use markdown headings (no #, ##, ###).
- Do not use emojis.`;

function cleanText(input: any): string {
  if (!input) return "";
  if (typeof input === "string") return input.trim();
  if (typeof input === "number" || typeof input === "boolean") return String(input);
  return "";
}

interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

async function fetchLiveDatabaseContext(): Promise<{ text: string; data: any; items: KnowledgeItem[] }> {
  try {
    const [
      landing,
      about,
      servicesRecord,
      careers,
      contact,
      journey,
      testimonialsPage,
      caseStudiesPage,
      blogPage,
      vacancies,
      testimonials,
      caseStudies,
      blogPosts,
      faqs,
    ] = await Promise.all([
      prisma.landingPage.findFirst().catch(() => null),
      prisma.aboutPage.findFirst().catch(() => null),
      prisma.servicesPage.findFirst().catch(() => null),
      prisma.careersPage.findFirst().catch(() => null),
      prisma.contactPage.findFirst().catch(() => null),
      prisma.journeyPage.findFirst().catch(() => null),
      prisma.testimonialsPage.findFirst().catch(() => null),
      prisma.caseStudiesPage.findFirst().catch(() => null),
      prisma.blogPage.findFirst().catch(() => null),
      prisma.jobVacancy.findMany({ where: { isActive: true }, take: 20 }).catch(() => []),
      prisma.testimonial.findMany({ where: { isApproved: true }, take: 25 }).catch(() => []),
      prisma.caseStudy.findMany({ take: 20 }).catch(() => []),
      prisma.blogPost.findMany({ take: 20 }).catch(() => []),
      prisma.faqCategory.findMany({ include: { faqs: true }, take: 15 }).catch(() => []),
    ]);

    const contextSections: string[] = [];
    const items: KnowledgeItem[] = [];

    // 1. Leadership
    items.push({
      id: "ashok-khanal",
      category: "Leadership",
      title: "Ashok Khanal",
      content: "**Ashok Khanal** is the Founder & Chief Executive Officer (CEO) of Clickpoint Innovation.\n\n• **Role**: Leads global strategic vision, AI product scaling, enterprise client partnerships, and international operations across 12 countries.",
      keywords: ["ashok", "khanal", "ceo", "founder", "executive", "chief executive"],
    });

    items.push({
      id: "rabin-shrestha",
      category: "Leadership",
      title: "Rabin Shrestha",
      content: "**Rabin Shrestha** is the Chief Technology Officer (CTO & AI Architect) of Clickpoint Innovation.\n\n• **Role**: Architects autonomous AI agent pods, LLM RAG vector pipelines, distributed microservices, and high-performance web infrastructure.",
      keywords: ["rabin", "shrestha", "cto", "architect", "technology", "chief technology officer"],
    });

    items.push({
      id: "nisha-khanal",
      category: "Leadership",
      title: "Nisha Khanal",
      content: "**Nisha Khanal** is the Head of Digital Marketing & SEO at Clickpoint Innovation, leading technical SEO, CRO split-testing, and analytics.",
      keywords: ["nisha", "khanal", "marketing", "seo", "head of marketing"],
    });

    items.push({
      id: "marcus-vance",
      category: "Leadership",
      title: "Marcus Vance",
      content: "**Marcus Vance** is the Head of Product & UI/UX Design at Clickpoint Innovation, overseeing design systems, micro-animations, and user research.",
      keywords: ["marcus", "vance", "design", "ui", "ux", "head of design"],
    });

    // 2. Services List
    let servicesList: any[] = [];
    if (servicesRecord?.content) {
      const s = servicesRecord.content as any;
      if (Array.isArray(s.services)) {
        servicesList = s.services;
        for (const svc of s.services) {
          const sTitle = cleanText(svc.title);
          const sDesc = cleanText(svc.desc || svc.description || svc.subtitle || svc.fullOverview);
          if (sTitle) {
            items.push({
              id: `service-${sTitle.toLowerCase().replace(/\s+/g, "-")}`,
              category: "Service",
              title: sTitle,
              content: `• **${sTitle}**: ${sDesc}`,
              keywords: [sTitle.toLowerCase(), ...sTitle.toLowerCase().split(/\s+/), "service"],
            });
          }
        }
      }
    }

    // 3. Blog Posts List
    if (blogPosts.length > 0) {
      for (const b of blogPosts) {
        items.push({
          id: `blog-${b.id}`,
          category: "Blog",
          title: b.title,
          content: `• **${b.title}** (${b.category}, by ${b.author}): ${b.excerpt}`,
          keywords: [b.title.toLowerCase(), b.category.toLowerCase(), b.author.toLowerCase(), "blog", "article", "insight", "post"],
        });
      }
    }

    // 4. Case Studies List
    if (caseStudies.length > 0) {
      for (const c of caseStudies) {
        items.push({
          id: `casestudy-${c.id}`,
          category: "CaseStudy",
          title: c.title,
          content: `• **${c.title}** (Client: ${c.client}): ${c.description}`,
          keywords: [c.title.toLowerCase(), c.client.toLowerCase(), "case study", "portfolio", "project", "work"],
        });
      }
    }

    // 5. Job Vacancies List
    if (vacancies.length > 0) {
      for (const v of vacancies) {
        items.push({
          id: `vacancy-${v.id}`,
          category: "Vacancy",
          title: v.title,
          content: `• **${v.title}** (${v.type}, ${v.location}): ${v.summary}`,
          keywords: [v.title.toLowerCase(), "job", "career", "vacancy", "opening", "role"],
        });
      }
    }

    // Structured Prompt Context
    contextSections.push(`COMPANY SUMMARY:
Clickpoint Innovation is a global AI-first digital product engineering consultancy.
- Founded: 2016 in Kathmandu, Nepal
- Global Presence: 150+ engineers across 12 countries
- Nepal Tech HQ: 500-seat campus in New Baneshwor, Kathmandu
- Leadership: Ashok Khanal (CEO), Rabin Shrestha (CTO), Nisha Khanal (SEO Lead), Marcus Vance (Design Lead)`);

    if (servicesList.length > 0) {
      const sFormatted = servicesList.map((s: any) => `• ${s.title}: ${s.desc || s.description || ""}`).join("\n");
      contextSections.push(`CORE SERVICES:\n${sFormatted}`);
    }

    if (blogPosts.length > 0) {
      const bFormatted = blogPosts.map((b) => `• ${b.title} (${b.category}): ${b.excerpt}`).join("\n");
      contextSections.push(`BLOG ARTICLES & INSIGHTS:\n${bFormatted}`);
    }

    if (caseStudies.length > 0) {
      const csFormatted = caseStudies.map((c) => `• ${c.title} (Client: ${c.client}): ${c.description}`).join("\n");
      contextSections.push(`CASE STUDIES & PORTFOLIO:\n${csFormatted}`);
    }

    if (vacancies.length > 0) {
      const vFormatted = vacancies.map((v) => `• ${v.title} (${v.type}, ${v.location}): ${v.summary}`).join("\n");
      contextSections.push(`ACTIVE VACANCIES:\n${vFormatted}`);
    }

    if (faqs.length > 0) {
      const fFormatted = faqs.flatMap((cat) => (cat.faqs || []).map((f) => `Q: ${f.question}\nA: ${f.answer}`)).join("\n\n");
      contextSections.push(`FREQUENTLY ASKED QUESTIONS:\n${fFormatted}`);
    }

    return {
      text: contextSections.join("\n\n----------------------------------------\n\n"),
      data: {
        landing,
        about,
        services: servicesList,
        careers,
        contact,
        journey,
        vacancies,
        testimonials,
        caseStudies,
        blogPosts,
        faqs,
      },
      items,
    };
  } catch (e) {
    console.warn("Failed to fetch live database context:", e);
    return { text: "", data: {}, items: [] };
  }
}

async function callGeminiWithContext(userPrompt: string, dbContextText: string): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  const modelsToTry = [
    process.env.GEMINI_MODEL_NAME || "gemini-1.5-flash",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
  ];
  const uniqueModels = Array.from(new Set(modelsToTry));

  const systemMessage = `${BASE_SYSTEM_PROMPT}\n\nLIVE WEBSITE KNOWLEDGE BASE:\n${dbContextText}`;
  const contents = [
    {
      role: "user",
      parts: [{ text: `${systemMessage}\n\nUser Question: ${userPrompt}` }],
    },
  ];

  for (const model of uniqueModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (e) {
      console.warn(`Gemini API call failed for ${model}:`, e);
    }
  }
  return null;
}

async function tryPythonChatService(message: string, sessionId?: string): Promise<{ reply: string; sources: any[] } | null> {
  // If deployed on Vercel and no external microservice URL is configured, bypass localhost immediately
  if (process.env.VERCEL && (!process.env.CHAT_SERVICE_URL || process.env.CHAT_SERVICE_URL.includes("localhost"))) {
    return null;
  }

  const chatServiceUrl = process.env.CHAT_SERVICE_URL || "http://localhost:8002";
  const internalKey = process.env.INTERNAL_API_KEY || "clickpoint-secret-internal-key-2026";

  try {
    const res = await fetch(`${chatServiceUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": internalKey,
      },
      body: JSON.stringify({ message, sessionId: sessionId || "default" }),
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });

    if (res.ok) {
      const data = await res.json();
      if (
        data?.reply &&
        !data.reply.includes("trouble connecting to our AI server")
      ) {
        return {
          reply: data.reply,
          sources: data.sources || [],
        };
      }
    }
  } catch (e) {
    // Python chat service not reachable
  }
  return null;
}

function generateManagedResponse(message: string, dbData: any, items: KnowledgeItem[]): string {
  const query = message.toLowerCase().trim();

  // 1. Specific Leadership Queries
  if (query.includes("ashok") || query.includes("khanal") || (query.includes("who") && query.includes("ceo"))) {
    return `**Ashok Khanal** is the Founder & Chief Executive Officer (CEO) of Clickpoint Innovation.

• **Role**: Leads global strategic vision, AI product scaling, enterprise client partnerships, and international operations across 12 countries.`;
  }

  if (query.includes("rabin") || query.includes("shrestha") || (query.includes("who") && query.includes("cto"))) {
    return `**Rabin Shrestha** is the Chief Technology Officer (CTO & AI Architect) of Clickpoint Innovation.

• **Role**: Architects autonomous AI agent pods, LLM RAG vector pipelines, distributed microservices, and high-performance web infrastructure.`;
  }

  if (query.includes("nisha") || query.includes("seo")) {
    return `**Nisha Khanal** is the Head of Digital Marketing & SEO at Clickpoint Innovation, overseeing technical SEO, conversion optimization (CRO), and analytics.`;
  }

  if (query.includes("marcus") || query.includes("vance")) {
    return `**Marcus Vance** is the Head of Product & UI/UX Design at Clickpoint Innovation, overseeing enterprise design systems, micro-animations, and user research.`;
  }

  if (query.includes("team") || (query.includes("who") && query.includes("lead")) || query.includes("leadership")) {
    return `Our executive leadership team at Clickpoint Innovation:

• **Ashok Khanal**: Founder & Chief Executive Officer (CEO)
• **Rabin Shrestha**: Chief Technology Officer (CTO & AI Architect)
• **Nisha Khanal**: Head of Digital Marketing & SEO
• **Marcus Vance**: Head of Product & UI/UX Design`;
  }

  // 2. Blog Post Listing
  if (query.includes("blog") || query.includes("article") || query.includes("insight") || query.includes("post")) {
    const posts = dbData.blogPosts || [];
    if (posts.length > 0) {
      const list = posts.map((b: any) => `• **${b.title}** (${b.category})`).join("\n");
      return `Here are our latest technical blog articles and insights:\n\n${list}`;
    }
  }

  // 3. Case Studies Listing
  if (query.includes("case study") || query.includes("case studies") || query.includes("portfolio") || query.includes("project")) {
    const cases = dbData.caseStudies || [];
    if (cases.length > 0) {
      const list = cases.map((c: any) => `• **${c.title}** — Client: ${c.client}`).join("\n");
      return `Here are our featured client case studies and portfolio projects:\n\n${list}`;
    }
  }

  // 4. Job Vacancies Listing
  if (query.includes("job") || query.includes("career") || query.includes("vacancy") || query.includes("opening") || query.includes("hire") || query.includes("role")) {
    const vacancies = dbData.vacancies || [];
    if (vacancies.length > 0) {
      const list = vacancies.map((v: any) => `• **${v.title}** — ${v.type} | ${v.location}`).join("\n");
      return `Here are our active remote-first career openings:\n\n${list}`;
    }
  }

  // 5. Specific Service Match
  const services = dbData.services || [];
  for (const s of services) {
    if (s.title && query.includes(s.title.toLowerCase())) {
      const desc = s.desc || s.description || s.subtitle || s.fullOverview || "";
      return `**${s.title}**\n\n${desc}`;
    }
  }

  // 6. Services Overview
  if (query.includes("service") || query.includes("offer") || query.includes("what do you do") || query.includes("capability") || query.includes("capabilities")) {
    if (services.length > 0) {
      const list = services.map((s: any) => `• **${s.title}**: ${s.desc || s.description || s.subtitle || ""}`).join("\n\n");
      return `Here are our core product engineering services:\n\n${list}`;
    }
  }

  // 7. Clickpoint Overview / Company Info / Founded
  if (query.includes("clickpoint") || query.includes("about") || query.includes("found") || query.includes("history") || query.includes("story")) {
    return `**Clickpoint Innovation** is a leading global AI-first digital product engineering consultancy.

• **Founded**: 2016 in Kathmandu, Nepal
• **Global Scale**: 150+ senior engineers & AI leads operating across 12 countries
• **Nepal Tech HQ**: 500-seat state-of-the-art campus in New Baneshwor, Kathmandu
• **Core Focus**: Designing, architecting, and scaling compounding digital products powered by modern AI, Next.js, and cloud infrastructure`;
  }

  // 8. Pricing Structure
  if (query.includes("price") || query.includes("cost") || query.includes("pricing") || query.includes("budget") || query.includes("package") || query.includes("rate")) {
    return `Here is our transparent pricing and timeline structure:

• **Corporate & Business Website**: $2,500 – $5,000 (1–2 Weeks)
• **E-Commerce Web Platform**: $6,000 – $15,000 (3–5 Weeks)
• **Next.js SaaS Web App**: $12,000 – $30,000 (4–8 Weeks)
• **AI Copilot & Autonomous Agents**: $10,000 – $25,000 (2–4 Weeks)
• **Cross-Platform Mobile App**: $10,000 – $25,000 (4–8 Weeks)`;
  }

  // 9. Contact Info
  if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("reach") || query.includes("office") || query.includes("location") || query.includes("where")) {
    return `You can reach the Clickpoint Innovation team via:

• **Technical & General Email**: info@clickpoint.com.np
• **Careers & HR Email**: budhabhaskar2@gmail.com
• **Nepal Tech HQ**: New Baneshwor, Kathmandu, Nepal
• **Global Pods**: US, Europe & Nepal timezones`;
  }

  return `Hello! I am Clix, your Clickpoint Innovation AI Assistant.

I can help answer any specific question about:
• Dynamic Software & AI Services
• Leadership & Executive Profiles (Ashok Khanal, CEO & Rabin Shrestha, CTO)
• Company History & Founding Year (Est. 2016 in Kathmandu)
• Blog Articles & Tech Insights
• Client Case Studies & Portfolio Projects
• Open Job Vacancies & Careers
• Engagement Pricing & Packages

What specific question can I answer for you today?`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = body.message || body.prompt || body.text || "";

    if (!userMessage.trim()) {
      return NextResponse.json({
        reply: "Hello! I am Clix. How can I assist you with Clickpoint Innovation's software & AI services today?",
        sources: [],
      });
    }

    // 1. Try Python RAG Chat Microservice first
    const pythonResult = await tryPythonChatService(userMessage, body.sessionId);
    if (pythonResult) {
      return NextResponse.json(pythonResult);
    }

    // 2. Fetch real live database context across ALL 14 PostgreSQL page & content tables
    const dbContext = await fetchLiveDatabaseContext();

    // 3. Synthesize 1-on-1 LLM answer grounded in the real-time updated database context
    const aiReply = await callGeminiWithContext(userMessage, dbContext.text);
    if (aiReply) {
      return NextResponse.json({ reply: aiReply, sources: [] });
    }

    // 4. Clean, precision-formatted dynamic response matching exact user query
    const intelligentReply = generateManagedResponse(userMessage, dbContext.data, dbContext.items);
    return NextResponse.json({ reply: intelligentReply, sources: [] });
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({
      reply: "Hello! I am Clix. How can I assist you with Clickpoint Innovation's software & AI services today?",
      sources: [],
    });
  }
}
