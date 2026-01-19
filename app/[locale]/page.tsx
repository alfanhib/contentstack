import {
  getHomePage,
  getWebConfig,
  getAllMegaMenus,
} from '@/lib/contentstack';
import { Header, Footer, CookieConsent } from '@/components/compass';
import { HeroBanner } from '@/components/compass/HeroBanner';
import { ComponentRenderer } from '@/components/blocks';

interface LocaleHomePageProps {
  params: Promise<{ locale: string }>;
}

// Generate static params for homepage
export async function generateStaticParams() {
  // Only generate for locales that have content in Contentstack
  return [{ locale: 'en' }];
}

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale } = await params;

  // Fetch content from Contentstack
  const [homePage, webConfig, megaMenus] = await Promise.all([
    getHomePage(locale),
    getWebConfig(locale),
    getAllMegaMenus(locale),
  ]);

  // Hero is an Article reference
  const heroArticle = homePage?.hero?.[0];
  
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
