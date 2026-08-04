import { NotFoundPageContent } from "@/types";

export const DEFAULT_NOT_FOUND_DATA: NotFoundPageContent = {
  hero: {
    eyebrowBadge: "Error 404 • Page Not Found",
    errorCode: "404",
    title: "Page Lost in Cyberspace",
    titleHighlight: "",
    subtitle:
      "The page or route you are looking for might have been removed, renamed, or is temporarily unavailable. Let's get you back on track!",
  },
  actions: [
    {
      id: "action-home",
      label: "Return to Homepage",
      href: "/",
      icon: "arrow-left",
      style: "primary",
      order: 1,
    },
    {
      id: "action-services",
      label: "Explore Services",
      href: "/#services",
      icon: "compass",
      style: "outline",
      order: 2,
    },
    {
      id: "action-contact",
      label: "Contact Support",
      href: "/contact",
      icon: "phone",
      style: "ghost",
      order: 3,
    },
  ],
};