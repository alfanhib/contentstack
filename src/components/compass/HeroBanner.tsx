import Link from 'next/link';
import type { Article } from '@/lib/contentstack';

interface HeroBannerProps {
  // Hero can be an Article with cover_image, title, summary
  hero?: Article;
  locale: string;
}

export function HeroBanner({ hero, locale }: HeroBannerProps) {
  const imageUrl = hero?.cover_image?.url;
  const articleUrl = hero?.url;

  return (
    <section 
      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center pt-16"
      style={{ 
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'linear-gradient(to bottom right, #1e293b, #0f172a)'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          {hero?.title || 'Welcome'}
        </h1>
        
        {hero?.summary && (
          <p className="mb-8 text-lg text-white/90 md:text-xl max-w-2xl mx-auto">
            {hero.summary}
          </p>
        )}
        
        {articleUrl && (
          <Link
            href={`/${locale}${articleUrl}`}
            className="inline-block rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white transition hover:bg-emerald-600 hover:scale-105"
          >
            Explore More
          </Link>
        )}
      </div>
    </section>
  );
}
