import { TestimonialsPageContent } from "@/types";

export const DEFAULT_TESTIMONIALS_PAGE_DATA: TestimonialsPageContent = {
  hero: {
    badge: "Client Proof & Verified Reviews",
    title: "Trusted by Fast-Growing Startups & Enterprise Leaders Worldwide",
    subtitle:
      "Read real reviews, verified ROI impact metrics, and engineering experiences from founders, CTOs, and product leaders who build with Clickpoint Innovation.",
    ctaButtonText: "Partner With Us Today",
    reviewModalButtonText: "Give Review / Feedback",
  },
  metrics: [
    { label: "Average Client Rating", value: "4.9 / 5.0" },
    { label: "Verified Reviews", value: "350+" },
    { label: "Client Retention Rate", value: "89%" },
  ],
  testimonials: [
    {
      id: "testi-1",
      clientName: "Rajesh Verma",
      clientRole: "VP of Product Engineering",
      company: "Khataflow Inc.",
      content:
        "Clickpoint's AI engineering team transformed our legacy financial audit pipeline into a real-time autonomous agent pod. Our daily processing volume jumped from $4M to $42M+ with zero downtime.",
      rating: 5,
      avatarUrl: "",
      featured: true,
      isApproved: true,
      isRead: true,
      order: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: "testi-2",
      clientName: "Claire Bennett",
      clientRole: "Chief Product Officer",
      company: "Caratlane Global",
      content:
        "The headless e-commerce build and AI visual search feature engineered by Clickpoint delivered an immediate +34% lift in checkout conversions. Their technical speed is unmatched.",
      rating: 5,
      avatarUrl: "",
      featured: true,
      isApproved: true,
      isRead: true,
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: "testi-3",
      clientName: "Dr. Evelyn Vance",
      clientRole: "Head of Digital Health Solutions",
      company: "MediPulse Health",
      content:
        "HIPAA compliance and clinical accuracy were critical for our platform. Clickpoint delivered an automated AI claims engine achieving 99.8% accuracy and cutting adjudication cycles by 3.5x.",
      rating: 5,
      avatarUrl: "",
      featured: true,
      isApproved: true,
      isRead: true,
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: "testi-4",
      clientName: "Marcus Vance",
      clientRole: "Lead Product Architect",
      company: "Synthworks AI",
      content:
        "We scaled from zero to 50,000 active monthly subscribers in under 90 days. Clickpoint's type-safe Next.js architecture handled the traffic surge flawlessly.",
      rating: 5,
      avatarUrl: "",
      featured: true,
      isApproved: true,
      isRead: true,
      order: 3,
      createdAt: new Date().toISOString(),
    },
  ],
};
