"use client"

import { motion, useReducedMotion } from "motion/react"
import { ReactNode, SVGProps } from "react"

// ============================================================================
// SVG Path Draw Animation
// ============================================================================

interface DrawPathProps extends SVGProps<SVGPathElement> {
  duration?: number
  delay?: number
  strokeWidth?: number
  stroke?: string
  onScroll?: boolean
}

export function DrawPath({
  d,
  duration = 2,
  delay = 0,
  strokeWidth = 2,
  stroke = "currentColor",
  onScroll = false,
  ...props
}: DrawPathProps) {
  const shouldReduceMotion = useReducedMotion()

  const animationProps = onScroll
    ? {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true }
      }
    : {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 }
      }

  if (shouldReduceMotion) {
    return (
      <path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        {...props}
      />
    )
  }

  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      {...animationProps}
      transition={{ duration, delay, ease: "easeInOut" }}
      {...props}
    />
  )
}

// ============================================================================
// Animated Circle
// ============================================================================

interface AnimatedCircleProps {
  cx: number
  cy: number
  r: number
  duration?: number
  delay?: number
  strokeWidth?: number
  stroke?: string
  onScroll?: boolean
}

export function AnimatedCircle({
  cx,
  cy,
  r,
  duration = 2,
  delay = 0,
  strokeWidth = 2,
  stroke = "currentColor",
  onScroll = false
}: AnimatedCircleProps) {
  const shouldReduceMotion = useReducedMotion()

  const animationProps = onScroll
    ? {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true }
      }
    : {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 }
      }

  if (shouldReduceMotion) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
    )
  }

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      {...animationProps}
      transition={{ duration, delay, ease: "easeInOut" }}
    />
  )
}

// ============================================================================
// Animated Checkmark
// ============================================================================

interface AnimatedCheckmarkProps {
  size?: number
  strokeWidth?: number
  color?: string
  duration?: number
  className?: string
}

export function AnimatedCheckmark({
  size = 64,
  strokeWidth = 3,
  color = "#22c55e",
  duration = 0.5,
  className = ""
}: AnimatedCheckmarkProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      {/* Circle */}
      <motion.circle
        cx="32"
        cy="32"
        r="28"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : duration,
          ease: "easeInOut"
        }}
      />
      {/* Checkmark */}
      <motion.path
        d="M20 32L28 40L44 24"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : duration,
          delay: shouldReduceMotion ? 0 : duration * 0.5,
          ease: "easeInOut"
        }}
      />
    </svg>
  )
}

// ============================================================================
// Animated Cross/X
// ============================================================================

interface AnimatedCrossProps {
  size?: number
  strokeWidth?: number
  color?: string
  duration?: number
  className?: string
}

export function AnimatedCross({
  size = 64,
  strokeWidth = 3,
  color = "#ef4444",
  duration = 0.5,
  className = ""
}: AnimatedCrossProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <motion.circle
        cx="32"
        cy="32"
        r="28"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : duration,
          ease: "easeInOut"
        }}
      />
      <motion.path
        d="M22 22L42 42M42 22L22 42"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : duration,
          delay: shouldReduceMotion ? 0 : duration * 0.5,
          ease: "easeInOut"
        }}
      />
    </svg>
  )
}

// ============================================================================
// Logo/Icon Wrapper
// ============================================================================

interface AnimatedSVGWrapperProps {
  children: ReactNode
  width?: number
  height?: number
  viewBox?: string
  className?: string
  duration?: number
  staggerDelay?: number
  onScroll?: boolean
}

export function AnimatedSVGWrapper({
  children,
  width = 100,
  height = 100,
  viewBox = "0 0 100 100",
  className = "",
  duration = 1.5,
  staggerDelay = 0.1,
  onScroll = false
}: AnimatedSVGWrapperProps) {
  const animationProps = onScroll
    ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true }
      }
    : {
        initial: "hidden",
        animate: "visible"
      }

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      {...animationProps}
    >
      {children}
    </motion.svg>
  )
}

// Helper component for paths inside AnimatedSVGWrapper
export function AnimatedSVGPath({
  d,
  stroke = "currentColor",
  strokeWidth = 2,
  fill = "none",
  duration = 1.5,
  ...props
}: DrawPathProps & { duration?: number }) {
  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap="round"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
          pathLength: 1,
          opacity: 1,
          transition: { duration, ease: "easeInOut" }
        }
      }}
      {...props}
    />
  )
}

// Usage:
// <svg viewBox="0 0 100 100">
//   <DrawPath
//     d="M10 50 Q 50 10 90 50 T 170 50"
//     duration={2}
//     onScroll
//   />
// </svg>
//
// <AnimatedCheckmark size={48} color="#22c55e" />
// <AnimatedCross size={48} color="#ef4444" />
//
// <AnimatedSVGWrapper onScroll>
//   <AnimatedSVGPath d="M..." />
//   <AnimatedSVGPath d="M..." />
// </AnimatedSVGWrapper>
