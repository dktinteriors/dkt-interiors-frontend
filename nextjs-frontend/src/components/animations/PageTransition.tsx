'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

// ============================================
// Animation Configuration
// ============================================

const TRANSITION_CONFIG = {
  // Duration in seconds
  duration: {
    enter: 0.8,       // Page entering
    exit: 0.5,        // Page exiting
    stagger: 0.08,    // Child element stagger
  },
  // Custom easing curves for luxury feel
  ease: {
    // Smooth deceleration - main transition
    smooth: [0.16, 1, 0.3, 1],
    // Quick start, smooth end - for exit
    exit: [0.4, 0, 0.2, 1],
    // Elegant overshoot - for special elements
    elegant: [0.34, 1.56, 0.64, 1],
  },
};

// ============================================
// Types
// ============================================

interface PageTransitionProps {
  children: ReactNode;
}

type TransitionVariant = 'fade' | 'slide' | 'scale' | 'elegant';

// ============================================
// Transition Variants
// ============================================

// Standard elegant fade with subtle movement
const elegantVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
    filter: 'blur(8px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: TRANSITION_CONFIG.duration.enter,
      ease: TRANSITION_CONFIG.ease.smooth,
      when: 'beforeChildren',
      staggerChildren: TRANSITION_CONFIG.duration.stagger,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.99,
    filter: 'blur(4px)',
    transition: {
      duration: TRANSITION_CONFIG.duration.exit,
      ease: TRANSITION_CONFIG.ease.exit,
    },
  },
};

// Slide transition - good for page hierarchies
const slideVariants = {
  initial: {
    opacity: 0,
    x: 60,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: TRANSITION_CONFIG.duration.enter,
      ease: TRANSITION_CONFIG.ease.smooth,
      when: 'beforeChildren',
      staggerChildren: TRANSITION_CONFIG.duration.stagger,
    },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: {
      duration: TRANSITION_CONFIG.duration.exit,
      ease: TRANSITION_CONFIG.ease.exit,
    },
  },
};

// Scale transition - dramatic reveal
const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    y: 40,
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: TRANSITION_CONFIG.duration.enter * 1.1,
      ease: TRANSITION_CONFIG.ease.smooth,
      when: 'beforeChildren',
      staggerChildren: TRANSITION_CONFIG.duration.stagger,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    transition: {
      duration: TRANSITION_CONFIG.duration.exit,
      ease: TRANSITION_CONFIG.ease.exit,
    },
  },
};

// Simple fade for reduced motion
const fadeVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: TRANSITION_CONFIG.duration.enter * 0.6,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TRANSITION_CONFIG.duration.exit * 0.6,
      ease: 'easeIn',
    },
  },
};

// Reduced motion variants
const reducedMotionVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// ============================================
// Variant Selector
// ============================================

const getVariants = (variant: TransitionVariant, prefersReducedMotion: boolean) => {
  if (prefersReducedMotion) {
    return reducedMotionVariants;
  }

  switch (variant) {
    case 'slide':
      return slideVariants;
    case 'scale':
      return scaleVariants;
    case 'fade':
      return fadeVariants;
    case 'elegant':
    default:
      return elegantVariants;
  }
};

// ============================================
// Route-based Variant Selection
// ============================================

const getVariantForRoute = (pathname: string): TransitionVariant => {
  // Portfolio detail pages - scale for dramatic reveal
  if (pathname.startsWith('/portfolio/') && pathname !== '/portfolio') {
    return 'scale';
  }

  // About page - slide for storytelling flow
  if (pathname === '/about') {
    return 'slide';
  }

  // Default elegant transition
  return 'elegant';
};

// ============================================
// Page Transition Component
// ============================================

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const prefersReducedMotion = useFramerReducedMotion();
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Determine transition variant based on route
  const variant = getVariantForRoute(pathname);
  const variants = getVariants(variant, prefersReducedMotion || false);

  // Skip initial animation on first page load
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return (
    <AnimatePresence mode="wait" initial={!isFirstRender}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        style={{
          // Ensure smooth rendering
          willChange: 'opacity, transform, filter',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// Page Transition with Overlay
// ============================================

interface PageTransitionWithOverlayProps {
  children: ReactNode;
  overlayColor?: string;
}

export const PageTransitionWithOverlay = ({
  children,
  overlayColor = '#d4af37',
}: PageTransitionWithOverlayProps) => {
  const pathname = usePathname();
  const prefersReducedMotion = useFramerReducedMotion();

  if (prefersReducedMotion) {
    return <PageTransition>{children}</PageTransition>;
  }

  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>
        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.5,
              delay: 0.4,
              ease: TRANSITION_CONFIG.ease.smooth,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.3,
              ease: TRANSITION_CONFIG.ease.exit,
            },
          }}
        >
          {children}
        </motion.div>

        {/* Transition Overlay - Wipes across screen */}
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999]"
          style={{ backgroundColor: overlayColor }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{
            scaleX: [0, 1, 1, 0],
            originX: [0, 0, 1, 1],
            transition: {
              duration: 0.8,
              times: [0, 0.4, 0.6, 1],
              ease: TRANSITION_CONFIG.ease.smooth,
            },
          }}
          exit={{
            scaleX: [0, 1],
            originX: 0,
            transition: {
              duration: 0.4,
              ease: TRANSITION_CONFIG.ease.exit,
            },
          }}
        />
      </div>
    </AnimatePresence>
  );
};

// ============================================
// Stagger Container for Child Animations
// ============================================

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const StaggerContainer = ({
  children,
  className,
  delay = 0,
}: StaggerContainerProps) => {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="enter"
      variants={{
        initial: {},
        enter: {
          transition: {
            staggerChildren: TRANSITION_CONFIG.duration.stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Stagger Item for Child Elements
// ============================================

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = ({ children, className }: StaggerItemProps) => {
  const prefersReducedMotion = useFramerReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        prefersReducedMotion
          ? {
              initial: { opacity: 0 },
              enter: { opacity: 1 },
            }
          : {
              initial: {
                opacity: 0,
                y: 20,
              },
              enter: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: TRANSITION_CONFIG.ease.smooth,
                },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Export configuration for use elsewhere
// ============================================

export { TRANSITION_CONFIG };
export default PageTransition;
