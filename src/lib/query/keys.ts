/**
 * Query key factory
 * Centralized query keys for consistent caching and invalidation
 *
 * Usage:
 * - queryKeys.pages.all() -> ['pages']
 * - queryKeys.pages.bySlug('about') -> ['pages', 'slug', 'about']
 * - queryKeys.pages.byLocale('en') -> ['pages', 'locale', 'en']
 */

export const queryKeys = {
  /**
   * Content pages from Contentstack
   */
  pages: {
    all: () => ['pages'] as const,
    bySlug: (slug: string) => ['pages', 'slug', slug] as const,
    byLocale: (locale: string) => ['pages', 'locale', locale] as const,
    bySlugAndLocale: (slug: string, locale: string) =>
      ['pages', 'slug', slug, 'locale', locale] as const,
  },

  /**
   * Navigation data
   */
  navigation: {
    all: () => ['navigation'] as const,
    main: (locale?: string) => ['navigation', 'main', locale ?? 'default'] as const,
    footer: (locale?: string) => ['navigation', 'footer', locale ?? 'default'] as const,
  },

  /**
   * Global settings
   */
  settings: {
    all: () => ['settings'] as const,
    global: (locale?: string) => ['settings', 'global', locale ?? 'default'] as const,
  },

  /**
   * External API data
   * Add keys for your external APIs here
   */
  external: {
    all: () => ['external'] as const,

    // Example: Trading data
    trading: {
      all: () => ['external', 'trading'] as const,
      prices: (symbols?: string[]) => ['external', 'trading', 'prices', symbols] as const,
      markets: () => ['external', 'trading', 'markets'] as const,
    },

    // Example: User data
    user: {
      all: () => ['external', 'user'] as const,
      profile: (userId: string) => ['external', 'user', 'profile', userId] as const,
    },
  },
} as const;

export type QueryKeys = typeof queryKeys;
