# Motion (Framer Motion) Patterns

## Installation

```bash
npm install motion
```

## Next.js App Router Setup

```tsx
"use client"
import { motion } from "motion/react"
// Or for smaller bundle:
import * as motion from "motion/react-client"
```

## Core Concepts

### Basic Animation

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```

### Variants (Reusable States)

```tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
/>
```

### Exit Animations

```tsx
import { AnimatePresence } from "motion/react"

<AnimatePresence>
  {show && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

## Scroll Animations

### whileInView (Scroll-Triggered)

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
/>
```

### useScroll (Scroll-Linked)

```tsx
import { useScroll, useTransform } from "motion/react"

function ParallaxSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

  return <motion.div style={{ y, opacity }} />
}
```

### Element-Specific Scroll

```tsx
const ref = useRef(null)
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
})
```

## Layout Animations

### Shared Element Transitions

```tsx
// List item
<motion.li layout>
  {item.name}
  {item.isSelected && <motion.div layoutId="underline" />}
</motion.li>

// The underline animates between items
```

### Layout Groups

```tsx
import { LayoutGroup } from "motion/react"

<LayoutGroup>
  {items.map(item => (
    <motion.div key={item.id} layout />
  ))}
</LayoutGroup>
```

## Gesture Animations

### Hover, Tap, Focus

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ boxShadow: "0 0 0 3px rgba(66,153,225,0.6)" }}
/>
```

### Drag

```tsx
const constraintsRef = useRef(null)

<motion.div ref={constraintsRef}>
  <motion.div
    drag
    dragConstraints={constraintsRef}
    dragElastic={0.2}
    whileDrag={{ scale: 1.1 }}
  />
</motion.div>
```

## Stagger Animations

```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(i => (
    <motion.li key={i} variants={item} />
  ))}
</motion.ul>
```

### Stagger from Center

```tsx
import { stagger } from "motion"

transition: {
  staggerChildren: stagger(0.1, { from: "center" })
}
```

## SVG Path Animations

```tsx
<motion.svg viewBox="0 0 100 100">
  <motion.circle
    cx="50"
    cy="50"
    r="40"
    stroke="#000"
    strokeWidth="2"
    fill="none"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  />
</motion.svg>
```

## Transition Types

### Spring (Physics-Based)

```tsx
transition: {
  type: "spring",
  stiffness: 400,
  damping: 25
}

// Or duration-based spring
transition: {
  type: "spring",
  duration: 0.5,
  bounce: 0.3
}
```

### Tween (Duration-Based)

```tsx
transition: {
  type: "tween",
  duration: 0.5,
  ease: "easeInOut"
}

// Custom easing
transition: {
  ease: [0.6, 0.01, -0.05, 0.95]
}
```

### Keyframes

```tsx
animate={{
  x: [0, 100, 50, 100],
  opacity: [0, 1, 1, 0]
}}
transition={{ duration: 2, times: [0, 0.3, 0.7, 1] }}
```

## Motion Values (Imperative)

```tsx
import { useMotionValue, useTransform, useSpring } from "motion/react"

const x = useMotionValue(0)
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
const smoothX = useSpring(x, { stiffness: 300, damping: 30 })

<motion.div style={{ x: smoothX, opacity }} />
```

## useAnimate (Imperative Control)

```tsx
import { useAnimate } from "motion/react"

function Component() {
  const [scope, animate] = useAnimate()

  const handleClick = async () => {
    await animate(scope.current, { scale: 1.2 })
    await animate(scope.current, { scale: 1 })
  }

  return <motion.div ref={scope} onClick={handleClick} />
}
```

## Text Animations

### ScrambleText

```tsx
import { ScrambleText } from "motion-plus-react"

<ScrambleText duration={0.5}>Hello World</ScrambleText>
```

### Typewriter

```tsx
import { Typewriter } from "motion-plus-react"

<Typewriter speed={50} backspace="word">{text}</Typewriter>
```

### Word-by-Word (Manual)

```tsx
const words = text.split(" ")

<motion.p variants={container} initial="hidden" animate="visible">
  {words.map((word, i) => (
    <motion.span key={i} variants={item} className="inline-block mr-1">
      {word}
    </motion.span>
  ))}
</motion.p>
```

## Performance Optimization

### GPU-Accelerated Properties

```tsx
// Prefer transform over individual properties
animate={{ transform: "translateX(100px) scale(1.2)" }}

// GPU-accelerated: opacity, transform, filter, clipPath
// NOT accelerated: width, height, top, left, backgroundColor
```

### will-change

```tsx
<motion.div style={{ willChange: "transform" }} />
```

### Layout Animation Performance

```tsx
// Use layoutId only when needed
// Prefer layout="position" or layout="size" over layout={true}
<motion.div layout="position" />
```

## Accessibility

### Reduced Motion

```tsx
import { useReducedMotion } from "motion/react"

function Component() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{
        x: shouldReduceMotion ? 0 : 100,
        opacity: 1
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5
      }}
    />
  )
}
```

### Global Reduced Motion

```tsx
import { MotionConfig } from "motion/react"

<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```
