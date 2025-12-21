'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui';
import { Reveal, Parallax, TextReveal } from '@/components/animations';
import { useReducedMotion } from '@/hooks';
import { ArrowDown } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export const HeroSection = ({
  title = 'Where less becomes MORE',
  subtitle = 'Creating sophisticated, modern interiors that reflect your unique style and enhance your daily life through thoughtful design and careful curation.',
}: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    // Parallax effect on scroll
    gsap.to(content, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  const handleScrollClick = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleScrollClick();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <Parallax speed={0.2}>
          <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-gold/5" />
        </Parallax>
        <Parallax speed={0.3}>
          <div className="absolute bottom-1/4 left-10 h-48 w-48 rounded-full bg-neutral-100" />
        </Parallax>
      </div>

      {/* Decorative Lines */}
      <div className="absolute left-1/4 top-0 h-1/3 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      <div className="absolute right-1/3 top-1/4 h-1/4 w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent" />

      {/* Content */}
      <div ref={contentRef} className="container relative z-10 mx-auto px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="mb-6 font-sans text-xs uppercase tracking-[0.3em] text-gold">
              Interior Design Studio
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mb-8 font-display text-5xl font-light text-black md:text-6xl lg:text-7xl">
              {title.split(' ').map((word, index) => (
                <span key={index}>
                  {word.toUpperCase() === 'MORE' ? (
                    <span className="italic text-gold">{word}</span>
                  ) : (
                    word
                  )}
                  {index < title.split(' ').length - 1 && ' '}
                </span>
              ))}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mb-12 max-w-2xl font-sans text-lg leading-relaxed text-neutral-600">
              {subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/portfolio">
                <Button variant="primary" size="lg">
                  View Our Work
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <Reveal delay={0.5}>
          <button
            onClick={handleScrollClick}
            onKeyDown={handleScrollKeyDown}
            className="group flex flex-col items-center gap-2 text-neutral-400 transition-colors hover:text-gold"
            aria-label="Scroll to portfolio section"
            tabIndex={0}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown
              size={20}
              className="animate-bounce"
              aria-hidden="true"
            />
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default HeroSection;
