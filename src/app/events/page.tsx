import { getJourneyPage } from "@/server/actions/journey";
import JourneyClientView from "@/app/journey/journey-client-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Our Journey — Clickpoint Innovation",
  description:
    "Explore the milestone timeline, breakthroughs, and company events that defined Clickpoint Innovation’s journey over the past decade.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const initialContent = await getJourneyPage();
  return <JourneyClientView initialContent={initialContent} />;
}
