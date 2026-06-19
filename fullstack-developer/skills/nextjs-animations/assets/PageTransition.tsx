"use client"

import { motion, AnimatePresence } from "motion/react"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

type TransitionType = "fade" | "slideUp" | "slideRight" | "scale"

interface PageTransitionProps {
  children: ReactNode
  type?: TransitionType
  duration?: number
  className?: string
}

const transitions: Record<TransitionType, {
  initial: object
  animate: object
  exit: object
}> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  }
}

export function PageTransition({
  children,
  type = "fade",
  duration = 0.3,
  className = ""
}: PageTransitionProps) {
  const pathname = usePathname()
  const transition = transitions[type]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={transition.initial}
        animate={transition.animate}
        exit={transition.exit}
        transition={{ duration, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Usage in layout.tsx:
// import { PageTransition } from "@/components/animations/PageTransition"
//
// export default function Layout({ children }) {
//   return (
//     <PageTransition type="slideUp" duration={0.4}>
//       {children}
//     </PageTransition>
//   )
// }
