"use client"

import { motion, useReducedMotion } from "motion/react"
import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react"

// ============================================================================
// Animated Button
// ============================================================================

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "scale" | "glow" | "slide"
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = "scale", className = "", ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()

    if (shouldReduceMotion) {
      return (
        <button ref={ref} className={className} {...props}>
          {children}
        </button>
      )
    }

    const variants = {
      scale: {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
      },
      glow: {
        whileHover: {
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
        },
        whileTap: { scale: 0.98 }
      },
      slide: {
        whileHover: { x: 5 },
        whileTap: { x: 0 }
      }
    }

    return (
      <motion.button
        ref={ref}
        className={className}
        {...variants[variant]}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"

// ============================================================================
// Animated Card
// ============================================================================

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: "lift" | "tilt" | "glow"
}

export function AnimatedCard({
  children,
  className = "",
  hoverEffect = "lift"
}: AnimatedCardProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const effects = {
    lift: {
      whileHover: {
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
      }
    },
    tilt: {
      whileHover: {
        rotateX: 5,
        rotateY: 5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
      }
    },
    glow: {
      whileHover: {
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
      }
    }
  }

  return (
    <motion.div
      className={className}
      {...effects[hoverEffect]}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Magnetic Element
// ============================================================================

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({
  children,
  className = "",
  strength = 0.3
}: MagneticProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    e.currentTarget.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translate(0, 0)"
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.3s ease-out" }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Loading Spinner
// ============================================================================

interface SpinnerProps {
  size?: number
  color?: string
  className?: string
}

export function Spinner({
  size = 24,
  color = "currentColor",
  className = ""
}: SpinnerProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
      />
    </motion.svg>
  )
}

// ============================================================================
// Loading Dots
// ============================================================================

interface LoadingDotsProps {
  size?: number
  color?: string
  className?: string
}

export function LoadingDots({
  size = 8,
  color = "currentColor",
  className = ""
}: LoadingDotsProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color
          }}
          animate={{ y: [0, -size, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// Pulse
// ============================================================================

interface PulseProps {
  children: ReactNode
  className?: string
}

export function Pulse({ children, className = "" }: PulseProps) {
  return (
    <motion.div
      className={className}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Ripple Effect
// ============================================================================

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  rippleColor?: string
}

export function RippleButton({
  children,
  rippleColor = "rgba(255,255,255,0.4)",
  className = "",
  ...props
}: RippleButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ripple = document.createElement("span")
    ripple.style.cssText = `
      position: absolute;
      background: ${rippleColor};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      width: 100px;
      height: 100px;
      margin-left: -50px;
      margin-top: -50px;
    `

    button.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)

    props.onClick?.(e)
  }

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      <style jsx global>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}

// Usage:
// <AnimatedButton variant="scale">Click Me</AnimatedButton>
// <AnimatedCard hoverEffect="lift"><CardContent /></AnimatedCard>
// <Magnetic strength={0.3}><Logo /></Magnetic>
// <Spinner size={32} />
// <LoadingDots />
// <RippleButton>Submit</RippleButton>
