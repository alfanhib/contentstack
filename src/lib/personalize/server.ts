import { cookies, headers } from 'next/headers';
import Personalize from '@contentstack/personalize-edge-sdk';
import { parseVariantParam, PERSONALIZE_COOKIE_NAME } from './utils';

/**
 * Server-side utilities for personalization
 * Use these in Server Components and Route Handlers
 *
 * With Launch Edge Proxy, variants are passed via URL query parameter `personalize_variants`.
 * For local development or non-Launch deployments, cookies are used as fallback.
 */

// Manifest cookie name from Contentstack SDK
const MANIFEST_COOKIE_NAME = 'cs-personalize-manifest';

interface PersonalizeManifest {
  activeVariants: Record<string, string | null>;
  experiences: Array<{
    shortUid: string;
    activeVariantShortUid: string | null;
  }>;
}

/**
 * Get variants from the personalize_variants search param (set by Edge Proxy)
 * This is the primary method when using Launch Edge Proxy
 */
export function getVariantsFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string> {
  const variantParam = searchParams[Personalize.VARIANT_QUERY_PARAM];

  if (!variantParam || typeof variantParam !== 'string') {
    return {};
  }

  return parseVariantParam(decodeURIComponent(variantParam));
}

/**
 * Convert search params variant param to variant aliases for Contentstack API
 * Format: cs_personalize_{experienceUid}_{variantUid}
 */
export function getVariantAliasesFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): string[] {
  const variantParam = searchParams[Personalize.VARIANT_QUERY_PARAM];

  if (!variantParam || typeof variantParam !== 'string') {
    return [];
  }

  try {
    // Use SDK method to convert variant param to aliases
    return Personalize.variantParamToVariantAliases(decodeURIComponent(variantParam));
  } catch {
    // Fallback to manual conversion
    const variants = parseVariantParam(decodeURIComponent(variantParam));
    return Object.entries(variants)
      .filter(([, variant]) => variant)
      .map(([experienceUid, variantUid]) => `cs_personalize_${experienceUid}_${variantUid}`);
  }
}

/**
 * Get the active variant aliases from cookies (server-side)
 * Used as fallback for local development or non-Launch deployments
 * Returns a map of experience shortUid -> variant shortUid
 */
export async function getServerVariants(): Promise<Record<string, string>> {
  try {
    const cookieStore = await cookies();

    // First try the manifest cookie (set by Personalize SDK)
    const manifestCookie = cookieStore.get(MANIFEST_COOKIE_NAME);

    if (manifestCookie?.value) {
      const manifest: PersonalizeManifest = JSON.parse(manifestCookie.value);
      const variants: Record<string, string> = {};

      manifest.experiences.forEach((exp) => {
        if (exp.activeVariantShortUid) {
          variants[exp.shortUid] = exp.activeVariantShortUid;
        }
      });

      return variants;
    }

    // Fallback to the simple variant param cookie
    const variantCookie = cookieStore.get(PERSONALIZE_COOKIE_NAME);
    if (variantCookie?.value) {
      return parseVariantParam(variantCookie.value);
    }

    return {};
  } catch {
    return {};
  }
}

/**
 * Get variant parameter string for Contentstack API (from cookies)
 * Format: "experienceUid_variantUid,experienceUid_variantUid"
 */
export async function getVariantParam(): Promise<string | undefined> {
  const variants = await getServerVariants();
  const entries = Object.entries(variants);

  if (entries.length === 0) return undefined;

  return entries.map(([exp, variant]) => `${exp}_${variant}`).join(',');
}

/**
 * Get variant aliases as array for Contentstack API (from cookies)
 * Format: cs_personalize_{experienceUid}_{variantUid}
 *
 * @deprecated Use getVariantAliasesFromSearchParams instead when using Launch Edge Proxy
 */
export async function getVariantAliases(): Promise<string[]> {
  const variants = await getServerVariants();

  // Format: cs_personalize_<experience_short_uid>_<variant_short_uid>
  return Object.entries(variants)
    .filter(([, variant]) => variant)
    .map(([experienceUid, variantUid]) => `cs_personalize_${experienceUid}_${variantUid}`);
}

/**
 * Check if a specific variant is active (server-side, from cookies)
 */
export async function hasServerVariant(variantAlias: string): Promise<boolean> {
  const variants = await getServerVariants();
  return Object.values(variants).includes(variantAlias);
}

/**
 * Get variant for specific experience (server-side, from cookies)
 */
export async function getServerVariant(experienceShortUid: string): Promise<string | null> {
  const variants = await getServerVariants();
  return variants[experienceShortUid] || null;
}

/**
 * Get personalization info from request headers
 * Useful in API routes
 */
export async function getVariantsFromRequestHeaders(): Promise<Record<string, string>> {
  try {
    const headersList = await headers();
    const variantHeader = headersList.get('x-personalize-variant');

    if (variantHeader) {
      return parseVariantParam(variantHeader);
    }

    return {};
  } catch {
    return {};
  }
}
