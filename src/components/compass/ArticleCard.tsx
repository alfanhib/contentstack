import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/contentstack';

interface ArticleCardProps {
  article: Article;
  locale: string;
  variant?: 'default' | 'featured' | 'horizontal';
}

export function ArticleCard({ article, locale, variant = 'default' }: ArticleCardProps) {
  if (!article) return null;
  
  const href = article.url || `/${locale}/article/${article.uid}`;
  // Ensure summary is a string
  const summary = typeof article.summary === 'string' ? article.summary : undefined;

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="group flex gap-4 items-start">
        {article.cover_image?.url && (
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={article.cover_image.url}
              alt={article.title}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2">
            {article.title}
          </h3>
          {summary && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">{summary}</p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={href} className="group relative block overflow-hidden rounded-2xl">
        <div className="aspect-[4/3] relative">
          {article.cover_image?.url && (
            <Image
              src={article.cover_image.url}
              alt={article.title}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="font-bold text-xl mb-2 group-hover:text-emerald-400 transition">
            {article.title}
          </h3>
          {summary && (
            <p className="text-sm text-white/80 line-clamp-2">{summary}</p>
          )}
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={href} className="group block overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition">
      {article.cover_image?.url && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={article.cover_image.url}
            alt={article.title}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2">
          {article.title}
        </h3>
        {summary && (
          <p className="mt-2 text-sm text-slate-500 line-clamp-2">{summary}</p>
        )}
      </div>
    </Link>
  );
}
