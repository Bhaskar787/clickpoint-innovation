import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_INDUSTRIES_PAGE_DATA } from "@/data/default-industries-data";
import IndustriesCatalogClient from "./industries-catalog-client";
import { IndustriesPageContent } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Industries Served | Clickpoint Innovation",
  description:
    "Tailored engineering for high-growth enterprise sectors including Fintech, Healthcare, E-Commerce, Logistics, and EdTech.",
};

export default async function IndustriesPage() {
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
