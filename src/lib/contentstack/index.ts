// Contentstack SDK and client
export { getStack, resetStack, Contentstack } from './client';

// Configuration
export { getContentstackConfig, contentstackConfig } from './config';
export type { ContentstackConfig } from './config';

// Content fetching - Dynamic approach
export {
  getContentTypes,
  getEntriesByContentType,
  getEntryByUrl,
  getAllContent,
  getContentTypeSchema,
} from './content';
export type {
  ContentTypeSchema,
  ContentTypesResponse,
  ContentEntry,
} from './content';

// Homepage specific
export {
  getHomePage,
  getNavigation,
  getHeroBanners,
} from './homepage';
export type {
  Article,
  HeroBanner,
  Navigation,
  FeaturedArticles,
} from './homepage';

// Web Configuration
export {
  getWebConfig,
  getMegaMenu,
  getAllMegaMenus,
} from './web-config';
export type {
  WebConfig,
  MainNavigation,
  NavigationItem,
  MegaMenu,
  NavSection,
  NavLink,
  FooterMenu,
  FooterSection,
  FooterLink,
  ConsentModal,
  ConsentAction,
  Asset,
  LinkReference,
} from './web-config';

// Component types
export type {
  PageComponent,
  CardCollectionComponent,
  TeaserComponent,
  TextAndImageCarouselComponent,
  FeaturedArticlesComponent,
  SpotlightComponent,
  TextComponent,
  Card,
  CarouselItem,
} from './components';
export { getComponentType, getComponentData } from './components';

// Universal page fetching
export {
  getPageByUrl,
  getArticles,
  getRelatedArticles,
  getAllPagePaths,
} from './pages';
export type {
  ContentTypeUid,
  BasePage,
  ArticlePage,
  ArticleListingPage,
  LandingPage,
  HomePage,
  PageEntry,
  PageResult,
} from './pages';

// Query builders (legacy)
export {
  getEntryByUid,
  getEntries,
  getEntryByField,
  pageQueries,
  navigationQueries,
  globalQueries,
} from './queries';
