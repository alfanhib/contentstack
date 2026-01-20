import { getStack } from './client';
import { getContentstackLocale } from './config';
import type { PageComponent } from './components';

/**
 * Homepage specific content fetching
 */

/**
 * Options for fetching personalized content
 */
export interface PersonalizeOptions {
  /** Variant aliases to fetch (from Personalize SDK) */
  variantAliases?: string[];
}

export interface HeroBanner {
  uid: string;
  title: string;
  heading?: string;
  content?: string;
  image?: Array<{
    image?: {
      url: string;
      title?: string;
    };
    image_alt_text?: string;
  }>;
  cta?: Array<{
    text?: string;
    link?: string;
  }>;
  styles?: {
    text_align?: string;
  };
}

export interface Article {
  uid: string;
  title: string;
  url?: string;
  summary?: string;
  cover_image?: {
    url: string;
    title?: string;
  };
  // content is JSON RTE - don't render directly
  content?: unknown;
}

export interface FeaturedArticles {
  headline?: string;
  sub_headline?: string;
  articles?: Article[];
}

export interface HomePage {
  uid: string;
  title: string;
  url: string;
  // Hero can be Article or HeroBanner reference
  hero?: Article[];
  featured_articles?: FeaturedArticles;
  // Dynamic components from modular blocks
  components?: PageComponent[];
}

export interface Navigation {
  uid: string;
  title: string;
  items?: Array<{
    label?: string;
    url?: string;
    mega_menu?: Array<{
      title: string;
      sections?: Array<{
        headline?: string;
        links?: Array<{
          label?: string;
          url?: string;
        }>;
      }>;
    }>;
  }>;
}

/**
 * Get homepage content
 * Supports personalization variants
 */
export async function getHomePage(
  locale?: string,
  personalizeOptions?: PersonalizeOptions
): Promise<HomePage | null> {
  try {
    const stack = getStack();
    const query = stack.ContentType('home_page').Query();

    query.where('url', '/');
    query.includeReference(['hero', 'featured_articles.articles']);

    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(locale);
    if (csLocale) {
      query.language(csLocale);
    }

    // Add variant aliases for personalization
    // Format: cs_personalize_{experienceUid}_{variantUid}
    if (personalizeOptions?.variantAliases?.length) {
      // Try using the variants() method if available
      if (typeof query.variants === 'function') {
        query.variants(personalizeOptions.variantAliases);
      } else {
        // Fallback to addParam
        query.addParam('include_variant', 'true');
        query.addParam('variant_alias', personalizeOptions.variantAliases.join(','));
      }
    }

    const result = await query.toJSON().find();
    const entry = result?.[0]?.[0];
    
    return entry || null;
  } catch {
    return null;
  }
}

/**
 * Get all articles
 */
export async function getArticles(locale?: string, limit = 10): Promise<Article[]> {
  try {
    const stack = getStack();
    const query = stack.ContentType('article').Query();

    query.limit(limit);

    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(locale);
    if (csLocale) {
      query.language(csLocale);
    }

    const result = await query.toJSON().find();
    return result?.[0] || [];
  } catch {
    return [];
  }
}

/**
 * Get navigation
 */
export async function getNavigation(locale?: string): Promise<Navigation | null> {
  try {
    const stack = getStack();
    const query = stack.ContentType('navigation').Query();

    query.where('title', 'Top Menu');
    query.limit(1);

    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(locale);
    if (csLocale) {
      query.language(csLocale);
    }

    const result = await query.toJSON().find();
    return result?.[0]?.[0] || null;
  } catch {
    return null;
  }
}

/**
 * Get hero banners
 */
export async function getHeroBanners(locale?: string): Promise<HeroBanner[]> {
  try {
    const stack = getStack();
    const query = stack.ContentType('hero_banner').Query();

    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(locale);
    if (csLocale) {
      query.language(csLocale);
    }

    const result = await query.toJSON().find();
    return result?.[0] || [];
  } catch {
    return [];
  }
}
