"use client"

import { motion, useReducedMotion, Variants } from "motion/react"
import { useMemo } from "react"

type SplitType = "chars" | "words" | "lines"

interface TextRevealProps {
  children: string
  splitBy?: SplitType
  staggerDelay?: number
  duration?: number
  className?: string
  charClassName?: string
  onScroll?: boolean
  once?: boolean
  delay?: number
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0
  }
}

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 40, skewY: 3 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0
  }
}

export function TextReveal({
  children,
  splitBy = "words",
  staggerDelay = 0.03,
  duration = 0.4,
  className = "",
  charClassName = "",
  onScroll = false,
  once = true,
  delay = 0
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  const elements = useMemo(() => {
    switch (splitBy) {
      case "chars":
        return children.split("").map((char, i) => ({
          key: i,
          content: char === " " ? "\u00A0" : char
        }))
      case "words":
        return children.split(" ").map((word, i) => ({
          key: i,
          content: word
        }))
      case "lines":
        return children.split("\n").map((line, i) => ({
          key: i,
          content: line
        }))
      default:
        return [{ key: 0, content: children }]
    }
  }, [children, splitBy])

  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>
  }

  const variants = splitBy === "chars" ? charVariants : splitBy === "words" ? wordVariants : lineVariants
  const stagger = splitBy === "chars" ? staggerDelay : splitBy === "words" ? staggerDelay * 2 : staggerDelay * 5

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }

  const animationProps = onScroll
    ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once, amount: 0.5 }
      }
    : {
        initial: "hidden",
        animate: "visible"
      }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      {...animationProps}
    >
      {elements.map(({ key, content }) => (
        <motion.span
          key={key}
          className={`inline-block ${charClassName}`}
          variants={variants}
          transition={{ duration }}
          style={{ transformOrigin: "bottom" }}
        >
          {content}
          {splitBy === "words" && key < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Usage:
// <h1>
//   <TextReveal splitBy="words" staggerDelay={0.05}>
//     Welcome to our website
//   </TextReveal>
// </h1>
//
// <p>
//   <TextReveal splitBy="chars" onScroll>
//     Character by character reveal
//   </TextReveal>
// </p>
