# Next.js Design System Reference

Complete design token system for professional websites. Apply these tokens to EVERY website via `tailwind.config.ts` and `globals.css`.

---

## Tailwind Config — Full Professional Setup

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Container
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
      },
    },

    extend: {
      // ─── COLOR SYSTEM ───
      // Replace primary with niche-appropriate palette from theme-factory
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },

      // ─── TYPOGRAPHY SCALE (Fluid with clamp) ───
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'h1': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['clamp(1.125rem, 1.5vw, 1.375rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },

      // ─── SPACING (8px grid + section spacing) ───
      spacing: {
        '4.5': '1.125rem',   // 18px
        '13': '3.25rem',     // 52px
        '15': '3.75rem',     // 60px
        '18': '4.5rem',      // 72px
        'section': '5rem',        // 80px — section padding mobile
        'section-lg': '7rem',     // 112px — section padding desktop
        'content': '3rem',        // 48px — between content blocks
        'element': '1.5rem',      // 24px — between elements
      },

      // ─── SHADOW SYSTEM (5 levels) ───
      boxShadow: {
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'elevated': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'floating': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner-glow': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'colored': '0 10px 25px -5px var(--shadow-color, rgb(59 130 246 / 0.3))',
      },

      // ─── BORDER RADIUS ───
      borderRadius: {
        'sm': '0.375rem',    // 6px — badges, tags
        'md': '0.5rem',      // 8px — buttons, inputs
        'lg': '0.75rem',     // 12px — cards
        'xl': '1rem',        // 16px — large cards
        '2xl': '1.5rem',     // 24px — hero elements
        '3xl': '2rem',       // 32px — floating panels
      },

      // ─── ANIMATIONS ───
      keyframes: {
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 var(--glow-color, rgb(59 130 246 / 0.4))' },
          '50%': { boxShadow: '0 0 20px 4px var(--glow-color, rgb(59 130 246 / 0.2))' },
        },
      },
      animation: {
        'marquee': 'marquee var(--marquee-speed, 40s) linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'gradient': 'gradient-shift 6s ease infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },

      // ─── TRANSITIONS ───
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },

      // ─── BACKDROP BLUR ───
      backdropBlur: {
        'xs': '2px',
      },

      // ─── Z-INDEX SCALE ───
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Global CSS — Semantic Tokens

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ─── SURFACE COLORS ─── */
    --surface-primary: 255 255 255;       /* white */
    --surface-secondary: 249 250 251;     /* gray-50 */
    --surface-tertiary: 243 244 246;      /* gray-100 */
    --surface-inverse: 17 24 39;          /* gray-900 */
    --surface-elevated: 255 255 255;      /* white (with shadow) */

    /* ─── TEXT COLORS ─── */
    --text-primary: 17 24 39;             /* gray-900 */
    --text-secondary: 75 85 99;           /* gray-600 */
    --text-tertiary: 156 163 175;         /* gray-400 */
    --text-inverse: 255 255 255;          /* white */
    --text-link: var(--color-primary-600);

    /* ─── BORDER COLORS ─── */
    --border-primary: 229 231 235;        /* gray-200 */
    --border-secondary: 243 244 246;      /* gray-100 */
    --border-focus: var(--color-primary-500);

    /* ─── SECTION RHYTHM ─── */
    --section-gap: 5rem;
    --section-gap-lg: 7rem;

    /* ─── INTERACTIVE FEEDBACK ─── */
    --ring-color: var(--color-primary-100);
    --ring-width: 4px;
  }

  /* ─── SMOOTH SCROLL ─── */
  html {
    scroll-behavior: smooth;
  }

  /* ─── SELECTION ─── */
  ::selection {
    background-color: rgb(var(--color-primary-100, 219 234 254));
    color: rgb(var(--color-primary-900, 30 58 138));
  }

  /* ─── BASE TYPOGRAPHY ─── */
  body {
    @apply text-body antialiased;
    color: rgb(var(--text-primary));
    background-color: rgb(var(--surface-primary));
  }

  /* ─── HEADING DEFAULTS ─── */
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold tracking-tight;
    text-wrap: balance;
  }

  /* ─── PARAGRAPH DEFAULTS ─── */
  p {
    text-wrap: pretty;
  }

  /* ─── FOCUS RING (Accessibility) ─── */
  *:focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2;
  }
}

@layer components {
  /* ─── SECTION WRAPPER ─── */
  .section {
    @apply py-section lg:py-section-lg;
  }

  .section-header {
    @apply mx-auto max-w-2xl text-center mb-12 lg:mb-16;
  }

  .section-label {
    @apply text-sm font-semibold text-primary-600 uppercase tracking-wider;
  }

  .section-title {
    @apply mt-2 text-h2 text-gray-900;
  }

  .section-subtitle {
    @apply mt-4 text-body-lg text-gray-600;
  }

  /* ─── CARD BASE ─── */
  .card {
    @apply rounded-2xl border border-gray-200 bg-white p-8 shadow-card;
    @apply transition-all duration-200;
  }

  .card-hover {
    @apply hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1;
  }

  /* ─── GRADIENT TEXT ─── */
  .gradient-text {
    @apply bg-clip-text text-transparent;
    @apply bg-gradient-to-r from-primary-600 to-primary-400;
  }

  /* ─── ANIMATED GRADIENT BACKGROUND ─── */
  .animated-gradient {
    background-size: 200% 200%;
    @apply animate-gradient;
  }

  /* ─── GLASS EFFECT ─── */
  .glass {
    @apply bg-white/80 backdrop-blur-lg border border-white/20;
  }

  .glass-dark {
    @apply bg-gray-900/80 backdrop-blur-lg border border-white/10;
  }
}

