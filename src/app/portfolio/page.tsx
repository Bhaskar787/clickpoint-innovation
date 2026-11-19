import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_INDUSTRIES_PAGE_DATA } from "@/data/default-industries-data";
import IndustriesCatalogClient from "@/app/industries/industries-catalog-client";
import { IndustriesPageContent } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Portfolio & Industries Served | Clickpoint Innovation",
  description:
    "Tailored engineering for high-growth enterprise sectors including Fintech, Healthcare, E-Commerce, Logistics, and EdTech.",
};

export default async function PortfolioPage() {
  let content: IndustriesPageContent = DEFAULT_INDUSTRIES_PAGE_DATA as unknown as IndustriesPageContent;

  try {
    const pageRecord = await prisma.industriesPage.findFirst();
    if (pageRecord && pageRecord.content) {
      content = pageRecord.content as unknown as IndustriesPageContent;
    }
  } catch (error) {
    console.error("Failed to query IndustriesPage from PostgreSQL:", error);
  }

  return <IndustriesCatalogClient initialContent={content} />;
}
