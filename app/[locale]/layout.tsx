import type { Metadata } from 'next';
import { locales, isRtlLocale, type Locale } from '@config/locales';
import { siteConfig } from '@config/site';
// import { getDictionary } from '@/i18n'; // Uncomment when implementing translations

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Generate metadata for the locale
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      template: siteConfig.seo.titleTemplate,
      default: siteConfig.seo.defaultTitle,
    },
    description: siteConfig.seo.defaultDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

/**
 * Locale-specific layout
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const _isRtl = isRtlLocale(locale);
  // Dictionary will be used when implementing translations
  // const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} dir={_isRtl ? 'rtl' : 'ltr'}>
      <body>
        {/* Navigation will go here */}
        <main>{children}</main>
        {/* Footer will go here */}
      </body>
    </html>
  );
}
