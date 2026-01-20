import Image from 'next/image';
import Link from 'next/link';
import type { CardCollectionComponent } from '@/lib/contentstack/components';

interface CardCollectionProps {
  data: CardCollectionComponent['card_collection'];
  locale: string;
}

export function CardCollection({ data, locale }: CardCollectionProps) {
  const { header, cards } = data;

  // Filter thumbnail cards for featured display
  const thumbnailCards = cards.filter(card => card.is_thumbnail);
  const displayCards = thumbnailCards.length > 0 ? thumbnailCards : cards;

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {header && (header.heading || header.sub_heading) && (
          <div className="mb-10 text-center">
            {header.heading && (
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                {header.heading}
              </h2>
            )}
            {header.sub_heading && (
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {header.sub_heading}
              </p>
            )}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCards.map((card, index) => {
            const ctaLink = card.cta?.link?.[0];
            const ctaUrl = ctaLink?.url;
            // Add locale prefix if URL is internal (starts with /)
            const href = ctaUrl ? (ctaUrl.startsWith('/') ? `/${locale}${ctaUrl}` : ctaUrl) : '#';

            return (
              <Link
                key={card._metadata?.uid || index}
                href={href}
                className="group block overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                {card.image?.url && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={card.image.url}
                      alt={card.image_alt_text || card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-lg">
                        {card.title}
                      </h3>
                      {card.subtitle && (
                        <p className="text-white/80 text-sm mt-1">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Content (for non-thumbnail cards) */}
                {!card.is_thumbnail && card.content && (
                  <div className="p-4">
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {card.content}
                    </p>
                    {card.cta?.text && (
                      <span className="mt-3 inline-flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-700">
                        {card.cta.text}
                        <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
