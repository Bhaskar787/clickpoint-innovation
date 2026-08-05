"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import {
  Save,
  RotateCcw,
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
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  User,
  Building2,
  DollarSign,
  Briefcase,
  Calendar,
  Plus,
  ArrowUp,
  ArrowDown,
  ListOrdered,
} from "lucide-react";
import { DEFAULT_CONTACT_PAGE_DATA } from "@/data/default-contact-data";
import { ContactInquiryItem, ContactPageContent } from "@/types";

interface ContactEditorProps {
  sectionId: string | null;
  onCloseSection?: () => void;
  selectedItemId?: string | null;
  onClearSelectedItem?: () => void;
}

export default function ContactEditor({ sectionId, onCloseSection, selectedItemId, onClearSelectedItem }: ContactEditorProps) {
  const [formData, setFormData] = useState<ContactPageContent>(DEFAULT_CONTACT_PAGE_DATA);
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([]);
  const [filterTab, setFilterTab] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryItem | null>(null);

  async function loadContactData(isInitial = false) {
    try {
      const res = await fetch("/api/contact?includeAll=true");
      const json = await res.json();
      if (json.success && json.data) {
        if (isInitial) {
          const loadedHero = json.data.hero || {};
          const loadedInfo = json.data.contactInfo || {};
          const loadedFields = json.data.formFields || {};

          setFormData({
            hero: {
              badge: loadedHero.badge || DEFAULT_CONTACT_PAGE_DATA.hero.badge,
              title: loadedHero.title || DEFAULT_CONTACT_PAGE_DATA.hero.title,
              subtitle: loadedHero.subtitle || DEFAULT_CONTACT_PAGE_DATA.hero.subtitle,
              formTitle: loadedHero.formTitle || DEFAULT_CONTACT_PAGE_DATA.hero.formTitle,
              formSubtitle: loadedHero.formSubtitle || DEFAULT_CONTACT_PAGE_DATA.hero.formSubtitle,
              submitButtonText: loadedHero.submitButtonText || DEFAULT_CONTACT_PAGE_DATA.hero.submitButtonText,
            },
            contactInfo: {
              address: loadedInfo.address || DEFAULT_CONTACT_PAGE_DATA.contactInfo.address,
              addressSubtext: loadedInfo.addressSubtext || DEFAULT_CONTACT_PAGE_DATA.contactInfo.addressSubtext,
              email: loadedInfo.email || DEFAULT_CONTACT_PAGE_DATA.contactInfo.email,
              emailSubtext: loadedInfo.emailSubtext || DEFAULT_CONTACT_PAGE_DATA.contactInfo.emailSubtext,
              phone: loadedInfo.phone || DEFAULT_CONTACT_PAGE_DATA.contactInfo.phone,
              phoneSubtext: loadedInfo.phoneSubtext || DEFAULT_CONTACT_PAGE_DATA.contactInfo.phoneSubtext,
              hours: loadedInfo.hours || DEFAULT_CONTACT_PAGE_DATA.contactInfo.hours,
              hoursSubtext: loadedInfo.hoursSubtext || DEFAULT_CONTACT_PAGE_DATA.contactInfo.hoursSubtext,
              mapBadge: loadedInfo.mapBadge || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapBadge,
              mapTitle: loadedInfo.mapTitle || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapTitle,
              mapSubtitle: loadedInfo.mapSubtitle || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapSubtitle,
              mapUrl: loadedInfo.mapUrl || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapUrl,
              directChannelsTitle: loadedInfo.directChannelsTitle || DEFAULT_CONTACT_PAGE_DATA.contactInfo.directChannelsTitle,
              directChannelsSubtitle: loadedInfo.directChannelsSubtitle || DEFAULT_CONTACT_PAGE_DATA.contactInfo.directChannelsSubtitle,
            },
            quickEnquiryModal: {
              badge: json.data.quickEnquiryModal?.badge || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.badge,
              title: json.data.quickEnquiryModal?.title || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.title,
              countryCode: json.data.quickEnquiryModal?.countryCode || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.countryCode,
              selectServicePlaceholder: json.data.quickEnquiryModal?.selectServicePlaceholder || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.selectServicePlaceholder,
              submitButtonText: json.data.quickEnquiryModal?.submitButtonText || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.submitButtonText,
              rightBadge: json.data.quickEnquiryModal?.rightBadge || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.rightBadge,
              rightTitle: json.data.quickEnquiryModal?.rightTitle || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.rightTitle,
              phoneLabel: json.data.quickEnquiryModal?.phoneLabel || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.phoneLabel,
              emailLabel: json.data.quickEnquiryModal?.emailLabel || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.emailLabel,
              locationLabel: json.data.quickEnquiryModal?.locationLabel || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.locationLabel,
              footerSlaText: json.data.quickEnquiryModal?.footerSlaText || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.footerSlaText,
            },
            formFields: {
              serviceOptions: loadedFields.serviceOptions?.length ? loadedFields.serviceOptions : DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions,
              budgetOptions: loadedFields.budgetOptions?.length ? loadedFields.budgetOptions : DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions,
            },
          });
        }

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
    loadContactData(true);

    const interval = setInterval(() => {
      loadContactData(false);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedItemId) return;
    const found = inquiries.find((q) => q.id === selectedItemId);
    if (found) setSelectedInquiry(found);
    if (found && !found.isRead) {
      handleMarkRead(found.id);
    }
    onClearSelectedItem?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId, inquiries]);

  async function handleSaveHeader() {
    setIsSaving(true);
    const toastId = toast.loading("Saving Contact Page content to database...");

    const payloadToSave: ContactPageContent = {
      hero: {
        badge: formData.hero?.badge || DEFAULT_CONTACT_PAGE_DATA.hero.badge,
        title: formData.hero?.title || DEFAULT_CONTACT_PAGE_DATA.hero.title,
        subtitle: formData.hero?.subtitle || DEFAULT_CONTACT_PAGE_DATA.hero.subtitle,
        formTitle: formData.hero?.formTitle || DEFAULT_CONTACT_PAGE_DATA.hero.formTitle,
        formSubtitle: formData.hero?.formSubtitle || DEFAULT_CONTACT_PAGE_DATA.hero.formSubtitle,
        submitButtonText: formData.hero?.submitButtonText || DEFAULT_CONTACT_PAGE_DATA.hero.submitButtonText,
      },
      contactInfo: {
        address: formData.contactInfo?.address || DEFAULT_CONTACT_PAGE_DATA.contactInfo.address,
        addressSubtext: formData.contactInfo?.addressSubtext || DEFAULT_CONTACT_PAGE_DATA.contactInfo.addressSubtext,
        email: formData.contactInfo?.email || DEFAULT_CONTACT_PAGE_DATA.contactInfo.email,
        emailSubtext: formData.contactInfo?.emailSubtext || DEFAULT_CONTACT_PAGE_DATA.contactInfo.emailSubtext,
        phone: formData.contactInfo?.phone || DEFAULT_CONTACT_PAGE_DATA.contactInfo.phone,
        phoneSubtext: formData.contactInfo?.phoneSubtext || DEFAULT_CONTACT_PAGE_DATA.contactInfo.phoneSubtext,
        hours: formData.contactInfo?.hours || DEFAULT_CONTACT_PAGE_DATA.contactInfo.hours,
        hoursSubtext: formData.contactInfo?.hoursSubtext || DEFAULT_CONTACT_PAGE_DATA.contactInfo.hoursSubtext,
        mapBadge: formData.contactInfo?.mapBadge || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapBadge,
        mapTitle: formData.contactInfo?.mapTitle || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapTitle,
        mapSubtitle: formData.contactInfo?.mapSubtitle || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapSubtitle,
        mapUrl: formData.contactInfo?.mapUrl || DEFAULT_CONTACT_PAGE_DATA.contactInfo.mapUrl,
        directChannelsTitle: formData.contactInfo?.directChannelsTitle || DEFAULT_CONTACT_PAGE_DATA.contactInfo.directChannelsTitle,
        directChannelsSubtitle: formData.contactInfo?.directChannelsSubtitle || DEFAULT_CONTACT_PAGE_DATA.contactInfo.directChannelsSubtitle,
      },
      quickEnquiryModal: {
        badge: formData.quickEnquiryModal?.badge || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.badge,
        title: formData.quickEnquiryModal?.title || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.title,
        countryCode: formData.quickEnquiryModal?.countryCode || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.countryCode,
        selectServicePlaceholder: formData.quickEnquiryModal?.selectServicePlaceholder || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.selectServicePlaceholder,
        submitButtonText: formData.quickEnquiryModal?.submitButtonText || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.submitButtonText,
        rightBadge: formData.quickEnquiryModal?.rightBadge || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.rightBadge,
        rightTitle: formData.quickEnquiryModal?.rightTitle || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.rightTitle,
        phoneLabel: formData.quickEnquiryModal?.phoneLabel || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.phoneLabel,
        emailLabel: formData.quickEnquiryModal?.emailLabel || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.emailLabel,
        locationLabel: formData.quickEnquiryModal?.locationLabel || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.locationLabel,
        footerSlaText: formData.quickEnquiryModal?.footerSlaText || DEFAULT_CONTACT_PAGE_DATA.quickEnquiryModal?.footerSlaText,
      },
      formFields: formData.formFields || DEFAULT_CONTACT_PAGE_DATA.formFields,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSave),
      });

      const json = await res.json();
      if (json.success) {
        setFormData(payloadToSave);
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
        if (selectedInquiry?.id === item.id) setSelectedInquiry(null);
        loadContactData();
      } else {
        toast.error(json.error || "Failed to delete inquiry", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting inquiry", { id: toastId });
    }
  }

  // Helper handlers for Primary Objectives (serviceOptions)
  function handleUpdateServiceOption(index: number, value: string) {
    const list = [...(formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions)];
    list[index] = value;
    setFormData({
      ...formData,
      formFields: {
        serviceOptions: list,
        budgetOptions: formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions,
      },
    });
  }

  function handleAddServiceOption() {
    const list = [...(formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions), "New Primary Objective"];
    setFormData({
      ...formData,
      formFields: {
        serviceOptions: list,
        budgetOptions: formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions,
      },
    });
  }

  function handleRemoveServiceOption(index: number) {
    const list = (formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      formFields: {
        serviceOptions: list,
        budgetOptions: formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions,
      },
    });
  }

  function handleMoveServiceOption(index: number, direction: "UP" | "DOWN") {
    const list = [...(formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions)];
    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({
      ...formData,
      formFields: {
        serviceOptions: list,
        budgetOptions: formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions,
      },
    });
  }

  // Helper handlers for Target Investment / Budget Range (budgetOptions)
  function handleUpdateBudgetOption(index: number, value: string) {
    const list = [...(formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions)];
    list[index] = value;
    setFormData({
      ...formData,
      formFields: {
        serviceOptions: formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions,
        budgetOptions: list,
      },
    });
  }

  function handleAddBudgetOption() {
    const list = [...(formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions), "$150,000+"];
    setFormData({
      ...formData,
      formFields: {
        serviceOptions: formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions,
        budgetOptions: list,
      },
    });
  }

  function handleRemoveBudgetOption(index: number) {
    const list = (formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      formFields: {
        serviceOptions: formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions,
        budgetOptions: list,
      },
    });
  }

  function handleMoveBudgetOption(index: number, direction: "UP" | "DOWN") {
    const list = [...(formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions)];
    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({
      ...formData,
      formFields: {
        serviceOptions: formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions,
        budgetOptions: list,
      },
    });
  }

  // Filtered dataset
  const filteredInquiries = inquiries.filter((item) => {
    if (filterTab === "UNREAD") return !item.isRead;
    if (filterTab === "READ") return item.isRead;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInquiries.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pageInquiries = filteredInquiries.slice(startIndex, startIndex + pageSize);

  const showHeroSection =
    !sectionId ||
    sectionId === "contact-hero" ||
    sectionId === "01" ||
    sectionId === "contact-page";

  const showQuickEnquirySection =
    !sectionId ||
    sectionId === "quick-enquiry" ||
    sectionId === "02" ||
    sectionId === "contact-page";

  const showInquiriesSection =
    !sectionId ||
    sectionId === "contact-form" ||
    sectionId === "inquiries" ||
    sectionId === "03" ||
    sectionId === "contact-page";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-4 sm:p-8 space-y-3">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 animate-spin" />
        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center">Loading Contact Us database records...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-4 sm:space-y-6 text-slate-900 dark:text-white">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 overflow-hidden p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
              Contact Us Page & Inquiries Configurator (/contact)
            </h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <Send className="h-3 w-3" />
                {unreadCount} Unread Inquiry Lead(s)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure dynamic contact page headlines, office address, phone, email, and moderate client lead inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_CONTACT_PAGE_DATA)}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveHeader}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Content"}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO & OFFICE DETAILS CONFIGURATOR */}
      {showHeroSection && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #01
              </span>
              <h3 className="text-xs sm:text-sm font-bold">
                Contact Hero Banner & Office Communication Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Tag className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
                <Type className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
                <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
                <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
                <Phone className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
                <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Headquarters Map Section Badge
              </label>
              <input
                type="text"
                value={formData.contactInfo?.mapBadge || ""}
                placeholder="Visit Our Headquarters"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, mapBadge: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Headquarters Map Section Headline
              </label>
              <input
                type="text"
                value={formData.contactInfo?.mapTitle || ""}
                placeholder="Locate Click Point Innovations"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, mapTitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Headquarters Address & Schedule Subtitle / Text
              </label>
              <textarea
                rows={2}
                value={formData.contactInfo?.mapSubtitle || ""}
                placeholder="790 Cybernetic Way, Tech District, Suite 400, San Francisco, CA 94107 — Monday – Friday: 8am – 7pm PST | Weekend Support Available."
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, mapSubtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Direct Executive Channels Card Header Title
              </label>
              <input
                type="text"
                value={formData.contactInfo?.directChannelsTitle || ""}
                placeholder="Direct Executive Email Channels"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, directChannelsTitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                Direct Executive Channels Card Subtitle / Note
              </label>
              <input
                type="text"
                value={formData.contactInfo?.directChannelsSubtitle || ""}
                placeholder="For urgent technical RFPs or enterprise partnership inquiries:"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, directChannelsSubtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            {/* Quick Enquiry Modal Customization Fields */}
            <div className="md:col-span-2 pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] sm:text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
                Quick Enquiry Modal Customization (Header, Labels & Right Panel)
              </h4>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Modal Top Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.badge || ""}
                    placeholder="Have a Project in Mind?"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, badge: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Modal Main Title
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.title || ""}
                    placeholder="Tell Us A Bit More"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, title: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Phone Country Code Badge
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.countryCode || ""}
                    placeholder="+977"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, countryCode: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Select Service Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.selectServicePlaceholder || ""}
                    placeholder="--- Select Service ---"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, selectServicePlaceholder: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.submitButtonText || ""}
                    placeholder="Submit Inquiry"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, submitButtonText: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Right Panel Top Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.rightBadge || ""}
                    placeholder="We would love to hear from you"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, rightBadge: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Right Panel Header Title
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.rightTitle || ""}
                    placeholder="Get In Touch"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, rightTitle: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Phone Label
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.phoneLabel || ""}
                    placeholder="Our Phone Number"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, phoneLabel: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Email Label
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.emailLabel || ""}
                    placeholder="Email Address"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, emailLabel: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Location Label
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.locationLabel || ""}
                    placeholder="Our Location"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, locationLabel: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Footer Working Hours & SLA Note Text
                  </label>
                  <input
                    type="text"
                    value={formData.quickEnquiryModal?.footerSlaText || ""}
                    placeholder="Hours: Sun - Fri: 9:00 AM - 6:00 PM • Executive SLA: 2 Hours"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quickEnquiryModal: { ...formData.quickEnquiryModal, footerSlaText: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Form Choice Options & Sequence Manager (Primary Objectives & Target Investment Ranges) */}
            <div className="md:col-span-2 pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-6">
              {/* 1. Primary Objectives */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="text-[10px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ListOrdered className="h-4 w-4 text-blue-500 shrink-0" />
                    1. Select Primary Objective Choices (Sequence & Options)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddServiceOption}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Objective Choice</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions).map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800"
                    >
                      <span className="font-mono text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateServiceOption(idx, e.target.value)}
                        placeholder="Option placeholder text..."
                        className="flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold focus:border-blue-600 focus:outline-none"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveServiceOption(idx, "UP")}
                          title="Move Up in Sequence"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (formData.formFields?.serviceOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.serviceOptions).length - 1}
                          onClick={() => handleMoveServiceOption(idx, "DOWN")}
                          title="Move Down in Sequence"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceOption(idx)}
                          title="Delete Option"
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors ml-0.5 sm:ml-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Target Investment / Budget Ranges */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="text-[10px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-blue-500 shrink-0" />
                    2. Target Investment / Budget Range Choices (Sequence & Options)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddBudgetOption}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Budget Choice</span>
                  </button>
                </div>

                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                  {(formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions).map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800"
                    >
                      <span className="font-mono text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateBudgetOption(idx, e.target.value)}
                        placeholder="Budget range placeholder..."
                        className="flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold focus:border-blue-600 focus:outline-none"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveBudgetOption(idx, "UP")}
                          title="Move Up in Sequence"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (formData.formFields?.budgetOptions || DEFAULT_CONTACT_PAGE_DATA.formFields.budgetOptions).length - 1}
                          onClick={() => handleMoveBudgetOption(idx, "DOWN")}
                          title="Move Down in Sequence"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveBudgetOption(idx)}
                          title="Delete Option"
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors ml-0.5 sm:ml-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: QUICK ENQUIRY MODAL CUSTOMIZATION (SEPARATE DEDICATED BOX CARD) */}
      {showQuickEnquirySection && (
        <div className="rounded-xl sm:rounded-2xl border border-violet-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-violet-50/20 to-white dark:from-[#131927] dark:to-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-xs">
          {/* Section Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-violet-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded">
                #02
              </span>
              <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <Tag className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                Quick Enquiry Modal Customization (Header, Labels & Right Panel)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize modal badges, titles, placeholders, phone codes, and SLA notes.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Modal Top Badge Tag
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.badge || ""}
                placeholder="Have a Project in Mind?"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, badge: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Modal Main Title
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.title || ""}
                placeholder="Tell Us A Bit More"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, title: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Phone Country Code Badge
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.countryCode || ""}
                placeholder="+977"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, countryCode: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Select Service Placeholder Text
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.selectServicePlaceholder || ""}
                placeholder="--- Select Service ---"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, selectServicePlaceholder: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Submit Button Text
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.submitButtonText || ""}
                placeholder="Submit Inquiry"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, submitButtonText: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Right Panel Top Badge Tag
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.rightBadge || ""}
                placeholder="We would love to hear from you"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, rightBadge: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Right Panel Header Title
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.rightTitle || ""}
                placeholder="Get In Touch"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, rightTitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Phone Label
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.phoneLabel || ""}
                placeholder="Our Phone Number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, phoneLabel: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Email Label
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.emailLabel || ""}
                placeholder="Email Address"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, emailLabel: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Location Label
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.locationLabel || ""}
                placeholder="Our Location"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, locationLabel: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Footer Working Hours & SLA Note Text
              </label>
              <input
                type="text"
                value={formData.quickEnquiryModal?.footerSlaText || ""}
                placeholder="Hours: Sun - Fri: 9:00 AM - 6:00 PM • Executive SLA: 2 Hours"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickEnquiryModal: { ...formData.quickEnquiryModal, footerSlaText: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:border-violet-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CLIENT INQUIRIES TABULAR LIST */}
      {showInquiriesSection && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-xs">
          {/* Section Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                #03
              </span>
              <h3 className="text-xs sm:text-sm font-bold">
                Client Lead Inquiries Moderation ({inquiries.length} Total Submissions)
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setFilterTab("ALL");
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterTab === "ALL"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All ({inquiries.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilterTab("UNREAD");
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterTab === "UNREAD"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  <span>Unread</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-700 text-white text-[10px]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilterTab("READ");
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterTab === "READ"
                      ? "bg-slate-700 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Read ({inquiries.filter((i) => i.isRead).length})
                </button>
              </div>

              {/* Page size dropdown */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* TABULAR INQUIRIES LIST */}
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12 p-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl sm:rounded-2xl">
              <Mail className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                No contact inquiries found in this category.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">Company / Org</th>
                    <th className="py-3 px-4">Service & Budget</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {pageInquiries.map((item) => {
                    const avatarUrl =
                      (item as any).avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        item.name || "User"
                      )}`;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (!item.isRead) handleMarkRead(item.id);
                          setSelectedInquiry(item);
                        }}
                        className={`group transition-colors cursor-pointer ${
                          !item.isRead
                            ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 font-semibold"
                            : "bg-white dark:bg-[#131927] hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        {/* Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={item.name}
                              className="h-9 w-9 rounded-full object-cover bg-slate-200 dark:bg-slate-700 ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                                  {item.name}
                                </span>
                                {!item.isRead && (
                                  <span className="shrink-0 px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-blue-600 text-white rounded">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate max-w-[120px] sm:max-w-none">
                                {item.email}
                              </p>
                              {item.phone && (
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px] sm:max-w-none">
                                  {item.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.company ? (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[120px] sm:max-w-none">{item.company}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-normal">—</span>
                          )}
                        </td>

                        {/* Service & Budget */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            {item.service ? (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                {item.service}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">General Inquiry</span>
                            )}
                            {item.budget && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                                {item.budget}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {item.isRead ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Read
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 animate-pulse">
                              Unread Lead
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (!item.isRead) handleMarkRead(item.id);
                                setSelectedInquiry(item);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                              title="View Full Message"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {!item.isRead && (
                              <button
                                type="button"
                                onClick={() => handleMarkRead(item.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                                title="Mark as Read"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION & SEE MORE CONTROLS */}
          {filteredInquiries.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
                Showing <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {Math.min(startIndex + pageSize, filteredInquiries.length)}
                </span>{" "}
                of <span className="font-bold text-slate-900 dark:text-white">{filteredInquiries.length}</span> submissions
              </div>

              <div className="flex items-center gap-2">
                {/* Standard Page Pagination */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-xs font-bold px-2 text-slate-700 dark:text-slate-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* "See More" / Expand View Option */}
                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setPageSize((prev) => prev + 10)}
                    className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>See More</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED INQUIRY */}
      {selectedInquiry &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      (selectedInquiry as any).avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        selectedInquiry.name || "User"
                      )}`
                    }
                    alt={selectedInquiry.name}
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover bg-slate-200 dark:bg-slate-700 ring-2 ring-blue-500/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold truncate">
                      {selectedInquiry.name}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                      {selectedInquiry.email} {selectedInquiry.phone ? `• ${selectedInquiry.phone}` : ""}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedInquiry(null);
                    onClearSelectedItem?.();
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-[#0b0f19] p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Company</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {selectedInquiry.company || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Requested Service</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {selectedInquiry.service || "General Inquiry"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Budget</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                    {selectedInquiry.budget || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Submission Time</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 truncate block">
                    {selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt).toLocaleString() : "Recently"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Client Message:
                </span>
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed max-h-48 sm:max-h-60 overflow-y-auto whitespace-pre-wrap font-medium">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <span className="text-[10px] font-mono text-slate-400 text-center sm:text-left">
                  IP: {selectedInquiry.ipAddress || "127.0.0.1"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteInquiry(selectedInquiry)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInquiry(null);
                      onClearSelectedItem?.();
                    }}
                    className="flex-1 sm:flex-none px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}