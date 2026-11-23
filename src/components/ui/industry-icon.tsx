"use client";

import React, { useState, useMemo } from "react";
import {
  // Fintech & Finance
  BsWallet2,
  BsCashCoin,
  BsCreditCard2Front,
  BsBank,
  BsGraphUpArrow,
  BsCurrencyDollar,
  BsCurrencyBitcoin,
  BsSafe2,
  BsPiggyBank,

  // Healthcare & Life Sciences
  BsHeartPulse,
  BsCapsule,
  BsHospital,
  BsActivity,
  BsThermometerHalf,
  BsShieldPlus,
  BsPrescription2,

  // E-Commerce & Retail
  BsBagCheck,
  BsCart3,
  BsShop,
  BsTag,
  BsBoxSeam,
  BsQrCodeScan,

  // SaaS, Cloud & Developer Infrastructure
  BsLayers,
  BsCloudCheck,
  BsServer,
  BsCpu,
  BsHddNetwork,
  BsDatabaseCheck,
  BsCodeSquare,
  BsCodeSlash,
  BsPalette,
  BsLaptop,
  BsTerminal,
  BsRocketTakeoff,
  BsShieldCheck,

  // Logistics & Supply Chain
  BsTruck,
  BsGlobeAmericas,
  BsBoxes,
  BsCompass,
  BsFuelPump,
  BsAirplane,
  BsTrainFreightFront,

  // Education & EdTech
  BsMortarboard,
  BsBook,
  BsLightbulb,
  BsAward,
  BsPencilSquare,
  BsPersonVideo3,

  // Real Estate & PropTech
  BsBuildings,
  BsHouseDoor,
  BsHammer,
  BsKey,

  // AI, Robotics & Deep Tech
  BsRobot,
  BsStars,
  BsDiagram3,
  BsEye,
  BsCpuFill,

  // Energy & Utilities
  BsLightningCharge,
  BsSun,
  BsWind,
  BsBatteryCharging,

  // Security, Legal & Compliance
  BsShieldLock,
  BsFingerprint,
  BsFileEarmarkCheck,
  BsBriefcase,

  // Media, Entertainment & Social
  BsFilm,
  BsController,
  BsMegaphone,
  BsBroadcast,

  // Hospitality & Travel
  BsCupHot,
  BsLuggage,
  BsPassport,

  // Manufacturing & Industrial
  BsGear,
  BsTools,
  BsNut,
} from "react-icons/bs";

import {
  Search,
  Check,
  X,
} from "lucide-react";

