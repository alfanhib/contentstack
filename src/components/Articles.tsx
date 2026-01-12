'use client';

interface Article {
  title: string;
  author: string;
  role: string;
  date: string;
  tags: string[];
}

const articles: Article[] = [
  {
    title: 'U.S. Senate Crypto Market Structure Bill Vote: Why It Matters for Ethereum and Solana',
    author: 'Chris Weston',
    role: 'Head of Research',
    date: 'January 10, 2026',
    tags: ['Ethereum', 'Bitcoin', 'Crypto'],
  },
  {
    title: 'December 2025 US Employment Report: Hiring Cools, Unemployment Falls',
    author: 'Michael Brown',
    role: 'Senior Research Strategist',
    date: 'January 9, 2026',
    tags: ['USD', 'Markets'],
  },
  {
    title: "Trump's $200B MBS Purchase Plan: Short-Term Housing Rally, Long-Term Risks",
    author: 'Dilin Wu',
    role: 'Research Strategist',
    date: 'January 9, 2026',
    tags: ['US', 'Economy'],
  },
];

export default function Articles() {
  return (
    <section className="py-20 bg-[#0a0a1a] relative" id="analysis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get the edge
            </h2>
            <p className="text-gray-400 max-w-xl">
              We bring you expert market analysis, insights and education, empowering you to make informed trading decisions.
            </p>
          </div>
          <a
            href="#"
            className="mt-4 sm:mt-0 text-[#e94560] font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300"
          >
            View all articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <article
              key={article.title}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#e94560]/30 transition-all duration-500 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Date */}
              <time className="text-sm text-gray-500 mb-3 block">{article.date}</time>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-4 line-clamp-2 group-hover:text-[#e94560] transition-colors duration-300">
                {article.title}
              </h3>

              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center text-white font-medium text-sm">
                  {article.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{article.author}</p>
                  <p className="text-gray-500 text-xs">{article.role}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e94560]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
