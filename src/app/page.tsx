import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicComponents, { ComponentData } from '@/components/DynamicComponents';
import HeroBanner from '@/components/HeroBanner';
import TradingQuotes from '@/components/TradingQuotes';
import { getPageData, ArticleEntry } from '@/lib/contentstack-data';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home() {
  // Fetch data from Contentstack
  const pageData = await getPageData();

  // Get hero article reference (first item in hero array)
  const heroArticle: ArticleEntry | undefined = pageData?.hero?.[0];

  // Get components
  const components = (pageData?.components || []) as ComponentData[];

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner from CMS */}
        {heroArticle && <HeroBanner article={heroArticle} />}

        {/* Other Components */}
        {components.length > 0 && (
          <DynamicComponents components={components} />
        )}

        {/* Trading Quotes Section - Real-time WebSocket */}
        <TradingQuotes />

        {/* Fallback if no CMS content */}
        {!heroArticle && components.length === 0 && (
          <section className="hero">
            <div className="hero-grid" />
            <div className="hero-content">
              <h1>Welcome to <span className="highlight">StockTrade</span></h1>
              <p>Your trusted platform for smart investing. Trade stocks, ETFs, and cryptocurrencies with confidence.</p>
              <div className="hero-buttons">
                <Link href="/about-us" className="btn btn-primary">Explore More →</Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
