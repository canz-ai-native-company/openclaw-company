---
name: motion-design-system
description: |
  Premium motion patterns for landing pages. Defines the motion register, animation
  catalogue, performance budget, and accessibility rules. Extends nextjs-animations
  with hero-grade reveal sequences, micro-interactions, and scroll-driven effects.
  Triggers on "animations", "motion", "scroll effects", "micro-interactions",
  "framer motion", "GSAP".
---

# Motion Design System

Builds on the existing `nextjs-animations` skill. That skill handles the basics
(ScrollReveal, StaggerChildren, TextReveal). This skill defines the **premium
motion vocabulary** — the patterns that take a site from "animated" to "alive".

> Library default: **`motion`** (the rebrand of framer-motion, late 2024). Import
> from `motion/react`. GSAP only when justified (see decision tree below).

---

## Hard Rules

1. Animations must serve UX. If you can't explain *why* an element animates,
   delete the animation.
2. Respect `prefers-reduced-motion: reduce` in every component. Use the `useReducedMotion()` hook.
3. Animate `transform` and `opacity` only on hot paths. Avoid `width`, `height`,
   `top`, `left` for performance.
4. Total page mount-time animation budget: < 1.5s. After that, the page must feel
   settled.
5. Continuous (looping) animations: max 2 per viewport. Otherwise the page feels jittery.
6. Hover transitions: 150-250ms. Mount/scroll reveals: 400-700ms. Cinematic moves: 700-1200ms.
7. No animation should run on the LCP element before LCP is reached.

---

## Motion Register (Picked in `design-direction`)

Match the register to the brand. Don't blend.

### Subtle (Stripe / Linear)
- Mount: brief fade + slight rise, no stagger of words
- Scroll: simple opacity fade, 0.2s
- Hover: subtle background shift, no scale
- Continuous: none, or one slow gradient drift

### Confident (Vercel / Resend)
- Mount: layered stagger (background → headline split → sub → CTA → trust)
- Scroll: directional reveal with 0.1s stagger across grids
- Hover: scale 1.02 + subtle shadow lift on cards
- Continuous: animated gradient background

### Playful (Cal.com / Loom)
- Mount: spring-bounce reveals, character entry
- Scroll: rotation + scale on cards
- Hover: tilt, magnetic attraction, color shifts
- Continuous: micro-bounce on CTAs, animated emojis, floating elements

### Cinematic (Apple / agencies / Awwwards)
- Mount: scroll-locked first scene, pinned reveals
- Scroll: pinned sections, parallax depth, scrubbed video
- Hover: cursor follower, magnetic buttons, image zoom
- Continuous: particle systems, video backgrounds (with care)

---

## Library Decision Tree

```
Need animation?
├── React component, declarative, < 80% of cases
│   └── Use `motion/react` (Framer Motion)
├── Pin scroll, scrubbed timeline, complex sequencing
│   └── Use GSAP + ScrollTrigger (`gsap` + `@gsap/react`)
├── Just CSS keyframes (looping background, simple hover)
│   └── Use Tailwind `animate-*` or @keyframes — no JS needed
├── Text splitting + scrubbed character reveal
│   └── GSAP SplitText (paid) or motion's per-character mapping
└── Physics (drag, bounce, spring chains)
    └── Use motion's spring or react-spring
```

90% of premium landing pages can be built with motion + CSS keyframes. GSAP is
the right tool for cinematic / agency briefs only.

Both libraries' Next.js requirement: parent component must have `'use client'`.

---

## The Premium Motion Catalogue

### A. Hero Reveal Sequence (1.4s total)

See `hero-section-specialist` for the full layered sequence.

### B. Scroll Reveal (default per section)

```tsx
'use client'
import { motion, useReducedMotion } from 'motion/react'

export function ScrollReveal({ children, delay = 0, y = 24 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### C. Stagger Children (for grids: features, pricing, gallery)

```tsx
'use client'
import { motion, useReducedMotion } from 'motion/react'

