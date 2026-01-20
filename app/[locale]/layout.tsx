import type { Metadata } from 'next';
import { locales, isRtlLocale, type Locale } from '@config/locales';
import { siteConfig } from '@config/site';
// import { getDictionary } from '@/i18n'; // Uncomment when implementing translations

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  // Only generate for locales that have content in Contentstack
  // For now, only 'en' has content
  return [{ locale: 'en' }];
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
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

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const _isRtl = isRtlLocale(locale as Locale);

  return (
    <>
      <main data-locale={locale} dir={_isRtl ? 'rtl' : 'ltr'}>
        {children}
      </main>
    </>
  );
}
