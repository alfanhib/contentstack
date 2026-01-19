'use client';

import type { LandingPage } from '@/lib/contentstack';
import { ComponentRenderer } from '@/components/blocks';

interface LandingTemplateProps {
  page: LandingPage;
  locale: string;
}

export function LandingTemplate({ page, locale }: LandingTemplateProps) {
  const hero = page.hero?.[0];
  
  // Hero can be either hero_banner or article reference
  // For hero_banner: hero.image[0].image.url, hero.heading, hero.content (string)
  // For article: hero.cover_image.url, hero.title, hero.summary (string), hero.content (JSON RTE - don't render)
  const isArticleHero = hero && 'cover_image' in hero;
  
  const heroImage = isArticleHero 
    ? (hero as { cover_image?: { url: string } }).cover_image?.url
    : hero?.image?.[0]?.image?.url;
  
  const heroTitle = isArticleHero
    ? (hero as { title?: string }).title
    : hero?.heading;
  
  // For article hero, use summary (string), not content (JSON RTE)
  const heroDescription = isArticleHero
    ? (hero as { summary?: string }).summary
    : typeof hero?.content === 'string' ? hero.content : undefined;

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ 
          backgroundImage: heroImage 
            ? `url(${heroImage})` 
            : 'linear-gradient(to bottom right, #1e293b, #0f172a)'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {heroTitle || page.title}
          </h1>
          {heroDescription && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {heroDescription}
            </p>
          )}
        </div>
      </section>

      {/* Dynamic Components */}
      {page.components && page.components.length > 0 && (
        <ComponentRenderer components={page.components} locale={locale} />
      )}

      {/* Fallback content if no components */}
      {(!page.components || page.components.length === 0) && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-lg text-slate-600">
              Content coming soon...
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
