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

export default function Home() {
  return (
    <main className="relative bg-background text-ink">
      <Navbar />
      <Hero />
      <StatsSection />
      <Services />
      <TechStackSection />
      <IndustriesSection />
      <Timeline />
      <TestimonialsSection />
      <BlogSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
