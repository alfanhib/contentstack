'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { WebConfig, MegaMenu } from '@/lib/contentstack';
import { locales, localeNames, type Locale } from '@config/locales';

interface HeaderProps {
  webConfig?: WebConfig | null;
  megaMenus?: MegaMenu[];
  locale: string;
}

export function Header({ webConfig, megaMenus = [], locale }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const logo = webConfig?.logo;
  const navigation = webConfig?.main_navigation?.[0];
  const navItems = navigation?.items || [];

  // Get mega menu data by uid
  const getMegaMenuData = (uid: string): MegaMenu | undefined => {
    return megaMenus.find(menu => menu.uid === uid);
  };

  // Helper to add locale prefix to internal URLs
  const localizeUrl = (url?: string): string => {
    if (!url) return '#';
    return url.startsWith('/') ? `/${locale}${url}` : url;
  };

  // Get current locale display name
  const currentLocaleName = localeNames[locale as Locale] || locale.toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            {logo?.url ? (
              <Image
                src={logo.url}
                alt="Logo"
                width={140}
                height={40}
                className="h-10 w-auto"
                priority
              />
            ) : (
              <span className="text-xl font-bold text-emerald-600">Compass</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => {
              const megaMenuRef = item.mega_menu?.[0];
              const hasMegaMenu = !!megaMenuRef;
              const megaMenuData = megaMenuRef ? getMegaMenuData(megaMenuRef.uid) : undefined;
              const directLink = item.link?.[0];

              return (
                <div
                  key={item._metadata?.uid || item.text}
                  className="relative"
                  onMouseEnter={() => hasMegaMenu && setActiveMenu(item.text)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {hasMegaMenu ? (
                    <button
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition rounded-lg ${
                        activeMenu === item.text
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.text}
                      <svg
                        className={`w-4 h-4 transition-transform ${activeMenu === item.text ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={localizeUrl(directLink?.url) || `/${locale}/articles`}
                      className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition"
                    >
                      {item.text}
                    </Link>
                  )}

                  {/* Mega Menu Dropdown */}
                  {hasMegaMenu && activeMenu === item.text && megaMenuData && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 min-w-[400px]">
                        <div className="grid grid-cols-2 gap-4">
                          {megaMenuData.sections?.[0]?.links?.map((link) => (
                            <Link
                              key={link._metadata?.uid || link.text}
                              href={localizeUrl(link.link?.[0]?.url)}
                              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition"
                            >
                              {link.thumbnail?.url && (
                                <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={link.thumbnail.url}
                                    alt={link.text}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-slate-900 group-hover:text-emerald-600 transition">
                                  {link.text}
                                </span>
                                {link.link_text && (
                                  <p className="text-xs text-slate-500">{link.link_text}</p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div 
              className="relative hidden sm:block"
              onMouseEnter={() => setLangMenuOpen(true)}
              onMouseLeave={() => setLangMenuOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {currentLocaleName}
                <svg
                  className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown */}
              {langMenuOpen && (
                <div className="absolute top-full right-0 pt-1">
                  <div className="bg-white rounded-lg shadow-lg border border-slate-100 py-1 min-w-[140px]">
                    {locales.map((loc) => (
                      <Link
                        key={loc}
                        href={`/${loc}`}
                        className={`block px-4 py-2 text-sm transition ${
                          loc === locale
                            ? 'text-emerald-600 bg-emerald-50 font-medium'
                            : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                        }`}
                      >
                        {localeNames[loc]}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4">
            {navItems.map((item) => {
              const megaMenuRef = item.mega_menu?.[0];
              const megaMenuData = megaMenuRef ? getMegaMenuData(megaMenuRef.uid) : undefined;
              const directLink = item.link?.[0];

              return (
                <div key={item._metadata?.uid || item.text}>
                  {megaMenuData ? (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold text-slate-900">
                        {item.text}
                      </div>
                      <div className="pl-4">
                        {megaMenuData.sections?.[0]?.links?.map((link) => (
                          <Link
                            key={link._metadata?.uid || link.text}
                            href={localizeUrl(link.link?.[0]?.url)}
                            className="block px-4 py-2 text-sm text-slate-600 hover:text-emerald-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.text}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={localizeUrl(directLink?.url) || `/${locale}/articles`}
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.text}
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Mobile Language Selector */}
            <div className="border-t border-slate-100 mt-4 pt-4 px-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Language
              </p>
              <div className="flex flex-wrap gap-2">
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={`/${loc}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition ${
                      loc === locale
                        ? 'bg-emerald-500 text-white font-medium'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {localeNames[loc]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
