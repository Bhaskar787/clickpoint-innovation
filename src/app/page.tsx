import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import StatsSection from "@/components/sections/stats-section";
import Services from "@/components/sections/services";
import TechStackSection from "@/components/sections/tech-stack-section";
import IndustriesSection from "@/components/sections/industries-section";
import Timeline from "@/components/sections/timeline";
import TestimonialsSection from "@/components/sections/testimonials-section";
import BlogSection from "@/components/sections/blog-section";
import FaqSection from "@/components/sections/faq-section";
import CtaSection from "@/components/sections/cta-section";
import { getLandingPageData } from "@/server/actions/landing";
import { getBlogPosts } from "@/server/actions/blog";
import { getJourneyPage } from "@/server/actions/journey";
import { getApprovedTestimonials } from "@/server/actions/testimonials";
import { getFaqs } from "@/server/actions/faqs";
import { getContactPage } from "@/server/actions/contact";

export const dynamic = "force-dynamic";

// Number of FAQs shown in the homepage preview stack before linking out to /faqs
const HOMEPAGE_FAQ_PREVIEW_COUNT = 6;

export default async function Home() {
  const [landingData, blogPosts, journeyContent, approvedTestimonials, faqs, contactContent] = await Promise.all([
    getLandingPageData(),
    getBlogPosts(),
    getJourneyPage(),
    getApprovedTestimonials(),
    getFaqs(),
    getContactPage(),
  ]);

  const selectedFaqIds: string[] =
    landingData?.faqHeader?.selectedFaqIds ||
    landingData?.faqsHeader?.selectedFaqIds ||
    [];

  const landingFaqs =
    selectedFaqIds.length > 0
      ? faqs.filter((f) => selectedFaqIds.includes(f.id))
      : faqs.slice(0, HOMEPAGE_FAQ_PREVIEW_COUNT);

  return (
    <main className="relative bg-background text-ink">
      <Navbar />
      <Hero initialData={landingData?.hero} />
      <StatsSection initialHeader={landingData?.statsHeader} initialStats={landingData?.stats} />
      <Services initialHeader={landingData?.servicesHeader} />
      <TechStackSection initialHeader={landingData?.techStackHeader} initialCategories={landingData?.techCategories} initialItems={landingData?.techItems} />
      <IndustriesSection initialHeader={landingData?.industriesHeader} />
      <Timeline initialContent={journeyContent} landingHeader={landingData?.timelineHeader || landingData?.journeyHeader} />
      <TestimonialsSection initialHeader={landingData?.testimonialsHeader} initialTestimonials={approvedTestimonials} />
      <BlogSection initialHeader={landingData?.blogHeader} initialBlogs={blogPosts} />
      <FaqSection
        initialHeader={landingData?.faqHeader || landingData?.faqsHeader}
        initialFaqs={landingFaqs}
        phone={contactContent.contactInfo.phone}
        phoneSubtext={contactContent.contactInfo.phoneSubtext}
      />
      <CtaSection initialData={landingData?.ctaBanner} />
      <Footer initialData={landingData?.footer || landingData?.footerData} />
    </main>
  );
}
