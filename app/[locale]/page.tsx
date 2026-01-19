import type { Locale } from '@config/locales';
import { getDictionary } from '@/i18n';

interface LocaleHomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Placeholder */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 text-white">
        <h1 className="mb-4 text-center text-4xl font-bold md:text-6xl">Pepperstone</h1>
        <p className="max-w-2xl text-center text-lg text-slate-300 md:text-xl">
          {locale === 'id'
            ? 'Platform trading online terpercaya'
            : 'Your trusted online trading platform'}
        </p>
        <div className="mt-8 flex gap-4">
          <button className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold transition hover:bg-emerald-600">
            {dictionary.navigation.signup}
          </button>
          <button className="rounded-lg border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
            {dictionary.navigation.login}
          </button>
        </div>
      </section>

      {/* Content Sections - Will be dynamic from CMS */}
      <section className="flex min-h-[40vh] items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-slate-500">
            {locale === 'id'
              ? 'Konten akan dimuat dari Contentstack'
              : 'Content will be loaded from Contentstack'}
          </p>
        </div>
      </section>
    </div>
  );
}
