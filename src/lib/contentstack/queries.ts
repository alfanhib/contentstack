import { getStack } from './client';
import { getContentstackLocale } from './config';

/**
 * Contentstack query builders
 * These are reusable functions to fetch content from Contentstack
 *
 * Note: Content type UIDs will be added when CMS schema is ready
 */

/**
 * Generic entry fetcher
 */
export async function getEntryByUid<T>(
  contentTypeUid: string,
  entryUid: string,
  locale?: string
): Promise<T | null> {
  try {
    const stack = getStack();
    const entry = stack.ContentType(contentTypeUid).Entry(entryUid);

    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(locale);
    if (csLocale) {
      entry.language(csLocale);
    }

    const result = await entry.toJSON().fetch();
    return result as T;
  } catch {
    return null;
  }
}

/**
 * Fetch entries by content type with optional filters
 */
export async function getEntries<T>(
  contentTypeUid: string,
  options?: {
    locale?: string;
    limit?: number;
    skip?: number;
    where?: Record<string, string | number | boolean>;
    includeReferences?: string[];
    orderBy?: { field: string; direction: 'asc' | 'desc' };
  }
): Promise<T[]> {
  try {
    const stack = getStack();
    const query = stack.ContentType(contentTypeUid).Query();

    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(options?.locale);
    if (csLocale) {
      query.language(csLocale);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.skip) {
      query.skip(options.skip);
    }

    if (options?.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        query.where(key, value);
      });
    }

    if (options?.includeReferences) {
      options.includeReferences.forEach((ref) => {
        query.includeReference(ref);
      });
    }

    if (options?.orderBy) {
      if (options.orderBy.direction === 'asc') {
        query.ascending(options.orderBy.field);
      } else {
        query.descending(options.orderBy.field);
      }
    }

    const result = await query.toJSON().find();
    // Contentstack returns [[entries], count]
    return (result?.[0] as T[]) ?? [];
  } catch {
    return [];
  }
}

/**
 * Fetch single entry by field value
 */
export async function getEntryByField<T>(
  contentTypeUid: string,
  field: string,
  value: string | number,
  locale?: string
): Promise<T | null> {
  try {
    const stack = getStack();
    const query = stack.ContentType(contentTypeUid).Query();

    query.where(field, value);
    query.limit(1);

    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(locale);
    if (csLocale) {
      query.language(csLocale);
    }

    const result = await query.toJSON().find();
    // Contentstack returns [[entries], count]
    return (result?.[0]?.[0] as T) ?? null;
  } catch {
    return null;
  }
}

/**
 * Page-specific queries - to be implemented when CMS schema is ready
 */
export const pageQueries = {
  /**
   * Get page by URL/slug
   */
  getBySlug: async <T>(slug: string, locale?: string): Promise<T | null> => {
    // Content type UID to be defined when CMS schema is ready
    const CONTENT_TYPE = 'page';
    return getEntryByField<T>(CONTENT_TYPE, 'url', slug, locale);
  },

  /**
   * Get all pages (for static generation)
   */
  getAll: async <T>(locale?: string): Promise<T[]> => {
    const CONTENT_TYPE = 'page';
    return getEntries<T>(CONTENT_TYPE, { locale, limit: 100 });
  },
};

/**
 * Navigation queries
 */
export const navigationQueries = {
  /**
   * Get main navigation
   */
  getMain: async <T>(locale?: string): Promise<T | null> => {
    const CONTENT_TYPE = 'navigation';
    return getEntryByField<T>(CONTENT_TYPE, 'identifier', 'main-navigation', locale);
  },

  /**
   * Get footer navigation
   */
  getFooter: async <T>(locale?: string): Promise<T | null> => {
    const CONTENT_TYPE = 'navigation';
    return getEntryByField<T>(CONTENT_TYPE, 'identifier', 'footer-navigation', locale);
  },
};

/**
 * Global settings queries
 */
export const globalQueries = {
  /**
   * Get site settings
   */
  getSettings: async <T>(locale?: string): Promise<T | null> => {
    const CONTENT_TYPE = 'site_settings';
    return getEntryByField<T>(CONTENT_TYPE, 'identifier', 'global', locale);
  },
};