const container = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}
const item = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export function Stagger({ children, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      variants={reduce ? undefined : container}
      initial={reduce ? undefined : 'hidden'}
      whileInView={reduce ? undefined : 'visible'}
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
export const StaggerItem = motion.div
// usage: <Stagger className="grid grid-cols-3 gap-6">
//          {items.map(i => <StaggerItem variants={item} key={i}>...</StaggerItem>)}
//        </Stagger>
```

### D. Text Reveal (word-by-word for hero / section headers)

```tsx
'use client'
import { motion, useReducedMotion } from 'motion/react'

export function TextRevealWords({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  const words = String(children).split(' ')
  if (reduce) return <span className={className}>{children}</span>
  return (
    <span className={`${className} inline-block`}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {w}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}
```

### E. Magnetic Button (premium micro-interaction)

```tsx
'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function MagneticButton({ children, className = '' }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })

  function onMove(e: React.MouseEvent) {
    const rect = ref.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.25)
    y.set((e.clientY - cy) * 0.25)
  }
  function onLeave() { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      {children}
    </motion.div>
  )
}
```

### F. Card Tilt on Hover (3D feel without 3D)

```tsx
'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react'

export function TiltCard({ children, className = '' }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 20 })
  const sy = useSpring(y, { stiffness: 150, damping: 20 })
  const rotX = useTransform(sy, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotY = useTransform(sx, [-0.5, 0.5], ['-7deg', '7deg'])

  function onMove(e: React.MouseEvent) {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### G. Cursor Spotlight on Card (Aceternity-style "card spotlight")

```tsx
'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'motion/react'

export function SpotlightCard({ children, className = '' }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const bg = useMotionTemplate`radial-gradient(280px circle at ${x}px ${y}px, rgba(139,92,246,0.18), transparent 60%)`

  function onMove(e: React.MouseEvent) {
    const r = ref.current!.getBoundingClientRect()
    x.set(e.clientX - r.left); y.set(e.clientY - r.top)
  }
  return (
    <div ref={ref} onMouseMove={onMove} className={`group relative overflow-hidden ${className}`}>
      <motion.div style={{ background: bg }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
      {children}
    </div>
  )
}
```

### H. Scroll-driven Number Counter

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

export function Counter({ end, duration = 2 }) {
  const ref = useRef(null); const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(end * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])
  return <span ref={ref}>{n.toLocaleString()}</span>
}
```

### I. Marquee (logo cloud)

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee { animation: marquee 30s linear infinite; }
.marquee:hover { animation-play-state: paused; }
```

```tsx
<div className="overflow-hidden">
  <div className="marquee flex gap-12 w-max">
    {[...logos, ...logos].map((logo, i) => <img key={i} src={logo.src} alt={logo.alt} />)}
  </div>
</div>
```

### J. Scroll Progress Bar (premium polish)

```tsx
'use client'
import { motion, useScroll, useSpring } from 'motion/react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent" />
}
```

### K. Sticky Reveal / Pinned Section (cinematic register only)

Use GSAP ScrollTrigger when you need a pinned section that scrubs through states.
For declarative React, motion's `useScroll` + `useTransform` covers most cases:

```tsx
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export function Pinned() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ scale, opacity }}>...</motion.div>
      </div>
    </section>
  )
}
```

### L. Animated Beam / Connecting Lines (between feature cards)

For "this connects to that" diagrams, use SVG paths with `pathLength` animation:

```tsx
<motion.path
  d="M0,0 C50,0 50,100 100,100"
  stroke="currentColor"
  strokeWidth="2"
  fill="none"
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  transition={{ duration: 1.2 }}
  viewport={{ once: true }}
/>
```

---

## Per-Section Animation Plan (Default Recipe)

| Section | Mount/Scroll | Hover | Continuous |
|---------|--------------|-------|-----------|
| Hero | Layered reveal sequence (1.4s) | Magnetic CTA, scale on visual | One subtle background drift |
| Logo cloud | Fade in, then marquee starts | Pause marquee + grayscale → color | Slow horizontal scroll |
| Problem / Pain | Single fade-up | — | — |
| Features (bento) | Stagger, 0.08s | Card tilt + spotlight | — |
| How It Works | Stagger steps + path draw | — | — |
| Stats | Counter on view | — | — |
| Showcase / Gallery | Stagger reveal | Image zoom + caption fade | — |
| Testimonials | Single fade, then auto-rotate | Pause on hover | Auto-rotate every 5s |
| Pricing | Stagger cards | Highlighted card pulse on toggle | — |
| FAQ | Single fade | Accordion smooth height | — |
| CTA Banner | Single fade with shimmer | CTA scale + shadow | Optional gradient drift |
| Footer | Single fade | Hover underline | — |

---

## Accessibility — Reduced Motion (Mandatory)

```tsx
import { useReducedMotion } from 'motion/react'

const reduce = useReducedMotion()
// branch: when reduce, skip transforms; just opacity, or no animation at all
```

Never assume the user wants motion. ~6% of users have reduced-motion enabled (and
some users with vestibular disorders rely on it).

---

## Performance Budget

- Total animated elements per viewport: ≤ 12
- JS executed during page load for animation: < 30ms (use LazyMotion if needed)
- Avoid `box-shadow` animations on large surfaces — animate filter / opacity instead
- Don't run continuous animations off-viewport — use `useInView` to gate them
- For dark theme glow effects, animate `opacity` of the glow layer, not `box-shadow`

---

## Anti-Patterns

- Animating EVERY element — fatigue and slowness
- Animating headlines that come in word-by-word over 3 seconds
- Forgetting reduced-motion fallback
- 5 continuous animations playing simultaneously
- Using GSAP for a fade-in (overkill — `motion` is lighter)
- Hover animations longer than 250ms (feel sluggish)
- `whileInView` without `viewport={{ once: true }}` — re-triggers on every scroll
- Scroll-pinned sections on mobile — they're confusing and break browser back
