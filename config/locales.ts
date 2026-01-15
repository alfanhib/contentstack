/**
 * Supported locales configuration
 * Add new locales here when expanding to new regions
 */
export const locales = ['en', 'id', 'th', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Locale display names for UI
 */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  id: 'Indonesia',
  th: 'ไทย',
  ar: 'العربية',
};

/**
 * RTL locales
 */
export const rtlLocales: Locale[] = ['ar'];

/**
 * Check if a locale is RTL
 */
export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
