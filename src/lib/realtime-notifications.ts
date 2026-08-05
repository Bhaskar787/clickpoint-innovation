// Real-time Notification Engine (SSE + BroadcastChannel WebSocket fallback)

export interface NotificationEvent {
  id: string;
  type: "REVIEW" | "CONTACT" | "QUICK_INQUIRY" | "JOB_APPLICATION" | "INQUIRY";
  title: string;
  clientName: string;
  email?: string;
  subtext?: string;
  content: string;
  rating?: number;
  createdAt: string;
  targetTab?: string;
  category?: string;
}

const CHANNEL_NAME = "clickpoint_realtime_notifications_v1";
const processedEventIds = new Set<string>();

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
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleDedupedNotification = (data: NotificationEvent) => {
    if (data.id) {
      if (processedEventIds.has(data.id)) return; // Prevent duplicate notifications
      processedEventIds.add(data.id);
      setTimeout(() => processedEventIds.delete(data.id), 10000);
    }
    onNotification(data);
  };

  // 1. BroadcastChannel subscription for same-browser tab notifications
  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data) {
        handleDedupedNotification(event.data);
      }
    };
  }

  // 2. EventSource SSE subscription for cross-device / cross-browser server notifications
  let eventSource: EventSource | null = null;
  try {
    eventSource = new EventSource("/api/notifications/stream");
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "NEW_NOTIFICATION" && parsed.notification) {
          const n = parsed.notification;
          handleDedupedNotification({
            id: n.id,
            type: n.category || n.type || "JOB_APPLICATION",
            category: n.category || n.type,
            title: n.title,
            clientName: n.clientName,
            email: n.email,
            subtext: n.subtext,
            content: n.content,
            rating: n.rating,
            createdAt: n.createdAt,
            targetTab: n.targetTab,
          });
        }
      } catch (err) {
        // Ignore SSE parse heartbeat
      }
    };
  } catch (err) {
    console.warn("EventSource SSE setup failed, using fallback:", err);
  }

  return () => {
    if (channel) channel.close();
    if (eventSource) eventSource.close();
  };
}

/**
 * Web Audio API chime synthesizer for notification audio alerts.
 * Respects user's sound preference stored in localStorage.
 */
export function playNotificationSound(category?: string) {
  try {
    if (typeof window === "undefined") return;

    // Check if notification sound is enabled (defaults to true)
    const isSoundEnabled = localStorage.getItem("clickpoint_notification_sound_enabled") !== "false";
    if (!isSoundEnabled) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";

    const isReview = category === "REVIEW";
    const isJobApp = category === "JOB_APPLICATION";

    if (isReview) {
      // Orange/Yellow Testimonial: Warm double chime (E5 -> G5)
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    } else if (isJobApp) {
      // Green Job Application: Uplifting triple chime (G5 -> C6)
      osc.frequency.setValueAtTime(783.99, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    } else {
      // Blue Contact Inquiry: Crisp single chime (A5 -> D6)
      osc.frequency.setValueAtTime(880.00, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (err) {
    // Ignore audio policy restrictions
  }
}
