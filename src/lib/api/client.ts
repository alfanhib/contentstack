/**
 * API Error class for typed error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request configuration options
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * Build URL with query parameters
 */
function buildUrl(baseUrl: string, params?: RequestOptions['params']): string {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Create a fetch client with default configuration
 */
export function createApiClient(baseUrl: string, defaultHeaders?: HeadersInit) {
  /**
   * Make HTTP request
   */
  async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { body, params, timeout = 30000, headers, ...fetchOptions } = options;

    const url = buildUrl(`${baseUrl}${endpoint}`, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          errorData?.message || `Request failed with status ${response.status}`,
          response.status,
          errorData?.code,
          errorData
        );
      }

      const data = await response.json();

      return {
        data: data as T,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  return {
    /**
     * GET request
     */
    get: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
      request<T>(endpoint, { ...options, method: 'GET' }),

    /**
     * POST request
     */
    post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'POST', body }),

    /**
     * PUT request
     */
    put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'PUT', body }),

    /**
     * PATCH request
     */
    patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'PATCH', body }),

    /**
     * DELETE request
     */
    delete: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'DELETE' }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
