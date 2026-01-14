'use client';

import Image from 'next/image';
import { ModularBlock } from '@/lib/contentstack-data';

interface ContentBlocksProps {
  blocks: ModularBlock[];
}

export default function ContentBlocks({ blocks }: ContentBlocksProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <section className="py-20 bg-[#0f1629]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Powered by Contentstack
          </h2>
          <p className="text-gray-400">
            Content managed dynamically from your CMS
          </p>
        </div>

        <div className="space-y-16">
          {blocks.map((item, index) => {
            const block = item.block;
            if (!block) return null;
            const isImageLeft = block.layout === 'image_left';

            return (
              <div
                key={block._metadata.uid}
                className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    {block.image?.url && (
                      <Image
                        src={block.image.url}
                        alt={block.image.title || block.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {block.title}
                  </h3>
                  <div
                    className="text-gray-400 leading-relaxed prose prose-invert prose-a:text-[#e94560] prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: block.copy }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
