import { getFaqs } from "@/server/actions/faqs";
import { getFaqCategories } from "@/server/actions/faq-categories";
import { getContactPage } from "@/server/actions/contact";
import { getLandingPageData } from "@/server/actions/landing";
import FaqsClientView from "./faqs-client-view";
export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const [landingData, faqs, categories, contactContent] = await Promise.all([
    getLandingPageData(),
    getFaqs(),
    getFaqCategories(),
    getContactPage(),
  ]);

  return (
    <FaqsClientView
      header={landingData?.faqPageHeader}
      faqs={faqs}
      categories={categories.map((c) => c.name)}
      phone={contactContent.contactInfo.phone}
      phoneSubtext={contactContent.contactInfo.phoneSubtext}
    />
  );
}
