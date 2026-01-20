/**
 * Contentstack Personalize utilities
 *
 * This module provides utilities for working with
 * personalization variants resolved by the Launch Edge Proxy.
 *
 * With Launch Edge Proxy:
 * - Variants are passed via URL query parameter `personalize_variants`
 * - Pages should read from searchParams and use getVariantAliasesFromSearchParams()
 *
 * For local development (without Edge Proxy):
 * - Cookies are used as fallback
 * - Use getVariantAliases() which reads from cookies
 */

// Client-side
export { usePersonalize, PersonalizeProvider } from './provider';
export { getVariantsFromCookies, PERSONALIZE_COOKIE_NAME, parseVariantParam } from './utils';
export type { PersonalizeContextValue, VariantInfo } from './types';

// Server-side (new - for Launch Edge Proxy)
export {
  getVariantsFromSearchParams,
  getVariantAliasesFromSearchParams,
} from './server';

// Server-side (legacy - cookies-based, for local dev or non-Launch deployments)
export {
  getServerVariants,
  getVariantParam,
  getVariantAliases,
  hasServerVariant,
  getServerVariant,
} from './server';

// Debug utilities
export { getPersonalizeDebugInfo, getDebugInfoFromSearchParams } from './debug';
