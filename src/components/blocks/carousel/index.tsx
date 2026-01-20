'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TextAndImageCarouselComponent } from '@/lib/contentstack/components';

interface CarouselProps {
  data: TextAndImageCarouselComponent['text_and_image_carousel'];
  locale: string;
}

export function TextAndImageCarousel({ data, locale }: CarouselProps) {
  const { carousel_items } = data;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!carousel_items || carousel_items.length === 0) return null;

  const activeItem = carousel_items[activeIndex];

  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image Side */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            {activeItem.image?.url && (
              <Image
                src={activeItem.image.url}
                alt={activeItem.heading || 'Carousel image'}
                fill
                className="object-cover transition-opacity duration-500"
              />
            )}
          </div>

          {/* Content Side */}
          <div className="lg:pl-8">
            {activeItem.heading && (
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {activeItem.heading}
              </h2>
            )}

            {activeItem.content && (
              <p className="text-lg text-slate-600 mb-6 whitespace-pre-line">
                {activeItem.content}
              </p>
            )}

            {activeItem.cta?.text && (() => {
              const ctaUrl = activeItem.cta?.link?.[0]?.url;
              const href = ctaUrl ? (ctaUrl.startsWith('/') ? `/${locale}${ctaUrl}` : ctaUrl) : '#';
              return (
                <Link
                  href={href}
                  className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition"
                >
                  {activeItem.cta.text}
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              );
            })()}

            {/* Carousel Navigation */}
            {carousel_items.length > 1 && (
              <div className="flex items-center gap-3 mt-8">
                {carousel_items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeIndex
                        ? 'bg-emerald-500 w-8'
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
