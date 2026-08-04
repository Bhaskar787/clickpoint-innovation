/**
 * Permission Constants for Role-Based Access Control (RBAC)
 */

export const ALL_PERMISSIONS = {
  // About Page CMS
  CMS_ABOUT_READ: "cms:about:read",
  CMS_ABOUT_UPDATE: "cms:about:update",

  // Services Page CMS
  CMS_SERVICES_READ: "cms:services:read",
  CMS_SERVICES_UPDATE: "cms:services:update",

  // Case Studies CMS
  CMS_CASE_STUDIES_READ: "cms:casestudies:read",
  CMS_CASE_STUDIES_UPDATE: "cms:casestudies:update",

  // Blog CMS
  CMS_BLOG_READ: "cms:blog:read",
  CMS_BLOG_UPDATE: "cms:blog:update",

  // Inquiries / Leads CMS
  CMS_INQUIRY_READ: "cms:inquiry:read",
  CMS_INQUIRY_UPDATE: "cms:inquiry:update",

  // FAQ CMS
  CMS_FAQ_READ: "cms:faq:read",
  CMS_FAQ_UPDATE: "cms:faq:update",
} as const;

export type Permission = (typeof ALL_PERMISSIONS)[keyof typeof ALL_PERMISSIONS];
