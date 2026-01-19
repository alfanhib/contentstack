/**
 * Component Types from Contentstack
 */

// Card in CardCollection
export interface Card {
  _metadata?: { uid: string };
  image?: {
    url: string;
    title?: string;
  };
  image_alt_text?: string;
  is_thumbnail?: boolean;
  title: string;
  subtitle?: string;
  content?: string;
  cta?: {
    text?: string;
    link?: Array<{ uid: string; url?: string; _content_type_uid?: string }>;
  };
}

// Card Collection Component
export interface CardCollectionComponent {
  card_collection: {
    _metadata?: { uid: string };
    header?: {
      heading?: string;
      sub_heading?: string;
    };
    cards: Card[];
  };
}

// Teaser Component
export interface TeaserComponent {
  teaser: {
    _metadata?: { uid: string };
    heading?: string;
    content?: string;
    image?: Array<{
      image?: { url: string };
      image_alt_text?: string;
    }>;
    video?: {
      video?: { url: string } | null;
      video_alt_text?: string;
    };
    cta?: Array<{
      text?: string;
      link?: Array<{ uid: string; url?: string; _content_type_uid?: string }>;
    }>;
  };
}

// Carousel Item
export interface CarouselItem {
  _metadata?: { uid: string };
  heading?: string;
  content?: string;
  image?: {
    url: string;
    title?: string;
  };
  cta?: {
    text?: string;
    link?: Array<{ uid: string; url?: string; _content_type_uid?: string }>;
  };
}

// Text and Image Carousel Component
export interface TextAndImageCarouselComponent {
  text_and_image_carousel: {
    _metadata?: { uid: string };
    carousel_items: CarouselItem[];
  };
}

// Featured Articles Component
export interface FeaturedArticlesComponent {
  featured_articles: {
    _metadata?: { uid: string };
    heading?: string;
    sub_heading?: string;
    articles?: Array<{
      uid: string;
      title: string;
      url?: string;
      summary?: string;
      cover_image?: { url: string };
    }>;
  };
}

// Spotlight Component
export interface SpotlightComponent {
  spotlight: {
    _metadata?: { uid: string };
    heading?: string;
    article?: {
      uid: string;
      title: string;
      url?: string;
      summary?: string;
      cover_image?: { url: string };
    };
  };
}

// Text Component (Rich Text)
export interface TextComponent {
  text: {
    _metadata?: { uid: string };
    content?: unknown; // JSON RTE content
  };
}

// Union type for all components
export type PageComponent =
  | CardCollectionComponent
  | TeaserComponent
  | TextAndImageCarouselComponent
  | FeaturedArticlesComponent
  | SpotlightComponent
  | TextComponent;

// Helper to get component type
export function getComponentType(component: PageComponent): string {
  return Object.keys(component)[0];
}

// Helper to get component data
export function getComponentData<T>(component: PageComponent): T {
  const key = Object.keys(component)[0];
  return (component as unknown as Record<string, T>)[key];
}
