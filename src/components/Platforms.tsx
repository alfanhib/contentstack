'use client';

import Link from 'next/link';

interface Platform {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const platforms: Platform[] = [
  {
    name: 'Pepperstone Platform',
    description: 'Enjoy a secure, smart and streamlined trading experience on our web platform and mobile app.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    color: '#e94560',
  },
  {
    name: 'TradingView',
    description: 'Replicate an institutional liquidity environment and develop trading robots to automate on your behalf.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    color: '#2962FF',
  },
  {
    name: 'MetaTrader 4',
    description: 'Automate your trading with the definitive FX platform. Customise with indicators, EAs and more.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: '#4CAF50',
  },
  {
    name: 'MetaTrader 5',
    description: 'An even-more powerful version of MetaTrader with more markets, more order types, more features.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: '#FF9800',
  },
  {
    name: 'cTrader',
    description: 'Trade directly through show-stopping charts with hundreds of in-built indicators and strategies.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    color: '#00BCD4',
  },
  {
    name: 'Copy Trading',
    description: 'Find and replicate the strategies of experienced traders, available on mobile and desktop.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    color: '#9C27B0',
  },
];

export default function Platforms() {
  return (
    <section className="py-20 bg-[#0f1629] relative" id="platforms">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#e94560]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#0f3460]/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Find your perfect platform
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Trade the world&apos;s markets anywhere, anytime, with cutting-edge technology and customisable tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <Link
              href="#"
              key={platform.name}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Platform icon */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${platform.color}20`,
                  color: platform.color
                }}
              >
                {platform.icon}
              </div>

              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#e94560] transition-colors duration-300">
                {platform.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {platform.description}
              </p>

              {/* Learn more link */}
              <div className="flex items-center text-[#e94560] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${platform.color}10 0%, transparent 70%)`
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
