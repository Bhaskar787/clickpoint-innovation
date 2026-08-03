import { prisma } from "@/lib/prisma";
import ServicesCatalogClient from "./services-catalog-client";
import { SERVICES_DATA } from "@/data/landing-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_SERVICES_CONTENT = {
  hero: {
    badge: "Full-Spectrum Software Engineering Pods",
    title: "Engineering Next-Gen AI & Digital Solutions",
    subtitle:
      "From custom autonomous LLM agents to high-concurrency cloud microservices, we build scalable software systems designed for compounding business velocity.",
  },
  catalogSection: {
    tag: "Our Core Disciplines",
    title: "End-to-End Capabilities Built for Scale",
  },
  processSection: {
    tag: "Engineering Process & Pod Model",
    title: "How Our Dedicated Pods Build & Scale Software",
    subtitle:
      "A disciplined, 4-phase agile engineering methodology engineered for sub-second performance, continuous deployment, and enterprise security.",
    steps: [
      {
        step: "01",
        title: "Discovery & Pod Assembly",
        desc: "We analyze product specs, define technical architecture, and assemble a dedicated 100% senior engineering pod tailored to your stack.",
        deliverable: "Architecture Blueprint & Pod Roadmap",
      },
      {
        step: "02",
        title: "Rapid Prototyping & MVP",
        desc: "2-4 week sprint cycles delivering functional code, interactive Figma UI prototypes, and early CI/CD pipeline integration.",
        deliverable: "Working MVP & Automated Test Suite",
      },
      {
        step: "03",
        title: "Continuous Integration & AI Pods",
        desc: "Daily code commits, automated peer code reviews, LLM copilot augmentation, and real-time staging deployments.",
        deliverable: "Production Release Candidate",
      },
      {
        step: "04",
        title: "Scale, SLA & Managed Ops",
        desc: "99.99% uptime monitoring, auto-scaling cloud microservices, SOC2 data isolation, and ongoing maintenance SLA.",
        deliverable: "Enterprise SLA & Live Production",
      },
    ],
  },
  services: SERVICES_DATA.map(({ icon, ...s }: any) => ({
    ...s,
    imageUrl: s.imageUrl || "",
    keyMetrics: s.keyMetrics || [],
    features: s.features || [],
    techStack: s.techStack || [],
  })),
};

export default async function ServicesPage() {
  let content = DEFAULT_SERVICES_CONTENT;

  try {
    const dbRecord = await prisma.servicesPage.findUnique({
      where: { id: "default" },
    });

    if (dbRecord && dbRecord.content) {
      content = (dbRecord.content as unknown) as typeof DEFAULT_SERVICES_CONTENT;
    }
  } catch (error) {
    console.error("Failed to query services content from Prisma DB:", error);
  }

  return <ServicesCatalogClient initialContent={content} />;
}
