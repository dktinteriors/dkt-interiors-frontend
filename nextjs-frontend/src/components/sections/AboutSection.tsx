'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui';
import { Reveal, ImageReveal, Parallax, Magnetic, FadeSlide } from '@/components/animations';
import { useReducedMotion } from '@/hooks';
import { STATS } from '@/lib/constants';
import { ArrowRight, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// Animation Configuration
// ============================================

const ABOUT_ANIMATION = {
  stats: {
    duration: 1.2,
    stagger: 0.15,
    ease: 'expo.out',
  },
  counter: {
    duration: 2,
    ease: 'power2.out',
  },
  decorative: {
    duration: 0.8,
    ease: 'power3.out',
  },
};

// ============================================
// About Section Component
// ============================================

export const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // ============================================
  // Stats Animation with Number Counter
  // ============================================

  useEffect(() => {
    if (prefersReducedMotion) return;

    const stats = statsRef.current;
    if (!stats) return;

    const ctx = gsap.context(() => {
      const items = stats.querySelectorAll('.stat-item');
      const numbers = stats.querySelectorAll('.stat-number');

      // Fade in stats
      gsap.from(items, {
        y: 80,
        opacity: 0,
        stagger: ABOUT_ANIMATION.stats.stagger,
        duration: ABOUT_ANIMATION.stats.duration,
        ease: ABOUT_ANIMATION.stats.ease,
        scrollTrigger: {
          trigger: stats,
          start: 'top 85%',
          once: true,
        },
      });

      // Animate numbers counting up
      numbers.forEach((number) => {
        const target = number.getAttribute('data-value') || '0';
        const numericValue = parseInt(target.replace(/\D/g, ''), 10);
        const suffix = target.replace(/[0-9]/g, '');

        const counter = { value: 0 };

        gsap.to(counter, {
          value: numericValue,
          duration: ABOUT_ANIMATION.counter.duration,
          ease: ABOUT_ANIMATION.counter.ease,
          scrollTrigger: {
            trigger: number,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            (number as HTMLElement).textContent =
              Math.round(counter.value) + suffix;
          },
        });
      });
    }, stats);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // ============================================
  // Image Decorative Elements Animation
  // ============================================

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = imageContainerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Animate decorative frame
      const frame = container.querySelector('.decorative-frame');
      if (frame) {
        gsap.from(frame, {
          scale: 0.8,
          opacity: 0,
          duration: ABOUT_ANIMATION.decorative.duration,
          delay: 0.4,
          ease: ABOUT_ANIMATION.decorative.ease,
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            once: true,
          },
        });
      }

      // Animate experience badge
      const badge = container.querySelector('.experience-badge');
      if (badge) {
        gsap.from(badge, {
          scale: 0,
          rotation: -15,
          opacity: 0,
          duration: 0.6,
          delay: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            once: true,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cream py-24 md:py-32"
    >
      {/* ============================================ */}
      {/* Background Pattern */}
      {/* ============================================ */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* ============================================ */}
          {/* Image Column */}
          {/* ============================================ */}
          <div ref={imageContainerRef} className="relative order-2 lg:order-1">
            {/* Main Image */}
            <ImageReveal direction="left" overlay scale className="relative z-10">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/about-studio.jpg"
                  alt="DKT Interiors Studio - Interior Design workspace"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </ImageReveal>

            {/* Decorative Frame */}
            <div className="decorative-frame absolute -bottom-6 -right-6 -z-10 h-full w-full border border-gold/30" />

            {/* Experience Badge */}
            <Parallax speed={0.2} className="absolute -left-6 -top-6 z-20 md:-left-10 md:-top-10">
              <div className="experience-badge flex h-28 w-28 flex-col items-center justify-center bg-black text-center shadow-xl md:h-36 md:w-36">
                <span className="font-display text-3xl text-gold md:text-4xl">12+</span>
                <span className="mt-1 font-sans text-[10px] uppercase tracking-widest text-white/70 md:text-xs">
                  Years of
                  <br />
                  Excellence
                </span>
              </div>
            </Parallax>

            {/* Floating Accent */}
            <Parallax speed={0.35} className="absolute -bottom-4 right-12 z-20">
              <div className="h-16 w-16 rounded-full bg-gold/20 backdrop-blur-sm" />
            </Parallax>
          </div>

          {/* ============================================ */}
          {/* Content Column */}
          {/* ============================================ */}
          <div className="order-1 lg:order-2">
            {/* Eyebrow */}
            <Reveal direction="up" distance={30}>
              <p className="mb-5 font-sans text-xs uppercase tracking-[0.4em] text-gold">
                About DKT Interiors
              </p>
            </Reveal>

            {/* Headline */}
            <Reveal delay={0.1} direction="up" distance={40}>
              <h2 className="mb-8 font-display text-4xl font-light leading-tight text-black md:text-5xl">
                Crafting Spaces That{' '}
                <span className="italic text-gold">Inspire</span>
              </h2>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.2} direction="up" distance={30} blur>
              <p className="mb-6 font-sans text-lg leading-relaxed text-neutral-600">
                At DKT Interiors, we believe that exceptional design has the
                power to transform not just spaces, but lives. Our approach
                combines timeless elegance with contemporary functionality,
                creating environments that truly reflect who you are.
              </p>
            </Reveal>

            <Reveal delay={0.3} direction="up" distance={30} blur>
              <p className="mb-10 font-sans leading-relaxed text-neutral-500">
                Based in Flower Mound, Texas, we bring a fresh perspective to
                interior design. Every project is an opportunity to create
                something extraordinary—spaces that inspire daily and stand the
                test of time.
              </p>
            </Reveal>

            {/* Philosophy Points */}
            <Reveal delay={0.4} direction="up" distance={30}>
              <div className="mb-10 grid gap-6 sm:grid-cols-2">
                <PhilosophyPoint
                  title="Our Philosophy"
                  description="Quality over quantity—we curate spaces with intention, selecting each element for beauty and purpose."
                />
                <PhilosophyPoint
                  title="Our Process"
                  description="Collaborative and transparent, we guide you through every step of the design journey."
                />
              </div>
            </Reveal>

            {/* CTA Button */}
            <Reveal delay={0.5} direction="up" distance={20}>
              <Magnetic strength={0.12}>
                <Link href="/about">
                  <Button variant="primary" size="lg" className="group">
                    <span>Learn More About Us</span>
                    <ArrowRight
                      size={18}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        {/* ============================================ */}
        {/* Stats Section */}
        {/* ============================================ */}
        <div
          ref={statsRef}
          className="mt-24 border-t border-neutral-200/70 pt-20"
        >
          {/* Stats Header */}
          <Reveal className="mb-12 text-center">
            <p className="font-sans text-sm uppercase tracking-widest text-neutral-400">
              By The Numbers
            </p>
          </Reveal>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat, index) => (
              <StatItem
                key={stat.label}
                number={stat.number}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Bottom Decorative Element */}
      {/* ============================================ */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
};

// ============================================
// Philosophy Point Component
// ============================================

interface PhilosophyPointProps {
  title: string;
  description: string;
}

const PhilosophyPoint = ({ title, description }: PhilosophyPointProps) => {
  return (
    <div className="group">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-px w-6 bg-gold transition-all duration-300 group-hover:w-10" />
        <h4 className="font-display text-lg text-black">{title}</h4>
      </div>
      <p className="font-sans text-sm leading-relaxed text-neutral-500">
        {description}
      </p>
    </div>
  );
};

// ============================================
// Stat Item Component
// ============================================

interface StatItemProps {
  number: string;
  label: string;
  index: number;
}

const StatItem = ({ number, label, index }: StatItemProps) => {
  return (
    <div className="stat-item group text-center">
      {/* Number */}
      <span
        className="stat-number mb-3 block font-display text-4xl text-black transition-colors duration-300 group-hover:text-gold md:text-5xl lg:text-6xl"
        data-value={number}
      >
        0
      </span>

      {/* Label */}
      <span className="font-sans text-xs uppercase tracking-widest text-neutral-400 md:text-sm">
        {label}
      </span>

      {/* Underline accent */}
      <div className="mx-auto mt-4 h-px w-0 bg-gold transition-all duration-500 group-hover:w-12" />
    </div>
  );
};

export default AboutSection;
