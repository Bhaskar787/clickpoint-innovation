"use server";

import { requirePermission } from "@/lib/permissions";
import { ALL_PERMISSIONS } from "@/lib/permissions/constants";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { InquiryStatus } from "@/types";

export interface SubmitInquiryPayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
}

/**
 * Submit New Client Inquiry / Contact Lead (Public Server Action)
 */
export async function submitInquiry(payload: SubmitInquiryPayload) {
  const { name, email, company, service, budget, message } = payload;

  if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
    throw new Error("Name, email, and message are required fields.");
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || null,
      service: service?.trim() || null,
      budget: budget?.trim() || null,
      message: message.trim(),
      status: "PENDING",
    },
  });

  revalidateTag("inquiries");

  return {
    success: true,
    id: inquiry.id,
    message: "Thank you! Your inquiry has been received. Our team will get back to you within 24 hours.",
  };
}

/**
 * Get All Inquiries for Admin Dashboard (Requires CMS_INQUIRY_READ)
 */
export async function getInquiriesForAdmin() {
  await requirePermission(ALL_PERMISSIONS.CMS_INQUIRY_READ);

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return inquiries;
}

/**
 * Update Inquiry Status (Requires CMS_INQUIRY_UPDATE)
 */
export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await requirePermission(ALL_PERMISSIONS.CMS_INQUIRY_UPDATE);

  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: { status },
  });

  revalidateTag("inquiries");

  return {
    success: true,
    id: inquiry.id,
    status: inquiry.status,
    message: `Inquiry status updated to ${status}`,
  };
}

/**
 * Delete Inquiry (Requires CMS_INQUIRY_UPDATE)
 */
export async function deleteInquiry(id: string) {
  await requirePermission(ALL_PERMISSIONS.CMS_INQUIRY_UPDATE);

  await prisma.inquiry.delete({
    where: { id },
  });

  revalidateTag("inquiries");

  return {
    success: true,
    message: "Inquiry deleted successfully",
  };
}
