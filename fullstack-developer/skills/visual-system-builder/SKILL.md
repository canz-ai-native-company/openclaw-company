---
name: visual-system-builder
description: |
  Build the design tokens layer for a premium landing page — color, typography,
  spacing, radius, shadow, depth treatment, icon strategy, component primitives.
  Use during Phase 5 of the premium-landing-page workflow. Triggers on
  "design tokens", "visual system", "color system", "design system", "tailwind config".
---

# Visual System Builder

A landing page only feels premium when its tokens are deliberate. Random `bg-blue-500`
+ default Inter + Tailwind defaults = generic. This skill defines the tokens, ready
to drop into `tailwind.config.ts` and `globals.css`.

---

## Output

`specs/<project>/05-visual-system.md` + actual config files in the project.

---

## 1. Color System

### Token Architecture (Three Layers)

```
RAW palette → SEMANTIC tokens → COMPONENT classes
   (50-950 scales)   (surface, text,    (btn-primary,
                      border, accent)    card, input)
```

Always define semantic tokens. Never use raw colors directly in components.

### Recipe — Dark SaaS (Linear / Vercel feel)

```ts
// tailwind.config.ts (Tailwind v3) — for v4 use @theme inline in globals.css
const config = {
  theme: {
    extend: {
      colors: {
        // Raw — extended off Tailwind's neutral and a single accent
        accent: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',  // brand primary
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
    },
  },
}
```

```css
/* globals.css */
:root {
  /* Surfaces — dark default */
  --bg: 10 10 12;             /* near-black */
  --bg-raised: 18 18 22;      /* card surface */
  --bg-overlay: 24 24 28;     /* modal / popover */

  /* Text */
  --fg: 250 250 252;          /* primary text — off-white */
  --fg-muted: 161 161 170;    /* secondary */
  --fg-subtle: 113 113 122;   /* tertiary */

  /* Borders */
  --border: 255 255 255 / 0.08;
  --border-strong: 255 255 255 / 0.16;

  /* Accent */
  --accent: 139 92 246;       /* violet-500 */
  --accent-fg: 250 250 252;

  /* Semantic */
  --success: 34 197 94;
  --warning: 250 204 21;
  --danger: 239 68 68;

  /* Glow (dark theme signature) */
  --glow: 139 92 246 / 0.35;
}

@media (prefers-color-scheme: light) {
  /* Optional light mapping if dual mode */
}

* { border-color: rgb(var(--border)); }
body {
  background-color: rgb(var(--bg));
  color: rgb(var(--fg));
}
```

### Recipe — Editorial Light (Stripe / Notion feel)

```css
:root {
  --bg: 255 255 255;
  --bg-raised: 250 250 250;
  --bg-overlay: 255 255 255;

  --fg: 17 17 17;
  --fg-muted: 82 82 91;
  --fg-subtle: 113 113 122;

  --border: 0 0 0 / 0.08;
  --border-strong: 0 0 0 / 0.16;

  --accent: 99 102 241;       /* indigo-500 */
  --accent-fg: 255 255 255;
}
```

### Color Rules

- **One signature accent**, not three. A second accent only for state (success / warning).
- **Contrast ≥ 4.5:1** for body text on its surface. Test every combination.
- **Don't use pure black** (#000) on dark themes — it crushes shadows. Use 9-12% off.
- **Don't use pure white** (#fff) on light backgrounds for body text. Use 95%+ off.
- **Gradient accents**: define 2-3 stops, named (e.g., `--gradient-brand`,
  `--gradient-glow`). Reuse — don't invent per-section gradients.

---

## 2. Typography System

### Pairing (one display + one body, optional mono)

Recommended modern pairings (all free unless noted):

| Display | Body | Mono | Vibe |
|---------|------|------|------|
| Geist | Geist | Geist Mono | Vercel/Linear — modern dev |
| Cal Sans | Inter | JetBrains Mono | Cal.com — friendly modern |
| Inter Tight | Inter | JetBrains Mono | Crisp neutral |
| Instrument Serif | Inter | JetBrains Mono | Editorial luxury |
| Fraunces | Inter | — | Warm distinctive |
| Satoshi (paid free) | Satoshi | — | Modern distinctive |
| Söhne (paid) | Inter | — | Premium editorial |

### Fluid Type Scale

