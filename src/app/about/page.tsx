import { prisma } from "@/lib/prisma";
import AboutClientView from "./about-client-view";
import { STATS_DATA } from "@/data/landing-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_ABOUT_CONTENT = {
  hero: {
    badge: "About Clickpoint Innovation",
    title: "Pioneering the AI-First Era of Software Engineering",
    highlightText: "Software Engineering",
    subtitle:
      "We help ambitious startups and global enterprise leaders design, architect, and scale compounding digital products powered by modern AI & cloud infrastructure.",
    primaryBtnText: "Meet Our Leadership",
    secondaryBtnText: "Read Our Story",
    videoUrl: "/images/video.mp4",
  },
  stats: STATS_DATA,
  mission: {
    tag: "Our Story & Mission",
    heading: "From a 4-person dev shop to a global AI partner",
    highlightHeading: "global AI partner",
    paragraph1:
      "Founded in 2016, Clickpoint Innovation was built on a singular conviction: that software engineering should be fast, resilient, and continuously compounding in value.",
    paragraph2:
      "Over the past decade, we have expanded from a lean MVP factory into an international engineering consultancy with 150+ engineers, designers, and AI specialists across 3 timezones. We combine deep technical rigor with cutting-edge LLMs and autonomous agent workflows to deliver software ready for tomorrow's scale.",
    bullets: [
      "Global 24/7 delivery pods across US, Europe & Asia",
      "SOC2 Type II certified & enterprise-grade data isolation",
      "89% long-term client retention across 350+ completed builds",
    ],
    cardTitle: "Global Engineering Pods",
    cardDesc:
      "Our distributed engineering pods operate round-the-clock, delivering continuous integration and rapid feature deployments with zero downtime.",
    statBox1Label: "Timezones Covered",
    statBox1Value: "3 Continents",
    statBox2Label: "Code Reviews",
    statBox2Value: "100% Peer Audited",
  },
  values: {
    tag: "Guiding Principles",
    title: "Our core values driving engineering culture",
    highlightTitle: "engineering culture",
    items: [
      {
        id: "val-1",
        title: "Engineering Excellence",
        description: "We take pride in clean, maintainable, sub-second codebases built with strict type safety and high test coverage.",
      },
      {
        id: "val-2",
        title: "Human + AI Synergy",
        description: "We leverage autonomous AI agent pods to augment developer productivity, shipping features 3x faster.",
      },
      {
        id: "val-3",
        title: "Client Obsession",
        description: "Your business metrics are our metrics. We align engineering output directly with conversion and revenue growth.",
      },
      {
        id: "val-4",
        title: "Enterprise Security",
        description: "SOC2 Type II compliant pipelines, zero-trust cloud architectures, and strict tenant data isolation.",
      },
    ],
  },
  leadership: {
    tag: "Leadership & Key Team Members",
    title: "Meet the minds driving Clickpoint Innovation",
    highlightTitle: "Clickpoint Innovation",
    subtitle: "Experienced technology leaders, AI architects, product designers, and growth marketers.",
    team: [
      {
        id: "ashok-khanal",
        name: "Ashok Khanal",
        role: "Founder & Chief Executive Officer (CEO)",
        bio: "Pioneering AI-first digital product engineering and enterprise technology transformation across global markets.",
        imageUrl: "",
        expertise: ["Product Strategy", "AI Leadership", "Enterprise Growth"],
      },
      {
        id: "rabin-shrestha",
        name: "Rabin Shrestha",
        role: "Chief Technology Officer (CTO & AI Architect)",
        bio: "Ex-BigTech AI lead architecting LLM copilot pods, vector indexing pipelines, and distributed multi-cloud systems.",
        imageUrl: "",
        expertise: ["LLM Architectures", "Distributed Systems", "Vector Databases"],
      },
      {
        id: "nisha-khanal",
        name: "Nisha Khanal",
        role: "Head of Digital Marketing & SEO",
        bio: "Performance growth strategist scaling B2B SaaS ARR through scientific CRO, technical SEO, and automated lifecycle engines.",
        imageUrl: "",
        expertise: ["Digital Marketing", "Technical SEO", "Growth CRO"],
      },
      {
        id: "marcus-vance",
        name: "Marcus Vance",
        role: "Head of Product & UI/UX Design",
        bio: "Award-winning product designer creating human-centric design systems, micro-animations, and conversion-optimized interfaces.",
        imageUrl: "",
        expertise: ["Design Systems", "Usability Research", "Figma & Motion"],
      },
      {
        id: "priya-patel",
        name: "Priya Patel",
        role: "VP of Engineering & MLOps",
        bio: "MLOps engineering lead automating production ML pipelines, real-time drift monitoring, and zero-downtime microservices.",
        imageUrl: "",
        expertise: ["MLOps Pipelines", "Kubernetes", "PyTorch & Retraining"],
      },
      {
        id: "david-chen",
        name: "David Chen",
        role: "Head of Enterprise Solutions & Cloud Security",
        bio: "Cloud security specialist enforcing SOC2 Type II compliance, multi-tenant database isolation, and zero-trust infrastructure.",
        imageUrl: "",
        expertise: ["Cloud Security", "SOC2 Compliance", "Terraform & AWS"],
      },
    ],
  },
};

export default async function AboutPage() {
  let content = DEFAULT_ABOUT_CONTENT;

  try {
    const dbRecord = await prisma.aboutPage.findUnique({
      where: { id: "default" },
    });

    if (dbRecord && dbRecord.content) {
      content = (dbRecord.content as unknown) as typeof DEFAULT_ABOUT_CONTENT;
    }
  } catch (error) {
    console.error("Failed to query about content from Prisma DB:", error);
  }

  return <AboutClientView initialContent={content} />;
}
