import Image from 'next/image';
import Link from 'next/link';
import type { ArticleListingPage, ArticlePage } from '@/lib/contentstack';

interface ArticleListingTemplateProps {
  page: ArticleListingPage;
  articles: ArticlePage[];
  total: number;
  locale: string;
}

export function ArticleListingTemplate({ 
  page, 
  articles, 
  total,
  locale 
}: ArticleListingTemplateProps) {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900">
        {page.featured_image?.url && (
          <>
            <Image
              src={page.featured_image.url}
              alt={page.title}
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
          </>
        )}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {page.headline || page.title}
          </h1>
          {page.description && (
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {page.description}
            </p>
          )}
          <p className="mt-4 text-sm text-slate-400">
            {total} article{total !== 1 ? 's' : ''} found
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          {articles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.uid}
                  href={`/${locale}${article.url}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-slate-100"
                >
                  <div className="relative aspect-[16/10]">
                    {article.cover_image?.url ? (
                      <Image
                        src={article.cover_image.url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2 mb-2">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center text-emerald-600 font-medium text-sm">
                      Read More
                      <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No articles found.</p>
              <Link
                href={`/${locale}/articles`}
                className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View all articles
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
