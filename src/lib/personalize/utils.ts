/**
 * Personalize utility functions
 */

// Cookie name used by the Personalize SDK
export const PERSONALIZE_COOKIE_NAME = 'personalize-variants';

/**
 * Parse variant parameter string into a record
 * Format: "experienceShortUid_variantShortUid,experienceShortUid_variantShortUid"
 */
export function parseVariantParam(variantParam: string): Record<string, string> {
  if (!variantParam) return {};

  const variants: Record<string, string> = {};

  variantParam.split(',').forEach((pair) => {
    const [experienceShortUid, variantShortUid] = pair.split('_');
    if (experienceShortUid && variantShortUid) {
      variants[experienceShortUid] = variantShortUid;
    }
  });

  return variants;
}

/**
 * Get variants from cookies (client-side)
 */
export function getVariantsFromCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};

  const cookies = document.cookie.split(';');
  const variantCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${PERSONALIZE_COOKIE_NAME}=`)
  );

  if (!variantCookie) return {};

  const variantParam = variantCookie.split('=')[1];
  return parseVariantParam(decodeURIComponent(variantParam));
}

/**
 * Get variants from request headers (server-side)
 */
export function getVariantsFromHeaders(headers: Headers): Record<string, string> {
  const variantHeader = headers.get('x-personalize-variant');
  if (!variantHeader) return {};

  return parseVariantParam(variantHeader);
}

/**
 * Check if we're running on the client
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}
