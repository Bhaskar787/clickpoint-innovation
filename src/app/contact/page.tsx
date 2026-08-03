import { Metadata } from "next";
import { getContactPage } from "@/server/actions/contact";
import ContactClientView from "./contact-client-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us | Clickpoint Innovation",
  description:
    "Have a project idea, architecture question, or enterprise inquiry? Reach out to our engineering team and receive a technical response within 24 hours.",
};

export default async function ContactPage() {
  const content = await getContactPage();

  return <ContactClientView initialContent={content} />;
}