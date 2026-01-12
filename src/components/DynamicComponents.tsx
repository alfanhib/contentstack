'use client';

import Link from 'next/link';

interface ComponentData {
  [key: string]: any;
}

interface DynamicComponentsProps {
  components: ComponentData[];
}

// Helper: Resolve CMS link reference to URL
function resolveCmsLink(cta: any): string {
  if (!cta) return '#';

  // Check for external URL first
  if (cta.external_url && cta.external_url.trim()) {
    return cta.external_url;
  }

  // Check for internal link reference
  if (cta.link?.[0]) {
    const ref = cta.link[0];

    // Use URL from resolved reference first (when includeReference was called)
    if (ref.url) return ref.url;

    // Get content type for building URL
    const contentType = ref._content_type_uid;

    // For article, check if we have title to build slug
    if (contentType === 'article' || contentType === 'detailed_article') {
      // If title exists, use it as slug (the CMS uses title-based URLs)
      if (ref.title) {
        const slug = ref.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `/article/${slug}`;
      }
      // Fallback to uid-based URL
      return `/article/${ref.uid}`;
    }

    if (contentType === 'landing_page') return ref.url || `/${ref.uid}`;
    if (contentType === 'article_listing_page') return '/articles';
  }

  // Fallback to href or #
  return cta.href || '#';
}

// Helper: Build URL slug from title
function buildSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Get card link URL - uses card title if CTA reference doesn't have URL
function getCardLink(card: any): string {
  // Check CTA first
  if (card.cta) {
    const cta = Array.isArray(card.cta) ? card.cta[0] : card.cta;

    // Check for resolved URL in reference
    if (cta.link?.[0]) {
      const ref = cta.link[0];

      // If URL is present, use it
      if (ref.url) return ref.url;

      // Build URL from card title for article references
      const contentType = ref._content_type_uid;
      if ((contentType === 'article' || contentType === 'detailed_article') && card.title) {
        return `/article/${buildSlugFromTitle(card.title)}`;
      }
    }

    // Try external URL
    if (cta.external_url && cta.external_url.trim()) {
      return cta.external_url;
    }
  }

  // Check for direct URL
  if (card.url) return card.url;
  if (card.link) return card.link;

  return '#';
}

