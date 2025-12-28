'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal, Parallax } from '@/components/animations';
import { TESTIMONIALS_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks';
import type { Testimonial } from '@/types';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// Animation Configuration
// ============================================

const TESTIMONIALS_ANIMATION = {
  slide: {
    duration: 0.6,
    ease: [0.32, 0.72, 0, 1], // Custom smooth ease
  },
  autoPlay: {
    interval: 7000, // 7 seconds
  },
  swipe: {
    threshold: 50, // Minimum swipe distance
    velocity: 500, // Minimum velocity
  },
};

// ============================================
// Types
// ============================================

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  variant?: 'carousel' | 'grid' | 'stack';
  showRating?: boolean;
}

// ============================================
// Testimonials Section Component
// ============================================

export const TestimonialsSection = ({
  testimonials = TESTIMONIALS_DATA,
  variant = 'carousel',
  showRating = true,
}: TestimonialsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Drag gesture values
  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [-200, 0, 200], [-1, 0, 1]);

  // ============================================
  // Navigation Handlers
  // ============================================

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const handleDotClick = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const handleDotKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDotClick(index);
    }
  };

  // ============================================
  // Drag/Swipe Handler
  // ============================================

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;

    if (
      Math.abs(offset.x) > TESTIMONIALS_ANIMATION.swipe.threshold ||
      Math.abs(velocity.x) > TESTIMONIALS_ANIMATION.swipe.velocity
    ) {
      if (offset.x > 0 || velocity.x > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  // ============================================
  // Auto-play
  // ============================================

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    autoPlayRef.current = setInterval(handleNext, TESTIMONIALS_ANIMATION.autoPlay.interval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [handleNext, isPaused, prefersReducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // ============================================
  // Animation Variants
  // ============================================

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
    }),
  };

  const reducedMotionVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const variants = prefersReducedMotion ? reducedMotionVariants : slideVariants;

  // Current testimonial
  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black py-24 text-white md:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ============================================ */}
      {/* Background Elements */}
      {/* ============================================ */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900/50 to-black" />

        {/* Decorative shapes */}
        <Parallax speed={0.1} className="absolute -left-32 top-1/4">
          <div className="h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        </Parallax>
        <Parallax speed={0.15} className="absolute -right-32 bottom-1/4">
          <div className="h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        </Parallax>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                             linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container relative mx-auto px-6">
        {/* ============================================ */}
        {/* Section Header */}
        {/* ============================================ */}
        <Reveal className="mb-16 text-center md:mb-20">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.4em] text-gold">
            Testimonials
          </p>
          <h2 className="font-display text-4xl font-light text-white md:text-5xl lg:text-6xl">
            What Our Clients Say
          </h2>
        </Reveal>

        {/* ============================================ */}
        {/* Testimonial Carousel */}
        {/* ============================================ */}
        <div className="relative mx-auto max-w-5xl">
          {/* Large Quote Icon */}
          <div className="absolute -top-6 left-0 opacity-10 md:-top-8 md:left-8">
            <Quote
              size={120}
              className="text-gold"
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>

          {/* Content Container */}
          <div
            className="relative flex min-h-[350px] items-center justify-center px-4 md:min-h-[400px] md:px-20"
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
          >
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: TESTIMONIALS_ANIMATION.slide.duration,
                  ease: TESTIMONIALS_ANIMATION.slide.ease,
                }}
                drag={prefersReducedMotion ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{ x: dragX }}
                className="w-full cursor-grab active:cursor-grabbing"
                role="group"
                aria-roledescription="slide"
                aria-label={`Testimonial ${currentIndex + 1} of ${testimonials.length}`}
              >
                <div className="text-center">
                  {/* Rating Stars */}
                  {showRating && (
                    <div className="mb-8 flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="fill-gold text-gold"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  )}

                  {/* Quote */}
                  <blockquote className="mb-10 font-display text-2xl font-light leading-relaxed text-white md:text-3xl lg:text-4xl">
                    &ldquo;{currentTestimonial.content}&rdquo;
                  </blockquote>

                  {/* Author Info */}
                  <div className="space-y-2">
                    {/* Decorative line */}
                    <div className="mx-auto mb-6 h-px w-16 bg-gold/40" />

                    <p className="font-sans text-lg tracking-wide text-gold">
                      {currentTestimonial.author}
                    </p>
                    <p className="font-sans text-sm text-neutral-400">
                      {currentTestimonial.location}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-widest text-neutral-500">
                      {currentTestimonial.project}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ============================================ */}
          {/* Navigation Controls */}
          {/* ============================================ */}
          <div className="mt-12 flex items-center justify-center gap-8">
            {/* Previous Button */}
            <NavButton
              direction="prev"
              onClick={handlePrev}
              label="Previous testimonial"
            />

            {/* Pagination Dots */}
            <div className="flex items-center gap-3" role="tablist">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  onKeyDown={(e) => handleDotKeyDown(e, index)}
                  className="group relative p-1"
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to testimonial ${index + 1}`}
                  tabIndex={0}
                >
                  <span
                    className={cn(
                      'block h-2 rounded-full transition-all duration-500',
                      index === currentIndex
                        ? 'w-10 bg-gold'
                        : 'w-2 bg-neutral-700 group-hover:bg-neutral-500'
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Next Button */}
            <NavButton
              direction="next"
              onClick={handleNext}
              label="Next testimonial"
            />
          </div>

          {/* Progress Bar */}
          {!isPaused && !prefersReducedMotion && (
            <div className="mx-auto mt-8 h-0.5 max-w-xs overflow-hidden rounded-full bg-neutral-800">
              <motion.div
                className="h-full bg-gold"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: TESTIMONIALS_ANIMATION.autoPlay.interval / 1000,
                  ease: 'linear',
                  repeat: Infinity,
                }}
                key={currentIndex}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
};

// ============================================
// Navigation Button Component
// ============================================

interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  label: string;
}

const NavButton = ({ direction, onClick, label }: NavButtonProps) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'group flex h-14 w-14 items-center justify-center rounded-full',
        'border border-neutral-700 text-neutral-400',
        'transition-colors duration-300',
        'hover:border-gold hover:text-gold',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <Icon
        size={22}
        className={cn(
          'transition-transform duration-300',
          direction === 'prev'
            ? 'group-hover:-translate-x-0.5'
            : 'group-hover:translate-x-0.5'
        )}
        aria-hidden="true"
      />
    </motion.button>
  );
};

export default TestimonialsSection;
