"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"
import { useRef, ReactNode } from "react"

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: "up" | "down"
}

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  backgroundImage?: string
  overlayColor?: string
  speed?: number
}

interface ParallaxLayerProps {
  children: ReactNode
  speed: number
  className?: string
}

export function Parallax({
  children,
  speed = 0.5,
  className = "",
  direction = "up"
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const factor = direction === "up" ? -1 : 1
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [100 * speed * factor, -100 * speed * factor]
  )

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

export function ParallaxSection({
  children,
  className = "",
  backgroundImage,
  overlayColor = "rgba(0,0,0,0.4)",
  speed = 0.3
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : [`${-20 * speed}%`, `${20 * speed}%`]
  )

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <>
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              y,
              backgroundImage: `url(${backgroundImage})`,
              scale: 1.2
            }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor }}
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function ParallaxLayers({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>
}

export function ParallaxLayer({
  children,
  speed,
  className = ""
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [100 * speed, -100 * speed]
  )

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// Usage:
// Simple parallax element
// <Parallax speed={0.5}>
//   <img src="/hero.jpg" alt="Hero" />
// </Parallax>
//
// Parallax background section
// <ParallaxSection
//   backgroundImage="/bg.jpg"
//   overlayColor="rgba(0,0,0,0.5)"
//   className="h-screen flex items-center justify-center"
// >
//   <h1 className="text-white text-6xl">Hero Title</h1>
// </ParallaxSection>
//
// Multiple parallax layers
// <ParallaxLayers>
//   <ParallaxLayer speed={0.2}><div>Slow layer</div></ParallaxLayer>
//   <ParallaxLayer speed={0.5}><div>Medium layer</div></ParallaxLayer>
//   <ParallaxLayer speed={0.8}><div>Fast layer</div></ParallaxLayer>
// </ParallaxLayers>