@layer utilities {
  /* ─── MARQUEE ANIMATION ─── */
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* ─── TEXT BALANCE ─── */
  .text-balance {
    text-wrap: balance;
  }

  .text-pretty {
    text-wrap: pretty;
  }

  /* ─── HIDE SCROLLBAR ─── */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## Color Palette Selection by Niche

When building for a specific niche, use these color guidelines:

| Niche | Primary Color Family | Accent | Mood |
|-------|---------------------|--------|------|
| Restaurant | Warm red/orange (`#DC2626` family) | Gold/cream | Appetizing, warm |
| Fine Dining | Deep navy/burgundy (`#1E1B4B`) | Gold (`#D4AF37`) | Luxury, exclusive |
| Clinic/Medical | Blue/teal (`#0D9488` family) | Light green | Trust, calm, clean |
| SaaS/Tech | Blue/violet (`#2563EB` or `#7C3AED`) | Cyan | Modern, reliable |
| Portfolio/Creative | Neutral/dark (`#171717`) | Vibrant accent | Minimal, artsy |
| Agency | Dark with bold accent (`#0F172A` + `#F59E0B`) | Orange/yellow | Bold, confident |
| E-commerce | Vibrant primary (`#7C3AED` or `#059669`) | Sale red | Energetic, actionable |
| Education | Blue/green (`#2563EB`) | Yellow/orange | Friendly, trustworthy |
| Real Estate | Navy/green (`#1E3A5F` or `#166534`) | Gold | Professional, premium |
| Fitness | Dark/energetic (`#18181B` + `#EF4444`) | Lime green | Bold, intense |

Always generate the full 50-950 scale for the chosen primary color.

---

## Typography Pairing Guide

| Niche | Heading Font | Body Font | Import |
|-------|-------------|-----------|--------|
| Modern/SaaS | Inter | Inter | `next/font/google` built-in |
| Premium/Luxury | Playfair Display | Inter | Google Fonts |
| Corporate/Finance | Plus Jakarta Sans | Plus Jakarta Sans | Google Fonts |
| Creative/Portfolio | Space Grotesk | Inter | Google Fonts |
| Medical/Health | DM Sans | DM Sans | Google Fonts |
| Restaurant | Cormorant Garamond | Lato | Google Fonts |
| Tech/Startup | Outfit | Outfit | Google Fonts |
| Generic/Safe | Geist Sans | Geist Sans | `next/font/local` |

### Font Setup in Next.js

```typescript
// app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const heading = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['600', '700'],
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  )
}
```

```css
/* globals.css addition */
@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading), system-ui, sans-serif;
  }
  body {
    font-family: var(--font-body), system-ui, sans-serif;
  }
}
```

---

## Section Background Rhythm

Never stack same-colored sections. Follow this pattern:

```
┌──────────────────────────┐
│  Hero        → DARK      │  bg-gray-950 / gradient
├──────────────────────────┤
│  Logo Strip  → LIGHT     │  bg-gray-50
├──────────────────────────┤
│  Features    → WHITE     │  bg-white
├──────────────────────────┤
│  How It Works→ LIGHT     │  bg-gray-50
├──────────────────────────┤
│  Stats       → PRIMARY   │  bg-primary-600
├──────────────────────────┤
│  Gallery     → DARK      │  bg-gray-900
├──────────────────────────┤
│  Testimonials→ LIGHT     │  bg-gray-50
├──────────────────────────┤
│  Pricing     → WHITE     │  bg-white
├──────────────────────────┤
│  FAQ         → LIGHT     │  bg-gray-50
├──────────────────────────┤
│  CTA Banner  → GRADIENT  │  bg-gradient primary
├──────────────────────────┤
│  Contact     → WHITE     │  bg-white
├──────────────────────────┤
│  Newsletter  → LIGHT     │  bg-gray-50
├──────────────────────────┤
│  Footer      → DARK      │  bg-gray-900
└──────────────────────────┘
```

---

## Responsive Breakpoint Strategy

```
Mobile first: design for 375px width default
sm (640px):   small tablets, landscape phones
md (768px):   tablets
lg (1024px):  small laptops
xl (1200px):  desktops (container max-width)
```

### Common Responsive Patterns

```tsx
// Grid columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Section padding
className="py-section lg:py-section-lg"

// Font sizing (handled by clamp, no breakpoints needed)
className="text-h2" // already responsive via clamp

// Hide/show
className="hidden md:block"  // show on tablet+
className="md:hidden"        // show only mobile

// Spacing
className="gap-6 lg:gap-8"
className="px-4 lg:px-0"
```
