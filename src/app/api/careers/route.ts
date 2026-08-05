import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CAREERS_CONTENT = {
  hero: {
    badge: "We're Hiring • Global Remote Pods",
    title: "Build the Next Generation of",
    titleHighlight: "AI-First Software",
    subtitle:
      "Join a team of world-class engineers, product designers, and AI researchers building autonomous LLM copilots and zero-downtime enterprise platforms.",
  },
  stats: [
    { id: "st1", value: "100%", label: "Remote-First Culture" },
    { id: "st2", value: "NPR 4L", label: "Annual Tech Stipend" },
    { id: "st3", value: "4.9 / 5.0", label: "Team Glassdoor Rating" },
    { id: "st4", value: "150+", label: "Teammates Worldwide" },
  ],
  perksSection: {
    tag: "Why Clickpoint Innovation",
    title: "Perks & benefits designed for",
    titleHighlight: "high performers",
    subtitle:
      "We empower our team with complete autonomy, top-tier compensation, and world-class engineering tools.",
    perks: [
      {
        id: "p1",
        title: "100% Remote-First Culture",
        desc: "Work from anywhere in the world with flexible working hours tailored to your lifestyle.",
      },
      {
        id: "p2",
        title: "Top 5% Competitive Salary",
        desc: "Industry-leading NPR & USD salary benchmarks, stock options / equity, and annual bonuses.",
      },
      {
        id: "p3",
        title: "NPR 4,00,000 Tech Setup & Learning",
        desc: "Annual stipend for your ideal MacBook setup, ergonomic home office, and learning courses.",
      },
      {
        id: "p4",
        title: "Health, Wellness & PTO",
        desc: "Comprehensive health insurance, mental wellness stipends, and 25 days of paid time off.",
      },
      {
        id: "p5",
        title: "Annual Team Retreats",
        desc: "All-expenses-paid annual global team retreats in places like Bali, Tokyo, and Zurich.",
      },
      {
        id: "p6",
        title: "Rapid Career Progression",
        desc: "Direct mentorship from industry founders, biannual compensation reviews, and leadership paths.",
      },
    ],
  },
  openingsSection: {
    badge: "Available Openings",
    title: "Explore open positions",
    subtitle: "Find your next career leap and apply in under 2 minutes.",
    searchPlaceholder: "Search job title, skill, or department...",
  },
};

export async function GET() {
  try {
    const existing = await prisma.careersPage.findUnique({
      where: { id: "default" },
    });

    if (existing && existing.content) {
      return NextResponse.json({ success: true, data: existing.content });
    }

    const created = await prisma.careersPage.create({
      data: { id: "default", content: DEFAULT_CAREERS_CONTENT },
    });

    return NextResponse.json({ success: true, data: created.content });
  } catch (error) {
    console.error("GET /api/careers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch careers page content", fallback: DEFAULT_CAREERS_CONTENT },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const content = body.content || body;

    const updated = await prisma.careersPage.upsert({
      where: { id: "default" },
      update: { content },
      create: { id: "default", content },
    });

    return NextResponse.json({
      success: true,
      message: "Careers page content saved to database!",
      data: updated.content,
    });
  } catch (error) {
    console.error("PUT /api/careers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save careers page content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return PUT(req);
}
