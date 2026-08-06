"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { DEFAULT_LANDING_DATA, DEFAULT_FOOTER_DATA } from "@/data/default-landing-data";

interface FooterProps {
  initialData?: any;
}

export default function Footer({ initialData }: FooterProps = {}) {
  const [footerData, setFooterData] = useState<any>(
    initialData || DEFAULT_LANDING_DATA.footerData || DEFAULT_FOOTER_DATA
  );

  useEffect(() => {
    if (!initialData) {
      async function loadDynamicFooter() {
        try {
          const res = await fetch("/api/landing");
          const json = await res.json();
          if (json.success && json.data && (json.data.footer || json.data.footerData)) {
            const data = json.data.footer || json.data.footerData;
            setFooterData({ ...DEFAULT_FOOTER_DATA, ...data });
          }
        } catch (err) {
          console.warn("Using fallback footer data:", err);
        }
      }
      loadDynamicFooter();
    }
  }, [initialData]);

  const socialIcons = [
    { icon: Linkedin, href: footerData.socialLinks?.linkedin || "#" },
    { icon: Twitter, href: footerData.socialLinks?.twitter || "#" },
    { icon: Instagram, href: footerData.socialLinks?.instagram || "#" },
    { icon: Youtube, href: footerData.socialLinks?.youtube || "#" },
  ];

  const columns = Array.isArray(footerData.columns) && footerData.columns.length > 0
    ? footerData.columns
    : DEFAULT_FOOTER_DATA.columns;

  const copyrightText = footerData.copyrightText || `© ${new Date().getFullYear()} Clickpoint Innovation Technologies. All rights reserved.`;

  const bottomLinks = Array.isArray(footerData.bottomLinks) && footerData.bottomLinks.length > 0
    ? footerData.bottomLinks
    : DEFAULT_FOOTER_DATA.bottomLinks;

  return (
    <footer className="relative border-t border-violet-100 dark:border-slate-800 bg-white dark:bg-[#0b0f19] pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 pb-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="flex items-center group">
              {footerData.logoUrl ? (
                <Image
                  src={footerData.logoUrl}
                  alt={footerData.logoText || "Clickpoint Innovations"}
                  width={1236}
                  height={317}
                  priority
                  unoptimized
                  className="h-9 w-auto group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                  {footerData.logoText || "Clickpoint Innovations"}
                </span>
              )}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60 dark:text-slate-300 font-medium">
              {footerData.description || "An AI-first digital partner helping ambitious teams design, build, and scale software that compounds."}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialIcons.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-100 dark:border-slate-800 text-ink/60 dark:text-slate-400 transition-colors hover:border-violet-300 dark:hover:border-slate-700 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-700 dark:hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col: any, idx: number) => (
              <div key={col.title || idx}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                    <li key={link.label || lIdx}>
                      <Link
                        href={link.href || "#"}
                        className="text-sm text-ink/65 dark:text-slate-300 transition-colors hover:text-violet-700 dark:hover:text-white font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-violet-100 dark:border-slate-800 py-6 sm:flex-row">
          <p className="text-xs text-ink/50 dark:text-slate-400">
            {copyrightText}
          </p>
          <div className="flex gap-6 text-xs text-ink/50 dark:text-slate-400">
            {bottomLinks.map((link: any, idx: number) => (
              <Link key={idx} href={link.href || "#"} className="hover:text-violet-700 dark:hover:text-white transition-colors font-medium">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
