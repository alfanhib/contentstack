import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getArticleByUrl, getAllArticleUrls, ArticleEntry } from '@/lib/contentstack-data';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Allow dynamic pages
export const dynamicParams = true;

// Generate static paths for all articles
export async function generateStaticParams() {
  const urls = await getAllArticleUrls();
  return urls.map((url) => ({
    // Remove /article/ prefix to get slug
    slug: url.replace(/^\/article\//, ''),
  }));
}

// Generate metadata from article
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const url = `/article/${slug}`;
  const article = await getArticleByUrl(url);

  if (!article) return {};

  return {
    title: article.headline || article.title,
    description: article.sub_headline || article.summary || '',
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const url = `/article/${slug}`;

  const article = await getArticleByUrl(url);

  if (!article) {
    notFound();
  }

  // Extract article data
  const title = article.headline || article.title || 'Article';
  const subtitle = article.sub_headline || article.summary || '';
  const coverImage = article.cover_image?.url || article.featured_image?.url || article.image?.url;
  const content = article.content || article.body || '';

  return (
    <>
      <Header />
      <main className="article-page">
        {/* Article Hero */}
        <section
          className="article-hero"
          style={coverImage ? {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        >
          <div className="article-hero-content">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </section>

        {/* Article Content */}
        {content && (
          <section className="article-content-section">
            <div className="article-container">
              <div
                className="article-body rich-text-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
