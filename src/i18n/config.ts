import { locales, defaultLocale, type Locale } from '@config/locales';

/**
 * i18n configuration
 */
export const i18nConfig = {
  locales,
  defaultLocale,
} as const;

/**
 * Dictionary type - will be extended when adding translations
 */
export interface Dictionary {
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    menu: string;
    search: string;
  };
  navigation: {
    home: string;
    about: string;
    contact: string;
    login: string;
    signup: string;
  };
  footer: {
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
  };
}

/**
 * Get dictionary for a locale
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const dictionary = await import(`./dictionaries/${locale}.json`);
    return dictionary.default;
  } catch {
    // Fallback to default locale
    const dictionary = await import(`./dictionaries/${defaultLocale}.json`);
    return dictionary.default;
  }
}

export { locales, defaultLocale };
export type { Locale };
