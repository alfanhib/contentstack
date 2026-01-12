import Stack from '@/lib/contentstack';

// Types for Contentstack data
export interface ContentstackImage {
  uid: string;
  url: string;
  title: string;
  filename: string;
}

export interface ModularBlock {
  block?: {
    title: string;
    copy: string;
    image: ContentstackImage;
    layout: 'image_left' | 'image_right';
    _metadata: { uid: string };
  };
  [key: string]: unknown;
}

export interface PageEntry {
  uid: string;
  title: string;
  description?: string;
  url?: string;
  image?: ContentstackImage;
  rich_text?: string;
  blocks?: ModularBlock[];
  [key: string]: unknown;
}

export interface ArticleEntry {
  uid: string;
  title: string;
  headline?: string;
  sub_headline?: string;
  summary?: string;
  url?: string;
  cover_image?: ContentstackImage;
  featured_image?: ContentstackImage;
  image?: ContentstackImage;
  content?: string;
  body?: string;
  [key: string]: unknown;
}

// Content type UIDs - update these to match your Contentstack
const CONTENT_TYPES = {
  LANDING_PAGE: 'landing_page',
  HOME_PAGE: 'home_page',
  WEB_CONFIG: 'web_configuration',
  CTA_GROUP: 'cta_group',
  ARTICLE: 'article',
};

// Fetch home page data with references
export async function getPageData(): Promise<PageEntry | null> {
  try {
    // Try home_page first with references included
    const query = Stack.ContentType(CONTENT_TYPES.HOME_PAGE).Query();
    // Include deep references for CTAs in components
    query.includeReference([
      'hero',
      'featured_articles.articles',
      'components.card_collection.cards.cta.link',
      'components.teaser.cta.link',
      'components.text_and_image_carousel.carousel_items.cta.link'
    ]);
    const entries = await query.toJSON().find();
    if (entries[0]?.length > 0) {
      return entries[0][0];
    }
    
    // Fallback to landing_page with url='/'
    const landingQuery = Stack.ContentType(CONTENT_TYPES.LANDING_PAGE).Query();
    landingQuery.where('url', '/');
    landingQuery.includeReference([
      'hero', 
      'components',
      'components.card_collection.cards.cta.link',
      'components.teaser.cta.link'
    ]);
    const landingEntries = await landingQuery.toJSON().find();
    return landingEntries[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

// Fetch all landing pages
export async function getAllPages(): Promise<PageEntry[]> {
  try {
    const query = Stack.ContentType(CONTENT_TYPES.LANDING_PAGE).Query();
    const entries = await query.toJSON().find();
    return entries[0] || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

// Fetch page by URL (supports both landing pages and articles)
export async function getPageByUrl(url: string): Promise<PageEntry | null> {
  try {
    // Try landing page first
    const query = Stack.ContentType(CONTENT_TYPES.LANDING_PAGE).Query();
    query.where('url', url);
    const entries = await query.toJSON().find();
    if (entries[0]?.[0]) {
      return entries[0][0];
    }
    
    // Try article
    const articleQuery = Stack.ContentType(CONTENT_TYPES.ARTICLE).Query();
    articleQuery.where('url', url);
    const articleEntries = await articleQuery.toJSON().find();
    return articleEntries[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching page by URL:', error);
    return null;
  }
}

// Fetch article by URL or slug
export async function getArticleByUrl(url: string): Promise<ArticleEntry | null> {
  try {
    const query = Stack.ContentType(CONTENT_TYPES.ARTICLE).Query();
    query.where('url', url);
    const entries = await query.toJSON().find();
    return entries[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching article by URL:', error);
    return null;
  }
}

// Fetch all articles
export async function getAllArticles(): Promise<ArticleEntry[]> {
  try {
    const query = Stack.ContentType(CONTENT_TYPES.ARTICLE).Query();
    const entries = await query.toJSON().find();
    return entries[0] || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Get all article URLs for static generation  
export async function getAllArticleUrls(): Promise<string[]> {
  try {
    const articles = await getAllArticles();
    return articles
      .map(article => article.url)
      .filter((url): url is string => typeof url === 'string');
  } catch (error) {
    console.error('Error fetching article URLs:', error);
    return [];
  }
}

// Get all page URLs for static generation
export async function getAllPageUrls(): Promise<string[]> {
  try {
    const pages = await getAllPages();
    return pages
      .map(page => page.url)
      .filter((url): url is string => typeof url === 'string' && url !== '/');
  } catch (error) {
    console.error('Error fetching page URLs:', error);
    return [];
  }
}

// Fetch web configuration
export async function getWebConfig(): Promise<PageEntry | null> {
  try {
    const query = Stack.ContentType(CONTENT_TYPES.WEB_CONFIG).Query();
    const entries = await query.toJSON().find();
    return entries[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching web config:', error);
    return null;
  }
}

// Fetch CTA groups
export async function getCTAGroups(): Promise<PageEntry[]> {
  try {
    const query = Stack.ContentType(CONTENT_TYPES.CTA_GROUP).Query();
    const entries = await query.toJSON().find();
    return entries[0] || [];
  } catch (error) {
    console.error('Error fetching CTA groups:', error);
    return [];
  }
}

// Debug: List all content types' data
export async function debugFetchAll() {
  const results: Record<string, unknown> = {};
  
  for (const [name, uid] of Object.entries(CONTENT_TYPES)) {
    try {
      const query = Stack.ContentType(uid).Query();
      const entries = await query.toJSON().find();
      results[name] = {
        uid,
        count: entries[0]?.length || 0,
        entries: entries[0] || [],
      };
    } catch (error) {
      results[name] = { uid, error: String(error) };
    }
  }
  
  return results;
}
