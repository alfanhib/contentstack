import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Header />
      <main className="pt-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#e94560] to-[#ff6b6b] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#e94560]/30 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
