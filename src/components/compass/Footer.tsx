'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { WebConfig } from '@/lib/contentstack';

interface FooterProps {
  webConfig?: WebConfig | null;
  locale: string;
}

export function Footer({ webConfig, locale }: FooterProps) {
  const logo = webConfig?.logo;
  const footerMenu = webConfig?.footer_navigation?.[0];
  const sections = footerMenu?.sections || [];

  // Separate main sections from legal section
  const mainSections = sections.filter(s => s.title !== 'Legal');
  const legalSection = sections.find(s => s.title === 'Legal');

  // Helper to add locale prefix to internal URLs
  const localizeUrl = (url?: string, isExternal?: boolean): string => {
    if (!url) return '#';
    if (isExternal) return url;
    return url.startsWith('/') ? `/${locale}${url}` : url;
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo Column */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block">
              {logo?.url ? (
                <Image
                  src={logo.url}
                  alt="Logo"
                  width={120}
                  height={35}
                  className="h-8 w-auto brightness-0 invert"
                />
              ) : (
                <span className="text-xl font-bold text-emerald-400">Compass</span>
              )}
            </Link>
          </div>

          {/* Navigation Sections */}
          {mainSections.map((section) => (
            <div key={section._metadata?.uid || section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links?.map((link) => {
                  const isExternal = !!link.external_link;
                  const href = localizeUrl(link.external_link || link.link?.[0]?.url, isExternal);

                  return (
                    <li key={link._metadata?.uid || link.text}>
                      <Link
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="text-sm text-slate-400 hover:text-emerald-400 transition"
                      >
                        {link.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Built with text */}
            <div className="text-sm text-slate-400">
              Built with{' '}
              <a
                href="https://www.contentstack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition"
              >
                Contentstack
              </a>
            </div>

            {/* Legal Links */}
            {legalSection && (
              <div className="flex items-center gap-4">
                {legalSection.links?.map((link) => {
                  const isExternal = !!link.external_link;
                  const href = localizeUrl(link.external_link || link.link?.[0]?.url, isExternal);

                  return (
                    <Link
                      key={link._metadata?.uid || link.text}
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition"
                    >
                      {link.text}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="mt-4 text-center sm:text-left">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Contentstack Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