```ts
// tailwind.config.ts
fontSize: {
  'xs':       ['0.75rem',  { lineHeight: '1.5'  }],
  'sm':       ['0.875rem', { lineHeight: '1.6'  }],
  'base':     ['1rem',     { lineHeight: '1.7'  }],
  'lg':       ['1.125rem', { lineHeight: '1.7'  }],
  'xl':       ['1.25rem',  { lineHeight: '1.6'  }],
  '2xl':      ['1.5rem',   { lineHeight: '1.4'  }],
  // Fluid headings — clamp(min, vw, max)
  'h3':       ['clamp(1.25rem, 2vw,  1.75rem)', { lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '600' }],
  'h2':       ['clamp(1.5rem,  3vw,  2.5rem)',  { lineHeight: '1.2',  letterSpacing: '-0.02em', fontWeight: '600' }],
  'h1':       ['clamp(2rem,    4vw,  3.5rem)',  { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
  'display':  ['clamp(2.5rem,  5.5vw, 5rem)',   { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
  'hero':     ['clamp(3rem,    7vw,  6.5rem)',  { lineHeight: '1',    letterSpacing: '-0.04em', fontWeight: '600' }],
},
```

### Tracking & Leading Discipline

| Size | letter-spacing | line-height |
|------|----------------|-------------|
| Display / Hero | -0.03em to -0.04em | 1 to 1.05 |
| H1 / H2 | -0.02em | 1.15 to 1.2 |
| H3 | -0.01em | 1.3 |
| Body | 0 | 1.6 to 1.7 |
| Small / labels | 0.01em (sometimes uppercase) | 1.5 |

### Type Rules

- Display ALWAYS uses `text-balance` (CSS) and / or `text-wrap: balance`.
- Body ALWAYS uses `text-pretty` and `max-w-prose` (or 65ch).
- Never use < 14px for body. Never < 12px even for fine print on desktop.
- Mobile body baseline is 16px (default). Don't shrink it.
- Headlines on dark themes: use a subtle gradient (white → 70% white) for premium feel:
  `bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent`

---

## 3. Spacing System (8px Grid)

```ts
spacing: {
  // Tailwind defaults are fine. Add semantic tokens:
  'tight':       '0.5rem',   // 8 — within tightly grouped elements
  'snug':        '0.75rem',  // 12
  'element':     '1.5rem',   // 24 — between elements in a card
  'content':     '3rem',     // 48 — between content blocks
  'section':     '6rem',     // 96 — between sections (mobile)
  'section-lg':  '8rem',     // 128 — between sections (desktop)
  'hero':        'clamp(6rem, 12vw, 10rem)', // hero top padding
},
```

### Container

```tsx
// components/layout/Container.tsx
export function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  )
}
```

Standardize: `max-w-7xl` (1280px) for most sections, `max-w-5xl` (1024px) for narrow
content (hero text, FAQ), `max-w-prose` for body copy.

---

## 4. Radius System

```ts
borderRadius: {
  'sm':   '0.375rem',  //  6 — badges, tags
  'md':   '0.5rem',    //  8 — buttons, inputs
  'lg':   '0.75rem',   // 12 — cards
  'xl':   '1rem',      // 16 — large cards
  '2xl':  '1.25rem',   // 20 — hero mockup, featured
  '3xl':  '1.75rem',   // 28 — bento cells
  'full': '9999px',
},
```

Pick a radius rhythm: typically `md` for inputs, `lg` for cards, `2xl` for hero
elements. Don't mix 6 different radii.

---

## 5. Shadow / Elevation System

### Light theme

```ts
boxShadow: {
  'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'card':   '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
  'card-hover': '0 8px 16px -4px rgb(0 0 0 / 0.1), 0 4px 8px -2px rgb(0 0 0 / 0.06)',
  'elevated': '0 20px 32px -8px rgb(0 0 0 / 0.12), 0 8px 16px -4px rgb(0 0 0 / 0.08)',
  'floating': '0 32px 64px -16px rgb(0 0 0 / 0.18)',
},
```

### Dark theme — replace blackshade with inset glow + ambient color

```ts
boxShadow: {
  'subtle':   'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
  'card':     'inset 0 1px 0 0 rgb(255 255 255 / 0.08), 0 1px 2px 0 rgb(0 0 0 / 0.4)',
  'glow':     '0 0 0 1px rgb(255 255 255 / 0.06), 0 8px 32px -8px rgb(139 92 246 / 0.5)',
  'elevated': '0 24px 64px -16px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.06)',
},
```

