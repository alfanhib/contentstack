import Image from 'next/image';
import Link from 'next/link';
import type { ArticlePage } from '@/lib/contentstack';

interface ArticleTemplateProps {
  page: ArticlePage;
  relatedArticles?: ArticlePage[];
  locale: string;
}

// Simple JSON RTE renderer
function renderRichText(content: unknown): React.ReactNode {
  if (!content || typeof content !== 'object') return null;
  
  const doc = content as {
    type?: string;
    children?: Array<{
      type?: string;
      text?: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      children?: unknown[];
      attrs?: { url?: string; target?: string };
      uid?: string;
    }>;
  };
  
  if (!doc.children) return null;
  
  return doc.children.map((node, index) => {
    if (node.text !== undefined) {
      let text: React.ReactNode = node.text;
      if (node.bold) text = <strong key={index}>{text}</strong>;
      if (node.italic) text = <em key={index}>{text}</em>;
      if (node.underline) text = <u key={index}>{text}</u>;
      return text;
    }
    
    const children = node.children ? renderRichText({ children: node.children }) : null;
    
    switch (node.type) {
      case 'p':
        return <p key={node.uid || index} className="mb-4 text-slate-700 leading-relaxed">{children}</p>;
      case 'h1':
        return <h1 key={node.uid || index} className="text-3xl font-bold text-slate-900 mb-4 mt-8">{children}</h1>;
      case 'h2':
        return <h2 key={node.uid || index} className="text-2xl font-bold text-slate-900 mb-3 mt-6">{children}</h2>;
      case 'h3':
        return <h3 key={node.uid || index} className="text-xl font-bold text-slate-900 mb-2 mt-4">{children}</h3>;
      case 'ul':
        return <ul key={node.uid || index} className="list-disc list-inside mb-4 space-y-2">{children}</ul>;
      case 'ol':
        return <ol key={node.uid || index} className="list-decimal list-inside mb-4 space-y-2">{children}</ol>;
      case 'li':
        return <li key={node.uid || index} className="text-slate-700">{children}</li>;
      case 'a':
        return (
          <a 
            key={node.uid || index} 
            href={node.attrs?.url} 
            target={node.attrs?.target}
            className="text-emerald-600 hover:text-emerald-700 underline"
          >
            {children}
          </a>
        );
      case 'blockquote':
        return (
          <blockquote key={node.uid || index} className="border-l-4 border-emerald-500 pl-4 italic text-slate-600 my-4">
            {children}
          </blockquote>
        );
      default:
        return <span key={node.uid || index}>{children}</span>;
    }
  });
}

export function ArticleTemplate({ page, relatedArticles = [], locale }: ArticleTemplateProps) {
  return (
    <article className="pt-16">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        {page.cover_image?.url ? (
          <Image
            src={page.cover_image.url}
            alt={page.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-auto max-w-4xl px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
            {page.summary && (
              <p className="text-xl text-white/90 max-w-2xl mx-auto">{page.summary}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {renderRichText(page.content)}
        </div>
      </div>

      {/* Related Articles */}
      {page.show_related_articles && relatedArticles.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              {page.related_articles?.heading || 'Related Articles'}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedArticles.map((article) => (
                <Link
                  key={article.uid}
                  href={`/${locale}${article.url}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <div className="relative aspect-[4/3]">
                    {article.cover_image?.url ? (
                      <Image
                        src={article.cover_image.url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
