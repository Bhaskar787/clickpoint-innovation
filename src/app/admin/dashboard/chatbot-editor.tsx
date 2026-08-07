"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Layers,
  Save,
  Plus,
  Trash2,
  Check,
  Loader2,
  RefreshCw,
  Eye,
  Wrench,
  Building2,
  Tag,
  Quote,
  HelpCircle,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  Send,
  FolderGit2,
  CheckSquare,
  Square,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { ChatNode, ChatReply } from "@/data/chatbot-data";

interface ChatbotEditorProps {
  sectionId?: string | null;
  onCloseSection?: () => void;
}

const AVAILABLE_ICONS = [
  "Wrench",
  "Building2",
  "Tag",
  "Quote",
  "HelpCircle",
  "Briefcase",
  "Calendar",
  "Send",
  "ArrowLeft",
  "ExternalLink",
  "Sparkles",
  "FolderGit2",
];

export default function ChatbotEditor({ sectionId, onCloseSection }: ChatbotEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"general" | "nodes" | "data" | "preview">("general");

  // State data
  const [settings, setSettings] = useState({
    botName: "Clix",
    botTitle: "Clickpoint Assistant",
    botSubtitle: "Usually replies instantly",
    welcomeDelayMs: 500,
    startNode: "root",
    enabled: true,
  });

  const [nodes, setNodes] = useState<Record<string, ChatNode>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string>("root");

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedTestimonialIds, setSelectedTestimonialIds] = useState<string[]>([]);
  const [selectedFaqIds, setSelectedFaqIds] = useState<string[]>([]);

  const [customPricingInfo, setCustomPricingInfo] = useState({
    title: "Pricing & Engagement Options",
    description: "Flexible models designed for early startups to enterprise platforms",
    packages: [
      {
        name: "AI MVP / Prototype",
        timeline: "2–4 Weeks",
        priceRange: "$10,000 – $25,000",
        description: "Rapid copilot or LLM RAG application built and deployed with production safeguards.",
      },
      {
        name: "Dedicated Engineering Pod",
        timeline: "Monthly Retainer",
        priceRange: "$12,000 / month",
        description: "Full-stack pod (Senior Tech Lead, React/Next.js Dev, MLOps Engineer, UI Designer).",
      },
      {
        name: "Full Enterprise Product",
        timeline: "8+ Weeks",
        priceRange: "$50,000 – $100,000+",
        description: "End-to-end custom platform architecture, cloud microservices, and security compliance.",
      },
    ],
  });

  // Real backend entities fetched from DB
  const [realEntities, setRealEntities] = useState<{
    services: any[];
    testimonials: any[];
    faqs: any[];
    jobs: any[];
    caseStudies: any[];
  }>({
    services: [],
    testimonials: [],
    faqs: [],
    jobs: [],
    caseStudies: [],
  });

  // Emulator state
  const [emulatorMessages, setEmulatorMessages] = useState<Array<{ id: string; from: "bot" | "user"; text: string }>>([]);
  const [emulatorNodeId, setEmulatorNodeId] = useState<string>("root");

  // Fetch initial chatbot config & entity data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch("/api/chatbot").then((r) => r.json());
        if (res.success && res.data) {
          if (res.data.settings) setSettings(res.data.settings);
          if (res.data.nodes) setNodes(res.data.nodes);
          if (res.data.selectedServiceIds) setSelectedServiceIds(res.data.selectedServiceIds);
          if (res.data.selectedTestimonialIds) setSelectedTestimonialIds(res.data.selectedTestimonialIds);
          if (res.data.selectedFaqIds) setSelectedFaqIds(res.data.selectedFaqIds);
          if (res.data.customPricingInfo) setCustomPricingInfo(res.data.customPricingInfo);
          if (res.data.realEntities) setRealEntities(res.data.realEntities);

          // Reset emulator
          const start = res.data.settings?.startNode || "root";
          setEmulatorNodeId(start);
          const initialNode = res.data.nodes?.[start];
          if (initialNode?.bot) {
            setEmulatorMessages(
              initialNode.bot.map((text: string, idx: number) => ({
                id: `init-${idx}`,
                from: "bot",
                text,
              }))
            );
          }
        }
      } catch (err) {
        toast.error("Failed to load chatbot configuration");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        settings,
        nodes,
        selectedServiceIds,
        selectedTestimonialIds,
        selectedFaqIds,
        customPricingInfo,
      };

      const res = await fetch("/api/chatbot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => r.json());

      if (res.success) {
        toast.success("Chatbot settings saved!", {
          description: "All changes are live on the website chatbot widget.",
        });
      } else {
        toast.error(res.error || "Failed to save chatbot settings");
      }
    } catch (err) {
      toast.error("Network error while saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Node Management functions
  const handleAddNode = () => {
    const newId = `custom_node_${Date.now().toString(36)}`;
    const newNode: ChatNode = {
      id: newId,
      bot: ["Here is a new custom answer card."],
      replies: [{ label: "Back to Main Menu", goTo: "root", icon: "ArrowLeft" }],
    };
    setNodes((prev) => ({ ...prev, [newId]: newNode }));
    setSelectedNodeId(newId);
    toast.success(`Created node "${newId}"`);
  };

  // Pricing Package Handlers
  const handleAddPricingPackage = () => {
    const newPkg = {
      id: `pkg_${Date.now().toString(36)}`,
      name: "Custom Web Application",
      websiteType: "Marketing & Business Site",
      timeline: "2–4 Weeks",
      priceRange: "$3,000 – $8,000",
      description: "Custom built web application with high performance, security, and responsive UI.",
      features: ["Next.js & React", "SEO & Metadata Ready", "Admin Dashboard"],
    };
    setCustomPricingInfo((prev: any) => ({
      ...prev,
      packages: [...(prev?.packages || []), newPkg],
    }));
    toast.success("Added new Website Pricing Package");
  };

  const handleUpdatePricingPackage = (index: number, field: string, value: any) => {
    setCustomPricingInfo((prev: any) => {
      const pkgs = [...(prev?.packages || [])];
      pkgs[index] = { ...pkgs[index], [field]: value };
      return { ...prev, packages: pkgs };
    });
  };

  const handleRemovePricingPackage = (index: number) => {
    setCustomPricingInfo((prev: any) => {
      const pkgs = (prev?.packages || []).filter((_: any, i: number) => i !== index);
      return { ...prev, packages: pkgs };
    });
    toast.success("Removed Website Pricing Package");
  };

  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === "root") {
      toast.error("Cannot delete the root start node!");
      return;
    }
    setNodes((prev) => {
      const copy = { ...prev };
      delete copy[nodeId];
      return copy;
    });
    setSelectedNodeId("root");
    toast.success(`Deleted node "${nodeId}"`);
  };

  const handleUpdateNodeBotMessage = (index: number, val: string) => {
    if (!selectedNodeId || !nodes[selectedNodeId]) return;
    const currentBot = [...nodes[selectedNodeId].bot];
    currentBot[index] = val;
    setNodes((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...prev[selectedNodeId],
        bot: currentBot,
      },
    }));
  };

  const handleAddBotMessage = () => {
    if (!selectedNodeId || !nodes[selectedNodeId]) return;
    const currentBot = [...nodes[selectedNodeId].bot, "New bot message line"];
    setNodes((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...prev[selectedNodeId],
        bot: currentBot,
      },
    }));
  };

  const handleRemoveBotMessage = (index: number) => {
    if (!selectedNodeId || !nodes[selectedNodeId]) return;
    if (nodes[selectedNodeId].bot.length <= 1) {
      toast.error("Each node must have at least 1 message bubble");
      return;
    }
    const currentBot = nodes[selectedNodeId].bot.filter((_, i) => i !== index);
    setNodes((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...prev[selectedNodeId],
        bot: currentBot,
      },
    }));
  };

  const handleAddReply = () => {
    if (!selectedNodeId || !nodes[selectedNodeId]) return;
    const newReply: ChatReply = {
      label: "New Option",
      goTo: "root",
      icon: "ArrowLeft",
    };
    setNodes((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...prev[selectedNodeId],
        replies: [...prev[selectedNodeId].replies, newReply],
      },
    }));
  };

  const handleUpdateReply = (index: number, field: keyof ChatReply, value: any) => {
    if (!selectedNodeId || !nodes[selectedNodeId]) return;
    const currentReplies = [...nodes[selectedNodeId].replies];
    currentReplies[index] = { ...currentReplies[index], [field]: value };
    setNodes((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...prev[selectedNodeId],
        replies: currentReplies,
      },
    }));
  };

  const handleRemoveReply = (index: number) => {
    if (!selectedNodeId || !nodes[selectedNodeId]) return;
    const currentReplies = nodes[selectedNodeId].replies.filter((_, i) => i !== index);
    setNodes((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...prev[selectedNodeId],
        replies: currentReplies,
      },
    }));
  };

  // Emulator flow
  const handleEmulatorReply = (reply: ChatReply) => {
    setEmulatorMessages((prev) => [...prev, { id: `u-${Date.now()}`, from: "user", text: reply.label }]);
    if (reply.goTo && nodes[reply.goTo]) {
      const nextNode = nodes[reply.goTo];
      setEmulatorNodeId(reply.goTo);
      setTimeout(() => {
        nextNode.bot.forEach((msg, idx) => {
          setTimeout(() => {
            setEmulatorMessages((prev) => [...prev, { id: `b-${Date.now()}-${idx}`, from: "bot", text: msg }]);
          }, idx * 300);
        });
      }, 200);
    }
  };

  const resetEmulator = () => {
    const start = settings.startNode || "root";
    setEmulatorNodeId(start);
    const initialNode = nodes[start];
    if (initialNode?.bot) {
      setEmulatorMessages(
        initialNode.bot.map((text, idx) => ({
          id: `init-${idx}`,
          from: "bot",
          text,
        }))
      );
    } else {
      setEmulatorMessages([]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-xs font-semibold text-slate-500">Loading Dynamic Chatbot App Config...</p>
        </div>
      </div>
    );
  }

  const currentNode = nodes[selectedNodeId];

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 font-bold">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">{settings.botTitle}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  settings.enabled
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                }`}
              >
                {settings.enabled ? "ACTIVE LIVE" : "DISABLED"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {Object.keys(nodes).length} Nodes Configured &middot; React Icons Enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === "preview" ? "general" : "preview")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Eye className="h-4 w-4 text-violet-500" />
            <span>{activeTab === "preview" ? "Exit Emulator" : "Live Bot Emulator"}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? "Saving Changes..." : "Save Chatbot Config"}</span>
          </button>
        </div>
      </div>

      {/* Editor Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === "general"
              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>General Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("nodes")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === "nodes"
              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Q&A Nodes & Flows ({Object.keys(nodes).length})</span>
        </button>

        <button
          onClick={() => setActiveTab("data")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === "data"
              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Real Site Content Selector</span>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === "preview"
              ? "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Live Interactive Emulator</span>
        </button>
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === "general" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            General Bot Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                Bot Name (Short)
              </label>
              <input
                type="text"
                value={settings.botName}
                onChange={(e) => setSettings({ ...settings, botName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                Header Display Title
              </label>
              <input
                type="text"
                value={settings.botTitle}
                onChange={(e) => setSettings({ ...settings, botTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                Sub-header Status Text
              </label>
              <input
                type="text"
                value={settings.botSubtitle}
                onChange={(e) => setSettings({ ...settings, botSubtitle: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                Welcome Trigger Delay (ms)
              </label>
              <input
                type="number"
                value={settings.welcomeDelayMs}
                onChange={(e) => setSettings({ ...settings, welcomeDelayMs: parseInt(e.target.value) || 500 })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Enable Chatbot Widget on Public Site</p>
              <p className="text-[11px] text-slate-500">
                When enabled, floating widget shows on bottom-right of all non-admin pages.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CONVERSATION NODES & Q&A FLOW MANAGER */}
      {activeTab === "nodes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Node List Left Column */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Nodes ({Object.keys(nodes).length})
              </h4>
              <button
                onClick={handleAddNode}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Node</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {Object.keys(nodes).map((key) => {
                const n = nodes[key];
                const isSelected = selectedNodeId === key;
                const isRoot = key === "root";

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedNodeId(key)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-xs"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{key}</span>
                      {isRoot && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          START
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {n.replies?.length || 0} chips
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Editor Right Column */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-6">
            {currentNode ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500">
                      Editing Conversation Node
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{currentNode.id}</h3>
                  </div>

                  {currentNode.id !== "root" && (
                    <button
                      onClick={() => handleDeleteNode(currentNode.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-800 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Node</span>
                    </button>
                  )}
                </div>

                {/* Bot Message Bubbles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-white">
                      Bot Answer Message Bubbles ({currentNode.bot.length})
                    </label>
                    <button
                      onClick={handleAddBotMessage}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Message Bubble</span>
                    </button>
                  </div>

                  {currentNode.bot.map((msgText, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <textarea
                        rows={3}
                        value={msgText}
                        onChange={(e) => handleUpdateNodeBotMessage(idx, e.target.value)}
                        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b0f19] p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveBotMessage(idx)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove bubble"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Dynamic Content Cards Toggles */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">
                    Embedded Real Site Content Widgets (Dynamic Cards)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Enable specific dynamic widgets to render rich cards under this bot node's messages.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentNode.showRealServices)}
                        onChange={(e) =>
                          setNodes((prev) => ({
                            ...prev,
                            [selectedNodeId]: { ...currentNode, showRealServices: e.target.checked },
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-blue-500" />
                        Show Selected Real Services
                      </span>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentNode.showRealTestimonials)}
                        onChange={(e) =>
                          setNodes((prev) => ({
                            ...prev,
                            [selectedNodeId]: { ...currentNode, showRealTestimonials: e.target.checked },
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Quote className="h-4 w-4 text-amber-500" />
                        Show Selected Testimonials
                      </span>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentNode.showPricingCards)}
                        onChange={(e) =>
                          setNodes((prev) => ({
                            ...prev,
                            [selectedNodeId]: { ...currentNode, showPricingCards: e.target.checked },
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Tag className="h-4 w-4 text-emerald-500" />
                        Show Pricing Packages Cards
                      </span>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentNode.showRealFaqs)}
                        onChange={(e) =>
                          setNodes((prev) => ({
                            ...prev,
                            [selectedNodeId]: { ...currentNode, showRealFaqs: e.target.checked },
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-violet-500" />
                        Show Selected FAQs Accordion
                      </span>
                    </label>
                  </div>
                </div>

                {/* Quick Reply Chips */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-white">
                      Quick Reply Action Chips ({currentNode.replies?.length || 0})
                    </label>
                    <button
                      onClick={handleAddReply}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Quick Reply Chip</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentNode.replies?.map((reply, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          {/* Label */}
                          <div className="sm:col-span-5">
                            <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1">
                              Chip Label
                            </label>
                            <input
                              type="text"
                              value={reply.label}
                              onChange={(e) => handleUpdateReply(rIdx, "label", e.target.value)}
                              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                            />
                          </div>

                          {/* Icon Selector */}
                          <div className="sm:col-span-3">
                            <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1">
                              React Icon
                            </label>
                            <select
                              value={reply.icon || "ArrowLeft"}
                              onChange={(e) => handleUpdateReply(rIdx, "icon", e.target.value)}
                              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                            >
                              {AVAILABLE_ICONS.map((ic) => (
                                <option key={ic} value={ic}>
                                  {ic}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Action Target */}
                          <div className="sm:col-span-3">
                            <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1">
                              Target Node / URL
                            </label>
                            {reply.href !== undefined ? (
                              <input
                                type="text"
                                value={reply.href}
                                placeholder="/services or URL"
                                onChange={(e) => handleUpdateReply(rIdx, "href", e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                              />
                            ) : (
                              <select
                                value={reply.goTo || "root"}
                                onChange={(e) => handleUpdateReply(rIdx, "goTo", e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                              >
                                {Object.keys(nodes).map((nk) => (
                                  <option key={nk} value={nk}>
                                    {nk}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>

                          <div className="sm:col-span-1 flex justify-end">
                            <button
                              onClick={() => handleRemoveReply(rIdx)}
                              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete chip"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 text-center py-10">Select a node on the left to edit.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REAL SITE CONTENT SELECTOR */}
      {activeTab === "data" && (
        <div className="space-y-6">
          {/* Services Selector */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-500" />
                  Select Services to Display in Chatbot
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick from real active services published on the Services Page. Selected items will render as interactive cards when users tap "Our Services".
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {selectedServiceIds.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {realEntities.services.map((svc) => {
                const id = svc.id || svc.title;
                const isChecked = selectedServiceIds.includes(id);

                return (
                  <div
                    key={id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedServiceIds(selectedServiceIds.filter((item) => item !== id));
                      } else {
                        setSelectedServiceIds([...selectedServiceIds, id]);
                      }
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{svc.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {svc.description}
                        </p>
                      </div>
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials Selector */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Quote className="h-4 w-4 text-amber-500" />
                  Select Testimonials to Display in Chatbot
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick approved client reviews from the database to feature in the Chatbot review carousel.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {selectedTestimonialIds.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {realEntities.testimonials.map((t) => {
                const isChecked = selectedTestimonialIds.includes(t.id);

                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedTestimonialIds(selectedTestimonialIds.filter((item) => item !== t.id));
                      } else {
                        setSelectedTestimonialIds([...selectedTestimonialIds, t.id]);
                      }
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 ring-1 ring-amber-500"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.clientName}</h4>
                          <span className="text-[10px] text-amber-500 font-bold">{t.rating}★</span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400">{t.clientRole} &middot; {t.company}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 italic">
                          "{t.content}"
                        </p>
                      </div>
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQs Selector */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-violet-500" />
                  Select FAQs to Display in Chatbot
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick FAQs from the database to feature in the Chatbot accordion list when users ask about FAQs.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                {selectedFaqIds.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {realEntities.faqs.map((f) => {
                const isChecked = selectedFaqIds.includes(f.id);

                return (
                  <div
                    key={f.id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedFaqIds(selectedFaqIds.filter((item) => item !== f.id));
                      } else {
                        setSelectedFaqIds([...selectedFaqIds, f.id]);
                      }
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/40 ring-1 ring-violet-500"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{f.question}</h4>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{f.categoryName}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                          {f.answer}
                        </p>
                      </div>
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Website & Application Pricing Manager */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-500" />
                  Website & Application Dynamic Pricing Packages
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure website types, timelines, price ranges, and deliverables shown when users ask for pricing.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPricingPackage}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Website Pricing Package</span>
              </button>
            </div>

            <div className="space-y-4">
              {customPricingInfo?.packages?.map((pkg: any, pIdx: number) => (
                <div
                  key={pkg.id || pIdx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Website Package Tier #{pIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePricingPackage(pIdx)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove package"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1">
                        Package Name
                      </label>
                      <input
                        type="text"
                        value={pkg.name || ""}
                        onChange={(e) => handleUpdatePricingPackage(pIdx, "name", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1">
                        Website / Tech Category
                      </label>
                      <input
                        type="text"
                        value={pkg.websiteType || ""}
                        placeholder="e.g. Marketing Site, Online Store"
                        onChange={(e) => handleUpdatePricingPackage(pIdx, "websiteType", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1">
                        Estimated Price Range
                      </label>
                      <input
                        type="text"
                        value={pkg.priceRange || ""}
                        placeholder="e.g. $2,500 – $5,000"
                        onChange={(e) => handleUpdatePricingPackage(pIdx, "priceRange", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1">
                        Estimated Timeline
                      </label>
                      <input
                        type="text"
                        value={pkg.timeline || ""}
                        placeholder="e.g. 1–2 Weeks"
                        onChange={(e) => handleUpdatePricingPackage(pIdx, "timeline", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1">
                        Description & Scope Summary
                      </label>
                      <input
                        type="text"
                        value={pkg.description || ""}
                        onChange={(e) => handleUpdatePricingPackage(pIdx, "description", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE INTERACTIVE EMULATOR */}
      {activeTab === "preview" && (
        <div className="flex justify-center py-4">
          <div className="w-full max-w-[420px] rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col h-[580px]">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">{settings.botTitle}</p>
                  <p className="text-[10px] text-violet-100 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {settings.botSubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={resetEmulator}
                className="p-1.5 text-white/80 hover:text-white transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50 dark:bg-slate-950/40">
              {emulatorMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                      m.from === "bot"
                        ? "rounded-bl-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                        : "rounded-br-xs bg-violet-600 text-white font-medium"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Chips */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {nodes[emulatorNodeId]?.replies?.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleEmulatorReply(r)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                  >
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
