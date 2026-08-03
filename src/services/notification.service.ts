import { prisma } from "@/lib/prisma";
import { AppNotification, NotificationSummaryResponse } from "@/types/notification";
import { notifySSESubscribers } from "@/lib/sse-bus";
import { broadcastNotification } from "@/lib/realtime-notifications";

export class NotificationService {
  /**
   * Fetch unified list of unread notifications from Testimonials & Contact Inquiries
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

      const unreadReviewsCount = dbTestimonials.length;
      const unreadContactsCount = dbInquiries.length;

      // 3. Map Testimonials to Unified AppNotification
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

      // 4. Map Contact Inquiries to Unified AppNotification
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

      // 5. Combine & Sort Descending by Timestamp
      const notifications = [...reviewNotifications, ...contactNotifications].sort((a, b) => {
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
      };
    } catch (error: any) {
      console.error("NotificationService.getUnifiedNotifications Error:", error);
      return {
        success: false,
        notifications: [],
        unreadCount: 0,
        unreadReviewsCount: 0,
        unreadContactsCount: 0,
      };
    }
  }

  /**
   * Mark a single notification item as read
   */
  static async markAsRead(id: string, category?: string): Promise<boolean> {
    try {
      if (category === "REVIEW") {
        await prisma.testimonial.update({
          where: { id },
          data: { isRead: true },
        });
      } else {
        await prisma.contactInquiry.update({
          where: { id },
          data: { isRead: true },
        });
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
        prisma.testimonial.updateMany({
          where: { isRead: false },
          data: { isRead: true },
        }),
        prisma.contactInquiry.updateMany({
          where: { isRead: false },
          data: { isRead: true },
        }),
      ]);
      return true;
    } catch (error) {
      console.error("NotificationService.archiveAll Error:", error);
      return false;
    }
  }

  /**
   * Broadcast real-time notification to all active subscribers
   */
  static notifyRealtime(notification: AppNotification) {
    notifySSESubscribers({ type: "NEW_NOTIFICATION", notification });
    broadcastNotification({
      id: notification.id,
      type: notification.category,
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
