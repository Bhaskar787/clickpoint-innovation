import { prisma } from "@/lib/prisma";
import { AppNotification, NotificationSummaryResponse } from "@/types/notification";
import { notifySSESubscribers } from "@/lib/sse-bus";
import { broadcastNotification } from "@/lib/realtime-notifications";

export class NotificationService {
  /**
   * Fetch unified list of unread notifications from Testimonials, Contact Inquiries,
   * Quick Inquiries & Job Applications
   */
  static async getUnifiedNotifications(): Promise<NotificationSummaryResponse> {
    try {
      // 1. Fetch unread Testimonials/Reviews from DB
      const dbTestimonials = await prisma.testimonial.findMany({
        where: { isRead: false },
        orderBy: { createdAt: "desc" },
      });

      // 2. Fetch unread Contact Inquiries from DB
      const dbInquiries = await prisma.contactInquiry.findMany({
        where: { isRead: false },
        orderBy: { createdAt: "desc" },
      });

      // 3. Fetch unread Quick Inquiries (Inquiry table with PENDING status)
      const dbQuickInquiries = await prisma.inquiry.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      });

      // 4. Fetch unread Job Applications
      const dbJobApps = await prisma.$queryRaw<any[]>`
        SELECT id, name, email, "jobTitle", "coverLetter", "createdAt"
        FROM "job_applications"
        WHERE "isRead" = false
        ORDER BY "createdAt" DESC
      `;

      const unreadReviewsCount = dbTestimonials.length;
      const unreadContactsCount = dbInquiries.length + dbQuickInquiries.length;
      const unreadJobAppsCount = dbJobApps.length;

      // 5. Map Testimonials to Unified AppNotification
      const reviewNotifications: AppNotification[] = dbTestimonials.map((t) => ({
        id: t.id,
        category: "REVIEW",
        title: "Client Feedback Review",
        clientName: t.clientName,
        email: t.userEmail || undefined,
        subtext: `${t.clientRole}, ${t.company}`,
        content: t.content,
        rating: t.rating,
        isRead: t.isRead,
        createdAt: t.createdAt.toISOString(),
        targetTab: "testimonials-page",
      }));

      // 6. Map Contact Inquiries to Unified AppNotification
      const contactNotifications: AppNotification[] = dbInquiries.map((i) => ({
        id: i.id,
        category: "CONTACT",
        title: "Contact Lead Inquiry",
        clientName: i.name,
        email: i.email,
        subtext: i.service ? `${i.service} (${i.budget || ""})` : i.email,
        content: i.message,
        isRead: i.isRead,
        createdAt: i.createdAt.toISOString(),
        targetTab: "contact-page",
      }));

      // 7. Map Quick Inquiries to Unified AppNotification
      const quickInquiryNotifications: AppNotification[] = dbQuickInquiries.map((q) => ({
        id: q.id,
        category: "QUICK_INQUIRY",
        title: "Quick Inquiry Lead",
        clientName: q.name,
        email: q.email,
        subtext: q.service ? `${q.service} (${q.budget || ""})` : q.company || q.email,
        content: q.message,
        isRead: false,
        createdAt: q.createdAt.toISOString(),
        targetTab: "inquiries",
      }));

      // 8. Map Job Applications to Unified AppNotification
      const jobAppNotifications: AppNotification[] = dbJobApps.map((a) => ({
        id: a.id,
        category: "JOB_APPLICATION",
        title: "New Job Application",
        clientName: a.name,
        email: a.email,
        subtext: `Applied for: ${a.jobTitle}`,
        content: a.coverLetter || `${a.name} applied for ${a.jobTitle}`,
        isRead: false,
        createdAt: new Date(a.createdAt).toISOString(),
        targetTab: "job-applied",
      }));

      // 9. Combine & Sort Descending by Timestamp
      const notifications = [
        ...reviewNotifications,
        ...contactNotifications,
        ...quickInquiryNotifications,
        ...jobAppNotifications,
      ].sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      return {
        success: true,
        notifications,
        unreadCount: notifications.length,
        unreadReviewsCount,
        unreadContactsCount,
        unreadJobAppsCount,
      };
    } catch (error: any) {
      console.error("NotificationService.getUnifiedNotifications Error:", error);
      return {
        success: false,
        notifications: [],
        unreadCount: 0,
        unreadReviewsCount: 0,
        unreadContactsCount: 0,
        unreadJobAppsCount: 0,
      };
    }
  }

  /**
   * Mark a single notification item as read
   */
  static async markAsRead(id: string, category?: string): Promise<boolean> {
    try {
      if (category === "REVIEW") {
        await prisma.testimonial.update({ where: { id }, data: { isRead: true } });
      } else if (category === "QUICK_INQUIRY") {
        await prisma.inquiry.update({ where: { id }, data: { status: "COMPLETED" } });
      } else if (category === "JOB_APPLICATION") {
        await prisma.$executeRaw`
          UPDATE "job_applications" SET "isRead" = true, "updatedAt" = NOW() WHERE id = ${id}
        `;
      } else {
        await prisma.contactInquiry.update({ where: { id }, data: { isRead: true } });
      }
      return true;
    } catch (error) {
      console.error("NotificationService.markAsRead Error:", error);
      return false;
    }
  }

  /**
   * Archive / Mark ALL notifications as read in database
   */
  static async archiveAll(): Promise<boolean> {
    try {
      await Promise.all([
        prisma.testimonial.updateMany({ where: { isRead: false }, data: { isRead: true } }),
        prisma.contactInquiry.updateMany({ where: { isRead: false }, data: { isRead: true } }),
        prisma.inquiry.updateMany({ where: { status: "PENDING" }, data: { status: "COMPLETED" } }),
        prisma.$executeRaw`UPDATE "job_applications" SET "isRead" = true, "updatedAt" = NOW() WHERE "isRead" = false`,
      ]);
      return true;
    } catch (error) {
      console.error("NotificationService.archiveAll Error:", error);
      return false;
    }
  }

  /**
   * Broadcast real-time notification to all active SSE subscribers and BroadcastChannel
   */
  static notifyRealtime(notification: AppNotification) {
    notifySSESubscribers({ type: "NEW_NOTIFICATION", notification });
    broadcastNotification({
      id: notification.id,
      type: notification.category as any,
      title: notification.title,
      clientName: notification.clientName,
      email: notification.email,
      subtext: notification.subtext,
      content: notification.content,
      rating: notification.rating,
      createdAt: notification.createdAt,
      targetTab: notification.targetTab,
    });
  }
}
