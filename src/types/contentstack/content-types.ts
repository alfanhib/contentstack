/**
 * Contentstack Content Types
 *
 * These types will be generated/updated when the CMS schema is defined.
 * For now, these are placeholder interfaces.
 */

// =============================================================================
// BASE TYPES
// =============================================================================

/**
 * Base entry interface shared by all content types
 */
export interface BaseEntry {
  uid: string;
  title: string;
  locale: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  _version: number;
}

/**
 * Image/File asset
 */
export interface Asset {
  uid: string;
  title: string;
  filename: string;
  url: string;
  content_type: string;
  file_size: number;
  dimension?: {
    width: number;
    height: number;
  };
}

/**
 * Link field
 */
export interface Link {
  title: string;
  href: string;
  target?: '_blank' | '_self';
}

// =============================================================================
// SEO
// =============================================================================

export interface SEO {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: Asset;
  no_index?: boolean;
  no_follow?: boolean;
  canonical_url?: string;
}

// =============================================================================
// PAGE
// =============================================================================

export interface Page extends BaseEntry {
  url: string;
  seo?: SEO;
  components?: PageComponent[];
}

/**
 * Union type for page components/blocks
 * Add specific component types as they are defined in CMS
 */
export type PageComponent =
  | HeroComponent
  | TextBlockComponent
  | CTAComponent
  | GenericComponent;

export interface HeroComponent {
  _content_type_uid: 'hero';
  uid: string;
  title: string;
  subtitle?: string;
  background_image?: Asset;
  cta?: Link;
}

export interface TextBlockComponent {
  _content_type_uid: 'text_block';
  uid: string;
  content: string; // Rich text
}

export interface CTAComponent {
  _content_type_uid: 'cta';
  uid: string;
  title: string;
  description?: string;
  primary_button?: Link;
  secondary_button?: Link;
}

/**
 * Fallback for unknown component types
 */
export interface GenericComponent {
  _content_type_uid: string;
  uid: string;
  [key: string]: unknown;
}

// =============================================================================
// NAVIGATION
// =============================================================================

export interface Navigation extends BaseEntry {
  identifier: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  uid: string;
  title: string;
  link?: Link;
  children?: NavigationItem[];
  icon?: Asset;
}

// =============================================================================
// GLOBAL SETTINGS
// =============================================================================

export interface SiteSettings extends BaseEntry {
  identifier: string;
  logo?: Asset;
  favicon?: Asset;
  default_seo?: SEO;
  social_links?: SocialLink[];
  footer_text?: string;
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube';
  url: string;
}
