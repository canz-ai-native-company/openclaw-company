---
name: nextjs-animations
description: Professional animations for Next.js with Motion (Framer Motion) and GSAP. Use when adding page transitions, scroll animations, micro-interactions, text reveals, SVG animations, gesture interactions, or any animation to Next.js/React applications. Covers hello world to production systems with performance optimization and accessibility.
---

# Next.js Animations

Professional animations for Next.js using Motion (Framer Motion) and GSAP.

## Before Implementation

| Source | Gather |
|--------|--------|
| **Codebase** | Existing animation patterns, CSS framework (Tailwind?), component structure |
| **Conversation** | Animation type needed, performance requirements, accessibility needs |
| **Skill References** | Patterns from `references/`, components from `assets/` |

## Quick Start

### Installation

```bash
# Motion (Framer Motion) - Recommended for most cases
npm install motion

# GSAP - For complex timelines, ScrollTrigger, text splitting
npm install gsap @gsap/react
```

### Hello World

```tsx
"use client"
import { motion } from "motion/react"

export function AnimatedBox() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Hello Animation
    </motion.div>
  )
}
```

## When to Use Each Library

| Use Motion | Use GSAP |
|------------|----------|
| Declarative React animations | Complex timelines |
| Layout animations (layoutId) | ScrollTrigger (pin, scrub, snap) |
| Gesture interactions (drag, tap) | SplitText (premium) |
| Exit animations (AnimatePresence) | MorphSVG (premium) |
| Spring physics | Precise sequencing |

## Core Patterns

### Page Transitions

```tsx
// Use component from assets/PageTransition.tsx
import { PageTransition } from "@/components/animations/PageTransition"

// In layout.tsx
export default function Layout({ children }) {
  return (
    <PageTransition type="slideUp" duration={0.4}>
      {children}
    </PageTransition>
  )
}
```

### Scroll Reveal

```tsx
// Use component from assets/ScrollReveal.tsx
<ScrollReveal direction="up" delay={0.2}>
  <Card>Revealed on scroll</Card>
</ScrollReveal>
```

### Stagger Children

```tsx
// Use components from assets/StaggerChildren.tsx
<StaggerContainer staggerDelay={0.1} onScroll>
  <StaggerItem><Card>1</Card></StaggerItem>
  <StaggerItem><Card>2</Card></StaggerItem>
  <StaggerItem><Card>3</Card></StaggerItem>
</StaggerContainer>
```

### Text Reveal

```tsx
// Use component from assets/TextReveal.tsx
<h1>
  <TextReveal splitBy="words" onScroll>
    Welcome to our website
  </TextReveal>
</h1>
```

### Micro-Interactions

```tsx
// Use components from assets/MicroInteractions.tsx
<AnimatedButton variant="scale">Click Me</AnimatedButton>
<AnimatedCard hoverEffect="lift"><Content /></AnimatedCard>
<Magnetic strength={0.3}><Logo /></Magnetic>
```

### Parallax

```tsx
// Use components from assets/ParallaxScroll.tsx
<ParallaxSection backgroundImage="/hero.jpg" speed={0.3}>
  <h1>Hero Title</h1>
</ParallaxSection>
```

### Gestures

```tsx
// Use components from assets/GestureAnimations.tsx
<Draggable constrainToParent><DraggableItem /></Draggable>
<SwipeableCard onSwipeLeft={reject} onSwipeRight={accept} />
<TiltCard intensity={15}><Card /></TiltCard>
```

### SVG Path Drawing

```tsx
// Use components from assets/SVGAnimations.tsx
<AnimatedCheckmark size={48} color="#22c55e" />
<DrawPath d="M10 50 Q 50 10 90 50" duration={2} onScroll />
```

## Performance

### GPU-Accelerated Properties

```tsx
// GOOD - GPU accelerated
animate={{ opacity: 1, transform: "translateX(100px) scale(1.2)" }}

// AVOID - Triggers layout
animate={{ width: 200, height: 200, top: 100 }}
```

### Reduced Motion

All components in `assets/` respect `prefers-reduced-motion`. Manual implementation:

```tsx
import { useReducedMotion } from "motion/react"

function Component() {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      animate={{ x: shouldReduce ? 0 : 100 }}
      transition={{ duration: shouldReduce ? 0 : 0.5 }}
    />
  )
}
```

## Asset Components

Ready-to-use components in `assets/`:

| File | Components |
|------|------------|
| `PageTransition.tsx` | Page transition wrapper |
| `ScrollReveal.tsx` | Scroll-triggered reveal |
| `StaggerChildren.tsx` | Sequential child animations |
| `TextReveal.tsx` | Word/character text animations |
| `ParallaxScroll.tsx` | Parallax effects |
| `MicroInteractions.tsx` | Buttons, cards, loaders |
| `GestureAnimations.tsx` | Drag, swipe, tilt |
| `SVGAnimations.tsx` | Path drawing, checkmarks |

## References

| File | Content |
|------|---------|
| `references/motion-patterns.md` | Motion/Framer Motion patterns |
| `references/gsap-patterns.md` | GSAP with React patterns |
| `references/animation-variants.md` | Reusable variant presets |
