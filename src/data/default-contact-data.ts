import { ContactPageContent } from "@/types";

export const DEFAULT_CONTACT_PAGE_DATA: ContactPageContent = {
  hero: {
    badge: "Direct Communication & Consultation",
    title: "Let's Build Your Next High-Impact Digital Product Together",
    subtitle:
      "Have a project idea, architecture question, or enterprise inquiry? Reach out to our engineering team and receive a technical response within 24 hours.",
    formTitle: "Send Us a Message",
    formSubtitle: "Fill out the fields below and our tech leads will reach out shortly.",
    submitButtonText: "Submit Inquiry & Request Proposal",
  },
  contactInfo: {
    address: "New Baneshwor, Kathmandu, Nepal",
    addressSubtext: "South Asia Engineering HQ",
    email: "info@clickpoint.com.np",
    emailSubtext: "24/7 Technical Inquiry Response",
    phone: "+977-981846632",
    phoneSubtext: "Sun - Fri from 9:00 AM to 6:00 PM NPT",
    hours: "Sun - Fri: 9:00 AM - 6:00 PM",
    hoursSubtext: "Dedicated Support for Enterprise Retainers",
    mapBadge: "Visit Our Headquarters",
    mapTitle: "Locate Click Point Innovations",
    mapSubtitle: "New Baneshwor, Kathmandu, Nepal — Sun - Fri: 9:00 AM - 6:00 PM NPT | 24/7 Technical Support Available",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7546660227695!2d85.33441117613393!3d27.6939765260798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb197b40492713%3A0x8337c2e6d49f6a04!2sClick%20Point%20Innovations%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1785317143002!5m2!1sen!2snp",
    directChannelsTitle: "Direct Executive Email Channels",
    directChannelsSubtitle: "For urgent technical RFPs or enterprise partnership inquiries:",
  },
  quickEnquiryModal: {
    badge: "Have a Project in Mind?",
    title: "Tell Us A Bit More",
    countryCode: "+977",
    selectServicePlaceholder: "--- Select Service ---",
    submitButtonText: "Submit Inquiry",
    rightBadge: "We would love to hear from you",
    rightTitle: "Get In Touch",
    phoneLabel: "Our Phone Number",
    emailLabel: "Email Address",
    locationLabel: "Our Location",
    footerSlaText: "Hours: Sun - Fri: 9:00 AM - 6:00 PM • Executive SLA: 2 Hours",
  },
  formFields: {
    serviceOptions: [
      "AI Copilot & Autonomous Pods",
      "Headless Next.js Web Platform",
      "Cross-Platform iOS & Android App",
      "UI/UX Design System",
      "Cloud Infrastructure & DevOps",
    ],
    budgetOptions: ["$10,000 – $25,000", "$25,000 – $50,000", "$50,000 – $100,000", "$100,000+"],
  },
};
