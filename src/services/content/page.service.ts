import { pageQueries } from '@/lib/contentstack';
import type { Page } from '@/types/contentstack';

/**
 * Page content service
 * Handles fetching page content from Contentstack
 */
export const pageService = {
  /**
   * Get a page by its URL slug
   */
  async getBySlug(slug: string, locale?: string): Promise<Page | null> {
    return pageQueries.getBySlug<Page>(slug, locale);
  },

  /**
   * Get all pages for a specific locale
   * Used for static generation
   */
  async getAll(locale?: string): Promise<Page[]> {
    return pageQueries.getAll<Page>(locale);
  },

  /**
   * Get all page slugs for all locales
   * Used for generateStaticParams
   */
  async getAllSlugs(locales: string[]): Promise<Array<{ slug: string; locale: string }>> {
    const results: Array<{ slug: string; locale: string }> = [];

    for (const locale of locales) {
      const pages = await this.getAll(locale);

      pages.forEach((page) => {
        results.push({
          slug: page.url.replace(/^\/+|\/+$/g, ''), // Remove leading/trailing slashes
          locale,
        });
      });
    }

    return results;
  },
};
