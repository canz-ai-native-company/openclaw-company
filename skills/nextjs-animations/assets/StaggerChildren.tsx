"use client"

import { motion, useReducedMotion, Variants } from "motion/react"
import { ReactNode, Children, isValidElement, cloneElement } from "react"

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  initialDelay?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
  onScroll?: boolean
  once?: boolean
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  initialDelay = 0.2,
  className = "",
  as = "div",
  onScroll = false,
  once = true
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion()
  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div

  if (shouldReduceMotion) {
    const Component = as
    return <Component className={className}>{children}</Component>
  }

  const customContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay
      }
    }
  }

  const animationProps = onScroll
    ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once, amount: 0.1 }
      }
    : {
        initial: "hidden",
        animate: "visible"
      }

  return (
    <MotionComponent
      variants={customContainerVariants}
      className={className}
      {...animationProps}
    >
      {children}
    </MotionComponent>
  )
}

export function StaggerItem({
  children,
  className = "",
  as = "div"
}: StaggerItemProps) {
  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div

  return (
    <MotionComponent variants={itemVariants} className={className}>
      {children}
    </MotionComponent>
  )
}

// Usage:
// <StaggerContainer staggerDelay={0.1} onScroll>
//   <StaggerItem><Card>1</Card></StaggerItem>
//   <StaggerItem><Card>2</Card></StaggerItem>
//   <StaggerItem><Card>3</Card></StaggerItem>
// </StaggerContainer>
//
// Or with list:
// <StaggerContainer as="ul" onScroll>
//   {items.map(item => (
//     <StaggerItem key={item.id} as="li">
//       {item.content}
//     </StaggerItem>
//   ))}
// </StaggerContainer>
