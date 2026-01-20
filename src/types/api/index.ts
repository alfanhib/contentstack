/**
 * External API Types
 *
 * Define types for external API responses here.
 * These will be updated as APIs are integrated.
 */

// =============================================================================
// COMMON
// =============================================================================

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

/**
 * API error response
 */
export interface ErrorResponse {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// =============================================================================
// TRADING (Example)
// =============================================================================

export interface MarketPrice {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface Market {
  id: string;
  name: string;
  symbol: string;
  category: 'forex' | 'indices' | 'commodities' | 'crypto' | 'shares';
  isOpen: boolean;
  tradingHours: string;
}

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  description?: string;
  minSpread: number;
  leverage: string;
  marginRequired: number;
}

// =============================================================================
// USER (Example)
// =============================================================================

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  currency: string;
  accountType: 'demo' | 'live';
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
