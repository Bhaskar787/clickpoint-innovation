import { Metadata } from "next";
import { getTestimonialsPage, getApprovedTestimonials } from "@/server/actions/testimonials";
import TestimonialsClientView from "./testimonials-client-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Testimonials & Verified Reviews | Clickpoint Innovation",
  description:
    "Read real reviews, verified ROI impact metrics, and engineering experiences from founders, CTOs, and product leaders who build with Clickpoint Innovation.",
};

export default async function TestimonialsPage() {
  const [content, testimonials] = await Promise.all([
    getTestimonialsPage(),
    getApprovedTestimonials(),
  ]);

  return (
    <TestimonialsClientView
      initialContent={content}
      initialTestimonials={testimonials}
    />
  );
}
