import { getStack } from './client';

/**
 * Web Configuration Types
 */

// Asset/Image type
export interface Asset {
  uid: string;
  url: string;
  title?: string;
  filename?: string;
  content_type?: string;
}

// Link reference
export interface LinkReference {
  uid: string;
  url?: string;
  _content_type_uid?: string;
}

// Navigation Link
export interface NavLink {
  text: string;
  _metadata?: { uid: string };
  thumbnail?: Asset;
  link?: LinkReference[];
  link_text?: string;
  external_link?: string;
}

// Navigation Section
export interface NavSection {
  title?: string;
  _metadata?: { uid: string };
  link?: LinkReference[];
  links?: NavLink[];
}

// Mega Menu
export interface MegaMenu {
  uid: string;
  title: string;
  sections?: NavSection[];
  cta_group?: LinkReference[];
}

// Navigation Item
export interface NavigationItem {
  text: string;
  _metadata?: { uid: string };
  link?: LinkReference[];
  mega_menu?: MegaMenu[];
}

// Main Navigation
export interface MainNavigation {
  uid: string;
  title: string;
  items?: NavigationItem[];
}

// Footer Section Link
export interface FooterLink {
  text: string;
  _metadata?: { uid: string };
  link?: LinkReference[];
  external_link?: string;
}

// Footer Section
export interface FooterSection {
  title: string;
  _metadata?: { uid: string };
  link?: LinkReference[];
  links?: FooterLink[];
}

// Footer Menu
export interface FooterMenu {
  uid: string;
  title: string;
  sections?: FooterSection[];
  built_by?: unknown; // JSON RTE
  copyright_info?: unknown; // JSON RTE
}

// Consent Action
export interface ConsentAction {
  label: string;
  action: 'optIn' | 'optOut';
  _metadata?: { uid: string };
}

// Consent Modal
export interface ConsentModal {
  heading?: string;
  content?: string;
  icon?: Asset;
  consent_actions?: ConsentAction[];
}

// Full Web Configuration
export interface WebConfig {
  uid: string;
  title: string;
  logo?: Asset;
  main_navigation?: MainNavigation[];
  footer_navigation?: FooterMenu[];
  consent_modal?: ConsentModal;
  user_form?: LinkReference[];
}

/**
 * Get web configuration with all references
 */
export async function getWebConfig(locale?: string): Promise<WebConfig | null> {
  try {
    const stack = getStack();
    const query = stack.ContentType('web_configuration').Query();
    
    // Include all nested references
    query.includeReference([
      'main_navigation',
      'main_navigation.items.mega_menu',
      'footer_navigation',
      'user_form',
    ]);
    query.limit(1);
    
    if (locale) {
      query.language(locale);
    }

    const result = await query.toJSON().find();
    return result?.[0]?.[0] || null;
  } catch (error) {
    console.error('[Contentstack] Failed to fetch web config:', error);
    return null;
  }
}

/**
 * Get mega menu by UID
 */
export async function getMegaMenu(uid: string, locale?: string): Promise<MegaMenu | null> {
  try {
    const stack = getStack();
    const query = stack.ContentType('mega_menu').Query();
    
    query.where('uid', uid);
    query.limit(1);
    
    if (locale) {
      query.language(locale);
    }

    const result = await query.toJSON().find();
    return result?.[0]?.[0] || null;
  } catch (error) {
    console.error('[Contentstack] Failed to fetch mega menu:', error);
    return null;
  }
}

/**
 * Get all mega menus
 */
export async function getAllMegaMenus(locale?: string): Promise<MegaMenu[]> {
  try {
    const stack = getStack();
    const query = stack.ContentType('mega_menu').Query();
    
    if (locale) {
      query.language(locale);
    }

    const result = await query.toJSON().find();
    return result?.[0] || [];
  } catch (error) {
    console.error('[Contentstack] Failed to fetch mega menus:', error);
    return [];
  }
}
