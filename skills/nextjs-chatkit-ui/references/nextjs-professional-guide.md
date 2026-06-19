# Professional Website Building Guide

## MANDATORY: Read This Before Building ANY Website

This guide defines how to build **professional, detailed, animated websites** that compete with high-end agency output. Every website you build MUST follow these standards — regardless of whether the user asks for "professional" or not. **Professional is the default.**

---

## Core Principle: No Basic Websites

```
FORBIDDEN OUTPUT:
- Static pages with plain text and buttons
- Hero sections with just title + subtitle + CTA
- Sections without scroll animations
- Pages with fewer than 8 sections
- Generic placeholder copy ("Feature 1", "Description here")
- Components without hover/interaction states
- Layouts without visual rhythm (alternating backgrounds, spacing variation)

REQUIRED OUTPUT:
- Every section animated (scroll reveal minimum)
- Hero section with layered animations (text reveal + background effect + stats)
- Minimum 10-15 sections per homepage
- Niche-specific, conversion-focused copy
- Micro-interactions on all interactive elements
- Design system with consistent tokens
- Mobile-first responsive design with different mobile layouts
```

---

## Professional Website Anatomy (Minimum 12-15 Sections)

Every homepage MUST include these sections in this order. Adapt naming/content to niche but keep the structure:

| # | Section | Purpose | Required Animations |
|---|---------|---------|---------------------|
| 1 | **Hero** | First impression, value proposition | TextReveal on heading, ParallaxLayers or gradient animation on background, staggered fade for subtitle + CTAs, floating decorative elements |
| 2 | **Social Proof Strip** | Trust signals immediately after hero | Marquee auto-scroll for logos/badges, counter animation for numbers |
| 3 | **Problem/Pain** | Identify user's pain point | ScrollReveal fade-in, icon animations |
| 4 | **Solution/Features** | How you solve it (3-6 features) | StaggerChildren on feature cards, AnimatedCard hover effects (lift/tilt), icon entrance animations |
| 5 | **How It Works** | 3-step process | Staggered numbered steps with connecting line animation, ScrollReveal per step |
| 6 | **Showcase/Portfolio** | Visual proof (gallery, screenshots, menu) | Image grid with hover zoom/overlay, lightbox, category filter tabs with animated indicator |
| 7 | **Stats/Metrics** | Quantified credibility | Animated counter (scroll-triggered number count-up), ScrollReveal on stat cards |
| 8 | **Testimonials** | Social proof from customers | Auto-play carousel with manual nav, star rating animation, quote fade transitions |
| 9 | **Pricing** (if applicable) | Clear pricing tiers | Monthly/yearly toggle with animated switch, AnimatedCard hover on plan cards, highlighted "popular" plan with pulse/glow |
| 10 | **FAQ** | Objection handling | Accordion with smooth height animation, rotate chevron icon, staggered reveal |
| 11 | **CTA Banner** | Conversion push | Gradient background animation, pulse effect on button, ParallaxSection |
| 12 | **Contact/Form** | Lead capture | Form field focus animations, validation state transitions, success checkmark animation |
| 13 | **Footer** | Navigation + trust | Staggered link columns, hover underline animations, social icon hover effects |

**Optional Bonus Sections (add 2-3 based on niche):**

| Section | Best For | Animation |
|---------|----------|-----------|
| Blog/Resources preview | SaaS, Agency, Education | Card grid with StaggerChildren |
| Team members | Agency, Clinic, Education | Card flip or hover reveal for bio |
| Partners/Integrations | SaaS, E-commerce | Logo marquee with grayscale→color hover |
| Events/Schedule | Education, Clinic | Timeline with scroll-triggered steps |
| Before/After | Portfolio, Agency, Clinic | Comparison slider with drag interaction |
| Map/Location | Restaurant, Clinic, any local | Fade-in with pin drop animation |
| Newsletter signup | All niches | Input focus glow, success animation |
| Video/Demo | SaaS, Education | Play button pulse, modal with overlay fade |

---

## Hero Section Blueprint (CRITICAL)

