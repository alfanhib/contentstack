import Link from 'next/link';

interface HeroBannerProps {
  article: {
    uid?: string;
    title?: string;
    headline?: string;
    sub_headline?: string;
    description?: string;
    summary?: string;
    cover_image?: {
      url: string;
      title?: string;
    };
    featured_image?: {
      url: string;
      title?: string;
    };
    image?: {
      url: string;
      title?: string;
    };
    cta?: {
      title?: string;
      text?: string;
      href?: string;
      external_url?: string;
      link?: Array<{ url?: string; _content_type_uid?: string; uid?: string }>;
    };
    url?: string;
    _content_type_uid?: string;
  };
}

// Helper: Resolve CMS link reference to URL
function resolveCmsLink(article: HeroBannerProps['article']): string {
  const cta = article.cta;

  // Check CTA external URL
  if (cta?.external_url && cta.external_url.trim()) {
    return cta.external_url;
  }

  // Check CTA href
  if (cta?.href) return cta.href;

  // Check for internal link reference
  if (cta?.link?.[0]) {
    const ref = cta.link[0];
    if (ref.url) return ref.url;

    const contentType = ref._content_type_uid;
    const uid = ref.uid;

    if (contentType === 'article') return `/article/${uid}`;
    if (contentType === 'landing_page') return ref.url || `/${uid}`;
    if (contentType === 'detailed_article') return `/article/${uid}`;
  }

  // Use article's own URL
  if (article.url) return article.url;

  // Build URL from article content type
  if (article._content_type_uid === 'article' && article.uid) {
    return `/article/${article.uid}`;
  }

  return '/';
}

export default function HeroBanner({ article }: HeroBannerProps) {
  // Extract data from article with fallbacks
  const title = article.headline || article.title || 'Welcome';
  const description = article.sub_headline || article.summary || article.description || '';
  const backgroundImage = article.cover_image?.url || article.featured_image?.url || article.image?.url;
  const ctaText = article.cta?.title || article.cta?.text || 'Explore More';
  const ctaUrl = resolveCmsLink(article);

  return (
    <section
      className="hero-banner"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      <div className="hero-banner-content">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        <Link href={ctaUrl} className="btn btn-outline hero-cta">
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
