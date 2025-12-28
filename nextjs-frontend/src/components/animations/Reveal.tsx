'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks';

// Register GSAP plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Configure ScrollTrigger for better performance
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });
}

// ============================================
// Animation Config - Luxurious & Refined
// ============================================
// These settings create a high-end, sophisticated feel
// suitable for an interior design portfolio

const ANIMATION = {
  duration: {
    fast: 0.6,      // Quick but not jarring
    normal: 0.9,    // Elegant standard timing
    slow: 1.2,      // Dramatic reveals
    reveal: 1.1,    // Image reveals - slightly longer for impact
    stagger: 1.4,   // Total time for staggered groups
  },
  ease: {
    // Primary easing - smooth deceleration with slight anticipation
    smooth: 'expo.out',
    
    // For text and content reveals - refined and controlled
    elegant: 'power4.out',
    
    // For image/mask reveals - dramatic wipe effect
    reveal: 'power3.inOut',
    
    // For hover returns - organic feel
    return: 'elastic.out(1, 0.4)',
    
    // For parallax - linear for smooth scrolling
    linear: 'none',
    
    // Custom bezier for ultra-smooth motion
    luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  stagger: {
    fast: 0.06,     // Quick cascade
    normal: 0.1,    // Standard stagger
    slow: 0.15,     // Dramatic cascade
    text: 0.03,     // For character animations
  },
  // Scroll trigger positions
  trigger: {
    start: 'top 88%',      // Start animation earlier for smoother feel
    imageStart: 'top 85%', // Images start slightly later
  },
};

// ============================================
// Types
// ============================================

interface BaseAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps extends BaseAnimationProps {
  direction?: RevealDirection;
  distance?: number;
  rotate?: boolean;      // Add subtle rotation for elegance
  scale?: boolean;       // Add subtle scale for depth
  blur?: boolean;        // Add blur fade for dreaminess
}

// ============================================
// Reveal Component - Elegant fade and slide
// ============================================

export const Reveal = ({
  children,
  className,
  delay = 0,
  duration = ANIMATION.duration.normal,
  direction = 'up',
  distance = 60,
  rotate = false,
  scale = false,
  blur = false,
}: RevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    const directionMap: Record<RevealDirection, { x: number; y: number }> = {
      up: { x: 0, y: distance },
      down: { x: 0, y: -distance },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
      none: { x: 0, y: 0 },
    };

    const { x, y } = directionMap[direction];

    // Build initial state with optional enhancements
    const initialState: gsap.TweenVars = {
      opacity: 0,
      x,
      y,
    };

    // Optional: subtle rotation for more organic motion
    if (rotate) {
      initialState.rotateY = direction === 'left' ? -8 : direction === 'right' ? 8 : 0;
      initialState.rotateX = direction === 'up' ? 8 : direction === 'down' ? -8 : 0;
    }

    // Optional: subtle scale for depth
    if (scale) {
      initialState.scale = 0.95;
    }

    // Optional: blur for dreamy effect
    if (blur) {
      initialState.filter = 'blur(10px)';
    }

    // Set initial state
    gsap.set(element, initialState);

    // Build animation target
    const animationTarget: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: ANIMATION.ease.elegant,
      paused: true,
    };

    if (rotate) {
      animationTarget.rotateY = 0;
      animationTarget.rotateX = 0;
    }

    if (scale) {
      animationTarget.scale = 1;
    }

    if (blur) {
      animationTarget.filter = 'blur(0px)';
    }

    // Create animation
    const animation = gsap.to(element, animationTarget);

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: ANIMATION.trigger.start,
      onEnter: () => animation.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, direction, distance, rotate, scale, blur, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: 0,
        perspective: rotate ? '1200px' : undefined,
        transformStyle: rotate ? 'preserve-3d' : undefined,
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// Stagger Reveal - Beautiful cascading effect
// ============================================

interface StaggerRevealProps extends BaseAnimationProps {
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  cascade?: 'start' | 'center' | 'end' | 'edges' | 'random'; // Stagger origin
}

export const StaggerReveal = ({
  children,
  className,
  delay = 0,
  duration = ANIMATION.duration.normal,
  stagger = ANIMATION.stagger.normal,
  direction = 'up',
  distance = 50,
  cascade = 'start',
}: StaggerRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const items = gsap.utils.toArray(container.children) as HTMLElement[];
    if (items.length === 0) return;

    const directionMap = {
      up: { x: 0, y: distance },
      down: { x: 0, y: -distance },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    };

    const { x, y } = directionMap[direction];

    // Set initial state
    gsap.set(items, {
      opacity: 0,
      x,
      y,
      scale: 0.97,
    });

    // Create staggered animation with configurable cascade origin
    const animation = gsap.to(items, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger: {
        each: stagger,
        from: cascade,
        ease: 'power2.out',
      },
      ease: ANIMATION.ease.smooth,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: ANIMATION.trigger.start,
      onEnter: () => animation.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, stagger, direction, distance, cascade, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// ============================================
// Text Reveal - Sophisticated word/character animation
// ============================================

type TextRevealType = 'words' | 'chars' | 'lines';

interface TextRevealProps extends BaseAnimationProps {
  type?: TextRevealType;
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  splitLines?: boolean; // For multi-line headings
}

export const TextReveal = ({
  text,
  className,
  delay = 0,
  duration = ANIMATION.duration.fast,
  type = 'words',
  as: Component = 'div',
  splitLines = false,
}: TextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const spans = gsap.utils.toArray(container.querySelectorAll('.text-reveal-item')) as HTMLElement[];
    if (spans.length === 0) return;

    // Initial state with 3D rotation for elegance
    gsap.set(spans, {
      opacity: 0,
      y: 30,
      rotateX: -45,
      transformOrigin: 'center bottom',
    });

    // Stagger timing based on type
    const staggerTime = type === 'chars' ? ANIMATION.stagger.text : ANIMATION.stagger.fast;

    const animation = gsap.to(spans, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration,
      delay,
      stagger: staggerTime,
      ease: ANIMATION.ease.elegant,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: ANIMATION.trigger.start,
      onEnter: () => animation.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, type, prefersReducedMotion]);

  const renderContent = () => {
    if (type === 'chars') {
      return text.split('').map((char, index) => (
        <span
          key={index}
          className="text-reveal-item inline-block"
          style={{ opacity: 0, transformStyle: 'preserve-3d' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }

    if (type === 'lines' || splitLines) {
      return text.split('\n').map((line, lineIndex) => (
        <span key={lineIndex} className="block overflow-hidden">
          <span
            className="text-reveal-item inline-block"
            style={{ opacity: 0, transformStyle: 'preserve-3d' }}
          >
            {line}
          </span>
        </span>
      ));
    }

    // Default: words
    return text.split(' ').map((word, index) => (
      <span key={index} className="inline-block overflow-hidden">
        <span
          className="text-reveal-item inline-block"
          style={{ opacity: 0, transformStyle: 'preserve-3d' }}
        >
          {word}
        </span>
        {index < text.split(' ').length - 1 && '\u00A0'}
      </span>
    ));
  };

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={{ perspective: '1000px' }}
    >
      {renderContent()}
    </Component>
  );
};

// ============================================
// Parallax - Subtle, elegant depth effect
// ============================================

interface ParallaxProps extends BaseAnimationProps {
  speed?: number;        // Parallax intensity (0.1 - 1)
  direction?: 'vertical' | 'horizontal';
  scrub?: number | boolean; // Smoothing amount
}

export const Parallax = ({
  children,
  className,
  speed = 0.3,
  direction = 'vertical',
  scrub = 0.8,
}: ParallaxProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    const movement = speed * 40; // Convert to percentage

    const animationProps =
      direction === 'vertical'
        ? { yPercent: movement }
        : { xPercent: movement };

    gsap.to(element, {
      ...animationProps,
      ease: ANIMATION.ease.linear,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrub,
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === element)
        .forEach((t) => t.kill());
    };
  }, [speed, direction, scrub, prefersReducedMotion]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

// ============================================
// Image Reveal - Luxurious curtain/wipe effect
// ============================================

type ImageRevealDirection = 'left' | 'right' | 'up' | 'down' | 'center';

interface ImageRevealProps extends BaseAnimationProps {
  direction?: ImageRevealDirection;
  overlay?: boolean;      // Add color overlay during reveal
  overlayColor?: string;  // Overlay color (default: gold)
  scale?: boolean;        // Subtle zoom during reveal
}

export const ImageReveal = ({
  children,
  className,
  delay = 0,
  duration = ANIMATION.duration.reveal,
  direction = 'left',
  overlay = true,
  overlayColor = '#d4af37',
  scale = true,
}: ImageRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const overlayEl = overlayRef.current;
    const content = contentRef.current;
    if (!container || prefersReducedMotion) return;

    // Clip path definitions for different directions
    const clipPaths: Record<ImageRevealDirection, { start: string; end: string }> = {
      left: { start: 'inset(0 100% 0 0)', end: 'inset(0 0% 0 0)' },
      right: { start: 'inset(0 0 0 100%)', end: 'inset(0 0 0 0%)' },
      up: { start: 'inset(100% 0 0 0)', end: 'inset(0% 0 0 0)' },
      down: { start: 'inset(0 0 100% 0)', end: 'inset(0 0 0% 0)' },
      center: { start: 'inset(50% 50% 50% 50%)', end: 'inset(0% 0% 0% 0%)' },
    };

    const { start, end } = clipPaths[direction];

    // Set initial states
    gsap.set(container, { clipPath: start });

    if (scale && content) {
      gsap.set(content, { scale: 1.15 });
    }

    // Create timeline for coordinated animation
    const tl = gsap.timeline({ paused: true });

    // Main reveal
    tl.to(container, {
      clipPath: end,
      duration,
      delay,
      ease: ANIMATION.ease.reveal,
    });

    // Scale animation (runs simultaneously)
    if (scale && content) {
      tl.to(
        content,
        {
          scale: 1,
          duration: duration * 1.2,
          ease: ANIMATION.ease.smooth,
        },
        delay
      );
    }

    // Overlay sweep (slightly faster)
    if (overlay && overlayEl) {
      tl.fromTo(
        overlayEl,
        { scaleX: 1 },
        {
          scaleX: 0,
          duration: duration * 0.6,
          ease: ANIMATION.ease.reveal,
          transformOrigin: direction === 'left' ? 'right' : 'left',
        },
        delay + duration * 0.3
      );
    }

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: ANIMATION.trigger.imageStart,
      onEnter: () => tl.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, [delay, duration, direction, overlay, scale, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={cn('overflow-hidden', className)}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ clipPath: 'inset(0 100% 0 0)' }}
    >
      <div ref={contentRef} className="h-full w-full">
        {children}
      </div>
      {overlay && (
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{ backgroundColor: overlayColor, opacity: 0.15 }}
        />
      )}
    </div>
  );
};

// ============================================
// Magnetic - Playful hover interaction
// ============================================

interface MagneticProps extends BaseAnimationProps {
  strength?: number;
  ease?: number; // Return ease duration
}

export const Magnetic = ({
  children,
  className,
  strength = 0.35,
  ease = 0.8,
}: MagneticProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    let bounds: DOMRect;
    let rafId: number;

    const handleMouseEnter = () => {
      bounds = element.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = e.clientX - bounds.left - bounds.width / 2;
        const y = e.clientY - bounds.top - bounds.height / 2;

        gsap.to(element, {
          x: x * strength,
          y: y * strength,
          rotation: x * 0.02, // Subtle rotation
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      gsap.to(element, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: ease,
        ease: ANIMATION.ease.return,
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, ease, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
};

// ============================================
// Scale On Scroll - Dramatic entrance
// ============================================

interface ScaleOnScrollProps extends BaseAnimationProps {
  startScale?: number;
  endScale?: number;
  startOpacity?: number;
  endOpacity?: number;
  scrub?: number | boolean;
}

export const ScaleOnScroll = ({
  children,
  className,
  startScale = 0.85,
  endScale = 1,
  startOpacity = 0.3,
  endOpacity = 1,
  scrub = 0.5,
}: ScaleOnScrollProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    gsap.fromTo(
      element,
      {
        scale: startScale,
        opacity: startOpacity,
      },
      {
        scale: endScale,
        opacity: endOpacity,
        ease: ANIMATION.ease.linear,
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'top 40%',
          scrub: scrub,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === element)
        .forEach((t) => t.kill());
    };
  }, [startScale, endScale, startOpacity, endOpacity, scrub, prefersReducedMotion]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
};

// ============================================
// Fade Slide - Simple but elegant
// ============================================

interface FadeSlideProps extends BaseAnimationProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

export const FadeSlide = ({
  children,
  className,
  delay = 0,
  duration = ANIMATION.duration.normal,
  direction = 'up',
  distance = 40,
  staggerChildren = false,
  staggerDelay = 0.1,
}: FadeSlideProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    const directionMap = {
      up: { x: 0, y: distance },
      down: { x: 0, y: -distance },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    };

    const { x, y } = directionMap[direction];

    const targets = staggerChildren
      ? gsap.utils.toArray(element.children)
      : [element];

    gsap.set(targets, { opacity: 0, x, y });

    const animation = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger: staggerChildren ? staggerDelay : 0,
      ease: ANIMATION.ease.smooth,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: ANIMATION.trigger.start,
      onEnter: () => animation.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, direction, distance, staggerChildren, staggerDelay, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

// ============================================
// Split Reveal - Text with line mask
// ============================================

interface SplitRevealProps extends BaseAnimationProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const SplitReveal = ({
  text,
  className,
  delay = 0,
  duration = ANIMATION.duration.normal,
  as: Component = 'div',
}: SplitRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const lines = container.querySelectorAll('.split-line');

    gsap.set(lines, { yPercent: 110 });

    const animation = gsap.to(lines, {
      yPercent: 0,
      duration,
      delay,
      stagger: 0.12,
      ease: ANIMATION.ease.elegant,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: ANIMATION.trigger.start,
      onEnter: () => animation.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const lines = text.split('\n');

  return (
    <Component ref={containerRef as React.RefObject<HTMLDivElement>} className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden">
          <span className="split-line block">{line}</span>
        </span>
      ))}
    </Component>
  );
};

// ============================================
// Hover Scale - Smooth scale on hover
// ============================================

interface HoverScaleProps extends BaseAnimationProps {
  scale?: number;
}

export const HoverScale = ({
  children,
  className,
  scale = 1.05,
}: HoverScaleProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: scale,
        duration: 0.5,
        ease: ANIMATION.ease.smooth,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.6,
        ease: ANIMATION.ease.smooth,
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [scale, prefersReducedMotion]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

// ============================================
// Export animation config for use elsewhere
// ============================================

export { ANIMATION };
