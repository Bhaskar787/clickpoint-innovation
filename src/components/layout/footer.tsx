import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { SERVICES_DATA, INDUSTRIES_DATA, COMPANY_DATA } from "@/data/landing-data";
import Image from "next/image";

export default function Footer() {
  const columns = [
    {
      title: "Company",
      links: COMPANY_DATA.map((c) => ({ label: c.title, href: c.href })),
    },
    {
      title: "Services",
      links: SERVICES_DATA.map((s) => ({ label: s.title, href: `/services/${s.id}` })),
    },
    {
      title: "Industries",
      links: INDUSTRIES_DATA.map((i) => ({ label: i.title, href: `/industries/${i.id}` })),
    },
  ];

  return (
    <footer className="relative border-t border-violet-100 bg-white pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 pb-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <a href="#" className="flex items-center group">
              <Image
                src="/images/clickpointfinal.png"
                alt="Click Point Innovations"
                width={1236}
                height={317}
                priority
                className="h-9 w-auto group-hover:scale-105 transition-transform"
              />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
              An AI-first digital partner helping ambitious teams design,
              build, and scale software that compounds.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-100 dark:border-slate-800 text-ink/60 dark:text-slate-400 transition-colors hover:border-violet-300 dark:hover:border-slate-700 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink/40 dark:text-slate-400">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-ink/65 dark:text-slate-300 transition-colors hover:text-violet-700 dark:hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-violet-100 dark:border-slate-800 py-6 sm:flex-row">
          <p className="text-xs text-ink/50 dark:text-slate-400">
            © {new Date().getFullYear()} Clickpoint Innovation Technologies. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-ink/50 dark:text-slate-400">
            <a href="#" className="hover:text-violet-700 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-violet-700 dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