The hero section makes or breaks the website. Never build a basic hero. Every hero MUST have these layers:

### Layer 1: Background
Choose ONE:
```tsx
// Option A: Animated gradient
<div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 animate-gradient" />

// Option B: Parallax image with overlay
<ParallaxSection backgroundImage="/hero-bg.jpg" speed={0.3}>
  <div className="absolute inset-0 bg-black/50" />
</ParallaxSection>

// Option C: Subtle pattern/grid with floating orbs
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]" />
// + animated floating blur circles using motion.div with infinite y animation
```

### Layer 2: Content (Animated)
```tsx
// Heading — ALWAYS use TextReveal
<TextReveal splitBy="words" onScroll={false}> {/* animate on mount, not scroll */}
  <h1 className="text-5xl md:text-7xl font-bold">
    {niche-specific headline}
  </h1>
</TextReveal>

// Subtitle — staggered fade after heading
<motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6, duration: 0.5 }}
  className="text-xl text-gray-300 max-w-2xl"
>
  {compelling subtitle}
</motion.p>

// CTA buttons — staggered after subtitle
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.9, duration: 0.5 }}
  className="flex gap-4"
>
  <AnimatedButton variant="glow">{primary CTA}</AnimatedButton>
  <AnimatedButton variant="scale">{secondary CTA}</AnimatedButton>
</motion.div>
```

### Layer 3: Visual Element
Choose ONE:
- Product screenshot/mockup with shadow and tilt
- Interactive widget (search bar, demo, calculator)
- Decorative floating elements (cards, icons rotating)
- Video thumbnail with animated play button

### Layer 4: Trust Strip (Below Hero)
```tsx
// Stats strip — immediately below hero
<div className="border-t border-white/10 bg-black/20 backdrop-blur">
  <div className="container mx-auto flex justify-around py-6">
    <AnimatedCounter end={500} suffix="+" label="Customers" />
    <AnimatedCounter end={98} suffix="%" label="Satisfaction" />
    <AnimatedCounter end={24} suffix="/7" label="Support" />
    <AnimatedCounter end={10} suffix="+" label="Years" />
  </div>
</div>
```

---

## Animation Decision Matrix

Use this to decide which animation to apply WHERE:

### By Section Type

| Section Type | Primary Animation | Secondary Animation | Micro-Interaction |
|-------------|-------------------|---------------------|-------------------|
| Hero | TextReveal + Parallax/Gradient | Staggered CTA fade | AnimatedButton glow/scale |
| Cards (Features, Pricing, Team) | StaggerChildren on grid | ScrollReveal on container | AnimatedCard lift/tilt on hover |
| Stats/Numbers | AnimatedCounter (count up) | ScrollReveal fade-in | — |
| Testimonials | Carousel auto-play | Quote fade transition | Star rating fill animation |
| Text Content (About, Problem) | ScrollReveal direction="up" | — | — |
| Images/Gallery | ScrollReveal with scale | Hover zoom/overlay | Lightbox fade |
| Forms | — | — | Input focus glow, validation shake, success check |
| CTA Banners | ParallaxSection | Gradient animation | AnimatedButton pulse |
| FAQ/Accordion | — | Smooth height transition | Chevron rotate |
| Navigation | — | — | Hover underline, mobile slide drawer |
| Logo Strips | Marquee auto-scroll | — | Grayscale→color on hover |
| Process/Steps | StaggerChildren | Connecting line draw (SVG) | Number entrance animation |

### By Element Type

| Element | Animation |
|---------|-----------|
| Headings (h1-h3) | TextReveal (words) for hero, ScrollReveal for others |
| Paragraphs | ScrollReveal direction="up" with 0.2s delay after heading |
| Buttons | AnimatedButton (scale for secondary, glow for primary) |
| Cards | AnimatedCard with lift hover, ScrollReveal for entrance |
| Images | ScrollReveal with scale, hover zoom for galleries |
| Icons | Entrance: scale from 0, or fade + slight rotate |
| Dividers/Lines | Width animation from 0 to 100% on scroll |
| Badges/Tags | PopIn animation (scale from 0.8 to 1 with spring) |