export interface IndustryIconItem {
  id: string;
  name: string;
  category: string;
  component: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

export const INDUSTRY_ICON_OPTIONS: IndustryIconItem[] = [
  // Fintech
  { id: "BsWallet2", name: "Digital Wallet", category: "Fintech", component: BsWallet2, keywords: ["wallet", "fintech", "money", "pay", "banking"] },
  { id: "BsCashCoin", name: "Cash & Coins", category: "Fintech", component: BsCashCoin, keywords: ["cash", "coin", "money", "currency", "finance"] },
  { id: "BsCreditCard2Front", name: "Credit Card", category: "Fintech", component: BsCreditCard2Front, keywords: ["card", "credit", "payment", "checkout"] },
  { id: "BsBank", name: "Bank Institution", category: "Fintech", component: BsBank, keywords: ["bank", "vault", "institutional", "finance"] },
  { id: "BsGraphUpArrow", name: "Growth & Trading", category: "Fintech", component: BsGraphUpArrow, keywords: ["growth", "trading", "stock", "chart", "invest"] },
  { id: "BsCurrencyDollar", name: "Dollar Currency", category: "Fintech", component: BsCurrencyDollar, keywords: ["dollar", "usd", "revenue", "sales"] },
  { id: "BsCurrencyBitcoin", name: "Crypto & Web3", category: "Fintech", component: BsCurrencyBitcoin, keywords: ["bitcoin", "crypto", "blockchain", "web3"] },
  { id: "BsSafe2", name: "Vault & Reserves", category: "Fintech", component: BsSafe2, keywords: ["safe", "vault", "reserves", "security", "funds"] },
  { id: "BsPiggyBank", name: "Savings & Wealth", category: "Fintech", component: BsPiggyBank, keywords: ["piggy", "savings", "wealth", "deposit"] },

  // Healthcare
  { id: "BsHeartPulse", name: "Heart Pulse", category: "Healthcare", component: BsHeartPulse, keywords: ["heart", "pulse", "health", "medical", "clinic"] },
  { id: "BsHospital", name: "Hospital Clinic", category: "Healthcare", component: BsHospital, keywords: ["hospital", "clinic", "doctor", "health"] },
  { id: "BsCapsule", name: "Pharma & Meds", category: "Healthcare", component: BsCapsule, keywords: ["capsule", "pill", "pharma", "medicine", "biotech"] },
  { id: "BsActivity", name: "Vital Monitoring", category: "Healthcare", component: BsActivity, keywords: ["activity", "ecg", "vitals", "health", "monitor"] },
  { id: "BsThermometerHalf", name: "Telehealth Diagnostics", category: "Healthcare", component: BsThermometerHalf, keywords: ["temperature", "telehealth", "diagnostics"] },
  { id: "BsShieldPlus", name: "Health Protection", category: "Healthcare", component: BsShieldPlus, keywords: ["shield", "health", "care", "insurance"] },
  { id: "BsPrescription2", name: "Prescription Rx", category: "Healthcare", component: BsPrescription2, keywords: ["prescription", "rx", "pharma", "records"] },

  // E-Commerce
  { id: "BsBagCheck", name: "Shopping Bag", category: "E-Commerce", component: BsBagCheck, keywords: ["bag", "shopping", "ecommerce", "retail", "store"] },
  { id: "BsCart3", name: "Shopping Cart", category: "E-Commerce", component: BsCart3, keywords: ["cart", "ecommerce", "shop", "checkout", "marketplace"] },
  { id: "BsShop", name: "Retail Storefront", category: "E-Commerce", component: BsShop, keywords: ["shop", "store", "retail", "merchant", "pos"] },
  { id: "BsTag", name: "Discount & Pricing", category: "E-Commerce", component: BsTag, keywords: ["tag", "discount", "pricing", "promotion", "sale"] },
  { id: "BsBoxSeam", name: "Product Packaging", category: "E-Commerce", component: BsBoxSeam, keywords: ["box", "package", "parcel", "product", "fulfillment"] },
  { id: "BsQrCodeScan", name: "Digital POS & QR", category: "E-Commerce", component: BsQrCodeScan, keywords: ["qr", "scan", "pos", "mobile", "checkout"] },

  // SaaS & Cloud
  { id: "BsLayers", name: "SaaS Architecture", category: "SaaS & Cloud", component: BsLayers, keywords: ["layers", "saas", "stack", "platform", "multi-tenant"] },
  { id: "BsCloudCheck", name: "Cloud Infrastructure", category: "SaaS & Cloud", component: BsCloudCheck, keywords: ["cloud", "devops", "aws", "serverless", "verified"] },
  { id: "BsServer", name: "Database & Servers", category: "SaaS & Cloud", component: BsServer, keywords: ["server", "database", "backend", "hosting"] },
  { id: "BsCpu", name: "Compute Engine", category: "SaaS & Cloud", component: BsCpu, keywords: ["cpu", "compute", "processing", "chip", "performance"] },
  { id: "BsHddNetwork", name: "Distributed Network", category: "SaaS & Cloud", component: BsHddNetwork, keywords: ["network", "distributed", "edge", "cluster"] },
  { id: "BsDatabaseCheck", name: "SQL & Analytics DB", category: "SaaS & Cloud", component: BsDatabaseCheck, keywords: ["database", "sql", "postgres", "analytics", "storage"] },
  { id: "BsCodeSquare", name: "Developer APIs", category: "SaaS & Cloud", component: BsCodeSquare, keywords: ["code", "api", "developer", "sdk", "graphql"] },
  { id: "BsCodeSlash", name: "Code & Web Dev", category: "SaaS & Cloud", component: BsCodeSlash, keywords: ["code", "web", "dev", "software", "development", "programming"] },
  { id: "BsPalette", name: "UI/UX & Product Design", category: "Media", component: BsPalette, keywords: ["design", "ui", "ux", "palette", "product", "creative"] },
  { id: "BsLaptop", name: "Web & Mobile Platforms", category: "SaaS & Cloud", component: BsLaptop, keywords: ["laptop", "web", "platform", "app", "frontend"] },
  { id: "BsTerminal", name: "Cloud & Systems CLI", category: "SaaS & Cloud", component: BsTerminal, keywords: ["terminal", "cli", "backend", "systems", "devops"] },
  { id: "BsRocketTakeoff", name: "Growth & Velocity", category: "Fintech", component: BsRocketTakeoff, keywords: ["rocket", "growth", "launch", "scale", "velocity", "cro"] },
  { id: "BsShieldCheck", name: "Audited Security", category: "Security", component: BsShieldCheck, keywords: ["shield", "security", "verified", "compliance", "soc2"] },

  // Logistics
  { id: "BsTruck", name: "Freight Truck", category: "Logistics", component: BsTruck, keywords: ["truck", "logistics", "fleet", "freight", "transport"] },
  { id: "BsGlobeAmericas", name: "Global Supply Chain", category: "Logistics", component: BsGlobeAmericas, keywords: ["globe", "supply", "chain", "international", "freight"] },
  { id: "BsBoxes", name: "Warehouse Inventory", category: "Logistics", component: BsBoxes, keywords: ["boxes", "warehouse", "inventory", "stock", "storage"] },
  { id: "BsCompass", name: "Route Optimization", category: "Logistics", component: BsCompass, keywords: ["compass", "routing", "gps", "fleet", "navigation"] },
  { id: "BsFuelPump", name: "Fleet Energy", category: "Logistics", component: BsFuelPump, keywords: ["fuel", "energy", "fleet", "mileage"] },
  { id: "BsAirplane", name: "Air Cargo", category: "Logistics", component: BsAirplane, keywords: ["airplane", "flight", "air cargo", "fast shipping"] },
  { id: "BsTrainFreightFront", name: "Rail Freight", category: "Logistics", component: BsTrainFreightFront, keywords: ["train", "rail", "freight", "cargo"] },

  // EdTech
  { id: "BsMortarboard", name: "Graduation Cap", category: "EdTech", component: BsMortarboard, keywords: ["graduation", "cap", "education", "university", "edtech", "learning"] },
  { id: "BsBook", name: "Curriculum Book", category: "EdTech", component: BsBook, keywords: ["book", "reading", "curriculum", "lms", "content"] },
  { id: "BsLightbulb", name: "Interactive Learning", category: "EdTech", component: BsLightbulb, keywords: ["lightbulb", "idea", "tutoring", "skills", "creativity"] },
  { id: "BsAward", name: "Certification Badge", category: "EdTech", component: BsAward, keywords: ["award", "badge", "certificate", "credential"] },
  { id: "BsPencilSquare", name: "Exams & Testing", category: "EdTech", component: BsPencilSquare, keywords: ["pencil", "exam", "assessment", "homework"] },
  { id: "BsPersonVideo3", name: "Virtual Classroom", category: "EdTech", component: BsPersonVideo3, keywords: ["video", "classroom", "remote", "lecture", "tutor"] },

  // Real Estate
  { id: "BsBuildings", name: "Commercial Towers", category: "Real Estate", component: BsBuildings, keywords: ["buildings", "real estate", "commercial", "property", "proptech"] },
  { id: "BsHouseDoor", name: "Residential Living", category: "Real Estate", component: BsHouseDoor, keywords: ["house", "residential", "home", "realtor"] },
  { id: "BsHammer", name: "Construction Tech", category: "Real Estate", component: BsHammer, keywords: ["hammer", "construction", "architecture", "building"] },
  { id: "BsKey", name: "Access & Tenant Key", category: "Real Estate", component: BsKey, keywords: ["key", "tenant", "access", "leasing", "property"] },

  // AI & Tech
  { id: "BsRobot", name: "AI Agent & Copilot", category: "AI & Tech", component: BsRobot, keywords: ["robot", "ai", "bot", "copilot", "agent", "llm", "automation"] },
  { id: "BsStars", name: "Generative Intelligence", category: "AI & Tech", component: BsStars, keywords: ["stars", "sparkles", "genai", "prompt", "creative"] },
  { id: "BsDiagram3", name: "Neural Networks", category: "AI & Tech", component: BsDiagram3, keywords: ["neural", "network", "diagram", "graph", "deep learning"] },
  { id: "BsEye", name: "Computer Vision", category: "AI & Tech", component: BsEye, keywords: ["eye", "vision", "detection", "ocr", "image recognition"] },
  { id: "BsCpuFill", name: "Edge AI Silicon", category: "AI & Tech", component: BsCpuFill, keywords: ["chip", "silicon", "hardware", "edge", "accelerator"] },

  // Energy & CleanTech
  { id: "BsLightningCharge", name: "Grid & Electric Power", category: "Energy", component: BsLightningCharge, keywords: ["lightning", "electricity", "energy", "power", "grid"] },
  { id: "BsSun", name: "Solar Renewables", category: "Energy", component: BsSun, keywords: ["sun", "solar", "renewable", "clean", "green"] },
  { id: "BsWind", name: "Wind Sustainability", category: "Energy", component: BsWind, keywords: ["wind", "turbine", "sustainability", "eco"] },
  { id: "BsBatteryCharging", name: "Battery Storage & EV", category: "Energy", component: BsBatteryCharging, keywords: ["battery", "ev", "charging", "storage"] },

  // Security & Legal
  { id: "BsShieldLock", name: "Cybersecurity Shield", category: "Security", component: BsShieldLock, keywords: ["shield", "security", "cyber", "firewall", "encryption"] },
  { id: "BsFingerprint", name: "Biometric Auth", category: "Security", component: BsFingerprint, keywords: ["fingerprint", "biometrics", "auth", "identity", "kyc"] },
  { id: "BsFileEarmarkCheck", name: "Audited Compliance", category: "Security", component: BsFileEarmarkCheck, keywords: ["contract", "audit", "compliance", "legal", "soc2"] },
  { id: "BsBriefcase", name: "Corporate & Legal", category: "Security", component: BsBriefcase, keywords: ["briefcase", "corporate", "legal", "consulting"] },

  // Media & Gaming
  { id: "BsFilm", name: "Film & OTT Media", category: "Media", component: BsFilm, keywords: ["film", "video", "ott", "streaming", "entertainment"] },
  { id: "BsController", name: "Gaming & Esports", category: "Media", component: BsController, keywords: ["game", "controller", "gaming", "interactive", "webgl"] },
  { id: "BsMegaphone", name: "AdTech & Marketing", category: "Media", component: BsMegaphone, keywords: ["megaphone", "marketing", "adtech", "announcement", "campaign"] },
  { id: "BsBroadcast", name: "Broadcasting & Telecom", category: "Media", component: BsBroadcast, keywords: ["broadcast", "telecom", "stream", "live", "signal"] },

  // Hospitality & Travel
  { id: "BsCupHot", name: "Food & Beverage", category: "Hospitality", component: BsCupHot, keywords: ["coffee", "cup", "restaurant", "hospitality", "f&b"] },
  { id: "BsLuggage", name: "Hotels & Travel", category: "Hospitality", component: BsLuggage, keywords: ["luggage", "travel", "hotel", "tourism", "vacation"] },
  { id: "BsPassport", name: "International Tourism", category: "Hospitality", component: BsPassport, keywords: ["passport", "tourism", "travel", "booking"] },

  // Manufacturing
  { id: "BsGear", name: "Smart Factory", category: "Manufacturing", component: BsGear, keywords: ["gear", "factory", "manufacturing", "industry 4.0", "machinery"] },
  { id: "BsTools", name: "Industrial Equipment", category: "Manufacturing", component: BsTools, keywords: ["tools", "equipment", "hardware", "maintenance"] },
  { id: "BsNut", name: "Precision Engineering", category: "Manufacturing", component: BsNut, keywords: ["nut", "bolt", "hardware", "precision", "engineering"] },
];

export const ICON_CATEGORIES = [
  "All",
  "Fintech",
  "Healthcare",
  "E-Commerce",
  "SaaS & Cloud",
  "Logistics",
  "EdTech",
  "Real Estate",
  "AI & Tech",
  "Energy",
  "Security",
  "Media",
  "Hospitality",
  "Manufacturing",
];

// Map of legacy / id aliases
const ICON_COMPONENT_MAP: Record<string, React.ComponentType<{ className?: string }>> = {};
INDUSTRY_ICON_OPTIONS.forEach((item) => {
  ICON_COMPONENT_MAP[item.id] = item.component;
  ICON_COMPONENT_MAP[item.id.toLowerCase()] = item.component;
});

// Map standard domain IDs to signature icons
const DEFAULT_DOMAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fintech: BsWallet2,
  healthcare: BsHeartPulse,
  ecommerce: BsBagCheck,
  saas: BsLayers,
  logistics: BsTruck,
  edtech: BsMortarboard,
  realestate: BsBuildings,
  energy: BsLightningCharge,
  ai: BsRobot,

