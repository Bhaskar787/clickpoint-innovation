"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  TrendingUp,
  Bot,
  Layers,
  Activity,
  Star,
  CheckCircle2,
  Code2,
  Terminal,
  Sparkles,
  Cpu,
  Calculator,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLIENT_LOGOS_DATA } from "@/data/landing-data";

// Container animations
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// Interactive Terminal Code Examples
const CODE_SNIPPETS = {
  agent: `// Initialize Custom Enterprise AI Agent
import { ClickpointAI } from '@clickpoint/sdk';

const agent = new ClickpointAI({
  model: 'gpt-4o-enterprise',
  ragPipeline: 'vector-db-pgvector',
  soc2Compliant: true,
});

await agent.deployWorkflow({
  automation: 'enterprise-data-pipeline',
  latencyTarget: '< 200ms'
});`,
  web: `// Full-Stack Next.js 15 & High-Performance API
export async function GET(req: Request) {
  const data = await postgres.query(\`
    SELECT * FROM analytics_stream 
    WHERE latency < 10
  \`);

  return Response.json({ success: true, payload: data });
}`,
};

export default function Hero() {
  const blobRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Interactivity state
  const [activeTab, setActiveTab] = useState<"agent" | "web">("agent");
  const [copied, setCopied] = useState(false);
  const [projectScope, setProjectScope] = useState<"mvp" | "scale">("mvp");
  const [estimatedWeeks, setEstimatedWeeks] = useState(3);

  // Copy code handler
  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // GSAP Background Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blobRef.current, {
        rotate: 360,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
      gsap.to(ringRef.current, {
        rotate: -360,
        duration: 60,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 transition-colors duration-300 bg-slate-50 dark:bg-[#0b0d22] text-slate-900 dark:text-slate-100">
      
      {/* ================= SPOTLIGHT & GRAPH GRID BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        
        {/* Fine Linear Graph Grid with Radial Mask (fades grid smoothly near edges) */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]" 
        />

        {/* Central Ambient Purple/Blue Radial Spotlight Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[850px] rounded-full bg-gradient-to-tr from-violet-600/25 via-indigo-600/20 to-blue-500/10 dark:from-violet-600/30 dark:via-indigo-500/20 dark:to-purple-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          
          {/* ================= LEFT COLUMN: COPY & CONVERSION ================= */}
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            
            {/* Top Pill Badge */}
            <motion.div variants={itemVariants} className="inline-flex">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/90 dark:border-violet-800/60 dark:bg-violet-950/60 px-3.5 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-violet-600 dark:text-violet-300 shadow-sm backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300 animate-pulse" />
                <span>Next-Gen Engineering Studio</span>
                <span className="h-1 w-1 rounded-full bg-violet-400 dark:bg-violet-500" />
                <span className="text-violet-600 dark:text-violet-300 font-medium">AI & Cloud Architecture</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="mt-6 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight sm:leading-[1.12]"
            >
              Empowering Business with{" "}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-violet-600 dark:from-orange-400 dark:via-amber-400 dark:to-violet-400 bg-clip-text text-transparent">
                Clickpoint Precision
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-300"
            >
              From Autonomous AI Agents to enterprise-grade web applications, we design and scale custom software built to outpace your competition.
            </motion.p>

            {/* Key Value Pillars */}
            <motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Custom AI & LLM Systems</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>High-Performance Backend</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Enterprise SOC2 Security</span>
              </div>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/contact"> 
                <Button size="lg" className="group shadow-lg shadow-violet-600/25 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
                  Start Your Project
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <a href="/case-studies">
                <Button variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3 rounded-xl">
                  Explore Case Studies
                </Button>
              </a>
            </motion.div>

            {/* Interactive Speed & Estimation Mini Widget */}
            <motion.div variants={itemVariants} className="mt-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0c0e22]/70 p-4 shadow-sm backdrop-blur-md max-w-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  Instant Development Estimator
                </span>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-100 dark:border-violet-800/50">
                  {estimatedWeeks} Weeks Average Delivery
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  onClick={() => { setProjectScope("mvp"); setEstimatedWeeks(3); }}
                  className={`py-2 px-3 rounded-lg border text-left transition-all ${
                    projectScope === "mvp"
                      ? "border-violet-600 bg-violet-50/80 text-violet-900 dark:border-violet-500 dark:bg-violet-950/80 dark:text-violet-300 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090b1c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <p className="font-bold">AI MVP / Prototype</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Fast 2-4 week launch</p>
                </button>
                <button
                  onClick={() => { setProjectScope("scale"); setEstimatedWeeks(8); }}
                  className={`py-2 px-3 rounded-lg border text-left transition-all ${
                    projectScope === "scale"
                      ? "border-violet-600 bg-violet-50/80 text-violet-900 dark:border-violet-500 dark:bg-violet-950/80 dark:text-violet-300 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090b1c] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <p className="font-bold">Full Enterprise Product</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Scalable Architecture</p>
                </button>
              </div>
            </motion.div>

            {/* Social Proof Rating */}
            <motion.div variants={itemVariants} className="mt-8 flex items-center gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#070814] bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">AK</div>
                <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#070814] bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">SR</div>
                <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#070814] bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">MP</div>
                <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#070814] bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold">+99</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-slate-800 dark:text-slate-200">4.9/5 Rating</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Engineered 50+ successful web & AI applications</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT COLUMN: INTERACTIVE TECH STUDIO DASHBOARD ================= */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative flex min-h-[480px] w-full items-center justify-center sm:min-h-[520px]">
              
              {/* Outer Dashed Rotating Radar Graph Ring */}
              <div ref={ringRef} className="absolute inset-0 rounded-full border border-dashed border-violet-300/40 dark:border-violet-700/40" />
              
              {/* Inner Glowing Orb */}
              <div ref={blobRef} className="absolute h-80 w-80 rounded-[45%_55%_60%_40%/45%_40%_60%_55%] bg-gradient-to-br from-violet-500/40 via-indigo-400/30 to-amber-400/40 dark:from-violet-600/30 dark:via-indigo-500/20 dark:to-amber-500/20 blur-xl opacity-80" />

              {/* Main Interactive Studio Dashboard */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 w-full rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0c0e22]/90 p-5 shadow-2xl shadow-violet-950/10 dark:shadow-black/70 backdrop-blur-xl"
              >
                {/* Header with Switchable Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/30">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">Clickpoint Tech Engine</h4>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Live Engine Sandbox
                      </p>
                    </div>
                  </div>

                  {/* Switcher Tabs */}
                  <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 p-1">
                    <button
                      onClick={() => setActiveTab("agent")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        activeTab === "agent"
                          ? "bg-white dark:bg-slate-700 text-violet-700 dark:text-violet-300 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <Sparkles className="h-3 w-3" /> AI Agent
                    </button>
                    <button
                      onClick={() => setActiveTab("web")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        activeTab === "web"
                          ? "bg-white dark:bg-slate-700 text-violet-700 dark:text-violet-300 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <Code2 className="h-3 w-3" /> Web API
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-3">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Response Latency</span>
                      <Activity className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <p className="font-display text-lg font-extrabold text-slate-900 dark:text-slate-100">&lt; 140ms</p>
                    <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" /> Optimized for speed
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-3">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Architecture</span>
                      <Cpu className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <p className="font-display text-lg font-extrabold text-slate-900 dark:text-slate-100">Cloud-Native</p>
                    <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-0.5">
                      <ShieldCheck className="h-3 w-3" /> Auto-scalable
                    </p>
                  </div>
                </div>

                {/* Live Code Viewer Window */}
                <div className="relative mt-3 rounded-xl bg-slate-950 p-3.5 text-xs text-slate-200 font-mono shadow-inner border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-2 font-sans border-b border-slate-800 pb-1.5">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Terminal className="h-3.5 w-3.5 text-violet-400" />
                      {activeTab === "agent" ? "agent-orchestrator.ts" : "api-route.ts"}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.pre
                      key={activeTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-x-auto text-[11px] leading-relaxed text-slate-300 font-mono"
                    >
                      <code>{CODE_SNIPPETS[activeTab]}</code>
                    </motion.pre>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Floating Badge Top-Right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-2 top-2 z-20 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#0c0e22]/95 px-3.5 py-2.5 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Time to MVP</p>
                    <p className="font-display text-xs font-bold text-slate-900 dark:text-slate-100">2-3 Weeks</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge Bottom-Left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-3 bottom-2 z-20 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#0c0e22]/95 px-3.5 py-2.5 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Deployment</p>
                    <p className="font-display text-xs font-bold text-slate-900 dark:text-slate-100">Zero Downtime CI/CD</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* Client Logos Infinite Scroll Marquee */}
        <div className="mt-16 border-t border-slate-200/80 dark:border-slate-800/80 pt-10">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Trusted by fast-growing startups & market innovators
          </p>
          
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16">
              {[...CLIENT_LOGOS_DATA, ...CLIENT_LOGOS_DATA].map((logo, i) => (
                <div key={`${logo.name}-${i}`} className="flex items-center gap-2 group cursor-pointer">
                  <span className="font-display text-lg font-bold text-slate-400 dark:text-slate-500 transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                    {logo.name}
                  </span>
                  <span className="rounded-full bg-violet-50 dark:bg-violet-950/80 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {logo.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}