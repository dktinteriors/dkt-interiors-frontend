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
    limitCallbacks: true, // Only fire callbacks when needed
    ignoreMobileResize: true, // Prevent recalculation on mobile address bar hide/show
  });
}

// ============================================
// Animation Config - Elegant & Smooth
// ============================================

const ANIMATION = {
  duration: {
    fast: 0.5,
    normal: 0.7,
    slow: 1.0,
    reveal: 0.9,
  },
  ease: {
    smooth: 'power3.out',
    elegant: 'power2.out',
    reveal: 'power3.inOut',
  },
  stagger: {
    fast: 0.08,
    normal: 0.12,
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
  distance = 50,
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

    // Set initial state immediately
    gsap.set(element, { opacity: 0, x, y });

    // Create animation with ScrollTrigger
    const animation = gsap.to(element, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: ANIMATION.ease.smooth,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 85%', // Trigger when element is 85% from top of viewport
      onEnter: () => animation.play(),
      once: true, // Only trigger once - important for performance!
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, direction, distance, prefersReducedMotion]);

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
// Stagger Reveal - Beautiful cascading effect
// ============================================

interface StaggerRevealProps extends BaseAnimationProps {
  stagger?: number;
}

export const StaggerReveal = ({
  children,
  className,
  delay = 0,
  duration = ANIMATION.duration.normal,
  stagger = ANIMATION.stagger.normal,
}: StaggerRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const items = gsap.utils.toArray(container.children) as HTMLElement[];
    
    // Set initial state
    gsap.set(items, { opacity: 0, y: 40 });

    // Create staggered animation
    const animation = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger: {
        amount: stagger * items.length, // Total stagger time
        ease: 'power1.out',
      },
      ease: ANIMATION.ease.smooth,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      onEnter: () => animation.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, stagger, prefersReducedMotion]);

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
  tag?: keyof JSX.IntrinsicElements;
}

export const TextReveal = ({
  text,
  className,
  delay = 0,
  duration = ANIMATION.duration.fast,
  type = 'words',
  tag: Tag = 'p',
}: TextRevealProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const spans = gsap.utils.toArray(container.querySelectorAll('span')) as HTMLElement[];
    
    gsap.set(spans, { opacity: 0, y: 20, rotateX: -20 });

    const animation = gsap.to(spans, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration,
      delay,
      stagger: type === 'chars' ? 0.02 : 0.04,
      ease: ANIMATION.ease.smooth,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
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
          className="inline-block"
          style={{ opacity: 0, transformStyle: 'preserve-3d' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }

    return text.split(' ').map((word, index) => (
      <span
        key={index}
        className="inline-block"
        style={{ opacity: 0, transformStyle: 'preserve-3d' }}
      >
        {word}
        {index < text.split(' ').length - 1 && '\u00A0'}
      </span>
    ));
  };

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLElement>}
      className={className}
      style={{ perspective: '1000px' }}
    >
      {renderContent()}
    </Tag>
  );
};

// ============================================
// Parallax - Subtle, elegant depth effect
// ============================================

interface ParallaxProps extends BaseAnimationProps {
  speed?: number;
}

export const Parallax = ({
  children,
  className,
  speed = 0.3,
}: ParallaxProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    // Use transform for GPU acceleration
    gsap.to(element, {
      yPercent: speed * 30,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8, // Slight smoothing for elegance
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === element)
        .forEach((t) => t.kill());
    };
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
};

// ============================================
// Image Reveal - Luxurious curtain effect
// ============================================

interface ImageRevealProps extends BaseAnimationProps {
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const ImageReveal = ({
  children,
  className,
  delay = 0,
  duration = ANIMATION.duration.reveal,
  direction = 'left',
}: ImageRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const clipPaths: Record<string, { start: string; end: string }> = {
      left: { start: 'inset(0 100% 0 0)', end: 'inset(0 0% 0 0)' },
      right: { start: 'inset(0 0 0 100%)', end: 'inset(0 0 0 0%)' },
      up: { start: 'inset(100% 0 0 0)', end: 'inset(0% 0 0 0)' },
      down: { start: 'inset(0 0 100% 0)', end: 'inset(0 0 0% 0)' },
    };

    const { start, end } = clipPaths[direction];
    
    gsap.set(container, { clipPath: start });

    const animation = gsap.to(container, {
      clipPath: end,
      duration,
      delay,
      ease: ANIMATION.ease.reveal,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      onEnter: () => animation.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, direction, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={cn('overflow-hidden', className)}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden', className)}
      style={{ clipPath: 'inset(0 100% 0 0)' }}
    >
      {children}
    </div>
  );
};

// ============================================
// Magnetic - Playful hover interaction
// ============================================

interface MagneticProps extends BaseAnimationProps {
  strength?: number;
}

export const Magnetic = ({
  children,
  className,
  strength = 0.3,
}: MagneticProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    let bounds: DOMRect;

    const handleMouseEnter = () => {
      bounds = element.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;

      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className}>
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
}

export const ScaleOnScroll = ({
  children,
  className,
  startScale = 0.9,
  endScale = 1,
}: ScaleOnScrollProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    gsap.fromTo(
      element,
      { scale: startScale, opacity: 0.5 },
      {
        scale: endScale,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'top 60%',
          scrub: 0.5,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === element)
        .forEach((t) => t.kill());
    };
  }, [startScale, endScale, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
};

// ============================================
// Fade Slide - Simple but elegant
// ============================================

interface FadeSlideProps extends BaseAnimationProps {
  direction?: 'up' | 'down';
}

export const FadeSlide = ({
  children,
  className,
  delay = 0,
  duration = ANIMATION.duration.normal,
  direction = 'up',
}: FadeSlideProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    const y = direction === 'up' ? 30 : -30;
    
    gsap.set(element, { opacity: 0, y });

    const animation = gsap.to(element, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: ANIMATION.ease.elegant,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      onEnter: () => animation.play(),
      once: true,
    });

    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [delay, duration, direction, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};
