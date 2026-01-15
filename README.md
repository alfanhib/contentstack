# Pepperstone Website

Modern, enterprise-grade company website built with Next.js 16, Contentstack CMS, and Static Site Generation.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [Contentstack](https://www.contentstack.com/) | Headless CMS |
| [TanStack Query](https://tanstack.com/query) | Data fetching & caching |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety |

## Features

- **Static Site Generation (SSG)** - Pre-rendered pages for optimal SEO
- **Multi-region Support** - `/en`, `/id`, `/th`, `/ar` URL structure
- **RTL Support** - Right-to-left layout for Arabic
- **Type-safe CMS Integration** - Contentstack with TypeScript types
- **Enterprise Architecture** - Feature-based, scalable structure

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Contentstack account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pepperstone

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your Contentstack credentials:

```env
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_ENVIRONMENT=production
CONTENTSTACK_REGION=eu
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Generates static HTML in the `out/` directory.

## Project Structure

```
pepperstone/
├── app/                      # Next.js App Router
│   ├── [locale]/             # Dynamic locale routes
│   │   ├── layout.tsx        # Locale-specific layout
│   │   └── page.tsx          # Locale homepage
│   ├── layout.tsx            # Root layout
│   └── globals.css
│
├── config/                   # Configuration files
│   ├── locales.ts            # Supported locales
│   └── site.ts               # Site metadata
│
├── src/
│   ├── components/           # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Header, Footer, etc
│   │   └── blocks/           # CMS block components
│   │
│   ├── lib/                  # Core libraries
│   │   ├── api/              # External API client
│   │   ├── contentstack/     # CMS integration
│   │   ├── query/            # TanStack Query setup
│   │   └── utils/            # Utilities
│   │
│   ├── services/             # Business logic
│   │   └── content/          # Content services
│   │
│   ├── types/                # TypeScript definitions
│   │   ├── api/              # External API types
│   │   └── contentstack/     # CMS content types
│   │
│   └── i18n/                 # Internationalization
│       ├── config.ts
│       └── dictionaries/     # Translation files
│
└── public/                   # Static assets
```

## Path Aliases

```typescript
import { cn } from '@/lib/utils';           // src/*
import { siteConfig } from '@config/site';   // config/*
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (static) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Supported Locales

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English | LTR |
| `id` | Indonesia | LTR |
| `th` | ไทย | LTR |
| `ar` | العربية | RTL |

Add new locales in `config/locales.ts`.

## Adding Content Types

1. Create content type in Contentstack
2. Add TypeScript interface in `src/types/contentstack/content-types.ts`
3. Create service in `src/services/content/`
4. Create block component in `src/components/blocks/`

## Contributing

1. Create feature branch
2. Make changes
3. Run `npm run lint` and `npm run build`
4. Submit pull request

## License

Proprietary - Pepperstone Group Limited
