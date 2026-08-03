import { NextResponse } from "next/server";
import { NotificationService } from "@/services/notification.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/notifications — Unified endpoint to fetch unread notifications & counts
export async function GET() {
  try {
    const summary = await NotificationService.getUnifiedNotifications();
    return NextResponse.json(summary, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications — Unified endpoint to mark single or all notifications as read
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, id, category } = body;

    if (action === "mark-read" && id) {
      const success = await NotificationService.markAsRead(id, category);
      return NextResponse.json({ success });
    }

    if (action === "archive-all") {
      const success = await NotificationService.archiveAll();
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update notification status" },
      { status: 500 }
    );
  }
}
