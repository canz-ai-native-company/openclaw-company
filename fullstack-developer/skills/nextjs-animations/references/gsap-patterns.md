# GSAP Patterns for Next.js

## Installation

```bash
npm install gsap @gsap/react
```

### Premium Plugins (Club GreenSock)

```bash
# With npm token configured
npm install gsap@npm:@gsap/shockingly
```

## Next.js Setup

```tsx
"use client"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)
```

## Core Concepts

### Basic Tween

```tsx
// To (animate TO values)
gsap.to(".box", { x: 100, duration: 1 })

// From (animate FROM values)
gsap.from(".box", { opacity: 0, y: 50, duration: 1 })

// FromTo (explicit start and end)
gsap.fromTo(".box",
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0, duration: 1 }
)
```

### useGSAP Hook (React)

```tsx
function Component() {
  const container = useRef(null)

  useGSAP(() => {
    gsap.to(".box", { x: 100 })
  }, { scope: container })

  return (
    <div ref={container}>
      <div className="box" />
    </div>
  )
}
```

### Context-Safe Animations

```tsx
function Component() {
  const container = useRef(null)

  const { contextSafe } = useGSAP({ scope: container })

  // Safe for event handlers
  const handleClick = contextSafe(() => {
    gsap.to(".box", { rotation: 360 })
  })

  return (
    <div ref={container}>
      <button onClick={handleClick}>Animate</button>
      <div className="box" />
    </div>
  )
}
```

## Timelines

```tsx
useGSAP(() => {
  const tl = gsap.timeline()

  tl.to(".box1", { x: 100, duration: 1 })
    .to(".box2", { x: 100, duration: 1 })      // Starts after box1
    .to(".box3", { x: 100, duration: 1 }, "-=0.5")  // Overlaps 0.5s
    .to(".box4", { x: 100, duration: 1 }, "+=0.5")  // 0.5s gap
    .to(".box5", { x: 100, duration: 1 }, 2)        // At 2 seconds

}, { scope: container })
```

### Timeline with Labels

```tsx
const tl = gsap.timeline()

tl.addLabel("start")
  .to(".box", { x: 100 })
  .addLabel("middle")
  .to(".box", { rotation: 360 })
  .addLabel("end")

// Jump to label
tl.seek("middle")
```

### Controlling Timelines

```tsx
const tl = useRef<gsap.core.Timeline>()

useGSAP(() => {
  tl.current = gsap.timeline({ paused: true })
    .to(".box", { x: 100 })
    .to(".box", { rotation: 360 })
}, { scope: container })

// Control methods
tl.current?.play()
tl.current?.pause()
tl.current?.reverse()
tl.current?.restart()
tl.current?.progress(0.5)
```

## ScrollTrigger

### Basic Scroll Animation

```tsx
useGSAP(() => {
  gsap.to(".box", {
    x: 500,
    scrollTrigger: {
      trigger: ".box",
      start: "top 80%",    // trigger top hits viewport 80%
      end: "bottom 20%",   // trigger bottom hits viewport 20%
      scrub: true,         // Link to scroll position
    }
  })
}, { scope: container })
```

### Pin Element

```tsx
ScrollTrigger.create({
  trigger: ".section",
  start: "top top",
  end: "+=500",
  pin: true,
  pinSpacing: true
})
```

### Scrub with Smoothing

```tsx
scrollTrigger: {
  scrub: 1,  // 1 second to catch up
  // scrub: true  // Direct link, no smoothing
}
```

### Snap to Sections

```tsx
scrollTrigger: {
  snap: {
    snapTo: "labels",
    duration: { min: 0.2, max: 0.5 },
    ease: "power1.inOut"
  }
}
```

### Multiple Elements (Loop)

```tsx
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>(".section").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 100,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 50%",
        scrub: 1
      }
    })
  })
}, { scope: container })
```

## Stagger

```tsx
gsap.from(".item", {
  opacity: 0,
  y: 50,
  duration: 0.5,
  stagger: 0.1  // 0.1s between each
})

// Advanced stagger
gsap.from(".item", {
  opacity: 0,
  stagger: {
    each: 0.1,
    from: "center",  // "start", "end", "center", "edges", "random"
    grid: "auto",
    ease: "power2.inOut"
  }
})
```

## SplitText (Premium)

```tsx
import { SplitText } from "gsap/SplitText"
gsap.registerPlugin(SplitText)

useGSAP(() => {
  const split = SplitText.create(".heading", {
    type: "words, chars",
    charsClass: "char",
    wordsClass: "word"
  })

  gsap.from(split.chars, {
    opacity: 0,
    y: 50,
    rotateX: -90,
    stagger: 0.02,
    duration: 0.5,
    ease: "back.out"
  })
}, { scope: container })
```

### Free Alternative: Manual Split

```tsx
function SplitText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={className}>
      {children.split("").map((char, i) => (
        <span key={i} className="char inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}

// Then animate with GSAP
gsap.from(".char", { opacity: 0, y: 20, stagger: 0.03 })
```

## DrawSVG (Premium)

```tsx
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
gsap.registerPlugin(DrawSVGPlugin)

gsap.fromTo("path",
  { drawSVG: "0%" },
  { drawSVG: "100%", duration: 2 }
)

// Partial draw
gsap.to("path", { drawSVG: "20% 80%" })
```

### Free Alternative: pathLength

```tsx
// CSS
.path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

// GSAP
gsap.to(".path", {
  strokeDashoffset: 0,
  duration: 2,
  ease: "none"
})
```

## MorphSVG (Premium)

```tsx
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
gsap.registerPlugin(MorphSVGPlugin)

gsap.to("#shape1", {
  morphSVG: "#shape2",
  duration: 1
})
```

## Easing

```tsx
// Built-in
ease: "power1.out"    // Subtle
ease: "power2.out"    // Moderate
ease: "power3.out"    // Strong
ease: "power4.out"    // Aggressive
ease: "back.out(1.7)" // Overshoot
ease: "elastic.out"   // Bouncy
ease: "bounce.out"    // Ball bounce

// Directions
ease: "power2.in"     // Slow start
ease: "power2.out"    // Slow end
ease: "power2.inOut"  // Slow both

// Custom
ease: "steps(5)"
ease: CustomEase.create("custom", "M0,0 C0.5,0 0.5,1 1,1")
```

## Performance

### Hardware Acceleration

```tsx
// Force GPU
gsap.to(".box", {
  x: 100,
  force3D: true  // Adds translateZ(0)
})

// Disable if causing issues
gsap.config({ force3D: false })
```

### will-change

```tsx
gsap.set(".box", { willChange: "transform" })
// After animation
gsap.set(".box", { willChange: "auto" })
```

### Batch Animations

```tsx
ScrollTrigger.batch(".item", {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 50,
      stagger: 0.1
    })
  }
})
```

## Cleanup

```tsx
useGSAP(() => {
  const tl = gsap.timeline()
  // ... animations

  return () => {
    tl.kill()
    ScrollTrigger.getAll().forEach(t => t.kill())
  }
}, { scope: container })
```

## Reduced Motion

```tsx
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(100) // Near-instant
  // Or disable entirely
  gsap.config({ nullTargetWarn: false })
}
```