---

## Design System (Apply to Every Website)

### Spacing Scale (8px Grid)

```tsx
// tailwind.config.ts - extend spacing
spacing: {
  'section': '6rem',      // 96px — between sections (mobile)
  'section-lg': '8rem',   // 128px — between sections (desktop)
  'content': '3rem',      // 48px — between content blocks
  'element': '1.5rem',    // 24px — between elements
  'tight': '0.75rem',     // 12px — between tightly grouped elements
}
```

### Typography Scale

```tsx
// Use clamp() for fluid typography
fontSize: {
  'display': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
  'h1': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
  'h2': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
  'h3': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.3', fontWeight: '600' }],
  'body-lg': ['1.125rem', { lineHeight: '1.7' }],
  'body': ['1rem', { lineHeight: '1.7' }],
  'small': ['0.875rem', { lineHeight: '1.6' }],
  'xs': ['0.75rem', { lineHeight: '1.5' }],
}
```

### Shadow System

```tsx
boxShadow: {
  'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'elevated': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  'floating': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  'inner-glow': 'inset 0 1px 0 0 rgb(255 255 255 / 0.05)',
}
```

### Border Radius System

```tsx
borderRadius: {
  'sm': '0.375rem',    // 6px — small elements (badges, tags)
  'md': '0.5rem',      // 8px — buttons, inputs
  'lg': '0.75rem',     // 12px — cards
  'xl': '1rem',        // 16px — large cards, modals
  '2xl': '1.5rem',     // 24px — hero elements, featured cards
  '3xl': '2rem',       // 32px — floating panels
}
```

### Color System Structure

Always define colors with semantic naming. Use theme-factory for palette, then map to semantic tokens:

```css
/* globals.css */
:root {
  /* Surface colors */
  --surface-primary: theme('colors.white');
  --surface-secondary: theme('colors.gray.50');
  --surface-tertiary: theme('colors.gray.100');
  --surface-inverse: theme('colors.gray.900');

  /* Text colors */
  --text-primary: theme('colors.gray.900');
  --text-secondary: theme('colors.gray.600');
  --text-tertiary: theme('colors.gray.400');
  --text-inverse: theme('colors.white');

  /* Border colors */
  --border-primary: theme('colors.gray.200');
  --border-secondary: theme('colors.gray.100');
  --border-focus: theme('colors.primary.500');

  /* Interactive states */
  --interactive-hover: theme('colors.primary.50');
  --interactive-active: theme('colors.primary.100');
}
```

### Section Background Pattern

Alternate section backgrounds for visual rhythm:

```
Section 1 (Hero):     Dark/gradient background — white text
Section 2 (Logos):    Light gray (--surface-secondary)
Section 3 (Problem):  White (--surface-primary)
Section 4 (Features): Light gray (--surface-secondary)
Section 5 (How):      White
Section 6 (Gallery):  Dark (--surface-inverse)
Section 7 (Stats):    Primary color gradient
Section 8 (Testimonials): Light gray
Section 9 (Pricing):  White
Section 10 (FAQ):     Light gray
Section 11 (CTA):     Dark/gradient
Section 12 (Contact): White
Section 13 (Footer):  Dark
```

---

## Missing Component Patterns (Build These When Needed)

### Animated Counter (Scroll-Triggered)

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  label: string
}

export function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '', label }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = end / (duration * 60) // 60fps
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  )
}
```

### Marquee/Infinite Scroll

```tsx
'use client'

interface MarqueeProps {
  children: React.ReactNode
  speed?: number // pixels per second
  pauseOnHover?: boolean
  direction?: 'left' | 'right'
}

