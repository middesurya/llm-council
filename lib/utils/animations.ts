/**
 * Animation Utilities for Framer Motion
 * Premium Design System: Neo-Technical Consilience
 */

import type { Variants, Transition } from "framer-motion";

// ============================================
// Transition Presets
// ============================================

export const transitions = {
  fast: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,

  base: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,

  slow: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,

  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  } as Transition,

  bounce: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10,
  } as Transition,
};

// ============================================
// Basic Animation Variants
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.base,
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.base,
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.base,
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.base,
  },
};

export const scaleInBounce: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.bounce,
  },
};

export const slideInUp: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.base,
  },
};

export const slideInDown: Variants = {
  hidden: {
    y: "-100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.base,
  },
};

// ============================================
// Container Variants (for staggering children)
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

// ============================================
// Premium Interaction Variants
// ============================================

export const hoverScale: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const hoverLift: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: transitions.base,
  },
};

export const hoverGlow: Variants = {
  rest: {
    boxShadow: "0 0 0 rgba(99, 102, 241, 0)",
  },
  hover: {
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
    transition: transitions.base,
  },
};

// ============================================
// Stage Transition Variants
// ============================================

export const stageTransition: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: transitions.slow,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: transitions.slow,
  }),
};

export const morphTransition: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: transitions.spring,
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: transitions.base,
  },
};

// ============================================
// Streaming & Real-Time Variants
// ============================================

export const streamingToken: Variants = {
  hidden: {
    opacity: 0,
    y: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

export const pulseGlow: Variants = {
  initial: {
    boxShadow: "0 0 0 rgba(34, 211, 238, 0)",
  },
  animate: {
    boxShadow: [
      "0 0 0 rgba(34, 211, 238, 0)",
      "0 0 20px rgba(34, 211, 238, 0.4)",
      "0 0 0 rgba(34, 211, 238, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const progressFill: Variants = {
  hidden: {
    width: "0%",
  },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

// ============================================
// Card & Component Variants
// ============================================

export const expertCard: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: transitions.fast,
  },
};

export const flipCard: Variants = {
  front: {
    rotateY: 0,
    transition: transitions.base,
  },
  back: {
    rotateY: 180,
    transition: transitions.base,
  },
};

// ============================================
// Form & Input Variants
// ============================================

export const formReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    height: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: transitions.base,
  },
};

export const floatingLabel: Variants = {
  unfocused: {
    y: 0,
    scale: 1,
    color: "var(--color-neutral-500)",
  },
  focused: {
    y: -24,
    scale: 0.85,
    color: "var(--color-primary-600)",
    transition: transitions.fast,
  },
};

export const inputFocus: Variants = {
  rest: {
    boxShadow: "0 0 0 0px rgba(99, 102, 241, 0)",
    borderColor: "var(--color-neutral-300)",
  },
  focus: {
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
    borderColor: "var(--color-primary-500)",
    transition: transitions.fast,
  },
};

// ============================================
// Success & Error States
// ============================================

export const successCheck: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        type: "spring",
        duration: 0.6,
        bounce: 0,
      },
      opacity: { duration: 0.01 },
    },
  },
};

export const errorShake: Variants = {
  initial: { x: 0 },
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
};

// ============================================
// Loading Variants
// ============================================

export const skeletonShimmer: Variants = {
  initial: {
    backgroundPosition: "-1000px 0",
  },
  animate: {
    backgroundPosition: "1000px 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const spinLoader: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ============================================
// Helper Functions
// ============================================

/**
 * Creates a stagger animation with custom delay
 */
export function createStagger(staggerDelay = 0.1, delayChildren = 0.05): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };
}

/**
 * Creates a custom fade-in with direction
 */
export function createFadeIn(
  direction: "up" | "down" | "left" | "right" = "up",
  distance = 20
): Variants {
  const value =
    direction === "up" || direction === "left" ? distance : -distance;

  if (direction === "up" || direction === "down") {
    return {
      hidden: {
        opacity: 0,
        y: value,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: transitions.base,
      },
    };
  } else {
    return {
      hidden: {
        opacity: 0,
        x: value,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: transitions.base,
      },
    };
  }
}

/**
 * Creates a custom scale animation
 */
export function createScale(
  initialScale = 0.9,
  useSpring = false
): Variants {
  return {
    hidden: {
      opacity: 0,
      scale: initialScale,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: useSpring ? transitions.spring : transitions.base,
    },
  };
}

/**
 * Respects user's motion preferences
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Returns simplified animation if user prefers reduced motion
 */
export function withReducedMotion<T extends Variants>(
  animation: T,
  fallback: Partial<T> = {}
): T {
  if (shouldReduceMotion()) {
    return {
      ...animation,
      ...fallback,
      transition: { duration: 0.01 },
    } as T;
  }
  return animation;
}
