'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui';
import { Reveal, Parallax, Magnetic, TextReveal, FadeSlide } from '@/components/animations';
import { useReducedMotion } from '@/hooks';
import { ArrowDown, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// Animation Configuration
// ============================================

const HERO_ANIMATION = {
  // Timing
  duration: {
    entrance: 1.2,      // Initial load animations
    parallax: 1.5,      // Background parallax
    decorative: 0.8,    // Lines and shapes
  },
  // Delays for staggered entrance
  delay: {
    eyebrow: 0.3,
    title: 0.5,
    subtitle: 0.8,
    cta: 1.0,
    scroll: 1.4,
    decorative: 0.2,
  },
  // Easing
  ease: {
    smooth: 'expo.out',
    elegant: 'power4.out',
    linear: 'none',
  },
};

// ============================================
// Types
// ============================================

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  showScrollIndicator?: boolean;
}

// ============================================
// Hero Section Component
// ============================================

export const HeroSection = ({
  title = 'Where less becomes MORE',
  subtitle = 'Creating sophisticated, modern interiors that reflect your unique style and enhance your daily life through thoughtful design and careful curation.',
  eyebrow = 'Interior Design Studio',
  showScrollIndicator = true,
}: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const decorativeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);

  // ============================================
  // Parallax & Scroll Effects
  // ============================================

  useEffect(() => {
    setIsLoaded(true);

    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    const decorative = decorativeRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Content parallax - moves up as you scroll down
      gsap.to(content, {
        yPercent: 35,
        opacity: 0.3,
        scale: 0.97,
        ease: HERO_ANIMATION.ease.linear,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8, // Smooth scrubbing
        },
      });

      // Decorative elements parallax - different speeds for depth
      if (decorative) {
        const shapes = decorative.querySelectorAll('.hero-shape');
        shapes.forEach((shape, index) => {
          gsap.to(shape, {
            yPercent: 20 + index * 15,
            rotation: index % 2 === 0 ? 5 : -5,
            ease: HERO_ANIMATION.ease.linear,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5 + index * 0.2,
            },
          });
        });

        // Animate decorative lines
        const lines = decorative.querySelectorAll('.hero-line');
        lines.forEach((line, index) => {
          gsap.to(line, {
            scaleY: 0,
            opacity: 0,
            ease: HERO_ANIMATION.ease.linear,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '50% top',
              scrub: true,
            },
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // ============================================
  // Entrance Animations
  // ============================================

  useEffect(() => {
    if (prefersReducedMotion || !isLoaded) return;

    const decorative = decorativeRef.current;
    if (!decorative) return;

    const ctx = gsap.context(() => {
      // Animate decorative lines drawing in
      const lines = decorative.querySelectorAll('.hero-line');
      gsap.fromTo(
        lines,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: HERO_ANIMATION.duration.decorative,
          delay: HERO_ANIMATION.delay.decorative,
          stagger: 0.15,
          ease: HERO_ANIMATION.ease.elegant,
        }
      );

      // Animate shapes fading in
      const shapes = decorative.querySelectorAll('.hero-shape');
      gsap.fromTo(
        shapes,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: HERO_ANIMATION.duration.entrance,
          delay: HERO_ANIMATION.delay.decorative + 0.3,
          stagger: 0.2,
          ease: HERO_ANIMATION.ease.smooth,
        }
      );
    }, decorative);

    return () => ctx.revert();
  }, [isLoaded, prefersReducedMotion]);

  // ============================================
  // Scroll Handler
  // ============================================

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

  // ============================================
  // Title Renderer with Accent Word
  // ============================================

  const renderTitle = () => {
    const words = title.split(' ');
    return words.map((word, index) => {
      const isAccent = word.toUpperCase() === 'MORE' || word.toUpperCase() === 'INSPIRE';
      return (
        <span key={index} className="inline-block overflow-hidden">
          <span
            className={`inline-block ${isAccent ? 'italic text-gold' : ''}`}
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(100%)',
              transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.5 + index * 0.08}s`,
            }}
          >
            {word}
          </span>
          {index < words.length - 1 && ' '}
        </span>
      );
    });
  };

  // ============================================
  // Render
  // ============================================

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white"
    >
      {/* ============================================ */}
      {/* Background Decorative Elements */}
      {/* ============================================ */}
      <div ref={decorativeRef} className="pointer-events-none absolute inset-0">
        {/* Floating Shapes */}
        <Parallax speed={0.15} className="absolute right-[10%] top-[20%]">
          <div className="hero-shape h-72 w-72 rounded-full bg-gradient-to-br from-gold/5 to-gold/10 blur-sm" />
        </Parallax>

        <Parallax speed={0.25} className="absolute bottom-[25%] left-[5%]">
          <div className="hero-shape h-56 w-56 rounded-full bg-neutral-100/80" />
        </Parallax>

        <Parallax speed={0.35} className="absolute right-[25%] top-[60%]">
          <div className="hero-shape h-32 w-32 rotate-45 border border-gold/20" />
        </Parallax>

        {/* Decorative Lines */}
        <div className="hero-line absolute left-[20%] top-0 h-[30%] w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="hero-line absolute right-[30%] top-[15%] h-[25%] w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent" />
        <div className="hero-line absolute bottom-[20%] left-[40%] h-[20%] w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ============================================ */}
      {/* Main Content */}
      {/* ============================================ */}
      <div ref={contentRef} className="container relative z-10 mx-auto px-6 text-center">
        <div className="mx-auto max-w-4xl">
          {/* Eyebrow */}
          <Reveal delay={HERO_ANIMATION.delay.eyebrow} direction="up" distance={30}>
            <div className="mb-8 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold/50" />
              <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold">
                {eyebrow}
              </p>
              <span className="h-px w-8 bg-gold/50" />
            </div>
          </Reveal>

          {/* Main Title */}
          <div className="mb-10">
            <h1 className="font-display text-5xl font-light leading-[1.1] text-black md:text-6xl lg:text-7xl xl:text-8xl">
              {renderTitle()}
            </h1>
          </div>

          {/* Subtitle */}
          <Reveal delay={HERO_ANIMATION.delay.subtitle} direction="up" distance={40} blur>
            <p className="mx-auto mb-14 max-w-2xl font-sans text-lg leading-relaxed text-neutral-500 md:text-xl">
              {subtitle}
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={HERO_ANIMATION.delay.cta} direction="up" distance={30}>
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
              <Magnetic strength={0.15}>
                <Link href="/portfolio">
                  <Button variant="primary" size="lg" className="group relative overflow-hidden">
                    <span className="relative z-10">View Our Work</span>
                    {/* Hover shine effect */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </Button>
                </Link>
              </Magnetic>

              <Magnetic strength={0.15}>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="group">
                    <span>Get In Touch</span>
                    <Sparkles
                      size={16}
                      className="ml-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ============================================ */}
      {/* Scroll Indicator */}
      {/* ============================================ */}
      {showScrollIndicator && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <Reveal delay={HERO_ANIMATION.delay.scroll} direction="up" distance={20}>
            <Magnetic strength={0.2}>
              <button
                onClick={handleScrollClick}
                onKeyDown={handleScrollKeyDown}
                className="group flex flex-col items-center gap-3 text-neutral-400 transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
                aria-label="Scroll to portfolio section"
                tabIndex={0}
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
                  Scroll
                </span>
                <div className="relative h-12 w-6 rounded-full border border-current p-1">
                  {/* Animated scroll dot */}
                  <span className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-current animate-[scrollBounce_2s_ease-in-out_infinite]" />
                </div>
              </button>
            </Magnetic>
          </Reveal>
        </div>
      )}

      {/* ============================================ */}
      {/* Bottom Decorative Line */}
      {/* ============================================ */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div
          className="h-full w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.5s',
          }}
        />
      </div>

      {/* ============================================ */}
      {/* Custom Animation Keyframes (added via style tag) */}
      {/* ============================================ */}
      <style jsx>{`
        @keyframes scrollBounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateX(-50%) translateY(16px);
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
