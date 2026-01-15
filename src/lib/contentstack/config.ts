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

export const contentstackConfig = {
  get: getContentstackConfig,
};
