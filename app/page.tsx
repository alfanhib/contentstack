import { redirect } from 'next/navigation';
import { defaultLocale } from '@config/locales';

/**
 * Root page - redirects to default locale
 * In SSG mode, this generates a static redirect page
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
