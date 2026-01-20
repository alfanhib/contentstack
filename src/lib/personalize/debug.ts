/**
 * Debug utilities for Personalize testing
 *
 * With Launch Edge Proxy:
 * - Add ?_country=Indonesia to simulate geo-targeting
 * - Add ?_reset=1 to reset user state
 * - Variants are passed via ?personalize_variants=...
 *
 * Legacy (with middleware):
 * - Add ?_variant=<experienceShortUid>_<variantShortUid> to URL
 * - Example: /en/?_variant=0_luxury
 */

import { cookies, headers } from 'next/headers';
import Personalize from '@contentstack/personalize-edge-sdk';
import { parseVariantParam } from './utils';

const MANIFEST_COOKIE_NAME = 'cs-personalize-manifest';

interface PersonalizeManifest {
  activeVariants: Record<string, string | null>;
  experiences: Array<{
    shortUid: string;
    activeVariantShortUid: string | null;
  }>;
}

interface PersonalizeDebugInfo {
  manifest: PersonalizeManifest | null;
  userId: string | null;
  experiences: Array<{ shortUid: string; variant: string | null }>;
  variantParam: string | null;
  variantAliases: string[];
}

/**
 * Get current personalize manifest for debugging
 */
export async function getPersonalizeDebugInfo(): Promise<PersonalizeDebugInfo> {
  try {
    const cookieStore = await cookies();

    const manifestCookie = cookieStore.get(MANIFEST_COOKIE_NAME);
    const userIdCookie = cookieStore.get('cs-personalize-user-uid');

    let manifest: PersonalizeManifest | null = null;
    if (manifestCookie?.value) {
      manifest = JSON.parse(manifestCookie.value);
    }

    // Try to get variant param from headers (set by Edge Proxy)
    const headersList = await headers();
    const variantHeader = headersList.get('x-personalize-variant');

    // Calculate variant aliases
    let variantAliases: string[] = [];
    if (variantHeader) {
      try {
        variantAliases = Personalize.variantParamToVariantAliases(variantHeader);
      } catch {
        // Fallback to manual conversion
        const variants = parseVariantParam(variantHeader);
        variantAliases = Object.entries(variants)
          .filter(([, v]) => v)
          .map(([exp, variant]) => `cs_personalize_${exp}_${variant}`);
      }
    } else if (manifest?.experiences) {
      variantAliases = manifest.experiences
        .filter((exp) => exp.activeVariantShortUid)
        .map((exp) => `cs_personalize_${exp.shortUid}_${exp.activeVariantShortUid}`);
    }

    return {
      manifest,
      userId: userIdCookie?.value || null,
      experiences:
        manifest?.experiences.map((exp) => ({
          shortUid: exp.shortUid,
          variant: exp.activeVariantShortUid,
        })) || [],
      variantParam: variantHeader || null,
      variantAliases,
    };
  } catch {
    return {
      manifest: null,
      userId: null,
      experiences: [],
      variantParam: null,
      variantAliases: [],
    };
  }
}

/**
 * Get debug info from searchParams (for Launch Edge Proxy approach)
 */
export function getDebugInfoFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): {
  variantParam: string | null;
  variantAliases: string[];
  variants: Record<string, string>;
} {
  const variantParam = searchParams[Personalize.VARIANT_QUERY_PARAM];

  if (!variantParam || typeof variantParam !== 'string') {
    return {
      variantParam: null,
      variantAliases: [],
      variants: {},
    };
  }

  const decoded = decodeURIComponent(variantParam);
  let variantAliases: string[] = [];

  try {
    variantAliases = Personalize.variantParamToVariantAliases(decoded);
  } catch {
    // Fallback to manual conversion
    const variants = parseVariantParam(decoded);
    variantAliases = Object.entries(variants)
      .filter(([, v]) => v)
      .map(([exp, variant]) => `cs_personalize_${exp}_${variant}`);
  }

  return {
    variantParam: decoded,
    variantAliases,
    variants: parseVariantParam(decoded),
  };
}

