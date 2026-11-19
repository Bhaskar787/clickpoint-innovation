"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  BellRing,
  ConciergeBell,
  Music,
  Zap,
  Bot,
  Loader2,
  Trophy,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Shield,
  Lock,
  Globe,
  Database,
  Cloud,
  CheckCircle2,
  Save,
  Server,
  Play,
  Check,
  Mail,
  Briefcase,
  Star,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Copy,
  ExternalLink,
  HardDrive,
  Eye,
  Sparkles,
} from "lucide-react";
import {
  playNotificationSound,
  NOTIFICATION_SOUND_OPTIONS,
} from "@/lib/realtime-notifications";
import { optimizeImageBeforeUpload } from "@/lib/url";

export default function SettingsEditor() {
  // Notification Sound State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedSoundId, setSelectedSoundId] = useState<string>("crystal-bell");
  const [toastDuration, setToastDuration] = useState<number>(8000);
  const [desktopPushEnabled, setDesktopPushEnabled] = useState<boolean>(true);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState<boolean>(true);

  // Dynamic Branding & Logo Assets
  const [faviconUrl, setFaviconUrl] = useState<string>("/images/fav3.png");
  const [collapsedLogoUrl, setCollapsedLogoUrl] = useState<string>("/images/fav3.png");
  const [emailLogoUrl, setEmailLogoUrl] = useState<string>(
    "https://res.cloudinary.com/dapi1jlc/image/upload/v1785998195/clickpoint_innovation/c9olq47p41iy7wbkmgxf.png"
  );
  const [navbarLogoUrl, setNavbarLogoUrl] = useState<string>("");

  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingCollapsed, setUploadingCollapsed] = useState(false);
  const [uploadingEmailLogo, setUploadingEmailLogo] = useState(false);

  // Static Platform Settings State
  const [siteName, setSiteName] = useState("Clickpoint Innovation");
  const [supportEmail, setSupportEmail] = useState("info@clickpointinnovation.com");
  const [timezone, setTimezone] = useState("Asia/Kathmandu (UTC+5:45)");
  const [currency, setCurrency] = useState("USD ($)");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);

  const [activeSettingsTab, setActiveSettingsTab] = useState<
    "BRANDING" | "NOTIFICATIONS" | "GENERAL" | "SECURITY" | "INTEGRATIONS"
  >("BRANDING");
  const [isSaving, setIsSaving] = useState(false);

  // Load sound setting, selected ringtone, and cached system settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSound = localStorage.getItem("clickpoint_notification_sound_enabled");
      if (storedSound !== null) {
        setSoundEnabled(storedSound !== "false");
      }
      const storedSelectedSound = localStorage.getItem("clickpoint_selected_notification_sound");
      if (storedSelectedSound) {
        setSelectedSoundId(storedSelectedSound);
      }
      const storedDuration = localStorage.getItem("clickpoint_toast_duration");
      if (storedDuration) {
        setToastDuration(parseInt(storedDuration, 10));
      }

      // Load cached system settings for instant zero-FOUC display
      const cachedSettings = localStorage.getItem("clickpoint_system_settings_cache");
      if (cachedSettings) {
        try {
          const parsed = JSON.parse(cachedSettings);
          if (parsed.faviconUrl) setFaviconUrl(parsed.faviconUrl);
          if (parsed.collapsedLogoUrl) setCollapsedLogoUrl(parsed.collapsedLogoUrl);
          if (parsed.emailLogoUrl) setEmailLogoUrl(parsed.emailLogoUrl);
          if (parsed.siteName) setSiteName(parsed.siteName);
          if (parsed.supportEmail) setSupportEmail(parsed.supportEmail);
          if (parsed.timezone) setTimezone(parsed.timezone);
          if (parsed.currency) setCurrency(parsed.currency);
        } catch (e) {}
      }
    }

    // Fetch fresh system settings from database via /api/landing
    fetch("/api/landing")
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res?.data) {
          const sys = res.data.systemSettings || {};
          if (sys.faviconUrl) setFaviconUrl(sys.faviconUrl);
          if (sys.collapsedLogoUrl) setCollapsedLogoUrl(sys.collapsedLogoUrl);
          if (sys.emailLogoUrl) setEmailLogoUrl(sys.emailLogoUrl);
          if (sys.siteName) setSiteName(sys.siteName);
          if (sys.supportEmail) setSupportEmail(sys.supportEmail);
          if (sys.timezone) setTimezone(sys.timezone);
          if (sys.currency) setCurrency(sys.currency);
          if (sys.maintenanceMode !== undefined) setMaintenanceMode(sys.maintenanceMode);
          if (sys.enforce2FA !== undefined) setEnforce2FA(sys.enforce2FA);
          if (sys.sessionTimeoutMinutes) setSessionTimeoutMinutes(sys.sessionTimeoutMinutes);

          if (res.data.navbar?.logo?.logoUrl) {
            setNavbarLogoUrl(res.data.navbar.logo.logoUrl);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleSound = (val: boolean) => {
    setSoundEnabled(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("clickpoint_notification_sound_enabled", val ? "true" : "false");
    }
    if (val) {
      playNotificationSound(selectedSoundId);
      toast.success("Notification audio alerts enabled");
    } else {
      toast.info("Notification audio alerts muted");
    }
  };

  const handleSelectSound = (soundId: string, soundName: string) => {
    setSelectedSoundId(soundId);
    if (typeof window !== "undefined") {
      localStorage.setItem("clickpoint_selected_notification_sound", soundId);
    }
    playNotificationSound(soundId);
    toast.success(`Notification ringtone set to: ${soundName}`);
  };

  // Local Drive Image Upload Handler with Smart Canvas Compression
  const handleLocalImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "faviconUrl" | "collapsedLogoUrl" | "emailLogoUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === "faviconUrl") setUploadingFavicon(true);
    else if (field === "collapsedLogoUrl") setUploadingCollapsed(true);
    else setUploadingEmailLogo(true);

    const label =
      field === "faviconUrl"
        ? "browser favicon"
        : field === "collapsedLogoUrl"
        ? "collapsed sidebar mark"
        : "company email logo";

    const toastId = toast.loading(`Optimizing and uploading ${label} to local drive...`);

    try {
      // 1. Client-side canvas compression to reduce storage bloat
      const isSquare = field === "faviconUrl" || field === "collapsedLogoUrl";
      const optimizedFile = await optimizeImageBeforeUpload(file, {
        maxWidth: isSquare ? 256 : 800,
        maxHeight: isSquare ? 256 : 300,
        quality: 0.9,
        mimeType: file.type === "image/png" ? "image/png" : "image/webp",
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "branding");
      formData.append("storage", "local"); // Direct local drive storage

      const previousUrl =
        field === "faviconUrl"
          ? faviconUrl
          : field === "collapsedLogoUrl"
          ? collapsedLogoUrl
          : emailLogoUrl;

      if (previousUrl) {
        formData.append("previousUrl", previousUrl);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      }).then((r) => r.json());

      if (res.success && res.url) {
        if (field === "faviconUrl") setFaviconUrl(res.url);
        else if (field === "collapsedLogoUrl") setCollapsedLogoUrl(res.url);
        else setEmailLogoUrl(res.url);

        const sizeKb = res.sizeBytes ? ` (${Math.round(res.sizeBytes / 1024)} KB)` : "";
        toast.success(`Saved to local drive: ${res.url}${sizeKb}`, { id: toastId });
      } else {
        toast.error(res.error || "Upload failed", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file", { id: toastId });
    } finally {
      if (field === "faviconUrl") setUploadingFavicon(false);
      else if (field === "collapsedLogoUrl") setUploadingCollapsed(false);
      else setUploadingEmailLogo(false);
      e.target.value = "";
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving system settings to database...");

    const settingsPayload = {
      faviconUrl,
      collapsedLogoUrl,
      emailLogoUrl,
      siteName,
      supportEmail,
      timezone,
      currency,
      maintenanceMode,
      enforce2FA,
      sessionTimeoutMinutes,
    };

    try {
      const res = await fetch("/api/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemSettings: settingsPayload,
        }),
      }).then((r) => r.json());

      if (!res.success) {
        throw new Error(res.error || "Failed to save settings to database");
      }

      // Save local caches and sound preferences
      if (typeof window !== "undefined") {
        localStorage.setItem("clickpoint_system_settings_cache", JSON.stringify(settingsPayload));
        localStorage.setItem("clickpoint_notification_sound_enabled", soundEnabled ? "true" : "false");
        localStorage.setItem("clickpoint_selected_notification_sound", selectedSoundId);
        localStorage.setItem("clickpoint_toast_duration", toastDuration.toString());

        // Broadcast real-time update across all admin tabs
        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel("clickpoint-system-settings-sync");
          channel.postMessage(settingsPayload);
          channel.close();
        }
      }

      toast.success("System preferences and dynamic brand logos saved successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const activeSoundObj = NOTIFICATION_SOUND_OPTIONS.find((s) => s.id === selectedSoundId) || NOTIFICATION_SOUND_OPTIONS[0];

  const renderSoundIcon = (iconName: string) => {
    switch (iconName) {
      case "bell":
        return <BellRing className="h-4 w-4 text-blue-500" />;
      case "concierge":
        return <ConciergeBell className="h-4 w-4 text-amber-500" />;
      case "music":
        return <Music className="h-4 w-4 text-purple-500" />;
      case "zap":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "sparkles":
        return <Bot className="h-4 w-4 text-sky-500" />;
      case "trophy":
        return <Trophy className="h-4 w-4 text-emerald-500" />;
      case "volume":
        return <Volume2 className="h-4 w-4 text-indigo-500" />;
      case "radio":
        return <Radio className="h-4 w-4 text-rose-500" />;
      default:
        return <BellRing className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Settings Header Banner */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
              System Configuration
            </span>
            <span className="text-xs text-slate-400 font-semibold">Branding, Media & Audio Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Sliders className="h-6 w-6 text-blue-500" />
            <span>Admin System Settings</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Configure dynamic browser favicon, sidebar brand logos, email company logo, notification audio alerts, and platform security.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto [scrollbar-width:none]">
        <button
          onClick={() => setActiveSettingsTab("BRANDING")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSettingsTab === "BRANDING"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Brand Logos & Favicon</span>
        </button>
        <button
          onClick={() => setActiveSettingsTab("NOTIFICATIONS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSettingsTab === "NOTIFICATIONS"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <BellRing className="h-4 w-4" />
          <span>Notification Sounds</span>
        </button>
        <button
          onClick={() => setActiveSettingsTab("GENERAL")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSettingsTab === "GENERAL"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>General Platform</span>
        </button>
        <button
          onClick={() => setActiveSettingsTab("SECURITY")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSettingsTab === "SECURITY"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Security & Auth</span>
        </button>
        <button
          onClick={() => setActiveSettingsTab("INTEGRATIONS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSettingsTab === "INTEGRATIONS"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Server className="h-4 w-4" />
          <span>API & Services Status</span>
        </button>
      </div>

      {/* TAB: BRANDING & DYNAMIC LOGOS */}
      {activeSettingsTab === "BRANDING" && (
        <div className="space-y-6">
          {/* Storage & Dynamic Architecture Info Card */}
          <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <HardDrive className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Lean Local Drive Storage Architecture
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Auto-Optimized
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Uploaded branding media files are automatically resized, converted to lightweight WebP/PNG, and stored in <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">public/uploads/branding/</code>. When replacing an image, old assets are automatically deleted to consume minimal disk storage.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. BROWSER DYNAMIC FAVICON */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Browser Favicon
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Browser tab icon (&lt;link rel=&quot;icon&quot;&gt;)
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                  Global Head
                </span>
              </div>

              {/* Realistic Browser Tab Mockup */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0b0f19] p-3 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Live Browser Tab Preview
                </span>
                <div className="flex items-center gap-2 bg-white dark:bg-[#161d2d] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 max-w-xs shadow-xs">
                  <img
                    src={faviconUrl || "/images/fav3.png"}
                    alt="Favicon preview"
                    className="h-4 w-4 object-contain rounded-xs shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/fav3.png";
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">
                    {siteName} | AI-First Digital Partner
                  </span>
                  <span className="text-slate-400 text-xs hover:text-slate-600">✕</span>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Favicon Image URL
                  </label>
                  <input
                    type="text"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="/images/fav3.png or local upload URL"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all">
                    {uploadingFavicon ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>{uploadingFavicon ? "Optimizing..." : "Upload Local Favicon"}</span>
                    <input
                      type="file"
                      accept="image/png, image/x-icon, image/svg+xml, image/webp, image/jpeg"
                      onChange={(e) => handleLocalImageUpload(e, "faviconUrl")}
                      disabled={uploadingFavicon}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setFaviconUrl("/images/fav3.png")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Reset Default</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Recommended: 32x32px or 64x64px square PNG, ICO, or SVG. Automatically compressed.
                </p>
              </div>
            </div>

            {/* 2. ADMIN SIDEBAR COLLAPSED LOGO */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Admin Sidebar Collapsed Logo
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Compact square mark for collapsed 80px sidebar
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                  Sidebar Icon
                </span>
              </div>

              {/* Realistic Collapsed Sidebar Mockup */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0b0f19] p-3 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Live Collapsed Sidebar Mockup
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-24 bg-white dark:bg-[#131927] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between py-2.5 shadow-xs">
                    <img
                      src={collapsedLogoUrl || "/images/fav3.png"}
                      alt="Collapsed logo preview"
                      className="h-8 w-8 object-contain rounded-md transition-transform hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/fav3.png";
                      }}
                    />
                    <div className="space-y-1 w-full px-2.5 flex flex-col items-center">
                      <div className="h-1.5 w-5 bg-blue-500 rounded-full" />
                      <div className="h-1.5 w-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      <div className="h-1.5 w-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Dynamic Collapsed View
                    </p>
                    <p className="text-[11px]">
                      Displays in the admin sidebar when collapsed or toggle button is clicked.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Collapsed Logo URL
                  </label>
                  <input
                    type="text"
                    value={collapsedLogoUrl}
                    onChange={(e) => setCollapsedLogoUrl(e.target.value)}
                    placeholder="/images/fav3.png or local upload URL"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all">
                    {uploadingCollapsed ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>{uploadingCollapsed ? "Optimizing..." : "Upload Collapsed Icon"}</span>
                    <input
                      type="file"
                      accept="image/png, image/webp, image/svg+xml, image/jpeg"
                      onChange={(e) => handleLocalImageUpload(e, "collapsedLogoUrl")}
                      disabled={uploadingCollapsed}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setCollapsedLogoUrl("/images/fav3.png")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Reset Default</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Recommended: 1:1 square icon PNG/SVG with transparent background.
                </p>
              </div>
            </div>

            {/* 3. COMPANY EMAIL HEADER LOGO */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Company Email Brand Logo
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Header logo for candidate status & HR notification emails
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                  Email Dispatch
                </span>
              </div>

              {/* Realistic Email Header Mockup */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0b0f19] p-3 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Live Outbound Email Header Preview
                </span>
                <div className="bg-white dark:bg-[#131c31] rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <img
                      src={emailLogoUrl || "/images/clickpointfinal.png"}
                      alt="Email logo preview"
                      className="h-7 w-auto max-w-[160px] object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/clickpointfinal.png";
                      }}
                    />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Official Notification
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Subject: <span className="font-bold text-slate-800 dark:text-slate-200">Application Update: Frontend Engineer</span>
                  </p>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Logo URL
                  </label>
                  <input
                    type="text"
                    value={emailLogoUrl}
                    onChange={(e) => setEmailLogoUrl(e.target.value)}
                    placeholder="https://... or /uploads/branding/..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all">
                    {uploadingEmailLogo ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>{uploadingEmailLogo ? "Optimizing..." : "Upload Email Logo"}</span>
                    <input
                      type="file"
                      accept="image/png, image/webp, image/svg+xml, image/jpeg"
                      onChange={(e) => handleLocalImageUpload(e, "emailLogoUrl")}
                      disabled={uploadingEmailLogo}
                      className="hidden"
                    />
                  </label>

                  {navbarLogoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmailLogoUrl(navbarLogoUrl);
                        toast.success("Copied active Navbar logo to Email Logo");
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                    >
                      <Copy className="h-3 w-3 text-emerald-500" />
                      <span>Use Navbar Logo</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setEmailLogoUrl("/images/clickpointfinal.png")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Reset Default</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Recommended: 240x60px transparent PNG or WebP for optimal email client rendering.
                </p>
              </div>
            </div>

            {/* 4. EXPANDED BRAND LOGO OVERVIEW */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Expanded Admin Sidebar & Navbar Brand Logo
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Dynamic logo synced from Live Section Editor &gt; Navbar
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40">
                  Active Navbar Sync
                </span>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0b0f19] p-4 flex items-center justify-center min-h-[100px]">
                {navbarLogoUrl ? (
                  <img
                    src={navbarLogoUrl}
                    alt="Active Navbar logo"
                    className="h-10 w-auto max-w-[220px] object-contain"
                  />
                ) : (
                  <p className="text-xs text-slate-400 italic">No navbar logo loaded yet</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The admin sidebar expanded view automatically renders this company logo in real-time. If you wish to update the brand logo, edit it under the <strong>Navbar</strong> section of the Live Section Editor.
                </p>
                <div className="pt-2">
                  <a
                    href="/admin/dashboard?tab=landing-management"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Go to Navbar Section Editor</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: NOTIFICATION & SOUND ENGINE */}
      {activeSettingsTab === "NOTIFICATIONS" && (
        <div className="space-y-6">
          {/* Master Sound Alert Switch Card */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  soundEnabled ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}>
                  {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Master Real-time Audio Alerts
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    Enable or disable audio sound alerts across all admin dashboards when new client inquiries, reviews, or job applications arrive.
                  </p>
                </div>
              </div>

              {/* Master Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {soundEnabled ? "Audio Enabled (ON)" : "Audio Muted (OFF)"}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleSound(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    soundEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      soundEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE PHONE STYLE TABULAR RINGTONE SELECTION LIST */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BellRing className="h-4 w-4 text-blue-500" />
                  <span>Notification Sound Ringtone List</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your preferred ringtone tone to play for all incoming submissions (Testimonials, Inquiries & Job Apps)
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold shrink-0 self-start sm:self-auto">
                {renderSoundIcon(activeSoundObj.iconName)}
                <span>Selected: {activeSoundObj.name}</span>
              </div>
            </div>

            {/* Tabular Ringtone List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {NOTIFICATION_SOUND_OPTIONS.map((sound, index) => {
                const isSelected = selectedSoundId === sound.id;
                return (
                  <div
                    key={sound.id}
                    onClick={() => handleSelectSound(sound.id, sound.name)}
                    className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/40 dark:bg-blue-950/20"
                        : "hover:bg-slate-50/60 dark:hover:bg-slate-900/40"
                    }`}
                  >
                    {/* Left Details */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Radio Circle */}
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 dark:border-slate-700 bg-transparent"
                      }`}>
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      {/* Icon Box */}
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-blue-500/15 dark:bg-blue-500/20 border border-blue-500/30"
                          : "bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60"
                      }`}>
                        {renderSoundIcon(sound.iconName)}
                      </div>

                      {/* Title & Description */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className={`text-xs font-black truncate ${
                            isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"
                          }`}>
                            {sound.name}
                          </h5>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                            {sound.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {sound.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playNotificationSound(sound.id);
                        }}
                        disabled={!soundEnabled}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <Play className="h-3 w-3 fill-current text-blue-500" />
                        <span>Play Sample</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSound(sound.id, sound.name);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {isSelected ? "Active Sound" : "Select"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toast Behavior & Email Alert Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toast Display Settings */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-500" />
                <span>Toast Display Behavior</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Auto-Dismiss Toast Duration
                  </label>
                  <select
                    value={toastDuration}
                    onChange={(e) => setToastDuration(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value={5000}>5 Seconds (Fast)</option>
                    <option value={8000}>8 Seconds (Recommended)</option>
                    <option value={12000}>12 Seconds (Extended)</option>
                    <option value={0}>Persistent (Manual Dismiss Only)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Browser Desktop Notifications
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Show OS desktop popups when tab is backgrounded
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={desktopPushEnabled}
                    onChange={(e) => setDesktopPushEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Email Alerts Settings */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>Instant Email Alerts</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      HR & Sales Email Dispatch
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Send instant email copy to budhabhaskar2@gmail.com
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigestEnabled}
                    onChange={(e) => setEmailDigestEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400">
                    Dispatch Email Recipients: <span className="font-bold text-slate-700 dark:text-slate-300">budhabhaskar2@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL PLATFORM */}
      {activeSettingsTab === "GENERAL" && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <span>Platform General Properties</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Platform Brand Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Support Email Address
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Operating Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Default Currency
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Maintenance Mode
              </h4>
              <p className="text-[11px] text-slate-400">
                Display maintenance banner on public website pages
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                maintenanceMode ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  maintenanceMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY */}
      {activeSettingsTab === "SECURITY" && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span>Security Policies & Access Controls</span>
          </h3>

          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Enforce Two-Factor Authentication (2FA)
                </p>
                <p className="text-[11px] text-slate-400">
                  Require 2FA authenticator for all admin sign-ins
                </p>
              </div>
              <input
                type="checkbox"
                checked={enforce2FA}
                onChange={(e) => setEnforce2FA(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Admin Inactivity Session Timeout
                </p>
                <p className="text-[11px] text-slate-400">
                  Automatically lock dashboard after period of inactivity
                </p>
              </div>
              <select
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value, 10))}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={120}>2 Hours</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: API & INTEGRATIONS */}
      {activeSettingsTab === "INTEGRATIONS" && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-500" />
            <span>Connected Services & Microservices Status</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    PostgreSQL Database (Prisma ORM)
                  </h4>
                  <p className="text-[10px] text-slate-400">Supabase Connected</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Real-time SSE & Broadcast Bus
                  </h4>
                  <p className="text-[10px] text-slate-400">Event Engine Active</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Active
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 text-sky-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Cloudinary Media Storage
                  </h4>
                  <p className="text-[10px] text-slate-400">Avatar & Image CDN</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    SMTP Email Gateway
                  </h4>
                  <p className="text-[10px] text-slate-400">Resend / Nodemailer</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Configured
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
