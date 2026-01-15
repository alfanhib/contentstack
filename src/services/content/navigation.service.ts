import { navigationQueries } from '@/lib/contentstack';
import type { Navigation } from '@/types/contentstack';

/**
 * Navigation content service
 * Handles fetching navigation data from Contentstack
 */
export const navigationService = {
  /**
   * Get main navigation
   */
  async getMain(locale?: string): Promise<Navigation | null> {
    return navigationQueries.getMain<Navigation>(locale);
  },

  /**
   * Get footer navigation
   */
  async getFooter(locale?: string): Promise<Navigation | null> {
    return navigationQueries.getFooter<Navigation>(locale);
  },
};