Dark themes rely more on **borders + glow** than drop shadows. Drop shadows
disappear on dark backgrounds.

---

## 6. Depth Treatment (the Signature)

Pick ONE — see `hero-section-specialist` for archetypes. Implementations:

### Mesh gradient (animated, dark)

```css
.mesh-bg {
  background:
    radial-gradient(at 20% 30%, rgb(139 92 246 / 0.15) 0px, transparent 50%),
    radial-gradient(at 80% 20%, rgb(59 130 246 / 0.12) 0px, transparent 50%),
    radial-gradient(at 50% 80%, rgb(236 72 153 / 0.10) 0px, transparent 50%),
    rgb(10 10 12);
}
```

### Aurora (CSS animation only)

```css
@keyframes aurora {
  from { background-position: 50% 50%, 50% 50%; }
  to   { background-position: 350% 50%, 350% 50%; }
}
.aurora-bg {
  background-image:
    repeating-linear-gradient(100deg, var(--white) 0%, var(--white) 7%, transparent 10%, transparent 12%, var(--white) 16%),
    repeating-linear-gradient(100deg, rgb(59 130 246) 10%, rgb(165 180 252) 15%, rgb(147 197 253) 20%, rgb(221 214 254) 25%, rgb(96 165 250) 30%);
  background-size: 300% 200%;
  background-position: 50% 50%, 50% 50%;
  filter: blur(10px) invert(1);
  mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
  animation: aurora 60s linear infinite;
}
```

### Subtle grid + radial glow (Vercel/Linear feel)

```tsx
<div className="absolute inset-0 -z-10">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(120,119,198,0.25),transparent)]" />
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
</div>
```

### Dot pattern + spotlight

```tsx
<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255_/_0.08)_1px,transparent_0)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
```

### Noise texture (subtle, premium)

A 256×256 PNG of subtle noise at 4-6% opacity, repeated. Cheap, very premium feel.

---

## 7. Icon Strategy

Default: **lucide-react** (free, consistent, 1500+ icons, 1.5px stroke).

```tsx
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
```

Rules:
- One stroke weight across the page (all 1.5px or all 2px — don't mix).
- Size to text: `h-4 w-4` next to body, `h-5 w-5` next to lg, `h-6 w-6` for feature
  icons.
- For premium dual-tone icons, layer two `<svg>` elements with different opacities
  on the same path, OR use solid backgrounds: `<div className="rounded-lg bg-accent/10 p-2"><Icon className="h-5 w-5 text-accent" /></div>`
- Don't mix lucide with FontAwesome with Heroicons. Pick one set.

---

## 8. Component Primitives

Build these once, use them everywhere. Keep them minimal — specific component variants
emerge from these.

### Button

```tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-white text-neutral-950 shadow-glow hover:scale-[1.02] hover:shadow-elevated',
        secondary: 'border border-white/10 bg-white/5 text-white backdrop-blur hover:bg-white/10',
        ghost: 'text-white/80 hover:text-white hover:bg-white/5',
        outline: 'border border-current bg-transparent hover:bg-white/5',
      },
      size: {
        sm: 'h-9 px-3 text-sm rounded-md',
        md: 'h-11 px-5 text-sm rounded-lg',
        lg: 'h-12 px-6 text-base rounded-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)
```

### Card

```tsx
export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.05] ${className}`}>
      {children}
    </div>
  )
}
```

### Badge

```tsx
export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur ${className}`}>
      {children}
    </span>
  )
}
```

### Section

```tsx
export function Section({ className = '', children }) {
  return (
    <section className={`py-section sm:py-section-lg ${className}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">{children}</div>
    </section>
  )
}
```

---

## 9. Output File: `05-visual-system.md`

Include:
- Final palette (raw + semantic)
- Final typography (display + body + mono with fallbacks)
- Final spacing scale
- Final radius scale
- Final shadow scale
- Chosen depth treatment + the exact CSS
- Icon set choice
- 4-6 component primitive specs

This file is the source of truth — `tailwind.config.ts` and `globals.css` derive from it.

---

## Anti-Patterns

- Using Tailwind defaults (`text-blue-500`, `rounded-md`) directly in components
  instead of semantic tokens
- Five different shadow values across one page
- Mixing icon libraries
- Inter for everything — at least pair with a distinct display font for hero
- Pure white text on white-ish backgrounds, or pure black on near-black
- Using radial-gradient + grid + mesh + aurora all on one hero