  // Services Defaults
  "ai-eng": BsRobot,
  "web-dev": BsCodeSlash,
  "ui-ux": BsPalette,
  growth: BsGraphUpArrow,
  "platform-mod": BsBoxes,
  mlops: BsCpu,
};

// Aliases for Lucide icon string names
ICON_COMPONENT_MAP["wallet"] = BsWallet2;
ICON_COMPONENT_MAP["Wallet"] = BsWallet2;
ICON_COMPONENT_MAP["heartpulse"] = BsHeartPulse;
ICON_COMPONENT_MAP["HeartPulse"] = BsHeartPulse;
ICON_COMPONENT_MAP["shoppingbag"] = BsBagCheck;
ICON_COMPONENT_MAP["ShoppingBag"] = BsBagCheck;
ICON_COMPONENT_MAP["layers"] = BsLayers;
ICON_COMPONENT_MAP["Layers"] = BsLayers;
ICON_COMPONENT_MAP["truck"] = BsTruck;
ICON_COMPONENT_MAP["Truck"] = BsTruck;
ICON_COMPONENT_MAP["graduationcap"] = BsMortarboard;
ICON_COMPONENT_MAP["GraduationCap"] = BsMortarboard;
ICON_COMPONENT_MAP["building2"] = BsBuildings;
ICON_COMPONENT_MAP["Building2"] = BsBuildings;

