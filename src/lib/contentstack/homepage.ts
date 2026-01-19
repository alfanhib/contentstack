import { getStack } from './client';
import type { PageComponent } from './components';

/**
 * Homepage specific content fetching
 */

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
 */
export async function getHomePage(locale?: string): Promise<HomePage | null> {
  try {
    const stack = getStack();
    const query = stack.ContentType('home_page').Query();
    
    query.where('url', '/');
    query.includeReference(['hero', 'featured_articles.articles']);
    
    if (locale) {
      query.language(locale);
    }

    const result = await query.toJSON().find();
    return result?.[0]?.[0] || null;
  } catch (error) {
    console.error('[Contentstack] Failed to fetch homepage:', error);
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
    
    if (locale) {
      query.language(locale);
    }

    const result = await query.toJSON().find();
    return result?.[0] || [];
  } catch (error) {
    console.error('[Contentstack] Failed to fetch articles:', error);
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
    
    if (locale) {
      query.language(locale);
    }

    const result = await query.toJSON().find();
    return result?.[0]?.[0] || null;
  } catch (error) {
    console.error('[Contentstack] Failed to fetch navigation:', error);
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
    
    if (locale) {
      query.language(locale);
    }

    const result = await query.toJSON().find();
    return result?.[0] || [];
  } catch (error) {
    console.error('[Contentstack] Failed to fetch hero banners:', error);
    return [];
  }
}
