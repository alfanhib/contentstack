'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import type { PersonalizeContextValue } from './types';
import { getVariantsFromCookies } from './utils';

const PersonalizeContext = createContext<PersonalizeContextValue | null>(null);

interface PersonalizeProviderProps {
  children: ReactNode;
  /** Initial variants (can be passed from server) */
  initialVariants?: Record<string, string>;
}

/**
 * Provider component for personalization context
 *
 * Wraps your app to provide access to personalization variants
 * resolved by the edge middleware.
 */
export function PersonalizeProvider({
  children,
  initialVariants = {},
}: PersonalizeProviderProps) {
  const [variants, setVariants] = useState<Record<string, string>>(initialVariants);
  const [isLoaded, setIsLoaded] = useState(Object.keys(initialVariants).length > 0);

  // Load variants from cookies on mount (client-side only)
  useEffect(() => {
    const cookieVariants = getVariantsFromCookies();

    if (Object.keys(cookieVariants).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Required for client-only cookie check
      setVariants((prev) => ({ ...prev, ...cookieVariants }));
    }

     
    setIsLoaded(true);
  }, []);

  const contextValue = useMemo<PersonalizeContextValue>(() => {
    const variantParam = Object.entries(variants)
      .map(([exp, variant]) => `${exp}_${variant}`)
      .join(',');

    return {
      variants,
      variantParam: variantParam || null,
      hasVariant: (variantAlias: string) => Object.values(variants).includes(variantAlias),
      getVariant: (experienceShortUid: string) => variants[experienceShortUid] || null,
      isLoaded,
    };
  }, [variants, isLoaded]);

  return (
    <PersonalizeContext.Provider value={contextValue}>{children}</PersonalizeContext.Provider>
  );
}

/**
 * Hook to access personalization context
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { variants, hasVariant, getVariant } = usePersonalize();
 *
 *   if (hasVariant('promo-banner-v2')) {
 *     return <PromoBannerV2 />;
 *   }
 *
 *   return <PromoBannerDefault />;
 * }
 * ```
 */
export function usePersonalize(): PersonalizeContextValue {
  const context = useContext(PersonalizeContext);

  if (!context) {
    throw new Error('usePersonalize must be used within a PersonalizeProvider');
  }

  return context;
}