// Teaser Banner - Full width with background image (Here to Help)
function TeaserBanner({ data }: { data: ComponentData }) {
  const heading = data.heading || 'Here to Help';
  const content = data.content || '';
  const imageUrl = data.image?.[0]?.image?.url || data.image?.url;
  const cta = data.cta?.[0];
  const ctaText = cta?.text || 'More Details';
  const ctaUrl = resolveCmsLink(cta);
  const textAlign = data.styles?.text_align?.toLowerCase() || 'left';

  return (
    <section
      className="teaser-banner"
      style={imageUrl ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      <div className={`teaser-banner-content text-${textAlign}`}>
        <h2>{heading}</h2>
        {content && <p>{content}</p>}
        <Link href={ctaUrl} className="btn btn-outline teaser-cta">
          {ctaText}
        </Link>
      </div>
    </section>
  );
}

// Text and Image Carousel - Split sections (Must See Spots, etc.)
function TextImageCarousel({ data }: { data: ComponentData }) {
  const items = data.carousel_items || [];
  const imagePosition = data.styles?.image_position || 'left';

  if (!items.length) return null;

  return (
    <section className="text-image-carousel-section">
      <div className="section-container">
        {items.map((item: any, index: number) => {
          const isImageRight = imagePosition === 'right' || index % 2 === 1;
          const imageUrl = item.image?.url;
          const heading = item.heading || '';
          const content = item.content || '';
          const cta = item.cta?.[0];
          const ctaText = cta?.text || '';
          const ctaUrl = resolveCmsLink(cta);
          const theme = item.styles?.theme || 'light';

          return (
            <div
              key={item._metadata?.uid || index}
              className={`text-image-block ${isImageRight ? 'image-right' : 'image-left'} theme-${theme}`}
            >
              {imageUrl && (
                <div className="text-image-visual">
                  <img src={imageUrl} alt={item.image_alt_text || heading} />
                </div>
              )}
              <div className="text-image-content">
                {heading && <h2>{heading}</h2>}
                {content && (
                  <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content }} />
                )}
                {ctaText && (
                  <Link href={ctaUrl} className="btn btn-primary">
                    {ctaText} →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Card Collection - Compass Starter style (horizontal tall cards)
function CardCollection({ data }: { data: ComponentData }) {
  const header = data.header || {};
  const heading = header.heading || data.title || '';
  const subHeading = header.sub_heading || data.subtitle || data.description || '';
  const cards = data.cards || data.items || [];

  if (!cards.length) return null;

  return (
    <section className="card-collection-section">
      <div className="card-collection-container">
        {heading && (
          <div className="card-collection-header">
            <div className="header-accent" />
            <h2>{heading}</h2>
            {subHeading && <p>{subHeading}</p>}
          </div>
        )}
        <div className="card-collection-grid">
          {cards.map((card: any, index: number) => {
            const imageUrl = card.image?.url || card.thumbnail?.url;
            const title = card.title || '';
            const content = card.content || card.description || '';
            const cardUrl = getCardLink(card);
            const cta = Array.isArray(card.cta) ? card.cta[0] : card.cta;
            const ctaText = cta?.text || 'Read More';

            // Wrap in Link if we have a valid URL
            const CardWrapper = cardUrl !== '#' ?
              ({ children }: { children: React.ReactNode }) => (
                <Link href={cardUrl} className="tall-card">
                  {children}
                </Link>
              ) :
              ({ children }: { children: React.ReactNode }) => (
                <div className="tall-card">{children}</div>
              );

            return (
              <CardWrapper key={card._metadata?.uid || index}>
                {imageUrl && (
                  <div className="tall-card-image">
                    <img src={imageUrl} alt={card.image_alt_text || title} />
                    <div className="tall-card-overlay" />
                  </div>
                )}
                <div className="tall-card-content">
                  {title && <h3>{title}</h3>}
                  {content && <p>{content}</p>}
                  {cardUrl !== '#' && (
                    <span className="card-cta">{ctaText} →</span>
                  )}
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Section with Blocks - Image + Text layouts
function SectionWithBlocks({ data }: { data: ComponentData }) {
  const blocks = data.blocks || data.block || [];

  if (!blocks.length) return null;

  return (
    <section className="section">
      <div className="section-container">
        {data.title && (
          <div className="section-header">
            <h2 className="section-title">{data.title}</h2>
            {data.description && <p className="section-subtitle">{data.description}</p>}
          </div>
        )}
        {blocks.map((blockItem: any, index: number) => {
          const block = blockItem.block || blockItem;
          const isReverse = block.layout === 'image_right' || index % 2 === 1;
          const cta = block.cta?.[0];
          const ctaText = cta?.text || '';
          const ctaUrl = resolveCmsLink(cta);

          return (
            <div key={block._metadata?.uid || index} className={`split-section ${isReverse ? 'reverse' : ''}`} style={{ marginBottom: '4rem' }}>
              {block.image?.url && (
                <div className="split-image">
                  <img src={block.image.url} alt={block.title || ''} />
                </div>
              )}
              <div className="split-content">
                {block.title && <h2>{block.title}</h2>}
                {block.copy && (
                  <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: block.copy }} />
                )}
                {ctaText && (
                  <Link href={ctaUrl} className="btn btn-primary">
                    {ctaText} →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ data }: { data: ComponentData }) {
  const title = data.headline || data.title || 'Get Started Today';
  const description = data.sub_headline || data.description || '';
  const cta = data.cta;
  const ctaText = cta?.title || cta?.text || data.cta_text || 'Start Now';
  const ctaUrl = resolveCmsLink(cta) || data.cta_url || '#';

  return (
    <section className="section">
      <div className="section-container">
        <div className="cta-section">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
          <Link href={ctaUrl} className="btn btn-primary">
            {ctaText} →
          </Link>
        </div>
      </div>
    </section>
  );
}

// Rich Text Section
function RichTextSection({ data }: { data: ComponentData }) {
  const content = data.rich_text || data.content || data.body || '';

  if (!content) return null;

  return (
    <section className="section">
      <div className="section-container">
        {data.title && <h2 className="section-title" style={{ marginBottom: '2rem' }}>{data.title}</h2>}
        <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </section>
  );
}

// Generic Modular Block Renderer
function ModularBlockRenderer({ block }: { block: any }) {
  const blockType = Object.keys(block).find(key =>
    key !== '_metadata' && typeof block[key] === 'object'
  );

  if (!blockType) return null;

  const innerData = block[blockType];

  switch (blockType) {
    case 'teaser':
      return <TeaserBanner data={innerData} />;
    case 'text_and_image_carousel':
      return <TextImageCarousel data={innerData} />;
    case 'card_collection':
      return <CardCollection data={innerData} />;
    case 'section_with_blocks':
    case 'blocks':
      return <SectionWithBlocks data={innerData} />;
    case 'cta':
    case 'call_to_action':
      return <CTASection data={innerData} />;
    case 'rich_text':
      return <RichTextSection data={innerData} />;
    default:
      if (innerData.carousel_items) {
        return <TextImageCarousel data={innerData} />;
      }
      if (innerData.cards || innerData.items) {
        return <CardCollection data={innerData} />;
      }
      if (innerData.blocks || innerData.block) {
        return <SectionWithBlocks data={innerData} />;
      }
      return null;
  }
}

// Main Dynamic Components Renderer
export default function DynamicComponents({ components }: DynamicComponentsProps) {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <>
      {components.map((component, index) => {
        return <ModularBlockRenderer key={index} block={component} />;
      })}
    </>
  );
}