export function Marquee({ children, speed = 40, pauseOnHover = true, direction = 'left' }: MarqueeProps) {
  const animationDirection = direction === 'left' ? 'normal' : 'reverse'

  return (
    <div className="overflow-hidden relative" style={{ ['--marquee-speed' as string]: `${speed}s` }}>
      <div
        className={`flex gap-12 w-max ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: `marquee var(--marquee-speed) linear infinite`,
          animationDirection,
        }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>

      {/* Add to globals.css:
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      */}
    </div>
  )
}
```

### Animated Accordion

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface AccordionItem {
  question: string
  answer: string
}

export function AnimatedAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-lg">{item.question}</span>
            <motion.span
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.span>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
```

### Animated Tabs

```tsx
'use client'
import { useState } from 'react'
import { motion } from 'motion/react'

interface Tab {
  label: string
  content: React.ReactNode
}

export function AnimatedTabs({ tabs }: { tabs: Tab[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <div className="flex border-b border-gray-200 relative">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`px-6 py-3 text-sm font-medium relative z-10 transition-colors ${
              activeIndex === i ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeIndex === i && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {tabs[activeIndex].content}
      </motion.div>
    </div>
  )
}
```

### Pricing Toggle (Monthly/Yearly)

```tsx
'use client'
import { useState } from 'react'
import { motion } from 'motion/react'

export function PricingToggle({ onChange }: { onChange: (yearly: boolean) => void }) {
  const [isYearly, setIsYearly] = useState(false)

  const toggle = () => {
    setIsYearly(!isYearly)
    onChange(!isYearly)
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
      <button
        onClick={toggle}
        className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors"
        style={{ backgroundColor: isYearly ? 'var(--color-primary-600)' : undefined }}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow"
          animate={{ x: isYearly ? 28 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
        Yearly
        <span className="ml-1 text-xs text-green-600 font-semibold">Save 20%</span>
      </span>
    </div>
  )
}
```

### Sticky Header with Scroll-Aware Background

```tsx
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-subtle border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </motion.header>
  )
}
```

---

## SEO & Meta Tags (Apply to Every Website)

### Root Layout Metadata

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://{domain}'),
  title: {
    default: '{Business Name} — {Tagline}',
    template: '%s | {Business Name}',
  },
  description: '{150-160 char description with primary keyword}',
  keywords: ['{keyword1}', '{keyword2}', '{keyword3}'],
  authors: [{ name: '{Business Name}' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://{domain}',
    siteName: '{Business Name}',
    title: '{Business Name} — {Tagline}',
    description: '{description}',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: '{Business Name}' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '{Business Name} — {Tagline}',
    description: '{description}',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Per-Page Metadata

```tsx
// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About Us',
  description: '{page-specific description}',
}
```

### Structured Data (JSON-LD)

```tsx
// app/layout.tsx — add to <head>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': '{LocalBusiness|Organization|Restaurant|MedicalBusiness}',
      name: '{Business Name}',
      description: '{description}',
      url: 'https://{domain}',
      telephone: '{phone}',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '{street}',
        addressLocality: '{city}',
        addressRegion: '{state}',
        postalCode: '{zip}',
      },
    }),
  }}
/>
```

---

## Image Optimization Patterns

### Hero Image (Above the Fold)

```tsx
import Image from 'next/image'

// PRIORITY loading for above-the-fold images
<Image
  src="/hero-image.jpg"
  alt="{descriptive alt text}"
  width={1200}
  height={600}
  priority // disables lazy loading
  className="object-cover"
  sizes="100vw"
/>
```

### Below-the-Fold Images

```tsx
// Default lazy loading (automatic)
<Image
  src="/feature-image.jpg"
  alt="{descriptive alt text}"
  width={600}
  height={400}
  className="object-cover rounded-xl"
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..." // tiny base64 blur
/>
```

### Background Image Pattern

```tsx
// For decorative backgrounds, use CSS not next/image
<div
  className="relative bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: 'url(/pattern-bg.svg)' }}
>
  <div className="absolute inset-0 bg-black/60" /> {/* overlay */}
  <div className="relative z-10">{content}</div>
</div>
```

---

## Responsive Design Patterns

### Mobile Navigation

```tsx
// Always use slide drawer on mobile, not just hamburger toggle
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={close}
      />
      {/* Drawer */}
      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-floating p-6"
      >
        {navLinks}
      </motion.nav>
    </>
  )}
</AnimatePresence>
```

### Fluid Typography (Already in Design System)

Always use `clamp()` — never fixed font sizes for headings.

### Mobile-First Section Rules

```
- Hero: Stack vertically, reduce heading size, full-width CTA buttons
- Feature cards: Single column stack (not 3-column grid)
- Stats: 2x2 grid (not 4 in a row)
- Testimonials: Single card view with swipe
- Pricing: Stack cards vertically, sticky bottom CTA
- Gallery: 2-column grid (not 3-4)
- Footer: Single column, collapsible link sections
```

### Touch Targets

```tsx
// ALL clickable elements: minimum 44px touch target
className="min-h-[44px] min-w-[44px]"

// Buttons
className="px-6 py-3" // minimum padding for touch
```

---

## Copy & Content Guidelines

### Headline Formulas

Use these patterns to generate niche-specific headlines:

```
HERO HEADLINE FORMULAS:
1. "[Outcome] Without [Pain Point]"
   → "Delicious Food Delivered Without The Wait"

2. "[Adjective] [Product/Service] for [Audience]"
   → "Intelligent Analytics for Modern Investors"

3. "The [Category] That [Unexpected Benefit]"
   → "The Clinic That Feels Like Home"

4. "Stop [Pain]. Start [Benefit]."
   → "Stop Guessing. Start Growing."

5. "[Number] [Audience] Trust Us to [Outcome]"
   → "10,000+ Businesses Trust Us to Scale"
```

### CTA Button Text

```
STRONG CTAs (use these):
- "Get Started Free"
- "Book Your Table"
- "Schedule a Call"
- "See It In Action"
- "Start Your Trial"
- "Get Your Report"
- "Reserve Your Spot"

WEAK CTAs (never use):
- "Submit"
- "Click Here"
- "Learn More" (only for secondary CTAs)
- "Read More"
```

### Social Proof Formatting

```
ALWAYS use specific numbers:
✅ "Trusted by 2,500+ restaurants worldwide"
✅ "98.7% customer satisfaction rate"
✅ "$12M+ revenue generated for clients"
✅ "4.9/5 average rating from 1,200 reviews"

NEVER use vague claims:
❌ "Trusted by many businesses"
❌ "High customer satisfaction"
❌ "Lots of revenue generated"
```

---

## Performance Checklist

Apply to every website:

```tsx
// 1. Font optimization — in layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // prevents FOIT
  variable: '--font-inter',
})

// 2. Dynamic imports for heavy components
import dynamic from 'next/dynamic'
const HeavyCarousel = dynamic(() => import('@/components/Carousel'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />,
})

// 3. Image sizes attribute (always specify)
<Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

// 4. Lazy load below-fold sections
const BelowFoldSection = dynamic(() => import('@/components/sections/Stats'))
```

---

## Niche-Specific Section Maps

When user says "build me a [niche] website", use these expanded section maps:

### Restaurant (15 sections)
1. Hero (food imagery, "Reserve" CTA, opening hours overlay)
2. Social proof strip (review scores, "Featured in" badges)
3. Story/About (chef story, restaurant history)
4. Menu highlights (top 6 dishes with images, "See Full Menu" CTA)
5. How it works (Reserve → Visit → Enjoy)
6. Full menu page link / Category tabs
7. Chef/Team spotlight
8. Stats (Years open, dishes served, 5-star reviews count)
9. Testimonials carousel
10. Gallery (interior, food, events)
11. Events/Specials (weekly events, happy hour)
12. Location + map + hours
13. Reservation form / Online ordering CTA
14. Newsletter + social links
15. Footer

### SaaS (15 sections)
1. Hero (product screenshot, demo CTA, trust badges)
2. Logo strip (customer logos marquee)
3. Problem statement
4. Features grid (6 features with icons)
5. How it works (3 steps)
6. Product showcase (screenshots/demo video)
7. Integration partners
8. Stats (users, uptime, data processed)
9. Testimonials
10. Pricing (3 tiers with toggle)
11. Comparison table (vs competitors)
12. FAQ
13. CTA banner ("Start free trial")
14. Blog preview (3 latest posts)
15. Footer

### Portfolio/Agency (15 sections)
1. Hero (bold statement, work reel/showreel)
2. Client logos marquee
3. Services overview (4-6 services)
4. Featured projects (3 case studies with hover)
5. Process (Discovery → Design → Develop → Launch)
6. Full portfolio grid with filter
7. Stats (projects completed, clients, awards)
8. Testimonials
9. Team members
10. Tech stack / Tools
11. Blog/Insights preview
12. Awards/Recognition
13. CTA ("Let's work together")
14. Contact form
15. Footer

### Clinic/Medical (15 sections)
1. Hero (caring imagery, "Book Appointment" CTA, emergency number)
2. Trust strip (certifications, insurance accepted)
3. Services overview (6 specialties)
4. Why choose us / Differentiators
5. How it works (Book → Visit → Care)
6. Doctor profiles (photo, specialty, credentials)
7. Stats (patients treated, years experience, success rate)
8. Testimonials
9. Facilities gallery
10. Insurance/Payment info
11. FAQ
12. Location + hours + map
13. Appointment booking form
14. Emergency CTA banner
15. Footer

### E-commerce (15 sections)
1. Hero (featured product, sale banner, shop CTA)
2. Trust strip (shipping, returns, secure checkout badges)
3. Category showcase (4-6 product categories)
4. Featured/Bestseller products (8 products grid)
5. Value propositions (free shipping, guarantee, etc.)
6. New arrivals carousel
7. Special offer / Sale banner
8. Customer reviews
9. Stats (products, customers, orders shipped)
10. Instagram/Social feed
11. Brand story
12. FAQ (shipping, returns, sizing)
13. Newsletter signup (with discount incentive)
14. CTA ("Shop Now" banner)
15. Footer

### Education (15 sections)
1. Hero (learning imagery, "Explore Courses" CTA)
2. Trust strip (students enrolled, course ratings, completion rate)
3. Popular courses (6 course cards)
4. Learning paths / Categories
5. How it works (Enroll → Learn → Certify)
6. Featured instructors
7. Stats (courses, students, countries)
8. Student testimonials
9. Course preview / Free lesson CTA
10. Pricing/Membership plans
11. Certifications/Partnerships
12. Blog/Resources
13. FAQ
14. Community CTA
15. Footer

---

## Implementation Workflow

When building a professional website, follow this exact order:

```
1. DETECT NICHE from user message
2. SELECT section map from this guide (12-15 sections)
3. LOAD theme-factory → pick or create theme
4. LOAD nextjs-animations → will use components from assets/
5. SET UP design system (spacing, typography, shadows, colors in tailwind.config.ts + globals.css)
6. BUILD layout first (StickyHeader + Footer)
7. BUILD Hero section (most critical — follow Hero Blueprint above)
8. BUILD remaining sections top-to-bottom
9. APPLY animations to every section using Animation Decision Matrix
10. ADD SEO metadata + structured data
11. OPTIMIZE images + performance
12. TEST responsive (mobile, tablet, desktop)
13. RUN npm run build — fix any errors
```

---

## Quality Checklist (Before Delivery)

Every website MUST pass this checklist:

- [ ] Minimum 12 sections on homepage
- [ ] Hero section has 4 layers (background, content, visual, trust strip)
- [ ] Every section has scroll animation (minimum ScrollReveal)
- [ ] All buttons have hover animation (AnimatedButton)
- [ ] All cards have hover effect (AnimatedCard)
- [ ] Stats have counter animation
- [ ] Testimonials in carousel with auto-play
- [ ] FAQ has smooth accordion animation
- [ ] Navigation is sticky with scroll-aware background
- [ ] Mobile has slide drawer navigation
- [ ] All text uses fluid typography (clamp)
- [ ] All images use next/image with proper sizes
- [ ] SEO metadata + Open Graph tags set
- [ ] Structured data (JSON-LD) added
- [ ] Section backgrounds alternate for visual rhythm
- [ ] Design tokens consistent (spacing, shadows, radius)
- [ ] CTA copy is action-oriented (not generic)
- [ ] Social proof uses specific numbers
- [ ] npm run build passes without errors