// Services Lucide aliases
ICON_COMPONENT_MAP["bot"] = BsRobot;
ICON_COMPONENT_MAP["Bot"] = BsRobot;
ICON_COMPONENT_MAP["code2"] = BsCodeSlash;
ICON_COMPONENT_MAP["Code2"] = BsCodeSlash;
ICON_COMPONENT_MAP["palette"] = BsPalette;
ICON_COMPONENT_MAP["Palette"] = BsPalette;
ICON_COMPONENT_MAP["linechart"] = BsGraphUpArrow;
ICON_COMPONENT_MAP["LineChart"] = BsGraphUpArrow;
ICON_COMPONENT_MAP["boxes"] = BsBoxes;
ICON_COMPONENT_MAP["Boxes"] = BsBoxes;
ICON_COMPONENT_MAP["cpu"] = BsCpu;
ICON_COMPONENT_MAP["Cpu"] = BsCpu;

// Fallback sequence of distinct icons
const FALLBACK_ICON_LIST = [
  BsBuildings,
  BsLayers,
  BsWallet2,
  BsHeartPulse,
  BsBagCheck,
  BsTruck,
  BsMortarboard,
  BsRobot,
  BsLightningCharge,
  BsShieldLock,
];

/**
 * Resolves an icon component given an iconId, iconName, or industryId.
 */
