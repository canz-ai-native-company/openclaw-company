# Next.js Advanced Components Reference

Production-ready interactive components that professional websites need but basic templates lack. Copy these patterns and customize for each niche.

---

## Animated Counter (Scroll-Triggered Number Count)

Used in Stats sections. Counts from 0 to target number when scrolled into view.

```typescript
// components/ui/AnimatedCounter.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  label?: string
  decimals?: number
  className?: string
}

export function AnimatedCounter({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  label,
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * end

      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current))

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, end, duration, decimals])

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      {label && <div className="mt-2 text-sm md:text-base opacity-70 font-medium">{label}</div>}
    </div>
  )
}
```

---

## Marquee / Infinite Scroll

Smooth infinite horizontal scroll for logos, trust badges, or any repeating content.

```typescript
// components/ui/Marquee.tsx
'use client'

import { useRef } from 'react'

interface MarqueeProps {
  children: React.ReactNode
  speed?: number      // seconds for one full cycle
  pauseOnHover?: boolean
  direction?: 'left' | 'right'
  gap?: string
  className?: string
}

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  direction = 'left',
  gap = '3rem',
  className = '',
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden relative ${className}`}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-inherit to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-inherit to-transparent z-10 pointer-events-none" />

      <div
        className={`flex w-max ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          gap,
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>
    </div>
  )
}

/*
  Required in globals.css:
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
*/
```

### Usage

```tsx
<Marquee speed={30} pauseOnHover>
  {logos.map((logo, i) => (
    <Image key={i} src={logo.src} alt={logo.alt} width={120} height={40}
      className="h-8 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all" />
  ))}
</Marquee>
```

---

## Animated Accordion

Smooth height animation with rotating chevron. Better than CSS-only accordion.

```typescript
// components/ui/AnimatedAccordion.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

interface AnimatedAccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export function AnimatedAccordion({ items, allowMultiple = false, className = '' }: AnimatedAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        return (
          <div key={item.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors min-h-[44px]"
              aria-expanded={isOpen}
            >
              <span className="text-lg font-medium text-gray-900 pr-4">{item.title}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex-shrink-0 text-gray-400"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
```

---

## Animated Tabs

Tabs with animated underline indicator that slides between active tabs.

```typescript
// components/ui/AnimatedTabs.tsx
'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface AnimatedTabsProps {
  tabs: Tab[]
  defaultTab?: string
  variant?: 'underline' | 'pill'
  className?: string
}

export function AnimatedTabs({ tabs, defaultTab, variant = 'underline', className = '' }: AnimatedTabsProps) {
  const [activeId, setActiveId] = useState(defaultTab || tabs[0]?.id)

  const activeTab = tabs.find((t) => t.id === activeId)

  return (
    <div className={className}>
      {/* Tab List */}
      <div className={`flex ${variant === 'underline' ? 'border-b border-gray-200' : 'gap-1 bg-gray-100 rounded-xl p-1'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`relative px-5 py-2.5 text-sm font-medium transition-colors ${
              variant === 'pill'
                ? activeId === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                : activeId === tab.id ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>

            {activeId === tab.id && variant === 'underline' && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}

            {activeId === tab.id && variant === 'pill' && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeId}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6"
      >
        {activeTab?.content}
      </motion.div>
    </div>
  )
}
```

---

## Pricing Toggle (Monthly/Yearly Switch)

Animated toggle with savings badge.

```typescript
// components/ui/PricingToggle.tsx
'use client'

import { motion } from 'motion/react'

interface PricingToggleProps {
  isYearly: boolean
  onChange: (yearly: boolean) => void
  savingsPercent?: number
}

export function PricingToggle({ isYearly, onChange, savingsPercent = 20 }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
        Monthly
      </span>

      <button
        onClick={() => onChange(!isYearly)}
        className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${isYearly ? 'bg-primary-600' : 'bg-gray-300'}`}
        role="switch"
        aria-checked={isYearly}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
          animate={{ x: isYearly ? 28 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>

      <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
        Yearly
        {savingsPercent > 0 && (
          <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            Save {savingsPercent}%
          </span>
        )}
      </span>
    </div>
  )
}
```

---

## Sticky Header with Scroll-Aware Background

Transparent on top, glass effect on scroll.

```typescript
// components/layout/StickyHeader.tsx
'use client'

import { useEffect, useState } from 'react'

interface StickyHeaderProps {
  children: React.ReactNode
  transparentOnTop?: boolean
}

export function StickyHeader({ children, transparentOnTop = true }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // check initial state
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-sticky transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-subtle border-b border-gray-100'
          : transparentOnTop
            ? 'bg-transparent'
            : 'bg-white'
      }`}
    >
      <nav className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between">
        {children}
      </nav>
    </header>
  )
}
```

---

## Mobile Slide Drawer Navigation

Animated slide-in drawer with backdrop overlay for mobile nav.

```typescript
// components/layout/MobileDrawer.tsx
'use client'

import { motion, AnimatePresence } from 'motion/react'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function MobileDrawer({ isOpen, onClose, children }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-modal-backdrop"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-modal shadow-floating"
          >
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## Comparison Slider (Before/After)

Drag-to-compare two images. Great for portfolio, renovation, or transformation showcases.

```typescript
// components/ui/ComparisonSlider.tsx
'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface ComparisonSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, x)))
  }

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[16/9] rounded-2xl overflow-hidden cursor-col-resize select-none ${className}`}
      onMouseDown={() => { isDragging.current = true }}
      onMouseUp={() => { isDragging.current = false }}
      onMouseLeave={() => { isDragging.current = false }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchStart={() => { isDragging.current = true }}
      onTouchEnd={() => { isDragging.current = false }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After (bottom layer) */}
      <Image src={afterImage} alt={afterLabel} fill className="object-cover" sizes="100vw" />

      {/* Before (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={beforeImage} alt={beforeLabel} fill className="object-cover" sizes="100vw" />
      </div>

      {/* Slider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }}>
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-elevated flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
        {afterLabel}
      </div>
    </div>
  )
}
```

---

## Testimonial Carousel (Swipeable)

Touch-friendly carousel for testimonials with auto-play.

```typescript
// components/ui/TestimonialCarousel.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react'

interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
  image?: string
  rating?: number
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoPlayMs?: number
}

export function TestimonialCarousel({ testimonials, autoPlayMs = 5000 }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % testimonials.length), [testimonials.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length), [testimonials.length])

  useEffect(() => {
    if (autoPlayMs <= 0) return
    const t = setInterval(next, autoPlayMs)
    return () => clearInterval(t)
  }, [next, autoPlayMs])

  const t = testimonials[index]

  return (
    <div className="relative max-w-3xl mx-auto text-center">
      <div className="min-h-[250px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {/* Stars */}
            {t.rating && (
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < t.rating! ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}

            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed italic">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="mt-6">
              <p className="font-semibold text-gray-900">{t.author}</p>
              <p className="text-sm text-gray-500">
                {t.role}{t.company && ` at ${t.company}`}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors" aria-label="Previous">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className="relative w-2.5 h-2.5 rounded-full bg-gray-300" aria-label={`Testimonial ${i + 1}`}>
              {i === index && (
                <motion.div layoutId="t-dot" className="absolute inset-0 rounded-full bg-primary-600" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              )}
            </button>
          ))}
        </div>

        <button onClick={next} className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors" aria-label="Next">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  )
}
```

---

## Back to Top Button

Appears on scroll, smooth scrolls to top.

```typescript
// components/ui/BackToTop.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-gray-900 text-white shadow-elevated hover:bg-gray-700 flex items-center justify-center transition-colors"
          aria-label="Back to top"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
```
