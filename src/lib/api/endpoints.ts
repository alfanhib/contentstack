/**
 * API Endpoints configuration
 * Centralized endpoint definitions for external APIs
 */

/**
 * Base URLs for different environments
 */
export const apiBaseUrls = {
  production: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.pepperstone.com',
  staging: process.env.NEXT_PUBLIC_API_STAGING_URL || 'https://api.staging.pepperstone.com',
  development: process.env.NEXT_PUBLIC_API_DEV_URL || 'http://localhost:3001',
} as const;

/**
 * Get base URL for current environment
 */
export function getApiBaseUrl(): string {
  const env = process.env.NODE_ENV;

  if (env === 'production') {
    return apiBaseUrls.production;
  }

  if (env === 'development') {
    return apiBaseUrls.development;
  }

  return apiBaseUrls.staging;
}

/**
 * API endpoint paths
 * Add your API endpoints here
 */
export const endpoints = {
  /**
   * Trading endpoints
   */
  trading: {
    prices: '/v1/trading/prices',
    markets: '/v1/trading/markets',
    instruments: '/v1/trading/instruments',
  },

  /**
   * User endpoints
   */
  user: {
    profile: '/v1/user/profile',
    preferences: '/v1/user/preferences',
  },

  /**
   * Content endpoints (if any external content API)
   */
  content: {
    pages: '/v1/content/pages',
    navigation: '/v1/content/navigation',
  },
} as const;

export type Endpoints = typeof endpoints;
