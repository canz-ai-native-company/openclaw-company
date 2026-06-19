# Reusable Animation Variants

Production-ready animation presets for common patterns.

## Fade Variants

```tsx
export const fadeVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  }
}
```

## Scale Variants

```tsx
export const scaleVariants = {
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  },
  scaleInCenter: {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  },
  popIn: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    }
  }
}
```

## Slide Variants

```tsx
export const slideVariants = {
  slideInLeft: {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { x: "-100%", transition: { duration: 0.3 } }
  },
  slideInRight: {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { x: "100%", transition: { duration: 0.3 } }
  },
  slideInUp: {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { y: "100%", transition: { duration: 0.3 } }
  },
  slideInDown: {
    hidden: { y: "-100%" },
    visible: { y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { y: "-100%", transition: { duration: 0.3 } }
  }
}
```

## Page Transition Variants

```tsx
export const pageTransitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 }
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.3 }
  }
}
```

## Stagger Container Variants

```tsx
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}
```

## Stagger Item Variants

```tsx
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

export const staggerItemScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
}

export const staggerItemSlide = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
}
```

## Modal/Dialog Variants

```tsx
export const modalVariants = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },
  content: {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.95, y: 10 }
  },
  slideUp: {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25 } },
    exit: { opacity: 0, y: "100%" }
  }
}
```

## Button/Interactive Variants

```tsx
export const buttonVariants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.05 },
  disabled: { opacity: 0.5 }
}

export const cardHoverVariants = {
  rest: { scale: 1, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    transition: { duration: 0.2 }
  }
}

export const linkUnderlineVariants = {
  rest: { scaleX: 0, originX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.3 } }
}
```

## Loading/Skeleton Variants

```tsx
export const pulseVariants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 1.5, repeat: Infinity }
  }
}

export const spinnerVariants = {
  spin: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
}

export const dotsVariants = {
  container: {
    animate: {
      transition: { staggerChildren: 0.2 }
    }
  },
  dot: {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 0.6, repeat: Infinity }
    }
  }
}
```

## Scroll Reveal Variants

```tsx
export const scrollRevealVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 }
    }
  }
}
```

## Text Animation Variants

```tsx
export const textRevealVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  },
  char: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }
}

export const wordRevealVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  },
  word: {
    hidden: { opacity: 0, y: 20, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.4 }
    }
  }
}

export const lineRevealVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  },
  line: {
    hidden: { opacity: 0, y: 40, skewY: 3 },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.5 }
    }
  }
}
```

## Notification/Toast Variants

```tsx
export const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
}

export const toastSlideVariants = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", damping: 20 } },
  exit: { opacity: 0, x: 300 }
}
```

## Accordion/Collapse Variants

```tsx
export const accordionVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
}
```

## Menu/Navigation Variants

```tsx
export const menuVariants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.3 }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, staggerChildren: 0.07, delayChildren: 0.1 }
  }
}

export const menuItemVariants = {
  closed: { opacity: 0, x: 20 },
  open: { opacity: 1, x: 0 }
}

export const dropdownVariants = {
  closed: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 }
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2 }
  }
}
```
