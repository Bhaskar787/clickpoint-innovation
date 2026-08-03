"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Tag,
  Type,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { DEFAULT_CONTACT_PAGE_DATA } from "@/data/default-contact-data";
import { ContactInquiryItem, ContactPageContent } from "@/types";

interface ContactEditorProps {
  sectionId: string | null;
  onCloseSection?: () => void;
}

export default function ContactEditor({ sectionId, onCloseSection }: ContactEditorProps) {
  const [formData, setFormData] = useState<ContactPageContent>(DEFAULT_CONTACT_PAGE_DATA);
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([]);
  const [filterTab, setFilterTab] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadContactData() {
    try {
      const res = await fetch("/api/contact?includeAll=true");
      const json = await res.json();
      if (json.success && json.data) {
        setFormData({
          hero: json.data.hero || DEFAULT_CONTACT_PAGE_DATA.hero,
          contactInfo: json.data.contactInfo || DEFAULT_CONTACT_PAGE_DATA.contactInfo,
          formFields: json.data.formFields || DEFAULT_CONTACT_PAGE_DATA.formFields,
        });

        const list = json.data.inquiries || [];
        setInquiries(list);
        setUnreadCount(json.data.unreadCount || 0);
      }
    } catch (err: any) {
      toast.error("Failed to load contact page content.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadContactData();

    const interval = setInterval(() => {
      loadContactData();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  async function handleSaveHeader() {
    setIsSaving(true);
    const toastId = toast.loading("Saving Contact Page content to database...");

    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Contact Page content & office details updated successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Failed to save content.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMarkRead(id: string) {
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-inquiry", id, isRead: true }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Inquiry marked as read.");
        loadContactData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteInquiry(item: ContactInquiryItem) {
    if (!confirm(`Are you sure you want to delete inquiry from "${item.name}"?`)) return;

    const toastId = toast.loading("Deleting inquiry...");
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-inquiry", id: item.id }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Deleted inquiry from ${item.name}`, { id: toastId });
        loadContactData();
      } else {
        toast.error(json.error || "Failed to delete inquiry", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting inquiry", { id: toastId });
    }
  }

  const filteredInquiries = inquiries.filter((item) => {
    if (filterTab === "UNREAD") return !item.isRead;
    if (filterTab === "READ") return item.isRead;
    return true;
  });

  const showHeroSection =
    !sectionId ||
    sectionId === "contact-hero" ||
    sectionId === "01" ||
    sectionId === "contact-page";

  const showInquiriesSection =
    !sectionId ||
    sectionId === "contact-form" ||
    sectionId === "inquiries" ||
    sectionId === "02" ||
    sectionId === "contact-page";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-3">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Contact Us database records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Contact Us Page & Inquiries Configurator (/contact)
            </h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <Send className="h-3 w-3" />
                {unreadCount} Unread Inquiry Lead(s)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure dynamic contact page headlines, office address, phone, email, and moderate client lead inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_CONTACT_PAGE_DATA)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveHeader}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Content"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 100% DYNAMIC HERO & OFFICE DETAILS CONFIGURATOR */}
      {showHeroSection && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #01
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Contact Hero Banner & Office Communication Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500" />
                Hero Badge Tag
              </label>
              <input
                type="text"
                value={formData.hero?.badge || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, badge: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Type className="h-3.5 w-3.5 text-blue-500" />
                Main Title
              </label>
              <input
                type="text"
                value={formData.hero?.title || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={formData.hero?.subtitle || ""}
                onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Physical Address
              </label>
              <input
                type="text"
                value={formData.contactInfo?.address || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, address: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Mail className="h-3.5 w-3.5 text-blue-500" />
                Contact Email Address
              </label>
              <input
                type="text"
                value={formData.contactInfo?.email || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, email: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Phone className="h-3.5 w-3.5 text-blue-500" />
                Phone Numbers
              </label>
              <input
                type="text"
                value={formData.contactInfo?.phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, phone: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                Working Hours
              </label>
              <input
                type="text"
                value={formData.contactInfo?.hours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, hours: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Google Maps Embed HTML / iframe URL (Interactive Map URL)
              </label>
              <input
                type="text"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={formData.contactInfo?.mapUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, mapUrl: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CLIENT INQUIRIES MODERATION LIST */}
      {showInquiriesSection && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Client Lead Inquiries Moderation ({inquiries.length} Total Submissions)
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterTab("ALL")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterTab === "ALL"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                All ({inquiries.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("UNREAD")}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterTab === "UNREAD"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                }`}
              >
                <span>Unread Leads</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-700 text-white text-[10px]">{unreadCount}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("READ")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterTab === "READ"
                    ? "bg-slate-700 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                Read ({inquiries.filter((i) => i.isRead).length})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                <Mail className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No contact inquiries in this view.</p>
              </div>
            ) : (
              filteredInquiries.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.isRead) handleMarkRead(item.id);
                  }}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    !item.isRead
                      ? "border-blue-400 bg-blue-50/30 dark:bg-blue-950/30 ring-1 ring-blue-400/40"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {item.name}
                        </h4>
                        {!item.isRead && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-blue-600 text-white animate-pulse">
                            New Lead
                          </span>
                        )}
                        {item.company && (
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            • {item.company}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                        {item.email} {item.phone ? `| ${item.phone}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.service && (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {item.service}
                        </span>
                      )}
                      {item.budget && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                          {item.budget}
                        </span>
                      )}

                      {!item.isRead && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkRead(item.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Mark Read</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInquiry(item);
                        }}
                        className="p-1.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "{item.message}"
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Received: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recently"}</span>
                    <span>IP: {item.ipAddress || "127.0.0.1"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
