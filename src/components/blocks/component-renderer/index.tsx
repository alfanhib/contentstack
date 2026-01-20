import type { 
  PageComponent,
  CardCollectionComponent,
  TeaserComponent,
  TextAndImageCarouselComponent,
  TextComponent,
} from '@/lib/contentstack/components';
import { CardCollection } from '../card-collection';
import { Teaser } from '../teaser';
import { TextAndImageCarousel } from '../carousel';
import { TextBlock } from '../text';

interface ComponentRendererProps {
  components: PageComponent[];
  locale: string;
}

export function ComponentRenderer({ components, locale }: ComponentRendererProps) {
  if (!components || components.length === 0) return null;

  return (
    <>
      {components.map((component, index) => {
        const componentType = Object.keys(component)[0];
        const key = `${componentType}-${index}`;

        switch (componentType) {
          case 'card_collection':
            return (
              <CardCollection
                key={key}
                data={(component as CardCollectionComponent).card_collection}
                locale={locale}
              />
            );

          case 'teaser':
            return (
              <Teaser
                key={key}
                data={(component as TeaserComponent).teaser}
                locale={locale}
              />
            );

          case 'text_and_image_carousel':
            return (
              <TextAndImageCarousel
                key={key}
                data={(component as TextAndImageCarouselComponent).text_and_image_carousel}
                locale={locale}
              />
            );

          case 'text':
            return (
              <TextBlock
                key={key}
                data={(component as TextComponent).text}
              />
            );

        default:
          return null;
        }
      })}
    </>
  );
}
