'use client';

import type { TextComponent } from '@/lib/contentstack/components';

interface TextBlockProps {
  data: TextComponent['text'];
  locale: string;
}

// Simple JSON RTE renderer
function renderRichText(content: unknown): React.ReactNode {
  if (!content || typeof content !== 'object') return null;
  
  const doc = content as {
    type?: string;
    children?: Array<{
      type?: string;
      text?: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      children?: unknown[];
      attrs?: { url?: string; target?: string };
      uid?: string;
    }>;
  };
  
  if (!doc.children) return null;
  
  return doc.children.map((node, index) => {
    if (node.text !== undefined) {
      let text: React.ReactNode = node.text;
      if (node.bold) text = <strong key={index}>{text}</strong>;
      if (node.italic) text = <em key={index}>{text}</em>;
      if (node.underline) text = <u key={index}>{text}</u>;
      return text;
    }
    
    const children = node.children ? renderRichText({ children: node.children }) : null;
    
    switch (node.type) {
      case 'p':
        return <p key={node.uid || index} className="mb-4 text-slate-700 leading-relaxed">{children}</p>;
      case 'h1':
        return <h1 key={node.uid || index} className="text-4xl font-bold text-slate-900 mb-6">{children}</h1>;
      case 'h2':
        return <h2 key={node.uid || index} className="text-3xl font-bold text-slate-900 mb-4">{children}</h2>;
      case 'h3':
        return <h3 key={node.uid || index} className="text-2xl font-bold text-slate-900 mb-3">{children}</h3>;
      case 'h4':
        return <h4 key={node.uid || index} className="text-xl font-bold text-slate-900 mb-2">{children}</h4>;
      case 'ul':
        return <ul key={node.uid || index} className="list-disc list-inside mb-4 space-y-2 text-slate-700">{children}</ul>;
      case 'ol':
        return <ol key={node.uid || index} className="list-decimal list-inside mb-4 space-y-2 text-slate-700">{children}</ol>;
      case 'li':
        return <li key={node.uid || index}>{children}</li>;
      case 'a':
        return (
          <a 
            key={node.uid || index} 
            href={node.attrs?.url} 
            target={node.attrs?.target}
            className="text-emerald-600 hover:text-emerald-700 underline"
          >
            {children}
          </a>
        );
      case 'blockquote':
        return (
          <blockquote key={node.uid || index} className="border-l-4 border-emerald-500 pl-4 italic text-slate-600 my-6">
            {children}
          </blockquote>
        );
      default:
        return <span key={node.uid || index}>{children}</span>;
    }
  });
}

export function TextBlock({ data }: Omit<TextBlockProps, 'locale'>) {
  const { content } = data;

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          {renderRichText(content)}
        </div>
      </div>
    </section>
  );
}
