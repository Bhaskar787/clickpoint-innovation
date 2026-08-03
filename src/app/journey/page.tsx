import { getJourneyPage } from "@/server/actions/journey";
import JourneyClientView from "./journey-client-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Journey & Events — Clickpoint Innovation",
  description:
    "Explore the milestone timeline, breakthroughs, and company events that defined Clickpoint Innovation’s journey over the past decade.",
};

export default async function JourneyPage() {
  const initialContent = await getJourneyPage();
  return <JourneyClientView initialContent={initialContent} />;
}
