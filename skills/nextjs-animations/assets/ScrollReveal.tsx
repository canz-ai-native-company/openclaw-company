"use client"

import { motion, useReducedMotion, Variants } from "motion/react"
import { ReactNode } from "react"

type RevealDirection = "up" | "down" | "left" | "right" | "scale"

interface ScrollRevealProps {
  children: ReactNode
  direction?: RevealDirection
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  className?: string
  threshold?: number
}

const getVariants = (direction: RevealDirection, distance: number): Variants => {
  const directions: Record<RevealDirection, { x?: number; y?: number; scale?: number }> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    scale: { scale: 0.8 }
  }

  return {
    hidden: {
      opacity: 0,
      ...directions[direction]
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1
    }
  }
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  className = "",
  threshold = 0.1
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const variants = getVariants(direction, distance)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Usage:
// <ScrollReveal direction="up" delay={0.2}>
//   <Card>Content</Card>
// </ScrollReveal>
