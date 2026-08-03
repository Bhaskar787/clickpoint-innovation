import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEFAULT_INDUSTRIES_PAGE_DATA } from "@/data/default-industries-data";
import IndustryDetailClient from "./industry-detail-client";
import { IndustryItem, IndustriesPageContent } from "@/types";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const targetId = params.id.toLowerCase();

  let matched: IndustryItem | undefined;

  try {
    const record = await prisma.industriesPage.findFirst();
    const content = record?.content
      ? (record.content as unknown as IndustriesPageContent)
      : (DEFAULT_INDUSTRIES_PAGE_DATA as unknown as IndustriesPageContent);

    matched = content.industries?.find((i: IndustryItem) => i.id.toLowerCase() === targetId);
  } catch (err) {
    console.error("Failed to generate metadata for industry:", err);
  }

  if (!matched) {
    return {
      title: "Industry Practice | Clickpoint Innovation",
      description: "Enterprise software solutions engineered for key industry sectors.",
    };
  }

  return {
    title: `${matched.title} | Clickpoint Innovation`,
    description: matched.desc || `Enterprise ${matched.title} solutions built by Clickpoint Innovation.`,
  };
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const targetId = params.id.toLowerCase();

  let matched: IndustryItem | undefined;

  try {
    const record = await prisma.industriesPage.findFirst();
    const content = record?.content
      ? (record.content as unknown as IndustriesPageContent)
      : (DEFAULT_INDUSTRIES_PAGE_DATA as unknown as IndustriesPageContent);

    matched = content.industries?.find((i: IndustryItem) => i.id.toLowerCase() === targetId);
  } catch (error) {
    console.error("Failed to fetch industry detail from DB:", error);
  }

  // Fallback check against default static data if not found in DB
  if (!matched) {
    const defaultContent = DEFAULT_INDUSTRIES_PAGE_DATA as unknown as IndustriesPageContent;
    matched = defaultContent.industries?.find((i: IndustryItem) => i.id.toLowerCase() === targetId);
  }

  if (!matched) {
    notFound();
  }

  return <IndustryDetailClient industry={matched} />;
}
