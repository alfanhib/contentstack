import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getPageByUrl,
  getWebConfig,
  getAllMegaMenus,
  getArticles as fetchArticles,
  getRelatedArticles,
  getAllPagePaths,
  type ArticlePage,
  type ArticleListingPage,
  type LandingPage,
} from '@/lib/contentstack';
import { Header, Footer, CookieConsent } from '@/components/compass';
import { ArticleTemplate, ArticleListingTemplate, LandingTemplate } from '@/components/templates';

interface DynamicPageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

// Generate static params for all pages
export async function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];
  
  // Get all page paths from Contentstack
  const paths = await getAllPagePaths();
  
  // For now, only generate for 'en' locale since that's what exists in Contentstack
  // In production, you would query Contentstack for each locale
  const availableLocales = ['en'];
  
  // Generate params for each locale and path
  for (const locale of availableLocales) {
    for (const path of paths) {
      // Remove leading slash and split into segments
      const segments = path.replace(/^\//, '').split('/').filter(Boolean);
      if (segments.length > 0) {
        params.push({
          locale,
          slug: segments,
        });
      }
    }
  }
  
  console.log(`[generateStaticParams] Generated ${params.length} params`);
  
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const url = `/${slug.join('/')}`;
  
  const pageResult = await getPageByUrl(url, locale);
  
  if (!pageResult) {
    return { title: 'Page Not Found' };
  }

  const { entry } = pageResult;
  const seo = entry.seo;

  return {
    title: seo?.title || entry.title,
    description: seo?.description,
    robots: {
      index: !seo?.no_index,
      follow: !seo?.no_follow,
    },
    alternates: seo?.canonical_url ? {
      canonical: seo.canonical_url,
    } : undefined,
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { locale, slug } = await params;
  
  // Construct URL from slug segments
  const url = `/${slug.join('/')}`;
  
  // Fetch page content and web config in parallel
  const [pageResult, webConfig, megaMenus] = await Promise.all([
    getPageByUrl(url, locale),
    getWebConfig(locale),
    getAllMegaMenus(locale),
  ]);

  // If no page found, show 404
  if (!pageResult) {
    notFound();
  }

  const { entry, contentType } = pageResult;

  // Fetch additional data based on content type
  let additionalData: {
    articles?: ArticlePage[];
    total?: number;
    relatedArticles?: ArticlePage[];
  } = {};

  if (contentType === 'article_listing_page') {
    const listingPage = entry as ArticleListingPage;
    const { articles, total } = await fetchArticles(locale, {
      limit: 12,
      taxonomyFilter: listingPage.taxonomy_filter,
    });
    additionalData = { articles, total };
  }

  if (contentType === 'article') {
    const articlePage = entry as ArticlePage;
    if (articlePage.show_related_articles && articlePage.taxonomies) {
      const relatedArticles = await getRelatedArticles(
        articlePage.uid,
        articlePage.taxonomies,
        articlePage.related_articles?.number_of_articles || 4,
        locale
      );
      additionalData = { relatedArticles };
    }
  }

  // Render the appropriate template based on content type
  const renderContent = () => {
    switch (contentType) {
      case 'article':
        return (
          <ArticleTemplate
            page={entry as ArticlePage}
            relatedArticles={additionalData.relatedArticles}
            locale={locale}
          />
        );

      case 'article_listing_page':
        return (
          <ArticleListingTemplate
            page={entry as ArticleListingPage}
            articles={additionalData.articles || []}
            total={additionalData.total || 0}
            locale={locale}
          />
        );

      case 'landing_page':
        return (
          <LandingTemplate
            page={entry as LandingPage}
            locale={locale}
          />
        );

      default:
        return (
          <div className="pt-16 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{entry.title}</h1>
              <p className="text-slate-600">Content type: {contentType}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header webConfig={webConfig} megaMenus={megaMenus} locale={locale} />
      
      <main>
        {renderContent()}
      </main>

      <Footer webConfig={webConfig} locale={locale} />
      <CookieConsent consentModal={webConfig?.consent_modal} />
    </div>
  );
}
