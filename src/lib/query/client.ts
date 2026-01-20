import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

/**
 * Create a new QueryClient with default options
 * Used for both server and client
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * For SSG, we don't want to refetch on mount since data is pre-fetched
         * at build time
         */
        staleTime: 60 * 1000, // 1 minute

        /**
         * Don't retry on SSG build failures
         */
        retry: isServer ? false : 3,

        /**
         * Only refetch on window focus in development
         */
        refetchOnWindowFocus: process.env.NODE_ENV === 'development',
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

/**
 * Browser query client singleton
 */
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get or create QueryClient
 * On server: always create new client
 * On client: reuse singleton
 */
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  }

  // Browser: create singleton if needed
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

export { QueryClient };
