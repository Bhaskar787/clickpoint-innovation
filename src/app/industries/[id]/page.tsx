import { notFound } from "next/navigation";
import Link from "next/link";
import { LiaIndustrySolid } from "react-icons/lia";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Wallet,
  HeartPulse,
  ShoppingBag,
  Layers,
  Truck,
  GraduationCap,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CtaSection from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { INDUSTRIES_DATA } from "@/data/landing-data";

interface IndustryPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return INDUSTRIES_DATA.map((industry) => ({
    id: industry.id,
  }));
}

export default function IndustryDetailPage({ params }: IndustryPageProps) {
  const industry = INDUSTRIES_DATA.find((i) => i.id === params.id);

  if (!industry) {
    notFound();
  }

  const IconComponent = industry.icon || Building2;

  return (
    <main className="relative overflow-x-hidden bg-background text-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -top-32 right-[-10%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-violet-400/30 via-indigo-300/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 left-[-10%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-ember-300/20 to-transparent blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-start gap-2 text-xs font-semibold text-ink/60 dark:text-slate-400">
            <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <Link href="/industries" className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
              Industries
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/40 dark:text-slate-600" />
            <span className="text-violet-600 dark:text-violet-300 font-bold">{industry.title}</span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-slate-800 bg-violet-50 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-300">
                <LiaIndustrySolid className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                <span>{industry.heroBadge}</span>
              </div>

              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl sm:leading-[1.12]">
                {industry.title}
              </h1>

              <p className="mt-4 font-display text-lg font-bold text-violet-600 dark:text-violet-300 sm:text-xl">
                {industry.subtitle}
              </p>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70 dark:text-slate-300 sm:text-lg">
                {industry.desc}
              </p>

              {/* Key Metrics */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-y border-violet-100 dark:border-slate-800 py-6">
                {industry.keyMetrics.map((metric, idx) => (
                  <div key={idx}>
                    <p className="font-display text-2xl font-extrabold text-ink dark:text-white sm:text-3xl">
                      <span className="text-violet-600 dark:text-violet-300">{metric.value}</span>
                    </p>
                    <p className="mt-1 text-xs font-medium text-ink/60 dark:text-slate-400">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" className="group shadow-lg shadow-violet-600/25 font-bold">
                  Book Industry Discovery Call
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link href="/industries">
                  <Button variant="outline" size="lg" className="border-violet-200 dark:border-slate-700 font-bold">
                    <ArrowLeft className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-300" />
                    All Industries
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Card */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative overflow-hidden rounded-2xl border border-violet-100/90 dark:border-slate-800 bg-white/90 dark:bg-[#131c31] p-8 shadow-2xl shadow-violet-950/10 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-violet-100 dark:border-slate-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700 shadow-md">
                      <IconComponent className="h-6 w-6 text-violet-600 dark:text-violet-300" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-ink dark:text-white">{industry.title}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Verified Domain Practice
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-violet-50 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-slate-700">
                    {industry.projects.length} Live Projects
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-gradient-to-br from-[#1b4397] via-[#153880] to-[#0e2764] p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                      <span className="text-xs font-bold text-violet-300">FEATURED LIVE PROJECT</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                        ACTIVE LIVE DEMO
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-white">
                      {industry.projects[0]?.title}
                    </h4>
                    <p className="mt-1 text-xs text-white/70">
                      {industry.projects[0]?.desc}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        {industry.projects[0]?.impact}
                      </span>
                      <a
                        href={industry.projects[0]?.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Live Project <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Narrative Overview */}
      <section className="py-16 bg-cloud-100/60 dark:bg-[#0f172a]/50 border-y border-violet-100/80 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#f58220]">
              Sector Perspective
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink dark:text-white">
              Architecting software for <span className="text-violet-600 dark:text-[#f58220]">{industry.title}</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75 dark:text-slate-300 sm:text-lg">
              {industry.fullOverview}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects & Case Studies Showcase Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f58220]">
              Live Case Studies
            </p>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
              Featured projects built for <span className="text-violet-600 dark:text-[#f58220]">{industry.title}</span>
            </h2>
            <p className="mt-2 text-base text-ink/65 dark:text-slate-300">
              Explore real-world software launches engineered and deployed by Clickpoint Innovation.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {industry.projects.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-8 shadow-md transition-all hover:border-violet-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-500/10"
              >
                {/* Project Visual Image Header */}
                <div className={`h-48 w-full rounded-2xl bg-gradient-to-r ${project.imageGradient} p-6 text-white relative flex flex-col justify-between overflow-hidden shadow-inner`}>
                  <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
                      {project.client}
                    </span>
                    <span className="rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 text-xs font-semibold backdrop-blur-md flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live in Prod
                    </span>
                  </div>

                  <div className="relative z-10">
                    <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                      Key Result
                    </p>
                    <p className="font-display text-2xl font-extrabold text-white">
                      {project.impact}
                    </p>
                  </div>
                </div>

                {/* Project Details */}
                <div className="mt-6">
                  <h3 className="font-display text-2xl font-bold text-ink dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-slate-300">
                    {project.desc}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-violet-100 dark:border-slate-800">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-violet-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Live Project Button */}
                <div className="mt-8 pt-4 border-t border-violet-100 dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-700 shadow-md shadow-violet-600/25 transition-all group/btn"
                  >
                    View Live Project
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />
                  </a>
                  <span className="text-xs text-ink/50 dark:text-slate-400 font-mono">
                    {project.liveUrl.replace("https://", "")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tailored Solutions Grid */}
      <section className="py-20 bg-cloud-100/70 dark:bg-[#0f172a]/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              Target Solutions
            </p>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white sm:text-4xl">
              Specialized engineering for <span className="text-violet-600 dark:text-[#f58220]">{industry.title}</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {industry.solutions.map((sol, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-[#131c31] p-6 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 font-bold text-xs mb-4 border border-violet-200 dark:border-slate-700">
                  0{idx + 1}
                </div>
                <h4 className="font-display text-lg font-bold text-ink dark:text-white">{sol.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-ink/65 dark:text-slate-300">{sol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
