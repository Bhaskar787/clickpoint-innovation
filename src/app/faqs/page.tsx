import { getFaqs } from "@/server/actions/faqs";
import { getFaqCategories } from "@/server/actions/faq-categories";
import { getContactPage } from "@/server/actions/contact";
import FaqsClientView from "./faqs-client-view";
export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const [faqs, categories, contactContent] = await Promise.all([
    getFaqs(),
    getFaqCategories(),
    getContactPage(),
  ]);

  return (
    <FaqsClientView
      faqs={faqs}
      categories={categories.map((c) => c.name)}
      phone={contactContent.contactInfo.phone}
      phoneSubtext={contactContent.contactInfo.phoneSubtext}
    />
  );
}
