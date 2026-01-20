import Contentstack, { Region } from 'contentstack';
import { getContentstackConfig, type ContentstackConfig } from './config';

/**
 * Map config region to Contentstack SDK Region enum
 */
function getRegionEnum(region: ContentstackConfig['region']): Region {
  const regionMap: Record<ContentstackConfig['region'], Region> = {
    us: Region.US,
    eu: Region.EU,
    'azure-na': Region.AZURE_NA,
    'azure-eu': Region.AZURE_EU,
  };

  return regionMap[region] ?? Region.EU;
}

/**
 * Create and configure Contentstack Stack instance
 */
function createStack() {
  const config = getContentstackConfig();

  const stack = Contentstack.Stack({
    api_key: config.apiKey,
    delivery_token: config.deliveryToken,
    environment: config.environment,
    region: getRegionEnum(config.region),
  });

  return stack;
}

/**
 * Singleton stack instance
 * Lazy initialization to avoid errors during build when env vars might not be set
 */
let stackInstance: ReturnType<typeof Contentstack.Stack> | null = null;

export function getStack() {
  if (!stackInstance) {
    stackInstance = createStack();
  }
  return stackInstance;
}

/**
 * Reset stack instance (useful for testing)
 */
export function resetStack() {
  stackInstance = null;
}

export { Contentstack };
