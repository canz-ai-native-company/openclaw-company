# Next.js ChatKit UI - Professional Section Components Reference

Professional, animated section components for production websites. Every component integrates animations from the `nextjs-animations` skill. **Never use static sections — animations are mandatory.**

> **IMPORTANT**: These are reference patterns. Learn the structure, then create CUSTOM implementations tailored to the user's niche. Never copy verbatim with placeholder text.

> **REQUIRED DEPENDENCY**: `npm install motion` — All section components use Motion (Framer Motion) for animations.

---

## Table of Contents

1. [Hero Section](#hero-section) — Layered animated hero with text reveal + parallax
2. [Social Proof Strip](#social-proof-strip) — Logo marquee + trust badges
3. [Features Section](#features-section) — Animated card grid with stagger
4. [How It Works](#how-it-works) — Numbered steps with connecting line
5. [Stats Section](#stats-section) — Scroll-triggered animated counters
6. [Testimonials Section](#testimonials-section) — Auto-play carousel with navigation
7. [Pricing Section](#pricing-section) — Cards with monthly/yearly toggle
8. [FAQ Section](#faq-section) — Smooth animated accordion
9. [CTA Banner](#cta-banner) — Gradient animated conversion section
10. [Gallery Section](#gallery-section) — Filterable image grid with lightbox
11. [Team Section](#team-section) — Member cards with hover reveal
12. [Contact Section](#contact-section) — Animated form with validation
13. [Newsletter Section](#newsletter-section) — Inline signup with success state
14. [Logo Cloud](#logo-cloud) — Partner/integration logos with hover effect

---

## Hero Section

The most critical section. Uses layered animation: background effect → text reveal → CTA stagger → trust strip.

```typescript
// components/sections/Hero.tsx
'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { TextReveal } from '@/components/animations/TextReveal'
import { AnimatedButton } from '@/components/animations/MicroInteractions'

interface HeroProps {
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image?: string
  stats?: { value: string; label: string }[]
  variant?: 'centered' | 'split' | 'fullscreen'
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  image,
  stats,
  variant = 'centered',
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gray-950">
      {/* Layer 1: Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-gray-900 to-gray-950" />
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary-500/15 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      </div>

      {/* Layer 2: Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className={`${variant === 'split' ? 'grid lg:grid-cols-2 gap-12 items-center' : 'max-w-4xl mx-auto text-center'}`}>
          <div>
            {/* Badge/Label (optional) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 border border-primary-500/20 px-4 py-1.5 text-sm text-primary-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                </span>
                {/* Niche-specific label, e.g. "Now Accepting Reservations" */}
              </span>
            </motion.div>

            {/* Heading with TextReveal */}
            <h1 className="text-display text-white">
              <TextReveal splitBy="words">{title}</TextReveal>
            </h1>

            {/* Subtitle — staggered after heading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6 text-body-lg text-gray-400 max-w-2xl"
            >
              {subtitle}
            </motion.p>

            {/* CTAs — staggered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className={`mt-10 flex gap-4 ${variant === 'centered' ? 'justify-center' : ''}`}
            >
              <AnimatedButton variant="glow">
                <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors">
                  {ctaText}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </AnimatedButton>
              {secondaryCtaText && secondaryCtaHref && (
                <AnimatedButton variant="scale">
                  <Link href={secondaryCtaHref} className="inline-flex items-center gap-2 px-8 py-4 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors">
                    {secondaryCtaText}
                  </Link>
                </AnimatedButton>
              )}
            </motion.div>

            {/* Trust indicators below CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className={`mt-8 flex items-center gap-6 text-sm text-gray-500 ${variant === 'centered' ? 'justify-center' : ''}`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </span>
            </motion.div>
          </div>

          {/* Layer 3: Visual Element (split layout) */}
          {variant === 'split' && image && (
            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-floating border border-white/10">
                <Image
                  src={image}
                  alt={title}
                  width={700}
                  height={500}
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-elevated p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">4.9/5 Rating</p>
                    <p className="text-xs text-gray-500">from 2,400+ reviews</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Layer 4: Stats Strip */}
      {stats && stats.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
```

---

## Social Proof Strip

Auto-scrolling logo marquee for trust signals. Place immediately after Hero.

```typescript
// components/sections/SocialProofStrip.tsx
'use client'

import Image from 'next/image'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

interface Logo {
  src: string
  alt: string
  width?: number
}

interface SocialProofStripProps {
  label?: string
  logos: Logo[]
  speed?: number
}

export function SocialProofStrip({
  label = 'Trusted by leading companies',
  logos,
  speed = 40,
}: SocialProofStripProps) {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
            {label}
          </p>
        </ScrollReveal>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        <div
          className="flex gap-16 items-center w-max hover:[animation-play-state:paused]"
          style={{
            animation: `marquee ${speed}s linear infinite`,
          }}
        >
          {/* Render logos twice for seamless loop */}
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 120}
                height={40}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/*
  Add to globals.css:
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
*/
```

---

## Features Section

Animated card grid with stagger entrance and hover effects.

```typescript
// components/sections/Features.tsx
'use client'

import { motion } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren'

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

interface FeaturesProps {
  label?: string
  title: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

export function Features({
  label,
  title,
  subtitle,
  features,
  columns = 3,
}: FeaturesProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="py-section lg:py-section-lg bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-16">
            {label && (
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                {label}
              </span>
            )}
            <h2 className="mt-2 text-h2 text-gray-900">{title}</h2>
            {subtitle && (
              <p className="mt-4 text-body-lg text-gray-600">{subtitle}</p>
            )}
          </div>
        </ScrollReveal>

        {/* Feature Cards */}
        <StaggerContainer
          staggerDelay={0.1}
          onScroll
          className={`grid grid-cols-1 gap-6 lg:gap-8 ${gridCols[columns]}`}
        >
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                transition={{ duration: 0.2 }}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-card transition-colors hover:border-primary-200 group"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="mt-5 text-h3 text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-body text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover arrow indicator */}
                <div className="mt-4 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Learn more</span>
                  <motion.svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
```

---

## How It Works

Numbered steps with staggered reveal and connecting visual line.

```typescript
// components/sections/HowItWorks.tsx
'use client'

import { motion } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren'

interface Step {
  title: string
  description: string
  icon?: React.ReactNode
}

interface HowItWorksProps {
  label?: string
  title: string
  subtitle?: string
  steps: Step[]
}

export function HowItWorks({ label, title, subtitle, steps }: HowItWorksProps) {
  return (
    <section className="py-section lg:py-section-lg bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-16">
            {label && (
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                {label}
              </span>
            )}
            <h2 className="mt-2 text-h2 text-gray-900">{title}</h2>
            {subtitle && (
              <p className="mt-4 text-body-lg text-gray-600">{subtitle}</p>
            )}
          </div>
        </ScrollReveal>

        {/* Steps */}
        <StaggerContainer staggerDelay={0.15} onScroll className="relative max-w-4xl mx-auto">
          {/* Connecting line (desktop only) */}
          <div className="absolute left-8 top-12 bottom-12 w-px bg-gray-200 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <StaggerItem key={index}>
                <div className="flex gap-6 md:gap-8 items-start">
                  {/* Step number */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative flex-shrink-0 w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-xl font-bold shadow-lg z-10"
                  >
                    {step.icon || (
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="pt-2">
                    <h3 className="text-h3 text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-body text-gray-600 leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}
```

---

## Stats Section

Scroll-triggered animated counters with visual impact.

```typescript
// components/sections/Stats.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

interface Stat {
  end: number
  prefix?: string
  suffix?: string
  label: string
}

interface StatsProps {
  title?: string
  subtitle?: string
  stats: Stat[]
  variant?: 'primary' | 'dark' | 'light'
}

function AnimatedCounter({ end, prefix = '', suffix = '', label, delay = 0 }: Stat & { delay?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = end / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [isInView, end, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm md:text-base opacity-70 font-medium">{label}</div>
    </motion.div>
  )
}

export function Stats({ title, subtitle, stats, variant = 'primary' }: StatsProps) {
  const variants = {
    primary: 'bg-primary-600 text-white',
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-50 text-gray-900',
  }

  return (
    <section className={`py-section lg:py-section-lg ${variants[variant]}`}>
      <div className="container mx-auto px-4">
        {title && (
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-h2">{title}</h2>
              {subtitle && <p className="mt-4 text-body-lg opacity-70">{subtitle}</p>}
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <AnimatedCounter key={i} {...stat} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## Testimonials Section

Auto-play carousel with manual navigation, star ratings, and quote transitions.

```typescript
// components/sections/Testimonials.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Avatar } from '@/components/ui/Avatar'

interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
  avatar?: string
  rating?: number
}

interface TestimonialsProps {
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
  autoPlayInterval?: number
}

export function Testimonials({
  title = 'What Our Customers Say',
  subtitle,
  testimonials,
  autoPlayInterval = 5000,
}: TestimonialsProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  // Auto-play
  useEffect(() => {
    if (autoPlayInterval <= 0) return
    const timer = setInterval(next, autoPlayInterval)
    return () => clearInterval(timer)
  }, [next, autoPlayInterval])

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  }

  return (
    <section className="py-section lg:py-section-lg bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-h2 text-gray-900">{title}</h2>
            {subtitle && <p className="mt-4 text-body-lg text-gray-600">{subtitle}</p>}
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <div className="min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full text-center"
              >
                {/* Stars */}
                {testimonials[current].rating && (
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring' }}
                        className={`h-5 w-5 ${i < (testimonials[current].rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                )}

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed italic">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Avatar
                    src={testimonials[current].avatar}
                    name={testimonials[current].author}
                    size="lg"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{testimonials[current].author}</p>
                    <p className="text-sm text-gray-500">
                      {testimonials[current].role}
                      {testimonials[current].company && ` at ${testimonials[current].company}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-10 h-10 rounded-full bg-white shadow-card hover:shadow-elevated flex items-center justify-center transition-shadow"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-10 h-10 rounded-full bg-white shadow-card hover:shadow-elevated flex items-center justify-center transition-shadow"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                className="relative w-2.5 h-2.5 rounded-full bg-gray-300 transition-colors"
                aria-label={`Go to testimonial ${i + 1}`}
              >
                {i === current && (
                  <motion.div
                    layoutId="testimonial-dot"
                    className="absolute inset-0 rounded-full bg-primary-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## Pricing Section

Animated cards with monthly/yearly toggle and highlighted plan.

```typescript
// components/sections/Pricing.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren'
import { Button } from '@/components/ui/Button'

interface PricingPlan {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features: string[]
  ctaText?: string
  ctaHref?: string
  highlighted?: boolean
}

interface PricingProps {
  title?: string
  subtitle?: string
  plans: PricingPlan[]
  showToggle?: boolean
}

export function Pricing({
  title = 'Simple, Transparent Pricing',
  subtitle,
  plans,
  showToggle = true,
}: PricingProps) {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="py-section lg:py-section-lg bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-h2 text-gray-900">{title}</h2>
            {subtitle && <p className="mt-4 text-body-lg text-gray-600">{subtitle}</p>}
          </div>
        </ScrollReveal>

        {/* Toggle */}
        {showToggle && (
          <ScrollReveal direction="up">
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow"
                  animate={{ x: isYearly ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="text-xs text-green-600 font-semibold ml-1">Save 20%</span>
              </span>
            </div>
          </ScrollReveal>
        )}

        {/* Plan Cards */}
        <StaggerContainer staggerDelay={0.1} onScroll className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-2xl p-8 h-full flex flex-col ${
                  plan.highlighted
                    ? 'bg-primary-600 text-white shadow-elevated ring-2 ring-primary-600 scale-[1.02]'
                    : 'bg-white border border-gray-200 shadow-card'
                }`}
              >
                {plan.highlighted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full"
                  >
                    Most Popular
                  </motion.div>
                )}

                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className={`mt-1 text-sm ${plan.highlighted ? 'text-primary-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>

                {/* Animated Price */}
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold">
                    $
                    <motion.span
                      key={isYearly ? 'yearly' : 'monthly'}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </motion.span>
                  </span>
                  <span className={`ml-1 ${plan.highlighted ? 'text-primary-200' : 'text-gray-500'}`}>
                    /month
                  </span>
                </div>
                {isYearly && (
                  <p className={`text-xs mt-1 ${plan.highlighted ? 'text-primary-200' : 'text-gray-400'}`}>
                    Billed annually (${plan.yearlyPrice * 12}/year)
                  </p>
                )}

                {/* Features */}
                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-primary-200' : 'text-primary-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-sm ${plan.highlighted ? 'text-primary-100' : 'text-gray-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-8 w-full ${plan.highlighted ? 'bg-white text-primary-600 hover:bg-primary-50' : ''}`}
                  variant={plan.highlighted ? 'secondary' : 'outline'}
                  size="lg"
                  asChild
                >
                  <Link href={plan.ctaHref || '/contact'}>
                    {plan.ctaText || 'Get Started'}
                  </Link>
                </Button>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
```

---

## FAQ Section

Smooth animated accordion with rotating chevron and height transitions.

```typescript
// components/sections/FAQ.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title?: string
  subtitle?: string
  items: FAQItem[]
}

export function FAQ({
  title = 'Frequently Asked Questions',
  subtitle,
  items,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-section lg:py-section-lg bg-gray-50">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-h2 text-gray-900">{title}</h2>
            {subtitle && <p className="mt-4 text-body-lg text-gray-600">{subtitle}</p>}
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.08} onScroll className="mx-auto max-w-3xl space-y-3">
          {items.map((item, index) => (
            <StaggerItem key={index}>
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  <span className="text-lg font-medium text-gray-900 pr-4">{item.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex-shrink-0 text-gray-400"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
```

---

## CTA Banner

Gradient animated conversion section with visual impact.

```typescript
// components/sections/CTABanner.tsx
'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { AnimatedButton } from '@/components/animations/MicroInteractions'

interface CTABannerProps {
  title: string
  description?: string
  ctaText: string
  ctaHref: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  trustText?: string[]
}

export function CTABanner({
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  trustText,
}: CTABannerProps) {
  return (
    <section className="relative py-section lg:py-section-lg overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800" />
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.2), transparent 60%)',
        }}
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.2), transparent 60%)',
            'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.2), transparent 60%)',
            'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.2), transparent 60%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-h1 text-white">{title}</h2>
            {description && (
              <p className="mt-4 text-body-lg text-white/80">{description}</p>
            )}

            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <AnimatedButton variant="glow">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-elevated"
                >
                  {ctaText}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </AnimatedButton>
              {secondaryCtaText && secondaryCtaHref && (
                <AnimatedButton variant="scale">
                  <Link
                    href={secondaryCtaHref}
                    className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    {secondaryCtaText}
                  </Link>
                </AnimatedButton>
              )}
            </div>

            {trustText && trustText.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-4 flex-wrap text-sm text-white/60">
                {trustText.map((text, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-white/30">•</span>}
                    {text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

---

## Gallery Section

Filterable image grid with hover overlay and category tabs.

```typescript
// components/sections/Gallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

interface GalleryItem {
  src: string
  alt: string
  category: string
}

interface GalleryProps {
  title?: string
  subtitle?: string
  items: GalleryItem[]
  columns?: 2 | 3 | 4
}

export function Gallery({ title, subtitle, items, columns = 3 }: GalleryProps) {
  const categories = ['All', ...Array.from(new Set(items.map((item) => item.category)))]
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? items : items.filter((item) => item.category === activeCategory)

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="py-section lg:py-section-lg bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-12">
            {title && <h2 className="text-h2">{title}</h2>}
            {subtitle && <p className="mt-4 text-body-lg text-gray-400">{subtitle}</p>}
          </div>
        </ScrollReveal>

        {/* Category Filter Tabs */}
        <ScrollReveal direction="up">
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeCategory === cat ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="gallery-tab"
                    className="absolute inset-0 rounded-full bg-primary-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Image Grid */}
        <motion.div layout className={`grid grid-cols-1 gap-4 ${gridCols[columns]}`}>
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes={`(max-width: 768px) 100vw, ${100 / columns}vw`}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <p className="font-semibold text-lg">{item.alt}</p>
                    <p className="text-sm text-gray-300 mt-1">{item.category}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
```

---

## Team Section

Member cards with hover reveal for bio/social links.

```typescript
// components/sections/Team.tsx
'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren'

interface TeamMember {
  name: string
  role: string
  bio?: string
  image: string
  socials?: { platform: string; url: string }[]
}

interface TeamProps {
  title?: string
  subtitle?: string
  members: TeamMember[]
}

export function Team({ title, subtitle, members }: TeamProps) {
  return (
    <section className="py-section lg:py-section-lg bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-16">
            {title && <h2 className="text-h2 text-gray-900">{title}</h2>}
            {subtitle && <p className="mt-4 text-body-lg text-gray-600">{subtitle}</p>}
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1} onScroll className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {members.map((member, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group text-center"
              >
                {/* Image with hover overlay */}
                <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="192px"
                  />
                  {/* Social links overlay */}
                  {member.socials && (
                    <div className="absolute inset-0 bg-primary-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {member.socials.map((social, si) => (
                        <a
                          key={si}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                        >
                          <span className="text-xs font-bold">{social.platform[0].toUpperCase()}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary-600 font-medium">{member.role}</p>
                {member.bio && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{member.bio}</p>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
```

---

## Contact Section

Animated form with field focus effects and validation states.

```typescript
// components/sections/Contact.tsx
'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

interface ContactProps {
  title?: string
  subtitle?: string
  showMap?: boolean
  contactInfo?: { icon: React.ReactNode; label: string; value: string }[]
}

export function Contact({
  title = 'Get In Touch',
  subtitle,
  contactInfo,
}: ContactProps) {
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="py-section lg:py-section-lg bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-h2 text-gray-900">{title}</h2>
            {subtitle && <p className="mt-4 text-body-lg text-gray-600">{subtitle}</p>}
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          {contactInfo && (
            <ScrollReveal direction="left" className="lg:col-span-2">
              <div className="space-y-6">
                {contactInfo.map((info, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{info.label}</p>
                      <p className="font-medium text-gray-900">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Form */}
          <ScrollReveal direction="right" className={contactInfo ? 'lg:col-span-3' : 'lg:col-span-5 max-w-2xl mx-auto'}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4"
                >
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900">Message Sent!</h3>
                <p className="mt-2 text-gray-600">We&apos;ll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  {['name', 'email'].map((field) => (
                    <div key={field} className="relative">
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        required
                        placeholder={field === 'name' ? 'Your Name' : 'Your Email'}
                        onFocus={() => setFocused(field)}
                        onBlur={() => setFocused(null)}
                        className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 outline-none bg-gray-50 ${
                          focused === field
                            ? 'border-primary-500 bg-white shadow-sm ring-4 ring-primary-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 outline-none bg-gray-50 ${
                      focused === 'subject'
                        ? 'border-primary-500 bg-white shadow-sm ring-4 ring-primary-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>

                <div className="relative">
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Your Message"
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 outline-none bg-gray-50 resize-none ${
                      focused === 'message'
                        ? 'border-primary-500 bg-white shadow-sm ring-4 ring-primary-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Send Message
                </motion.button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
```

---

## Newsletter Section

Inline signup with animated success state.

```typescript
// components/sections/Newsletter.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

interface NewsletterProps {
  title?: string
  subtitle?: string
  incentive?: string
}

export function Newsletter({
  title = 'Stay Updated',
  subtitle = 'Get the latest news and updates delivered to your inbox.',
  incentive,
}: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-h2 text-gray-900">{title}</h2>
            <p className="mt-3 text-gray-600">{subtitle}</p>
            {incentive && (
              <p className="mt-2 text-sm text-primary-600 font-medium">{incentive}</p>
            )}

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-center justify-center gap-2 text-green-600 font-medium"
                >
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                  You&apos;re subscribed! Check your inbox.
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="mt-8 flex gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

---

## Logo Cloud

Partner/integration logos with hover effects. For non-marquee static display.

```typescript
// components/sections/LogoCloud.tsx
'use client'

import Image from 'next/image'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren'

interface Logo {
  src: string
  alt: string
  width?: number
}

interface LogoCloudProps {
  title?: string
  logos: Logo[]
}

export function LogoCloud({ title, logos }: LogoCloudProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {title && (
          <ScrollReveal direction="up">
            <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-10">
              {title}
            </p>
          </ScrollReveal>
        )}

        <StaggerContainer staggerDelay={0.05} onScroll className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo, i) => (
            <StaggerItem key={i}>
              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 120}
                  height={40}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
```

---

## Usage Example — Professional Homepage

```typescript
// app/page.tsx — Example for SaaS website
import { Hero } from '@/components/sections/Hero'
import { SocialProofStrip } from '@/components/sections/SocialProofStrip'
import { Features } from '@/components/sections/Features'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Stats } from '@/components/sections/Stats'
import { Gallery } from '@/components/sections/Gallery'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { FAQ } from '@/components/sections/FAQ'
import { CTABanner } from '@/components/sections/CTABanner'
import { Contact } from '@/components/sections/Contact'
import { Newsletter } from '@/components/sections/Newsletter'

export default function HomePage() {
  return (
    <>
      <Hero
        title="Intelligent Analytics That Changes Everything"
        subtitle="Turn raw data into actionable insights with AI-powered analytics trusted by 2,500+ businesses worldwide."
        ctaText="Start Free Trial"
        ctaHref="/signup"
        secondaryCtaText="Watch Demo"
        secondaryCtaHref="/demo"
        image="/dashboard-preview.jpg"
        variant="split"
        stats={[
          { value: '2,500+', label: 'Active Users' },
          { value: '99.9%', label: 'Uptime' },
          { value: '50M+', label: 'Data Points' },
          { value: '4.9/5', label: 'Rating' },
        ]}
      />

      <SocialProofStrip
        label="Trusted by industry leaders"
        logos={[
          { src: '/logos/company1.svg', alt: 'Company 1' },
          { src: '/logos/company2.svg', alt: 'Company 2' },
          { src: '/logos/company3.svg', alt: 'Company 3' },
          { src: '/logos/company4.svg', alt: 'Company 4' },
          { src: '/logos/company5.svg', alt: 'Company 5' },
        ]}
      />

      <Features
        label="Why Choose Us"
        title="Everything You Need to Scale"
        subtitle="Powerful features designed to help your business grow faster."
        features={[
          { title: 'Real-Time Analytics', description: 'Monitor metrics as they happen with sub-second latency dashboards.', icon: <ChartIcon /> },
          { title: 'AI Predictions', description: 'Forecast trends with 94% accuracy using machine learning models.', icon: <BrainIcon /> },
          { title: 'Team Collaboration', description: 'Share insights and dashboards with unlimited team members.', icon: <TeamIcon /> },
          { title: 'Custom Reports', description: 'Generate client-ready PDF reports with one click.', icon: <DocIcon /> },
          { title: 'API Access', description: 'Integrate with any tool through our RESTful API and webhooks.', icon: <CodeIcon /> },
          { title: 'Enterprise Security', description: 'SOC 2 Type II certified with AES-256 encryption at rest.', icon: <ShieldIcon /> },
        ]}
      />

      <HowItWorks
        label="How It Works"
        title="Get Started in 3 Simple Steps"
        steps={[
          { title: 'Connect Your Data', description: 'Import from 50+ integrations or upload CSV. Setup takes under 5 minutes with our guided wizard.' },
          { title: 'Analyze & Discover', description: 'AI automatically surfaces trends, anomalies, and opportunities from your data.' },
          { title: 'Act & Grow', description: 'Share reports with stakeholders, set alerts, and make data-driven decisions that drive revenue.' },
        ]}
      />

      <Stats
        stats={[
          { end: 2500, suffix: '+', label: 'Active Businesses' },
          { end: 98, suffix: '%', label: 'Customer Satisfaction' },
          { end: 50, suffix: 'M+', label: 'Data Points Processed' },
          { end: 12, suffix: 'x', label: 'Average ROI' },
        ]}
        variant="primary"
      />

      <Testimonials
        title="Loved by Teams Worldwide"
        subtitle="See what our customers have to say about their experience."
        testimonials={[
          { quote: 'This platform transformed how we make decisions. ROI was visible within the first month.', author: 'Sarah Chen', role: 'VP of Analytics', company: 'TechCorp', rating: 5 },
          { quote: 'The AI predictions are eerily accurate. We caught a market shift 3 weeks before our competitors.', author: 'Michael Torres', role: 'CEO', company: 'GrowthLab', rating: 5 },
          { quote: 'Finally, analytics that my non-technical team can actually use. Best investment we made.', author: 'Emily Park', role: 'Marketing Director', company: 'ScaleUp Inc', rating: 5 },
        ]}
      />

      <Pricing
        title="Simple, Transparent Pricing"
        subtitle="No hidden fees. No surprises. Cancel anytime."
        plans={[
          { name: 'Starter', monthlyPrice: 29, yearlyPrice: 23, description: 'Perfect for small teams', features: ['5 team members', '10 dashboards', '1M data points/mo', 'Email support'], ctaText: 'Start Free Trial' },
          { name: 'Pro', monthlyPrice: 79, yearlyPrice: 63, description: 'For growing businesses', features: ['25 team members', 'Unlimited dashboards', '10M data points/mo', 'Priority support', 'API access', 'Custom reports'], highlighted: true, ctaText: 'Start Free Trial' },
          { name: 'Enterprise', monthlyPrice: 199, yearlyPrice: 159, description: 'For large organizations', features: ['Unlimited members', 'Unlimited everything', 'Dedicated CSM', 'SLA guarantee', 'SSO/SAML', 'Custom integrations'], ctaText: 'Contact Sales' },
        ]}
      />

      <FAQ
        title="Frequently Asked Questions"
        items={[
          { question: 'How long does setup take?', answer: 'Most teams are up and running in under 5 minutes. Our guided wizard walks you through connecting your data sources, and our AI automatically starts analyzing patterns.' },
          { question: 'Is my data secure?', answer: 'Absolutely. We are SOC 2 Type II certified, use AES-256 encryption at rest and TLS 1.3 in transit. Your data is isolated and never shared with third parties.' },
          { question: 'Can I cancel anytime?', answer: 'Yes, all plans are month-to-month with no long-term commitment. You can cancel anytime from your account settings.' },
          { question: 'Do you offer a free trial?', answer: 'Yes! Every plan comes with a 14-day free trial. No credit card required to start.' },
          { question: 'What integrations do you support?', answer: 'We support 50+ integrations including Stripe, Shopify, Google Analytics, Salesforce, HubSpot, PostgreSQL, MySQL, and more. Our API also allows custom connections.' },
        ]}
      />

      <CTABanner
        title="Ready to Transform Your Data?"
        description="Join 2,500+ businesses making smarter decisions with AI-powered analytics."
        ctaText="Start Your Free Trial"
        ctaHref="/signup"
        secondaryCtaText="Talk to Sales"
        secondaryCtaHref="/contact"
        trustText={['14-day free trial', 'No credit card required', 'Cancel anytime']}
      />

      <Newsletter
        title="Stay Ahead of the Curve"
        subtitle="Weekly insights on data analytics, AI trends, and growth strategies."
        incentive="Join 15,000+ subscribers"
      />
    </>
  )
}
```

---

## Section Background Rhythm

Always alternate section backgrounds for visual flow:

```
Hero:           bg-gray-950 (dark)
SocialProof:    bg-gray-50 (light gray)
Features:       bg-white
HowItWorks:    bg-gray-50
Stats:          bg-primary-600 (primary color)
Gallery:        bg-gray-900 (dark)
Testimonials:   bg-gray-50
Pricing:        bg-white
FAQ:            bg-gray-50
CTABanner:      bg-gradient (primary)
Contact:        bg-white
Newsletter:     bg-gray-50
Footer:         bg-gray-900 (dark)
```

Never stack two sections with the same background color.
