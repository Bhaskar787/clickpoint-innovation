// Real-time Notification Engine (SSE + BroadcastChannel WebSocket fallback)

export interface NotificationEvent {
  id: string;
  type: "REVIEW" | "CONTACT" | "QUICK_INQUIRY";
  title: string;
  clientName: string;
  email?: string;
  subtext?: string;
  content: string;
  rating?: number;
  createdAt: string;
  targetTab?: string;
}

const CHANNEL_NAME = "clickpoint_realtime_notifications_v1";

export function broadcastNotification(eventData: NotificationEvent) {
  try {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(eventData);
      channel.close();
    }
  } catch (err) {
    console.error("BroadcastChannel error:", err);
  }
}

export function subscribeRealtimeNotifications(onNotification: (data: NotificationEvent) => void) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return () => {};
  }

  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = (event) => {
    if (event.data) {
      onNotification(event.data);
    }
  };

  return () => {
    channel.close();
  };
}
