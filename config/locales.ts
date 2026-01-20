/**
 * Supported locales configuration
 * Matches Contentstack stack locales
 */
export const locales = ['en', 'fr', 'de', 'es', 'id'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Locale display names for UI
 */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  id: 'Indonesia',
};

/**
 * Native locale names (for language selector display)
 */
export const localeNativeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  id: 'Bahasa Indonesia',
};

/**
 * RTL locales
 */
export const rtlLocales: Locale[] = [];

/**
 * Check if a locale is RTL
 */
export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
