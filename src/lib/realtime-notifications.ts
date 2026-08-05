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

export interface NotificationSoundOption {
  id: string;
  name: string;
  description: string;
  iconName: "bell" | "concierge" | "music" | "zap" | "sparkles" | "trophy" | "volume" | "radio";
  badge: string;
}

export const NOTIFICATION_SOUND_OPTIONS: NotificationSoundOption[] = [
  {
    id: "crystal-bell",
    name: "Modern Crystal Bell",
    description: "Crisp, elegant crystal bell chime with smooth harmonic resonance",
    iconName: "bell",
    badge: "Recommended",
  },
  {
    id: "executive-bell",
    name: "Executive Desk Bell",
    description: "Classic brass front-desk bell ring with warm metallic decay",
    iconName: "concierge",
    badge: "Popular",
  },
  {
    id: "digital-chime",
    name: "Digital Soft Chime",
    description: "Gentle dual-tone melody designed for modern dashboard alerts",
    iconName: "music",
    badge: "Soft & Subtle",
  },
  {
    id: "tech-ping",
    name: "Tech Pulse Ping",
    description: "Short futuristic high-tech sweep ping note",
    iconName: "zap",
    badge: "High Tech",
  },
  {
    id: "glass-chime",
    name: "Ambient Glass Bowl",
    description: "Deep soothing glass bowl chime with rich warm overtones",
    iconName: "sparkles",
    badge: "Calming",
  },
  {
    id: "victory-ring",
    name: "Success Victory Ring",
    description: "Uplifting 3-note ascending arpeggio chime",
    iconName: "trophy",
    badge: "Upbeat",
  },
  {
    id: "subtle-pop",
    name: "Smooth Subtle Pop",
    description: "Minimalist soft bubble pop sound for quiet environments",
    iconName: "volume",
    badge: "Quiet",
  },
  {
    id: "retro-synth",
    name: "Retro Synth Beep",
    description: "Classic clean 8-bit synth chime note",
    iconName: "radio",
    badge: "Retro",
  },
];

/**
 * Web Audio API chime synthesizer for notification audio alerts.
 * Plays the user's selected notification ringtone stored in localStorage.
 */
export function playNotificationSound(soundKeyOverride?: string) {
  try {
    if (typeof window === "undefined") return;

    // Check if notification sound is enabled (defaults to true)
    const isSoundEnabled = localStorage.getItem("clickpoint_notification_sound_enabled") !== "false";
    if (!isSoundEnabled) return;

    const soundId = soundKeyOverride || localStorage.getItem("clickpoint_selected_notification_sound") || "crystal-bell";

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    switch (soundId) {
      case "executive-bell": {
        // Brass Front Desk Bell: E5 note (659Hz) with brass overtone
        const osc2 = ctx.createOscillator();
        osc.type = "sine";
        osc2.type = "triangle";
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc2.frequency.setValueAtTime(1318.5, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc2.connect(gain);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
        break;
      }
      case "digital-chime": {
        // Soft Dual-tone Melody: A5 (880Hz) to C6 (1046Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        break;
      }
      case "tech-ping": {
        // High-Tech Sweep Ping: F6 (1396Hz) quick frequency slide
        osc.type = "sine";
        osc.frequency.setValueAtTime(1396.91, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760.0, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        break;
      }
      case "glass-chime": {
        // Glass Bowl Chime: D5 (587Hz) with slow harmonic decay
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        break;
      }
      case "victory-ring": {
        // 3-Note Arpeggio: C5 (523Hz) -> E5 (659Hz) -> G5 (783Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        break;
      }
      case "subtle-pop": {
        // Soft Bubble Pop: G4 (392Hz) quick pitch drop
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        break;
      }
      case "retro-synth": {
        // 8-Bit Synth Beep: Square wave C6 (1046Hz) note
        osc.type = "square";
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.5, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        break;
      }
      case "crystal-bell":
      default: {
        // Modern Crystal Bell (Default): High frequency C6 -> G6 harmonic
        osc.type = "sine";
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1567.98, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        break;
      }
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) {
    // Ignore audio policy restrictions
  }
}
