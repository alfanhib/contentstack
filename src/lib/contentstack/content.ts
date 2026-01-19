import { getStack } from './client';

/**
 * Content Types Response from Contentstack
 */
export interface ContentTypeSchema {
  uid: string;
  title: string;
  description?: string;
  schema: Array<{
    uid: string;
    data_type: string;
    display_name?: string;
    mandatory?: boolean;
    multiple?: boolean;
    reference_to?: string | string[];
  }>;
}

export interface ContentTypesResponse {
  content_types: ContentTypeSchema[];
}

/**
 * Generic Entry from Contentstack
 */
export interface ContentEntry {
  uid: string;
  title: string;
  url?: string;
  locale: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

/**
 * 1. Get all content types from Contentstack
 */
export async function getContentTypes(): Promise<ContentTypeSchema[]> {
  try {
    const stack = getStack();
    const response = await stack.getContentTypes() as ContentTypesResponse;
    return response.content_types || [];
  } catch (error) {
    console.error('[Contentstack] Failed to fetch content types:', error);
    return [];
  }
}

/**
 * 2. Get all entries for a specific content type
 */
export async function getEntriesByContentType<T = ContentEntry>(
  contentTypeUid: string,
  options?: {
    locale?: string;
    limit?: number;
    includeReferences?: string[];
  }
): Promise<T[]> {
  try {
    const stack = getStack();
    const query = stack.ContentType(contentTypeUid).Query();

    if (options?.locale) {
      query.language(options.locale);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.includeReferences) {
      options.includeReferences.forEach((ref) => {
        query.includeReference(ref);
      });
    }

    const result = await query.toJSON().find();
    return (result?.[0] as T[]) || [];
  } catch (error) {
    console.error(`[Contentstack] Failed to fetch entries for ${contentTypeUid}:`, error);
    return [];
  }
}

/**
 * Get single entry by URL field
 */
export async function getEntryByUrl<T = ContentEntry>(
  contentTypeUid: string,
  url: string,
  locale?: string
): Promise<T | null> {
  try {
    const stack = getStack();
    const query = stack.ContentType(contentTypeUid).Query();

    query.where('url', url);
    query.limit(1);

    if (locale) {
      query.language(locale);
    }

    const result = await query.toJSON().find();
    return (result?.[0]?.[0] as T) || null;
  } catch (error) {
    console.error(`[Contentstack] Failed to fetch entry by url ${url}:`, error);
    return null;
  }
}

/**
 * Get all content - fetches content types and their entries
 */
export async function getAllContent(locale?: string) {
  const contentTypes = await getContentTypes();
  
  const content: Record<string, ContentEntry[]> = {};

  for (const ct of contentTypes) {
    const entries = await getEntriesByContentType(ct.uid, { locale, limit: 100 });
    content[ct.uid] = entries;
  }

  return {
    contentTypes,
    content,
  };
}

/**
 * Get content type schema by UID
 */
export async function getContentTypeSchema(uid: string): Promise<ContentTypeSchema | null> {
  const contentTypes = await getContentTypes();
  return contentTypes.find((ct) => ct.uid === uid) || null;
}
