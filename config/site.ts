/**
 * Site-wide configuration and metadata
 */
export const siteConfig = {
  name: 'Pepperstone',
  description: 'Trade forex, commodities, indices and more with Pepperstone',
  url: 'https://www.pepperstone.com',

  /**
   * Default SEO metadata
   */
  seo: {
    titleTemplate: '%s | Pepperstone',
    defaultTitle: 'Pepperstone - Online Forex Trading',
    defaultDescription:
      'Trade forex, commodities, indices, and cryptocurrencies with competitive spreads and fast execution.',
  },

  /**
   * Social links
   */
  social: {
    twitter: 'https://twitter.com/pepaborstone',
    facebook: 'https://facebook.com/pepperstone',
    linkedin: 'https://linkedin.com/company/pepperstone',
    instagram: 'https://instagram.com/pepperstone',
  },

  /**
   * Contact information
   */
  contact: {
    email: 'support@pepperstone.com',
    phone: '',
  },
} as const;

export type SiteConfig = typeof siteConfig;
