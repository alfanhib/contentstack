import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicComponents from '@/components/DynamicComponents';
import { getPageByUrl, getAllPageUrls, PageEntry } from '@/lib/contentstack-data';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Allow dynamic pages not in generateStaticParams
export const dynamicParams = true;

// Generate static paths for all landing pages
export async function generateStaticParams() {
  const urls = await getAllPageUrls();
  return urls.map((url) => ({
    slug: url.split('/').filter(Boolean),
  }));
}

// Generate metadata from page SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const url = '/' + (slug?.join('/') || '');
  const pageData = await getPageByUrl(url);

  if (!pageData) return {};

  const seo = (pageData as PageEntry & { seo?: { title?: string; description?: string } }).seo;

  return {
    title: seo?.title || pageData.title,
    description: seo?.description || '',
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const url = '/' + (slug?.join('/') || '');

  const pageData = await getPageByUrl(url);

  if (!pageData) {
    notFound();
  }

  // Get components from page data
  const components = (pageData as PageEntry & { components?: unknown[] }).components || [];

  return (
    <>
      <Header />
      <main className="page-main">
        {/* Page Header */}
        <section className="page-header">
          <div className="section-container">
            <h1 className="page-title">{pageData.title}</h1>
            {pageData.description && (
              <p className="page-subtitle">{pageData.description}</p>
            )}
          </div>
        </section>

        {/* Dynamic Components from CMS */}
        {components.length > 0 && (
          <DynamicComponents components={components as Parameters<typeof DynamicComponents>[0]['components']} />
        )}
      </main>
      <Footer />
    </>
  );
}
