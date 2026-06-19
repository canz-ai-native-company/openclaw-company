"use client"

import { motion, useMotionValue, useTransform, useReducedMotion, PanInfo } from "motion/react"
import { useRef, ReactNode } from "react"

// ============================================================================
// Draggable Element
// ============================================================================

interface DraggableProps {
  children: ReactNode
  className?: string
  constrainToParent?: boolean
  onDragEnd?: (info: PanInfo) => void
  returnToOrigin?: boolean
}

export function Draggable({
  children,
  className = "",
  constrainToParent = true,
  onDragEnd,
  returnToOrigin = true
}: DraggableProps) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={constraintsRef} className="relative w-full h-full">
      <motion.div
        drag
        dragConstraints={constrainToParent ? constraintsRef : undefined}
        dragElastic={0.1}
        dragMomentum={false}
        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        onDragEnd={(_, info) => onDragEnd?.(info)}
        className={`cursor-grab ${className}`}
        animate={returnToOrigin ? { x: 0, y: 0 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ============================================================================
// Swipeable Card
// ============================================================================

interface SwipeableCardProps {
  children: ReactNode
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export function SwipeableCard({
  children,
  className = "",
  onSwipeLeft,
  onSwipeRight,
  threshold = 100
}: SwipeableCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > threshold) {
      onSwipeRight?.()
    } else if (info.offset.x < -threshold) {
      onSwipeLeft?.()
    }
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      className={`cursor-grab ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Pinch to Zoom
// ============================================================================

interface PinchZoomProps {
  children: ReactNode
  className?: string
  minScale?: number
  maxScale?: number
}

export function PinchZoom({
  children,
  className = "",
  minScale = 1,
  maxScale = 3
}: PinchZoomProps) {
  const scale = useMotionValue(1)

  return (
    <motion.div
      className={className}
      style={{ scale }}
      whileHover={{ cursor: "zoom-in" }}
      onDoubleClick={() => {
        const currentScale = scale.get()
        scale.set(currentScale === 1 ? 2 : 1)
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Drag to Reorder List
// ============================================================================

interface DragReorderItemProps {
  children: ReactNode
  index: number
  onReorder: (from: number, to: number) => void
  className?: string
}

export function DragReorderItem({
  children,
  index,
  onReorder,
  className = ""
}: DragReorderItemProps) {
  const y = useMotionValue(0)
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      layout
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      style={{ y }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        zIndex: 1
      }}
      onDragEnd={(_, info) => {
        const moveBy = Math.round(info.offset.y / 60) // Assuming ~60px item height
        if (moveBy !== 0) {
          onReorder(index, index + moveBy)
        }
      }}
      className={`cursor-grab ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Pull to Refresh
// ============================================================================

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  className?: string
  threshold?: number
}

export function PullToRefresh({
  children,
  onRefresh,
  className = "",
  threshold = 80
}: PullToRefreshProps) {
  const y = useMotionValue(0)
  const pullProgress = useTransform(y, [0, threshold], [0, 1])
  const rotate = useTransform(pullProgress, [0, 1], [0, 360])

  const handleDragEnd = async () => {
    if (y.get() > threshold) {
      await onRefresh()
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Refresh indicator */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center"
        style={{ y: useTransform(y, [0, threshold], [-40, 20]), opacity: pullProgress }}
      >
        <motion.div
          className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
          style={{ rotate }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        style={{ y }}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ============================================================================
// Tilt Card (Mouse Follow)
// ============================================================================

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export function TiltCard({
  children,
  className = "",
  intensity = 15
}: TiltCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -intensity
    const rotateY = ((x - centerX) / centerX) * intensity

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    }
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.1s ease-out",
        transformStyle: "preserve-3d"
      }}
    >
      {children}
    </div>
  )
}

// Usage:
// <Draggable constrainToParent>
//   <div className="w-20 h-20 bg-blue-500 rounded" />
// </Draggable>
//
// <SwipeableCard onSwipeLeft={() => reject()} onSwipeRight={() => accept()}>
//   <ProfileCard />
// </SwipeableCard>
//
// <TiltCard intensity={20}>
//   <Card>Hover over me</Card>
// </TiltCard>
//
// {items.map((item, i) => (
//   <DragReorderItem key={item.id} index={i} onReorder={handleReorder}>
//     {item.content}
//   </DragReorderItem>
// ))}
