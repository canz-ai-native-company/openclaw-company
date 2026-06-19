# Next.js Responsive Design Patterns Reference

Mobile-first responsive patterns for professional websites. Every website MUST work perfectly on mobile.

---

## Mobile Navigation — Slide Drawer

Never use a plain hamburger toggle that pushes content. Always use an animated slide drawer with backdrop.

```tsx
// components/layout/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            Logo
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/contact"
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden w-10 h-10 flex items-center justify-center"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-[70] shadow-floating"
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  aria-label="Close menu">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  )
}
```

---

## Touch Target Sizes

ALL interactive elements MUST have minimum 44x44px touch target.

```tsx
// Buttons — minimum padding
<button className="px-6 py-3 min-h-[44px]">Click</button>

// Icon buttons — explicit size
<button className="w-11 h-11 flex items-center justify-center">
  <svg className="w-5 h-5" />
</button>

// Links in navigation — adequate padding
<a className="block px-4 py-3">Nav Link</a>

// Accordion triggers
<button className="w-full p-5 min-h-[44px]">Question</button>

// Checkbox/Radio — larger click area
<label className="flex items-center gap-3 py-2 cursor-pointer min-h-[44px]">
  <input type="checkbox" className="w-5 h-5" />
  <span>Label text</span>
</label>
```

---

## Fluid Typography with clamp()

Never use fixed font sizes for headings. Use clamp() for smooth scaling.

```css
/* Already defined in design-system's tailwind config as text-display, text-h1, etc. */

/* Manual clamp pattern if needed: */
/* clamp(minimum, preferred, maximum) */

.fluid-heading {
  font-size: clamp(2rem, 5vw, 4rem);
  /* At 375px viewport: 2rem (32px) */
  /* At 800px viewport: ~2.5rem (40px) */
  /* At 1200px+: caps at 4rem (64px) */
}
```

### Usage with Tailwind

```tsx
// Use the custom text utilities from design system
<h1 className="text-display">Hero Title</h1>     // clamp(2.5rem, 5vw, 4.5rem)
<h2 className="text-h2">Section Title</h2>        // clamp(1.5rem, 3vw, 2.5rem)
<p className="text-body-lg">Large body text</p>   // 1.125rem (fixed — body text doesn't need to scale)
```

---

## Mobile-First Section Patterns

### Hero — Mobile Adaptation

```tsx
// Mobile: stacked, smaller padding, full-width CTAs
// Desktop: split layout, larger typography
<section className="pt-8 pb-16 lg:pt-0 lg:pb-0 lg:min-h-[90vh] lg:flex lg:items-center">
  <div className="container mx-auto px-4">
    <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
      <div className="text-center lg:text-left">
        <h1 className="text-display">{title}</h1>
        <p className="mt-4 text-body-lg text-gray-600">{subtitle}</p>

        {/* Mobile: full-width stacked buttons */}
        {/* Desktop: inline side-by-side */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-start justify-center">
          <Link className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white text-center rounded-xl font-semibold">
            {ctaText}
          </Link>
          <Link className="w-full sm:w-auto px-8 py-4 border border-gray-300 text-center rounded-xl font-semibold">
            {secondaryCtaText}
          </Link>
        </div>
      </div>

      {/* Image: hidden on small mobile, shown from sm breakpoint */}
      <div className="mt-10 lg:mt-0">
        <Image ... />
      </div>
    </div>
  </div>
</section>
```

### Stats — Mobile Grid Adaptation

```tsx
// Mobile: 2x2 grid
// Desktop: 4 in a row
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
  {stats.map((stat) => (
    <div className="text-center">
      <div className="text-3xl md:text-5xl font-bold">{stat.value}</div>
      <div className="text-xs md:text-sm mt-1">{stat.label}</div>
    </div>
  ))}
</div>
```

### Cards — Mobile Stack

```tsx
// Mobile: single column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <div className="card card-hover p-6 md:p-8">{/* ... */}</div>
  ))}
</div>
```

### Testimonials — Mobile Single View

```tsx
// Mobile: single testimonial with swipe navigation
// Desktop: carousel with arrows
<div className="relative">
  {/* Show navigation arrows only on desktop */}
  <button className="hidden lg:flex absolute left-0 ...">←</button>
  <button className="hidden lg:flex absolute right-0 ...">→</button>

  {/* Dots visible on all sizes */}
  <div className="flex justify-center gap-2 mt-6">
    {/* pagination dots */}
  </div>
</div>
```

### Footer — Mobile Collapsible

```tsx
// Mobile: collapsible sections
// Desktop: multi-column grid
<footer className="bg-gray-900 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Brand column — always visible */}
      <div className="lg:col-span-1">
        <h3 className="font-bold text-lg">Brand</h3>
        <p className="mt-4 text-gray-400 text-sm">Description</p>
      </div>

      {/* Link columns — on mobile, use details/summary for collapsible */}
      {linkGroups.map((group) => (
        <details key={group.title} className="group md:open" open>
          <summary className="flex items-center justify-between cursor-pointer md:cursor-default py-2 md:py-0 font-semibold text-sm uppercase tracking-wider">
            {group.title}
            <svg className="w-4 h-4 md:hidden group-open:rotate-180 transition-transform" />
          </summary>
          <ul className="mt-3 space-y-2">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  </div>
</footer>
```

---

## Mobile Sticky CTA

For conversion-critical pages, show a sticky bottom CTA on mobile.

```tsx
// components/layout/MobileStickyFooter.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function MobileStickyFooter({ ctaText, ctaHref }: { ctaText: string; ctaHref: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 p-3 shadow-elevated">
      <Link href={ctaHref}
        className="block w-full text-center py-3.5 bg-primary-600 text-white font-semibold rounded-xl">
        {ctaText}
      </Link>
    </div>
  )
}
```

---

## Image Responsive Patterns

```tsx
// Hero image: full width, different aspect on mobile
<div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-xl overflow-hidden">
  <Image src="/hero.jpg" alt="" fill className="object-cover" sizes="100vw" priority />
</div>

// Grid image: square on mobile, 4:3 on desktop
<div className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden">
  <Image src="/grid-item.jpg" alt="" fill className="object-cover"
    sizes="(max-width: 768px) 100vw, 33vw" />
</div>

// Avatar: fixed size, responsive
<div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
  <Image src="/avatar.jpg" alt="" fill className="object-cover" sizes="64px" />
</div>
```

---

## Spacing Scale (Mobile vs Desktop)

```
Section padding:    py-16 → lg:py-24 (64px → 96px)
Section gap:        gap-6 → lg:gap-8 (24px → 32px)
Container padding:  px-4 → lg:px-0 (16px → contained)
Card padding:       p-6 → md:p-8 (24px → 32px)
Content max-width:  Keep max-w-2xl for readability on all sizes
```

---

## Breakpoint Quick Reference

```
DEFAULT (0px+):    Mobile phones (375px target)
sm (640px+):       Large phones, small tablets
md (768px+):       Tablets (portrait)
lg (1024px+):      Laptops, tablets (landscape)
xl (1280px+):      Desktops
2xl (1536px+):     Large monitors

Most used:
- md: tablet switch point (2-col grids)
- lg: desktop switch point (navigation, layout)
```
