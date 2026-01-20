'use client';

import { usePersonalize } from '@/lib/personalize';
import type { ReactNode } from 'react';

interface PersonalizedContentProps {
  /** The experience short UID from Contentstack Personalize */
  experienceUid: string;
  /** Map of variant aliases to their content */
  variants: Record<string, ReactNode>;
  /** Default content if no variant matches */
  fallback?: ReactNode;
}

/**
 * Component for rendering personalized content based on active variants.
 *
 * @example
 * ```tsx
 * <PersonalizedContent
 *   experienceUid="hero_banner"
 *   variants={{
 *     'variant_a': <HeroBannerA />,
 *     'variant_b': <HeroBannerB />,
 *   }}
 *   fallback={<HeroBannerDefault />}
 * />
 * ```
 */
export function PersonalizedContent({
  experienceUid,
  variants,
  fallback = null,
}: PersonalizedContentProps) {
  const { getVariant, isLoaded } = usePersonalize();

  // Show fallback while loading
  if (!isLoaded) {
    return <>{fallback}</>;
  }

  // Get the active variant for this experience
  const activeVariant = getVariant(experienceUid);

  // If we have an active variant and content for it, render it
  if (activeVariant && variants[activeVariant]) {
    return <>{variants[activeVariant]}</>;
  }

  // Otherwise render fallback
  return <>{fallback}</>;
}

interface VariantSwitchProps {
  /** Check if this specific variant alias is active */
  variantAlias: string;
  /** Content to show when variant is active */
  children: ReactNode;
  /** Content to show when variant is not active */
  fallback?: ReactNode;
}

/**
 * Simple component to conditionally render content based on variant.
 *
 * @example
 * ```tsx
 * <VariantSwitch variantAlias="promo_v2" fallback={<DefaultPromo />}>
 *   <NewPromoDesign />
 * </VariantSwitch>
 * ```
 */
export function VariantSwitch({ variantAlias, children, fallback = null }: VariantSwitchProps) {
  const { hasVariant, isLoaded } = usePersonalize();

  if (!isLoaded) {
    return <>{fallback}</>;
  }

  return <>{hasVariant(variantAlias) ? children : fallback}</>;
}
