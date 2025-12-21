'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/animations';
import { TESTIMONIALS_DATA } from '@/lib/constants';
import type { Testimonial } from '@/types';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialsSection = ({
  testimonials = TESTIMONIALS_DATA,
}: TestimonialsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleDotKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDotClick(index);
    }
  };

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(handleNext, 6000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [handleNext]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleMouseLeave = () => {
    autoPlayRef.current = setInterval(handleNext, 6000);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section className="overflow-hidden bg-black py-20 text-white md:py-28">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <Reveal className="mb-16 text-center">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">
            Testimonials
          </p>
          <h2 className="font-display text-4xl font-light text-white md:text-5xl">
            What Our Clients Say
          </h2>
        </Reveal>

        {/* Testimonial Carousel */}
        <div
          className="relative mx-auto max-w-4xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Quote Icon */}
          <div className="absolute -top-8 left-0 opacity-20 md:left-8">
            <Quote size={80} className="text-gold" aria-hidden="true" />
          </div>

          {/* Content */}
          <div className="relative flex min-h-[300px] items-center justify-center px-4 md:px-16">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
                className="text-center"
              >
                <blockquote className="mb-8 font-display text-2xl font-light leading-relaxed text-white md:text-3xl lg:text-4xl">
                  &ldquo;{testimonials[currentIndex].content}&rdquo;
                </blockquote>

                <div className="space-y-1">
                  <p className="font-sans tracking-wide text-gold">
                    {testimonials[currentIndex].author}
                  </p>
                  <p className="font-sans text-sm text-neutral-400">
                    {testimonials[currentIndex].location}
                  </p>
                  <p className="font-sans text-xs uppercase tracking-widest text-neutral-500">
                    {testimonials[currentIndex].project}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={handlePrev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-all duration-300 hover:border-gold hover:text-gold"
              aria-label="Previous testimonial"
              tabIndex={0}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  onKeyDown={(e) => handleDotKeyDown(e, index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-gold'
                      : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                  tabIndex={0}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-all duration-300 hover:border-gold hover:text-gold"
              aria-label="Next testimonial"
              tabIndex={0}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
