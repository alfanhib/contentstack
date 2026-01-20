/**
 * Contentstack configuration
 * Loaded from environment variables
 */

type ContentstackRegion = 'us' | 'eu' | 'azure-na' | 'azure-eu';

export interface ContentstackConfig {
  apiKey: string;
  deliveryToken: string;
  environment: string;
  region: ContentstackRegion;
  previewToken?: string;
  previewHost?: string;
}

export interface PersonalizeConfig {
  projectUid: string;
  edgeApiUrl?: string;
}

/**
 * Master locale - the default locale in Contentstack that doesn't need language code
 * Set this to your stack's master locale code (e.g., 'en', 'en-us')
 */
export const MASTER_LOCALE = 'en';

/**
 * Get Contentstack locale code from app locale
 * Returns undefined for master locale (no language query needed)
 */
export function getContentstackLocale(appLocale?: string): string | undefined {
  // If no locale or master locale, don't pass language to Contentstack
  if (!appLocale || appLocale === MASTER_LOCALE) {
    return undefined;
  }

  // Map app locales to Contentstack locale codes if needed
  const localeMap: Record<string, string> = {
    // Add mappings here if your Contentstack locales differ from app locales
    // 'id': 'id-id',
    // 'ar': 'ar-ae',
  };

  return localeMap[appLocale] || appLocale;
}

function getRegion(): ContentstackRegion {
  const region = process.env.CONTENTSTACK_REGION?.toLowerCase();
  const validRegions: ContentstackRegion[] = ['us', 'eu', 'azure-na', 'azure-eu'];

  if (region && validRegions.includes(region as ContentstackRegion)) {
    return region as ContentstackRegion;
  }

  return 'eu'; // Default to EU
}

export function getContentstackConfig(): ContentstackConfig {
  const apiKey = process.env.CONTENTSTACK_API_KEY;
  const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;
  const environment = process.env.CONTENTSTACK_ENVIRONMENT;

  if (!apiKey || !deliveryToken || !environment) {
    throw new Error(
      'Missing Contentstack environment variables. Please check CONTENTSTACK_API_KEY, CONTENTSTACK_DELIVERY_TOKEN, and CONTENTSTACK_ENVIRONMENT.'
    );
  }

  return {
    apiKey,
    deliveryToken,
    environment,
    region: getRegion(),
    previewToken: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    previewHost: process.env.CONTENTSTACK_PREVIEW_HOST,
  };
}

export function getPersonalizeConfig(): PersonalizeConfig {
  const projectUid = process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID;

  if (!projectUid) {
    throw new Error(
      'Missing Personalize environment variable. Please check NEXT_PUBLIC_PERSONALIZE_PROJECT_UID.'
    );
  }

  return {
    projectUid,
    edgeApiUrl: process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL,
  };
}

export const contentstackConfig = {
  get: getContentstackConfig,
  getPersonalize: getPersonalizeConfig,
};
