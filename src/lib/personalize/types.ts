/**
 * Personalize type definitions
 */

export interface VariantInfo {
  /** The variant alias/shortUID */
  alias: string;
  /** The full variant UID */
  uid?: string;
  /** Experience/experiment this variant belongs to */
  experienceUid?: string;
}

export interface PersonalizeContextValue {
  /** Current active variants for this user */
  variants: Record<string, string>;
  /** Raw variant parameter string */
  variantParam: string | null;
  /** Check if a specific variant is active */
  hasVariant: (variantAlias: string) => boolean;
  /** Get variant for a specific experience */
  getVariant: (experienceShortUid: string) => string | null;
  /** Whether personalization data has been loaded */
  isLoaded: boolean;
}
