// Unified Notification Domain Model

export type NotificationCategory = "REVIEW" | "CONTACT" | "QUICK_INQUIRY" | "JOB_APPLICATION";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  clientName: string;
  email?: string;
  subtext?: string;
  content: string;
  rating?: number;
  isRead: boolean;
  createdAt: string;
  targetTab: string;
}

export interface NotificationSummaryResponse {
  success: boolean;
  notifications: AppNotification[];
  unreadCount: number;
  unreadReviewsCount: number;
  unreadContactsCount: number;
  unreadJobAppsCount: number;
}