export function resolveIndustryIconComponent(
  iconIdentifier?: any,
  industryId?: string,
  fallbackIndex = 0
): React.ComponentType<{ className?: string }> {
  // If icon is already a React Component / function
  if (typeof iconIdentifier === "function") {
    return iconIdentifier;
  }

  // If iconIdentifier is a string ID
  if (typeof iconIdentifier === "string" && iconIdentifier.trim()) {
    const trimmed = iconIdentifier.trim();
    if (ICON_COMPONENT_MAP[trimmed]) return ICON_COMPONENT_MAP[trimmed];
    if (ICON_COMPONENT_MAP[trimmed.toLowerCase()]) return ICON_COMPONENT_MAP[trimmed.toLowerCase()];
  }

  // Lookup by industryId (e.g. "fintech", "ecommerce")
  if (industryId) {
    const cleanId = industryId.toLowerCase();
    for (const key of Object.keys(DEFAULT_DOMAIN_ICONS)) {
      if (cleanId.includes(key)) {
        return DEFAULT_DOMAIN_ICONS[key];
      }
    }
  }

  // Fallback to cyclical list based on index or string hash
  if (industryId) {
    let hash = 0;
    for (let i = 0; i < industryId.length; i++) {
      hash = (hash << 5) - hash + industryId.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % FALLBACK_ICON_LIST.length;
    return FALLBACK_ICON_LIST[idx];
  }

  return FALLBACK_ICON_LIST[fallbackIndex % FALLBACK_ICON_LIST.length];
}

/**
 * Clean Dynamic Industry Icon Component
 */
export function IndustryIcon({
  icon,
  iconName,
  industryId,
  className = "h-5 w-5",
  fallbackIndex = 0,
}: {
  icon?: any;
  iconName?: string;
  industryId?: string;
  className?: string;
  fallbackIndex?: number;
}) {
  const IconComponent = resolveIndustryIconComponent(icon || iconName, industryId, fallbackIndex);
  return <IconComponent className={className} />;
}

/**
 * Interactive Industry Icon Picker Component for Admin Dashboards & Modals
 */
interface IndustryIconPickerProps {
  value?: string;
  onChange: (iconId: string) => void;
  industryId?: string;
  industryTitle?: string;
}

export function IndustryIconPicker({
  value,
  onChange,
  industryId,
}: IndustryIconPickerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const CurrentIcon = resolveIndustryIconComponent(value, industryId);
  const currentItem = INDUSTRY_ICON_OPTIONS.find((item) => item.id === value);

  const filteredIcons = useMemo(() => {
    return INDUSTRY_ICON_OPTIONS.filter((item) => {
      const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
      if (!matchesCat) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((kw) => kw.includes(q))
      );
    });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0e1422] p-4">
      {/* Top Banner: Selected Icon Preview & Quick Clear */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
            <CurrentIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                {currentItem?.category || "Domain Icon"}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentItem?.name || value || "Dynamic Sector Icon"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
              ID: {value || "Default (Auto-resolved from sector)"}
            </p>
          </div>
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="self-end sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-300 rounded-lg transition-colors cursor-pointer"
            title="Reset to default sector icon"
          >
            <X className="h-3 w-3" />
            <span>Reset Default</span>
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search icons by keyword (e.g. wallet, hospital, cart, server, ai, truck, robot)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {ICON_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-violet-600 text-white shadow-xs"
                : "bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scrollable Icon Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-[260px] overflow-y-auto pr-1">
        {filteredIcons.map((item) => {
          const ItemComponent = item.component;
          const isSelected = value === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer relative group ${
                isSelected
                  ? "bg-violet-50 dark:bg-violet-950/40 border-violet-600 dark:border-violet-500 ring-2 ring-violet-500/30 text-violet-700 dark:text-violet-300 shadow-xs"
                  : "bg-white dark:bg-[#131927] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
              title={`${item.name} (${item.category})`}
            >
              {isSelected && (
                <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-violet-600 text-white flex items-center justify-center">
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
              <ItemComponent className={`h-5 w-5 transition-transform group-hover:scale-110 ${isSelected ? "text-violet-600 dark:text-violet-400" : "text-slate-700 dark:text-slate-200"}`} />
              <span className="text-[10px] font-medium leading-tight line-clamp-1 w-full">
                {item.name}
              </span>
            </button>
          );
        })}

        {filteredIcons.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-slate-400">
            No icons found matching &quot;{search}&quot;. Try another search term!
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
        <span>Showing {filteredIcons.length} curated React / Bootstrap icons</span>
        <span className="font-mono text-[10px]">Click any icon to assign</span>
      </div>
    </div>
  );
}

/**
 * Service Capability Icon Component
 */
export function ServiceIcon({
  icon,
  iconName,
  serviceId,
  className = "h-5 w-5",
  fallbackIndex = 0,
}: {
  icon?: any;
  iconName?: string;
  serviceId?: string;
  className?: string;
  fallbackIndex?: number;
}) {
  return (
    <IndustryIcon
      icon={icon}
      iconName={iconName}
      industryId={serviceId}
      className={className}
      fallbackIndex={fallbackIndex}
    />
  );
}

/**
 * Service Capability Icon Picker Component
 */
export function ServiceIconPicker({
  value,
  onChange,
  serviceId,
}: {
  value?: string;
  onChange: (iconId: string) => void;
  serviceId?: string;
}) {
  return (
    <IndustryIconPicker
      value={value}
      onChange={onChange}
      industryId={serviceId}
    />
  );
}

