import { getStack } from './client';
import { getContentstackLocale } from './config';
import type { PageComponent } from './components';

/**
 * Universal Page Types
 */

// Content type identifiers
export type ContentTypeUid =
  | 'home_page'
  | 'article'
  | 'article_listing_page'
  | 'landing_page';

/**
 * Options for fetching personalized content
 */
export interface PersonalizeOptions {
  /** Variant aliases to fetch (from Personalize SDK) */
  variantAliases?: string[];
}

// Base page fields
export interface BasePage {
  uid: string;
  _content_type_uid?: ContentTypeUid;
  title: string;
  url: string;
  locale?: string;
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string;
    no_index?: boolean;
    no_follow?: boolean;
  };
}

// Article page
export interface ArticlePage extends BasePage {
  _content_type_uid: 'article';
  summary?: string;
  content?: unknown; // JSON RTE
  cover_image?: {
    uid: string;
    url: string;
    title?: string;
  };
  related_articles?: {
    heading?: string;
    sub_heading?: string;
    number_of_articles?: number;
  };
  show_related_articles?: boolean;
  taxonomies?: Array<{
    taxonomy_uid: string;
    term_uid: string;
  }>;
}

// Article Listing page
export interface ArticleListingPage extends BasePage {
  _content_type_uid: 'article_listing_page';
  headline?: string;
  description?: string;
  featured_image?: {
    uid: string;
    url: string;
    title?: string;
  };
  taxonomy_filter?: Array<{
    taxonomy_uid: string;
    term_uid: string;
  }>;
}

// Landing page
export interface LandingPage extends BasePage {
  _content_type_uid: 'landing_page';
  hero?: Array<{
    uid: string;
    title?: string;
    heading?: string;
    content?: string;
    image?: Array<{
      image?: { url: string };
      image_alt_text?: string;
    }>;
  }>;
  components?: PageComponent[];
}

// Home page
export interface HomePage extends BasePage {
  _content_type_uid: 'home_page';
  hero?: Array<{
    uid: string;
    title: string;
    url?: string;
    summary?: string;
    cover_image?: { url: string };
  }>;
  components?: PageComponent[];
}

// Union type for all pages
export type PageEntry = ArticlePage | ArticleListingPage | LandingPage | HomePage;

// Page result with content type info
export interface PageResult {
  entry: PageEntry;
  contentType: ContentTypeUid;
}

/**
 * Content types that have URL field
 */
const ROUTABLE_CONTENT_TYPES: ContentTypeUid[] = [
  'home_page',
  'article',
  'article_listing_page',
  'landing_page',
];

/**
 * Get page by URL - searches all content types
 * Supports personalization variants
 */
export async function getPageByUrl(
  url: string,
  locale?: string,
  personalizeOptions?: PersonalizeOptions
): Promise<PageResult | null> {
  const stack = getStack();

  // Normalize URL - ensure it starts with /
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

  // Search each content type for matching URL
  for (const contentType of ROUTABLE_CONTENT_TYPES) {
    try {
      const query = stack.ContentType(contentType).Query();
      query.where('url', normalizedUrl);

      // Include common references based on content type
      if (contentType === 'home_page') {
        query.includeReference(['hero']);
      } else if (contentType === 'landing_page') {
        query.includeReference(['hero']);
      } else if (contentType === 'article') {
        query.includeReference(['related_articles']);
      }

      // Apply locale (skip for master locale)
      const csLocale = getContentstackLocale(locale);
      if (csLocale) {
        query.language(csLocale);
      }

      // Add variant aliases for personalization
      if (personalizeOptions?.variantAliases?.length) {
        query.addParam('include_variant', 'true');
        query.addParam('variant_alias', personalizeOptions.variantAliases.join(','));
      }

      const result = await query.toJSON().find();
      const entry = result?.[0]?.[0];

      if (entry) {
        return {
          entry: { ...entry, _content_type_uid: contentType } as PageEntry,
          contentType,
        };
      }
    } catch {
      // Continue to next content type
    }
  }

  return null;
}

/**
 * Get all articles (for article listing pages)
 */
export async function getArticles(
  locale?: string,
  options?: {
    limit?: number;
    skip?: number;
    taxonomyFilter?: { taxonomy_uid: string; term_uid: string }[];
  }
): Promise<{ articles: ArticlePage[]; total: number }> {
  try {
    const stack = getStack();
    const query = stack.ContentType('article').Query();
    
    query.limit(options?.limit || 12);
    
    if (options?.skip) {
      query.skip(options.skip);
    }
    
    // Apply taxonomy filter if provided
    if (options?.taxonomyFilter && options.taxonomyFilter.length > 0) {
      const filters = options.taxonomyFilter.map(f => ({
        'taxonomies.taxonomy_uid': f.taxonomy_uid,
        'taxonomies.term_uid': f.term_uid,
      }));
      query.query({ $or: filters });
    }
    
    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(locale);
    if (csLocale) {
      query.language(csLocale);
    }

    query.includeCount();
    
    const result = await query.toJSON().find();
    
    return {
      articles: (result?.[0] || []).map((a: ArticlePage) => ({
        ...a,
        _content_type_uid: 'article' as const,
      })),
      total: result?.[1] || 0,
    };
  } catch {
    return { articles: [], total: 0 };
  }
}

/**
 * Get related articles for an article
 */
export async function getRelatedArticles(
  articleUid: string,
  taxonomies: Array<{ taxonomy_uid: string; term_uid: string }>,
  limit = 4,
  locale?: string
): Promise<ArticlePage[]> {
  try {
    const stack = getStack();
    const query = stack.ContentType('article').Query();
    
    // Exclude current article
    query.notEqualTo('uid', articleUid);
    query.limit(limit);
    
    // Filter by same taxonomies
    if (taxonomies.length > 0) {
      const filters = taxonomies.map((t) => ({
        'taxonomies.taxonomy_uid': t.taxonomy_uid,
        'taxonomies.term_uid': t.term_uid,
      }));
      query.query({ $or: filters });
    }

    // Apply locale (skip for master locale)
    const csLocale = getContentstackLocale(locale);
    if (csLocale) {
      query.language(csLocale);
    }
    
    const result = await query.toJSON().find();
    
    return (result?.[0] || []).map((a: ArticlePage) => ({
      ...a,
      _content_type_uid: 'article' as const,
    }));
  } catch {
    return [];
  }
}

/**
 * Generate all static paths for all content types
 */
export async function getAllPagePaths(locale?: string): Promise<string[]> {
  const paths: string[] = [];
  const stack = getStack();

  // Apply locale (skip for master locale)
  const csLocale = getContentstackLocale(locale);

  for (const contentType of ROUTABLE_CONTENT_TYPES) {
    try {
      const query = stack.ContentType(contentType).Query();
      query.only(['url']);

      if (csLocale) {
        query.language(csLocale);
      }

      const result = await query.toJSON().find();
      const entries = result?.[0] || [];

      entries.forEach((entry: { url?: string }) => {
        if (entry.url && entry.url !== '/') {
          paths.push(entry.url);
        }
      });
    } catch {
      // Continue to next content type
    }
  }

  return paths;
}
