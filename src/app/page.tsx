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
import { getServicesPage } from "@/server/actions/services";
import { getIndustriesPage } from "@/server/actions/industries";
import { SERVICES_DATA, INDUSTRIES_DATA } from "@/data/landing-data";

export const dynamic = "force-dynamic";

// Number of FAQs shown in the homepage preview stack before linking out to /faqs
const HOMEPAGE_FAQ_PREVIEW_COUNT = 6;

export default async function Home() {
  const [
    landingData,
    blogPosts,
    journeyContent,
    approvedTestimonials,
    faqs,
    contactContent,
    servicesPageContent,
    industriesPageContent,
  ] = await Promise.all([
    getLandingPageData(),
    getBlogPosts(),
    getJourneyPage(),
    getApprovedTestimonials(),
    getFaqs(),
    getContactPage(),
    getServicesPage(),
    getIndustriesPage(),
  ]);

  // FAQs Manual Filter
  const selectedFaqIds: string[] =
    landingData?.faqHeader?.selectedFaqIds ||
    landingData?.faqsHeader?.selectedFaqIds ||
    [];
  const landingFaqs =
    selectedFaqIds.length > 0
      ? faqs.filter((f) => selectedFaqIds.includes(f.id))
      : faqs.slice(0, HOMEPAGE_FAQ_PREVIEW_COUNT);

  // Services Manual Filter
  const selectedServiceIds: string[] = landingData?.servicesHeader?.selectedServiceIds || [];
  const allServices = (servicesPageContent as any)?.services || SERVICES_DATA;
  const landingServices =
    selectedServiceIds.length > 0
      ? allServices.filter((s: any) => selectedServiceIds.includes(s.id))
      : undefined;

  // Industries Manual Filter
  const selectedIndustryIds: string[] = landingData?.industriesHeader?.selectedIndustryIds || [];
  const allIndustries = (industriesPageContent as any)?.industries || INDUSTRIES_DATA;
  const landingIndustries =
    selectedIndustryIds.length > 0
      ? allIndustries.filter((i: any) => selectedIndustryIds.includes(i.id))
      : undefined;

  // Testimonials Manual Filter
  const selectedTestimonialIds: string[] = landingData?.testimonialsHeader?.selectedTestimonialIds || [];
  const landingTestimonials =
    selectedTestimonialIds.length > 0
      ? approvedTestimonials.filter((t: any) => selectedTestimonialIds.includes(t.id))
      : approvedTestimonials;

  // Blog Manual Filter
  const selectedBlogIds: string[] = landingData?.blogHeader?.selectedBlogIds || [];
  const landingBlogs =
    selectedBlogIds.length > 0
      ? blogPosts.filter((b) => selectedBlogIds.includes(b.id) || selectedBlogIds.includes(b.slug))
      : blogPosts;

  return (
    <main className="relative bg-background text-ink">
      <Navbar />
      <Hero initialData={landingData?.hero} />
      <StatsSection initialHeader={landingData?.statsHeader} initialStats={landingData?.stats} />
      <Services initialHeader={landingData?.servicesHeader} initialServices={landingServices} />
      <TechStackSection initialHeader={landingData?.techStackHeader} initialCategories={landingData?.techCategories} initialItems={landingData?.techItems} />
      <IndustriesSection initialHeader={landingData?.industriesHeader} initialIndustries={landingIndustries} />
      <Timeline initialContent={journeyContent} landingHeader={landingData?.timelineHeader || landingData?.journeyHeader} />
      <TestimonialsSection initialHeader={landingData?.testimonialsHeader} initialTestimonials={landingTestimonials} />
      <BlogSection initialHeader={landingData?.blogHeader} initialBlogs={landingBlogs} />
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
