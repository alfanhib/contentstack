import Image from 'next/image';
import Link from 'next/link';
import type { TeaserComponent } from '@/lib/contentstack/components';

interface TeaserProps {
  data: TeaserComponent['teaser'];
  locale: string;
}

export function Teaser({ data, locale }: TeaserProps) {
  const { heading, content, image, cta } = data;
  const imageUrl = image?.[0]?.image?.url;
  const imageAlt = image?.[0]?.image_alt_text || heading || 'Teaser image';
  const ctaData = cta?.[0];
  const ctaLink = ctaData?.link?.[0];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {heading && (
          <h2 className="text-4xl font-bold text-white mb-6">
            {heading}
          </h2>
        )}

        {content && (
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {content}
          </p>
        )}

        {ctaData?.text && (() => {
          const ctaUrl = ctaLink?.url;
          const href = ctaUrl ? (ctaUrl.startsWith('/') ? `/${locale}${ctaUrl}` : ctaUrl) : '#';
          return (
            <Link
              href={href}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white transition-all hover:bg-emerald-600 hover:scale-105"
            >
              {ctaData.text}
            </Link>
          );
        })()}
      </div>
    </section>
  );
}
