# Next.js SEO & Performance Reference

Complete SEO setup and performance optimization patterns. Apply to EVERY website.

---

## SEO Metadata Setup

### Root Layout (Site-Wide)

```typescript
// app/layout.tsx
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://{DOMAIN}'),
  title: {
    default: '{Business Name} — {Tagline}',
    template: '%s | {Business Name}',
  },
  description: '{150-160 character description with primary keyword early}',
  keywords: ['{primary keyword}', '{secondary keyword}', '{location if local}'],
  authors: [{ name: '{Business Name}', url: 'https://{DOMAIN}' }],
  creator: '{Business Name}',

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://{DOMAIN}',
    siteName: '{Business Name}',
    title: '{Business Name} — {Tagline}',
    description: '{description}',
    images: [{
      url: '/og-image.jpg',   // 1200x630px recommended
      width: 1200,
      height: 630,
      alt: '{Business Name} — {Tagline}',
    }],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '{Business Name} — {Tagline}',
    description: '{description}',
    images: ['/og-image.jpg'],
    creator: '@{twitter_handle}',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Manifest (PWA)
  manifest: '/site.webmanifest',
}
```

### Per-Page Metadata

```typescript
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',   // becomes "About Us | Business Name" via template
  description: 'Learn about {Business Name} — our story, mission, and the team behind {product/service}.',
  openGraph: {
    title: 'About {Business Name}',
    description: 'Our story and mission.',
  },
}
```

---

## Structured Data (JSON-LD)

Add to layout.tsx `<head>` or individual pages.

### Local Business (Restaurant, Clinic, etc.)

```typescript
// components/seo/LocalBusinessSchema.tsx
export function LocalBusinessSchema({
  name, description, url, phone, address, image, priceRange, openingHours,
}: {
  name: string
  description: string
  url: string
  phone: string
  address: { street: string; city: string; state: string; zip: string; country: string }
  image: string
  priceRange?: string
  openingHours?: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    telephone: phone,
    image,
    priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country,
    },
    openingHoursSpecification: openingHours,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### Organization (SaaS, Agency)

```typescript
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '{Business Name}',
  url: 'https://{DOMAIN}',
  logo: 'https://{DOMAIN}/logo.png',
  sameAs: [
    'https://twitter.com/{handle}',
    'https://linkedin.com/company/{handle}',
    'https://github.com/{handle}',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '{phone}',
    contactType: 'customer service',
  },
}
```

### FAQ Page Schema

```typescript
const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}
```

### Product/Service Schema

```typescript
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: '{Product Name}',
  description: '{description}',
  image: 'https://{DOMAIN}/product-image.jpg',
  offers: {
    '@type': 'Offer',
    price: '{price}',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1200',
  },
}
```

---

## Sitemap Generation

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://{DOMAIN}'

  // Static pages
  const staticPages = ['', '/about', '/contact', '/pricing', '/faq'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return staticPages
}
```

## Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://{DOMAIN}/sitemap.xml',
  }
}
```

---

## Image Optimization

### Priority (Above-the-Fold) Images

```tsx
import Image from 'next/image'

// Hero image — ALWAYS use priority
<Image
  src="/hero.jpg"
  alt="{descriptive alt text with keyword}"
  width={1200}
  height={600}
  priority                    // disables lazy loading
  sizes="100vw"              // full width
  className="object-cover"
  quality={85}               // good balance of quality/size
/>
```

### Below-the-Fold Images

```tsx
// Automatically lazy loaded (default behavior)
<Image
  src="/feature.jpg"
  alt="{descriptive alt text}"
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover rounded-xl"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,{tiny-base64-string}"
/>
```

### Responsive Sizes Guide

```
Full width hero:           sizes="100vw"
2-col grid item:           sizes="(max-width: 768px) 100vw, 50vw"
3-col grid item:           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
4-col grid item:           sizes="(max-width: 768px) 50vw, 25vw"
Sidebar image:             sizes="(max-width: 1024px) 100vw, 300px"
Avatar:                    sizes="48px" (or whatever fixed size)
Logo:                      sizes="120px"
```

### Background Image Pattern (CSS)

```tsx
// For decorative backgrounds where next/image doesn't make sense
<div
  className="relative bg-cover bg-center bg-no-repeat min-h-[400px]"
  style={{ backgroundImage: 'url(/pattern.svg)' }}
>
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
  <div className="relative z-10 container mx-auto px-4 py-20">
    {content}
  </div>
</div>
```

### Alt Text Strategy

```
GOOD alt text:
- "Freshly baked margherita pizza on a wooden table" (descriptive)
- "Dr. Sarah Chen, Lead Cardiologist" (person + role)
- "Dashboard showing real-time analytics data" (what it shows)

BAD alt text:
- "image1.jpg" (filename)
- "photo" (too generic)
- "" (empty — only for purely decorative images)

Decorative images (patterns, gradients): alt="" or role="presentation"
```

---

## Font Optimization

```typescript
// app/layout.tsx — ALWAYS use next/font
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',        // prevents invisible text during load
  variable: '--font-inter',
  preload: true,           // preloads the font file
})

// Apply font
<html className={inter.variable}>
<body className="font-sans">
```

### Using Multiple Fonts

```typescript
import { Inter, Playfair_Display } from 'next/font/google'

const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const heading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap', weight: ['600', '700'] })

<html className={`${body.variable} ${heading.variable}`}>
```

---

## Code Splitting & Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

// Heavy components — load only when needed
const TestimonialCarousel = dynamic(
  () => import('@/components/sections/Testimonials'),
  {
    loading: () => (
      <div className="h-80 animate-pulse bg-gray-100 rounded-xl" />
    ),
  }
)

// Components that use browser APIs
const MapSection = dynamic(
  () => import('@/components/sections/Map'),
  { ssr: false } // client-only
)

// Chat widget — always client-side
const ChatWidget = dynamic(
  () => import('@/components/chat/ChatWidget'),
  { ssr: false }
)
```

---

## Core Web Vitals Optimization

### LCP (Largest Contentful Paint) — Target < 2.5s

```
1. Hero image: use `priority` prop on next/image
2. Fonts: use next/font with display: 'swap'
3. Critical CSS: Tailwind purges unused CSS automatically
4. Above-fold content: no dynamic imports for hero section
```

### CLS (Cumulative Layout Shift) — Target < 0.1

```
1. Images: ALWAYS specify width and height
2. Fonts: use display: 'swap' + next/font (no FOUT shift)
3. Ads/embeds: reserve space with min-height
4. Dynamic content: use skeleton loaders with same dimensions
```

### INP (Interaction to Next Paint) — Target < 200ms

```
1. Event handlers: keep lightweight, debounce expensive operations
2. Animations: use transform/opacity only (GPU accelerated)
3. Lists: use virtualization for 50+ items
4. State updates: batch with startTransition for non-urgent updates
```

### Skeleton Loader Pattern

```tsx
// components/ui/Skeleton.tsx
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  )
}

// Usage
<Skeleton className="h-8 w-48" />       // text line
<Skeleton className="h-64 w-full" />     // image
<Skeleton className="h-4 w-full" />      // paragraph line
<Skeleton className="h-10 w-32" />       // button
```

---

## Next.js Config for Performance

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*).svg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

## Canonical URLs

```typescript
// For pages with duplicate content or query params
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://{DOMAIN}/products',
  },
}
```
