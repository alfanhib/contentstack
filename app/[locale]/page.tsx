import {
  getHomePage,
  getWebConfig,
  getAllMegaMenus,
} from '@/lib/contentstack';
import { getVariantAliasesFromSearchParams, getVariantAliases } from '@/lib/personalize';
import { Header, Footer, CookieConsent } from '@/components/compass';
import { HeroBanner } from '@/components/compass/HeroBanner';
import { ComponentRenderer } from '@/components/blocks';

interface LocaleHomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Disable static generation for personalized content
export const dynamic = 'force-dynamic';

export default async function LocaleHomePage({ params, searchParams }: LocaleHomePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Get active variant aliases from personalization
  // Primary: from searchParams (set by Launch Edge Proxy)
  // Fallback: from cookies (for local dev or non-Launch deployments)
  let variantAliases = getVariantAliasesFromSearchParams(resolvedSearchParams);

  // Fallback to cookie-based method if no variants in searchParams
  if (variantAliases.length === 0) {
    variantAliases = await getVariantAliases();
  }

  // Fetch content from Contentstack with personalization
  const [homePage, webConfig, megaMenus] = await Promise.all([
    getHomePage(locale, { variantAliases }),
    getWebConfig(locale),
    getAllMegaMenus(locale),
  ]);

  // Hero is an Article reference
  const heroArticle = homePage?.hero?.[0];

  console.log('[isi] hero', heroArticle)

  // Get dynamic components from homepage
  const components = homePage?.components || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with dynamic navigation */}
      <Header webConfig={webConfig} megaMenus={megaMenus} locale={locale} />

      {/* Hero Banner - from hero article reference */}
      <HeroBanner hero={heroArticle} locale={locale} />

      {/* Dynamic Components from Contentstack */}
      <ComponentRenderer components={components} locale={locale} />

      {/* Footer with dynamic content */}
      <Footer webConfig={webConfig} locale={locale} />

      {/* Cookie Consent Banner */}
      <CookieConsent consentModal={webConfig?.consent_modal} />
    </div>
  );
}
